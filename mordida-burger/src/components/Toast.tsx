import { useEffect } from 'react';
import { BagIcon } from './Icons';
import './Toast.css';

export interface ToastData {
  id: number;
  text: string;
}

interface Props {
  toast: ToastData | null;
  onDismiss: () => void;
  onAction: () => void;
}

export function Toast({ toast, onDismiss, onAction }: Props) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className="toast glass">
          <BagIcon size={20} />
          <span>{toast.text}</span>
          <button type="button" onClick={onAction}>
            Ver pedido
          </button>
        </div>
      )}
    </div>
  );
}
