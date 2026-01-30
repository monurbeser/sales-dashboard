import { cn } from "@/lib/utils";

interface GaugeProps {
  value: number;
  className?: string;
}

function getGaugeColor(value: number) {
  const clamped = Math.min(100, Math.max(0, value));
  const hue = (clamped / 100) * 120; // 0 = red, 120 = green
  return `hsl(${hue}, 75%, 45%)`;
}

export function Gauge({ value, className }: GaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const color = getGaugeColor(clamped);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative h-32 w-64 overflow-hidden">
        <div className="absolute inset-0 rounded-t-full border border-border bg-muted" />
        <div
          className="absolute bottom-0 left-0 right-0 h-full rounded-t-full"
          style={{
            background: `conic-gradient(${color} ${clamped * 1.8}deg, #e5e7eb 0deg)`
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-20 rounded-t-full bg-background" />
        <div className="absolute bottom-0 left-1/2 h-16 w-1 -translate-x-1/2 bg-foreground" />
      </div>
      <div className="text-lg font-semibold" style={{ color }}>
        %{clamped.toFixed(0)}
      </div>
    </div>
  );
}
