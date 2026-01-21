"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
} from "react"
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
  type Variants,
} from "framer-motion"
import { cn } from "@/lib/utils"

// --- Types ---
type StaticImageData = string;

type WrapperStyle = MotionStyle & {
  "--x": MotionValue<number>
  "--y": MotionValue<number>
}

interface CardProps {
  bgClass?: string
}

interface ImageSet {
  step1img1: StaticImageData
  step1img2: StaticImageData
  step2img1: StaticImageData
  step2img2: StaticImageData
  step3img: StaticImageData
  step4img: StaticImageData
  alt: string
}

interface FeatureCarouselProps extends CardProps {
  step1img1Class?: string
  step1img2Class?: string
  step2img1Class?: string
  step2img2Class?: string
  step3imgClass?: string
  step4imgClass?: string
  image: ImageSet
}

interface StepImageProps {
  src: StaticImageData
  alt: string
  className?: string
  style?: React.CSSProperties
  width?: number
  height?: number
}

interface Step {
  id: string
  name: string
  title: string
  description: string
}

// --- Constants ---
const TOTAL_STEPS = 4

const steps: readonly Step[] = [
  {
    id: "1",
    name: "Step 1",
    title: "Create Your Account",
    description: "Sign up in seconds with your email. No credit card required to get started with secure file sharing.",
  },
  {
    id: "2",
    name: "Step 2",
    title: "Upload Your Files",
    description: "Drag and drop any file type. Our resumable uploads ensure you never lose progress, even on large files.",
  },
  {
    id: "3",
    name: "Step 3",
    title: "Share & Collaborate",
    description: "Create groups, invite team members, and share files instantly with secure, shareable links.",
  },
  {
    id: "4",
    name: "Step 4",
    title: "Access Anywhere",
    description: "Download your files from any device, anytime. Your data is always secure and available when you need it.",
  },
]

const ANIMATION_PRESETS = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
  },
} as const

type AnimationPreset = keyof typeof ANIMATION_PRESETS

interface AnimatedStepImageProps extends StepImageProps {
  preset?: AnimationPreset
  delay?: number
  onAnimationComplete?: () => void
}

// --- Hooks ---
function useNumberCycler(totalSteps: number = TOTAL_STEPS, interval: number = 5000) {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setCurrentNumber((prev) => (prev + 1) % totalSteps);
    }, interval);

    return () => clearTimeout(timerId);
  }, [currentNumber, totalSteps, interval]);

  const setStep = useCallback((stepIndex: number) => {
    setCurrentNumber(stepIndex % totalSteps);
  }, [totalSteps]);

  return { currentNumber, setStep };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches)
    }
    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])
  return isMobile
}

// --- Components ---
function IconCheck({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-4", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const stepVariants: Variants = {
  inactive: { scale: 0.9, opacity: 0.7 },
  active: { scale: 1, opacity: 1 },
}

const StepImage = forwardRef<HTMLImageElement, StepImageProps>(
  ({ src, alt, className, style, ...props }, ref) => {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        style={style}
        draggable={false}
        {...props}
      />
    )
  }
)
StepImage.displayName = "StepImage"

const MotionStepImage = motion.create(StepImage)

const AnimatedStepImage = ({ preset = "fadeInScale", delay = 0, ...props }: AnimatedStepImageProps) => {
  const presetConfig = ANIMATION_PRESETS[preset]
  return (
    <MotionStepImage
      {...presetConfig}
      transition={{ ...presetConfig.transition, delay }}
      {...props}
    />
  )
}

