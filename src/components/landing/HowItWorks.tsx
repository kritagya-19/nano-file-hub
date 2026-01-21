import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  UserPlus, 
  Upload, 
  Share2, 
  Globe,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Clock
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    subtitle: "30 seconds. That's it.",
    description: "Just your email — no credit card, no forms, no friction. You'll be uploading before your coffee gets cold.",
    icon: UserPlus,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    features: ["No credit card required", "Instant access", "Free forever tier"]
  },
  {
    number: "02", 
    title: "Drop Your Files",
    subtitle: "Up to 10GB. Any format.",
    description: "Drag, drop, done. Lost connection? We pick up right where you left off. Every. Single. Time.",
    icon: Upload,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    features: ["Resumable uploads", "All file types", "Automatic backup"]
  },
  {
    number: "03",
    title: "Share Instantly",
    subtitle: "One link. Anyone. Anywhere.",
    description: "Generate a secure link or invite your team. Recipients don't need an account to download.",
    icon: Share2,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    features: ["Secure links", "No login required", "Track downloads"]
  },
  {
    number: "04",
    title: "Access Everywhere",
    subtitle: "Phone. Tablet. Desktop.",
    description: "Your files follow you — encrypted, backed up, and always ready when you are.",
    icon: Globe,
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    features: ["Cross-platform", "Bank-level encryption", "Real-time sync"]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className={cn(
        "relative py-24 lg:py-32",
        "overflow-hidden bg-background"
      )}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

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
            <span className="relative">
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

        {/* Steps Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="group relative"
            >
              <div
                className={cn(
                  "relative h-full p-8 rounded-3xl",
                  "bg-card border border-border/50",
                  "transition-all duration-500",
                  "hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5",
                  "hover:-translate-y-1"
                )}
              >
                {/* Step number badge */}
                <div className="absolute -top-3 -left-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    "bg-gradient-to-br shadow-lg",
                    step.color,
                    "text-white font-bold text-lg"
                  )}>
                    {step.number}
                  </div>
                </div>

                {/* Connection line for desktop */}
                {index < 3 && (
                  <div className="hidden md:block absolute -right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-10">
                    <div className={cn(
                      "w-8 lg:w-10 h-0.5 bg-gradient-to-r from-border to-transparent",
                      index % 2 === 0 ? "block" : "hidden"
                    )} />
                  </div>
                )}

                {/* Icon */}
                <div className="mt-4 mb-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center",
                    step.bgColor,
                    "border",
                    step.borderColor,
                    "transition-transform duration-300 group-hover:scale-110"
                  )}>
                    <step.icon className={cn(
                      "w-8 h-8",
                      "text-transparent bg-clip-text bg-gradient-to-br",
                      step.color
                    )} style={{ color: `var(--tw-gradient-from)` }} />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className={cn(
                      "text-sm font-semibold bg-gradient-to-r bg-clip-text text-transparent",
                      step.color
                    )}>
                      {step.subtitle}
                    </p>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Features */}
                  <div className="pt-4 space-y-2">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className={cn(
                  "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500",
                  "bg-gradient-to-br pointer-events-none",
                  step.color,
                  "group-hover:opacity-5"
                )} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className={cn(
            "inline-flex items-center gap-6 px-8 py-4 rounded-2xl",
            "bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10",
            "border border-primary/20"
          )}>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-background">JD</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-background">MK</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-background">AS</div>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Join 50,000+ users</p>
                <p className="text-xs text-muted-foreground">who started this week</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-border" />
            
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">256-bit encryption</span>
            </div>
            
            <div className="h-8 w-px bg-border hidden sm:block" />
            
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">2 min setup</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
