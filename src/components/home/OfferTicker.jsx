import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useTranslation } from "react-i18next";
import { LuTag, LuMapPin, LuLayoutGrid } from 'react-icons/lu';

const OfferTicker = () => {
  const { t, i18n } = useTranslation();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomOffers();
  }, []);

  async function fetchRandomOffers() {
    try {
      const { data, error } = await supabase
        .from("ViewOffer") 
        .select(
          `
          ID, 
          Details, DetailsAr, 
          ImageUrl, 
          OfferValue1, 
          ProviderName, ProviderNameAr, 
          CategoryName, CategoryNameAr, 
          OfferTypeName, OfferTypeNameAr, 
          OfferGovs, OfferGovsAr
        `
        )
        .eq("IsActive", true)
        .eq("ProvidrIsActive", true)
        .limit(50);

      if (error) throw error;

      if (data) {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setOffers(shuffled.slice(0, 20));
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  }

  const getLoc = (item, fieldBase) => {
    if (!item) return "";
    if (i18n.language === "ar") {
      return item[`${fieldBase}Ar`] || item[fieldBase];
    }
    return item[fieldBase];
  };

  if (loading || offers.length === 0) return null;

  return (
    <section className="py-16 bg-brand-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-brand-primary text-white rounded-lg">
            <LuTag size={20} />
          </div>
          <h2 className="text-2xl font-bold text-ui-dark">
            {t("offers.title")}
          </h2>
        </div>
        <p className="text-ui-gray">{t("offers.subtitle")}</p>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        className="flex overflow-x-auto pb-8 gap-6 px-4 sm:px-6 lg:px-8 no-scrollbar snap-x"
        dir="ltr"
      >
        {offers.map((offer) => (
          <div
            key={offer.ID}
            // Dynamic Direction for RTL text inside the card
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
            className="flex-shrink-0 w-96 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden snap-center hover:shadow-md transition-shadow group cursor-default flex flex-col"
          >
            {/* Image Section */}
            <div className="h-48 bg-gray-100 relative overflow-hidden flex-shrink-0">
              {/* RESTORED IMAGE LOGIC */}
              {offer.ImageUrl ? (
                <img
                  src={offer.ImageUrl}
                  alt="Offer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Tag size={40} />
                </div>
              )}

              {/* BADGE */}
              <div
                className={`
                  absolute top-3 
                  ${i18n.language === "ar" ? "left-3" : "right-3"} 
                  bg-white/95 backdrop-blur text-brand-primary px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm
                `}
              >
                {getLoc(offer, "OfferTypeName")}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow text-start">
              {/* Provider Name */}
              <p className="text-xs font-semibold text-brand-primary uppercase tracking-wide mb-3">
                {getLoc(offer, "ProviderName")}
              </p>

              {/* DESCRIPTION */}
              <p className="text-sm font-medium text-ui-dark leading-relaxed line-clamp-3 mb-4 flex-grow">
                {getLoc(offer, "Details")}
              </p>

              {/* Footer: Category & Govs */}
              <div className="pt-4 mt-auto border-t border-gray-50 space-y-2">
                {/* Category */}
                <div className="flex items-center gap-2 text-xs text-ui-gray">
                  <LuLayoutGrid size={14} className="text-brand-primary" />
                  <span className="truncate">
                    {getLoc(offer, "CategoryName")}
                  </span>
                </div>

                {/* Govs */}
                <div className="flex items-center gap-2 text-xs text-ui-gray">
                  <LuMapPin size={14} className="text-brand-primary" />
                  <span className="truncate">{getLoc(offer, "OfferGovs")}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OfferTicker;