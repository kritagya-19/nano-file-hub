import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  UserPlus, 
  Upload, 
  Share2, 
  Globe,
  Zap,
  Sparkles
} from "lucide-react";
import StepCard from "./StepCard";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    subtitle: "30 seconds. That's it.",
    description: "Just your email — no credit card, no forms, no friction. You'll be uploading before your coffee gets cold.",
    icon: UserPlus,
  },
  {
    number: "02", 
    title: "Drop Your Files",
    subtitle: "Up to 10GB. Any format.",
    description: "Drag, drop, done. Lost connection? We pick up right where you left off. Every. Single. Time.",
    icon: Upload,
  },
  {
    number: "03",
    title: "Share Instantly",
    subtitle: "One link. Anyone. Anywhere.",
    description: "Generate a secure link or invite your team. Recipients don't need an account to download.",
    icon: Share2,
  },
  {
    number: "04",
    title: "Access Everywhere",
    subtitle: "Phone. Tablet. Desktop.",
    description: "Your files follow you — encrypted, backed up, and always ready when you are.",
    icon: Globe,
  }
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className={cn(
        "relative py-24 lg:py-32",
        "overflow-hidden bg-background"
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.03),transparent_70%)]" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full",
              "bg-primary/10 border border-primary/20",
              "mb-6"
            )}
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Quick Start Guide</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            How It{" "}
            <span className="relative inline-block">
              <span className="text-gradient">Works</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 4 150 4 198 10" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="opacity-60"/>
              </svg>
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Four simple steps. Two minutes flat. Zero learning curve.
            <br />
            <span className="text-foreground font-medium">If you can drag a file, you can use NanoFile.</span>
          </p>
        </motion.div>

        {/* Timeline Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-24 lg:space-y-16">
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                {...step}
                index={index}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Bottom success indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 flex justify-center"
        >
          <div className={cn(
            "relative inline-flex items-center gap-4 px-8 py-5 rounded-2xl",
            "bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10",
            "border border-primary/20",
            "backdrop-blur-sm"
          )}>
            {/* Animated sparkle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -top-3 -right-3"
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">You're all set!</p>
                <p className="text-sm text-muted-foreground">Start sharing files in under 2 minutes</p>
              </div>
            </div>

            <div className="h-10 w-px bg-border/50 mx-2" />

            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">50M+</p>
                <p className="text-xs text-muted-foreground">Files Shared</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">99.9%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
              <div className="text-center hidden sm:block">
                <p className="text-2xl font-bold text-foreground">4.9★</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
