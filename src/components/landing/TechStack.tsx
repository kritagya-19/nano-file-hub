const technologies = [
  {
    category: "Frontend",
    items: [
      { name: "React", description: "UI Library" },
      { name: "Tailwind CSS", description: "Styling" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "FastAPI", description: "Python Framework" },
      { name: "WebSockets", description: "Real-time" },
    ],
  },
  {
    category: "Database",
    items: [
      { name: "MySQL", description: "Data Storage" },
    ],
  },
  {
    category: "Deployment",
    items: [
      { name: "Vercel", description: "Frontend" },
      { name: "Render", description: "Backend" },
    ],
  },
];

const TechStack = () => {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            Tech Stack
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Built with{" "}
            <span className="gradient-text">Modern Tech</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powered by reliable and scalable technologies for the best performance.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <div
              key={tech.category}
              className="glass-card rounded-2xl p-6 hover-lift transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4 pb-3 border-b border-border">
                {tech.category}
              </h3>
              <div className="space-y-3">
                {tech.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
