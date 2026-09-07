"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type CartLine = {
  key: string; // productId + sizeId, identifie une ligne unique
  productId: string;
  productName: string;
  imageUrl: string;
  sizeId?: string;
  sizeLabel?: string;
  unitPrice: number; // centimes
  quantity: number;
};

type CartState = { lines: CartLine[] };

type CartAction =
  | { type: "ADD"; line: Omit<CartLine, "quantity">; quantity: number }
  | { type: "REMOVE"; key: string }
  | { type: "SET_QTY"; key: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; state: CartState };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.lines.find((l) => l.key === action.line.key);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.key === action.line.key ? { ...l, quantity: l.quantity + action.quantity } : l
          )
        };
      }
      return { lines: [...state.lines, { ...action.line, quantity: action.quantity }] };
    }
    case "REMOVE":
      return { lines: state.lines.filter((l) => l.key !== action.key) };
    case "SET_QTY":
      return {
        lines: state.lines
          .map((l) => (l.key === action.key ? { ...l, quantity: action.quantity } : l))
          .filter((l) => l.quantity > 0)
      };
    case "CLEAR":
      return { lines: [] };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

const CartContext = createContext<{
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeLine: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
} | null>(null);

const STORAGE_KEY = "pizza-resto-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        dispatch({ type: "HYDRATE", state: JSON.parse(raw) });
      } catch {
        // ignore une valeur corrompue
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalItems = useMemo(() => state.lines.reduce((n, l) => n + l.quantity, 0), [state.lines]);
  const totalPrice = useMemo(
    () => state.lines.reduce((n, l) => n + l.quantity * l.unitPrice, 0),
    [state.lines]
  );

  const value = {
    lines: state.lines,
    addLine: (line: Omit<CartLine, "quantity">, quantity = 1) => dispatch({ type: "ADD", line, quantity }),
    removeLine: (key: string) => dispatch({ type: "REMOVE", key }),
    setQuantity: (key: string, quantity: number) => dispatch({ type: "SET_QTY", key, quantity }),
    clear: () => dispatch({ type: "CLEAR" }),
    totalItems,
    totalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return ctx;
}
