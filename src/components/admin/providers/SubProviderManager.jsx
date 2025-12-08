import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Trash2, Plus, User, Search, UserPlus } from "lucide-react";
import { 
  useProviderUsers, 
  useUserSearch, 
  useSubProviderMutations 
} from "../../../hooks/useProviderUsers";

const SubProviderManager = ({ isOpen, onClose, providerId, providerName }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // --- STATE ---
  const [view, setView] = useState("LIST"); // 'LIST' or 'ADD'
  const [searchQuery, setSearchQuery] = useState("");

  // --- HOOKS ---
  const { users: currentUsers, isLoading: loadingList } = useProviderUsers(providerId);
  const { results: searchResults, isLoading: loadingSearch } = useUserSearch(searchQuery);
  const mutations = useSubProviderMutations(providerId);

  // --- HANDLERS ---
  const handleAdd = (user) => {
    if (!confirm(t('admin.confirm_add_subprovider'))) return;
    mutations.add.mutate({ providerId, userId: user.UserID }, {
      onSuccess: () => {
        setSearchQuery(""); // Clear search
        setView("LIST"); // Go back to list
      }
    });
  };

  const handleRemove = (userId) => {
    if (!confirm(t('admin.confirm_remove_subprovider'))) return;
    mutations.remove.mutate({ userId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {view === 'LIST' 
              ? `${t('admin.manage_users')} - ${providerName}` 
              : t('admin.add_sub_provider')}
          </DialogTitle>
        </DialogHeader>

        {/* --- VIEW 1: LIST --- */}
        {view === 'LIST' && (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
             <div className="flex justify-end">
                <Button size="sm" onClick={() => setView("ADD")} className="bg-brand-primary">
                   <UserPlus className="mr-2 h-4 w-4" /> {t('admin.add_new')}
                </Button>
             </div>

             <div className="flex-1 overflow-y-auto space-y-2 border rounded-md p-2 bg-gray-50">
                {loadingList ? <Loader className="mx-auto animate-spin" /> : 
                 currentUsers?.map(user => (
                   <div key={user.UserID} className="bg-white p-3 rounded shadow-sm border flex justify-between items-center">
                      <div>
                         <p className="font-bold text-sm">{user.username || user.UserID}</p>
                         <p className="text-xs text-gray-500">{user.email}</p>
                         <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded mt-1 inline-block">{user.Role}</span>
                      </div>
                      
                      {user.Role === 'SUBPROVIDER' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => handleRemove(user.UserID)}
                        >
                           <Trash2 size={16} />
                        </Button>
                      )}
                   </div>
                 ))}
                 {!loadingList && currentUsers?.length === 0 && (
                   <div className="text-center text-gray-500 py-10">{t('admin.no_results')}</div>
                 )}
             </div>
          </div>
        )}

        {/* --- VIEW 2: ADD (SEARCH) --- */}
        {view === 'ADD' && (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
             <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder={t('admin.search_user_placeholder')} 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>

             <div className="flex-1 overflow-y-auto space-y-2 border rounded-md p-2 bg-gray-50">
                {loadingSearch && <Loader className="mx-auto animate-spin" />}
                
                {searchResults?.map(user => (
                  <div key={user.UserID} className="bg-white p-3 rounded shadow-sm border flex justify-between items-center">
                     <div>
                        <p className="font-bold text-sm">{user.Name}</p>
                        <p className="text-xs text-gray-500">{user.Email || user.PhoneNumber}</p>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded mt-1 inline-block">{user.Role}</span>
                     </div>
                     
                     {user.Role === 'USER' ? (
                       <Button 
                         size="sm" 
                         className="bg-brand-primary h-8"
                         onClick={() => handleAdd(user)}
                         disabled={mutations.add.isPending}
                       >
                          {t('admin.add')}
                       </Button>
                     ) : (
                       <span className="text-xs text-gray-400 italic">
                         {user.Role === 'SUBPROVIDER' ? 'Already Added' : 'Unavailable'}
                       </span>
                     )}
                  </div>
                ))}

                {searchQuery.length > 0 && searchResults?.length === 0 && !loadingSearch && (
                   <div className="text-center text-gray-500 py-10">{t('admin.no_results')}</div>
                )}
             </div>

             <Button variant="outline" onClick={() => setView("LIST")}>
               {t('admin.back')}
             </Button>
          </div>
        )}

        <DialogFooter>
          {view === 'LIST' && <Button variant="outline" onClick={onClose}>{t('admin.close')}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubProviderManager;