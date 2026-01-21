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
    title: "Resumable Uploads",
    description: "Pause and resume your uploads anytime. Never lose progress on large file transfers again.",
  },
  {
    icon: Cloud,
    title: "Hybrid Storage",
    description: "Best of both worlds with local server speed and cloud reliability for seamless access.",
  },
  {
    icon: Users,
    title: "Group Collaboration",
    description: "Create groups, share files, and chat in real-time with your team or classmates.",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "JWT-based authentication ensures your files are protected with industry-standard security.",
  },
  {
    icon: Zap,
    title: "Fast Transfers",
    description: "Optimized upload and download speeds to handle even the largest files efficiently.",
  },
  {
    icon: Download,
    title: "Easy Downloads",
    description: "Download files with a single click. Resume interrupted downloads seamlessly.",
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
            <span className="text-sm font-medium text-primary">Features</span>
          </div>
          
          <h2
            className={cn(
              "text-3xl sm:text-4xl lg:text-5xl",
              "font-bold tracking-tight",
              "mb-6 animate-appear opacity-0",
              "[animation-delay:100ms]"
            )}
          >
            Everything You Need for{" "}
            <span className="text-gradient">File Sharing</span>
          </h2>
          
          <p
            className={cn(
              "text-lg text-muted-foreground",
              "max-w-2xl mx-auto",
              "animate-appear opacity-0",
              "[animation-delay:200ms]"
            )}
          >
            Built with modern technology to give you the best file transfer experience.
            Simple, secure, and reliable.
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
                // Make first two cards larger on desktop
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

        {/* Bottom highlight */}
        <div
          className={cn(
            "mt-16 text-center",
            "animate-appear opacity-0",
            "[animation-delay:900ms]"
          )}
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-muted/50 border border-border/50">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background flex items-center justify-center"
                >
                  <span className="text-xs font-medium text-primary">
                    {String.fromCharCode(64 + i)}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-4 w-px bg-border" />
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">10,000+</span> users worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
