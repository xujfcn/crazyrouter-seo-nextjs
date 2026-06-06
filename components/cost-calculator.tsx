"use client";

import { useMemo, useState } from "react";
import type { CalculatorPreset } from "@/content/seo-pages";

type CostCalculatorProps = {
  presets: CalculatorPreset[];
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const unitMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 4
});

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export function CostCalculator({ presets }: CostCalculatorProps) {
  const [primaryModel, setPrimaryModel] = useState(presets[0]?.model ?? "");
  const [fallbackModel, setFallbackModel] = useState(presets[1]?.model ?? presets[0]?.model ?? "");
  const [units, setUnits] = useState(presets[0]?.defaultUnits ?? 1000);
  const [retryRate, setRetryRate] = useState(8);
  const [fallbackShare, setFallbackShare] = useState(15);
  const [acceptanceRate, setAcceptanceRate] = useState(70);

  const primary = presets.find((preset) => preset.model === primaryModel) ?? presets[0];
  const fallback = presets.find((preset) => preset.model === fallbackModel) ?? primary;

  const result = useMemo(() => {
    const retryMultiplier = 1 + clamp(retryRate, 0, 300) / 100;
    const fallbackFraction = clamp(fallbackShare, 0, 100) / 100;
    const acceptedFraction = Math.max(clamp(acceptanceRate, 1, 100) / 100, 0.01);
    const billableUnits = units * retryMultiplier;
    const primaryUnits = billableUnits * (1 - fallbackFraction);
    const fallbackUnits = billableUnits * fallbackFraction;
    const primaryCost = primaryUnits * primary.unitPrice;
    const fallbackCost = fallbackUnits * fallback.unitPrice;
    const total = primaryCost + fallbackCost;
    const acceptedOutputs = units * acceptedFraction;

    return {
      billableUnits,
      primaryUnits,
      fallbackUnits,
      primaryCost,
      fallbackCost,
      total,
      acceptedOutputs,
      acceptedCost: total / acceptedOutputs
    };
  }, [acceptanceRate, fallback, fallbackShare, primary, retryRate, units]);

  if (!presets.length) {
    return null;
  }

  return (
    <section className="rounded-lg border border-line bg-white p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Cost calculator</h2>
          <p className="mt-2 max-w-2xl leading-7 text-muted">
            Estimate monthly spend with retries, fallback traffic, and accepted-output rate.
          </p>
        </div>
        <div className="rounded-md border border-line bg-panel px-3 py-2 text-sm text-muted">
          Pricing snapshot: 2026-06-06
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Primary model
          <select
            value={primaryModel}
            onChange={(event) => {
              const model = event.target.value;
              setPrimaryModel(model);
              setUnits(presets.find((preset) => preset.model === model)?.defaultUnits ?? units);
            }}
            className="h-11 rounded-md border border-line bg-white px-3 text-sm"
          >
            {presets.map((preset) => (
              <option key={preset.model} value={preset.model}>
                {preset.label} - {unitMoney.format(preset.unitPrice)}/{preset.unitLabel}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Fallback model
          <select
            value={fallbackModel}
            onChange={(event) => setFallbackModel(event.target.value)}
            className="h-11 rounded-md border border-line bg-white px-3 text-sm"
          >
            {presets.map((preset) => (
              <option key={preset.model} value={preset.model}>
                {preset.label} - {unitMoney.format(preset.unitPrice)}/{preset.unitLabel}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Monthly planned units
          <input
            type="number"
            min="1"
            value={units}
            onChange={(event) => setUnits(clamp(Number(event.target.value), 1, 100000000))}
            className="h-11 rounded-md border border-line px-3 text-sm"
          />
          <span className="text-xs font-normal text-muted">Uses the unit of the selected primary model.</span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Retry rate: {retryRate}%
          <input
            type="range"
            min="0"
            max="100"
            value={retryRate}
            onChange={(event) => setRetryRate(Number(event.target.value))}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Fallback share: {fallbackShare}%
          <input
            type="range"
            min="0"
            max="100"
            value={fallbackShare}
            onChange={(event) => setFallbackShare(Number(event.target.value))}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          Accepted output rate: {acceptanceRate}%
          <input
            type="range"
            min="1"
            max="100"
            value={acceptanceRate}
            onChange={(event) => setAcceptanceRate(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="text-sm text-muted">Estimated total</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{money.format(result.total)}</div>
        </div>
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="text-sm text-muted">Billable units</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{Math.round(result.billableUnits).toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="text-sm text-muted">Accepted outputs</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{Math.round(result.acceptedOutputs).toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="text-sm text-muted">Cost per accepted output</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{unitMoney.format(result.acceptedCost)}</div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Units</th>
              <th className="px-4 py-3 font-medium">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            <tr>
              <td className="px-4 py-3">Primary</td>
              <td className="px-4 py-3">{primary.model}</td>
              <td className="px-4 py-3">{Math.round(result.primaryUnits).toLocaleString()}</td>
              <td className="px-4 py-3">{money.format(result.primaryCost)}</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Fallback</td>
              <td className="px-4 py-3">{fallback.model}</td>
              <td className="px-4 py-3">{Math.round(result.fallbackUnits).toLocaleString()}</td>
              <td className="px-4 py-3">{money.format(result.fallbackCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
