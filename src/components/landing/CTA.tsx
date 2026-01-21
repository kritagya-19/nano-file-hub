import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, Check, Shield } from "lucide-react";
import { motion } from "framer-motion";

const CTA = () => {
  const guarantees = [
    "Free forever plan available",
    "No credit card to start",
    "Cancel anytime",
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              Join 10,000+ happy teams
            </span>
          </motion.div>

          {/* Heading - Urgency + FOMO */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              "text-4xl sm:text-5xl lg:text-6xl",
              "font-bold tracking-tight",
              "text-white",
              "mb-6"
            )}
          >
            Your Team Is Waiting.{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Your Files Aren't.</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 4 150 4 198 10" stroke="white" strokeWidth="3" strokeLinecap="round" className="opacity-60"/>
              </svg>
            </span>
          </motion.h2>

          {/* Description - Remove friction */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10"
          >
            Stop wrestling with failed uploads and scattered files. 
            Start your free account now and share your first file in under 60 seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
          >
            <Link to="/auth">
              <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-primary bg-white rounded-xl shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-12"
          >
            {guarantees.map((guarantee, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 text-white/90"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium">{guarantee}</span>
              </div>
            ))}
          </motion.div>

          {/* Security badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <Shield className="w-5 h-5 text-white" />
            <span className="text-sm text-white/90">
              256-bit SSL encryption • SOC 2 Type II compliant • GDPR ready
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
