import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProviders, useDeleteProvider } from "../../hooks/useProviders";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Loader, 
  Trash2, 
  Pencil, 
  Eye 
} from "lucide-react";

const Providers = () => {
  const { t, i18n } = useTranslation();
  const { providers, isLoading, error } = useProviders();
  const { mutate: deleteProvider } = useDeleteProvider();
  const [search, setSearch] = useState("");

  const isRTL = i18n.dir() === 'rtl';

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader className="animate-spin text-brand-primary" size={32} />
    </div>
  );

  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filteredProviders = providers?.filter((p) =>
    p.Name?.toLowerCase().includes(search.toLowerCase()) ||
    p.NameAr?.includes(search)
  );

  // Helper to render Status Badge
  const StatusBadge = ({ isActive }) => (
    isActive ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
        {t('admin.active')}
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        {t('admin.inactive')}
      </span>
    )
  );

  // Helper for Action Menu
  const ActionMenu = ({ provider }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => console.log("View", provider.ID)}>
          <Eye className="mr-2 h-4 w-4" /> {t('admin.view')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log("Edit", provider.ID)}>
          <Pencil className="mr-2 h-4 w-4" /> {t('admin.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => {
            if(confirm(t('admin.delete_confirm'))) deleteProvider(provider.ID);
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" /> {t('admin.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.providers_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin.providers_subtitle')}</p>
        </div>
        <Button className="bg-brand-primary hover:bg-brand-secondary w-full sm:w-auto">
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
          {t('admin.add_provider')}
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

      {/* --- DESKTOP VIEW: TABLE (Hidden on Mobile) --- */}
      <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden">
        {/* FIX: Added dir prop to force direction */}
        <Table dir={isRTL ? "rtl" : "ltr"}>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-[80px] text-start">{t('admin.logo')}</TableHead>
              <TableHead className="text-start">{t('admin.name_en')}</TableHead>
              {/* FIX: Changed text-right to text-start to follow direction */}
              <TableHead className="text-start">{t('admin.name_ar')}</TableHead>
              <TableHead className="text-start">{t('admin.group')}</TableHead>
              <TableHead className="text-start">{t('admin.status')}</TableHead>
              <TableHead className="text-center">{t('admin.offers')}</TableHead>
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
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
                  <TableCell className="font-medium text-gray-900 text-start">{provider.Name}</TableCell>
                  {/* FIX: Changed text-right to text-start here as well */}
                  <TableCell className="font-cairo text-start">{provider.NameAr}</TableCell>
                  <TableCell className="text-start">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      Grp {provider.GroupNum}
                    </span>
                  </TableCell>
                  <TableCell className="text-start">
                    <StatusBadge isActive={provider.IsActive} />
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
                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                  {t('admin.no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MOBILE VIEW: CARDS (Hidden on Desktop) --- */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredProviders?.length > 0 ? (
          filteredProviders.map((provider) => (
            <Card key={provider.ID} className="shadow-sm border-gray-100">
              <CardContent className="p-4 flex items-start gap-4">
                {/* Logo Column */}
                <div className="h-16 w-16 flex-shrink-0 rounded-xl border border-gray-100 p-2 bg-white flex items-center justify-center">
                  <img 
                    src={provider.ImageUrl} 
                    alt={provider.Name} 
                    className="max-h-full max-w-full object-contain" 
                  />
                </div>

                {/* Info Column */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{provider.Name}</h3>
                      <p className="text-xs text-gray-500 font-cairo">{provider.NameAr}</p>
                    </div>
                    {/* Actions Dropdown */}
                    <ActionMenu provider={provider} />
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <StatusBadge isActive={provider.IsActive} />
                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                      Offers: {provider.offer ? provider.offer[0]?.count : 0}
                    </span>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      Grp {provider.GroupNum}
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

    </div>
  );
};

export default Providers;