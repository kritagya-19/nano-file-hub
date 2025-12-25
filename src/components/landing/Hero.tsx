import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Cloud, Zap, Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen hero-gradient pt-20 lg:pt-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-12 lg:py-20">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-primary/10 mb-6 animate-slide-up">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-secondary-foreground">
                Fast & Reliable File Transfer
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up">
              Share Files{" "}
              <span className="gradient-text">Smarter</span>,{" "}
              <br className="hidden sm:block" />
              Not Harder
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 animate-slide-up-delayed">
              Upload, download, and share large files with resumable uploads and hybrid storage. 
              Perfect for students, teams, and organizations who need reliable file collaboration.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up-delayed">
              <Button variant="hero" size="xl" className="group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="hero-outline" size="xl">
                View Features
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-border/50">
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-foreground">10GB+</p>
                <p className="text-sm text-muted-foreground">Max File Size</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-foreground">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-foreground">256-bit</p>
                <p className="text-sm text-muted-foreground">Encryption</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
            {/* Main Card */}
            <div className="relative glass-card rounded-3xl p-6 sm:p-8 animate-float">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg">
                  <Upload className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Uploading...</h3>
                  <p className="text-sm text-muted-foreground">project-files.zip</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-bg rounded-full w-3/4 animate-pulse" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">75% complete</span>
                  <span className="font-medium text-foreground">2.3 GB / 3.1 GB</span>
                </div>
              </div>

              {/* Features Pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                  Resumable
                </span>
                <span className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                  Encrypted
                </span>
                <span className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                  Fast
                </span>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 glass-card rounded-2xl p-4 animate-float-delayed shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Hybrid Storage</p>
                  <p className="text-xs text-muted-foreground">Local + Cloud</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 animate-float-slow shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Secure Access</p>
                  <p className="text-xs text-muted-foreground">JWT Protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
