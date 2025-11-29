import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useTranslation } from "react-i18next";

const PartnerSlider = () => {
  const { t, i18n } = useTranslation();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    try {
      // Increased limit to 30 to make the loop look fuller
      const { data, error } = await supabase
        .from("provider")
        .select("ID, Name, NameAr, ImageUrl")
        .eq("IsActive", true)
        .not("ImageUrl", "is", null)
        .limit(30);

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  }

  const getName = (partner) => {
    if (i18n.language === "ar" && partner.NameAr) {
      return partner.NameAr;
    }
    return partner.Name;
  };

  if (loading || partners.length === 0) return null;

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      {/* 1. Bigger, bolder Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <h2 className="text-3xl font-bold text-ui-dark tracking-tight">
          {t("hero.stats_partners")}
        </h2>
      </div>

      <div className="relative flex overflow-x-hidden group" dir="ltr">
        {/* Adjusted padding and gap */}
        <div className="py-4 animate-marquee whitespace-nowrap flex items-center gap-16 px-6">
          {partners.concat(partners).map((partner, index) => (
            <div
              key={`${partner.ID}-${index}`}
              // 2. Bigger Card Container (w-48) & Flex-Col for Name
              className="flex flex-col items-center justify-center space-y-4 group/item cursor-pointer"
            >
              {/* Logo Box */}
              <div className="w-48 h-28 bg-white rounded-xl border border-transparent group-hover/item:border-gray-100 group-hover/item:shadow-lg transition-all duration-300 flex items-center justify-center p-4 grayscale group-hover/item:grayscale-0 opacity-70 group-hover/item:opacity-100">
                {partner.ImageUrl ? (
                  <img
                    src={partner.ImageUrl}
                    alt={partner.Name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="font-bold text-gray-400">
                    {partner.Name}
                  </span>
                )}
              </div>

              {/* 3. Provider Name (Truncated to avoid breaking layout) */}
              <span className="text-sm font-semibold text-ui-gray group-hover/item:text-brand-primary transition-colors max-w-[180px] truncate text-center">
                {getName(partner)}
              </span>
            </div>
          ))}
        </div>

        {/* Enhanced Gradient Fades */}
        <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};

export default PartnerSlider;
