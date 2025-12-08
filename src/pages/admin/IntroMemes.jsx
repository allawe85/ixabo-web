import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { 
  useIntroMemes, 
  useDeleteIntroMeme, 
  useCreateIntroMeme, 
  useUpdateIntroMeme 
} from "../../hooks/useIntroMemes";
import { uploadImage } from "../../services/storage";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Loader, 
  Trash2, 
  Image as ImageIcon, 
  Calendar,
  PlayCircle,
  Pencil,
  Upload
} from "lucide-react";
import { toast } from "sonner";

const IntroMemes = () => {
  const { t, i18n } = useTranslation();
  const { memes, isLoading, error } = useIntroMemes();
  const { mutate: deleteMeme } = useDeleteIntroMeme();
  const { mutate: createMeme, isPending: isCreating } = useCreateIntroMeme();
  const { mutate: updateMeme, isPending: isUpdating } = useUpdateIntroMeme();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeme, setEditingMeme] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    message: "",
    message_ar: "",
    meme_url: "",
    meme_type: "Image", // 'Image' or 'Lottie'
    show_from: "",
    show_to: ""
  });

  // Image Upload
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const isRTL = i18n.dir() === 'rtl';
  const isSaving = isCreating || isUpdating;

  // -- HANDLERS --

  const handleOpenAdd = () => {
    setEditingMeme(null);
    setImageFile(null);
    setPreviewUrl("");
    // Default dates: From now to 1 month later
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(now.getMonth() + 1);

    setFormData({
      message: "",
      message_ar: "",
      meme_url: "",
      meme_type: "Image",
      show_from: now.toISOString().slice(0, 16), // Format for datetime-local
      show_to: nextMonth.toISOString().slice(0, 16)
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (meme) => {
    setEditingMeme(meme);
    setImageFile(null);
    setPreviewUrl(meme.meme_url || "");
    setFormData({
      message: meme.message || "",
      message_ar: meme.message_ar || "",
      meme_url: meme.meme_url || "",
      meme_type: meme.meme_type || "Image",
      show_from: meme.show_from ? new Date(meme.show_from).toISOString().slice(0, 16) : "",
      show_to: meme.show_to ? new Date(meme.show_to).toISOString().slice(0, 16) : ""
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, meme_type: "Image" })); // Force type to Image on upload
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.message || !formData.show_from || !formData.show_to) {
      toast.warning(t('admin.fill_required_fields'));
      return;
    }

    let finalUrl = formData.meme_url;

    if (imageFile) {
      try {
        toast.info("Uploading media...");
        finalUrl = await uploadImage(imageFile);
      } catch (error) {
        toast.error("Upload failed");
        return;
      }
    }

    const payload = {
      ...formData,
      meme_url: finalUrl
    };

    const options = {
      onSuccess: () => setIsModalOpen(false)
    };

    if (editingMeme) {
      updateMeme({ id: editingMeme.id, ...payload }, options);
    } else {
      createMeme(payload, options);
    }
  };

  const formatDate = (dateStr) => {
    if(!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString(i18n.language) + " " + new Date(dateStr).toLocaleTimeString(i18n.language, {hour: '2-digit', minute:'2-digit'});
  };

  // -- RENDER --

  if (isLoading) return <div className="flex justify-center h-96 items-center"><Loader className="animate-spin text-brand-primary" size={32} /></div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filteredMemes = memes?.filter((m) =>
    m.message?.toLowerCase().includes(search.toLowerCase()) ||
    m.message_ar?.includes(search)
  );

  const ActionMenu = ({ meme }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100"><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleOpenEdit(meme)}>
          <Pencil className="mr-2 h-4 w-4" /> {t('admin.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem 
           className="text-red-600 focus:text-red-600 focus:bg-red-50"
           onClick={() => { if(confirm(t('admin.confirm_delete_generic'))) deleteMeme(meme.id); }}
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
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.memes_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin.memes_subtitle')}</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-brand-primary hover:bg-brand-secondary w-full sm:w-auto">
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('admin.add_meme')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 w-full sm:max-w-sm relative">
        <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
        <Input placeholder={t('admin.search_placeholder')} className={isRTL ? 'pr-10' : 'pl-10'} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table dir={isRTL ? "rtl" : "ltr"}>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-[80px] text-start">{t('admin.image')}</TableHead>
              <TableHead className="text-start">{t('admin.message_en')}</TableHead>
              <TableHead className="text-start">{t('admin.message_ar')}</TableHead>
              <TableHead className="text-start">{t('admin.valid_from')}</TableHead>
              <TableHead className="text-start">{t('admin.valid_to')}</TableHead>
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMemes?.map((meme) => (
              <TableRow key={meme.id}>
                <TableCell>
                  {meme.meme_type === 'Lottie' ? (
                    <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center border border-purple-100">
                      <PlayCircle size={20} className="text-purple-600"/>
                    </div>
                  ) : meme.meme_url ? (
                    <img src={meme.meme_url} alt="Meme" className="h-12 w-12 object-cover rounded-lg border bg-gray-50" />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon size={20} className="text-gray-400"/></div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-start">{meme.message}</TableCell>
                <TableCell className="font-cairo text-start">{meme.message_ar}</TableCell>
                <TableCell className="text-start text-xs text-gray-500 font-mono">{formatDate(meme.show_from)}</TableCell>
                <TableCell className="text-start text-xs text-gray-500 font-mono">{formatDate(meme.show_to)}</TableCell>
                <TableCell className="text-end"><ActionMenu meme={meme} /></TableCell>
              </TableRow>
            ))}
            {filteredMemes?.length === 0 && <TableRow><TableCell colSpan={6} className="h-24 text-center text-gray-500">{t('admin.no_results')}</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredMemes?.map((meme) => (
          <Card key={meme.id} className="shadow-sm border-gray-100">
            <CardContent className="p-4 flex items-start gap-4">
               {meme.meme_type === 'Lottie' ? (
                  <div className="h-16 w-16 bg-purple-50 rounded-lg flex items-center justify-center border border-purple-100 flex-shrink-0">
                    <PlayCircle size={24} className="text-purple-600"/>
                  </div>
                ) : meme.meme_url ? (
                  <img src={meme.meme_url} alt="Meme" className="h-16 w-16 object-cover rounded-lg border bg-gray-50 flex-shrink-0" />
                ) : (
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"><ImageIcon size={24} className="text-gray-400"/></div>
                )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-bold text-gray-900 line-clamp-1">{meme.message}</h3>
                     <p className="text-xs text-gray-500 font-cairo">{meme.message_ar}</p>
                   </div>
                   <ActionMenu meme={meme} />
                </div>
                <div className="flex flex-col gap-1 mt-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1"><Calendar size={12} /> {t('admin.from')}: {formatDate(meme.show_from)}</div>
                  <div className="flex items-center gap-1"><Calendar size={12} /> {t('admin.to')}: {formatDate(meme.show_to)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingMeme ? t('admin.edit_meme') : t('admin.add_meme')}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            
            {/* Media Type Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
               {['Image', 'Lottie'].map((type) => (
                 <button
                   key={type}
                   type="button"
                   onClick={() => setFormData({...formData, meme_type: type})}
                   className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                     formData.meme_type === type 
                       ? 'bg-white text-brand-primary shadow-sm' 
                       : 'text-gray-500 hover:text-gray-700'
                   }`}
                 >
                   {type}
                 </button>
               ))}
            </div>

            {/* Preview & Upload Area */}
            <div className="flex flex-col items-center justify-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                {previewUrl ? (
                  <div className="relative w-full h-40 group bg-white rounded-lg overflow-hidden flex items-center justify-center">
                    {formData.meme_type === 'Lottie' ? (
                       <div className="text-center">
                          <PlayCircle className="mx-auto h-10 w-10 text-purple-500 mb-2" />
                          <p className="text-xs text-gray-500 break-all px-4">{previewUrl}</p>
                       </div>
                    ) : (
                       <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       {/* Change Button */}
                       <div 
                         className="p-2 bg-white rounded-full cursor-pointer hover:scale-110 transition-transform"
                         onClick={() => fileInputRef.current.click()}
                         title="Upload New Image"
                       >
                         <Upload className="h-4 w-4 text-gray-700" />
                       </div>
                       {/* Clear Button (Optional, can just replace) */}
                    </div>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-brand-primary transition-colors py-4"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                       <Upload className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">Upload Media</span>
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept={formData.meme_type === 'Image' ? "image/*" : ".json"} // Accept JSON for Lottie? Usually just URLs
                  onChange={handleFileChange}
                />

                {/* URL Fallback Input */}
                <div className="w-full">
                   <Label className="text-xs text-gray-500 mb-1 block">Or paste URL</Label>
                   <Input 
                      placeholder="https://..." 
                      value={formData.meme_url}
                      className="h-8 text-xs"
                      onChange={(e) => {
                        setFormData({...formData, meme_url: e.target.value});
                        setPreviewUrl(e.target.value);
                      }}
                   />
                </div>
            </div>

            {/* Messages */}
            <div className="space-y-2">
              <Label>{t('admin.message_en')} <span className="text-red-500">*</span></Label>
              <Input 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.message_ar')}</Label>
              <Input 
                className="font-cairo"
                value={formData.message_ar}
                onChange={(e) => setFormData({...formData, message_ar: e.target.value})}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>{t('admin.valid_from')}</Label>
                 <Input 
                   type="datetime-local"
                   value={formData.show_from}
                   onChange={(e) => setFormData({...formData, show_from: e.target.value})}
                 />
               </div>
               <div className="space-y-2">
                 <Label>{t('admin.valid_to')}</Label>
                 <Input 
                   type="datetime-local"
                   value={formData.show_to}
                   onChange={(e) => setFormData({...formData, show_to: e.target.value})}
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

export default IntroMemes;