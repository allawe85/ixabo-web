import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSuggestions, useDeleteSuggestion } from "../../hooks/useSuggestions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Loader, Trash2, MessageSquare, Mail, Phone } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Suggestions = () => {
  const { t, i18n } = useTranslation();
  const { suggestions, isLoading, error } = useSuggestions();
  const { mutate: deleteItem } = useDeleteSuggestion();
  const [search, setSearch] = useState("");
  const isRTL = i18n.dir() === 'rtl';

  if (isLoading) return <div className="flex justify-center h-96 items-center"><Loader className="animate-spin text-brand-primary" size={32} /></div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filtered = suggestions?.filter(s => 
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.body?.toLowerCase().includes(search.toLowerCase())
  );

  const ActionMenu = ({ item }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuItem className="text-red-600" onClick={() => { if(confirm(t('admin.confirm_delete_generic'))) deleteItem(item.id); }}>
          <Trash2 className="mr-2 h-4 w-4" /> {t('admin.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.suggestions_title')}</h1>
        <p className="text-sm text-gray-500">{t('admin.suggestions_subtitle')}</p>
      </div>
      <div className="relative max-w-sm"><Search className={`absolute top-3 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
        <Input placeholder={t('admin.search_placeholder')} className={isRTL ? 'pr-10' : 'pl-10'} value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      
      <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table dir={isRTL ? "rtl" : "ltr"}>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="text-start">{t('admin.name')}</TableHead>
              <TableHead className="text-start">{t('admin.type')}</TableHead>
              <TableHead className="text-start">{t('admin.message')}</TableHead>
              <TableHead className="text-start">{t('admin.contact_info')}</TableHead>
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered?.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-start">{s.name}</TableCell>
                <TableCell className="text-start"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{s.type}</span></TableCell>
                <TableCell className="text-start max-w-xs truncate" title={s.body}>{s.body}</TableCell>
                <TableCell className="text-start text-sm text-gray-500">
                  <div>{s.phone}</div>
                  <div className="text-xs">{s.email}</div>
                </TableCell>
                <TableCell className="text-end"><ActionMenu item={s} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Mobile Cards (omitted for brevity but follows same pattern) */}
    </div>
  );
};
export default Suggestions;