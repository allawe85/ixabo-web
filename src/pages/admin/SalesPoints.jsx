import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  useSalesPoints, 
  useDeleteSalesPoint, 
  useCreateSalesPoint, 
  useUpdateSalesPoint 
} from "../../hooks/useSalesPoints";
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
import { Label } from "@/components/ui/label"; // Check if you need to install this
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
} from "@/components/ui/dialog"; // Check if you need to install this
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Loader, 
  Trash2, 
  Pencil, 
  Store,
  Phone,
  MapPin
} from "lucide-react";
import { toast } from "sonner"; // Using toast directly for validation messages

const SalesPoints = () => {
  const { t, i18n } = useTranslation();
  const { salesPoints, isLoading, error } = useSalesPoints();
  const { mutate: deleteSalesPoint } = useDeleteSalesPoint();
  const { mutate: createSalesPoint, isPending: isCreating } = useCreateSalesPoint();
  const { mutate: updateSalesPoint, isPending: isUpdating } = useUpdateSalesPoint();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    Name: "",
    NameAr: "",
    PhoneNumber: "",
    Address: "",
    AddressAr: "",
    Latitude: "",
    Longitude: ""
  });

  const isRTL = i18n.dir() === 'rtl';
  const isSaving = isCreating || isUpdating;

  // -- HANDLERS --

  const handleOpenAdd = () => {
    setEditingPoint(null);
    setFormData({
      Name: "", NameAr: "", PhoneNumber: "", Address: "", AddressAr: "", Latitude: "", Longitude: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sp) => {
    setEditingPoint(sp);
    setFormData({
      Name: sp.Name || "",
      NameAr: sp.NameAr || "",
      PhoneNumber: sp.PhoneNumber || "",
      Address: sp.Address || "",
      AddressAr: sp.AddressAr || "",
      Latitude: sp.Latitude || "",
      Longitude: sp.Longitude || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Validation Logic (Was missing in Flutter)
    if (!formData.Name || !formData.PhoneNumber) {
      toast.warning(t('admin.fill_required_fields')); 
      return;
    }

    // 2. Prepare Payload (Convert strings to numbers if needed)
    const payload = {
      ...formData,
      Latitude: formData.Latitude ? parseFloat(formData.Latitude) : null,
      Longitude: formData.Longitude ? parseFloat(formData.Longitude) : null,
    };

    // 3. Submit
    if (editingPoint) {
      updateSalesPoint({ id: editingPoint.ID, ...payload }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createSalesPoint(payload, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  // -- RENDER --

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader className="animate-spin text-brand-primary" size={32} />
    </div>
  );

  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filteredPoints = salesPoints?.filter((sp) =>
    sp.Name?.toLowerCase().includes(search.toLowerCase()) ||
    sp.NameAr?.includes(search)
  );

  const ActionMenu = ({ sp }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleOpenEdit(sp)}>
          <Pencil className="mr-2 h-4 w-4" /> {t('admin.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => {
            if(confirm(t('admin.confirm_delete_sales_point'))) deleteSalesPoint(sp.ID);
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
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.sales_points_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin.sales_points_subtitle')}</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-brand-primary hover:bg-brand-secondary w-full sm:w-auto">
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
          {t('admin.add_sales_point')}
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
              <TableHead className="w-[80px] text-start">{t('admin.icon')}</TableHead>
              <TableHead className="text-start">{t('admin.name_en')}</TableHead>
              <TableHead className="text-start">{t('admin.name_ar')}</TableHead>
              <TableHead className="text-start">{t('admin.phone')}</TableHead>
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPoints?.length > 0 ? (
              filteredPoints.map((sp) => (
                <TableRow key={sp.ID}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100 text-orange-600">
                      <Store size={20} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 text-start">{sp.Name}</TableCell>
                  <TableCell className="font-cairo text-start">{sp.NameAr}</TableCell>
                  <TableCell className="text-start font-mono text-sm text-gray-600">
                    {sp.PhoneNumber}
                  </TableCell>
                  <TableCell className="text-end">
                    <ActionMenu sp={sp} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  {t('admin.no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredPoints?.length > 0 ? (
          filteredPoints.map((sp) => (
            <Card key={sp.ID} className="shadow-sm border-gray-100">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                   <Store size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 truncate">{sp.Name}</h3>
                      <p className="text-xs text-gray-500 font-cairo">{sp.NameAr}</p>
                    </div>
                    <ActionMenu sp={sp} />
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                    <Phone size={14} />
                    <span>{sp.PhoneNumber}</span>
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

      {/* --- ADD / EDIT MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPoint ? t('admin.edit_sales_point') : t('admin.add_sales_point')}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            
            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.name_en')} <span className="text-red-500">*</span></Label>
                <Input 
                  required
                  placeholder="Sales Point Name"
                  value={formData.Name}
                  onChange={(e) => setFormData({...formData, Name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.name_ar')}</Label>
                <Input 
                  className="font-cairo"
                  placeholder="اسم نقطة البيع"
                  value={formData.NameAr}
                  onChange={(e) => setFormData({...formData, NameAr: e.target.value})}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>{t('admin.phone')} <span className="text-red-500">*</span></Label>
              <Input 
                required
                placeholder="079..."
                value={formData.PhoneNumber}
                onChange={(e) => setFormData({...formData, PhoneNumber: e.target.value})}
              />
            </div>

            {/* Address Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.address_en')}</Label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Street name, Building..."
                  value={formData.Address}
                  onChange={(e) => setFormData({...formData, Address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.address_ar')}</Label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-cairo"
                  placeholder="اسم الشارع، المبنى..."
                  value={formData.AddressAr}
                  onChange={(e) => setFormData({...formData, AddressAr: e.target.value})}
                />
              </div>
            </div>

            {/* Location Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin size={14} /> Latitude (Y)
                </Label>
                <Input 
                  type="number" step="any"
                  placeholder="31.9..."
                  value={formData.Latitude}
                  onChange={(e) => setFormData({...formData, Latitude: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin size={14} /> Longitude (X)
                </Label>
                <Input 
                  type="number" step="any"
                  placeholder="35.9..."
                  value={formData.Longitude}
                  onChange={(e) => setFormData({...formData, Longitude: e.target.value})}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                {t('admin.cancel')}
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-brand-primary">
                {isSaving ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> {t('admin.saving')}
                  </>
                ) : (
                  t('admin.save')
                )}
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesPoints;