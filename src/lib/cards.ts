export type CardTier = "STARTER" | "MID" | "PREMIUM";

export type Product = {
  id: string;
  brand: string;
  processor: string;
  city: string;
  bin: string;
  last4: string;
  balance: number;
  price: number;
  in_stock: boolean;
  category: string;
};

export function tierFor(balance: number): CardTier {
  if (balance >= 2000) return "PREMIUM";
  if (balance >= 900) return "MID";
  return "STARTER";
}

export const PERKS = [
  "Full access login",
  "Instant delivery setup from the owner",
  "100% Apple Pay & Cash App linkable",
  "Pre-made enroll balance",
];

export const BTC_ADDRESS = "bc1q8xfhfwdmtjhqw5s9qpu7nvqdp0mttumrkm5hzl";

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
