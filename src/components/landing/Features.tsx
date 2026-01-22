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
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full",
              "bg-primary/10 border border-primary/20",
              "mb-6 animate-appear"
            )}
          >
            <span className="text-sm font-medium text-primary">Why Teams Choose Us</span>
          </div>
          
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

        {/* Premium Social Proof Section */}
        <div
          className={cn(
            "mt-20 lg:mt-24",
            "animate-appear opacity-0",
            "[animation-delay:900ms]"
          )}
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Glassmorphism card */}
            <div className={cn(
              "relative overflow-hidden rounded-3xl",
              "bg-gradient-to-br from-card/80 via-card/60 to-card/80",
              "backdrop-blur-xl",
              "border border-border/50",
              "p-8 lg:p-12",
              "shadow-2xl shadow-primary/5"
            )}>
              {/* Decorative gradient orbs */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Left side - Stats and avatars */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Premium Avatar Stack */}
                  <div className="relative">
                    <div className="flex -space-x-3">
                      {[
                        { gradient: "from-indigo-500 to-purple-600", initials: "JD" },
                        { gradient: "from-emerald-500 to-teal-600", initials: "SK" },
                        { gradient: "from-orange-500 to-red-600", initials: "AL" },
                        { gradient: "from-pink-500 to-rose-600", initials: "MR" },
                        { gradient: "from-cyan-500 to-blue-600", initials: "TW" },
                      ].map((avatar, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-11 h-11 rounded-full",
                            "bg-gradient-to-br",
                            avatar.gradient,
                            "border-[3px] border-card",
                            "flex items-center justify-center",
                            "shadow-lg",
                            "transition-transform duration-300 hover:scale-110 hover:z-10"
                          )}
                          style={{ animationDelay: `${i * 100}ms` }}
                        >
                          <span className="text-xs font-bold text-white">
                            {avatar.initials}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Pulse ring */}
                    <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card animate-pulse" />
                  </div>
                  
                  {/* Stats */}
                  <div className="text-center sm:text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl lg:text-5xl font-bold text-gradient">10,000+</span>
                    </div>
                    <p className="text-muted-foreground text-sm lg:text-base mt-1">
                      teams trust NanoFile
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-px h-20 bg-gradient-to-b from-transparent via-border to-transparent" />

                {/* Right side - Rating and logos */}
                <div className="flex flex-col items-center lg:items-end gap-4">
                  {/* Star rating */}
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-5 h-5 text-amber-400 fill-amber-400"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-foreground">4.9/5</span>
                    <span className="text-sm text-muted-foreground">(2,847 reviews)</span>
                  </div>

                  {/* Trusted by logos */}
                  <div className="flex items-center gap-6 opacity-60">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Trusted by</span>
                    <div className="flex items-center gap-4">
                      {/* Generic company logo placeholders */}
                      {["Stanford", "MIT", "Google", "Meta"].map((company) => (
                        <span 
                          key={company}
                          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom testimonial snippet */}
              <div className="relative z-10 mt-8 pt-8 border-t border-border/50">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
                  <svg className="w-8 h-8 text-primary/30 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-muted-foreground italic">
                    "NanoFile transformed how our team shares files. What used to take hours now takes seconds."
                  </p>
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">
                    — Sarah K., Product Lead
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
