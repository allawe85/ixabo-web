import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Trash2, Plus, Pencil, Phone, MapPin, Link as LinkIcon, Save } from "lucide-react";
import { 
  useProviderNumbers, useNumberMutations,
  useProviderLocations, useLocationMutations,
  useProviderContacts, useContactMutations, useContactTypes
} from "../../../hooks/useProviderDetails";

const DetailManager = ({ isOpen, onClose, type, providerId }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // --- LOCAL STATE ---
  const [editingId, setEditingId] = useState(null); // ID of item being edited
  const [formData, setFormData] = useState({}); // Form state

  // --- DATA FETCHING ---
  const numbers = useProviderNumbers(providerId);
  const locations = useProviderLocations(providerId);
  const contacts = useProviderContacts(providerId);
  const contactTypes = useContactTypes();

  const numMut = useNumberMutations(providerId);
  const locMut = useLocationMutations(providerId);
  const conMut = useContactMutations(providerId);

  // --- HELPERS ---
  const getTitle = () => {
    if (type === 'NUMBER') return t('admin.manage_numbers');
    if (type === 'LOCATION') return t('admin.manage_locations');
    if (type === 'LINK') return t('admin.manage_links');
    return "";
  };

  const getItems = () => {
    if (type === 'NUMBER') return numbers.data || [];
    if (type === 'LOCATION') return locations.data || [];
    if (type === 'LINK') return contacts.data || [];
    return [];
  };

  const isLoading = 
    (type === 'NUMBER' && numbers.isLoading) || 
    (type === 'LOCATION' && locations.isLoading) || 
    (type === 'LINK' && contacts.isLoading);

  // --- HANDLERS ---
  const resetForm = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (item) => {
    setEditingId(item.id || `${item.ContactTypeID}`); // Composite key fallback
    if (type === 'NUMBER') {
      setFormData({ Name: item.name, NameAr: item.nameAr, Phone: item.phone });
    } else if (type === 'LOCATION') {
      setFormData({ Name: item.name, NameAr: item.nameAr, Latitude: item.latitude, Longitude: item.longitude });
    }
    // Links usually don't support edit in this simple model, just delete/add
  };

  const handleSave = () => {
    if (type === 'NUMBER') {
      if (editingId) numMut.update.mutate({ id: editingId, ...formData });
      else numMut.create.mutate({ ProviderID: providerId, ...formData, IsPrimary: false });
    } else if (type === 'LOCATION') {
      const payload = { ...formData, ProvideID: providerId }; // Note ProvideID
      if (editingId) locMut.update.mutate({ id: editingId, ...payload });
      else locMut.create.mutate(payload);
    } else if (type === 'LINK') {
      conMut.create.mutate({ ProviderID: providerId, ContactTypeID: formData.ContactTypeID, ProviderInfo: formData.ProviderInfo });
    }
    resetForm();
  };

  const handleDelete = (item) => {
    if (!confirm(t('admin.confirm_delete_generic'))) return;
    if (type === 'NUMBER') numMut.remove.mutate(item.id);
    else if (type === 'LOCATION') locMut.remove.mutate(item.id);
    else if (type === 'LINK') conMut.remove.mutate({ providerId, typeId: item.ContactTypeID });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        {/* --- ADD NEW FORM --- */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-100">
           <h4 className="text-sm font-semibold text-gray-700">{t('admin.add_new')}</h4>
           
           {/* NUMBER FORM */}
           {type === 'NUMBER' && (
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input placeholder="Name (En)" value={formData.Name || ''} onChange={e => setFormData({...formData, Name: e.target.value})} />
                <Input placeholder="Name (Ar)" className="font-cairo" value={formData.NameAr || ''} onChange={e => setFormData({...formData, NameAr: e.target.value})} />
                <Input placeholder="Phone" value={formData.Phone || ''} onChange={e => setFormData({...formData, Phone: e.target.value})} />
             </div>
           )}

           {/* LOCATION FORM */}
           {type === 'LOCATION' && (
             <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Name (En)" value={formData.Name || ''} onChange={e => setFormData({...formData, Name: e.target.value})} />
                  <Input placeholder="Name (Ar)" className="font-cairo" value={formData.NameAr || ''} onChange={e => setFormData({...formData, NameAr: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Latitude" value={formData.Latitude || ''} onChange={e => setFormData({...formData, Latitude: e.target.value})} />
                  <Input type="number" placeholder="Longitude" value={formData.Longitude || ''} onChange={e => setFormData({...formData, Longitude: e.target.value})} />
                </div>
             </div>
           )}

           {/* LINK FORM */}
           {type === 'LINK' && (
             <div className="flex gap-2">
                <select 
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.ContactTypeID || ''}
                  onChange={e => setFormData({...formData, ContactTypeID: e.target.value})}
                >
                   <option value="">Type</option>
                   {contactTypes.data?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <Input className="flex-1" placeholder="URL / Handle" value={formData.ProviderInfo || ''} onChange={e => setFormData({...formData, ProviderInfo: e.target.value})} />
             </div>
           )}

           <div className="flex justify-end pt-2">
              {editingId && <Button variant="ghost" size="sm" onClick={resetForm} className="mr-2">{t('admin.cancel')}</Button>}
              <Button size="sm" onClick={handleSave} className="bg-brand-primary">
                {editingId ? <Save size={16} className="mr-2"/> : <Plus size={16} className="mr-2"/>}
                {editingId ? t('admin.save') : t('admin.add')}
              </Button>
           </div>
        </div>

        {/* --- LIST --- */}
        <div className="space-y-2 mt-4">
           {isLoading && <Loader className="mx-auto animate-spin" />}
           {getItems().map(item => (
             <div key={item.id || item.ContactTypeID} className="flex items-center justify-between p-3 border rounded bg-white shadow-sm">
                <div className="text-sm">
                   {type === 'NUMBER' && (
                     <>
                       <div className="font-bold">{item.name} / {item.nameAr}</div>
                       <div className="text-gray-500">{item.phone}</div>
                     </>
                   )}
                   {type === 'LOCATION' && (
                     <>
                       <div className="font-bold">{item.name}</div>
                       <div className="text-xs text-gray-400">{item.latitude}, {item.longitude}</div>
                     </>
                   )}
                   {type === 'LINK' && (
                     <div className="flex items-center gap-2">
                       <span className="font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{item.TypeName}</span>
                       <span className="text-gray-600 truncate max-w-[200px]">{item.ProviderInfo}</span>
                     </div>
                   )}
                </div>
                
                <div className="flex gap-1">
                   {type !== 'LINK' && (
                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                        <Pencil size={14} />
                     </Button>
                   )}
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(item)}>
                      <Trash2 size={14} />
                   </Button>
                </div>
             </div>
           ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('admin.close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailManager;