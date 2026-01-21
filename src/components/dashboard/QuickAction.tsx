import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: "primary" | "secondary" | "accent";
}

export function QuickAction({ 
  title, 
  description, 
  icon: Icon, 
  href,
  color = "primary" 
}: QuickActionProps) {
  const colorClasses = {
    primary: "from-primary to-primary/80 shadow-primary/25",
    secondary: "from-violet-500 to-purple-500 shadow-violet-500/25",
    accent: "from-emerald-500 to-teal-500 shadow-emerald-500/25",
  };

  return (
    <Link to={href}>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative p-5 rounded-2xl cursor-pointer",
          "bg-card border border-border/50",
          "hover:border-primary/30 hover:shadow-lg",
          "transition-all duration-300"
        )}
      >
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
            "bg-gradient-to-br shadow-lg",
            colorClasses[color]
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
        </div>
      </motion.div>
    </Link>
  );
}
