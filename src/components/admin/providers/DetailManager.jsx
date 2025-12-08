import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader,
  Trash2,
  Plus,
  Pencil,
  Phone,
  MapPin,
  Link as LinkIcon,
  Save,
} from "lucide-react";
import {
  useProviderNumbers,
  useNumberMutations,
  useProviderLocations,
  useLocationMutations,
  useProviderContacts,
  useContactMutations,
  useContactTypes,
} from "../../../hooks/useProviderDetails";

const DetailManager = ({ isOpen, onClose, type, providerId }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  // --- LOCAL STATE ---
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

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
    if (type === "NUMBER") return t("admin.manage_numbers");
    if (type === "LOCATION") return t("admin.manage_locations");
    if (type === "LINK") return t("admin.manage_links");
    return "";
  };

  const getItems = () => {
    if (type === "NUMBER") return numbers.data || [];
    if (type === "LOCATION") return locations.data || [];
    if (type === "LINK") return contacts.data || [];
    return [];
  };

  const isLoading =
    (type === "NUMBER" && numbers.isLoading) ||
    (type === "LOCATION" && locations.isLoading) ||
    (type === "LINK" && contacts.isLoading);

  // --- HANDLERS ---
  const resetForm = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (item) => {
    // Note: provider_number and provider_location have lowercase 'id' in your schema
    setEditingId(item.id);

    if (type === "NUMBER") {
      // Inputs: Name, NameAr, Phone
      setFormData({ Name: item.Name, NameAr: item.NameAr, Phone: item.Phone });
    } else if (type === "LOCATION") {
      // Inputs: Name, NameAr, Latitude, Longitude
      setFormData({
        Name: item.Name,
        NameAr: item.NameAr,
        Latitude: item.Latitude,
        Longitude: item.Longitude,
      });
    }
  };

  const handleSave = () => {
    if (type === "NUMBER") {
      if (editingId) numMut.update.mutate({ id: editingId, ...formData });
      else
        numMut.create.mutate({
          ProviderID: providerId,
          ...formData,
          IsPrimary: false,
        });
    } else if (type === "LOCATION") {
      // NOTE: ProvideID (not ProviderID) for locations
      const payload = { ...formData, ProvideID: providerId };
      if (editingId) locMut.update.mutate({ id: editingId, ...payload });
      else locMut.create.mutate(payload);
    } else if (type === "LINK") {
      conMut.create.mutate({
        ProviderID: providerId,
        ContactTypeID: formData.ContactTypeID,
        ProviderInfo: formData.ProviderInfo,
      });
    }
    resetForm();
  };

  const handleDelete = (item) => {
    if (!confirm(t("admin.confirm_delete_generic"))) return;
    if (type === "NUMBER") numMut.remove.mutate(item.id);
    else if (type === "LOCATION") locMut.remove.mutate(item.id);
    else if (type === "LINK")
      conMut.remove.mutate({ providerId, typeId: item.ContactTypeID });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        {/* --- ADD NEW FORM --- */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700">
            {editingId ? t("admin.edit_item") : t("admin.add_new")}
          </h4>

          {/* NUMBER FORM */}
          {type === "NUMBER" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                placeholder="Name (En)"
                value={formData.Name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, Name: e.target.value })
                }
              />
              <Input
                placeholder="Name (Ar)"
                className="font-cairo"
                value={formData.NameAr || ""}
                onChange={(e) =>
                  setFormData({ ...formData, NameAr: e.target.value })
                }
              />
              <Input
                placeholder="Phone"
                value={formData.Phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, Phone: e.target.value })
                }
              />
            </div>
          )}

          {/* LOCATION FORM */}
          {type === "LOCATION" && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Name (En)"
                  value={formData.Name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, Name: e.target.value })
                  }
                />
                <Input
                  placeholder="Name (Ar)"
                  className="font-cairo"
                  value={formData.NameAr || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, NameAr: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Latitude"
                  value={formData.Latitude || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, Latitude: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Longitude"
                  value={formData.Longitude || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, Longitude: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* LINK FORM */}
          {type === "LINK" && (
            <div className="flex gap-2">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-1/3"
                value={formData.ContactTypeID || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ContactTypeID: e.target.value })
                }
              >
                <option value="">Select Type</option>
                {/* FIX: Using t.ID and t.Name (Uppercase) based on contact_type.dart */}
                {contactTypes.data?.map((t) => (
                  <option key={t.ID} value={t.ID}>
                    {isRTL ? t.NameAr : t.Name}
                  </option>
                ))}
              </select>
              <Input
                className="flex-1"
                placeholder="URL or Handle"
                value={formData.ProviderInfo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, ProviderInfo: e.target.value })
                }
              />
            </div>
          )}

          <div className="flex justify-end pt-2">
            {editingId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="mr-2"
              >
                {t("admin.cancel")}
              </Button>
            )}
            <Button size="sm" onClick={handleSave} className="bg-brand-primary">
              {editingId ? (
                <Save size={16} className="mr-2" />
              ) : (
                <Plus size={16} className="mr-2" />
              )}
              {editingId ? t("admin.save") : t("admin.add")}
            </Button>
          </div>
        </div>

        {/* --- LIST --- */}
        <div className="space-y-2 mt-4">
          {isLoading && (
            <Loader className="mx-auto animate-spin text-brand-primary" />
          )}

          {!isLoading && getItems().length === 0 && (
            <div className="text-center text-gray-500 text-sm py-4">
              {t("admin.no_results")}
            </div>
          )}

          {getItems().map((item) => (
            <div
              key={item.id || item.ContactTypeID}
              className="flex items-center justify-between p-3 border rounded bg-white shadow-sm"
            >
              <div className="text-sm">
                {type === "NUMBER" && (
                  <>
                    <div className="font-bold text-gray-800">
                      {item.Name} /{" "}
                      <span className="font-cairo">{item.NameAr}</span>
                    </div>
                    <div className="text-gray-500 font-mono text-xs">
                      {item.Phone}
                    </div>
                  </>
                )}
                {type === "LOCATION" && (
                  <>
                    <div className="font-bold text-gray-800">{item.Name}</div>
                    <div className="text-xs text-gray-400 font-mono">
                      {item.Latitude}, {item.Longitude}
                    </div>
                  </>
                )}
                {type === "LINK" && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100">
                      {/* FIX: In view_provider_contact, the Type Name is in 'Name' column */}
                      {isRTL ? item.NameAr : item.Name}
                    </span>
                    <span className="text-gray-600 truncate max-w-[250px]">
                      {item.ProviderInfo}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-1">
                {type !== "LINK" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-100"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil size={14} className="text-gray-600" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-50"
                  onClick={() => handleDelete(item)}
                >
                  <Trash2 size={14} className="text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("admin.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailManager;
