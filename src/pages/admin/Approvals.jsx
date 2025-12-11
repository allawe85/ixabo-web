import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApprovals, useUpdateLeadStatus, usePendingOffers, usePendingOfferMutations } from "../../hooks/useApprovals";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader, Check, X, Tag } from "lucide-react";

const Approvals = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [activeTab, setActiveTab] = useState("leads");

  // Leads Data
  const { leads, isLoading: loadingLeads } = useApprovals();
  const { mutate: updateLeadStatus } = useUpdateLeadStatus();

  // Offers Data
  const { offers, isLoading: loadingOffers } = usePendingOffers();
  const { approve, reject } = usePendingOfferMutations();

  if (loadingLeads || loadingOffers) return <div className="flex justify-center h-96 items-center"><Loader className="animate-spin text-brand-primary" size={32} /></div>;

  const StatusBadge = ({ status }) => {
    const colors = { new: "bg-yellow-50 text-yellow-700", approved: "bg-green-50 text-green-700", rejected: "bg-red-50 text-red-700" };
    return <span className={`px-2 py-1 rounded text-xs font-bold ${colors[status] || colors.new}`}>{status.toUpperCase()}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.approvals_title')}</h1>
        <p className="text-sm text-gray-500">{t('admin.approvals_subtitle')}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="leads">{t('admin.merchant_leads') || "Merchant Leads"}</TabsTrigger>
          <TabsTrigger value="offers">{t('admin.pending_offers') || "Pending Offers"}</TabsTrigger>
        </TabsList>

        {/* --- LEADS TAB --- */}
        {activeTab === 'leads' && (
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden mt-4">
            <Table dir={isRTL ? "rtl" : "ltr"}>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="text-start">{t('admin.business_name')}</TableHead>
                  <TableHead className="text-start">{t('admin.contact_person')}</TableHead>
                  <TableHead className="text-start">{t('admin.phone')}</TableHead>
                  <TableHead className="text-start">{t('admin.status')}</TableHead>
                  <TableHead className="text-end">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads?.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium text-start">{lead.business_name}</TableCell>
                    <TableCell className="text-start">{lead.contact_person}</TableCell>
                    <TableCell className="text-start font-mono text-sm">{lead.phone_number}</TableCell>
                    <TableCell className="text-start"><StatusBadge status={lead.status} /></TableCell>
                    <TableCell className="text-end flex gap-2 justify-end">
                      {lead.status === 'new' && (
                        <>
                          <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => updateLeadStatus({id: lead.id, status: 'approved'})}>
                            <Check size={16} className="mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateLeadStatus({id: lead.id, status: 'rejected'})}>
                            <X size={16} className="mr-1" /> Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {leads?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No leads found</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        )}

        {/* --- OFFERS TAB --- */}
        {activeTab === 'offers' && (
          <div className="border rounded-xl bg-white shadow-sm overflow-hidden mt-4">
            <Table dir={isRTL ? "rtl" : "ltr"}>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="text-start">{t('admin.provider')}</TableHead>
                  <TableHead className="text-start">{t('admin.offer_title')}</TableHead>
                  <TableHead className="text-start">{t('admin.type')}</TableHead>
                  <TableHead className="text-start">{t('admin.details')}</TableHead>
                  <TableHead className="text-end">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers?.map((offer) => (
                  <TableRow key={offer.ID}>
                    <TableCell className="font-medium text-start flex items-center gap-2">
                       <img src={offer.provider?.ImageUrl} className="w-6 h-6 rounded object-contain bg-gray-50 border"/>
                       {isRTL ? offer.provider?.NameAr : offer.provider?.Name}
                    </TableCell>
                    <TableCell className="text-start">{isRTL ? offer.TitleAr : offer.Title}</TableCell>
                    <TableCell className="text-start"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{isRTL ? offer.offer_type?.NameAr : offer.offer_type?.Name}</span></TableCell>
                    <TableCell className="text-start text-xs text-gray-500 max-w-xs truncate" title={isRTL ? offer.DetailsAr : offer.Details}>
                      {isRTL ? offer.DetailsAr : offer.Details}
                    </TableCell>
                    <TableCell className="text-end flex gap-2 justify-end">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => approve.mutate(offer.ID)}>
                        <Check size={16} className="mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => reject.mutate(offer.ID)}>
                        <X size={16} className="mr-1" /> Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {offers?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No pending offers</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default Approvals;