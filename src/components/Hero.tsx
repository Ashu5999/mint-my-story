import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Mint2Story Hero Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute inset-0" style={{ background: 'var(--gradient-glow)' }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm">
            <Sparkles className="w-4 h-4 text-brand-purple" />
            <span>Powered by Story Protocol</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Turn Your Instagram Content Into{" "}
            <span className="gradient-text">Licensed IP Assets</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Mint your posts, reels, and stories into Story Protocol IP assets. 
            Set licensing terms, earn automated royalties, and monetize your creativity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button variant="hero" size="xl" className="group">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glass" size="xl">
              Watch Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">
            <div className="glass p-6 rounded-2xl hover:bg-card/80 transition-smooth group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                <Zap className="w-6 h-6 text-brand-purple" />
              </div>
              <h3 className="font-semibold mb-2">One-Click Minting</h3>
              <p className="text-sm text-muted-foreground">
                Instantly mint Instagram content as IP assets with a single click
              </p>
            </div>

            <div className="glass p-6 rounded-2xl hover:bg-card/80 transition-smooth group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                <Shield className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="font-semibold mb-2">Automated Licensing</h3>
              <p className="text-sm text-muted-foreground">
                Set terms, attach royalty splits, and manage licenses effortlessly
              </p>
            </div>

            <div className="glass p-6 rounded-2xl hover:bg-card/80 transition-smooth group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                <Sparkles className="w-6 h-6 text-brand-glow" />
              </div>
              <h3 className="font-semibold mb-2">Instant Royalties</h3>
              <p className="text-sm text-muted-foreground">
                Receive automated micropayments when your IP is licensed
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
