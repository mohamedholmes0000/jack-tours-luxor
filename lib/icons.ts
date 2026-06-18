import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

const legacyIconNames: Record<string, string> = {
  car: "Car",
  hotel: "Hotel",
  message: "MessageCircle",
  ship: "Ship",
  sparkles: "Sparkles",
  "user-check": "UserCheck",
};

export function getLucideIcon(name: string | null | undefined): LucideIcon {
  const normalized = name ? legacyIconNames[name] || name : "Star";
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[normalized];
  return Icon || LucideIcons.Star;
}
