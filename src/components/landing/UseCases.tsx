import { cn } from "@/lib/utils";
import { GraduationCap, Briefcase, Building2, Check } from "lucide-react";
import { motion } from "framer-motion";

const useCases = [
  {
    icon: GraduationCap,
    title: "Students & Study Groups",
    subtitle: "Perfect for group projects",
    description: "Share class notes, presentations, and project files with your classmates. Everyone gets the files they need, even at midnight before the deadline.",
    features: [
      "Share files too big for email",
      "Create groups for each class",
      "Works on phones & laptops"
    ],
    stat: "50K+",
    statLabel: "students love NanoFile"
  },
  {
    icon: Briefcase,
    title: "Remote Teams",
    subtitle: "Work together from anywhere",
    description: "Working from home? Share files with your team no matter where everyone is. Built-in chat keeps everyone on the same page.",
    features: [
      "Send large work files",
      "Chat with your team",
      "No more email attachments"
    ],
    stat: "2x",
    statLabel: "faster than email"
  },
  {
    icon: Building2,
    title: "Small Businesses",
    subtitle: "Simple & secure",
    description: "Share files with clients and coworkers safely. Your business files are protected and organized in one place.",
    features: [
      "Files stay private",
      "Control who sees what",
      "Easy to use for everyone"
    ],
    stat: "99.9%",
    statLabel: "always available"
  },
];

const UseCases = () => {
  return (
    <section id="use-cases" className="relative py-16 sm:py-20 lg:py-32 bg-muted/30 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-20 px-2">
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6"
          >
            Built for People{" "}
            <span className="relative inline-block">
              <span className="text-gradient">Like You</span>
              <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 4 150 4 198 10" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="opacity-60"/>
              </svg>
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Whether you're a student, freelancer, or running a business — NanoFile makes file sharing simple.
          </motion.p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className={cn(
                "group relative",
                "bg-card rounded-2xl sm:rounded-3xl",
                "border border-border/50",
                "p-5 sm:p-6 md:p-8 lg:p-10",
                "transition-all duration-300",
                "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
                index === 2 && "md:col-span-2 lg:col-span-1"
              )}
            >
              {/* Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <useCase.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm font-medium text-primary mb-1 sm:mb-2">{useCase.subtitle}</p>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                {useCase.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                {useCase.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {useCase.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Stat */}
              <div className="pt-4 sm:pt-6 border-t border-border/50">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-primary">{useCase.stat}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{useCase.statLabel}</span>
                </div>
              </div>

              {/* Hover gradient */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
