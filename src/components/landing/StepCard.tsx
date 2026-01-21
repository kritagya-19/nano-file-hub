import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";

interface StepCardProps {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  index: number;
  isLast: boolean;
}

const StepCard = ({
  number,
  title,
  subtitle,
  description,
  icon: Icon,
  index,
  isLast,
}: StepCardProps) => {
  const isEven = index % 2 === 0;

  return (
    <div className={cn(
      "relative flex items-center gap-8 lg:gap-16",
      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
    )}>
      {/* Timeline connector - center line */}
      <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px">
        {!isLast && (
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full bg-gradient-to-b from-primary/40 via-primary/20 to-transparent"
          />
        )}
      </div>

      {/* Content side */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={cn(
          "flex-1",
          isEven ? "lg:text-right" : "lg:text-left"
        )}
      >
        <div className={cn(
          "inline-block",
          isEven ? "lg:ml-auto" : "lg:mr-auto"
        )}>
          <span className="text-sm font-bold text-primary/60 tracking-widest uppercase mb-2 block">
            Step {number}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-primary font-semibold mb-3">
            {subtitle}
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </motion.div>

      {/* Center node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ 
          type: "spring" as const, 
          stiffness: 200, 
          damping: 15, 
          delay: 0.2 
        }}
        className="relative z-10 shrink-0"
      >
        <div className="relative group">
          {/* Outer glow ring */}
          <div className="absolute -inset-3 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Main circle */}
          <div className={cn(
            "relative w-20 h-20 sm:w-24 sm:h-24 rounded-full",
            "bg-gradient-to-br from-primary via-primary to-primary/80",
            "flex items-center justify-center",
            "shadow-xl shadow-primary/25",
            "ring-4 ring-background",
            "group-hover:scale-110 transition-transform duration-300"
          )}>
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" strokeWidth={1.5} />
          </div>

          {/* Step number badge */}
          <div className={cn(
            "absolute -top-1 -right-1",
            "w-8 h-8 rounded-full",
            "bg-background border-2 border-primary",
            "flex items-center justify-center",
            "text-sm font-bold text-primary"
          )}>
            {number}
          </div>
        </div>
      </motion.div>

      {/* Card side */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex-1 hidden lg:block"
      >
        <div className={cn(
          "group relative p-6 rounded-2xl",
          "bg-card/50 backdrop-blur-sm",
          "border border-border/50",
          "hover:border-primary/30 hover:bg-card/80",
          "transition-all duration-300",
          "hover:shadow-lg hover:shadow-primary/5",
          isEven ? "lg:mr-auto" : "lg:ml-auto",
          "max-w-sm"
        )}>
          {/* Decorative gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
              <div className="mt-3 flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all duration-300">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile card (shown below on mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="lg:hidden absolute left-28 sm:left-32 right-0 top-full mt-4"
      >
        <div className={cn(
          "p-4 rounded-xl",
          "bg-card/50 backdrop-blur-sm",
          "border border-border/50"
        )}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StepCard;
