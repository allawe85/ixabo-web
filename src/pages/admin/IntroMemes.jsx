import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useIntroMemes, useDeleteIntroMeme } from "../../hooks/useIntroMemes";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Loader, Trash2, Image as ImageIcon, Calendar } from "lucide-react";

const IntroMemes = () => {
  const { t, i18n } = useTranslation();
  const { memes, isLoading, error } = useIntroMemes();
  const { mutate: deleteMeme } = useDeleteIntroMeme();
  const [search, setSearch] = useState("");

  const isRTL = i18n.dir() === 'rtl';

  if (isLoading) return <div className="flex justify-center h-96 items-center"><Loader className="animate-spin text-brand-primary" size={32} /></div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filteredMemes = memes?.filter((m) =>
    m.message?.toLowerCase().includes(search.toLowerCase()) ||
    m.message_ar?.includes(search)
  );

  const formatDate = (date) => new Date(date).toLocaleDateString(i18n.language);

  const ActionMenu = ({ meme }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
        <DropdownMenuItem 
           className="text-red-600"
           onClick={() => { if(confirm(t('admin.confirm_delete_generic'))) deleteMeme(meme.id); }}
        >
          <Trash2 className="mr-2 h-4 w-4" /> {t('admin.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.memes_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin.memes_subtitle')}</p>
        </div>
        <Button className="bg-brand-primary hover:bg-brand-secondary">
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t('admin.add_meme')}
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full sm:max-w-sm relative">
        <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
        <Input placeholder={t('admin.search_placeholder')} className={isRTL ? 'pr-10' : 'pl-10'} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table dir={isRTL ? "rtl" : "ltr"}>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-start">{t('admin.image')}</TableHead>
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
                  {meme.meme_url ? (
                    <img src={meme.meme_url} alt="Meme" className="h-12 w-12 object-cover rounded-lg border" />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon size={20} className="text-gray-400"/></div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-start">{meme.message}</TableCell>
                <TableCell className="font-cairo text-start">{meme.message_ar}</TableCell>
                <TableCell className="text-start text-sm text-gray-500">{formatDate(meme.show_from)}</TableCell>
                <TableCell className="text-start text-sm text-gray-500">{formatDate(meme.show_to)}</TableCell>
                <TableCell className="text-end"><ActionMenu meme={meme} /></TableCell>
              </TableRow>
            ))}
            {filteredMemes?.length === 0 && <TableRow><TableCell colSpan={6} className="h-24 text-center">{t('admin.no_results')}</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredMemes?.map((meme) => (
          <Card key={meme.id} className="shadow-sm border-gray-100">
            <CardContent className="p-4 flex items-start gap-4">
               {meme.meme_url ? (
                  <img src={meme.meme_url} alt="Meme" className="h-16 w-16 object-cover rounded-lg border" />
                ) : (
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon size={24} className="text-gray-400"/></div>
                )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                   <h3 className="font-bold text-gray-900 line-clamp-1">{meme.message}</h3>
                   <ActionMenu meme={meme} />
                </div>
                <p className="text-xs text-gray-500 font-cairo mb-2">{meme.message_ar}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={12} /> {formatDate(meme.show_from)} - {formatDate(meme.show_to)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default IntroMemes;