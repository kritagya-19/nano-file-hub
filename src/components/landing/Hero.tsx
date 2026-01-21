import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Cloud, Zap, Shield, Sparkles, Check } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-20 lg:pt-24 overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div 
        className="absolute inset-0 opacity-60"
        style={{ background: 'var(--gradient-mesh)' }}
      />
      
      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[15%] w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-40 right-[10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-[30%] w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20 py-12 lg:py-20">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-slide-up backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Next-Gen File Transfer
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-foreground leading-[1.1] mb-6 animate-slide-up tracking-tight">
              Share Files{" "}
              <span className="relative">
                <span className="gradient-text">Effortlessly</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 animate-slide-up-delayed max-w-xl mx-auto lg:mx-0">
              Experience lightning-fast uploads with resumable transfers, end-to-end encryption, and seamless hybrid storage for teams of any size.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up-delayed mb-12">
              <Link to="/auth">
                <Button variant="hero" size="xl" className="group w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
                  Start Free Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  Explore Features
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 animate-fade-in">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                No credit card
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                10GB free storage
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                Setup in 30 sec
              </div>
            </div>
          </div>

          {/* Right Visual - Premium Card Stack */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
            {/* Main Upload Card */}
            <div className="relative glass-card rounded-3xl p-8 animate-float border border-white/20 dark:border-white/10 shadow-2xl">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/30">
                    <Upload className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Uploading...</h3>
                    <p className="text-sm text-muted-foreground">project-final.zip</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                  Active
                </div>
              </div>
              
              {/* Progress Section */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Progress</span>
                  <span className="font-bold text-foreground">78%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full animate-pulse relative overflow-hidden"
                    style={{ 
                      width: '78%',
                      background: 'var(--gradient-cta)'
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{
                      backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                      backgroundSize: '200% 100%'
                    }} />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">2.4 GB of 3.1 GB</span>
                  <span className="text-primary font-medium">~2 min left</span>
                </div>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
                  ⚡ Resumable
                </span>
                <span className="px-4 py-2 text-xs font-semibold bg-secondary text-secondary-foreground rounded-full border border-primary/10">
                  🔒 E2E Encrypted
                </span>
                <span className="px-4 py-2 text-xs font-semibold bg-accent/10 text-accent rounded-full border border-accent/20">
                  ☁️ Auto-Backup
                </span>
              </div>
            </div>

            {/* Floating Card - Top Right */}
            <div className="absolute -top-4 -right-4 glass-card rounded-2xl p-4 animate-float-delayed shadow-xl border border-white/20 dark:border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Hybrid Storage</p>
                  <p className="text-xs text-muted-foreground">Local + Cloud Sync</p>
                </div>
              </div>
            </div>

            {/* Floating Card - Bottom Left */}
            <div className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 animate-float-slow shadow-xl border border-white/20 dark:border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">256-bit AES</p>
                  <p className="text-xs text-muted-foreground">Enterprise Security</p>
                </div>
              </div>
            </div>

            {/* Stats Badge - Bottom Right */}
            <div className="absolute -bottom-2 right-8 glass-card rounded-xl px-4 py-3 animate-float shadow-lg border border-white/20 dark:border-white/10">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Transfer Speed</p>
                  <p className="text-sm font-bold text-foreground">125 MB/s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave - More Premium */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
