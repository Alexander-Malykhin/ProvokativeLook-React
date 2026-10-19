import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { lockBodyScroll } from '@helpers/bodyScrollLock';
import motion from './Modal.module.scss';
interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  overlayClassName: string;
  contentClassName: string;
  ariaLabelledBy?: string;
  closeDisabled?: boolean;
  closeOnBackdrop?: boolean;
}
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');
const Modal = ({
  open,
  onClose,
  children,
  overlayClassName,
  contentClassName,
  ariaLabelledBy,
  closeDisabled = false,
  closeOnBackdrop = true,
}: ModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (!open) {
      return;
    }
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const unlockScroll = lockBodyScroll();
    const focusable = Array.from(contentRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []).find(
      (element) => element.getClientRects().length > 0,
    );
    focusable?.focus({ preventScroll: true });
    const handleKeyDown = (event: KeyboardEvent) => {
      const overlays = document.querySelectorAll('[data-modal-overlay]');
      if (contentRef.current?.parentElement !== overlays[overlays.length - 1]) return;
      if (event.key === 'Escape' && !closeDisabled) {
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !contentRef.current) {
        return;
      }
      const elements = Array.from(contentRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => element.getClientRects().length > 0,
      );
      if (elements.length === 0) {
        event.preventDefault();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      unlockScroll();
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [closeDisabled, open]);
  if (!open) {
    return null;
  }
  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && !closeDisabled && event.target === event.currentTarget) {
      onClose();
    }
  };
  return createPortal(
    <div data-modal-overlay className={`${overlayClassName} ${motion.overlay}`} onMouseDown={handleBackdropMouseDown}>
      <div
        data-modal-content
        ref={contentRef}
        className={`${contentClassName} ${motion.content}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={motion.handle}
          aria-label="Потяните вниз, чтобы закрыть"
          disabled={closeDisabled}
          onClick={() => {
            if (!dragged.current) onClose();
          }}
          onPointerDown={(event) => {
            if (closeDisabled) return;
            dragged.current = false;
            dragStart.current = event.clientY;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (dragStart.current !== null && contentRef.current) {
              const delta = event.clientY - dragStart.current;
              if (Math.abs(delta) > 5) dragged.current = true;
              contentRef.current.style.translate = `0 ${Math.max(0, delta)}px`;
            }
          }}
          onPointerUp={(event) => {
            const delta = dragStart.current === null ? 0 : event.clientY - dragStart.current;
            dragStart.current = null;
            if (contentRef.current) contentRef.current.style.translate = '';
            if (delta > 60 && !closeDisabled) onClose();
          }}
          onPointerCancel={() => {
            dragStart.current = null;
            if (contentRef.current) contentRef.current.style.translate = '';
          }}
        />
        {children}
      </div>
    </div>,
    document.body,
  );
};
export default Modal;
