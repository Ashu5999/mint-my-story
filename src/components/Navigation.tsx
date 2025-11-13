import { Button } from "@/components/ui/button";
import { Wallet, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-blue rounded-lg" />
            <span className="text-xl font-bold gradient-text">Mint2Story</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/marketplace" className="text-foreground/80 hover:text-foreground transition-smooth">
              Marketplace
            </Link>
            <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-smooth">
              Dashboard
            </Link>
            <Link to="/how-it-works" className="text-foreground/80 hover:text-foreground transition-smooth">
              How It Works
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="glass" size="default">
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
