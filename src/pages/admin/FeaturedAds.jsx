import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { 
  useFeaturedAds, 
  useFeaturedAdMutations, 
  useProviderSearch 
} from "../../hooks/useFeaturedAds";
import { uploadImage } from "../../services/storage";
import {
  Card, CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { 
  MoreHorizontal, Plus, Search, Loader, Trash2, 
  Calendar, Image as ImageIcon, Upload
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const FeaturedAds = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  
  // Data
  const { ads, isLoading } = useFeaturedAds();
  const { create, remove } = useFeaturedAdMutations();

  // State
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    ProviderID: "",
    StartDate: "",
    EndDate: "",
    ImageUrl: ""
  });
  const [providerSearch, setProviderSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  // Provider Search Hook
  const { providers: searchResults, isLoading: searching } = useProviderSearch(providerSearch);

  // Image Upload
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

  // --- HANDLERS ---

  const handleOpenAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    setFormData({
      ProviderID: "",
      StartDate: today,
      EndDate: nextMonth.toISOString().split('T')[0],
      ImageUrl: ""
    });
    setProviderSearch("");
    setSelectedProvider(null);
    setImageFile(null);
    setPreview("");
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const selectProvider = (p) => {
    setSelectedProvider(p);
    setFormData(prev => ({ ...prev, ProviderID: p.ID }));
    setProviderSearch(""); // Clear search list
  };

  const handleSubmit = async () => {
    if (!formData.ProviderID || !formData.StartDate || !formData.EndDate) {
      toast.warning(t('admin.fill_required_fields'));
      return;
    }

    if (!imageFile && !formData.ImageUrl) {
      toast.warning("Please upload an image");
      return;
    }

    let finalUrl = formData.ImageUrl;
    if (imageFile) {
      try {
        toast.info("Uploading banner...");
        finalUrl = await uploadImage(imageFile);
      } catch (error) {
        toast.error("Image upload failed");
        return;
      }
    }

    create.mutate({
      ProviderID: formData.ProviderID,
      StartDate: formData.StartDate,
      EndDate: formData.EndDate,
      ImageUrl: finalUrl
    }, {
      onSuccess: () => setIsModalOpen(false)
    });
  };

  const isActive = (end) => new Date(end) >= new Date();
  const formatDate = (d) => new Date(d).toLocaleDateString(i18n.language);

  // --- RENDER ---

  if (isLoading) return <div className="flex justify-center h-96 items-center"><Loader className="animate-spin text-brand-primary" size={32} /></div>;

  const filteredAds = ads?.filter(a => a.ProviderName?.toLowerCase().includes(search.toLowerCase()));

  const ActionMenu = ({ ad }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal size={16}/></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
        <DropdownMenuItem className="text-red-600" onClick={() => { if(confirm(t('admin.confirm_delete_generic'))) remove.mutate(ad.id); }}>
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
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.featured_ads_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin.featured_ads_subtitle')}</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-brand-primary hover:bg-brand-secondary w-full sm:w-auto">
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('admin.add_ad')}
        </Button>
      </div>

      {/* Filter */}
      <div className="relative w-full sm:max-w-xs">
        <Search className={`absolute top-2.5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
        <Input placeholder={t('admin.search_placeholder')} className={isRTL ? 'pr-10' : 'pl-10'} value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAds?.map(ad => (
          <Card key={ad.id} className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="h-32 bg-gray-100 relative">
               <img src={ad.ImageUrl} className="w-full h-full object-cover" alt="Ad" />
               <div className="absolute top-2 right-2">
                 <span className={`px-2 py-1 rounded text-[10px] font-bold shadow-sm ${isActive(ad.EndDate) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {isActive(ad.EndDate) ? 'ACTIVE' : 'EXPIRED'}
                 </span>
               </div>
             </div>
             <CardContent className="p-4">
               <div className="flex justify-between items-start">
                 <div>
                   <h3 className="font-bold text-gray-900">{isRTL ? ad.ProviderNameAr : ad.ProviderName}</h3>
                   <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                     <Calendar size={12}/> {formatDate(ad.StartDate)} - {formatDate(ad.EndDate)}
                   </div>
                 </div>
                 <ActionMenu ad={ad} />
               </div>
             </CardContent>
          </Card>
        ))}
        {filteredAds?.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">{t('admin.no_results')}</div>
        )}
      </div>

      {/* --- ADD MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>{t('admin.add_ad')}</DialogTitle></DialogHeader>
          
          <div className="space-y-4 py-2">
             {/* 1. Provider Search */}
             <div className="space-y-2 relative">
                <Label>{t('admin.provider')} <span className="text-red-500">*</span></Label>
                {!selectedProvider ? (
                  <div className="relative">
                    <Search className={`absolute top-2.5 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input 
                      placeholder="Search provider..." 
                      className={isRTL ? 'pr-9' : 'pl-9'}
                      value={providerSearch}
                      onChange={e => setProviderSearch(e.target.value)}
                    />
                    {/* Results Dropdown */}
                    {providerSearch.length > 1 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                         {searching ? <div className="p-2 text-xs text-center">Loading...</div> : 
                          searchResults?.map(p => (
                            <div key={p.ID} className="p-2 hover:bg-gray-50 cursor-pointer text-sm" onClick={() => selectProvider(p)}>
                               {isRTL ? p.NameAr : p.Name}
                            </div>
                          ))
                         }
                         {!searching && searchResults?.length === 0 && <div className="p-2 text-xs text-gray-500 text-center">No results</div>}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 border rounded-md bg-blue-50 border-blue-100">
                     <span className="font-bold text-blue-700 text-sm">{isRTL ? selectedProvider.NameAr : selectedProvider.Name}</span>
                     <Button variant="ghost" size="sm" onClick={() => setSelectedProvider(null)} className="h-6 w-6 p-0 hover:bg-blue-100"><Trash2 size={14}/></Button>
                  </div>
                )}
             </div>

             {/* 2. Image Upload */}
             <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center cursor-pointer border overflow-hidden" onClick={() => fileInputRef.current.click()}>
                   {preview ? <img src={preview} className="w-full h-full object-cover"/> : <ImageIcon className="text-gray-400"/>}
                </div>
                <div className="flex-1">
                   <Button variant="outline" size="sm" onClick={() => fileInputRef.current.click()}>{t('admin.upload_image')}</Button>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>
             </div>

             {/* 3. Dates */}
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label>{t('admin.valid_from')}</Label>
                   <Input type="date" value={formData.StartDate} onChange={e => setFormData({...formData, StartDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <Label>{t('admin.valid_to')}</Label>
                   <Input type="date" value={formData.EndDate} onChange={e => setFormData({...formData, EndDate: e.target.value})} />
                </div>
             </div>
          </div>

          <DialogFooter>
             <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t('admin.cancel')}</Button>
             <Button onClick={handleSubmit} disabled={create.isPending} className="bg-brand-primary">
                {create.isPending ? <Loader className="animate-spin" /> : t('admin.save')}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeaturedAds;