import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LuSparkles } from 'react-icons/lu';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import { supabase } from '../../lib/supabase'; // Import Supabase
import { SCREENSHOTS, LINKS } from '../../constants';

const Hero = () => {
  const { t } = useTranslation();
  
  // State for dynamic stats
  const [stats, setStats] = useState({ partners: 0, users: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  // App Store Links & Images (Keeping your existing setup)


  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // 1. Slideshow Timer
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % SCREENSHOTS.length);
    }, 3000);

    // 2. Fetch Stats Logic
    fetchStats();

    return () => clearInterval(timer);
  }, []);

  async function fetchStats() {
    try {
      // Run both queries in parallel for speed
      const [providerRes, userRes] = await Promise.all([
        // Count Active Providers
        supabase
          .from('provider')
          .select('*', { count: 'exact', head: true }) // head: true means "don't download data, just count"
          .eq('IsActive', true),
        
        // Count Users (Assuming 'user_info' is the table)
        supabase
          .from('user_info')
          .select('*', { count: 'exact', head: true })
      ]);

      setStats({
        partners: providerRes.count || 200, // Fallback to 200 if 0
        users: userRes.count || 50000       // Fallback to 50k if 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  }

  // Helper to format numbers (e.g., 53200 -> "53k+")
  const formatNumber = (num) => {
    
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'k+'; // 53000 -> 53k+
    }
    return num + '+'; // 200 -> 200+
  };

  return (
    <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      
      <div className="absolute top-0 end-0 -z-10 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4 rtl:-translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium">
              <LuSparkles size={16} />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              {t('hero.title_start')} <span className="text-brand-primary">{t('hero.title_highlight')}</span> <br />
              {t('hero.title_end')}
            </h1>
            
            <p className="text-xl text-ui-gray max-w-lg leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4">
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
                  <div className="font-bold text-lg leading-none">Google Play</div>
                </div>
              </a>
            </div>

            <div className="pt-8 flex items-center gap-8 border-t border-gray-200/60">
              <div>
                {/* DYNAMIC PARTNERS COUNT */}
                <p className="text-3xl font-bold text-ui-dark">
                  {loadingStats ? "..." : formatNumber(stats.partners + 100)}
                </p>
                <p className="text-sm text-ui-gray">{t('hero.stats_partners')}</p>
              </div>
              <div>
                {/* DYNAMIC USERS COUNT */}
                <p className="text-3xl font-bold text-ui-dark">
                  {loadingStats ? "..." : formatNumber(stats.users + 350)}
                </p>
                <p className="text-sm text-ui-gray">{t('hero.stats_users')}</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-float">
               <div className="bg-white p-2 rounded-[3rem] shadow-2xl border-4 border-white mx-auto max-w-[320px]">
                 <div className="bg-ui-dark h-[600px] rounded-[2.5rem] overflow-hidden relative">
                    
                    {SCREENSHOTS.map((src, index) => (
                      <img 
                        key={index}
                        src={src}
                        alt={`App Preview ${index}`}
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
                      />
                    ))}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                 </div>
               </div>
            </div>
            
            <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-tertiary/20 rounded-full blur-3xl -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
};
export default Hero;