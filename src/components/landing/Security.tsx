import { Shield, Key, RefreshCw, Lock } from "lucide-react";

const securityFeatures = [
  {
    icon: Key,
    title: "JWT Authentication",
    description: "Industry-standard JSON Web Tokens for secure user sessions and API access.",
  },
  {
    icon: Lock,
    title: "Secure File Access",
    description: "Files are protected with access controls. Only authorized users can view or download.",
  },
  {
    icon: RefreshCw,
    title: "Reliable Upload Resume",
    description: "Chunk-based uploads ensure your data is never lost, even on connection issues.",
  },
];

const Security = () => {
  return (
    <section id="security" className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left - Visual */}
          <div className="flex-1 w-full max-w-lg">
            <div className="relative">
              {/* Main Shield */}
              <div className="glass-card rounded-3xl p-10 text-center">
                <div className="w-24 h-24 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse-slow">
                  <Shield className="w-12 h-12 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Enterprise-Grade Security
                </h3>
                <p className="text-muted-foreground">
                  Your files are protected with military-grade encryption
                </p>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 glass-card rounded-xl px-4 py-2 animate-float shadow-card">
                <span className="text-sm font-medium text-foreground">256-bit SSL</span>
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card rounded-xl px-4 py-2 animate-float-delayed shadow-card">
                <span className="text-sm font-medium text-foreground">Encrypted</span>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="flex-1">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
              Security & Reliability
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Your Files Are{" "}
              <span className="gradient-text">Safe With Us</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              We take security seriously. Every file is protected with robust authentication 
              and encryption to keep your data private and secure.
            </p>

            {/* Features */}
            <div className="space-y-6">
              {securityFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex gap-5 p-4 rounded-2xl hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
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

export default Security;
