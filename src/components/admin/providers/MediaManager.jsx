import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { uploadImage } from "../../../services/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Trash2, Plus, Pencil, Image as ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";

const MediaManager = ({ 
  isOpen, 
  onClose, 
  title, 
  items, 
  isLoading, 
  mutations, // { create, update, remove }
  providerId,
  hasDescription = false // Gallery has descriptions, Menu does not
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  
  // Local state for the "Add/Edit" sub-view
  const [editingItem, setEditingItem] = useState(null); // null = list view, {} = add mode, {id...} = edit mode
  const [formData, setFormData] = useState({ ImageOrder: "1", ImageUrl: "", Description: "", DescriptionAr: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

  const handleEditClick = (item) => {
    setFormData({
      ImageOrder: item.ImageOrder?.toString() || "1",
      ImageUrl: item.ImageUrl || "",
      Description: item.Description || "",
      DescriptionAr: item.DescriptionAr || ""
    });
    setPreview(item.ImageUrl || "");
    setImageFile(null);
    setEditingItem(item);
  };

  const handleAddClick = () => {
    setFormData({ ImageOrder: (items?.length + 1).toString(), ImageUrl: "", Description: "", DescriptionAr: "" });
    setPreview("");
    setImageFile(null);
    setEditingItem({}); // Empty object signifies "New"
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!formData.ImageUrl && !imageFile) {
      toast.warning("Please select an image");
      return;
    }

    let finalUrl = formData.ImageUrl;
    if (imageFile) {
      try {
        toast.info("Uploading image...");
        finalUrl = await uploadImage(imageFile);
      } catch (error) {
        toast.error("Upload failed");
        return;
      }
    }

    const payload = {
      ProviderID: providerId,
      ImageOrder: parseInt(formData.ImageOrder) || 1,
      ImageUrl: finalUrl,
      ...(hasDescription && {
        Description: formData.Description,
        DescriptionAr: formData.DescriptionAr
      })
    };

    const options = { onSuccess: () => setEditingItem(null) }; // Go back to list view

    if (editingItem.ID) {
      mutations.update.mutate({ id: editingItem.ID, ...payload }, options);
    } else {
      mutations.create.mutate(payload, options);
    }
  };

  const isSaving = mutations.create.isPending || mutations.update.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? (editingItem.ID ? t('admin.edit_item') : t('admin.add_item')) : title}
          </DialogTitle>
        </DialogHeader>

        {/* --- VIEW 1: LIST OF ITEMS --- */}
        {!editingItem && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={handleAddClick} className="bg-brand-primary">
                <Plus className="mr-2 h-4 w-4" /> {t('admin.add_new')}
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8"><Loader className="animate-spin text-brand-primary" /></div>
            ) : items?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div key={item.ID} className="border rounded-lg p-3 flex gap-3 relative group bg-white">
                    <img src={item.ImageUrl} alt="Item" className="w-20 h-20 object-cover rounded-md bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">Ord: {item.ImageOrder}</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditClick(item)}>
                            <Pencil size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => { if(confirm(t('admin.confirm_delete_generic'))) mutations.remove.mutate(item.ID); }}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      {hasDescription && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {isRTL ? item.DescriptionAr : item.Description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 border-2 border-dashed rounded-xl">
                {t('admin.no_results')}
              </div>
            )}
          </div>
        )}

        {/* --- VIEW 2: ADD / EDIT FORM --- */}
        {editingItem && (
          <div className="space-y-4 py-2">
             {/* Image Upload */}
             <div className="flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                {preview ? (
                  <div className="relative w-full h-40 group">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current.click()}>
                      <Pencil className="text-white h-6 w-6" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-brand-primary" onClick={() => fileInputRef.current.click()}>
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                       <Upload className="h-6 w-6" />
                    </div>
                    <span className="text-sm">Upload Image</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="space-y-2">
              <Label>{t('admin.order')}</Label>
              <Input type="number" value={formData.ImageOrder} onChange={(e) => setFormData({...formData, ImageOrder: e.target.value})} />
            </div>

            {hasDescription && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.desc_en')}</Label>
                  <Input value={formData.Description} onChange={(e) => setFormData({...formData, Description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.desc_ar')}</Label>
                  <Input className="font-cairo" value={formData.DescriptionAr} onChange={(e) => setFormData({...formData, DescriptionAr: e.target.value})} />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)} disabled={isSaving}>{t('admin.cancel')}</Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-brand-primary">
                {isSaving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : t('admin.save')}
              </Button>
            </DialogFooter>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default MediaManager;