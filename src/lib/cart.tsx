import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CARDS, type EnrollCard } from "./cards";

type CartCtx = {
  ids: string[];
  items: EnrollCard[];
  total: number;
  count: number;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "enroll-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setIds(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  const add = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);
  const remove = useCallback((id: string) => setIds((prev) => prev.filter((x) => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(() => {
    const items = ids
      .map((id) => CARDS.find((c) => c.id === id))
      .filter((c): c is EnrollCard => Boolean(c));
    return {
      ids,
      items,
      total: items.reduce((s, c) => s + c.price, 0),
      count: items.length,
      has: (id: string) => ids.includes(id),
      add,
      remove,
      clear,
    };
  }, [ids, add, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
