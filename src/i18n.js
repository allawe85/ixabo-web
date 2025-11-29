import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Minimal translations for Phase 1
const resources = {
  en: {
    translation: {
      general: {
        phone: "0797804866",
        email: "info@ixabo.net"
      },
      nav: {
        home: "Home",
        pricing: "Pricing",
        join: "Join Us",
        contact: "Contact",
        dictionary: "Directory",
        download: "Download App"
      },
      hero: {
        badge: "Revamped & Ready in 2026",
        title_start: "Unlock the",
        title_highlight: "Best Deals",
        title_end: "Across Jordan.",
        subtitle: "Experience the new iXabo. Exclusive offers on restaurants, entertainment, and hotels—now faster and smarter than ever.",
        cta_download: "Download App",
        cta_merchant: "For Merchants",
        stats_partners: "Trusted Partners",
        stats_users: "Happy Users"
      },
      join: {
        title: "Grow Your Business with iXabo",
        subtitle: "Join over 200+ leading brands. We help you reach new customers and increase sales through smart marketing tools.",
        benefit_1_title: "Access 50k+ Users",
        benefit_1_desc: "Instantly put your brand in front of thousands of active customers.",
        benefit_2_title: "Boost Revenue",
        benefit_2_desc: "Fill empty seats and clear inventory with smart dynamic offers.",
        benefit_3_title: "Easy Management",
        benefit_3_desc: "Control your offers and track performance with our Merchant App.",
        form_title: "Become a Partner",
        form_subtitle: "Fill out the form below to get started.",
        label_business: "Business Name",
        placeholder_business: "e.g. Burger Maker",
        label_contact: "Contact Person",
        placeholder_contact: "Your Name",
        label_phone: "Phone Number",
        placeholder_phone: "079...",
        label_category: "Category",
        placeholder_category: "e.g. Restaurant",
        btn_submit: "Submit Application",
        btn_sending: "Sending...",
        success_title: "Request Sent!",
        success_desc: "Our partnership team will contact you within 24 hours.",
        btn_another: "Send Another"
      },
      contact: {
        title: "Get in Touch",
        subtitle: "Have a question or feedback? We'd love to hear from you.",
        info_title: "Contact Information",
        label_name: "Full Name",
        label_email: "Email Address",
        label_subject: "Subject",
        label_message: "Message",
        btn_submit: "Send Message",
        success_title: "Message Sent!",
        success_desc: "Thank you for reaching out. We will get back to you shortly.",
        panel_desc: "We are here to help and answer any question you might have. We look forward to hearing from you.",
        location_value: "As'Salt, Jordan",
        label_phone_tag: "Phone",
        label_email_tag: "Email",
        label_location_tag: "Location",
      },
      footer: {
        about: "Your go-to app for exclusive deals and discounts across Jordan. Save more on the experiences you love.",
        company: "Company",
        contact: "Contact",
        rights: "iXabo.net. All Rights Reserved.",
        links: {
          join: "Join Us",
          contact: "Contact Support",
          privacy: "Privacy Policy"
        },
        location: "As'Salt, Jordan"
      },
      pricing: {
        title: "Simple, Transparent Pricing",
        subtitle: "Choose the package that suits your lifestyle and start saving today.",
        currency: "JOD",
        most_popular: "Most Popular",
        // NEW: Dynamic Validity logic
        validity_month: "/ month",
        validity_year: "/ year",
        validity_months: "/ {{count}} months", // Dynamic plural
        // NEW: Marketing Note
        note_title: "Want to try it for free?",
        note_desc: "Download the app, follow us on Instagram, and send us a direct message to get a one-time free subscription for 3 months!",
        follow_btn: "Follow on Instagram"
      },
      offers: {
        title: "iXabo Offers",
        subtitle: "Don't miss out on these limited-time deals happening right now.",
        discount: "Discount",
        get_deal: "Get Deal"
      },
      dictionary: {
        title: "iXabo Directory",
        subtitle: "Find the best providers in your area.",
        search_placeholder: "Search by name...",
        filter_all: "All",
        filter_category: "Category",
        filter_gov: "Governorate",
        no_results: "No providers found matching your criteria."
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        pricing: "الأسعار",
        join: "انضم إلينا",
        contact: "تواصل معنا",
        dictionary: "الدليل", 
        download: "حمل التطبيق"
      },
      hero: {
        badge: "تصميم جديد وجاهز لعام 2026",
        title_start: "اكتشف",
        title_highlight: "أفضل العروض",
        title_end: "في الأردن.",
        subtitle: "جرب iXabo بحلته الجديدة. عروض حصرية على المطاعم، الترفيه، والفنادق — الآن أسرع وأذكى من أي وقت مضى.",
        cta_download: "حمل التطبيق",
        cta_merchant: "للتجار",
        stats_partners: "شريك موثوق",
        stats_users: "مستخدم سعيد"
      },
      join: {
        title: "انضم لشبكة شركاء iXabo",
        subtitle: "انضم إلى أكثر من 200 علامة تجارية رائدة. نحن نساعدك على الوصول إلى عملاء جدد وزيادة مبيعاتك من خلال أدوات تسويقية ذكية.",
        benefit_1_title: "وصول لأكثر من 50 ألف مستخدم",
        benefit_1_desc: "ضع علامتك التجارية أمام الآلاف من العملاء النشطين فوراً.",
        benefit_2_title: "زيادة الإيرادات",
        benefit_2_desc: "املأ المقاعد الشاغرة وقم بتصريف المخزون باستخدام العروض الديناميكية الذكية.",
        benefit_3_title: "إدارة سهلة",
        benefit_3_desc: "تحكم في عروضك وتابع الأداء بسهولة عبر تطبيق التاجر الخاص بنا.",
        form_title: "كن شريكاً معنا",
        form_subtitle: "املأ النموذج أدناه للبدء.",
        label_business: "اسم النشاط التجاري",
        placeholder_business: "مثال: مطعم البرجر",
        label_contact: "الشخص المسؤول",
        placeholder_contact: "اسمك",
        label_phone: "رقم الهاتف",
        placeholder_phone: "079...",
        label_category: "التصنيف",
        placeholder_category: "مثال: مطعم، صالة رياضة",
        btn_submit: "إرسال الطلب",
        btn_sending: "جاري الإرسال...",
        success_title: "تم استلام طلبك!",
        success_desc: "سيتواصل معك فريق الشراكات لدينا خلال 24 ساعة.",
        btn_another: "إرسال طلب آخر"
      },
      contact: {
        title: "تواصل معنا",
        subtitle: "لديك سؤال أو ملاحظة؟ يسعدنا سماع صوتك.",
        info_title: "معلومات الاتصال",
        label_name: "الاسم الكامل",
        label_email: "البريد الإلكتروني",
        label_subject: "الموضوع",
        label_message: "الرسالة",
        btn_submit: "إرسال الرسالة",
        success_title: "تم الإرسال!",
        success_desc: "شكراً لتواصلك معنا. سنقوم بالرد عليك قريباً.",
        panel_desc: "نحن هنا للمساعدة والإجابة على أي استفسار لديك. نتطلع لسماع رأيك.",
        location_value: "السلط، الأردن",
        label_phone_tag: "الهاتف",
        label_email_tag: "البريد الإلكتروني",
        label_location_tag: "الموقع",

      },
      footer: {
        about: "تطبيقك المفضل للعروض والخصومات الحصرية في الأردن. وفر أكثر على التجارب التي تحبها.",
        company: "الشركة",
        contact: "اتصل بنا",
        rights: "iXabo.net. جميع الحقوق محفوظة.",
        links: {
          join: "انضم إلينا",
          contact: "الدعم الفني",
          privacy: "سياسة الخصوصية"
        },
        location: "السلط، الأردن"
      },
      pricing: {
        title: "باقات أسعار بسيطة وواضحة",
        subtitle: "اختر الباقة التي تناسب نمط حياتك وابدأ التوفير اليوم.",
        currency: "دينار",
        most_popular: "الأكثر طلباً",
        // NEW: Dynamic Validity logic (Arabic)
        validity_month: "/ شهرياً",
        validity_year: "/ سنوياً",
        validity_months: "/ {{count}} أشهر",
        // NEW: Marketing Note
        note_title: "حابب تجرب مجاناً؟",
        note_desc: "حمل التطبيق، تابعنا على إنستغرام، وأرسل لنا رسالة خاصة لتحصل على اشتراك مجاني لمرة واحدة لمدة 3 أشهر!",
        follow_btn: "تابعنا على إنستغرام"
      },
      offers: {
        title: "عروض iXab",
        subtitle: "لا تفوت هذه العروض المحدودة السارية الآن.",
        discount: "خصم",
        get_deal: "احصل على العرض"
      },
      dictionary: {
        title: "دليل iXabo",
        subtitle: "اعثر على أفضل مقدمي الخدمات في منطقتك.",
        search_placeholder: "ابحث بالاسم...",
        filter_all: "الكل",
        filter_category: "التصنيف",
        filter_gov: "المحافظة",
        no_results: "لم يتم العثور على نتائج تطابق بحثك."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;