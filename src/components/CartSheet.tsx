import { useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/cards";
import { CheckoutDialog } from "./CheckoutDialog";

export function CartSheet() {
  const { items, total, count, remove, clear } = useCart();
  const [checkout, setCheckout] = useState(false);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="relative flex size-11 items-center justify-center rounded-full border border-border/70 text-foreground transition-colors hover:border-accent/60 hover:text-accent"
            aria-label="Open cart"
          >
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="flex w-full flex-col border-border/60 bg-card sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="font-display text-2xl">Your cart</SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-3 overflow-y-auto py-4">
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">Nothing here yet. Add an enroll to get started.</p>
            )}
            {items.map((c) => (
              <div key={c.id} className="rounded-xl border border-border/70 bg-secondary/40 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {c.brand} · {c.processor}
                    </p>
                    <p className="font-display text-xl">{money(c.balance)}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.city} · BIN {c.bin} ···· {c.last4}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-display text-lg text-accent">${c.price}</span>
                    <button
                      onClick={() => remove(c.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Remove from cart"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-border/60 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Total</span>
              <span className="font-display text-3xl">{money(total)}</span>
            </div>
            <Button
              variant="silver"
              size="lg"
              className="w-full"
              disabled={items.length === 0}
              onClick={() => setCheckout(true)}
            >
              Checkout
            </Button>
            {items.length > 0 && (
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={clear}>
                Clear cart
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutDialog
        open={checkout}
        onOpenChange={setCheckout}
        amount={total}
        items={items}
        label={`${count} enroll${count === 1 ? "" : "s"} in cart`}
      />
    </>
  );
}
