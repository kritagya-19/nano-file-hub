import { HowItWorksSection } from "@/components/ui/how-it-works";
import { UserPlus, Upload, Share2 } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="h-7 w-7 text-primary-foreground" />,
    title: "Create your account",
    description:
      "Sign up in 30 seconds with just your email. No credit card, no lengthy forms — you'll be uploading before your coffee gets cold.",
    benefits: [
      "Free forever tier available",
      "Instant access, no verification wait",
      "Works with any email address",
    ],
  },
  {
    icon: <Upload className="h-7 w-7 text-primary-foreground" />,
    title: "Drop your files",
    description:
      "Drag and drop any file up to 10GB. Lost connection? We pick up right where you left off. Every. Single. Time.",
    benefits: [
      "Resumable uploads that never fail",
      "All file types supported",
      "Automatic cloud backup",
    ],
  },
  {
    icon: <Share2 className="h-7 w-7 text-primary-foreground" />,
    title: "Share instantly",
    description:
      "Generate a secure link or invite your team directly. Recipients don't even need an account to download.",
    benefits: [
      "One-click secure sharing",
      "No login required for recipients",
      "Track who downloaded what",
    ],
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works">
      <HowItWorksSection
        badge="Quick Start Guide"
        title="From Zero to Sharing in"
        titleHighlight="Under 2 Minutes"
        subtitle="Three simple steps. No learning curve. If you can drag a file, you can use NanoFile."
        steps={steps}
      />
    </section>
  );
};

export default HowItWorks;
