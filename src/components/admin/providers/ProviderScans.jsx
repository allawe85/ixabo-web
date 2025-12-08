import React from "react";
import { useTranslation } from "react-i18next";
import { useProviderScans, useUpdateScan } from "../../../hooks/useScans";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader, CheckCircle, XCircle, Clock, User, QrCode } from "lucide-react";

const ProviderScans = ({ isOpen, onClose, providerId, providerName }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  
  const { scans, isLoading } = useProviderScans(providerId);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateScan();

  const handleAction = (id, newStatus) => {
    // In a real app, pass the current admin user ID here
    updateStatus({ id, status: newStatus, userId: 'admin' }); 
  };

  const formatDate = (dateStr) => {
    if(!dateStr) return "-";
    return new Date(dateStr).toLocaleString(i18n.language);
  };

  const StatusBadge = ({ status }) => {
    if (status === 'COMPLETE') return <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-100">{status}</span>;
    if (status === 'REJECT') return <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold border border-red-100">{status}</span>;
    return <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-bold border border-yellow-100">{status}</span>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.scans_for')} {providerName}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin text-brand-primary" size={32} />
          </div>
        ) : (
          <div className="space-y-4">
            {scans?.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table dir={isRTL ? "rtl" : "ltr"}>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="text-start">{t('admin.user')}</TableHead>
                      <TableHead className="text-start">{t('admin.offer')}</TableHead>
                      <TableHead className="text-start">{t('admin.date')}</TableHead>
                      <TableHead className="text-start">{t('admin.status')}</TableHead>
                      <TableHead className="text-end">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scans.map((scan) => (
                      <TableRow key={scan.id}>
                        <TableCell className="text-start">
                          <div>
                            <p className="font-medium text-gray-900">{scan.UserFullName}</p>
                            <p className="text-xs text-gray-500 font-mono">{scan.UserPhoneNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-start">
                          <div className="max-w-[200px] truncate text-sm" title={isRTL ? scan.OfferDetailsAr : scan.OfferDetails}>
                             {isRTL ? scan.OfferDetailsAr : scan.OfferDetails}
                          </div>
                        </TableCell>
                        <TableCell className="text-start text-xs text-gray-500 font-mono">
                          {formatDate(scan.ScanDate)}
                        </TableCell>
                        <TableCell className="text-start">
                          <StatusBadge status={scan.Status} />
                        </TableCell>
                        <TableCell className="text-end">
                          {scan.Status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-1">
                               <Button 
                                 size="icon" 
                                 variant="ghost"
                                 className="h-8 w-8 text-green-600 hover:bg-green-50"
                                 onClick={() => handleAction(scan.id, 'COMPLETE')}
                                 disabled={isUpdating}
                               >
                                 <CheckCircle size={18} />
                               </Button>
                               <Button 
                                 size="icon" 
                                 variant="ghost"
                                 className="h-8 w-8 text-red-600 hover:bg-red-50"
                                 onClick={() => handleAction(scan.id, 'REJECT')}
                                 disabled={isUpdating}
                               >
                                 <XCircle size={18} />
                               </Button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-xl">
                {t('admin.no_results')}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('admin.close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderScans;