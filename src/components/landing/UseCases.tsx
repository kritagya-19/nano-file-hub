import { GraduationCap, Briefcase, Building2 } from "lucide-react";

const useCases = [
  {
    icon: GraduationCap,
    title: "For Students",
    description: "Share lecture notes, project files, and assignments with classmates. Perfect for group projects and study groups.",
    features: ["Share notes easily", "Group project files", "Resume interrupted uploads"],
  },
  {
    icon: Briefcase,
    title: "For Project Teams",
    description: "Collaborate on files in real-time, chat with team members, and keep all project assets in one place.",
    features: ["Real-time collaboration", "Team chat", "Version control friendly"],
  },
  {
    icon: Building2,
    title: "For Organizations",
    description: "Secure file sharing for small teams and departments. Manage access and keep sensitive files protected.",
    features: ["Secure access control", "Large file support", "Reliable storage"],
  },
];

const UseCases = () => {
  return (
    <section id="use-cases" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            Use Cases
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Perfect For{" "}
            <span className="gradient-text">Everyone</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Designed to fit the needs of students, teams, and organizations alike.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={useCase.title}
              className="group glass-card rounded-3xl p-8 lg:p-10 hover-lift hover-glow transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6 shadow-card group-hover:shadow-glow transition-shadow duration-300">
                <useCase.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {useCase.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {useCase.description}
              </p>

              {/* Features */}
              <ul className="space-y-3">
                {useCase.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
