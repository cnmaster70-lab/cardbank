import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { Product } from "./cards";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listProducts = createServerFn({ method: "GET" }).handler(async (): Promise<Product[]> => {
  const { data, error } = await publicClient()
    .from("products")
    .select("id, brand, processor, city, bin, last4, balance, price, in_stock")
    .order("price", { ascending: true });
  if (error) return [];
  return (data ?? []).map((p) => ({
    ...p,
    balance: Number(p.balance),
    price: Number(p.price),
  })) as Product[];
});

const orderSchema = z.object({
  contact: z.string().trim().min(3).max(255),
  contactType: z.enum(["email", "telegram"]),
  amount: z.number().min(0).max(1000000),
  items: z
    .array(
      z.object({
        id: z.string().max(64),
        brand: z.string().max(40),
        balance: z.number(),
        price: z.number(),
      }),
    )
    .max(50),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { error } = await publicClient().from("orders").insert({
      contact: data.contact,
      contact_type: data.contactType,
      amount: data.amount,
      items: data.items,
    });
    if (error) return { ok: false as const };
    return { ok: true as const };
  });
