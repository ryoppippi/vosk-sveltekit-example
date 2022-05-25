import { readable } from 'svelte/store';

export const isUserTouched = readable(false, (set) => {
  const eventName = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';

  const touchStart = () => {
    document.removeEventListener('touchstart', touchStart);
    document.removeEventListener(eventName, touchStart);
    set(true);
  };

  document.addEventListener('touchstart', touchStart);
  document.addEventListener(eventName, touchStart);
});
