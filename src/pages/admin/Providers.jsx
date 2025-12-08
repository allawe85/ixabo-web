import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  useProviders,
  useDeleteProvider,
  useCreateProvider,
  useUpdateProvider,
  usePersonalizedOfferTypes,
} from "../../hooks/useProviders";
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
  Eye,
  Store,
  Image as ImageIcon,
  Clock,
  Grid,
  MapPin,
  Menu as MenuIcon,
  Phone,
  Link as LinkIcon,
  QrCode,
} from "lucide-react";
import AssignModal from "../../components/admin/providers/AssignModal";
import { toast } from "sonner";
import { useCategories } from "../../hooks/useCategories"; // To get list of all cats
import { useGovernorates } from "../../hooks/useGovernorates"; // To get list of all govs
import {
  useProviderCategories,
  useUpdateProviderCategories,
  useProviderGovernorates,
  useUpdateProviderGovernorates,
} from "../../hooks/useProviderAssigns";
import {
  useProviderMenu,
  useMenuMutations,
  useProviderGallery,
  useGalleryMutations,
} from "../../hooks/useProviderContent";
import MediaManager from "../../components/admin/providers/MediaManager";
import DetailManager from "../../components/admin/providers/DetailManager"; // Import

const Providers = () => {
  const { t, i18n } = useTranslation();
  const { providers, isLoading, error } = useProviders();
  const { types: offerTypes } = usePersonalizedOfferTypes(); // Fetch Dropdown Data

  const { mutate: deleteProvider } = useDeleteProvider();
  const { mutate: createProvider, isPending: isCreating } = useCreateProvider();
  const { mutate: updateProvider, isPending: isUpdating } = useUpdateProvider();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);

  const { categories } = useCategories();
  const { governorates } = useGovernorates();

  const [detailType, setDetailType] = useState(null); // 'NUMBER', 'LOCATION', 'LINK'

  // -- Assign Logic --
  const [assignType, setAssignType] = useState(null); // 'CATEGORY' or 'GOV' or null
  const [targetProviderId, setTargetProviderId] = useState(null);

  // Fetch current assignments (only runs when we have a target ID)
  const { assignedIds: currentCatIds, isLoading: loadingCats } =
    useProviderCategories(targetProviderId);
  const { assignedIds: currentGovIds, isLoading: loadingGovs } =
    useProviderGovernorates(targetProviderId);

  const { mutate: saveCats, isPending: savingCats } =
    useUpdateProviderCategories();
  const { mutate: saveGovs, isPending: savingGovs } =
    useUpdateProviderGovernorates();

  // -- Media Manager Logic --
  const [mediaType, setMediaType] = useState(null); // 'MENU' or 'GALLERY' or null
  //const [targetProviderId, setTargetProviderId] = useState(null);

  // Fetch data (conditional)
  const { menuItems, isLoading: loadingMenu } = useProviderMenu(
    mediaType === "MENU" ? targetProviderId : null
  );
  const { galleryItems, isLoading: loadingGallery } = useProviderGallery(
    mediaType === "GALLERY" ? targetProviderId : null
  );

  const menuMutations = useMenuMutations(targetProviderId);
  const galleryMutations = useGalleryMutations(targetProviderId);

  // Form State
  const [formData, setFormData] = useState({
    Name: "",
    NameAr: "",
    GroupNum: "",
    Order: "999",
    MaxOffers: "5",
    MaxLimitedOffers: "2",
    WorkingFrom: "10:00",
    WorkingTo: "22:00",
    personalized_offer_type_id: "1",
    ShowMenu: true,
    IsActive: true,
    IsComingSoon: false,
    ImageUrl: "",
  });

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const isRTL = i18n.dir() === "rtl";
  const isSaving = isCreating || isUpdating;

  // -- HANDLERS --

  const handleOpenAdd = () => {
    setEditingProvider(null);
    setImageFile(null);
    setImagePreview("");
    setFormData({
      Name: "",
      NameAr: "",
      GroupNum: "",
      Order: "999",
      MaxOffers: "5",
      MaxLimitedOffers: "2",
      WorkingFrom: "10:00",
      WorkingTo: "22:00",
      personalized_offer_type_id: "1",
      ShowMenu: true,
      IsActive: true,
      IsComingSoon: false,
      ImageUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProvider(p);
    setImageFile(null);
    setImagePreview(p.ImageUrl || "");
    setFormData({
      Name: p.Name || "",
      NameAr: p.NameAr || "",
      GroupNum: p.GroupNum?.toString() || "",
      Order: p.Order?.toString() || "999",
      MaxOffers: p.MaxOffers?.toString() || "5",
      MaxLimitedOffers: p.MaxLimitedOffers?.toString() || "2",
      WorkingFrom: p.WorkingFrom || "10:00",
      WorkingTo: p.WorkingTo || "22:00",
      personalized_offer_type_id:
        p.personalized_offer_type_id?.toString() || "1",
      ShowMenu: p.ShowMenu ?? true,
      IsActive: p.IsActive ?? true,
      IsComingSoon: p.IsComingSoon ?? false,
      ImageUrl: p.ImageUrl || "",
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
      toast.warning(t("admin.fill_required_fields"));
      return;
    }

    let finalImageUrl = formData.ImageUrl;

    // Upload Image
    if (imageFile) {
      try {
        toast.info("Uploading logo...");
        finalImageUrl = await uploadImage(imageFile);
      } catch (error) {
        toast.error("Image upload failed");
        return;
      }
    }

    const payload = {
      ...formData,
      GroupNum: formData.GroupNum ? parseInt(formData.GroupNum) : null,
      Order: parseInt(formData.Order),
      MaxOffers: parseInt(formData.MaxOffers),
      MaxLimitedOffers: parseInt(formData.MaxLimitedOffers),
      personalized_offer_type_id: parseInt(formData.personalized_offer_type_id),
      ImageUrl: finalImageUrl,
    };

    const options = {
      onSuccess: () => setIsModalOpen(false),
    };

    if (editingProvider) {
      updateProvider({ id: editingProvider.ID, ...payload }, options);
    } else {
      createProvider(payload, options);
    }
  };
  const handleOpenAssign = (provider, type) => {
    setTargetProviderId(provider.ID);
    setAssignType(type);
  };

  const handleSaveAssign = (selectedIds) => {
    if (assignType === "CATEGORY") {
      saveCats(
        { providerId: targetProviderId, categoryIds: selectedIds },
        {
          onSuccess: () => setAssignType(null),
        }
      );
    } else {
      saveGovs(
        { providerId: targetProviderId, governorateIds: selectedIds },
        {
          onSuccess: () => setAssignType(null),
        }
      );
    }
  };

  const handleOpenMedia = (provider, type) => {
    setTargetProviderId(provider.ID);
    setMediaType(type);
  };

  const handleOpenDetails = (provider, type) => {
    setTargetProviderId(provider.ID);
    setDetailType(type);
  };

  // -- RENDER --

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="animate-spin text-brand-primary" size={32} />
      </div>
    );

  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filteredProviders = providers?.filter(
    (p) =>
      p.Name?.toLowerCase().includes(search.toLowerCase()) ||
      p.NameAr?.includes(search)
  );

  const ActionMenu = ({ provider }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t("admin.actions")}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleOpenEdit(provider)}>
          <Pencil className="mr-2 h-4 w-4" /> {t("admin.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleOpenAssign(provider, "CATEGORY")}
        >
          <Grid className="mr-2 h-4 w-4" /> {t("admin.assign_categories")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOpenAssign(provider, "GOV")}>
          <MapPin className="mr-2 h-4 w-4" /> {t("admin.assign_governorates")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOpenMedia(provider, "MENU")}>
          <MenuIcon className="mr-2 h-4 w-4" /> {t("admin.manage_menu")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOpenMedia(provider, "GALLERY")}>
          <ImageIcon className="mr-2 h-4 w-4" /> {t("admin.manage_gallery")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOpenDetails(provider, "NUMBER")}>
          <Phone className="mr-2 h-4 w-4" /> {t("admin.manage_numbers")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleOpenDetails(provider, "LOCATION")}
        >
          <MapPin className="mr-2 h-4 w-4" /> {t("admin.manage_locations")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOpenDetails(provider, "LINK")}>
          <LinkIcon className="mr-2 h-4 w-4" /> {t("admin.manage_links")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log("Show Scans")}>
          <QrCode className="mr-2 h-4 w-4" /> {t("admin.view_scans")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => {
            if (confirm(t("admin.confirm_delete_provider")))
              deleteProvider(provider.ID);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" /> {t("admin.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("admin.providers_title")}
          </h1>
          <p className="text-sm text-gray-500">
            {t("admin.providers_subtitle")}
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-brand-primary hover:bg-brand-secondary w-full sm:w-auto"
        >
          <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          {t("admin.add_provider")}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 w-full sm:max-w-sm relative">
        <Search
          className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
            isRTL ? "right-3" : "left-3"
          }`}
          size={18}
        />
        <Input
          placeholder={t("admin.search_placeholder")}
          className={isRTL ? "pr-10" : "pl-10"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table dir={isRTL ? "rtl" : "ltr"}>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-[80px] text-start">
                {t("admin.logo")}
              </TableHead>
              <TableHead className="text-start">{t("admin.name_en")}</TableHead>
              <TableHead className="text-start">{t("admin.name_ar")}</TableHead>
              <TableHead className="text-start">{t("admin.group")}</TableHead>
              <TableHead className="text-start">{t("admin.status")}</TableHead>
              <TableHead className="text-center">{t("admin.offers")}</TableHead>
              <TableHead className="text-end">{t("admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProviders?.length > 0 ? (
              filteredProviders.map((provider) => (
                <TableRow key={provider.ID}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-lg border border-gray-100 p-1 bg-white">
                      <img
                        src={provider.ImageUrl}
                        alt={provider.Name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 text-start">
                    {provider.Name}
                  </TableCell>
                  <TableCell className="font-cairo text-start">
                    {provider.NameAr}
                  </TableCell>
                  <TableCell className="text-start">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      Grp {provider.GroupNum}
                    </span>
                  </TableCell>
                  <TableCell className="text-start">
                    {provider.IsActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        {t("admin.active")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {t("admin.inactive")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {provider.offer ? provider.offer[0]?.count : 0}
                  </TableCell>
                  <TableCell className="text-end">
                    <ActionMenu provider={provider} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-gray-500"
                >
                  {t("admin.no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredProviders?.length > 0 ? (
          filteredProviders.map((provider) => (
            <Card key={provider.ID} className="shadow-sm border-gray-100">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-16 w-16 flex-shrink-0 rounded-xl border border-gray-100 p-2 bg-white flex items-center justify-center">
                  <img
                    src={provider.ImageUrl}
                    alt={provider.Name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">
                        {provider.Name}
                      </h3>
                      <p className="text-xs text-gray-500 font-cairo">
                        {provider.NameAr}
                      </p>
                    </div>
                    <ActionMenu provider={provider} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {provider.IsActive ? (
                      <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                        {t("admin.active")}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {t("admin.inactive")}
                      </span>
                    )}
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      Grp {provider.GroupNum}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            {t("admin.no_results")}
          </div>
        )}
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProvider
                ? t("admin.edit_provider")
                : t("admin.add_provider")}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-2">
            {/* 1. Image & Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Image */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <div
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => fileInputRef.current.click()}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="text-gray-400 h-8 w-8" />
                  )}
                </div>
                <span className="text-xs text-gray-500">{t("admin.logo")}</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Names */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      {t("admin.name_en")}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      required
                      value={formData.Name}
                      onChange={(e) =>
                        setFormData({ ...formData, Name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("admin.name_ar")}</Label>
                    <Input
                      className="font-cairo"
                      value={formData.NameAr}
                      onChange={(e) =>
                        setFormData({ ...formData, NameAr: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("admin.group")}</Label>
                    <Input
                      type="number"
                      value={formData.GroupNum}
                      onChange={(e) =>
                        setFormData({ ...formData, GroupNum: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("admin.order")}</Label>
                    <Input
                      type="number"
                      value={formData.Order}
                      onChange={(e) =>
                        setFormData({ ...formData, Order: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Settings */}
            <div className="p-4 bg-gray-50 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">
                  {t("admin.settings")}
                </h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="active"
                    checked={formData.IsActive}
                    onCheckedChange={(c) =>
                      setFormData({ ...formData, IsActive: c })
                    }
                  />
                  <Label htmlFor="active">{t("admin.active_status")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="menu"
                    checked={formData.ShowMenu}
                    onCheckedChange={(c) =>
                      setFormData({ ...formData, ShowMenu: c })
                    }
                  />
                  <Label htmlFor="menu">{t("admin.show_menu")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="coming"
                    checked={formData.IsComingSoon}
                    onCheckedChange={(c) =>
                      setFormData({ ...formData, IsComingSoon: c })
                    }
                  />
                  <Label htmlFor="coming">{t("admin.coming_soon")}</Label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">
                  {t("admin.offers")}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">{t("admin.max_offers")}</Label>
                    <Input
                      type="number"
                      value={formData.MaxOffers}
                      onChange={(e) =>
                        setFormData({ ...formData, MaxOffers: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">{t("admin.max_limited")}</Label>
                    <Input
                      type="number"
                      value={formData.MaxLimitedOffers}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          MaxLimitedOffers: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">{t("admin.offer_type")}</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.personalized_offer_type_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personalized_offer_type_id: e.target.value,
                      })
                    }
                  >
                    {offerTypes?.map((type) => (
                      <option key={type.id} value={type.id}>
                        {isRTL && type.name_ar
                          ? type.name_ar
                          : type.name || type.name_en_ar}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Working Hours */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock size={14} /> {t("admin.working_hours")}
              </Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="text-xs text-gray-500">
                    {t("admin.from")}
                  </Label>
                  <Input
                    type="time"
                    value={formData.WorkingFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, WorkingFrom: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-gray-500">
                    {t("admin.to")}
                  </Label>
                  <Input
                    type="time"
                    value={formData.WorkingTo}
                    onChange={(e) =>
                      setFormData({ ...formData, WorkingTo: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                {t("admin.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-brand-primary"
              >
                {isSaving ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />{" "}
                    {t("admin.saving")}
                  </>
                ) : (
                  t("admin.save")
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- ASSIGN MODAL --- */}
      <AssignModal
        isOpen={!!assignType}
        onClose={() => setAssignType(null)}
        title={
          assignType === "CATEGORY"
            ? t("admin.assign_categories")
            : t("admin.assign_governorates")
        }
        items={assignType === "CATEGORY" ? categories : governorates}
        assignedIds={assignType === "CATEGORY" ? currentCatIds : currentGovIds}
        isLoadingData={assignType === "CATEGORY" ? loadingCats : loadingGovs}
        isSaving={assignType === "CATEGORY" ? savingCats : savingGovs}
        onSave={handleSaveAssign}
      />

      {/* --- MEDIA MANAGER MODAL --- */}
      <MediaManager
        isOpen={!!mediaType}
        onClose={() => setMediaType(null)}
        title={
          mediaType === "MENU"
            ? t("admin.manage_menu")
            : t("admin.manage_gallery")
        }
        items={mediaType === "MENU" ? menuItems : galleryItems}
        isLoading={mediaType === "MENU" ? loadingMenu : loadingGallery}
        mutations={mediaType === "MENU" ? menuMutations : galleryMutations}
        providerId={targetProviderId}
        hasDescription={mediaType === "GALLERY"} // Only gallery has descriptions
      />

      {/* --- DETAIL MANAGER MODAL --- */}
      <DetailManager
        isOpen={!!detailType}
        onClose={() => setDetailType(null)}
        type={detailType}
        providerId={targetProviderId}
      />
    </div>
  );
};

export default Providers;
