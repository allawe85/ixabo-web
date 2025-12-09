import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Store, 
  Settings, 
  Users, 
  CreditCard, 
  QrCode, 
  Bell, 
  LogOut, 
  Menu, 
  Globe,
  Grid,
  MapPin,
  Package,
  Tags,
  ChevronDown,
  Image,          // New Icon
  CheckSquare,    // New Icon
  MessageSquare   // New Icon
} from 'lucide-react';
import { IMAGES } from '../../constants';

const AdminLayout = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [expandedMenus, setExpandedMenus] = useState({
    'System Parameters': true, // Optional: Keep these open by default if you want
    'Management': true
  });

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  const toggleSubmenu = (label) => {
    if (!isSidebarOpen) setIsSidebarOpen(true);
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  // --- UPDATED MENU STRUCTURE ---
  const MENU_ITEMS = [
    { label: t('admin.menu.dashboard'), path: '/portal/dashboard', icon: LayoutDashboard },
    { label: t('admin.menu.providers'), path: '/portal/providers', icon: Store },
    
    // 1. System Parameters Group
    { 
      label: t('admin.menu.system_params'), 
      icon: Settings,
      submenu: [
        { label: t('admin.menu.categories'), path: '/portal/categories', icon: Grid },
        { label: t('admin.menu.governorates'), path: '/portal/governorates', icon: MapPin },
        { label: t('admin.menu.sales_points'), path: '/portal/sales-points', icon: Store },
        { label: t('admin.menu.packages'), path: '/portal/packages', icon: Package },
        { label: t('admin.menu.intro_memes'), path: '/portal/intro-memes', icon: Image },
      ]
    },

    // 2. Management Group
    { 
      label: t('admin.menu.management'), 
      icon: Users,
      submenu: [
        { label: t('admin.menu.users'), path: '/portal/users', icon: Users },
        { label: t('admin.menu.subscriptions'), path: '/portal/subscriptions', icon: CreditCard },
        { label: t('admin.menu.codes'), path: '/portal/codes', icon: Tags },
        { label: t('admin.menu.approvals'), path: '/portal/approvals', icon: CheckSquare },
        { label: t('admin.menu.suggestions'), path: '/portal/suggestions', icon: MessageSquare },
      ]
    },

    { label: t('admin.menu.scans'), path: '/portal/scans', icon: QrCode },
    { label: t('admin.menu.notifications'), path: '/portal/notifications', icon: Bell },
  ];

  const isActive = (path) => location.pathname === path;
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans relative" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          fixed inset-y-0 z-50 bg-white border-gray-200 transition-all duration-300 ease-in-out flex flex-col
          ${isRTL ? 'right-0 border-l' : 'left-0 border-r'} 
          ${isSidebarOpen ? 'w-64' : 'w-20'}
          ${isSidebarOpen ? 'flex' : 'hidden'} md:flex
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
           <Link to="/">
             <img src={IMAGES.logo} alt="iXabo" className={`transition-all ${isSidebarOpen ? 'h-10' : 'h-8'}`} />
           </Link>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          {MENU_ITEMS.map((item) => (
            <div key={item.label}>
              {item.submenu ? (
                // --- PARENT MENU ---
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-brand-primary transition-colors
                      ${!isSidebarOpen && 'justify-center'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                    </div>
                    {isSidebarOpen && (
                      <ChevronDown 
                        className={`transition-transform duration-200 text-gray-400 ${expandedMenus[item.label] ? 'rotate-180' : ''}`} 
                        size={16} 
                      />
                    )}
                  </button>
                  
                  {/* SUBMENU */}
                  {isSidebarOpen && expandedMenus[item.label] && (
                    <div className="bg-gray-50/50 py-1">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`
                            flex items-center gap-3 py-2 text-sm transition-colors block
                            ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}
                            ${isActive(sub.path) ? 'text-brand-primary font-semibold bg-brand-primary/5' : 'text-gray-500 hover:text-gray-900'}
                          `}
                        >
                           {/* Keep sub icons optional, good for scanning long lists */}
                           <sub.icon size={16} className="opacity-70" />
                           <span>{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // --- SINGLE LINK ---
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 transition-colors
                    ${isActive(item.path) 
                      ? `bg-brand-primary/5 text-brand-primary ${isRTL ? 'border-l-4' : 'border-r-4'} border-brand-primary` 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-brand-primary'}
                    ${!isSidebarOpen && 'justify-center'}
                  `}
                >
                  <item.icon size={20} />
                  {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button className={`flex items-center gap-3 text-red-500 hover:bg-red-50 w-full p-2 rounded-lg transition-colors ${!isSidebarOpen && 'justify-center'}`}>
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium text-sm">{t('admin.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? (isRTL ? 'md:mr-64' : 'md:ml-64') : (isRTL ? 'md:mr-20' : 'md:ml-20')}`}>
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 hidden sm:block">Admin Console</h2>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={toggleLanguage} className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors">
               <Globe size={18} />
               <span>{isRTL ? 'English' : 'العربية'}</span>
             </button>
             <div className="h-10 w-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">A</div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;