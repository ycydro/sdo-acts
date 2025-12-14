import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({
  open,
  onOpenChange,
  onConfirm,
  description,
  title,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border-2 border-red-200 shadow-xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertDialogTitle className="text-lg font-bold text-gray-900">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-700 mt-2">
            {description}
          </AlertDialogDescription>

          {/* Warning highlight box */}
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-red-800">
                Please review this action carefully before confirming.
              </p>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            className="font-medium border-2"
            disabled={isLoading}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className={`font-bold ${
              isDestructive ? "bg-red-600 hover:bg-red-700 text-white" : ""
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
