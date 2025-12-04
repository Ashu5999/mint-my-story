import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden story-bg">
      {/* Floating 3D shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large blurred shapes in background */}
        <div 
          className="shape-3d shape-blur-strong w-32 h-32"
          style={{ top: '15%', left: '10%', animationDelay: '0s' }}
        />
        <div 
          className="shape-3d shape-blur-strong w-24 h-24 rounded-full"
          style={{ top: '20%', right: '15%', animationDelay: '2s' }}
        />
        <div 
          className="shape-3d shape-blur w-16 h-16"
          style={{ top: '40%', left: '5%', animationDelay: '1s' }}
        />
        <div 
          className="shape-3d shape-blur w-20 h-20 rounded-full"
          style={{ top: '60%', right: '8%', animationDelay: '3s' }}
        />
        <div 
          className="shape-3d shape-blur-strong w-28 h-28"
          style={{ top: '70%', left: '20%', animationDelay: '4s' }}
        />
        <div 
          className="shape-3d shape-blur w-14 h-14 rounded-full"
          style={{ top: '30%', left: '30%', animationDelay: '1.5s' }}
        />
        <div 
          className="shape-3d shape-blur-strong w-20 h-20"
          style={{ top: '50%', right: '25%', animationDelay: '2.5s' }}
        />
        <div 
          className="shape-3d shape-blur w-12 h-12 rounded-full"
          style={{ bottom: '20%', right: '35%', animationDelay: '0.5s' }}
        />
        <div 
          className="shape-3d shape-blur w-18 h-18"
          style={{ top: '25%', right: '40%', animationDelay: '3.5s' }}
        />
        <div 
          className="shape-3d shape-blur-strong w-24 h-24 rounded-full"
          style={{ bottom: '30%', left: '40%', animationDelay: '4.5s' }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div className="hero-grid" />

      {/* Content */}
      <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95]">
            <span className="block text-foreground/90">AI-native</span>
            <span className="block text-foreground/90">Infrastructure for</span>
            <span className="block text-foreground">Creative IP</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Transform your creative content into blockchain-verified IP assets. 
            Mint, license, and monetize with programmable ownership and automated royalties.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link to="/dashboard">
              <Button className="btn-pill btn-pill-primary min-w-[180px] h-14 text-base">
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button className="btn-pill btn-pill-secondary min-w-[180px] h-14 text-base">
                Explore
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scrolling icons marquee - similar to Story */}
      <div className="absolute bottom-0 left-0 right-0 py-8 overflow-hidden opacity-30">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="mx-8 w-12 h-12 rounded-xl bg-muted/30 flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
