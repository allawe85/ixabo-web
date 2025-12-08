import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";

/**
 * Reusable modal for assigning many-to-many relationships
 */
const AssignModal = ({ 
  isOpen, 
  onClose, 
  title, 
  items, // List of all available items (Categories or Govs)
  assignedIds, // List of currently assigned IDs
  isLoadingData, 
  onSave,
  isSaving 
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  
  // Local state for checkboxes
  const [selectedIds, setSelectedIds] = useState([]);

  // Sync local state when data loads or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(assignedIds || []);
    }
  }, [isOpen, assignedIds]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin text-brand-primary" />
          </div>
        ) : (
          <div className="space-y-3 py-4">
            {items?.map((item) => (
              <div key={item.ID} className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                <Checkbox 
                  id={`item-${item.ID}`} 
                  checked={selectedIds.includes(item.ID)}
                  onCheckedChange={() => toggleSelection(item.ID)}
                />
                <Label 
                  htmlFor={`item-${item.ID}`} 
                  className="flex-1 cursor-pointer font-normal"
                >
                  {isRTL ? item.NameAr : item.Name}
                </Label>
              </div>
            ))}
            {items?.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-4">{t('admin.no_results')}</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            {t('admin.cancel')}
          </Button>
          <Button 
            className="bg-brand-primary" 
            onClick={() => onSave(selectedIds)}
            disabled={isSaving}
          >
            {isSaving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {t('admin.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignModal;