import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader, Trash2, Plus, Pencil, Tag, Upload, Image as ImageIcon } from "lucide-react";
import { useProviderOffers, useOfferMutations, useOfferMetadata } from "../../../hooks/useOffers";
import { uploadImage } from "../../../services/storage";
import { useAuth } from "../../../context/AuthContext"; // Import Auth
import { toast } from "sonner";

const OffersManager = ({ isOpen, onClose, providerId }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const { user } = useAuth(); // Get user role
  const isAdmin = user?.Role === 'ADMIN'; // Check permission
  
  const { offers, isLoading } = useProviderOffers(providerId);
  const { types, categories } = useOfferMetadata(); 
  const mutations = useOfferMutations(providerId);

  // --- STATE ---
  const [activeTab, setActiveTab] = useState("normal");
  const [editingOffer, setEditingOffer] = useState(null);
  
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

  const normalOffers = offers?.filter(o => !o.IsLimited) || [];
  const limitedOffers = offers?.filter(o => o.IsLimited) || [];

  const getTypeName = (id) => types?.find(t => t.ID === id)?.Name || 'Unknown';

  // --- HANDLERS ---
  const handleAdd = () => {
    setEditingOffer({});
    setFormData({
      Title: "", TitleAr: "", Details: "", DetailsAr: "",
      CategoryID: categories?.[0]?.ID || "",
      OfferTypeID: types?.[0]?.ID || "",
      MaxUsage: "100", SilverMaxUsage: "50", BronzeMaxUsage: "10",
      OfferValue1: "0", OfferValue2: "0",
      IsActive: false, // Default to false
      IsForGuests: false, IsAvailableForDelivery: false,
      IsLimited: activeTab === 'limited',
      ImageUrl: ""
    });
    setPreview("");
    setImageFile(null);
  };

  const handleEdit = (offer) => {
    // SECURITY CHECK: Providers cannot edit offers
    if (!isAdmin) return; 

    setEditingOffer(offer);
    setPreview(offer.ImageUrl || "");
    setImageFile(null);
    setFormData({
      Title: offer.Title, TitleAr: offer.TitleAr,
      Details: offer.Details, DetailsAr: offer.DetailsAr,
      CategoryID: offer.CategoryID,
      OfferTypeID: offer.OfferTypeID,
      MaxUsage: offer.MaxUsage,
      SilverMaxUsage: offer.SilverMaxUsage,
      BronzeMaxUsage: offer.BronzeMaxUsage,
      OfferValue1: offer.OfferValue1,
      OfferValue2: offer.OfferValue2,
      IsActive: offer.IsActive,
      IsForGuests: offer.IsForGuests,
      IsAvailableForDelivery: offer.IsAvailableForDelivery,
      IsLimited: offer.IsLimited,
      ImageUrl: offer.ImageUrl
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!formData.Title) { toast.warning(t('admin.fill_required_fields')); return; }

    let finalUrl = formData.ImageUrl;
    if (imageFile) {
      try {
        toast.info("Uploading image...");
        finalUrl = await uploadImage(imageFile);
      } catch (e) { toast.error("Upload failed"); return; }
    }

    // Force IsActive to false if not admin (Approval Workflow)
    const finalIsActive = isAdmin ? formData.IsActive : false;

    const payload = {
      ProviderID: providerId,
      ...formData,
      IsActive: finalIsActive, 
      ImageUrl: finalUrl,
      MaxUsage: parseInt(formData.MaxUsage),
      SilverMaxUsage: parseInt(formData.SilverMaxUsage),
      BronzeMaxUsage: parseInt(formData.BronzeMaxUsage),
      OfferValue1: parseFloat(formData.OfferValue1),
      OfferValue2: parseFloat(formData.OfferValue2),
    };

    const options = { 
      onSuccess: () => {
        setEditingOffer(null);
        if (!isAdmin) toast.info("Offer submitted for approval");
      }
    };

    if (editingOffer.ID) {
      if (!isAdmin) return; // Double check
      mutations.update.mutate({ id: editingOffer.ID, ...payload }, options);
    } else {
      mutations.create.mutate(payload, options);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingOffer ? (editingOffer.ID ? t('admin.edit_offer') : t('admin.add_offer')) : t('admin.manage_offers')}</DialogTitle>
        </DialogHeader>

        {!editingOffer && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="normal">{t('admin.standard_offers')}</TabsTrigger>
                <TabsTrigger value="limited">{t('admin.limited_offers')}</TabsTrigger>
              </TabsList>
              <Button size="sm" onClick={handleAdd} className="bg-brand-primary">
                <Plus className="mr-2 h-4 w-4" /> {t('admin.add_new')}
              </Button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto p-1">
              {isLoading ? <Loader className="mx-auto animate-spin" /> : 
               (activeTab === 'normal' ? normalOffers : limitedOffers).map(offer => (
                <div key={offer.ID} className="flex gap-4 p-3 border rounded-lg bg-white shadow-sm hover:border-brand-primary/50 transition-colors">
                   <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                      {offer.ImageUrl ? (
                        <img src={offer.ImageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Tag className="w-6 h-6 text-gray-400" /></div>
                      )}
                   </div>
                   
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                         <h4 className="font-bold text-gray-900 truncate">{isRTL ? offer.TitleAr : offer.Title}</h4>
                         <div className="flex gap-1">
                            {/* RESTRICTION: Only Admin can Edit/Delete */}
                            {isAdmin && (
                              <>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(offer)}><Pencil size={14} /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => { if(confirm(t('admin.confirm_delete_generic'))) mutations.remove.mutate(offer.ID); }}><Trash2 size={14} /></Button>
                              </>
                            )}
                         </div>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">{isRTL ? offer.DetailsAr : offer.Details}</p>
                      
                      <div className="flex gap-2 mt-2">
                         {offer.IsActive ? 
                           <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{t('admin.active')}</span> : 
                           <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">{t('admin.pending_approval') || 'Pending'}</span>
                         }
                         
                         <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{getTypeName(offer.OfferTypeID)}</span>
                         <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Max: {offer.MaxUsage}</span>
                      </div>
                   </div>
                </div>
              ))}
              {!isLoading && ((activeTab === 'normal' ? normalOffers : limitedOffers).length === 0) && (
                <div className="text-center py-10 text-gray-500">{t('admin.no_results')}</div>
              )}
            </div>
          </Tabs>
        )}

        {editingOffer && (
          <div className="space-y-4">
             {/* ... Image Upload Section (Same) ... */}
             <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center cursor-pointer border overflow-hidden" onClick={() => fileInputRef.current.click()}>
                   {preview ? <img src={preview} className="w-full h-full object-cover"/> : <ImageIcon className="text-gray-400"/>}
                </div>
                <div className="flex-1">
                   <Button variant="outline" size="sm" onClick={() => fileInputRef.current.click()}>{t('admin.upload_image')}</Button>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>{t('admin.title_en')}</Label><Input value={formData.Title || ''} onChange={e => setFormData({...formData, Title: e.target.value})} /></div>
                <div className="space-y-2"><Label>{t('admin.title_ar')}</Label><Input className="font-cairo" value={formData.TitleAr || ''} onChange={e => setFormData({...formData, TitleAr: e.target.value})} /></div>
                <div className="space-y-2 col-span-2"><Label>{t('admin.desc_en')}</Label><Input value={formData.Details || ''} onChange={e => setFormData({...formData, Details: e.target.value})} /></div>
                <div className="space-y-2 col-span-2"><Label>{t('admin.desc_ar')}</Label><Input className="font-cairo" value={formData.DetailsAr || ''} onChange={e => setFormData({...formData, DetailsAr: e.target.value})} /></div>
             </div>

             <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-lg">
                <div className="space-y-2">
                   <Label>{t('admin.category')}</Label>
                   <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.CategoryID || ''} onChange={e => setFormData({...formData, CategoryID: e.target.value})}>
                      <option value="">Select...</option>
                      {categories?.map(c => <option key={c.ID} value={c.ID}>{isRTL ? c.NameAr : c.Name}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <Label>{t('admin.offer_type')}</Label>
                   <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.OfferTypeID || ''} onChange={e => setFormData({...formData, OfferTypeID: e.target.value})}>
                      <option value="">Select...</option>
                      {types?.map(t => <option key={t.ID} value={t.ID}>{isRTL ? t.NameAr : t.Name}</option>)}
                   </select>
                </div>
                <div className="space-y-2"><Label>Value 1</Label><Input type="number" value={formData.OfferValue1 || ''} onChange={e => setFormData({...formData, OfferValue1: e.target.value})} /></div>
                <div className="space-y-2"><Label>Value 2</Label><Input type="number" value={formData.OfferValue2 || ''} onChange={e => setFormData({...formData, OfferValue2: e.target.value})} /></div>
             </div>

             <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1"><Label className="text-xs">Total Max</Label><Input type="number" value={formData.MaxUsage || ''} onChange={e => setFormData({...formData, MaxUsage: e.target.value})} /></div>
                <div className="space-y-1"><Label className="text-xs">Silver Max</Label><Input type="number" value={formData.SilverMaxUsage || ''} onChange={e => setFormData({...formData, SilverMaxUsage: e.target.value})} /></div>
                <div className="space-y-1"><Label className="text-xs">Bronze Max</Label><Input type="number" value={formData.BronzeMaxUsage || ''} onChange={e => setFormData({...formData, BronzeMaxUsage: e.target.value})} /></div>
             </div>

             <div className="flex gap-4 pt-2 flex-wrap">
                {/* RESTRICTION: Only Admin can toggle Active */}
                {isAdmin && (
                  <div className="flex items-center gap-2"><Checkbox checked={formData.IsActive || false} onCheckedChange={c => setFormData({...formData, IsActive: c})} /><Label>{t('admin.active_status')}</Label></div>
                )}
                <div className="flex items-center gap-2"><Checkbox checked={formData.IsForGuests || false} onCheckedChange={c => setFormData({...formData, IsForGuests: c})} /><Label>Guests</Label></div>
                <div className="flex items-center gap-2"><Checkbox checked={formData.IsAvailableForDelivery || false} onCheckedChange={c => setFormData({...formData, IsAvailableForDelivery: c})} /><Label>Delivery</Label></div>
             </div>

             <DialogFooter>
                <Button variant="outline" onClick={() => setEditingOffer(null)}>{t('admin.cancel')}</Button>
                <Button onClick={handleSave} className="bg-brand-primary">{t('admin.save')}</Button>
             </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OffersManager;