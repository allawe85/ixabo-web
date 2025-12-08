import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  useGovernorates, 
  useDeleteGovernorate, 
  useCreateGovernorate, 
  useUpdateGovernorate 
} from "../../hooks/useGovernorates";
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
  MapPin
} from "lucide-react";
import { toast } from "sonner";

const Governorates = () => {
  const { t, i18n } = useTranslation();
  const { governorates, isLoading, error } = useGovernorates();
  const { mutate: deleteGovernorate } = useDeleteGovernorate();
  const { mutate: createGovernorate, isPending: isCreating } = useCreateGovernorate();
  const { mutate: updateGovernorate, isPending: isUpdating } = useUpdateGovernorate();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGov, setEditingGov] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    Name: "",
    NameAr: ""
  });

  const isRTL = i18n.dir() === 'rtl';
  const isSaving = isCreating || isUpdating;

  // -- HANDLERS --

  const handleOpenAdd = () => {
    setEditingGov(null);
    setFormData({ Name: "", NameAr: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (gov) => {
    setEditingGov(gov);
    setFormData({
      Name: gov.Name || "",
      NameAr: gov.NameAr || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.Name) {
      toast.warning(t('admin.fill_required_fields'));
      return;
    }

    const payload = {
      Name: formData.Name,
      NameAr: formData.NameAr
    };

    const options = {
      onSuccess: () => setIsModalOpen(false)
    };

    if (editingGov) {
      updateGovernorate({ id: editingGov.ID, ...payload }, options);
    } else {
      createGovernorate(payload, options);
    }
  };

  // -- RENDER --

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader className="animate-spin text-brand-primary" size={32} />
    </div>
  );

  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filteredGovs = governorates?.filter((g) =>
    g.Name?.toLowerCase().includes(search.toLowerCase()) ||
    g.NameAr?.includes(search)
  );

  const ActionMenu = ({ gov }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleOpenEdit(gov)}>
          <Pencil className="mr-2 h-4 w-4" /> {t('admin.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => {
            if(confirm(t('admin.confirm_delete_gov'))) deleteGovernorate(gov.ID);
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
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.governorates_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin.governorates_subtitle')}</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-brand-primary hover:bg-brand-secondary w-full sm:w-auto">
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
          {t('admin.add_governorate')}
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
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGovs?.length > 0 ? (
              filteredGovs.map((gov) => (
                <TableRow key={gov.ID}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600">
                      <MapPin size={20} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 text-start">{gov.Name}</TableCell>
                  <TableCell className="font-cairo text-start">{gov.NameAr}</TableCell>
                  <TableCell className="text-end">
                    <ActionMenu gov={gov} />
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
        {filteredGovs?.length > 0 ? (
          filteredGovs.map((gov) => (
            <Card key={gov.ID} className="shadow-sm border-gray-100">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                   <MapPin size={24} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 truncate">{gov.Name}</h3>
                      <p className="text-xs text-gray-500 font-cairo">{gov.NameAr}</p>
                    </div>
                    <ActionMenu gov={gov} />
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingGov ? t('admin.edit_governorate') : t('admin.add_governorate')}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            
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

export default Governorates;