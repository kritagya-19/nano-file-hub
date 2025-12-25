import { UserPlus, Upload, MessageSquare, Download } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Register & Login",
    description: "Create your free account in seconds with secure authentication.",
  },
  {
    icon: Upload,
    step: "02",
    title: "Upload or Share",
    description: "Upload files of any size with resumable progress tracking.",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Chat & Collaborate",
    description: "Create groups, invite members, and share files seamlessly.",
  },
  {
    icon: Download,
    step: "04",
    title: "Download Anytime",
    description: "Access your files from anywhere, anytime with fast downloads.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simple Steps to{" "}
            <span className="gradient-text">Get Started</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start sharing files in minutes. No complex setup required.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="relative group">
                {/* Card */}
                <div className="glass-card rounded-2xl p-6 lg:p-8 text-center hover-lift transition-all duration-300 relative z-10 bg-card">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-block px-3 py-1 rounded-full gradient-bg text-xs font-bold text-primary-foreground shadow-card">
                      Step {step.step}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mt-4 mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Mobile/Tablet */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <div className="w-0.5 h-8 bg-primary/20 rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
