import { Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Theme = {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export const themes: Theme[] = [
  {
    name: "Ocean",
    colors: {
      primary: "from-cyan-600 to-blue-600",
      secondary: "from-blue-500 to-cyan-500",
      accent: "from-cyan-500 to-teal-500",
      background: "bg-slate-50",
    },
  },
  {
    name: "Forest",
    colors: {
      primary: "from-green-600 to-emerald-600",
      secondary: "from-emerald-500 to-green-500",
      accent: "from-green-500 to-teal-500",
      background: "bg-slate-50",
    },
  },
  {
    name: "Sunset",
    colors: {
      primary: "from-orange-600 to-rose-600",
      secondary: "from-rose-500 to-orange-500",
      accent: "from-orange-500 to-amber-500",
      background: "bg-slate-50",
    },
  },
  {
    name: "Royal",
    colors: {
      primary: "from-purple-600 to-indigo-600",
      secondary: "from-indigo-500 to-purple-500",
      accent: "from-purple-500 to-violet-500",
      background: "bg-slate-50",
    },
  },
  {
    name: "Midnight",
    colors: {
      primary: "from-slate-800 to-slate-900",
      secondary: "from-slate-700 to-slate-800",
      accent: "from-slate-600 to-slate-700",
      background: "bg-slate-50",
    },
  },
]

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="mr-1 h-4 w-4" /> Theme
          <span className={`ml-2 h-3 w-3 rounded-full bg-gradient-to-r ${selectedTheme?.colors?.primary}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => onThemeChange(theme)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-full bg-gradient-to-r ${theme.colors.primary}`} />
              <span>{theme.name}</span>
            </div>
            {selectedTheme?.name === theme.name && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 