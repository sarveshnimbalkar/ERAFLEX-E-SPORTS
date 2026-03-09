import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-brand-dark border-t border-white/5 py-10 md:py-12 px-4 md:px-6 lg:px-12 mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-accent flex items-center justify-center font-display text-lg md:text-2xl italic font-black">
              E
            </div>
            <span className="font-display text-2xl md:text-3xl tracking-wider">
              ERA<span className="text-brand-accent">FLEX</span>
            </span>
          </Link>
          <p className="text-gray-400 max-w-sm mb-4 md:mb-6 font-indian tracking-wide text-sm">
            Elite performance gear for the professional athlete. Engineered for
            speed, designed for style, and built for glory.
          </p>
          <div className="flex gap-3">
            {["instagram", "twitter", "facebook", "youtube"].map((social) => (
              <a
                key={social}
                href="#"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 text-xs uppercase font-bold"
              >
                {social[0].toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg md:text-xl italic mb-4 md:mb-6">EXPLORE</h4>
          <ul className="space-y-3 md:space-y-4 text-gray-400 font-indian tracking-widest text-xs md:text-sm">
            <li>
              <Link href="/shop" className="hover:text-white transition-colors">
                COLLECTIONS
              </Link>
            </li>
            <li>
              <Link href="/trending" className="hover:text-white transition-colors">
                TRENDING NOW
              </Link>
            </li>
            <li>
              <Link href="/customize" className="hover:text-white transition-colors">
                CUSTOM BUILDER
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                MY ACCOUNT
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg md:text-xl italic mb-4 md:mb-6">SUPPORT</h4>
          <ul className="space-y-3 md:space-y-4 text-gray-400 font-indian tracking-widest text-xs md:text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                SHIPPING & RETURNS
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                SIZE GUIDE
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                CONTACT US
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                PRIORITY ACCESS
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] font-indian uppercase">
        <p>© 2026 ERAFLEX GLOBAL ATHLETICS. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-4 md:gap-8">
          <a href="#" className="hover:text-white transition-colors">
            PRIVACY POLICY
          </a>
          <a href="#" className="hover:text-white transition-colors">
            TERMS OF SERVICE
          </a>
        </div>
      </div>
    </footer>
  );
};
