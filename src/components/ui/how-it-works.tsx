"use client";

import { cn } from "@/lib/utils";
import type React from "react";

interface HowItWorksProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  steps: StepData[];
}

interface StepData {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  benefits,
}) => (
  <div
    className={cn(
      "group relative flex flex-col gap-6 rounded-2xl p-6 lg:p-8",
      "bg-card border border-border/50",
      "transition-all duration-300",
      "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
      "hover:-translate-y-1"
    )}
  >
    {/* Icon */}
    <div
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-xl",
        "bg-gradient-to-br from-primary to-primary/80",
        "shadow-lg shadow-primary/20",
        "transition-transform duration-300 group-hover:scale-110"
      )}
    >
      {icon}
    </div>

    {/* Title and Description */}
    <h3 className="text-xl font-bold text-foreground">
      {title}
    </h3>

    <p className="text-muted-foreground leading-relaxed -mt-3">
      {description}
    </p>

    {/* Benefits List */}
    <ul className="flex flex-col gap-3">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-start gap-3 text-sm">
          <div
            className={cn(
              "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
              "bg-primary/10 text-primary"
            )}
          >
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="text-muted-foreground">{benefit}</span>
        </li>
      ))}
    </ul>

    {/* Hover gradient overlay */}
    <div
      className={cn(
        "absolute inset-0 rounded-2xl opacity-0",
        "bg-gradient-to-br from-primary/5 via-transparent to-accent/5",
        "transition-opacity duration-300",
        "group-hover:opacity-100",
        "pointer-events-none"
      )}
    />
  </div>
);

export const HowItWorksSection: React.FC<HowItWorksProps> = ({
  className,
  badge = "How it works",
  title,
  titleHighlight,
  subtitle,
  steps,
  ...props
}) => {
  return (
    <div
      className={cn("relative overflow-hidden py-24 lg:py-32 bg-muted/30", className)}
      {...props}
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">

          {title && (
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
              {title}{" "}
              {titleHighlight && (
                <span className="relative inline-block">
                  <span className="text-gradient">{titleHighlight}</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C50 4 150 4 198 10" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="opacity-60"/>
                  </svg>
                </span>
              )}
            </h2>
          )}

          {subtitle && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Step Indicators with Connecting Line */}
        <div className="relative mx-auto mb-12 max-w-4xl">
          {/* Connecting Line */}
          <div
            className={cn(
              "absolute left-0 right-0 top-1/2 hidden h-0.5 -translate-y-1/2 lg:block",
              "bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            )}
          />

          {/* Step Numbers */}
          <div
            className={cn(
              "grid gap-6",
              steps.length === 3 ? "grid-cols-3" : "grid-cols-4"
            )}
          >
            {steps.map((_, index) => (
              <div key={index} className="flex justify-center">
                <div
                  className={cn(
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full",
                    "bg-gradient-to-br from-primary to-primary/80",
                    "text-lg font-bold text-primary-foreground",
                    "shadow-lg shadow-primary/25",
                    "ring-4 ring-background"
                  )}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div
          className={cn(
            "mx-auto grid max-w-6xl gap-6 lg:gap-8",
            steps.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {steps.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
