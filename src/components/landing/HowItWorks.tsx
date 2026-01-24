import { HowItWorksSection } from "@/components/ui/how-it-works";
import { UserPlus, Upload, Share2 } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="h-7 w-7 text-primary-foreground" />,
    title: "Sign up for free",
    description:
      "Create your account in just 30 seconds. All you need is your email — no credit card, no complicated forms.",
    benefits: [
      "Completely free to start",
      "No payment info needed",
      "Ready in seconds",
    ],
  },
  {
    icon: <Upload className="h-7 w-7 text-primary-foreground" />,
    title: "Upload your files",
    description:
      "Drag and drop any file up to 10GB. If your internet disconnects, don't worry — we'll save your progress automatically.",
    benefits: [
      "Files up to 10GB",
      "Uploads never fail",
      "Works with any file type",
    ],
  },
  {
    icon: <Share2 className="h-7 w-7 text-primary-foreground" />,
    title: "Share with anyone",
    description:
      "Get a link to share with friends, classmates, or your team. They can download instantly — no account needed.",
    benefits: [
      "One-click sharing",
      "No signup for downloaders",
      "Share via link or group",
    ],
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works">
      <HowItWorksSection
        title="Get Started in"
        titleHighlight="3 Easy Steps"
        subtitle="No learning curve. If you can send an email, you can use NanoFile."
        steps={steps}
      />
    </section>
  );
};

export default HowItWorks;
