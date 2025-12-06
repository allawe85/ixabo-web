import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Loader, CreditCard, Calendar } from "lucide-react";

const Subscriptions = () => {
  const { t, i18n } = useTranslation();
  const { subscriptions, isLoading, error } = useSubscriptions();
  const [search, setSearch] = useState("");

  const isRTL = i18n.dir() === 'rtl';

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader className="animate-spin text-brand-primary" size={32} />
    </div>
  );

  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filteredSubs = subscriptions?.filter((sub) =>
    sub.Name?.toLowerCase().includes(search.toLowerCase()) ||
    sub.Email?.toLowerCase().includes(search.toLowerCase()) ||
    sub.PhoneNumber?.includes(search)
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString(i18n.language);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.subscriptions_title')}</h1>
        <p className="text-sm text-gray-500">{t('admin.subscriptions_subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 w-full sm:max-w-sm relative">
        <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
        <Input 
          placeholder={t('admin.search_placeholder')} 
          className={isRTL ? 'pr-10' : 'pl-10'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table dir={isRTL ? "rtl" : "ltr"}>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-start">{t('admin.user')}</TableHead>
              <TableHead className="text-start">{t('admin.package')}</TableHead>
              <TableHead className="text-start">{t('admin.amount')}</TableHead>
              <TableHead className="text-start">{t('admin.purchase_date')}</TableHead>
              <TableHead className="text-start">{t('admin.expiry_date')}</TableHead>
              <TableHead className="text-start">{t('admin.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubs?.length > 0 ? (
              filteredSubs.map((sub) => (
                <TableRow key={sub.OrderID}>
                  <TableCell className="text-start">
                    <div>
                      <p className="font-medium text-gray-900">{sub.Name}</p>
                      <p className="text-xs text-gray-500 font-mono">{sub.PhoneNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-start font-medium text-brand-primary">
                    {isRTL ? sub.TitleAr : sub.Title}
                  </TableCell>
                  <TableCell className="text-start">
                    {/* Assuming Price is in Order table or Package table - ViewSubscribtion doesn't strictly explicitly show price column in snippet, but usually it's there. If not, remove this column */}
                    {sub.Price ? `${sub.Price} JOD` : '-'}
                  </TableCell>
                  <TableCell className="text-start text-gray-600">
                    {formatDate(sub.CreatedAt)}
                  </TableCell>
                  <TableCell className="text-start text-gray-600">
                    {formatDate(sub.ExpiryDate)}
                  </TableCell>
                  <TableCell className="text-start">
                    {sub.IsPayed ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        {t('admin.paid')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                        {t('admin.pending')}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  {t('admin.no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredSubs?.length > 0 ? (
          filteredSubs.map((sub) => (
            <Card key={sub.OrderID} className="shadow-sm border-gray-100">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{sub.Name}</h3>
                    <p className="text-xs text-gray-500">{sub.PhoneNumber}</p>
                  </div>
                  {sub.IsPayed ? (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                      {t('admin.paid')}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                      {t('admin.pending')}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-brand-primary font-medium">
                  <CreditCard size={16} />
                  <span>{isRTL ? sub.TitleAr : sub.Title}</span>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100">
                   <div className="flex items-center gap-1">
                     <Calendar size={14} />
                     {t('admin.purchased')}: {formatDate(sub.CreatedAt)}
                   </div>
                   <div>
                     {t('admin.expires')}: {formatDate(sub.ExpiryDate)}
                   </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            {t('admin.no_results')}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;