import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";
import iXaboButton from "@/components/ui/iXaboButton";
import iXaboInput from "@/components/ui/iXaboInput";

import { LuCircleCheck, LuSend, LuUsers, LuTrendingUp } from "react-icons/lu";

const JoinUs = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    business_name: "",
    contact_person: "",
    phone_number: "",
    category_interest: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("merchant_leads").insert([
        {
          business_name: formData.business_name,
          contact_person: formData.contact_person,
          phone_number: formData.phone_number,
          category_interest: formData.category_interest,
        },
      ]);

      if (error) throw error;
      setSuccess(true);
      setFormData({
        business_name: "",
        contact_person: "",
        phone_number: "",
        category_interest: "",
      });
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ui-bg pt-36 pb-12 px-4">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-ui-dark mb-4">
          {t("join.title")}
        </h1>
        <p className="text-lg text-ui-gray">{t("join.subtitle")}</p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* The Card Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-5 h-full">
            {/* Colored Side Panel (Benefits) */}
            <div className="hidden md:block col-span-2 bg-brand-primary relative p-8 text-white overflow-hidden">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    {t("join.form_title")}
                  </h3>

                  {/* Mini Stats/Benefits in Sidebar */}
                  <div className="space-y-6">
                    <div className="flex gap-3 items-start">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <LuUsers size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {t("join.benefit_1_title")}
                        </p>
                        <p className="text-xs opacity-80">
                          {t("join.benefit_1_desc")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <LuTrendingUp size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {t("join.benefit_2_title")}
                        </p>
                        <p className="text-xs opacity-80">
                          {t("join.benefit_2_desc")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="opacity-20 mt-8">
                  <LuSend size={100} />
                </div>
              </div>

              {/* Background Blob */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            {/* Form Section */}
            <div className="col-span-3 p-8 md:p-12">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <LuCircleCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-ui-dark">
                    {t("join.success_title")}
                  </h3>
                  <p className="text-ui-gray">{t("join.success_desc")}</p>
                  <iXaboButton variant="secondary" onClick={() => setSuccess(false)}>
                    {t("join.btn_another")}
                  </iXaboButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="mb-2 md:hidden">
                    <h3 className="text-xl font-bold text-ui-dark">
                      {t("join.form_title")}
                    </h3>
                  </div>

                  <iXaboInput
                    name="business_name"
                    value={formData.business_name}
                    label={t("join.label_business")}
                    placeholder={t("join.placeholder_business")}
                    required
                    onChange={handleChange}
                  />

                  <iXaboInput
                    name="contact_person"
                    value={formData.contact_person}
                    label={t("join.label_contact")}
                    placeholder={t("join.placeholder_contact")}
                    required
                    onChange={handleChange}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <iXaboInput
                      name="phone_number"
                      value={formData.phone_number}
                      label={t("join.label_phone")}
                      placeholder={t("join.placeholder_phone")}
                      required
                      onChange={handleChange}
                    />
                    <iXaboInput
                      name="category_interest"
                      value={formData.category_interest}
                      label={t("join.label_category")}
                      placeholder={t("join.placeholder_category")}
                      onChange={handleChange}
                    />
                  </div>

                  <iXaboButton
                    type="submit"
                    variant="primary"
                    className="w-full h-12 text-lg mt-4"
                    disabled={loading}
                  >
                    {loading ? t("join.btn_sending") : t("join.btn_submit")}
                  </iXaboButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
