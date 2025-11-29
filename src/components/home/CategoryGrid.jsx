import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';
import { LuLayoutGrid } from 'react-icons/lu';

const CategoryGrid = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('category')
        .select('ID, Name, NameAr, IconUrl, Order')
        .order('Order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }

  // Helper to get the correct name based on current language
  const getName = (cat) => (i18n.language === 'ar' ? cat.NameAr : cat.Name);

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Decor - Subtle blob to keep the theme consistent */}
      <div className="absolute top-1/2 start-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-tertiary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-ui-dark">
            {i18n.language === 'ar' ? 'تصفح الفئات' : 'Explore Categories'}
          </h2>
          <p className="text-ui-gray max-w-2xl mx-auto">
            {i18n.language === 'ar' 
              ? 'اكتشف أكثر من 200 عرض حصري عبر مجموعة متنوعة من الخدمات!'
              : 'Discover 200+ Deals Across a Variety of Services and Offers!'}
          </p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.ID}
              className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-brand-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 mx-auto mb-4 bg-brand-alternate/30 rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 text-brand-primary">
                {cat.IconUrl ? (
                  <img 
                    src={cat.IconUrl} 
                    alt={getName(cat)} 
                    className="w-8 h-8 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert" 
                  />
                ) : (
                  <LuLayoutGrid size={24} />
                )}
              </div>

              {/* Category Name */}
              <h3 className="font-semibold text-ui-dark group-hover:text-brand-primary transition-colors">
                {getName(cat)}
              </h3>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default CategoryGrid;