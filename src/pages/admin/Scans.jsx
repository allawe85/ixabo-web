import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useScans, useUpdateScan } from "../../hooks/useScans";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Loader, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  QrCode
} from "lucide-react";

// Fake current user ID for now (In real app, get from Auth Context)
const CURRENT_USER_ID = "admin_user"; 

const Scans = () => {
  const { t, i18n } = useTranslation();
  const { scans, isLoading, error } = useScans();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateScan();
  const [search, setSearch] = useState("");

  const isRTL = i18n.dir() === 'rtl';

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader className="animate-spin text-brand-primary" size={32} />
    </div>
  );

  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filteredScans = scans?.filter((s) =>
    s.UserFullName?.toLowerCase().includes(search.toLowerCase()) ||
    s.ProviderName?.toLowerCase().includes(search.toLowerCase()) ||
    s.OfferDetails?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (id, newStatus) => {
    updateStatus({ id, status: newStatus, userId: CURRENT_USER_ID });
  };

  const StatusBadge = ({ status }) => {
    if (status === 'COMPLETE') return <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-100">{status}</span>;
    if (status === 'REJECT') return <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-100">{status}</span>;
    return <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-bold border border-yellow-100">{status}</span>;
  };

  const formatDate = (dateStr) => {
    if(!dateStr) return "-";
    return new Date(dateStr).toLocaleString(i18n.language);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.scans_title')}</h1>
        <p className="text-sm text-gray-500">{t('admin.scans_subtitle')}</p>
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
              <TableHead className="text-start">{t('admin.provider')}</TableHead>
              <TableHead className="text-start">{t('admin.offer')}</TableHead>
              <TableHead className="text-start">{t('admin.date')}</TableHead>
              <TableHead className="text-start">{t('admin.status')}</TableHead>
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScans?.length > 0 ? (
              filteredScans.map((scan) => (
                <TableRow key={scan.id}>
                  <TableCell className="text-start">
                    <div>
                      <p className="font-medium text-gray-900">{scan.UserFullName}</p>
                      <p className="text-xs text-gray-500 font-mono">{scan.UserPhoneNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-start text-sm text-gray-600">
                    {isRTL ? scan.ProviderNameAr : scan.ProviderName}
                  </TableCell>
                  <TableCell className="text-start text-sm text-gray-600 max-w-xs truncate" title={scan.OfferDetails}>
                    {isRTL ? scan.OfferDetailsAr : scan.OfferDetails}
                  </TableCell>
                  <TableCell className="text-start text-xs text-gray-500 font-mono">
                    {formatDate(scan.ScanDate)}
                  </TableCell>
                  <TableCell className="text-start">
                    <StatusBadge status={scan.Status} />
                  </TableCell>
                  <TableCell className="text-end">
                    {scan.Status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                         <Button 
                           size="sm" 
                           className="bg-green-600 hover:bg-green-700 text-white h-8 px-2"
                           onClick={() => handleAction(scan.id, 'COMPLETE')}
                           disabled={isUpdating}
                         >
                           <CheckCircle size={16} />
                         </Button>
                         <Button 
                           size="sm" 
                           variant="destructive"
                           className="h-8 px-2"
                           onClick={() => handleAction(scan.id, 'REJECT')}
                           disabled={isUpdating}
                         >
                           <XCircle size={16} />
                         </Button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
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
        {filteredScans?.length > 0 ? (
          filteredScans.map((scan) => (
            <Card key={scan.id} className="shadow-sm border-gray-100">
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{scan.UserFullName}</h3>
                      <p className="text-xs text-gray-500">{isRTL ? scan.ProviderNameAr : scan.ProviderName}</p>
                    </div>
                  </div>
                  <StatusBadge status={scan.Status} />
                </div>
                
                <div className="bg-gray-50 p-2 rounded text-sm text-gray-700">
                   <QrCode size={14} className="inline mr-2 text-brand-primary"/>
                   {isRTL ? scan.OfferDetailsAr : scan.OfferDetails}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {formatDate(scan.ScanDate)}
                  </div>
                  
                  {scan.Status === 'PENDING' && (
                    <div className="flex gap-2">
                       <Button 
                           size="sm" 
                           className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0 rounded-full"
                           onClick={() => handleAction(scan.id, 'COMPLETE')}
                         >
                           <CheckCircle size={16} />
                         </Button>
                         <Button 
                           size="sm" 
                           variant="destructive"
                           className="h-8 w-8 p-0 rounded-full"
                           onClick={() => handleAction(scan.id, 'REJECT')}
                         >
                           <XCircle size={16} />
                         </Button>
                    </div>
                  )}
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

export default Scans;