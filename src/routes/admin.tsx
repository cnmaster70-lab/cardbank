import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FrogLogo } from "@/components/FrogLogo";
import { money } from "@/lib/cards";
import {
  adminData,
  adminLogin,
  adminLogout,
  adminStatus,
  deleteProduct,
  saveProduct,
  setOrderStatus,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Frog Enrolls — Admin" },
      { name: "description", content: "Private admin area for Frog Enrolls inventory and orders." },
      { property: "og:title", content: "Frog Enrolls — Admin" },
      { property: "og:description", content: "Private admin area." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Row = {
  id?: string;
  brand: string;
  processor: string;
  city: string;
  bin: string;
  last4: string;
  balance: number;
  price: number;
  in_stock: boolean;
};

type Order = {
  id: string;
  contact: string;
  contact_type: string;
  amount: number;
  status: string;
  created_at: string;
  items: unknown;
};

const emptyRow: Row = {
  brand: "VISA",
  processor: "CARDNAV",
  city: "",
  bin: "",
  last4: "",
  balance: 1000,
  price: 110,
  in_stock: true,
};

function Admin() {
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const status = useServerFn(adminStatus);
  const load = useServerFn(adminData);
  const save = useServerFn(saveProduct);
  const del = useServerFn(deleteProduct);
  const mark = useServerFn(setOrderStatus);

  const [signedIn, setSignedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Row[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [draft, setDraft] = useState<Row>(emptyRow);
  const [tab, setTab] = useState<"products" | "orders">("products");

  const refresh = async () => {
    try {
      const d = await load();
      setProducts(d.products as Row[]);
      setOrders(d.orders as Order[]);
    } catch {
      setSignedIn(false);
    }
  };

  useEffect(() => {
    status().then((s) => {
      setSignedIn(s.admin);
      if (s.admin) refresh();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doLogin = async () => {
    const res = await login({ data: { password } });
    if (!res.ok) {
      toast.error("Wrong password");
      return;
    }
    setPassword("");
    setSignedIn(true);
    refresh();
  };

  if (!signedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 rounded-3xl border border-border/70 bg-card/80 p-6">
          <div className="flex items-center gap-3 text-accent">
            <FrogLogo className="size-9" />
            <h1 className="font-display text-2xl text-foreground">Admin access</h1>
          </div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doLogin()}
          />
          <Button variant="silver" size="lg" className="w-full" onClick={doLogin}>
            Enter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <header className="flex flex-wrap items-center gap-3">
        <FrogLogo className="size-8 text-accent" />
        <h1 className="font-display text-3xl">Frog Enrolls admin</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="wire" className="h-10" onClick={refresh}>
            Refresh
          </Button>
          <Button
            variant="ghost"
            className="h-10"
            onClick={async () => {
              await logout();
              setSignedIn(false);
            }}
          >
            Log out
          </Button>
        </div>
      </header>

      <div className="flex gap-2">
        <Button
          variant={tab === "products" ? "silver" : "wire"}
          className="h-10"
          onClick={() => setTab("products")}
        >
          Products ({products.length})
        </Button>
        <Button
          variant={tab === "orders" ? "silver" : "wire"}
          className="h-10"
          onClick={() => setTab("orders")}
        >
          Orders ({orders.length})
        </Button>
      </div>

      {tab === "products" && (
        <div className="space-y-4">
          <div className="space-y-3 rounded-3xl border border-accent/30 bg-card/70 p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent">Add a product</p>
            <ProductFields row={draft} onChange={setDraft} />
            <Button
              variant="silver"
              className="h-10"
              onClick={async () => {
                try {
                  await save({ data: draft });
                  setDraft(emptyRow);
                  toast.success("Product added");
                  refresh();
                } catch {
                  toast.error("Couldn't save — check the fields");
                }
              }}
            >
              Add product
            </Button>
          </div>

          {products.map((p, i) => (
            <div key={p.id} className="space-y-3 rounded-3xl border border-border/70 bg-card/60 p-5">
              <ProductFields
                row={p}
                onChange={(next) =>
                  setProducts((prev) => prev.map((x, j) => (j === i ? next : x)))
                }
              />
              <div className="flex gap-2">
                <Button
                  variant="silver"
                  className="h-10"
                  onClick={async () => {
                    try {
                      await save({ data: p });
                      toast.success("Saved");
                    } catch {
                      toast.error("Couldn't save");
                    }
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  className="h-10 text-destructive"
                  onClick={async () => {
                    if (!p.id) return;
                    await del({ data: { id: p.id } });
                    toast.success("Deleted");
                    refresh();
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 && (
            <p className="rounded-3xl border border-border/70 bg-card/60 p-8 text-center text-sm text-muted-foreground">
              No orders yet.
            </p>
          )}
          {orders.map((o) => (
            <div key={o.id} className="rounded-3xl border border-border/70 bg-card/60 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-secondary px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {o.contact_type}
                </span>
                <span className="font-display text-xl">{o.contact}</span>
                <span className="ml-auto font-display text-2xl text-accent">{money(o.amount)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(o.created_at).toLocaleString()} · status: {o.status}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["pending", "paid", "delivered", "cancelled"] as const).map((s) => (
                  <Button
                    key={s}
                    variant={o.status === s ? "silver" : "wire"}
                    className="h-9"
                    onClick={async () => {
                      await mark({ data: { id: o.id, status: s } });
                      setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: s } : x)));
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductFields({ row, onChange }: { row: Row; onChange: (r: Row) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(
        [
          ["brand", "Brand"],
          ["processor", "Processor"],
          ["city", "City"],
          ["bin", "BIN"],
          ["last4", "Last 4"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
          <Input value={row[key]} onChange={(e) => onChange({ ...row, [key]: e.target.value })} />
        </label>
      ))}
      <label className="space-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Balance ($)</span>
        <Input
          inputMode="decimal"
          value={String(row.balance)}
          onChange={(e) => onChange({ ...row, balance: Number(e.target.value.replace(/[^0-9.]/g, "")) || 0 })}
        />
      </label>
      <label className="space-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Price ($)</span>
        <Input
          inputMode="decimal"
          value={String(row.price)}
          onChange={(e) => onChange({ ...row, price: Number(e.target.value.replace(/[^0-9.]/g, "")) || 0 })}
        />
      </label>
      <Button
        variant={row.in_stock ? "silver" : "wire"}
        className="h-10 self-end"
        onClick={() => onChange({ ...row, in_stock: !row.in_stock })}
      >
        {row.in_stock ? "In stock" : "Sold out"}
      </Button>
    </div>
  );
}
