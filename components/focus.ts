/** Everything Tab can land on. */
export const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** In a modal sheet or card, Tab and Shift+Tab loop inside `container` instead of leaving it. */
export function keepTabInside(event: KeyboardEvent, container: HTMLElement | null): void {
  if (event.key !== "Tab" || !container) return;
  const items = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)];
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
