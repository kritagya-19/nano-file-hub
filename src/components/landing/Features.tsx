import { 
  RefreshCw, 
  Cloud, 
  Users, 
  Shield, 
  Zap, 
  Download
} from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    title: "Resumable Uploads",
    description: "Pause and resume your uploads anytime. Never lose progress on large file transfers again.",
  },
  {
    icon: Cloud,
    title: "Hybrid Storage",
    description: "Best of both worlds with local server speed and cloud reliability for seamless access.",
  },
  {
    icon: Users,
    title: "Group Collaboration",
    description: "Create groups, share files, and chat in real-time with your team or classmates.",
  },
  {
    icon: Shield,
    title: "Secure Authentication",
    description: "JWT-based authentication ensures your files are protected with industry-standard security.",
  },
  {
    icon: Zap,
    title: "Fast Transfers",
    description: "Optimized upload and download speeds to handle even the largest files efficiently.",
  },
  {
    icon: Download,
    title: "Easy Downloads",
    description: "Download files with a single click. Resume interrupted downloads seamlessly.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need for{" "}
            <span className="gradient-text">File Sharing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Built with modern technology to give you the best file transfer experience.
            Simple, secure, and reliable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass-card rounded-2xl p-6 lg:p-8 hover-lift hover-glow transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-6 shadow-card group-hover:shadow-glow transition-shadow duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
