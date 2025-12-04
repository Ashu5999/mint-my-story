import { Link } from "react-router-dom";
import { Github, Twitter, MessageCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="py-16 border-t border-border/30 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-semibold tracking-tight">
              Mint2Story
            </Link>
            <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed">
              Transform creative content into blockchain-verified IP assets with programmable licensing.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-foreground">Product</h4>
            <ul className="space-y-3">
              <FooterLink to="/marketplace">Marketplace</FooterLink>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
              <FooterLink to="/create-ip">Create IP</FooterLink>
              <FooterLink to="/how-it-works">How It Works</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-foreground">Resources</h4>
            <ul className="space-y-3">
              <FooterLink to="#">Documentation</FooterLink>
              <FooterLink to="#">API Reference</FooterLink>
              <FooterLink to="#">Developer Guide</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-foreground">Legal</h4>
            <ul className="space-y-3">
              <FooterLink to="#">Privacy Policy</FooterLink>
              <FooterLink to="#">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mint2Story. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li>
    <Link 
      to={to} 
      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
    >
      {children}
    </Link>
  </li>
);
