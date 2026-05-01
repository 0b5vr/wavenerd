import { useRef, useState, useEffect } from 'react';

/**
 * Check if the content of an element is truncated (overflowing) and get a ref to the element.
 * @returns `[ref, isTruncated]`. The ref should be attached to the element to be observed, and isTruncated will be true if the content is truncated.
 */
export function useIsTruncated<T extends HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el == null) return;

    const observer = new ResizeObserver(() => {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isTruncated];
}
