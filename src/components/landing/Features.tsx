import { cn } from "@/lib/utils";
import { 
  RefreshCw, 
  Cloud, 
  Users, 
  Shield, 
  Zap, 
  Download,
  LucideIcon
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: RefreshCw,
    title: "Never Lose Progress Again",
    description: "Internet dropped? Laptop died? No problem. Pick up exactly where you left off. Your upload waits for you, not the other way around.",
  },
  {
    icon: Cloud,
    title: "Your Files, Everywhere",
    description: "Access from any device, anytime. Local speed when you're in the office, cloud reliability when you're on the move.",
  },
  {
    icon: Users,
    title: "Collaborate Without Chaos",
    description: "Share files with your team in one click. Built-in chat means no more hunting through email threads for that one attachment.",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "256-bit encryption protects every file. Your confidential data stays confidential — we can't even see it.",
  },
  {
    icon: Zap,
    title: "Blazing Fast Transfers",
    description: "Upload 10GB in minutes, not hours. Our optimized infrastructure means you spend less time waiting and more time doing.",
  },
  {
    icon: Download,
    title: "One-Click Downloads",
    description: "No signups required for recipients. Share a link, they click, they download. It's that simple.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-background overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          
          <h2
            className={cn(
              "text-3xl sm:text-4xl lg:text-5xl",
              "font-bold tracking-tight",
              "mb-6 animate-appear opacity-0",
              "[animation-delay:100ms]"
            )}
          >
            File Sharing That{" "}
            <span className="relative inline-block">
              <span className="text-gradient">Actually Works</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 4 150 4 198 10" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="opacity-60"/>
              </svg>
            </span>
          </h2>
          
          <p
            className={cn(
              "text-lg text-muted-foreground",
              "max-w-2xl mx-auto",
              "animate-appear opacity-0",
              "[animation-delay:200ms]"
            )}
          >
            We fixed everything that's broken about file sharing. 
            No more failed uploads, lost files, or security nightmares.
          </p>
        </div>

        {/* Features Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "group relative",
                "bg-card rounded-2xl",
                "border border-border/50",
                "p-6 lg:p-8",
                "transition-all duration-300",
                "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                "animate-appear opacity-0",
                index === 0 && "lg:col-span-2",
                index === 3 && "lg:col-span-2"
              )}
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-12 h-12 rounded-xl",
                  "bg-gradient-to-br from-primary to-primary/80",
                  "flex items-center justify-center",
                  "mb-5 shadow-lg shadow-primary/20",
                  "group-hover:scale-110 transition-transform duration-300"
                )}
              >
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Subtle gradient overlay on hover */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl opacity-0",
                  "bg-gradient-to-br from-primary/5 via-transparent to-accent/5",
                  "transition-opacity duration-300",
                  "group-hover:opacity-100",
                  "pointer-events-none"
                )}
              />
            </div>
          ))}
        </div>

        {/* Minimal Social Proof Section */}
        <div
          className={cn(
            "mt-16 lg:mt-20",
            "animate-appear opacity-0",
            "[animation-delay:900ms]"
          )}
        >
          <div className="text-center">
            {/* Trusted by text */}
            <p className="text-sm text-muted-foreground mb-8 uppercase tracking-widest font-medium">
              Trusted by teams at
            </p>
            
            {/* Logo Grid */}
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 mb-10">
              {[
                { name: "Google", letter: "G" },
                { name: "Microsoft", letter: "M" },
                { name: "Spotify", letter: "S" },
                { name: "Airbnb", letter: "A" },
                { name: "Stripe", letter: "S" },
                { name: "Notion", letter: "N" },
              ].map((company) => (
                <div
                  key={company.name}
                  className="group flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-sm font-bold text-foreground/70 group-hover:text-foreground transition-colors">
                      {company.letter}
                    </span>
                  </div>
                  <span className="text-base font-semibold text-foreground/60 group-hover:text-foreground transition-colors">
                    {company.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 pt-8 border-t border-border/50">
              {[
                { value: "10K+", label: "Teams" },
                { value: "2M+", label: "Files shared" },
                { value: "99.9%", label: "Uptime" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
