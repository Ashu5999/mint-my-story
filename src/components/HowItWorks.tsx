import { Upload, FileSignature, Coins } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload Content",
    description: "Connect your Instagram or upload creative content directly. Your stories become the foundation of your IP portfolio."
  },
  {
    icon: FileSignature,
    number: "02", 
    title: "Set License Terms",
    description: "Define how others can use your IP. Set pricing, duration, and restrictions with smart contracts."
  },
  {
    icon: Coins,
    number: "03",
    title: "Earn Royalties",
    description: "Every license, remix, and derivative work automatically generates royalties sent directly to your wallet."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-32 relative story-bg">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto font-light">
            Three simple steps to transform your creativity into programmable IP
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-3xl bg-card/50 border border-border/50 hover:border-border transition-all duration-500 hover:-translate-y-2"
            >
              {/* Step number */}
              <div className="text-6xl font-light text-muted/30 mb-6">
                {step.number}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                <step.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-medium mb-3 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
