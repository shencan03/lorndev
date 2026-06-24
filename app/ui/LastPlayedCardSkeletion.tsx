export default function LastPlayedCardSkeleton() {
  return (
    <div className="flex items-center gap-x-3 sm:gap-x-4 px-2">
      {/* Spinning CD skeleton */}
      <div className="shrink-0">
        <div className="relative w-[48px] h-[48px] sm:w-[64px] sm:h-[64px] animate-spin-slow">
          {/* Silver rim */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-white/5 to-white/15" />

          {/* Placeholder art area */}
          <div className="absolute inset-[3px] sm:inset-[4px] rounded-full bg-white/[0.06] animate-pulse" />

          {/* Iridescent sheen */}
          <div
            className="absolute inset-[3px] sm:inset-[4px] rounded-full pointer-events-none opacity-20"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(255,100,100,0.3), transparent, rgba(100,200,255,0.3), transparent, rgba(100,255,150,0.3), transparent)",
            }}
          />

          {/* Center hole */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-full bg-background ring-1 ring-white/10" />
          </div>
        </div>
      </div>

      {/* Text skeleton */}
      <section className="min-w-0 space-y-1.5">
        <div className="h-2.5 w-16 sm:w-20 rounded bg-white/[0.06] animate-pulse" />
        <div className="h-3.5 w-28 sm:w-36 rounded bg-white/[0.08] animate-pulse" />
        <div className="h-3 w-20 sm:w-24 rounded bg-white/[0.05] animate-pulse" />
      </section>
    </div>
  );
}
