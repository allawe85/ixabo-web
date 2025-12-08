import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { 
  usePackages, 
  useDeletePackage, 
  useCreatePackage, 
  useUpdatePackage 
} from "../../hooks/usePackages";
import { uploadImage } from "../../services/storage";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  Pencil, 
  Package,
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

const Packages = () => {
  const { t, i18n } = useTranslation();
  const { packages, isLoading, error } = usePackages();
  const { mutate: deletePackage } = useDeletePackage();
  const { mutate: createPackage, isPending: isCreating } = useCreatePackage();
  const { mutate: updatePackage, isPending: isUpdating } = useUpdatePackage();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    Title: "",
    TitleAr: "",
    Description: "",
    DescriptionAr: "",
    Price: "",
    validity: "", // In days
    color: "#000000",
    order: "",
    is_main: false,
    ImageUrl: ""
  });

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const isRTL = i18n.dir() === 'rtl';
  const isSaving = isCreating || isUpdating;

  // -- HANDLERS --

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setImageFile(null);
    setImagePreview("");
    setFormData({
      Title: "", TitleAr: "", Description: "", DescriptionAr: "",
      Price: "", validity: "30", color: "#d20e5d", order: "1", is_main: false,
      ImageUrl: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPkg(pkg);
    setImageFile(null);
    setImagePreview(pkg.ImageUrl || "");
    setFormData({
      Title: pkg.Title || "",
      TitleAr: pkg.TitleAr || "",
      Description: pkg.Description || "",
      DescriptionAr: pkg.DescriptionAr || "",
      Price: pkg.Price || "",
      validity: pkg.validity || "",
      color: pkg.color || "#000000",
      order: pkg.order || "",
      is_main: pkg.is_main || false,
      ImageUrl: pkg.ImageUrl || ""
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Local preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Title || !formData.Price) {
      toast.warning(t('admin.fill_required_fields'));
      return;
    }

    let finalImageUrl = formData.ImageUrl;

    // Upload Image if a new file was selected
    if (imageFile) {
      try {
        toast.info("Uploading image...");
        finalImageUrl = await uploadImage(imageFile);
      } catch (error) {
        toast.error("Image upload failed");
        console.error(error);
        return;
      }
    }

    const payload = {
      ...formData,
      Price: parseFloat(formData.Price),
      validity: parseInt(formData.validity),
      order: parseInt(formData.order),
      ImageUrl: finalImageUrl
    };

    const options = {
      onSuccess: () => setIsModalOpen(false)
    };

    if (editingPkg) {
      updatePackage({ id: editingPkg.ID, ...payload }, options);
    } else {
      createPackage(payload, options);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader className="animate-spin text-brand-primary" size={32} />
    </div>
  );

  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filteredPackages = packages?.filter((p) =>
    p.Title?.toLowerCase().includes(search.toLowerCase()) ||
    p.TitleAr?.includes(search)
  );

  const ActionMenu = ({ pkg }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleOpenEdit(pkg)}>
          <Pencil className="mr-2 h-4 w-4" /> {t('admin.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => {
            if(confirm(t('admin.confirm_delete_package'))) deletePackage(pkg.ID);
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
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.packages_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin.packages_subtitle')}</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-brand-primary hover:bg-brand-secondary w-full sm:w-auto">
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
          {t('admin.add_package')}
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
              <TableHead className="w-[80px] text-start">{t('admin.color')}</TableHead>
              <TableHead className="w-[80px] text-start">{t('admin.image')}</TableHead>
              <TableHead className="text-start">{t('admin.title_en')}</TableHead>
              <TableHead className="text-start">{t('admin.title_ar')}</TableHead>
              <TableHead className="text-start">{t('admin.validity')}</TableHead>
              <TableHead className="text-start">{t('admin.price')}</TableHead>
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages?.length > 0 ? (
              filteredPackages.map((pkg) => (
                <TableRow key={pkg.ID}>
                  <TableCell>
                    <div 
                      className="h-8 w-8 rounded-full border border-gray-100 shadow-sm"
                      style={{ backgroundColor: pkg.color || '#eeeeee' }}
                      title={pkg.color}
                    />
                  </TableCell>
                  <TableCell>
                    {pkg.ImageUrl ? (
                      <img src={pkg.ImageUrl} alt={pkg.Title} className="h-8 w-8 object-contain rounded-md bg-gray-50" />
                    ) : (
                      <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center">
                        <Package size={14} className="text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 text-start">{pkg.Title}</TableCell>
                  <TableCell className="font-cairo text-start">{pkg.TitleAr}</TableCell>
                  <TableCell className="text-start text-gray-600">
                    {pkg.validity} {t('admin.days')}
                  </TableCell>
                  <TableCell className="text-start font-bold text-gray-900">
                    {pkg.Price} <span className="text-xs font-normal text-gray-500">JOD</span>
                  </TableCell>
                  <TableCell className="text-end">
                    <ActionMenu pkg={pkg} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                  {t('admin.no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredPackages?.length > 0 ? (
          filteredPackages.map((pkg) => (
            <Card key={pkg.ID} className="shadow-sm border-gray-100">
              <CardContent className="p-4 flex items-center gap-4">
                <div 
                  className="h-14 w-14 flex-shrink-0 rounded-xl flex items-center justify-center text-white shadow-sm relative overflow-hidden"
                  style={{ backgroundColor: pkg.color || '#eeeeee' }}
                >
                   {pkg.ImageUrl ? (
                     <img src={pkg.ImageUrl} alt={pkg.Title} className="w-full h-full object-cover" />
                   ) : (
                     <Package size={24} className="opacity-80 mix-blend-multiply" />
                   )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 truncate">{pkg.Title}</h3>
                      <p className="text-xs text-gray-500 font-cairo">{pkg.TitleAr}</p>
                    </div>
                    <ActionMenu pkg={pkg} />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                     <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                       {pkg.validity} {t('admin.days')}
                     </span>
                     <span className="font-bold text-brand-primary">
                        {pkg.Price} JOD
                     </span>
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
              {editingPkg ? t('admin.edit_package') : t('admin.add_package')}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            
            {/* Image Upload */}
            <div className="flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                {imagePreview ? (
                  <div className="relative w-32 h-32 group">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current.click()}>
                      <Pencil className="text-white h-6 w-6" />
                    </div>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-brand-primary transition-colors"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                       <ImageIcon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">Upload Image</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
            </div>

            {/* Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.title_en')} <span className="text-red-500">*</span></Label>
                <Input 
                  required
                  placeholder="e.g. Gold Package"
                  value={formData.Title}
                  onChange={(e) => setFormData({...formData, Title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.title_ar')}</Label>
                <Input 
                  className="font-cairo"
                  placeholder="مثال: الباقة الذهبية"
                  value={formData.TitleAr}
                  onChange={(e) => setFormData({...formData, TitleAr: e.target.value})}
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.desc_en')}</Label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Package features..."
                  value={formData.Description}
                  onChange={(e) => setFormData({...formData, Description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.desc_ar')}</Label>
                <textarea 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-cairo"
                  placeholder="ميزات الباقة..."
                  value={formData.DescriptionAr}
                  onChange={(e) => setFormData({...formData, DescriptionAr: e.target.value})}
                />
              </div>
            </div>

            {/* Price & Validity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.price')} (JOD) <span className="text-red-500">*</span></Label>
                <Input 
                  type="number"
                  placeholder="0.00"
                  value={formData.Price}
                  onChange={(e) => setFormData({...formData, Price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.validity')} ({t('admin.days')})</Label>
                <Input 
                  type="number"
                  placeholder="30"
                  value={formData.validity}
                  onChange={(e) => setFormData({...formData, validity: e.target.value})}
                />
              </div>
            </div>

            {/* Settings Row */}
            <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
               {/* Color Picker */}
               <div className="flex items-center gap-3">
                 <Label>{t('admin.color')}</Label>
                 <div className="flex items-center gap-2">
                   <input 
                      type="color" 
                      className="h-9 w-14 p-1 rounded cursor-pointer border bg-white"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                   />
                   <span className="text-xs text-gray-500 font-mono">{formData.color}</span>
                 </div>
               </div>

               {/* Order */}
               <div className="flex items-center gap-2">
                 <Label>{t('admin.order')}</Label>
                 <Input 
                    type="number" 
                    className="w-20"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: e.target.value})}
                 />
               </div>

               {/* Is Main */}
               <div className="flex items-center gap-2">
                 <Checkbox 
                    id="is_main" 
                    checked={formData.is_main} 
                    onCheckedChange={(checked) => setFormData({...formData, is_main: checked})}
                 />
                 <Label htmlFor="is_main" className="cursor-pointer">{t('admin.is_main')}</Label>
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

export default Packages;