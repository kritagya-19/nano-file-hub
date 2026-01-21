import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mockup } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import { Github, ArrowRight, Upload } from "lucide-react";

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
          {/* Heading */}
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
            Share Files Effortlessly with Next-Gen Transfers
          </h1>

          {/* Description */}
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
            Experience lightning-fast uploads with resumable transfers, end-to-end encryption, and seamless hybrid storage for teams of any size.
          </p>

          {/* CTAs */}
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4",
              "animate-appear opacity-0",
              "[animation-delay:400ms]"
            )}
          >
            <Link to="/auth">
              <Button size="lg" className="gap-2 shadow-lg">
                Start Free Today
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="gap-2">
                <Github className="w-4 h-4" />
                Explore Features
              </Button>
            </a>
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
