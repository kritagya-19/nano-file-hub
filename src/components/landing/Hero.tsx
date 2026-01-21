import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mockup } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import { Play, ArrowRight, Upload } from "lucide-react";

const Hero = () => {
  return (
    <section
      className={cn(
        "relative bg-background text-foreground",
        "py-12 px-4 md:py-24 lg:py-32",
        "overflow-hidden"
      )}
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Trust Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full",
              "bg-primary/10 border border-primary/20",
              "mb-6 animate-appear"
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">
              Trusted by 10,000+ teams worldwide
            </span>
          </div>

          {/* Heading - Pain point → Solution */}
          <h1
            className={cn(
              "text-gradient",
              "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
              "font-extrabold tracking-tight",
              "max-w-4xl mx-auto",
              "animate-appear",
              "leading-[1.1]"
            )}
          >
            Stop Losing Files. Start Sharing Smarter.
          </h1>

          {/* Description - Benefit focused */}
          <p
            className={cn(
              "text-muted-foreground",
              "text-lg md:text-xl",
              "max-w-2xl mx-auto",
              "mt-6 mb-10",
              "animate-appear opacity-0",
              "[animation-delay:200ms]"
            )}
          >
            Upload files up to 10GB that <span className="text-foreground font-medium">never fail mid-transfer</span>. 
            Our resumable uploads pick up right where you left off — even if your internet drops. 
            Finally, file sharing that just works.
          </p>

          {/* CTAs - Clear action + lower commitment option */}
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4",
              "animate-appear opacity-0",
              "[animation-delay:400ms]"
            )}
          >
            <Link to="/auth">
              <Button size="lg" className="gap-2 shadow-lg">
                Start Free — No Card Required
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="gap-2">
                <Play className="w-4 h-4" />
                See How It Works
              </Button>
            </a>
          </div>

          {/* Social proof micro-stats */}
          <div
            className={cn(
              "flex flex-wrap items-center justify-center gap-8 mt-10",
              "animate-appear opacity-0",
              "[animation-delay:500ms]"
            )}
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">50M+</p>
              <p className="text-xs text-muted-foreground">Files Transferred</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">99.9%</p>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">4.9★</p>
              <p className="text-xs text-muted-foreground">User Rating</p>
            </div>
          </div>

          {/* Mockup */}
          <div
            className={cn(
              "relative w-full max-w-5xl mt-16",
              "animate-appear-zoom opacity-0",
              "[animation-delay:700ms]"
            )}
          >
            <Mockup type="responsive">
              <div className="w-full bg-gradient-to-br from-muted to-muted/50 aspect-video flex items-center justify-center rounded-md overflow-hidden">
                <div className="w-full h-full p-6 flex flex-col gap-4">
                  {/* Mock Dashboard Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20"></div>
                      <div className="h-4 w-24 rounded bg-foreground/10"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-20 rounded bg-primary/20"></div>
                      <div className="h-8 w-8 rounded-full bg-foreground/10"></div>
                    </div>
                  </div>
                  {/* Mock Content */}
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div className="col-span-1 bg-card/50 rounded-lg p-3 space-y-3">
                      <div className="h-3 w-3/4 rounded bg-foreground/10"></div>
                      <div className="h-3 w-1/2 rounded bg-foreground/5"></div>
                      <div className="h-3 w-2/3 rounded bg-foreground/5"></div>
                      <div className="h-3 w-1/2 rounded bg-foreground/5"></div>
                    </div>
                    <div className="col-span-3 bg-card/30 rounded-lg p-4 space-y-4">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-primary/40" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-1/3 rounded bg-foreground/10"></div>
                          <div className="h-2 w-full rounded bg-primary/20"></div>
                          <div className="h-2 w-2/3 rounded bg-foreground/5"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-20 rounded-lg bg-card/50 p-3 space-y-2">
                            <div className="h-3 w-2/3 rounded bg-foreground/10"></div>
                            <div className="h-2 w-1/2 rounded bg-foreground/5"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Mockup>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Glow variant="center" className="opacity-50" />
      </div>
    </section>
  );
};

export default Hero;
