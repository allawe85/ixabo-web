import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotificationCampaigns, useCreateNotificationCampaign, useDeleteNotificationCampaign } from "../../hooks/useNotifications";
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
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Loader, 
  Trash2, 
  Bell,
  Send
} from "lucide-react";

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const { campaigns, isLoading, error } = useNotificationCampaigns();
  const { mutate: createCampaign, isPending: isCreating } = useCreateNotificationCampaign();
  const { mutate: deleteCampaign } = useDeleteNotificationCampaign();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    CampaignName: "",
    Title: "",
    Body: "",
    TitleAr: "",
    BodyAr: ""
  });

  const isRTL = i18n.dir() === 'rtl';

  // -- HANDLERS --

  const handleOpenAdd = () => {
    setFormData({ CampaignName: "", Title: "", Body: "", TitleAr: "", BodyAr: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.CampaignName || !formData.Title) {
      // Basic validation
      return; 
    }
    createCampaign(formData, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader className="animate-spin text-brand-primary" size={32} />
    </div>
  );

  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filteredCampaigns = campaigns?.filter((c) =>
    c.CampaignName?.toLowerCase().includes(search.toLowerCase()) ||
    c.Title?.toLowerCase().includes(search.toLowerCase())
  );

  const ActionMenu = ({ campaign }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => {
            if(confirm(t('admin.confirm_delete_generic'))) deleteCampaign(campaign.id);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" /> {t('admin.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.notifications_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin.notifications_subtitle')}</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-brand-primary hover:bg-brand-secondary w-full sm:w-auto">
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
          {t('admin.create_campaign')}
        </Button>
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
              <TableHead className="text-start">{t('admin.campaign_name')}</TableHead>
              <TableHead className="text-start">{t('admin.message_en')}</TableHead>
              <TableHead className="text-start">{t('admin.message_ar')}</TableHead>
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns?.length > 0 ? (
              filteredCampaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-gray-900 text-start">{c.CampaignName}</TableCell>
                  <TableCell className="text-start">
                    <p className="font-semibold text-sm">{c.Title}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{c.Body}</p>
                  </TableCell>
                  <TableCell className="text-start font-cairo">
                    <p className="font-semibold text-sm">{c.TitleAr}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{c.BodyAr}</p>
                  </TableCell>
                  <TableCell className="text-end">
                    <ActionMenu campaign={c} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                  {t('admin.no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredCampaigns?.length > 0 ? (
          filteredCampaigns.map((c) => (
            <Card key={c.id} className="shadow-sm border-gray-100">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                   <Bell size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 truncate">{c.CampaignName}</h3>
                    <ActionMenu campaign={c} />
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      <p className="font-bold">{c.Title}</p>
                      <p className="text-gray-500 text-xs">{c.Body}</p>
                    </div>
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

      {/* --- CREATE MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('admin.create_campaign')}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            
            <div className="space-y-2">
              <Label>{t('admin.campaign_name')} <span className="text-red-500">*</span></Label>
              <Input 
                required
                placeholder="e.g. Ramadan Offer Blast"
                value={formData.CampaignName}
                onChange={(e) => setFormData({...formData, CampaignName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              {/* English Section */}
              <div className="space-y-3">
                 <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">English Content</h4>
                 <div className="space-y-2">
                    <Label>{t('admin.title_en')}</Label>
                    <Input 
                      required
                      placeholder="Notification Title"
                      value={formData.Title}
                      onChange={(e) => setFormData({...formData, Title: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label>{t('admin.message_en')}</Label>
                    <textarea 
                      required
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Notification Body..."
                      value={formData.Body}
                      onChange={(e) => setFormData({...formData, Body: e.target.value})}
                    />
                 </div>
              </div>

              {/* Arabic Section */}
              <div className="space-y-3">
                 <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Arabic Content</h4>
                 <div className="space-y-2">
                    <Label>{t('admin.title_ar')}</Label>
                    <Input 
                      className="font-cairo"
                      placeholder="عنوان الإشعار"
                      value={formData.TitleAr}
                      onChange={(e) => setFormData({...formData, TitleAr: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <Label>{t('admin.message_ar')}</Label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-cairo"
                      placeholder="نص الإشعار..."
                      value={formData.BodyAr}
                      onChange={(e) => setFormData({...formData, BodyAr: e.target.value})}
                    />
                 </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                {t('admin.cancel')}
              </Button>
              <Button type="submit" disabled={isCreating} className="bg-brand-primary">
                {isCreating ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {t('admin.send_campaign')}
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Notifications;