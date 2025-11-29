import React, { useState } from "react";
import { LuMenu, LuX, LuGlobe } from "react-icons/lu";
import iXaboButton from "@/components/ui/iXaboButton";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IMAGES } from "../../constants";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.dictionary"), path: "/dictionary" },
    { name: t("nav.pricing").split(" ")[0], path: "/pricing" },
    { name: t("nav.join"), path: "/join-us" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-22">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/">
              <img
                src={IMAGES.logo}
                alt="iXabo Logo"
                className="h-24 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                // Fixed hover color
                className="text-ui-dark hover:text-brand-primary font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center gap-3 border-s border-gray-200 ps-4">
              <button
                onClick={toggleLanguage}
                // Fixed hover color
                className="p-2 text-ui-gray hover:text-brand-primary transition-colors flex items-center gap-1 font-medium"
              >
                <LuGlobe size={18} />
                <span>{i18n.language === "en" ? "AR" : "EN"}</span>
              </button>

              <iXaboButton
                variant="primary"
                className="px-5 py-2 rounded-lg text-sm"
              >
                {t("nav.download")}
              </iXaboButton>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="font-bold text-brand-primary"
            >
              {i18n.language === "en" ? "AR" : "EN"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-ui-dark hover:text-brand-primary focus:outline-none"
            >
              {isOpen ? <LuX size={28} /> : <LuMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-3 rounded-md text-base font-medium text-ui-dark hover:text-brand-primary hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              <iXaboButton variant="primary" className="w-full">
                {t("nav.download")}
              </iXaboButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
