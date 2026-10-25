import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from 'react';

const CLOSE_FALLBACK_MS = 360;

/**
 * Controla un <dialog> nativo (foco atrapado, Esc, fondo inerte) con animación de cierre.
 * El navegador devuelve el foco al elemento que abrió el diálogo.
 */
export function useModalDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      dialog.removeAttribute('data-closing');
      if (!dialog.open) dialog.showModal();
      return;
    }
    if (!dialog.open) return;
    dialog.setAttribute('data-closing', '');
    const finish = () => {
      dialog.removeEventListener('animationend', onEnd);
      clearTimeout(timer);
      dialog.removeAttribute('data-closing');
      dialog.close();
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target === dialog) finish();
    };
    const timer = setTimeout(finish, CLOSE_FALLBACK_MS);
    dialog.addEventListener('animationend', onEnd);
    return () => {
      dialog.removeEventListener('animationend', onEnd);
      clearTimeout(timer);
    };
  }, [open]);

  const dialogProps = {
    ref,
    onCancel: (e: SyntheticEvent<HTMLDialogElement>) => {
      e.preventDefault();
      onClose();
    },
    // Un clic directamente sobre <dialog> corresponde al fondo (::backdrop).
    onClick: (e: MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
  };

  return dialogProps;
}
