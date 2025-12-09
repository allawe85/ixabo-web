import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUsers, useDeleteUser, useUpdateUserRole } from "../../hooks/useUsers";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  MoreHorizontal, 
  Search, 
  Loader, 
  Trash2, 
  User,
  Mail,
  Phone,
  Shield // Icon for Role
} from "lucide-react";

const Users = () => {
  const { t, i18n } = useTranslation();
  const { users, isLoading, error } = useUsers();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateUserRole();
  
  const [search, setSearch] = useState("");
  
  // State for Role Modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const isRTL = i18n.dir() === 'rtl';

  // --- HANDLERS ---

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.Role); // Pre-select current role
    setRoleModalOpen(true);
  };

  const handleSaveRole = () => {
    if (!selectedUser || !newRole) return;
    updateRole({ id: selectedUser.ID, role: newRole }, {
      onSuccess: () => setRoleModalOpen(false)
    });
  };

  // --- RENDER HELPERS ---

  const RoleBadge = ({ role }) => {
    let styles = "bg-gray-100 text-gray-600";
    if (role === 'PROVIDER') styles = "bg-blue-50 text-blue-700 border-blue-100";
    if (role === 'ADMIN') styles = "bg-purple-50 text-purple-700 border-purple-100";
    if (role === 'SUBPROVIDER') styles = "bg-cyan-50 text-cyan-700 border-cyan-100";

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles}`}>
        {role}
      </span>
    );
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-96">
      <Loader className="animate-spin text-brand-primary" size={32} />
    </div>
  );

  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const filteredUsers = users?.filter((u) =>
    u.Name?.toLowerCase().includes(search.toLowerCase()) ||
    u.Email?.toLowerCase().includes(search.toLowerCase()) ||
    u.PhoneNumber?.includes(search)
  );

  const ActionMenu = ({ user }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuLabel>{t('admin.actions')}</DropdownMenuLabel>
        
        {/* Change Role Option */}
        <DropdownMenuItem onClick={() => handleOpenRoleModal(user)}>
          <Shield className="mr-2 h-4 w-4" /> {t('admin.change_role')}
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => {
            if(confirm(t('admin.delete_confirm'))) deleteUser(user.ID);
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
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.users_title')}</h1>
          <p className="text-sm text-gray-500">{t('admin.users_subtitle')}</p>
        </div>
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
              <TableHead className="w-[50px] text-start"></TableHead>
              <TableHead className="text-start">{t('admin.name')}</TableHead>
              <TableHead className="text-start">{t('admin.phone')}</TableHead>
              <TableHead className="text-start">{t('admin.email')}</TableHead>
              <TableHead className="text-start">{t('admin.role_label')}</TableHead>
              <TableHead className="text-end">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.ID}>
                  <TableCell>
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <User size={16} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 text-start">{user.Name}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-600 text-start">{user.PhoneNumber}</TableCell>
                  <TableCell className="text-sm text-gray-600 text-start">{user.Email}</TableCell>
                  <TableCell className="text-start">
                    <RoleBadge role={user.Role} />
                  </TableCell>
                  <TableCell className="text-end">
                    <ActionMenu user={user} />
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
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <Card key={user.ID} className="shadow-sm border-gray-100">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                   <User size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 truncate">{user.Name}</h3>
                      <div className="mt-1">
                        <RoleBadge role={user.Role} />
                      </div>
                    </div>
                    <ActionMenu user={user} />
                  </div>
                  
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone size={14} />
                      <span className="font-mono text-xs">{user.PhoneNumber}</span>
                    </div>
                    {user.Email && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail size={14} />
                        <span className="truncate">{user.Email}</span>
                      </div>
                    )}
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

      {/* --- CHANGE ROLE MODAL --- */}
      <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t('admin.change_role')}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label>{t('admin.select_role')}</Label>
                <div className="flex flex-col gap-2">
                   {['USER', 'PROVIDER', 'ADMIN', 'SUBPROVIDER'].map((role) => (
                     <div 
                       key={role}
                       className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${newRole === role ? 'border-brand-primary bg-brand-primary/5' : 'hover:bg-gray-50'}`}
                       onClick={() => setNewRole(role)}
                     >
                        <span className="font-medium text-sm">{role}</span>
                        {newRole === role && <div className="h-2 w-2 rounded-full bg-brand-primary"></div>}
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleModalOpen(false)}>{t('admin.cancel')}</Button>
            <Button onClick={handleSaveRole} disabled={isUpdating} className="bg-brand-primary">
              {isUpdating ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : t('admin.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Users;