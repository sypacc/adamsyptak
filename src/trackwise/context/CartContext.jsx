import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);
const CART_KEY = "tw-cart";

function loadCart() {
  try {
    var raw = JSON.parse(localStorage.getItem(CART_KEY));
    if (raw && typeof raw === "object") {
      return { items: raw.items || [], reservation: raw.reservation || null };
    }
  } catch (e) {
    // ignore
  }
  return { items: [], reservation: null };
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    // ignore
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Last merch item added, for the confirmation toast. `key` changes on
  // every add so re-adding the same item re-triggers the toast.
  const [toast, setToast] = useState(null);
  // Poslední zaplacená objednávka z košíku — rezervační formulář podle ní
  // pozná, že jeho trénink už je zaplacený, a ukáže potvrzení.
  const [paidOrder, setPaidOrder] = useState(null);

  const update = useCallback((updater) => {
    setCart((prev) => {
      const next = updater(prev);
      saveCart(next);
      return next;
    });
  }, []);

  const addMerchItem = useCallback(
    (item) => {
      update((prev) => {
        const existing = prev.items.find((i) => i.id === item.id);
        const items = existing
          ? prev.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
          : [...prev.items, { id: item.id, name: item.name, price: item.price, qty: 1 }];
        return { ...prev, items };
      });
      setToast({ key: Date.now(), name: item.name, price: item.price });
    },
    [update]
  );

  const dismissToast = useCallback(() => setToast(null), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const removeMerchItem = useCallback(
    (id) => {
      update((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
    },
    [update]
  );

  const setReservation = useCallback(
    (res) => {
      update((prev) => ({ ...prev, reservation: res }));
    },
    [update]
  );

  const clearReservation = useCallback(() => {
    update((prev) => (prev.reservation ? { ...prev, reservation: null } : prev));
  }, [update]);

  const clearAll = useCallback(() => {
    update(() => ({ items: [], reservation: null }));
  }, [update]);

  const markPaid = useCallback((order) => {
    setPaidOrder({ ...order, id: Date.now() });
  }, []);

  const count = cart.items.reduce((sum, i) => sum + i.qty, 0) + (cart.reservation ? 1 : 0);
  const total = cart.items.reduce((sum, i) => sum + i.qty * i.price, 0) + (cart.reservation ? cart.reservation.price : 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        count,
        total,
        addMerchItem,
        removeMerchItem,
        setReservation,
        clearReservation,
        clearAll,
        paidOrder,
        markPaid,
        isCartOpen,
        openCart,
        closeCart,
        toast,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
