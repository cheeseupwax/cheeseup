export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-3xl animate-pulse-glow"
        style={{ background: "hsl(45 100% 50% / 0.08)" }} />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full blur-3xl animate-pulse-glow"
        style={{ background: "hsl(48 95% 60% / 0.06)", animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl"
        style={{ background: "hsl(40 30% 8% / 0.5)" }} />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(45 100% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(45 100% 50%) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating cheese emojis */}
      <div className="absolute top-24 left-16 text-4xl opacity-10 animate-float select-none">🧀</div>
      <div className="absolute top-40 right-28 text-3xl opacity-8 animate-float select-none" style={{ animationDelay: "2s" }}>🧀</div>
      <div className="absolute bottom-36 left-36 text-5xl opacity-6 animate-float select-none" style={{ animationDelay: "4s" }}>🧀</div>
      <div className="absolute bottom-24 right-16 text-3xl opacity-10 animate-float select-none" style={{ animationDelay: "3s" }}>🧀</div>
    </div>
  );
};
