import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";
import { LuCheck, LuStar } from "react-icons/lu";
import { FaApple, FaGooglePlay, FaInstagram } from "react-icons/fa";
import { LINKS } from "../constants";

const Pricing = () => {
  const { t, i18n } = useTranslation();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  async function fetchPackages() {
    try {
      const { data, error } = await supabase
        .from("package")
        .select(
          "ID, Title, TitleAr, Description, DescriptionAr, Price, color, is_main, order, validity"
        )
        // Removed the filter so we can see how the layout handles different cards
        // or keep .eq("is_main", true) if that's your strict requirement
        .eq("is_main", true) 
        .order("order", { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  }

  const getLoc = (pkg, field) => {
    if (i18n.language === "ar") {
      return pkg[`${field}Ar`] || pkg[field];
    }
    return pkg[field];
  };

  const formatValidity = (months) => {
    if (months === 1) return t("pricing.validity_month");
    if (months === 12) return t("pricing.validity_year");
    return t("pricing.validity_months", { count: months });
  };

  return (
    <div className="min-h-screen bg-ui-bg pt-36 pb-20 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-ui-dark mb-6">
          {t("pricing.title")}
        </h1>
        <p className="text-xl text-ui-gray leading-relaxed">
          {t("pricing.subtitle")}
        </p>
      </div>

      {/* Pricing Grid */}
      {/* FIX 1: Increased gap from gap-6 to gap-8 (32px) or gap-10 (40px) */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-20">
        {loading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 bg-gray-100 rounded-3xl animate-pulse"
              />
            ))
          : packages.map((pkg) => (
              <div
                key={pkg.ID}
                // FIX 2: Made styling dynamic. Only scale the middle card (ID 2).
                // This prevents them from crowding each other.
                className={`
                  relative w-full bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:-translate-y-2
                  ${
                    pkg.ID === 2
                      ? "border-brand-primary shadow-xl scale-105 z-10"
                      : "border-transparent shadow-lg scale-100 z-0"
                  }
                `}
              >
                {/* Most Popular Badge */}
                {pkg.ID === 2 && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 whitespace-nowrap">
                    <LuStar size={14} fill="currentColor" />
                    {t("pricing.most_popular")}
                  </div>
                )}

                {/* Card Header */}
                <div className="text-center mb-8 pt-4">
                  <h3
                    className="text-3xl font-bold mb-4"
                    style={{ color: pkg.color || "#14181b" }}
                  >
                    {getLoc(pkg, "Title")}
                  </h3>

                  <div className="flex justify-center items-baseline gap-1">
                    <span className="text-6xl font-bold text-ui-dark">
                      {pkg.Price}
                    </span>
                    <span className="text-xl text-ui-gray font-medium">
                      {t("pricing.currency")}
                    </span>
                  </div>
                  <p className="text-md text-ui-gray mt-2 font-medium">
                    {formatValidity(pkg.validity)}
                  </p>
                </div>

                {/* Description List */}
                <div className="space-y-4 mb-8 border-t border-gray-100 pt-8">
                  {getLoc(pkg, "Description")
                    .split("\n")
                    .map(
                      (line, idx) =>
                        line.trim() && (
                          <div
                            key={idx}
                            className="flex gap-3 items-start text-start"
                          >
                            <div className="mt-1 flex-shrink-0 text-brand-primary">
                              <LuCheck size={20} />
                            </div>
                            <span className="text-ui-gray text-base leading-relaxed">
                              {line}
                            </span>
                          </div>
                        )
                    )}
                </div>
              </div>
            ))}
      </div>

      {/* Download & Marketing Section */}
      <div className="max-w-4xl mx-auto text-center space-y-10 bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-ui-dark mb-6">
            {t("hero.cta_download")}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={LINKS.appleLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-brand-primary text-white px-6 py-3 rounded-xl hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/25 hover:-translate-y-1"
            >
              <FaApple size={28} />
              <div className="text-start">
                <div className="text-xs opacity-90">Download on the</div>
                <div className="font-bold text-lg leading-none">App Store</div>
              </div>
            </a>

            <a
              href={LINKS.androidLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-ui-dark text-white px-6 py-3 rounded-xl hover:bg-black transition-all hover:-translate-y-1"
            >
              <FaGooglePlay size={24} />
              <div className="text-start">
                <div className="text-xs opacity-90">Get it on</div>
                <div className="font-bold text-lg leading-none">
                  Google Play
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="w-24 h-1 bg-gray-100 mx-auto rounded-full" />

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-brand-primary">
            {t("pricing.note_title")}
          </h3>
          <p className="text-ui-gray text-lg max-w-2xl mx-auto leading-relaxed">
            {t("pricing.note_desc")}
          </p>

          <a
            href={LINKS.instagramLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:text-brand-secondary transition-colors"
          >
            <FaInstagram size={20} />
            <span>{t("pricing.follow_btn")}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Pricing;