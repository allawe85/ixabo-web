import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { 
  useCategories, 
  useDeleteCategory, 
  useCreateCategory, 
  useUpdateCategory 
} from "../../hooks/useCategories";
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
  LayoutGrid,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

const Categories = () => {
  const { t, i18n } = useTranslation();
  const { categories, isLoading, error } = useCategories();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    Name: "",
    NameAr: "",
    Order: "0",
    IconUrl: "",
    LottieURL: ""
  });

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const isRTL = i18n.dir() === 'rtl';
  const isSaving = isCreating || isUpdating;

  // -- HANDLERS --

  const handleOpenAdd = () => {
    setEditingCat(null);
    setImageFile(null);
    setImagePreview("");
    setFormData({ Name: "", NameAr: "", Order: "0", IconUrl: "", LottieURL: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setImageFile(null);
    setImagePreview(cat.IconUrl || "");
    setFormData({
      Name: cat.Name || "",
      NameAr: cat.NameAr || "",
      Order: cat.Order?.toString() || "0",
      IconUrl: cat.IconUrl || "",
      LottieURL: cat.LottieURL || ""
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Name) {
      toast.warning(t('admin.fill_required_fields'));
      return;
    }

    let finalIconUrl = formData.IconUrl;

    if (imageFile) {
      try {
        toast.info("Uploading icon...");
        finalIconUrl = await uploadImage(imageFile);
      } catch (error) {
        toast.error("Image upload failed");
        return;
      }
    }

    const payload = {
      ...formData,
      Order: parseInt(formData.Order),
      IconUrl: finalIconUrl
    };

    const options = {
      onSuccess: () => setIsModalOpen(false)
    };

    if (editingCat) {
      updateCategory({ id: editingCat.ID, ...payload }, options);
    } else {
      createCategory(payload, options);
    }
  };

  // -- RENDER --

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader className="animate-spin text-brand-primary" size={32} />
    </div>
  );

  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filteredCategories = categories?.filter((c) =>
    c.Name?.toLowerCase().includes(search.toLowerCase()) ||
    c.NameAr?.includes(search)
  );

  const ActionMenu = ({ category }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleOpenEdit(category)}>
          <Pencil className="mr-2 h-4 w-4" /> {t('admin.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => {
            if(confirm(t('admin.confirm_delete_category'))) deleteCategory(category.ID);
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
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.categories_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin.categories_subtitle')}</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-brand-primary hover:bg-brand-secondary w-full sm:w-auto">
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
          {t('admin.add_category')}
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
              <TableHead className="text-center">{t('admin.order')}</TableHead>
              <TableHead className="text-center">{t('admin.provider_count')}</TableHead>
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories?.length > 0 ? (
              filteredCategories.map((cat) => (
                <TableRow key={cat.ID}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 p-1">
                      {cat.IconUrl ? (
                        <img src={cat.IconUrl} alt={cat.Name} className="h-full w-full object-contain" />
                      ) : (
                        <LayoutGrid size={20} className="text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 text-start">{cat.Name}</TableCell>
                  <TableCell className="font-cairo text-start">{cat.NameAr}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                      {cat.Order}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {cat.ProviderCount} Providers
                    </span>
                  </TableCell>
                  <TableCell className="text-end">
                    <ActionMenu category={cat} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  {t('admin.no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredCategories?.length > 0 ? (
          filteredCategories.map((cat) => (
            <Card key={cat.ID} className="shadow-sm border-gray-100">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-1">
                   {cat.IconUrl ? (
                      <img src={cat.IconUrl} alt={cat.Name} className="h-full w-full object-contain" />
                    ) : (
                      <LayoutGrid size={24} className="text-gray-400" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 truncate">{cat.Name}</h3>
                      <p className="text-xs text-gray-500 font-cairo">{cat.NameAr}</p>
                    </div>
                    <ActionMenu category={cat} />
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Order: {cat.Order}
                    </span>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {cat.ProviderCount} Providers
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCat ? t('admin.edit_category') : t('admin.add_category')}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            
            {/* Icon Upload */}
            <div className="flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                {imagePreview ? (
                  <div className="relative w-20 h-20 group">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current.click()}>
                      <Pencil className="text-white h-5 w-5" />
                    </div>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-brand-primary transition-colors"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                       <ImageIcon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">Upload Icon</span>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.name_en')} <span className="text-red-500">*</span></Label>
                <Input 
                  required
                  value={formData.Name}
                  onChange={(e) => setFormData({...formData, Name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.name_ar')}</Label>
                <Input 
                  className="font-cairo"
                  value={formData.NameAr}
                  onChange={(e) => setFormData({...formData, NameAr: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('admin.order')}</Label>
              <Input 
                type="number"
                value={formData.Order}
                onChange={(e) => setFormData({...formData, Order: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Lottie URL (Optional)</Label>
              <Input 
                placeholder="https://..."
                value={formData.LottieURL}
                onChange={(e) => setFormData({...formData, LottieURL: e.target.value})}
              />
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

export default Categories;