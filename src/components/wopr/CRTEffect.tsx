'use client';

interface CRTEffectProps {
  children: React.ReactNode;
}

export default function CRTEffect({ children }: CRTEffectProps) {
  return (
    <div className="crt-container relative h-screen w-screen overflow-hidden bg-black">
      {/* Scanlines overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-30" />

      {/* Screen glow effect */}
      <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_120px_rgba(51,255,51,0.08)]" />

      {/* Flicker animation */}
      <div className="animate-crt-flicker absolute inset-0 z-0">
        {children}
      </div>

      {/* Curved screen edge vignette */}
      <div className="pointer-events-none absolute inset-0 z-30 rounded-lg shadow-[inset_0_0_100px_rgba(0,0,0,0.95)]" />

      {/* Subtle RGB shift for authenticity */}
      <div className="pointer-events-none absolute inset-0 z-5 mix-blend-screen opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-green-500/10 to-blue-500/10 blur-sm" />
      </div>
    </div>
  );
}
