export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep dark base */}
      <div className="absolute inset-0" style={{ background: "hsl(20 10% 5%)" }} />

      {/* Very subtle warm orbs — like cheese.null */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(ellipse, hsl(45 80% 30% / 0.4) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(ellipse, hsl(45 60% 20% / 0.3) 0%, transparent 70%)" }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(45 100% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(45 100% 50%) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};
