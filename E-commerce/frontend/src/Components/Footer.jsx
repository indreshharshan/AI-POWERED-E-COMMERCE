import React from "react";
import footer_logo from "../assets/logo_big.png";
import { 
  FaPinterest, 
  FaSquareInstagram, 
  FaWhatsapp, 
  FaFacebookF, 
  FaXTwitter,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaArrowRight
} from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-600 pt-20 pb-10 border-t border-gray-100 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={footer_logo} alt="Shopper Logo" className="h-12 w-auto" />
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter italic">SHOPPER</h2>
            </div>
            <p className="text-gray-500 leading-relaxed max-w-xs">
              Redefining your wardrobe with curated fashion collections that blend modern trends with timeless quality.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FaSquareInstagram />, link: "https://www.instagram.com/spidy_02/", color: "hover:bg-pink-500" },
                { icon: <FaFacebookF />, link: "#", color: "hover:bg-blue-600" },
                { icon: <FaXTwitter />, link: "#", color: "hover:bg-black" },
                { icon: <FaPinterest />, link: "#", color: "hover:bg-red-600" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all duration-300 hover:text-white hover:-translate-y-1 ${social.color} shadow-sm`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-12">
            <h3 className="text-sm font-bold text-gray-900 mb-8 uppercase tracking-widest border-l-4 border-red-500 pl-3">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: "Home", path: "/" },
                { name: "Shop Collections", path: "/collections" },
                { name: "Support Center", path: "/contact" },
                { name: "Privacy Policy", path: "#" },
                { name: "Terms of Use", path: "#" }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.path} 
                    className="flex items-center gap-2 hover:text-red-500 transition-colors group font-medium text-sm"
                  >
                    <FaArrowRight className="text-[10px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-8 uppercase tracking-widest border-l-4 border-red-500 pl-3">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-red-100 text-red-500">
                  <FaLocationDot />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                  <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                    123 Fashion Ave, Suite 456, NY 10001
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-red-100 text-red-500">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                  <p className="text-xs font-semibold text-gray-700">support@shopper.com</p>
                </div>
              </li>
              <li className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-red-100 text-red-500">
                  <FaWhatsapp />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">WhatsApp</p>
                  <p className="text-xs font-semibold text-gray-700">+1 (555) 000-0000</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-xs font-medium">
            © 2026 <span className="text-gray-900 font-bold tracking-widest">SHOPPER</span>. Crafted with passion.
          </p>
          <div className="flex items-center gap-4">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400">
                    {i === 4 ? 'Visa' : 'MC'}
                  </div>
                ))}
             </div>
             <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Secure Payments</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
