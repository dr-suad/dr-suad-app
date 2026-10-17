import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

  const show = useCallback((message, type = 'info') => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 2500);
  }, []);

  return { toast, show };
}