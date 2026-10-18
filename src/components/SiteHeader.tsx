import { Button } from "@/components/ui/button";
import { CartSheet } from "./CartSheet";
import { BankLogo } from "./BankLogo";

const TICKER = "ЛУЧШЕЕ КАЧЕСТВО ЭНРОЛЛОВ";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      <div className="overflow-hidden border-b border-accent/30 bg-accent py-1.5">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.3em] text-accent-foreground">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>{TICKER} ·</span>
          ))}
        </div>
      </div>
      <div className="border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-accent/40 bg-secondary text-accent">
              <BankLogo className="size-6" />
            </span>
            <span className="truncate font-display text-xl tracking-wide sm:text-2xl">CardBank</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <CartSheet />
            <Button
              variant="silver"
              className="h-11 px-4 text-sm leading-tight"
              onClick={() =>
                document.getElementById("inventory")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Purchase Account
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
