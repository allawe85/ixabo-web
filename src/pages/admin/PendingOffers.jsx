import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePendingOffers, usePendingOfferMutations } from "../../hooks/usePendingOffers";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader, CheckCircle, XCircle, Tag, Calendar } from "lucide-react";

const PendingOffers = () => {
  const { t, i18n } = useTranslation();
  const { offers, isLoading } = usePendingOffers();
  const { approve, reject } = usePendingOfferMutations();
  const [search, setSearch] = useState("");
  const isRTL = i18n.dir() === 'rtl';

  if (isLoading) return <div className="flex justify-center h-96 items-center"><Loader className="animate-spin text-brand-primary" size={32} /></div>;

  const filteredOffers = offers?.filter(o => 
    o.Title?.toLowerCase().includes(search.toLowerCase()) || 
    o.provider?.Name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) => d ? new Date(d).toLocaleDateString(i18n.language) : "-";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.pending_offers_title')}</h1>
        <p className="text-sm text-gray-500">{t('admin.pending_offers_subtitle')}</p>
      </div>

      {/* Filter */}
      <div className="relative max-w-sm">
        <Search className={`absolute top-2.5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
        <Input placeholder={t('admin.search_placeholder')} className={isRTL ? 'pr-10' : 'pl-10'} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table dir={isRTL ? "rtl" : "ltr"}>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-start">{t('admin.provider')}</TableHead>
              <TableHead className="text-start">{t('admin.offer')}</TableHead>
              <TableHead className="text-start">{t('admin.type')}</TableHead>
              <TableHead className="text-start">{t('admin.valid_to')}</TableHead>
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOffers?.length > 0 ? (
              filteredOffers.map((offer) => (
                <TableRow key={offer.ID}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                       <img src={offer.provider?.ImageUrl} className="w-8 h-8 rounded-full border bg-gray-50 object-contain" />
                       <span className="font-medium text-sm">{isRTL ? offer.provider?.NameAr : offer.provider?.Name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                       <p className="font-bold text-sm text-gray-900 truncate">{isRTL ? offer.TitleAr : offer.Title}</p>
                       <p className="text-xs text-gray-500 truncate">{isRTL ? offer.DetailsAr : offer.Details}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                     <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {isRTL ? offer.offer_type?.NameAr : offer.offer_type?.Name}
                     </span>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm font-mono">
                     {formatDate(offer.EffectiveTo)}
                  </TableCell>
                  <TableCell className="text-end">
                     <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white h-8" 
                          onClick={() => { if(confirm(t('admin.confirm_approve'))) approve.mutate(offer.ID); }}
                        >
                           <CheckCircle size={16} className="mr-1" /> {t('admin.approve')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="h-8" 
                          onClick={() => { if(confirm(t('admin.confirm_reject'))) reject.mutate(offer.ID); }}
                        >
                           <XCircle size={16} className="mr-1" /> {t('admin.reject')}
                        </Button>
                     </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="h-24 text-center text-gray-500">{t('admin.no_results')}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-4">
         {filteredOffers?.map(offer => (
            <Card key={offer.ID} className="shadow-sm border-gray-100">
               <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                     <img src={offer.provider?.ImageUrl} className="w-10 h-10 rounded-full border bg-gray-50 object-contain" />
                     <div>
                        <h4 className="font-bold text-sm">{isRTL ? offer.provider?.NameAr : offer.provider?.Name}</h4>
                        <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{isRTL ? offer.offer_type?.NameAr : offer.offer_type?.Name}</span>
                     </div>
                  </div>
                  <h3 className="font-bold text-gray-900">{isRTL ? offer.TitleAr : offer.Title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{isRTL ? offer.DetailsAr : offer.Details}</p>
                  
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                     <div className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} /> {formatDate(offer.EffectiveTo)}</div>
                     <div className="flex gap-2">
                        <Button size="icon" className="h-8 w-8 bg-green-600 hover:bg-green-700 rounded-full" onClick={() => approve.mutate(offer.ID)}><CheckCircle size={16} /></Button>
                        <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={() => reject.mutate(offer.ID)}><XCircle size={16} /></Button>
                     </div>
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>
    </div>
  );
};

export default PendingOffers;