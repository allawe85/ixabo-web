import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';
import { LuSearch, LuMapPin, LuLayoutGrid, LuFilterX } from 'react-icons/lu';

const Dictionary = () => {
  const { t, i18n } = useTranslation();
  
  // Data State
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [govs, setGovs] = useState([]);
  
  // Mapping State (The "Links" between providers and filters)
  const [catMappings, setCatMappings] = useState([]);
  const [govMappings, setGovMappings] = useState([]);

  const [loading, setLoading] = useState(true);

  // Filter State
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedGov, setSelectedGov] = useState('All');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Fetch everything in parallel
      const [provRes, catRes, govRes, catMapRes, govMapRes] = await Promise.all([
        // 1. Get all active providers for the main grid
        supabase.from('provider').select('ID, Name, NameAr, ImageUrl').eq('IsActive', true),
        
        // 2. Get Dropdown Options
        supabase.from('category').select('ID, Name, NameAr').order('Order'),
        supabase.from('governorate').select('ID, Name, NameAr'),

        // 3. Get the Mappings (Using your new Views)
        // We only need the IDs to build the relationship logic
        supabase.from('view_provider_category').select('ProviderID, CategoryID'),
        supabase.from('view_provider_governorate').select('ProviderID, GovernorateID')
      ]);

      if (provRes.error) console.error("Prov Error", provRes.error);

      setProviders(provRes.data || []);
      setCategories(catRes.data || []);
      setGovs(govRes.data || []);
      
      // Store the relationships
      setCatMappings(catMapRes.data || []);
      setGovMappings(govMapRes.data || []);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Helper for localization
  const getLoc = (item, field) => {
    if (!item) return '';
    return i18n.language === 'ar' ? (item[`${field}Ar`] || item[field]) : item[field];
  };

  // ------------------------------------------
  // The New ID-Based Filtering Logic
  // ------------------------------------------
  const filteredProviders = providers.filter((p) => {
    // 1. Search Text (Name)
    const name = i18n.language === 'ar' ? p.NameAr : p.Name;
    const matchesSearch = name?.toLowerCase().includes(search.toLowerCase());
    
    // 2. Category Filter (ID Based)
    // We check if "This Provider's ID" exists in the mapping list alongside "The Selected Category ID"
    let matchesCat = true;
    if (selectedCat !== 'All') {
      // Note: selectedCat is a string from the select input, so we convert to Number
      matchesCat = catMappings.some(
        (map) => map.ProviderID === p.ID && map.CategoryID === Number(selectedCat)
      );
    }

    // 3. Governorate Filter (ID Based)
    let matchesGov = true;
    if (selectedGov !== 'All') {
      matchesGov = govMappings.some(
        (map) => map.ProviderID === p.ID && map.GovernorateID === Number(selectedGov)
      );
    }

    return matchesSearch && matchesCat && matchesGov;
  });

  return (
    <div className="min-h-screen bg-ui-bg pt-36 pb-20 px-4">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 text-center md:text-start">
        <h1 className="text-3xl font-bold text-ui-dark mb-2">{t('dictionary.title')}</h1>
        <p className="text-ui-gray">{t('dictionary.subtitle')}</p>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10 sticky top-28 z-20">
        <div className="grid md:grid-cols-3 gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <LuSearch className={`absolute top-3.5 text-gray-400 ${i18n.language === 'ar' ? 'right-3' : 'left-3'}`} size={20} />
            <input 
              type="text" 
              placeholder={t('dictionary.search_placeholder')}
              className={`w-full py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/20 ${i18n.language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <div className={`absolute top-3.5 text-gray-400 pointer-events-none ${i18n.language === 'ar' ? 'right-3' : 'left-3'}`}>
              <LuLayoutGrid size={20} />
            </div>
            <select 
              className={`w-full py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/20 appearance-none cursor-pointer ${i18n.language === 'ar' ? 'pr-10 pl-8' : 'pl-10 pr-8'}`}
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              <option value="All">{t('dictionary.filter_category')}: {t('dictionary.filter_all')}</option>
              {categories.map(c => (
                <option key={c.ID} value={c.ID}>{getLoc(c, 'Name')}</option>
              ))}
            </select>
          </div>

          {/* Gov Dropdown */}
          <div className="relative">
            <div className={`absolute top-3.5 text-gray-400 pointer-events-none ${i18n.language === 'ar' ? 'right-3' : 'left-3'}`}>
              <LuMapPin size={20} />
            </div>
            <select 
              className={`w-full py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary/20 appearance-none cursor-pointer ${i18n.language === 'ar' ? 'pr-10 pl-8' : 'pl-10 pr-8'}`}
              value={selectedGov}
              onChange={(e) => setSelectedGov(e.target.value)}
            >
              <option value="All">{t('dictionary.filter_gov')}: {t('dictionary.filter_all')}</option>
              {govs.map(g => (
                <option key={g.ID} value={g.ID}>{getLoc(g, 'Name')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          // Skeleton Loader
          [...Array(8)].map((_, i) => (
             <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          ))
        ) : filteredProviders.length > 0 ? (
          filteredProviders.map((prov) => (
            <div key={prov.ID} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center group cursor-default">
              
              {/* Image Circle */}
              <div className="w-24 h-24 mb-4 rounded-full bg-white border border-gray-50 flex items-center justify-center p-2 shadow-inner group-hover:scale-105 transition-transform duration-300">
                 {prov.ImageUrl ? (
                   <img src={prov.ImageUrl} alt={prov.Name} className="max-w-full max-h-full object-contain" />
                 ) : (
                   <span className="text-2xl font-bold text-gray-300">{prov.Name ? prov.Name[0] : '?'}</span>
                 )}
              </div>
              
              {/* Name */}
              <h3 className="font-bold text-ui-dark mb-1 line-clamp-1 group-hover:text-brand-primary transition-colors">
                {getLoc(prov, 'Name')}
              </h3>
              
              {/* Active Badge (Optional) */}
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-2">
                Active Partner
              </span>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-300">
            <LuFilterX size={64} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">{t('dictionary.no_results')}</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dictionary;