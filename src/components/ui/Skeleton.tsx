"use client";

import { cn } from "@/lib/utils";

export const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "animate-pulse rounded-2xl bg-white/5",
      className
    )}
  />
);

export const CardSkeleton = () => (
  <div className="bg-brand-surface rounded-3xl border border-white/5 overflow-hidden">
    <Skeleton className="aspect-[4/5] rounded-none" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-4 w-1/4 mt-4" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-white/5">
    <td className="p-5"><Skeleton className="h-4 w-24" /></td>
    <td className="p-5"><Skeleton className="h-4 w-32" /></td>
    <td className="p-5"><Skeleton className="h-4 w-40" /></td>
    <td className="p-5"><Skeleton className="h-4 w-20" /></td>
    <td className="p-5"><Skeleton className="h-4 w-16" /></td>
    <td className="p-5"><Skeleton className="h-6 w-24 rounded-full" /></td>
  </tr>
);

export const StatSkeleton = () => (
  <div className="bg-brand-surface border border-white/5 p-6 rounded-2xl">
    <Skeleton className="h-3 w-24 mb-4" />
    <Skeleton className="h-10 w-32 mb-2" />
    <Skeleton className="h-4 w-16" />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-black/30 p-8 rounded-2xl border border-white/5 space-y-6">
        <Skeleton className="h-3 w-24" />
        <div className="space-y-4">
          <div><Skeleton className="h-3 w-16 mb-2" /><Skeleton className="h-6 w-40" /></div>
          <div><Skeleton className="h-3 w-16 mb-2" /><Skeleton className="h-6 w-48" /></div>
          <div><Skeleton className="h-3 w-16 mb-2" /><Skeleton className="h-6 w-28" /></div>
        </div>
      </div>
      <div className="bg-black/30 p-8 rounded-2xl border border-white/5 space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  </div>
);
