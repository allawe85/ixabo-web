import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useTranslation } from "react-i18next";
import IxaboButton from "@/components/ui/IxaboButton";
import IxaboInput from "@/components/ui/IxaboInput";

import {
  LuMail,
  LuPhone,
  LuMapPin,
  LuSend,
  LuCircleCheck,
} from "react-icons/lu";

const ContactUs = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([formData]);

      if (error) throw error;
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      alert("Error sending message");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: LuPhone,
      text: t("general.phone"),
      label: t("contact.label_phone_tag"),
      isDirLtr: true,
    },
    {
      icon: LuMail,
      text: t("general.email"),
      label: t("contact.label_email_tag"),
      isDirLtr: true,
    },
    {
      icon: LuMapPin,
      text: t("contact.location_value"),
      label: t("contact.label_location_tag"),
      isDirLtr: false,
    },
  ];

  return (
    <div className="min-h-screen bg-ui-bg pt-36 pb-12 px-4">
      {/* 1. RESTORED HEADER */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-ui-dark mb-4">
          {t("contact.title")}
        </h1>
        <p className="text-lg text-ui-gray">{t("contact.subtitle")}</p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* 2. RESTORED INFO CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
            >
              <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-4">
                <info.icon size={24} />
              </div>
              <h3
                className="font-semibold text-ui-dark"
                dir={info.isDirLtr ? "ltr" : "auto"}
              >
                {info.text}
              </h3>
              <p className="text-sm text-ui-gray mt-1">{info.label}</p>
            </div>
          ))}
        </div>

        {/* 3. MAIN FORM CARD */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative z-0">
          <div className="grid md:grid-cols-5 h-full">
            {/* Side Panel */}
            <div className="hidden md:block col-span-2 bg-brand-primary relative p-8 text-white overflow-hidden z-0">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    {t("contact.info_title")}
                  </h3>
                  <p className="opacity-90 leading-relaxed">
                    {t("contact.panel_desc")}
                  </p>
                </div>
                <div className="opacity-20">
                  <LuSend size={120} />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            {/* Form Section */}
            <div className="col-span-3 p-8 md:p-12 relative z-10 bg-white">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <LuCircleCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-ui-dark">
                    {t("contact.success_title")}
                  </h3>
                  <p className="text-ui-gray">{t("contact.success_desc")}</p>
                  <IxaboButton
                    variant="secondary"
                    onClick={() => setSuccess(false)}
                  >
                    Send Another
                  </IxaboButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <IxaboInput
                      name="name"
                      label={t("contact.label_name")}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <IxaboInput
                      name="email"
                      type="email"
                      label={t("contact.label_email")}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <IxaboInput
                    name="subject"
                    label={t("contact.label_subject")}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />

                  <div className="space-y-2 relative z-20">
                    <label className="block text-sm font-medium text-ui-dark">
                      {t("contact.label_message")}
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-ui-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none relative z-20"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <IxaboButton
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "..." : t("contact.btn_submit")}
                  </IxaboButton>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
