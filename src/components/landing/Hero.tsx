import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mockup } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import { Play, ArrowRight } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.png";

const Hero = () => {
  return (
    <section
      className={cn(
        "relative bg-background text-foreground",
        "pt-24 sm:pt-28 md:pt-32 lg:pt-40",
        "pb-16 sm:pb-20 md:pb-24 lg:pb-32",
        "px-4",
        "overflow-hidden"
      )}
    >
      <div className="container mx-auto max-w-6xl relative z-10 px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">

          {/* Heading - Simple & Clear */}
          <h1
            className={cn(
              "text-gradient",
              "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
              "font-extrabold tracking-tight",
              "max-w-4xl mx-auto px-2",
              "animate-appear",
              "leading-[1.15] sm:leading-[1.1]"
            )}
          >
            Share Big Files. Simply.
          </h1>

          {/* Description - Easy to understand */}
          <p
            className={cn(
              "text-muted-foreground",
              "text-base sm:text-lg md:text-xl",
              "max-w-2xl mx-auto px-2",
              "mt-4 sm:mt-6 mb-8 sm:mb-10",
              "animate-appear opacity-0",
              "[animation-delay:200ms]",
              "leading-relaxed"
            )}
          >
            Send files up to <span className="text-foreground font-medium">10GB for free</span>. 
            If your internet goes out, your upload keeps going when you're back online. 
            No more starting over.
          </p>

          {/* CTAs - Clear & Simple */}
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto",
              "animate-appear opacity-0",
              "[animation-delay:400ms]"
            )}
          >
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 shadow-lg w-full sm:w-auto text-sm sm:text-base">
                Try It Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto text-sm sm:text-base">
                <Play className="w-4 h-4" />
                How It Works
              </Button>
            </a>
          </div>

          {/* Social proof */}
          <div
            className={cn(
              "flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10",
              "animate-appear opacity-0",
              "[animation-delay:500ms]"
            )}
          >
            <div className="text-center px-2">
              <p className="text-xl sm:text-2xl font-bold text-foreground">10M+</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Files Shared</p>
            </div>
            <div className="w-px h-6 sm:h-8 bg-border" />
            <div className="text-center px-2">
              <p className="text-xl sm:text-2xl font-bold text-foreground">100%</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Free to Start</p>
            </div>
            <div className="w-px h-6 sm:h-8 bg-border" />
            <div className="text-center px-2">
              <p className="text-xl sm:text-2xl font-bold text-foreground">30 sec</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">To Get Started</p>
            </div>
          </div>

          {/* Mockup */}
          <div
            className={cn(
              "relative w-full max-w-5xl mt-10 sm:mt-12 md:mt-16",
              "animate-appear-zoom opacity-0",
              "[animation-delay:700ms]",
              "px-2 sm:px-0"
            )}
          >
            <Mockup type="responsive">
              <img 
                src={dashboardPreview} 
                alt="NanoFile Dashboard Preview" 
                className="w-full h-auto rounded-md"
              />
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
