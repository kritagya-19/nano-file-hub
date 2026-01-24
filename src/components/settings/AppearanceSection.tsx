import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon, Monitor, Palette } from "lucide-react";

const themes = [
  {
    id: "light",
    name: "Light",
    icon: Sun,
    description: "Clean and bright appearance",
  },
  {
    id: "dark",
    name: "Dark",
    icon: Moon,
    description: "Easy on the eyes, perfect for night",
  },
  {
    id: "system",
    name: "System",
    icon: Monitor,
    description: "Follows your device settings",
  },
];

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast({
      title: "Theme updated",
      description: `Switched to ${newTheme} theme.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
            <p className="text-sm text-muted-foreground">
              Customize how NanoFile looks on your device
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={cn(
                "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200",
                theme === t.id
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border/50 hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  theme === t.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <t.icon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className={cn(
                  "font-medium",
                  theme === t.id ? "text-primary" : "text-foreground"
                )}>
                  {t.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/50">
        <h3 className="text-base font-semibold text-foreground mb-4">Preview</h3>
        <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">NF</span>
            </div>
            <div>
              <p className="font-medium text-foreground">NanoFile</p>
              <p className="text-sm text-muted-foreground">Your files, anywhere</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-lg bg-primary"></div>
            <div className="h-8 w-20 rounded-lg bg-secondary"></div>
            <div className="h-8 w-20 rounded-lg bg-accent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
