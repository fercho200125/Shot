import Image from "next/image";
import Link from "next/link";

export function Logo({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Medistamp, inicio">
      <span className={`relative grid size-9 place-items-center overflow-hidden rounded-full ${dark ? "bg-white/95" : "bg-white"} ring-1 ring-black/5 shadow-sm transition-transform duration-500 group-hover:scale-105`}>
        <Image src="/brand/medistamp-mark.png" alt="" width={36} height={36} className="size-8 object-contain" priority />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={`block text-[15px] font-semibold tracking-[0.18em] ${dark ? "text-white" : "text-ink"}`}>MEDISTAMP</span>
          <span className={`font-script block text-[13px] ${dark ? "text-white/60" : "text-ink-mute"}`}>by Mery Pinargote</span>
        </span>
      )}
    </Link>
  );
}
