import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-brand-dark border-t border-white/5 py-12 px-6 md:px-12 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-accent flex items-center justify-center font-display text-2xl italic font-black">
              E
            </div>
            <span className="font-display text-3xl tracking-wider">
              ERA<span className="text-brand-accent">FLEX</span>
            </span>
          </Link>
          <p className="text-gray-400 max-w-sm mb-6 font-indian tracking-wide">
            Elite performance gear for the professional athlete. Engineered for
            speed, designed for style, and built for glory. Join the ERAFLEX
            revolution today.
          </p>
          <div className="flex gap-4">
            {["instagram", "twitter", "facebook", "youtube"].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 hover-trigger"
              >
                <i className={`fab fa-${social} text-sm`}></i>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-xl italic mb-6">EXPLORE</h4>
          <ul className="space-y-4 text-gray-400 font-indian tracking-widest text-sm">
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
              <Link href="/limited" className="hover:text-white transition-colors">
                LIMITED DROPS
              </Link>
            </li>
            <li>
              <Link href="/customize" className="hover:text-white transition-colors">
                CUSTOM BUILDER
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xl italic mb-6">SUPPORT</h4>
          <ul className="space-y-4 text-gray-400 font-indian tracking-widest text-sm">
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
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-[10px] tracking-[0.3em] font-indian uppercase">
        <p>© 2026 ERAFLEX GLOBAL ATHLETICS. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">
            PRIVACY POLICY
          </a>
          <a href="#" className="hover:text-white transition-colors">
            TERMS OF SERVICE
          </a>
          <a href="#" className="hover:text-white transition-colors">
            COOKIE SETTINGS
          </a>
        </div>
      </div>
    </footer>
  );
};
