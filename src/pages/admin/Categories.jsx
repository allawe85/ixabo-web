import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCategories, useDeleteCategory } from "../../hooks/useCategories";
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
  LayoutGrid
} from "lucide-react";

const Categories = () => {
  const { t, i18n } = useTranslation();
  const { categories, isLoading, error } = useCategories();
  const { mutate: deleteCategory } = useDeleteCategory();
  const [search, setSearch] = useState("");

  const isRTL = i18n.dir() === 'rtl';

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

  // Helper for Action Menu
  const ActionMenu = ({ category }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => console.log("Edit", category.ID)}>
          <Pencil className="mr-2 h-4 w-4" /> {t('admin.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => {
            if(confirm(t('admin.delete_confirm'))) deleteCategory(category.ID);
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
        <Button className="bg-brand-primary hover:bg-brand-secondary w-full sm:w-auto">
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
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                      {cat.IconUrl ? (
                        <img src={cat.IconUrl} alt={cat.Name} className="h-6 w-6 object-contain" />
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
                {/* Icon */}
                <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                   {cat.IconUrl ? (
                      <img src={cat.IconUrl} alt={cat.Name} className="h-8 w-8 object-contain" />
                    ) : (
                      <LayoutGrid size={24} className="text-gray-400" />
                    )}
                </div>

                {/* Info */}
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
    </div>
  );
};

export default Categories;