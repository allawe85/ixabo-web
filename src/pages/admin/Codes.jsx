import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Loader, Plus, MoreHorizontal, Trash2, Tags, Ticket, Calendar, Eye, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Imports
import { usePackageGroups, useDeletePackageGroup, useCreatePackageGroup, useGroupCodes } from "../../hooks/useCodes"; 
import { useDiscountCodes, useCreateDiscountCode, useDeleteDiscountCode } from "../../hooks/useDiscountCodes"; 
import { usePackages } from "../../hooks/usePackages"; // Need packages for the dropdown

const Codes = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const [activeTab, setActiveTab] = useState("subscription");
  const [search, setSearch] = useState("");

  // --- DATA ---
  const { groups: codeGroups, isLoading: loadingGroups } = usePackageGroups();
  const { codes: discountCodes, isLoading: loadingDiscounts } = useDiscountCodes();
  const { packages } = usePackages(); // For the dropdown

  // --- MUTATIONS ---
  const deleteGroup = useDeletePackageGroup();
  const createGroup = useCreatePackageGroup(); // New
  const createDiscount = useCreateDiscountCode();
  const deleteDiscount = useDeleteDiscountCode();

  // --- MODALS STATE ---
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountForm, setDiscountForm] = useState({ code: "", gold_price: "", gold_price_dollar: "", silver_price: "", silver_price_dollar: "", expiry: "" });

  // NEW: Group Modal State
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupForm, setGroupForm] = useState({ Name: "", PackageID: "", Count: "10", NetPrice: "" });

  // NEW: View Codes Modal State
  const [viewingGroupId, setViewingGroupId] = useState(null);
  const { codes: groupCodesList, isLoading: loadingGroupCodes } = useGroupCodes(viewingGroupId);


  // --- HANDLERS ---

  // 1. Create Discount
  const handleCreateDiscount = () => {
    if (!discountForm.code || !discountForm.expiry) {
      toast.warning(t('admin.fill_required_fields'));
      return;
    }
    createDiscount.mutate({
      code: discountForm.code,
      gold_price: parseFloat(discountForm.gold_price) || 0,
      gold_price_dollar: parseFloat(discountForm.gold_price_dollar) || 0,
      silver_price: parseFloat(discountForm.silver_price) || 0,
      silver_price_dollar: parseFloat(discountForm.silver_price_dollar) || 0,
      expiry: discountForm.expiry,
      usage: 0
    }, { onSuccess: () => setIsDiscountModalOpen(false) });
  };

  // 2. Create Group
  const handleCreateGroup = () => {
    if (!groupForm.Name || !groupForm.PackageID || !groupForm.Count || !groupForm.NetPrice) {
      toast.warning(t('admin.fill_required_fields'));
      return;
    }
    createGroup.mutate({
      name: groupForm.Name,
      packageId: parseInt(groupForm.PackageID),
      count: parseInt(groupForm.Count),
      netPrice: parseFloat(groupForm.NetPrice)
    }, { onSuccess: () => setIsGroupModalOpen(false) });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Code copied!");
  };

  const getUsagePercent = (used, total) => total ? Math.round((used / total) * 100) : 0;
  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString(i18n.language) : "-";
  const isExpired = (dateStr) => new Date(dateStr) < new Date();

  // --- RENDER ---

  if (loadingGroups || loadingDiscounts) return <div className="flex justify-center h-96 items-center"><Loader className="animate-spin text-brand-primary" size={32} /></div>;

  const filteredGroups = codeGroups?.filter(g => g.Name?.toLowerCase().includes(search.toLowerCase()));
  const filteredDiscounts = discountCodes?.filter(c => c.code?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.codes_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin.codes_subtitle')}</p>
        </div>
        
        {activeTab === 'subscription' ? (
          <Button className="bg-brand-primary" onClick={() => {
             setGroupForm({ Name: "", PackageID: "", Count: "10", NetPrice: "" });
             setIsGroupModalOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> {t('admin.add_group')}
          </Button>
        ) : (
          <Button className="bg-brand-primary" onClick={() => {
             const nextMonth = new Date(); nextMonth.setMonth(nextMonth.getMonth() + 1);
             setDiscountForm({ code: "", gold_price: "", gold_price_dollar: "", silver_price: "", silver_price_dollar: "", expiry: nextMonth.toISOString().split('T')[0] });
             setIsDiscountModalOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> {t('admin.add_discount')}
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="subscription">{t('admin.subscription_codes')}</TabsTrigger>
            <TabsTrigger value="discount">{t('admin.discount_codes')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:max-w-xs">
          <Search className={`absolute top-2.5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
          <Input placeholder={t('admin.search_placeholder')} className={isRTL ? 'pr-10' : 'pl-10'} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* --- TAB 1: GROUPS --- */}
      {activeTab === 'subscription' && (
        <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
          <Table dir={isRTL ? "rtl" : "ltr"}>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-start">{t('admin.group_name')}</TableHead>
                <TableHead className="text-start">{t('admin.package')}</TableHead>
                <TableHead className="text-start">{t('admin.net_price')}</TableHead>
                <TableHead className="text-start">{t('admin.usage')}</TableHead>
                <TableHead className="text-end">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups?.length > 0 ? (
                filteredGroups.map((group) => {
                  const percent = getUsagePercent(group.IsUsedCount, group.CodeCount);
                  return (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.Name}</TableCell>
                      <TableCell><span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-bold">{isRTL ? group.TitleAr : group.Title}</span></TableCell>
                      <TableCell>{group.NetPrice} JOD</TableCell>
                      <TableCell>
                        <div className="w-[120px]">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">{group.IsUsedCount}/{group.CodeCount}</span>
                            <span className="font-bold text-brand-primary">{percent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal size={16}/></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewingGroupId(group.id)}>
                               <Eye className="mr-2 h-4 w-4" /> {t('admin.view_codes')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => { if(confirm(t('admin.confirm_delete_generic'))) deleteGroup.mutate(group.id); }}>
                              <Trash2 className="mr-2 h-4 w-4" /> {t('admin.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow><TableCell colSpan={5} className="h-24 text-center text-gray-500">{t('admin.no_results')}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* --- TAB 2: DISCOUNTS --- */}
      {activeTab === 'discount' && (
        <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
           {/* ... (Same as before) ... */}
           {/* I'll omit this block to save space since you already have it in the previous file. Keep it as is. */}
           <Table dir={isRTL ? "rtl" : "ltr"}>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-start">{t('admin.code')}</TableHead>
                <TableHead className="text-start">Gold</TableHead>
                <TableHead className="text-start">Silver</TableHead>
                <TableHead className="text-start">{t('admin.expiry')}</TableHead>
                <TableHead className="text-start">{t('admin.usage')}</TableHead>
                <TableHead className="text-end">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiscounts?.map(c => (
                 <TableRow key={c.id}>
                    <TableCell className="font-bold text-brand-primary">{c.code}</TableCell>
                    <TableCell className="text-xs font-mono">{c.gold_price} / {c.gold_price_dollar}</TableCell>
                    <TableCell className="text-xs font-mono">{c.silver_price} / {c.silver_price_dollar}</TableCell>
                    <TableCell>{formatDate(c.expiry)}</TableCell>
                    <TableCell>{c.usage}</TableCell>
                    <TableCell className="text-end">
                       <Button variant="ghost" size="icon" className="text-red-500" onClick={() => { if(confirm(t('admin.confirm_delete_generic'))) deleteDiscount.mutate(c.id); }}><Trash2 size={16}/></Button>
                    </TableCell>
                 </TableRow>
              ))}
            </TableBody>
           </Table>
        </div>
      )}

      {/* --- MODAL 1: ADD GROUP --- */}
      <Dialog open={isGroupModalOpen} onOpenChange={setIsGroupModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>{t('admin.add_group')}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t('admin.group_name')}</Label>
              <Input placeholder="e.g. Orange Employees" value={groupForm.Name} onChange={e => setGroupForm({...groupForm, Name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.package')}</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={groupForm.PackageID} onChange={e => setGroupForm({...groupForm, PackageID: e.target.value})}>
                 <option value="">Select Package</option>
                 {packages?.map(p => <option key={p.ID} value={p.ID}>{isRTL ? p.TitleAr : p.Title}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t('admin.count')}</Label><Input type="number" value={groupForm.Count} onChange={e => setGroupForm({...groupForm, Count: e.target.value})} /></div>
              <div className="space-y-2"><Label>{t('admin.net_price')}</Label><Input type="number" value={groupForm.NetPrice} onChange={e => setGroupForm({...groupForm, NetPrice: e.target.value})} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGroupModalOpen(false)}>{t('admin.cancel')}</Button>
            <Button onClick={handleCreateGroup} disabled={createGroup.isPending} className="bg-brand-primary">
              {createGroup.isPending ? <Loader className="animate-spin" /> : t('admin.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL 2: ADD DISCOUNT --- */}
      <Dialog open={isDiscountModalOpen} onOpenChange={setIsDiscountModalOpen}>
         {/* ... (Same as previous implementation) ... */}
         <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{t('admin.add_discount')}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t('admin.code')} <span className="text-red-500">*</span></Label>
              <Input placeholder="e.g. SALE2024" value={discountForm.code} onChange={e => setDiscountForm({...discountForm, code: e.target.value.toUpperCase()})} />
            </div>
            <div className="grid grid-cols-2 gap-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
               <div className="col-span-2 text-xs font-bold text-yellow-700 uppercase">Gold Price</div>
               <div className="space-y-1"><Label className="text-xs">JOD</Label><Input type="number" value={discountForm.gold_price} onChange={e => setDiscountForm({...discountForm, gold_price: e.target.value})} /></div>
               <div className="space-y-1"><Label className="text-xs">USD</Label><Input type="number" value={discountForm.gold_price_dollar} onChange={e => setDiscountForm({...discountForm, gold_price_dollar: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
               <div className="col-span-2 text-xs font-bold text-gray-500 uppercase">Silver Price</div>
               <div className="space-y-1"><Label className="text-xs">JOD</Label><Input type="number" value={discountForm.silver_price} onChange={e => setDiscountForm({...discountForm, silver_price: e.target.value})} /></div>
               <div className="space-y-1"><Label className="text-xs">USD</Label><Input type="number" value={discountForm.silver_price_dollar} onChange={e => setDiscountForm({...discountForm, silver_price_dollar: e.target.value})} /></div>
            </div>
            <div className="space-y-2">
              <Label>{t('admin.expiry')}</Label>
              <Input type="date" value={discountForm.expiry} onChange={e => setDiscountForm({...discountForm, expiry: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDiscountModalOpen(false)}>{t('admin.cancel')}</Button>
            <Button onClick={handleCreateDiscount} disabled={createDiscount.isPending} className="bg-brand-primary">
              {createDiscount.isPending ? <Loader className="animate-spin" /> : t('admin.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- MODAL 3: VIEW CODES --- */}
      <Dialog open={!!viewingGroupId} onOpenChange={() => setViewingGroupId(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.view_codes')}</DialogTitle>
          </DialogHeader>

          {loadingGroupCodes ? <Loader className="mx-auto animate-spin" /> : 
           (groupCodesList?.length > 0 ? (
             <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-1">
                   {groupCodesList.map(item => (
                     <div key={item.id} className="flex justify-between items-center p-2 border rounded-md bg-gray-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer" onClick={() => copyToClipboard(item.Code)}>
                        <span className="font-mono text-sm font-bold tracking-wide text-gray-700">{item.Code}</span>
                        {item.IsUsed ? (
                          <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full">Used</span>
                        ) : (
                          <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 size={10}/> Free</span>
                        )}
                     </div>
                   ))}
                </div>
             </div>
           ) : <div className="text-center py-8 text-gray-500">No codes generated</div>)
          }

          <DialogFooter>
             <Button onClick={() => setViewingGroupId(null)}>{t('admin.close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Codes;