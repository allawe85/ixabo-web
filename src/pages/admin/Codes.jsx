import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePackageGroups, useDiscountCodes, useDeletePackageGroup, useDeleteDiscountCode } from "../../hooks/useCodes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Tags, 
  CreditCard,
  CalendarClock,
  Percent
} from "lucide-react";

const Codes = () => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const isRTL = i18n.dir() === 'rtl';

  // Hooks
  const { groups, isLoading: loadingGroups } = usePackageGroups();
  const { discounts, isLoading: loadingDiscounts } = useDiscountCodes();
  const { mutate: deleteGroup } = useDeletePackageGroup();
  const { mutate: deleteDiscount } = useDeleteDiscountCode();

  // -- SUB-COMPONENTS --

  const ActionMenu = ({ onEdit, onDelete, type }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" /> {t('admin.edit')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => {
            if(confirm(t('admin.delete_confirm'))) onDelete();
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" /> {t('admin.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Filter Logic
  const filteredGroups = groups?.filter(g => g.Name?.toLowerCase().includes(search.toLowerCase()));
  const filteredDiscounts = discounts?.filter(d => d.code?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.codes_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin.codes_subtitle')}</p>
        </div>
        {/* Add Button (Context sensitive? For now generic placement) */}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="groups" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
            <TabsTrigger value="groups">{t('admin.tab_groups')}</TabsTrigger>
            <TabsTrigger value="discounts">{t('admin.tab_discounts')}</TabsTrigger>
          </TabsList>

          {/* Filter (Shared) */}
          <div className="flex items-center gap-2 w-full sm:max-w-xs relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
            <Input 
              placeholder={t('admin.search_placeholder')} 
              className={isRTL ? 'pr-10' : 'pl-10'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* --- TAB 1: SUBSCRIPTION GROUPS --- */}
        <TabsContent value="groups" className="space-y-4">
          <div className="flex justify-end">
             <Button className="bg-brand-primary hover:bg-brand-secondary">
                <Plus className="mr-2 h-4 w-4" /> {t('admin.add_group')}
             </Button>
          </div>

          {loadingGroups ? (
            <div className="h-48 flex items-center justify-center"><Loader className="animate-spin" /></div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden">
                <Table dir={isRTL ? "rtl" : "ltr"}>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="text-start">{t('admin.group_name')}</TableHead>
                      <TableHead className="text-start">{t('admin.package')}</TableHead>
                      <TableHead className="text-center">{t('admin.usage')}</TableHead>
                      <TableHead className="text-start">{t('admin.net_price')}</TableHead>
                      <TableHead className="text-end">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGroups?.map((g) => (
                      <TableRow key={g.id}>
                        <TableCell className="font-medium text-start">{g.Name}</TableCell>
                        <TableCell className="text-start">
                          {isRTL ? g.TitleAr : g.Title}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${g.IsUsedCount >= g.CodeCount ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {g.IsUsedCount || 0} / {g.CodeCount}
                          </span>
                        </TableCell>
                        <TableCell className="text-start">{g.NetPrice} JOD</TableCell>
                        <TableCell className="text-end">
                          <ActionMenu 
                            onEdit={() => console.log('Edit', g.id)} 
                            onDelete={() => deleteGroup(g.id)} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden grid gap-4">
                {filteredGroups?.map((g) => (
                  <Card key={g.id}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold">{g.Name}</h3>
                        <ActionMenu 
                            onEdit={() => console.log('Edit', g.id)} 
                            onDelete={() => deleteGroup(g.id)} 
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                         <span>{isRTL ? g.TitleAr : g.Title}</span>
                         <span className="font-mono text-brand-primary font-bold">{g.NetPrice} JOD</span>
                      </div>
                      <div className="text-xs bg-gray-50 p-2 rounded flex justify-between">
                         <span>{t('admin.usage')}:</span>
                         <span className="font-bold">{g.IsUsedCount || 0} / {g.CodeCount}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* --- TAB 2: DISCOUNT CODES --- */}
        <TabsContent value="discounts" className="space-y-4">
          <div className="flex justify-end">
             <Button className="bg-brand-primary hover:bg-brand-secondary">
                <Plus className="mr-2 h-4 w-4" /> {t('admin.add_discount')}
             </Button>
          </div>

          {loadingDiscounts ? (
            <div className="h-48 flex items-center justify-center"><Loader className="animate-spin" /></div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block border rounded-xl bg-white shadow-sm overflow-hidden">
                <Table dir={isRTL ? "rtl" : "ltr"}>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="text-start">{t('admin.code')}</TableHead>
                      <TableHead className="text-start">{t('admin.expiry')}</TableHead>
                      <TableHead className="text-start">{t('admin.gold_price')}</TableHead>
                      <TableHead className="text-start">{t('admin.silver_price')}</TableHead>
                      <TableHead className="text-center">{t('admin.usage_count')}</TableHead>
                      <TableHead className="text-end">{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDiscounts?.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-mono font-bold text-brand-primary text-start">{d.code}</TableCell>
                        <TableCell className="text-start">
                          {new Date(d.expiry).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-start">{d.gold_price} JOD</TableCell>
                        <TableCell className="text-start">{d.silver_price} JOD</TableCell>
                        <TableCell className="text-center">{d.usage}</TableCell>
                        <TableCell className="text-end">
                          <ActionMenu 
                            onEdit={() => console.log('Edit', d.id)} 
                            onDelete={() => deleteDiscount(d.id)} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden grid gap-4">
                {filteredDiscounts?.map((d) => (
                  <Card key={d.id}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-2">
                           <Tags size={16} className="text-brand-primary"/>
                           <span className="font-mono font-bold text-lg">{d.code}</span>
                         </div>
                         <ActionMenu 
                            onEdit={() => console.log('Edit', d.id)} 
                            onDelete={() => deleteDiscount(d.id)} 
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                         <div className="bg-yellow-50 p-2 rounded text-yellow-700">
                            Gold: <b>{d.gold_price}</b>
                         </div>
                         <div className="bg-gray-100 p-2 rounded text-gray-700">
                            Silver: <b>{d.silver_price}</b>
                         </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2">
                        <span className="flex items-center gap-1"><CalendarClock size={14}/> {new Date(d.expiry).toLocaleDateString()}</span>
                        <span>Used: {d.usage}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Codes;