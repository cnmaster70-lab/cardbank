import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BTC_ADDRESS, money } from "@/lib/cards";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Enter a valid email address" })
  .max(255, { message: "Email is too long" });

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  label: string;
};

export function CheckoutDialog({ open, onOpenChange, amount, label }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BTC_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — select the address manually.");
    }
  };

  const submit = () => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email address");
      return;
    }
    setError(null);
    setConfirmed(true);
    toast.success("Delivery email saved — send the BTC to complete the order.");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setConfirmed(false);
          setError(null);
        }
      }}
    >
      <DialogContent className="max-h-[88vh] overflow-y-auto border-border/60 bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl tracking-tight">How to purchase</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {label} — pay in Bitcoin only. Delivery is manual and fast.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Amount due</p>
            <p className="font-display text-4xl text-accent">{money(amount)}</p>
          </div>

          <ol className="space-y-4 text-sm">
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-xs">
                1
              </span>
              <span className="text-foreground/90">
                Get the <strong>exact amount of BTC</strong> equal to {money(amount)} at the current rate.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-xs">
                2
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <span className="text-foreground/90">Send it to this address:</span>
                <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/60 p-3">
                  <code className="min-w-0 flex-1 break-all text-xs leading-relaxed text-foreground">
                    {BTC_ADDRESS}
                  </code>
                  <Button size="icon" variant="ghost" className="size-8 shrink-0" onClick={copy} aria-label="Copy BTC address">
                    {copied ? <Check className="size-4 text-accent" /> : <Copy className="size-4" />}
                  </Button>
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-xs">
                3
              </span>
              <span className="text-foreground/90">
                Enter your email below — the login details land there right after the payment confirms.
              </span>
            </li>
          </ol>

          <div className="space-y-2">
            <label htmlFor="checkout-email" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Your email
            </label>
            <Input
              id="checkout-email"
              type="email"
              inputMode="email"
              maxLength={255}
              placeholder="you@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
                setConfirmed(false);
              }}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            {confirmed && (
              <p className="text-xs text-accent">
                Saved. Once the BTC lands, delivery goes out to {email.trim()}.
              </p>
            )}
          </div>

          <Button variant="silver" size="lg" className="w-full" onClick={submit}>
            {confirmed ? "Email saved" : "I sent the BTC"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Payments are confirmed on-chain. No refunds once an enroll is delivered.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
