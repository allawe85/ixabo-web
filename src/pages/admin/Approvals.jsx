import React from "react";
import { useTranslation } from "react-i18next";
import { useApprovals, useUpdateLeadStatus } from "../../hooks/useApprovals";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader, Check, X, Clock } from "lucide-react";

const Approvals = () => {
  const { t, i18n } = useTranslation();
  const { leads, isLoading } = useApprovals();
  const { mutate: updateStatus } = useUpdateLeadStatus();
  const isRTL = i18n.dir() === 'rtl';

  if (isLoading) return <div className="flex justify-center h-96 items-center"><Loader className="animate-spin text-brand-primary" size={32} /></div>;

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
      
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
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
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => updateStatus({id: lead.id, status: 'approved'})}>
                        <Check size={16} className="mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateStatus({id: lead.id, status: 'rejected'})}>
                        <X size={16} className="mr-1" /> Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default Approvals;