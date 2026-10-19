import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteHeader } from "@/components/SiteHeader";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import { useCart } from "@/lib/cart";
import { PERKS, money, tierFor, type Product } from "@/lib/cards";
import { listProducts } from "@/lib/shop.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CardBank — Checked Enroll Balances, BTC Only" },
      {
        name: "description",
        content:
          "CardBank: pre-made Visa, Mastercard and Discover enroll balances with full login access. Bitcoin payments only.",
      },
      { property: "og:title", content: "CardBank — Best quality enrolls" },
      {
        property: "og:description",
        content: "Real checked balances, instant manual delivery, Bitcoin only.",
      },
    ],
  }),
  loader: () => listProducts(),
  component: Index,
  errorComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">Inventory failed to load.</div>
  ),
});

function Index() {
  const products = Route.useLoaderData();
  const { add, has, count } = useCart();
  const [maxSpend, setMaxSpend] = useState("");
  const [sort, setSort] = useState<"low" | "high" | "balance">("low");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [buyNow, setBuyNow] = useState<Product | null>(null);

  const list = useMemo(() => {
    const cap = Number(maxSpend);
    let out = products.filter((c) => c.category !== "other");
    out = out.filter((c) => (inStockOnly ? c.in_stock : true));
    if (maxSpend && !Number.isNaN(cap) && cap > 0) out = out.filter((c) => c.price <= cap);
    return [...out].sort((a, b) =>
      sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : b.balance - a.balance,
    );
  }, [products, maxSpend, sort, inStockOnly]);

  const others = useMemo(
    () => products.filter((c) => c.category === "other").sort((a, b) => b.price - a.price),
    [products],
  );

  const stockCount = products.filter((c) => c.category !== "other" && c.in_stock).length;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-10">
        <section id="inventory" className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent">
            Random Visa · Mastercard · Discover
          </p>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">Available Balances- enrolls
ccs- below</h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Every enroll below is a real, checked balance. Once it's marked sold out it's gone —
            restocks drop 3 days a week.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex h-12 flex-1 items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-5 sm:flex-none">
              <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                I can spend up to
              </span>
              <span className="text-accent">$</span>
              <Input
                value={maxSpend}
                onChange={(e) => setMaxSpend(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                inputMode="numeric"
                placeholder="any"
                className="h-8 w-16 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-11 rounded-full border border-border/70 bg-secondary/60 px-4 text-sm text-foreground outline-none focus-visible:border-accent"
            >
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="balance">Biggest balance</option>
            </select>
            <Button
              variant={inStockOnly ? "silver" : "wire"}
              className="h-11"
              onClick={() => setInStockOnly((v) => !v)}
            >
              In stock only
            </Button>
          </div>

          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Showing {list.length} of {products.length} cards · {stockCount} in stock right now
            {count > 0 ? ` · ${count} in your cart` : ""}
          </p>
        </section>

        <section className="mt-8 space-y-5">
          {list.map((c) => (
            <article
              key={c.id}
              className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-[var(--shadow-lift)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full border border-border/80 px-4 py-2 text-[11px] uppercase tracking-[0.18em]">
                  {c.brand} · {c.processor}
                </span>
                <span className="rounded-full bg-secondary px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {tierFor(c.balance)}
                </span>
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 text-accent" /> {c.city}
              </p>

              <div className="mt-3 flex items-center gap-3 rounded-full border border-border/70 bg-secondary/40 px-3 py-2 text-xs tracking-[0.12em] text-muted-foreground">
                <span className="rounded-md bg-secondary px-2 py-1 text-[10px] text-foreground">BIN</span>
                <span className="truncate">
                  {c.brand} · {c.bin} ······ {c.last4}
                </span>
              </div>

              <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Enroll balance
              </p>
              <p className="font-display text-5xl leading-none">{money(c.balance)}</p>
              <p className="mt-3 font-display text-2xl text-accent">${c.price} price</p>

              <ul className="mt-5 space-y-2 text-sm text-foreground/85">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    {p}
                  </li>
                ))}
              </ul>

              {c.in_stock ? (
                <div className="mt-6 space-y-3">
                  <Button variant="silver" size="lg" className="w-full" onClick={() => setBuyNow(c)}>
                    Buy Now
                  </Button>
                  <Button
                    variant="wire"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      add(c);
                      toast.success("Added to cart", { description: `${c.brand} · ${money(c.balance)}` });
                    }}
                  >
                    {has(c.id) ? "In cart" : "Add to Cart"}
                  </Button>
                </div>
              ) : (
                <div className="mt-6 rounded-full border border-border/70 py-3 text-center text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Sold out
                </div>
              )}
            </article>
          ))}

          {list.length === 0 && (
            <p className="rounded-3xl border border-border/70 bg-card/60 p-8 text-center text-sm text-muted-foreground">
              Nothing matches that budget yet — raise the amount or check back on the next restock.
            </p>
          )}
        </section>

        <section className="mt-16 space-y-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent">Small balances</p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">Other</h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Cheaper picks between $10 and $50 — same rules, same instant manual delivery.
          </p>

          <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-[var(--shadow-lift)]">
            <div className="hidden grid-cols-[1.2fr_1.4fr_1fr_0.8fr_0.9fr_auto] gap-3 border-b border-border/60 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:grid">
              <span>Name</span>
              <span>City</span>
              <span>Brand</span>
              <span>Price</span>
              <span>Status</span>
              <span />
            </div>
            <div className="divide-y divide-border/50">
              {others.map((o) => (
                <div
                  key={o.id}
                  className="grid grid-cols-2 items-center gap-3 px-5 py-4 sm:grid-cols-[1.2fr_1.4fr_1fr_0.8fr_0.9fr_auto]"
                >
                  <span className="font-medium">{o.processor}</span>
                  <span className="text-sm text-muted-foreground">{o.city}</span>
                  <span className="text-sm">{o.brand}</span>
                  <span className="font-display text-lg">{money(o.price)}</span>
                  <span>
                    {o.in_stock ? (
                      <span className="rounded-full border border-accent/50 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-accent">
                        available
                      </span>
                    ) : (
                      <span className="rounded-full border border-border/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        sold
                      </span>
                    )}
                  </span>
                  <span className="col-span-2 sm:col-span-1">
                    {o.in_stock ? (
                      <Button variant="silver" className="h-9 w-full sm:w-auto" onClick={() => setBuyNow(o)}>
                        Request
                      </Button>
                    ) : (
                      <Button variant="wire" className="h-9 w-full sm:w-auto" disabled>
                        Request
                      </Button>
                    )}
                  </span>
                </div>
              ))}
              {others.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  Nothing here right now — check back on the next restock.
                </p>
              )}
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-border/60 pt-8 text-xs leading-relaxed text-muted-foreground">
          CardBank · Bitcoin payments only · Balances update mostly 3 days a week. All sales are
          final once an enroll is delivered.
        </footer>
      </main>

      <CheckoutDialog
        open={buyNow !== null}
        onOpenChange={(v) => !v && setBuyNow(null)}
        amount={buyNow?.price ?? 0}
        items={buyNow ? [buyNow] : []}
        label={buyNow ? `${buyNow.brand} · ${money(buyNow.balance)} enroll` : ""}
      />
    </div>
  );
}
