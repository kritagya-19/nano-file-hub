import { cn } from "@/lib/utils";
import { FeatureCarousel } from "@/components/ui/animated-feature-carousel";

const HowItWorks = () => {
  const images = {
    alt: "NanoFile Feature",
    step1img1: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1600&auto=format&fit=crop",
    step1img2: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1600&auto=format&fit=crop",
    step2img1: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=1600&auto=format&fit=crop",
    step2img2: "https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?q=80&w=1600&auto=format&fit=crop",
    step3img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    step4img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
  };

  return (
    <section
      id="how-it-works"
      className={cn(
        "relative py-24 lg:py-32 bg-muted/30",
        "overflow-hidden"
      )}
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full",
              "bg-primary/10 border border-primary/20",
              "mb-6 animate-appear"
            )}
          >
            <span className="text-sm font-medium text-primary">Simple as 1-2-3-4</span>
          </div>
          
          <h2
            className={cn(
              "text-3xl sm:text-4xl lg:text-5xl",
              "font-bold tracking-tight",
              "mb-6 animate-appear opacity-0",
              "[animation-delay:100ms]"
            )}
          >
            From Zero to Sharing in{" "}
            <span className="text-gradient">Under 2 Minutes</span>
          </h2>
          
          <p
            className={cn(
              "text-lg text-muted-foreground",
              "max-w-2xl mx-auto",
              "animate-appear opacity-0",
              "[animation-delay:200ms]"
            )}
          >
            No tutorials needed. No IT department required. 
            If you can attach an email, you can use NanoFile.
          </p>
        </div>

        {/* Feature Carousel */}
        <div
          className={cn(
            "max-w-5xl mx-auto",
            "animate-appear opacity-0",
            "[animation-delay:300ms]"
          )}
        >
          <FeatureCarousel image={images} />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