function FeatureCard({ children, step }: { children: React.ReactNode; step: number }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const isMobile = useIsMobile()

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (isMobile) return
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const background = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, hsl(var(--primary) / 0.1), transparent 80%)`

  return (
    <motion.div
      variants={stepVariants}
      initial="inactive"
      animate="active"
      className="relative w-full overflow-hidden rounded-2xl border border-border/50 bg-card"
      onMouseMove={handleMouseMove}
      style={
        {
          "--x": mouseX,
          "--y": mouseY,
        } as WrapperStyle
      }
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background }}
      />

      <div className="relative flex flex-col lg:flex-row min-h-[400px] lg:min-h-[500px]">
        <div className="flex flex-col justify-center p-6 lg:p-10 lg:w-2/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                {steps[step].name}
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
                {steps[step].title}
              </h3>
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                {steps[step].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative flex-1 lg:w-3/5 min-h-[250px] lg:min-h-0">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

function StepsNav({ 
  steps: stepItems, 
  current, 
  onChange 
}: { 
  steps: readonly Step[]; 
  current: number; 
  onChange: (index: number) => void; 
}) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol role="list" className="flex items-center justify-center gap-2 lg:gap-4">
        {stepItems.map((step, stepIdx) => {
          const isCompleted = current > stepIdx;
          const isCurrent = current === stepIdx;
          return (
            <li key={step.id} className="flex items-center">
              <button
                className={cn(
                  "flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2.5 rounded-full transition-all duration-300",
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : isCompleted
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
                onClick={() => onChange(stepIdx)}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium",
                    isCurrent
                      ? "bg-primary-foreground/20"
                      : isCompleted
                      ? "bg-primary/20"
                      : "bg-muted-foreground/20"
                  )}
                >
                  {isCompleted ? (
                    <IconCheck className="w-4 h-4" />
                  ) : (
                    stepIdx + 1
                  )}
                </span>
                <span className="hidden sm:inline text-sm font-medium">
                  {step.name}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const defaultClasses = {
  img: "rounded-xl border border-border/50 shadow-2xl shadow-black/10",
  step1img1: "w-[50%] left-0 top-[15%]",
  step1img2: "w-[60%] left-[40%] top-[35%]",
  step2img1: "w-[50%] left-[5%] top-[20%]",
  step2img2: "w-[40%] left-[55%] top-[45%]",
  step3img: "w-[90%] left-[5%] top-[15%]",
  step4img: "w-[90%] left-[5%] top-[15%]",
} as const

export function FeatureCarousel({
  image,
  step1img1Class = defaultClasses.step1img1,
  step1img2Class = defaultClasses.step1img2,
  step2img1Class = defaultClasses.step2img1,
  step2img2Class = defaultClasses.step2img2,
  step3imgClass = defaultClasses.step3img,
  step4imgClass = defaultClasses.step4img,
}: FeatureCarouselProps) {
  const { currentNumber: step, setStep } = useNumberCycler()

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="absolute inset-0 p-4">
            <AnimatedStepImage
              src={image.step1img1}
              alt={image.alt}
              preset="slideInLeft"
              className={cn("absolute", defaultClasses.img, step1img1Class)}
            />
            <AnimatedStepImage
              src={image.step1img2}
              alt={image.alt}
              preset="slideInRight"
              delay={0.1}
              className={cn("absolute", defaultClasses.img, step1img2Class)}
            />
          </div>
        )
      case 1:
        return (
          <div className="absolute inset-0 p-4">
            <AnimatedStepImage
              src={image.step2img1}
              alt={image.alt}
              preset="slideInLeft"
              className={cn("absolute", defaultClasses.img, step2img1Class)}
            />
            <AnimatedStepImage
              src={image.step2img2}
              alt={image.alt}
              preset="slideInRight"
              delay={0.1}
              className={cn("absolute", defaultClasses.img, step2img2Class)}
            />
          </div>
        )
      case 2:
        return (
          <div className="absolute inset-0 p-4">
            <AnimatedStepImage
              src={image.step3img}
              alt={image.alt}
              preset="fadeInScale"
              className={cn("absolute", defaultClasses.img, step3imgClass)}
            />
          </div>
        )
      case 3:
        return (
          <div className="absolute inset-0 p-4">
            <AnimatedStepImage
              src={image.step4img}
              alt={image.alt}
              preset="fadeInScale"
              className={cn("absolute", defaultClasses.img, step4imgClass)}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <FeatureCard step={step}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </FeatureCard>

      <StepsNav steps={steps} current={step} onChange={setStep} />
    </div>
  )
}
