// בס"ד
import type{  FC } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDeletePopupProps {
  onDelete: () => void;
  close: () => void;
  itemName?: string;
}

export const ConfirmDeletePopup: FC<ConfirmDeletePopupProps> = ({
  onDelete,
  itemName = "this form",
  close,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop - Styled to match your slate-950 theme */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
        onClick={close}
      />

      {/* Modal Content Box */}
      <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl ring-1 ring-white/5 animate-in fade-in zoom-in duration-200">
        {/* Close Button (Top Right) */}
        <button
          onClick={close}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-4 rotate-3">
            <AlertTriangle className="text-rose-500" size={32} />
          </div>

          <h3 className="text-xl font-bold text-slate-100 mb-2">
            Confirm Delete
          </h3>
          <p className="text-slate-400 mb-6 text-sm leading-relaxed">
            Are you sure you want to remove{" "}
            <span className="text-rose-400 font-semibold">{itemName}</span>?
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={close}
              className="order-2 sm:order-1 flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                close();
                onDelete();
              }}
              className="order-1 sm:order-2 flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-transform active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
