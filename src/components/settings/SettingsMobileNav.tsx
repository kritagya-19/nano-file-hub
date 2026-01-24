import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SettingsMobileNavProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export function SettingsMobileNav({ 
  sections, 
  activeSection, 
  onSectionChange 
}: SettingsMobileNavProps) {
  return (
    <div className="lg:hidden sticky top-14 z-40 -mx-4 px-4 py-3 bg-background/95 backdrop-blur-xl border-b border-border/50">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap shrink-0",
              "transition-all duration-200 text-sm font-medium",
              activeSection === section.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <section.icon className="w-4 h-4" />
            <span>{section.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
