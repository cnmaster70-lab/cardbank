import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

type AdminSession = { admin?: boolean };

function sessionConfig() {
  return {
    password: process.env["ADMIN_SESSION_SECRET"]!,
    name: "frog-admin",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.admin) throw new Error("Not authorized");
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string().max(200) }).parse(d))
  .handler(async ({ data }) => {
    const allowed = [process.env["ADMIN_PASSWORD_1"], process.env["ADMIN_PASSWORD_2"]].filter(
      (p): p is string => Boolean(p),
    );
    const ok = allowed.some((p) => matches(data.password, p));
    if (!ok) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { admin: Boolean(session.data.admin) };
});

export const adminData = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [products, orders] = await Promise.all([
    supabaseAdmin.from("products").select("*").order("price", { ascending: true }),
    supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false }).limit(200),
  ]);
  return {
    products: (products.data ?? []).map((p) => ({
      ...p,
      balance: Number(p.balance),
      price: Number(p.price),
    })),
    orders: (orders.data ?? []).map((o) => ({ ...o, amount: Number(o.amount) })),
  };
});

const productInput = z.object({
  id: z.string().uuid().optional(),
  brand: z.string().trim().min(1).max(40),
  processor: z.string().trim().min(1).max(40),
  city: z.string().trim().min(1).max(80),
  bin: z.string().trim().min(1).max(12),
  last4: z.string().trim().min(1).max(8),
  balance: z.number().min(0).max(1000000),
  price: z.number().min(0).max(1000000),
  in_stock: z.boolean(),
});

export const saveProduct = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => productInput.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...fields } = data;
    const res = id
      ? await supabaseAdmin.from("products").update(fields).eq("id", id)
      : await supabaseAdmin.from("products").insert(fields);
    if (res.error) throw new Error(res.error.message);
    return { ok: true as const };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const setOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["pending", "paid", "delivered", "cancelled"]) }).parse(d),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

const NAMES = [
  "Coleman", "Omari", "Zinnes", "Makell", "Hacker", "Oler", "Barksdale", "Renfro",
  "Tollison", "Palmer", "Quimby", "Lindell", "Vannoy", "Strother", "Kimball", "Dunbar",
  "Epperson", "Fouts", "Grisham", "Hollis", "Ivers", "Jablonski", "Kraus", "Lomax",
];
const CITIES = [
  "Louisville, KY", "Town of Rockingham, VT", "Mountain View, CA", "Savannah, GA",
  "Fort Collins, CO", "Tulsa, OK", "Boise, ID", "Des Moines, IA", "Reno, NV",
  "Spokane, WA", "Anchorage, AK", "Biloxi, MS", "Eugene, OR", "Toledo, OH",
  "Knoxville, TN", "Fresno, CA", "Albany, NY", "Tucson, AZ",
];
const BRANDS: Array<[string, string]> = [
  ["Visa", "4"],
  ["Mastercard", "5"],
  ["Discover", "6"],
];

export const restockOther = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ count: z.number().int().min(1).max(50) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = Array.from({ length: data.count }, () => {
      const [brand, prefix] = BRANDS[Math.floor(Math.random() * BRANDS.length)]!;
      const price = Math.round((10 + Math.random() * 40) * 100) / 100;
      return {
        brand,
        processor: NAMES[Math.floor(Math.random() * NAMES.length)]!,
        city: CITIES[Math.floor(Math.random() * CITIES.length)]!,
        bin: prefix + String(Math.floor(10000 + Math.random() * 89999)),
        last4: String(Math.floor(1000 + Math.random() * 9000)),
        balance: price,
        price,
        in_stock: true,
        category: "other",
      };
    });
    const { error } = await supabaseAdmin.from("products").insert(rows);
    if (error) throw new Error(error.message);
    return { ok: true as const, added: rows.length };
  });
