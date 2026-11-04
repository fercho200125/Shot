import { Badge, Gift, Sparkles, Stamp, Sticker, Heart } from "lucide-react";

const map = { stamp: Stamp, bear: Heart, sticker: Sticker, yarn: Gift, badge: Badge, sparkle: Sparkles } as const;

export function CategoryIcon({ icon, className }: { icon: string; className?: string }) {
  const I = map[icon as keyof typeof map] ?? Sparkles;
  return <I className={className} strokeWidth={1.6} />;
}
