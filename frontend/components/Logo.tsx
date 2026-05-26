export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex h-8 w-8 items-center justify-center rounded-md text-white font-bold text-sm"
        style={{
          background:
            "linear-gradient(135deg, #ff5a1f 0%, #e11d48 100%)",
          boxShadow: "0 1px 3px rgba(255, 90, 31, 0.35)",
        }}
      >
        V
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        VedaAI
      </span>
    </div>
  );
}
