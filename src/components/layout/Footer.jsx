import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SOCIAL, IMAGES } from "../../constants";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/">
              <img
                src={IMAGES.logo}
                alt="iXabo"
                className="h-24 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-ui-gray max-w-sm leading-relaxed">
              {t("footer.about")}
            </p>
            <div className="flex gap-4 mt-6">
              {SOCIAL.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-ui-bg flex items-center justify-center text-ui-gray hover:bg-brand-primary hover:text-white transition-all"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-bold text-ui-dark mb-4">
              {t("footer.company")}
            </h4>
            <ul className="space-y-3 text-ui-gray">
              <li>
                <Link
                  to="/join-us"
                  className="hover:text-brand-primary transition-colors"
                >
                  {t("footer.links.join")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-brand-primary transition-colors"
                >
                  {t("footer.links.contact")}
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-brand-primary transition-colors"
                >
                  {t("footer.links.privacy")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-ui-dark mb-4">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3 text-ui-gray">
              <li className="text-start hover:text-brand-primary transition-colors">
                <a href={`mailto:${t("general.email")}`}>
                  {t("general.email")}
                </a>
              </li>
              <li className="text-start hover:text-brand-primary transition-colors">
                <a href={`tel:${t("general.phone")}`}>{t("general.phone")}</a>
              </li>
              <li>{t("footer.location")}</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 pt-8 text-center text-sm text-brand-primary font-medium">
          © {year} | {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
