import React from "react";
import { useTranslation } from "react-i18next";
import { useDashboard } from "../../hooks/useDashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart, 
  Line, 
  AreaChart, 
  Area
} from "recharts";
import { 
  Users, 
  CreditCard, 
  Store, 
  Tag, 
  TrendingUp, 
  Loader, 
  MapPin 
} from "lucide-react";

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { 
    stats, 
    govStats, 
    topProviders, 
    revenueStats, 
    scanStats,    
    isLoading 
  } = useDashboard();
  
  const isRTL = i18n.dir() === 'rtl';

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader className="animate-spin text-brand-primary" size={32} />
    </div>
  );

  // --- KPI CARD COMPONENT ---
  const StatCard = ({ title, value, subValue, icon: Icon, colorClass }) => (
    <Card className="shadow-sm border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
              <Icon className={`h-6 w-6 ${colorClass.replace("bg-", "text-")}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs text-gray-500">
            {subValue}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard_title')}</h1>
        <p className="text-sm text-gray-500">{t('admin.dashboard_welcome')}</p>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={t('admin.total_income')}
          value={`${stats?.TotalIncome?.toLocaleString()} JOD`}
          subValue={`${t('admin.this_month')}: ${stats?.ThisMonthIncome?.toLocaleString()} JOD`}
          icon={CreditCard}
          colorClass="bg-green-100 text-green-600"
        />
        <StatCard 
          title={t('admin.active_subscribers')}
          value={stats?.ActiveSubscribers}
          subValue={`${t('admin.total_users')}: ${stats?.TotalUsers}`}
          icon={Users}
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatCard 
          title={t('admin.active_providers')}
          value={stats?.TotalActiveProviders}
          subValue={`${t('admin.total_providers')}: ${stats?.TotalProviders}`}
          icon={Store}
          colorClass="bg-purple-100 text-purple-600"
        />
        <StatCard 
          title={t('admin.active_offers')}
          value={stats?.ActiveOffers}
          subValue={`${t('admin.top_category')}: ${stats?.TopCategory || '-'}`}
          icon={Tag}
          colorClass="bg-orange-100 text-orange-600"
        />
      </div>

      {/* --- CHARTS ROW 1 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Revenue Trend (Line Chart) */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle>{t('admin.revenue_trend')}</CardTitle>
            <CardDescription>{t('admin.last_12_months')}</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueStats} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="Month" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`${value} JOD`, t('admin.income')]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Revenue" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{r: 4}} 
                    activeDot={{r: 6}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 2. Providers by Gov (Bar Chart) */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle>{t('admin.providers_by_gov')}</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={govStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="governorate_name" 
                    type="category" 
                    width={100} 
                    tick={{fontSize: 12}} 
                    interval={0}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="provider_count" radius={[0, 4, 4, 0]} barSize={20}>
                    {govStats?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#3b82f6" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* --- CHARTS ROW 2 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. Daily Scans (Area Chart) */}
        <Card className="lg:col-span-2 shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle>{t('admin.daily_scans')}</CardTitle>
            <CardDescription>{t('admin.last_30_days')}</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scanStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="Date" tick={{fontSize: 12}} minTickGap={30} />
                  <YAxis tick={{fontSize: 12}} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Count" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorScans)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 4. Top Providers List */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle>{t('admin.top_providers')}</CardTitle>
            <CardDescription>{t('admin.by_scans')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topProviders?.map((p) => (
                <div key={p.ID} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg border border-gray-100 p-1 bg-white flex items-center justify-center">
                      <img 
                        src={p.provider?.ImageUrl} 
                        alt={p.provider?.Name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {isRTL ? p.provider?.NameAr : p.provider?.Name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.TotalActiveOffers} {t('admin.offers')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-gray-900">{p.TotalScans}</span>
                    <span className="text-xs text-gray-500">{t('admin.scans')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;