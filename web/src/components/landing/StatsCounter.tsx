"use client";

import { useEffect, useMemo, useState } from "react";

type StatsShape = {
  total_waste_kg: number;
  registered_buyers: number;
  total_carbon_saved_kg: number;
};

const DEFAULTS: StatsShape = {
  // PRD örnek değerleri: 1.247 ton, 89 fabrika, 3.421 kg CO2
  total_waste_kg: 1247 * 1000,
  registered_buyers: 89,
  total_carbon_saved_kg: 3421,
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function StatsCounter() {
  const [stats, setStats] = useState<StatsShape>({
    total_waste_kg: 0,
    registered_buyers: 0,
    total_carbon_saved_kg: 0,
  });

  const targets = useMemo(() => DEFAULTS, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/stats", { next: { revalidate: 60 } });
        if (!res.ok) throw new Error("stats fetch failed");
        const data = (await res.json()) as Partial<StatsShape>;
        const merged: StatsShape = {
          total_waste_kg:
            typeof data.total_waste_kg === "number"
              ? data.total_waste_kg
              : targets.total_waste_kg,
          registered_buyers:
            typeof data.registered_buyers === "number"
              ? data.registered_buyers
              : targets.registered_buyers,
          total_carbon_saved_kg:
            typeof data.total_carbon_saved_kg === "number"
              ? data.total_carbon_saved_kg
              : targets.total_carbon_saved_kg,
        };
        return merged;
      } catch {
        return targets;
      }
    }

    load().then((to) => {
      const from = stats;
      const start = performance.now();
      const durationMs = 1100;

      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / durationMs);

        setStats({
          total_waste_kg: Math.round(lerp(from.total_waste_kg, to.total_waste_kg, t)),
          registered_buyers: Math.round(lerp(from.registered_buyers, to.registered_buyers, t)),
          total_carbon_saved_kg: Math.round(lerp(from.total_carbon_saved_kg, to.total_carbon_saved_kg, t)),
        });

        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wasteTon = stats.total_waste_kg / 1000;
  const carbonKg = stats.total_carbon_saved_kg;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/50 bg-white/50 p-4 text-center shadow-sm backdrop-blur-md">
        <div className="text-3xl font-semibold tabular-nums text-emerald-800">
          {wasteTon.toLocaleString("tr-TR", {
            maximumFractionDigits: 3,
          })}
        </div>
        <div className="mt-1 text-sm font-medium text-foreground/70">
          ton atık yönlendirildi
        </div>
      </div>

      <div className="rounded-2xl border border-white/50 bg-white/50 p-4 text-center shadow-sm backdrop-blur-md">
        <div className="text-3xl font-semibold tabular-nums text-emerald-800">
          {stats.registered_buyers.toLocaleString("tr-TR")}
        </div>
        <div className="mt-1 text-sm font-medium text-foreground/70">
          kayıtlı alıcı
        </div>
      </div>

      <div className="rounded-2xl border border-white/50 bg-white/50 p-4 text-center shadow-sm backdrop-blur-md">
        <div className="text-3xl font-semibold tabular-nums text-emerald-800">
          {carbonKg.toLocaleString("tr-TR")}
        </div>
        <div className="mt-1 text-sm font-medium text-foreground/70">
          kg CO₂ önlendi
        </div>
      </div>
    </div>
  );
}

