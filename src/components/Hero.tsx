import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-depth">
      {/* Layered dark / 3D background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Mint2Story Hero Background"
          className="w-full h-full object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="hero-orbit" />
        <div className="hero-grid" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] items-center">
          {/* Left: copy + CTAs */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm shadow-md shadow-black/40">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <span className="text-foreground/80">Powered by Story Protocol</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Turn Your Instagram Content Into
              <span className="block mt-2 gradient-text">Licensed IP Assets</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Mint your posts, reels, and stories into Story Protocol IP assets.
              Set licensing terms, earn automated royalties, and monetize your creativity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 pt-2">
              <Link to="/dashboard">
                <Button
                  variant="hero"
                  size="xl"
                  className="group shadow-lg shadow-brand-purple/30 hover:shadow-brand-purple/50"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="glass" size="xl" className="backdrop-blur-xl">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: 3D feature stack */}
          <div className="relative h-[320px] md:h-[380px] lg:h-[420px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-md space-y-4">
                <div className="glass card-3d rounded-3xl p-6 md:p-7 flex items-start gap-4 transition-smooth tilt-soft">
                  <div className="w-12 h-12 bg-primary/15 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">One-Click Minting</h3>
                    <p className="text-sm text-muted-foreground">
                      Instantly turn Instagram content into Story Protocol IP assets ready for licensing.
                    </p>
                  </div>
                </div>

                <div className="glass card-3d rounded-3xl p-6 md:p-7 flex items-start gap-4 transition-smooth tilt-soft ml-4 md:ml-10">
                  <div className="w-12 h-12 bg-primary/15 rounded-2xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Automated Licensing</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure terms and royalty splits once, then let the protocol handle the rest.
                    </p>
                  </div>
                </div>

                <div className="glass card-3d rounded-3xl p-6 md:p-7 flex items-start gap-4 transition-smooth tilt-soft mr-4 md:mr-10">
                  <div className="w-12 h-12 bg-primary/15 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-brand-glow" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Instant Royalties</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn on-chain royalties whenever brands license or remix your content.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating glow behind cards */}
            <div className="absolute -inset-x-10 bottom-0 h-40 bg-gradient-to-t from-brand-purple/40 via-brand-blue/20 to-transparent blur-3xl opacity-70" />
          </div>
        </div>
      </div>
    </section>
  );
};
