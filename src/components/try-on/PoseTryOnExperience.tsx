"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, RefreshCw, Download, Zap, AlertCircle } from "lucide-react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import toast from "react-hot-toast";

type Kit = {
  id: string;
  name: string;
  image: string;
  fallbackColor: string;
};

type Landmark = {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
};

type CropPreset = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type JerseyTransform = {
  centerX: number;
  centerY: number;
  drawWidth: number;
  drawHeight: number;
  angle: number;
  angleConfidence: number;
  confidence: number;
  timestamp: number;
};

const POSE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";

const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_HIP = 23;
const RIGHT_HIP = 24;
const MIRROR_FEED = true;
const MAX_TRACK_HOLD_MS = 480;
const MAX_ABS_TORSO_ANGLE = 0.42;
const MAX_DYNAMIC_ROTATION = 0.2;
const ROTATION_DEADBAND = 0.06;

const KIT_CROP_PRESETS: Record<string, CropPreset> = {
  home: { x: 0.23, y: 0.12, width: 0.55, height: 0.77 },
  away: { x: 0.23, y: 0.14, width: 0.54, height: 0.75 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeAngle(angle: number) {
  const twoPi = Math.PI * 2;
  let normalized = (angle + Math.PI) % twoPi;
  if (normalized < 0) normalized += twoPi;
  return normalized - Math.PI;
}

function shortestAngleDelta(from: number, to: number) {
  return normalizeAngle(to - from);
}

function distance(a: Landmark, b: Landmark) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: Landmark, b: Landmark): Landmark {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
}

function blend(a: Landmark, b: Landmark, t: number): Landmark {
  return {
    x: a.x * (1 - t) + b.x * t,
    y: a.y * (1 - t) + b.y * t,
  };
}

function blendNumber(a: number, b: number, t: number) {
  return a * (1 - t) + b * t;
}

function getContainMetrics(video: HTMLVideoElement, width: number, height: number) {
  const videoAspect = video.videoWidth / video.videoHeight;
  const containerAspect = width / height;

  if (videoAspect > containerAspect) {
    const renderWidth = width;
    const renderHeight = width / videoAspect;
    return {
      renderWidth,
      renderHeight,
      offsetX: 0,
      offsetY: (height - renderHeight) / 2,
    };
  }

  const renderHeight = height;
  const renderWidth = height * videoAspect;
  return {
    renderWidth,
    renderHeight,
    offsetX: (width - renderWidth) / 2,
    offsetY: 0,
  };
}

function resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = Math.max(window.devicePixelRatio || 1, 1);
  const nextWidth = Math.round(width * dpr);
  const nextHeight = Math.round(height * dpr);

  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function drawGuide(ctx: CanvasRenderingContext2D, metrics: ReturnType<typeof getContainMetrics>) {
  const x = metrics.offsetX + metrics.renderWidth * 0.28;
  const y = metrics.offsetY + metrics.renderHeight * 0.16;
  const width = metrics.renderWidth * 0.44;
  const height = metrics.renderHeight * 0.56;

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.strokeRect(x, y, width, height);
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

function computeJerseyTransform(
  pose: Landmark[],
  metrics: ReturnType<typeof getContainMetrics>,
  timestamp: number
): JerseyTransform | null {
  const leftShoulder = pose[LEFT_SHOULDER];
  const rightShoulder = pose[RIGHT_SHOULDER];
  const leftHip = pose[LEFT_HIP];
  const rightHip = pose[RIGHT_HIP];

  if (!leftShoulder || !rightShoulder) return null;

  const shoulderVisibility = Math.min(leftShoulder.visibility ?? 1, rightShoulder.visibility ?? 1);
  if (shoulderVisibility < 0.5) return null;

  const smoothedPose = pose.map((point, index) => {
    const left = pose[Math.max(index - 1, 0)] ?? point;
    const right = pose[Math.min(index + 1, pose.length - 1)] ?? point;
    return blend(point, midpoint(left, right), 0.18);
  });

  const smoothLeftShoulder = smoothedPose[LEFT_SHOULDER] ?? leftShoulder;
  const smoothRightShoulder = smoothedPose[RIGHT_SHOULDER] ?? rightShoulder;
  const smoothLeftHip = smoothedPose[LEFT_HIP] ?? leftHip;
  const smoothRightHip = smoothedPose[RIGHT_HIP] ?? rightHip;

  const shoulderCenter = midpoint(smoothLeftShoulder, smoothRightShoulder);
  const shoulderWidth = distance(smoothLeftShoulder, smoothRightShoulder);
  const normalizedShoulderWidth = shoulderWidth;
  if (normalizedShoulderWidth < 0.11) return null;

  const shoulderAngle = Math.atan2(
    smoothRightShoulder.y - smoothLeftShoulder.y,
    smoothRightShoulder.x - smoothLeftShoulder.x
  );

  const hasHips =
    smoothLeftHip &&
    smoothRightHip &&
    (smoothLeftHip.visibility ?? 1) > 0.3 &&
    (smoothRightHip.visibility ?? 1) > 0.3;

  const hipCenter = hasHips
    ? midpoint(smoothLeftHip, smoothRightHip)
    : { x: shoulderCenter.x, y: shoulderCenter.y + shoulderWidth * 1.65 };
  const hipWidth = hasHips ? distance(smoothLeftHip, smoothRightHip) : shoulderWidth;
  const hipVisibility = Math.min(smoothLeftHip?.visibility ?? 0.42, smoothRightHip?.visibility ?? 0.42);
  const torsoHeight = Math.max(distance(shoulderCenter, hipCenter), shoulderWidth * 1.45);

  const hipAngle = hasHips
    ? Math.atan2(smoothRightHip.y - smoothLeftHip.y, smoothRightHip.x - smoothLeftHip.x)
    : shoulderAngle;
  const rawTorsoAngle = shoulderAngle * 0.86 + hipAngle * 0.14;
  const shoulderHipDelta = Math.abs(shortestAngleDelta(shoulderAngle, hipAngle));
  const angleAgreement = 1 - clamp(shoulderHipDelta / 0.55, 0, 1);
  const angleConfidence = clamp(shoulderVisibility * 0.6 + hipVisibility * 0.2 + angleAgreement * 0.2, 0, 1);

  let torsoAngle = clamp(rawTorsoAngle, -MAX_DYNAMIC_ROTATION, MAX_DYNAMIC_ROTATION);
  if (Math.abs(torsoAngle) < ROTATION_DEADBAND) {
    torsoAngle = 0;
  }
  if (angleConfidence < 0.72) {
    torsoAngle = 0;
  }

  torsoAngle = clamp(torsoAngle, -MAX_ABS_TORSO_ANGLE, MAX_ABS_TORSO_ANGLE);

  const normalizedCenterX = MIRROR_FEED ? 1 - shoulderCenter.x : shoulderCenter.x;
  const normalizedHipCenterX = MIRROR_FEED ? 1 - hipCenter.x : hipCenter.x;

  const centerX = metrics.offsetX + ((normalizedCenterX + normalizedHipCenterX) / 2) * metrics.renderWidth;
  const centerY = metrics.offsetY + ((shoulderCenter.y + hipCenter.y) / 2) * metrics.renderHeight;
  const torsoWidth = Math.max(shoulderWidth * 1.7, hipWidth * 1.35);
  const drawWidth = clamp(
    torsoWidth * metrics.renderWidth,
    metrics.renderWidth * 0.28,
    metrics.renderWidth * 0.68
  );
  const drawHeight = clamp(
    torsoHeight * metrics.renderHeight * 1.78,
    metrics.renderHeight * 0.4,
    metrics.renderHeight * 0.88
  );

  const confidence = clamp(shoulderVisibility * 0.85 + hipVisibility * 0.15, 0, 1);

  return {
    centerX,
    centerY,
    drawWidth,
    drawHeight,
    angle: normalizeAngle(torsoAngle),
    angleConfidence,
    confidence,
    timestamp,
  };
}

function stabilizeTransform(
  previous: JerseyTransform | null,
  next: JerseyTransform,
  metrics: ReturnType<typeof getContainMetrics>
): JerseyTransform {
  if (!previous) return next;

  const dt = clamp((next.timestamp - previous.timestamp) / 1000, 1 / 120, 1 / 18);
  const frameScale = dt * 60;

  if (next.timestamp - previous.timestamp > MAX_TRACK_HOLD_MS) {
    return next;
  }

  const movementLimit = metrics.renderWidth * 0.09 * frameScale;
  const widthLimit = metrics.renderWidth * 0.065 * frameScale;
  const heightLimit = metrics.renderHeight * 0.09 * frameScale;

  const targetCenterX = clamp(next.centerX, previous.centerX - movementLimit, previous.centerX + movementLimit);
  const targetCenterY = clamp(next.centerY, previous.centerY - movementLimit, previous.centerY + movementLimit);
  const targetWidth = clamp(next.drawWidth, previous.drawWidth - widthLimit, previous.drawWidth + widthLimit);
  const targetHeight = clamp(next.drawHeight, previous.drawHeight - heightLimit, previous.drawHeight + heightLimit);

  const angleDelta = shortestAngleDelta(previous.angle, next.angle);
  const maxAngleStep = 0.024 * frameScale;
  const boundedAngleDelta = clamp(angleDelta, -maxAngleStep, maxAngleStep);
  const boundedAngle = normalizeAngle(previous.angle + boundedAngleDelta);

  const confidenceFactor = clamp(next.confidence, 0.42, 0.95);
  const alpha = clamp(0.1 + confidenceFactor * 0.16, 0.1, 0.22);

  const unstableSpin =
    Math.abs(angleDelta) > 0.2 &&
    (next.confidence < 0.86 || next.angleConfidence < 0.8);
  const shouldLockRotation = next.angleConfidence < 0.74;
  const stabilizedAngle = unstableSpin || shouldLockRotation
    ? previous.angle
    : normalizeAngle(blendNumber(previous.angle, boundedAngle, alpha * 0.7));

  return {
    centerX: blendNumber(previous.centerX, targetCenterX, alpha),
    centerY: blendNumber(previous.centerY, targetCenterY, alpha),
    drawWidth: blendNumber(previous.drawWidth, targetWidth, alpha),
    drawHeight: blendNumber(previous.drawHeight, targetHeight, alpha),
    angle: stabilizedAngle,
    angleConfidence: blendNumber(previous.angleConfidence, next.angleConfidence, alpha),
    confidence: blendNumber(previous.confidence, next.confidence, alpha),
    timestamp: next.timestamp,
  };
}

function drawJersey(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: JerseyTransform,
  kitId: string
) {
  const drawX = -transform.drawWidth / 2;
  const drawY = -transform.drawHeight * 0.5;
  const crop = KIT_CROP_PRESETS[kitId] ?? { x: 0.2, y: 0.14, width: 0.6, height: 0.78 };
  const sx = image.width * crop.x;
  const sy = image.height * crop.y;
  const sWidth = image.width * crop.width;
  const sHeight = image.height * crop.height;

  ctx.save();
  ctx.translate(transform.centerX, transform.centerY);
  ctx.rotate(transform.angle);

  // Clip to a torso-shaped matte to suppress square background bleed from source kit images.
  ctx.beginPath();
  ctx.moveTo(-transform.drawWidth * 0.28, -transform.drawHeight * 0.46);
  ctx.lineTo(transform.drawWidth * 0.28, -transform.drawHeight * 0.46);
  ctx.lineTo(transform.drawWidth * 0.4, -transform.drawHeight * 0.2);
  ctx.lineTo(transform.drawWidth * 0.36, transform.drawHeight * 0.44);
  ctx.lineTo(-transform.drawWidth * 0.36, transform.drawHeight * 0.44);
  ctx.lineTo(-transform.drawWidth * 0.4, -transform.drawHeight * 0.2);
  ctx.closePath();
  ctx.clip();

  ctx.globalAlpha = 0.94;
  ctx.drawImage(image, sx, sy, sWidth, sHeight, drawX, drawY, transform.drawWidth, transform.drawHeight);
  ctx.restore();

  return true;
}

export function PoseTryOnExperience({ selectedKit }: { selectedKit: Kit }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const snapshotCanvasRef = useRef<HTMLCanvasElement>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastInferenceRef = useRef(0);
  const lastPoseRef = useRef<Landmark[] | null>(null);
  const stableTransformRef = useRef<JerseyTransform | null>(null);
  const lastPoseSeenRef = useRef(0);
  const kitImageRef = useRef<HTMLImageElement | null>(null);
  const isLoopActiveRef = useRef(false);
  const detectionFailedRef = useRef(false);
  const lastVideoTimeRef = useRef(-1);
  const nextDetectAllowedAtRef = useRef(0);
  const detectErrorStreakRef = useRef(0);

  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [status, setStatus] = useState("Ready when you are");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const statusRef = useRef("Ready when you are");

  const updateStatus = (nextStatus: string) => {
    if (statusRef.current === nextStatus) return;
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  };

  useEffect(() => {
    let cancelled = false;

    const loadModel = async () => {
      try {
        setModelError("");
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: POSE_MODEL_URL,
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.55,
          minPosePresenceConfidence: 0.55,
          minTrackingConfidence: 0.55,
        });

        if (cancelled) return;

        poseLandmarkerRef.current = landmarker;
        setModelReady(true);
        updateStatus("Pose model loaded");
      } catch (error) {
        if (!cancelled) {
          console.error("Pose model load failed:", error);
          setModelError("AR model could not load.");
          toast.error("Could not load the AR model.");
        }
      }
    };

    loadModel();

    return () => {
      cancelled = true;
      try {
        poseLandmarkerRef.current?.close();
      } catch {
        // Ignore close errors during teardown.
      }
      poseLandmarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const image = new Image();
    image.src = selectedKit.image;
    image.onload = () => {
      kitImageRef.current = image;
      stableTransformRef.current = null;
    };
  }, [selectedKit.image]);

  useEffect(() => {
    return () => {
      isLoopActiveRef.current = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!isCameraActive || !modelReady) return;

    const video = videoRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!video || !overlayCanvas || !poseLandmarkerRef.current) return;

    isLoopActiveRef.current = true;

    const loop = (now: number) => {
      if (!isLoopActiveRef.current) return;

      const currentVideo = videoRef.current;
      const currentCanvas = overlayCanvasRef.current;
      const landmarker = poseLandmarkerRef.current;

      if (!currentVideo || !currentCanvas || !landmarker || currentVideo.readyState < 2 || !currentVideo.videoWidth) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      const containerWidth = currentCanvas.clientWidth;
      const containerHeight = currentCanvas.clientHeight;
      const ctx = resizeCanvas(currentCanvas, containerWidth, containerHeight);
      if (!ctx) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      const shouldInfer = now - lastInferenceRef.current > 50;
      const canRunDetection = now >= nextDetectAllowedAtRef.current;
      if (shouldInfer && canRunDetection) {
        const hasFreshFrame = currentVideo.currentTime > lastVideoTimeRef.current + 0.0001;

        if (!hasFreshFrame || currentVideo.paused || currentVideo.ended) {
          frameRef.current = requestAnimationFrame(loop);
          return;
        }

        try {
          const safeTimestamp = Math.max(now, lastInferenceRef.current + 1);
          const result = landmarker.detectForVideo(currentVideo, safeTimestamp);
          const pose = result.landmarks?.[0] || null;
          lastInferenceRef.current = safeTimestamp;
          lastVideoTimeRef.current = currentVideo.currentTime;
          nextDetectAllowedAtRef.current = safeTimestamp + 34;
          detectErrorStreakRef.current = 0;
          detectionFailedRef.current = false;

          if (pose) {
            lastPoseRef.current = pose;
            lastPoseSeenRef.current = now;
            updateStatus("Tracking shoulders and torso");
          } else {
            updateStatus("Step into frame and keep shoulders visible");
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          detectErrorStreakRef.current += 1;
          const streak = detectErrorStreakRef.current;
          const backoffMs = clamp(80 * streak, 80, 600);
          nextDetectAllowedAtRef.current = now + backoffMs;

          // Skip noisy transient failures and quietly recover on the next valid frame.
          detectionFailedRef.current = true;
          updateStatus(message.includes("timestamp") ? "Tracker syncing" : "Tracker recalibrating");
        }
      }

      const pose = lastPoseRef.current && now - lastPoseSeenRef.current < 1000 ? lastPoseRef.current : null;
      ctx.clearRect(0, 0, containerWidth, containerHeight);
      const metrics = getContainMetrics(currentVideo, containerWidth, containerHeight);

      if (pose && kitImageRef.current) {
        const nextTransform = computeJerseyTransform(pose, metrics, now);
        const canUsePrevious =
          stableTransformRef.current && now - stableTransformRef.current.timestamp < MAX_TRACK_HOLD_MS;
        const transform = nextTransform
          ? stabilizeTransform(stableTransformRef.current, nextTransform, metrics)
          : canUsePrevious
            ? stableTransformRef.current
            : null;

        if (transform) {
          stableTransformRef.current = transform;
        }

        const matched = !!transform && drawJersey(ctx, kitImageRef.current, transform, selectedKit.id);

        if (!matched) {
          drawGuide(ctx, metrics);
        }
      } else {
        const canUsePrevious =
          stableTransformRef.current && now - stableTransformRef.current.timestamp < MAX_TRACK_HOLD_MS;

        if (canUsePrevious && kitImageRef.current && stableTransformRef.current) {
          drawJersey(ctx, kitImageRef.current, stableTransformRef.current, selectedKit.id);
        } else {
          stableTransformRef.current = null;
          drawGuide(ctx, metrics);
        }
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      isLoopActiveRef.current = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isCameraActive, modelReady, selectedKit.id]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        toast.error("Camera is not available in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
        detectErrorStreakRef.current = 0;
        nextDetectAllowedAtRef.current = 0;
        lastVideoTimeRef.current = -1;
        setHasPermission(true);
        setIsCameraActive(true);
        setCapturedImage(null);
        updateStatus(modelReady ? "Camera active" : "Preparing AR model...");
      }
    } catch (error) {
      console.error("Camera error:", error);
      setHasPermission(false);
      toast.error("Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    lastPoseRef.current = null;
    stableTransformRef.current = null;
    detectErrorStreakRef.current = 0;
    nextDetectAllowedAtRef.current = 0;
    lastVideoTimeRef.current = -1;
    setIsCameraActive(false);
  };

  const captureSnapshot = () => {
    const video = videoRef.current;
    const snapshotCanvas = snapshotCanvasRef.current;
    const image = kitImageRef.current;

    if (!video || !snapshotCanvas || !image || !lastPoseRef.current) {
      toast.error("Move into frame so the AR tracker can detect your body.");
      return;
    }

    const width = 1280;
    const height = 720;
    const ctx = snapshotCanvas.getContext("2d");
    if (!ctx) return;

    snapshotCanvas.width = width;
    snapshotCanvas.height = height;

    const metrics = getContainMetrics(video, width, height);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(video, metrics.offsetX, metrics.offsetY, metrics.renderWidth, metrics.renderHeight);

    const transform = stableTransformRef.current ?? computeJerseyTransform(lastPoseRef.current, metrics, performance.now());

    if (!transform) {
      toast.error("Tracker lost lock. Hold still and try again.");
      return;
    }

    drawJersey(ctx, image, transform, selectedKit.id);

    const dataUrl = snapshotCanvas.toDataURL("image/png");
    setCapturedImage(dataUrl);
    stopCamera();
    toast.success("Snapshot captured");
  };

  const retryCamera = () => {
    setCapturedImage(null);
    startCamera();
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    const link = document.createElement("a");
    link.href = capturedImage;
    link.download = `eraflex-ar-tryon-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (capturedImage) {
    return (
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden min-h-[60vh] lg:min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-3xl aspect-[3/4] md:aspect-video rounded-3xl overflow-hidden shadow-2xl bg-brand-surface border border-white/10"
        >
          <img src={capturedImage} alt="AR Snapshot" className="w-full h-full object-contain bg-black" />

          <div className="absolute bottom-6 inset-x-0 flex justify-center gap-4">
            <button
              onClick={retryCamera}
              className="bg-black/50 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> RETAKE
            </button>
            <button
              onClick={downloadImage}
              className="bg-brand-accent text-white px-6 py-3 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-[0_5px_20px_rgba(255,0,85,0.4)]"
            >
              <Download className="w-4 h-4" /> SAVE IMAGE
            </button>
          </div>
        </motion.div>
        <canvas ref={snapshotCanvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden min-h-[60vh] lg:min-h-0">
      {(hasPermission === false || modelError) && !capturedImage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20 bg-brand-dark/95 backdrop-blur-md">
          <Camera className="w-16 h-16 text-white/20 mb-4" />
          <h2 className="font-display text-3xl uppercase mb-2">AR Viewer Unavailable</h2>
          <p className="font-indian text-xs text-gray-400 tracking-widest uppercase max-w-sm mb-6">
            {modelError || "We need camera access to track your body and fit the jersey to your torso."}
          </p>
          <button
            onClick={startCamera}
            className="bg-white text-black px-8 py-3 font-bold text-sm tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-all rounded-md"
          >
            REQUEST ACCESS
          </button>
        </div>
      )}

      {hasPermission === null && !capturedImage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <button
            onClick={startCamera}
            className="bg-brand-accent text-white w-32 h-32 rounded-full flex flex-col items-center justify-center hover:scale-105 hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_50px_rgba(255,0,85,0.3)] group"
          >
            <Camera className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-black text-[10px] tracking-widest uppercase">START LENS</span>
          </button>
        </div>
      )}

      <div className={`relative w-full max-w-3xl aspect-[3/4] md:aspect-video rounded-3xl overflow-hidden shadow-2xl transition-opacity duration-1000 ${isCameraActive ? "opacity-100" : "opacity-0 hidden"}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-contain bg-black ${MIRROR_FEED ? "-scale-x-100" : ""}`}
        />

        <canvas
          ref={overlayCanvasRef}
          className={`absolute inset-0 w-full h-full pointer-events-none ${MIRROR_FEED ? "-scale-x-100" : ""}`}
        />

        <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-6">
          <div className="flex justify-between items-start">
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
              <span className="font-indian text-[10px] font-bold tracking-widest uppercase">{status}</span>
            </div>
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-brand-gold" />
              <span className="font-indian text-[10px] font-bold tracking-widest uppercase">
                Fit: torso + shoulders
              </span>
            </div>
          </div>

          <div className="flex justify-center pb-4 pointer-events-auto">
            <button
              onClick={captureSnapshot}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-110 hover:bg-white/20 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-white/50 group-hover:bg-white transition-colors flex items-center justify-center">
                <Zap className="w-6 h-6 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <canvas ref={snapshotCanvasRef} className="hidden" />
    </div>
  );
}