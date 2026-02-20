import { Zap } from "lucide-react";

interface FooterProps {}

export const Footer = ({}: FooterProps) => {
  return (
    <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8 mt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground border-t border-border pt-6">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧀</span>
          <span>
            <span className="text-cheese font-semibold">CheeseUp</span> — Powered by{" "}
            <a
              href="https://cheese.null"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cheese hover:text-cheese-light underline underline-offset-2 transition-colors"
            >
              cheese.null
            </a>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://waxblock.io/account/cheesepowerz"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cheese transition-colors flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            cheesepowerz
          </a>
          <span>•</span>
          <a
            href="https://waxblock.io/account/cheeseburger"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cheese transition-colors"
          >
            cheeseburger
          </a>
          <span>•</span>
          <a
            href="https://wax.alcor.exchange"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cheese transition-colors"
          >
            Get CHEESE
          </a>
        </div>
      </div>
    </footer>
  );
};
