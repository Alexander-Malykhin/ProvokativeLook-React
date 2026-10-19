import { useEffect, useState } from 'react';

export const useDeadline = (deadline: number): boolean => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const remaining = deadline - Date.now();
    if (remaining <= 0) return;
    const timer = window.setTimeout(() => setNow(Date.now()), remaining);
    return () => window.clearTimeout(timer);
  }, [deadline]);
  return Number.isFinite(deadline) && deadline > now;
};
