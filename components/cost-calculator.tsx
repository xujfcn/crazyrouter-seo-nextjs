"use client";

import { useMemo, useState } from "react";
import type { CalculatorPreset, PageLocale } from "@/content/seo-pages";
import { CopyableText } from "@/components/copyable-text";

type CostCalculatorProps = {
  presets: CalculatorPreset[];
  locale?: PageLocale;
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

const labels = {
  en: {
    title: "Cost calculator",
    description: "Estimate monthly spend with retries, fallback traffic, and accepted-output rate.",
    snapshot: "Pricing snapshot",
    primaryModel: "Primary model",
    fallbackModel: "Fallback model",
    plannedUnits: "Monthly planned units",
    unitHint: "Uses the unit of the selected primary model.",
    retryRate: "Retry rate",
    fallbackShare: "Fallback share",
    acceptanceRate: "Accepted output rate",
    estimatedTotal: "Estimated total",
    billableUnits: "Billable units",
    acceptedOutputs: "Accepted outputs",
    acceptedCost: "Cost per accepted output",
    route: "Route",
    model: "Model",
    units: "Units",
    cost: "Cost",
    primary: "Primary",
    fallback: "Fallback",
    copyModel: "Copy model name"
  },
  zh: {
    title: "API 成本计算器",
    description: "按重试率、兜底请求和有效产出率估算每月费用。",
    snapshot: "价格快照",
    primaryModel: "主模型",
    fallbackModel: "兜底模型",
    plannedUnits: "每月计划用量",
    unitHint: "单位跟随当前选择的主模型。",
    retryRate: "重试率",
    fallbackShare: "兜底请求占比",
    acceptanceRate: "有效产出率",
    estimatedTotal: "预估总费用",
    billableUnits: "计费用量",
    acceptedOutputs: "有效产出",
    acceptedCost: "单个有效产出成本",
    route: "路由",
    model: "模型",
    units: "用量",
    cost: "费用",
    primary: "主路由",
    fallback: "兜底路由",
    copyModel: "复制模型名"
  }
};

export function CostCalculator({ presets, locale = "en" }: CostCalculatorProps) {
  const copy = labels[locale];
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
          <h2 className="text-2xl font-semibold text-ink">{copy.title}</h2>
          <p className="mt-2 max-w-2xl leading-7 text-muted">
            {copy.description}
          </p>
        </div>
        <div className="rounded-md border border-line bg-panel px-3 py-2 text-sm text-muted">
          {copy.snapshot}: 2026-06-06
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          {copy.primaryModel}
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
          {copy.fallbackModel}
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
          {copy.plannedUnits}
          <input
            type="number"
            min="1"
            value={units}
            onChange={(event) => setUnits(clamp(Number(event.target.value), 1, 100000000))}
            className="h-11 rounded-md border border-line px-3 text-sm"
          />
          <span className="text-xs font-normal text-muted">{copy.unitHint}</span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          {copy.retryRate}: {retryRate}%
          <input
            type="range"
            min="0"
            max="100"
            value={retryRate}
            onChange={(event) => setRetryRate(Number(event.target.value))}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          {copy.fallbackShare}: {fallbackShare}%
          <input
            type="range"
            min="0"
            max="100"
            value={fallbackShare}
            onChange={(event) => setFallbackShare(Number(event.target.value))}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          {copy.acceptanceRate}: {acceptanceRate}%
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
          <div className="text-sm text-muted">{copy.estimatedTotal}</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{money.format(result.total)}</div>
        </div>
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="text-sm text-muted">{copy.billableUnits}</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{Math.round(result.billableUnits).toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="text-sm text-muted">{copy.acceptedOutputs}</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{Math.round(result.acceptedOutputs).toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-line bg-panel p-4">
          <div className="text-sm text-muted">{copy.acceptedCost}</div>
          <div className="mt-2 text-2xl font-semibold text-ink">{unitMoney.format(result.acceptedCost)}</div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">{copy.route}</th>
              <th className="px-4 py-3 font-medium">{copy.model}</th>
              <th className="px-4 py-3 font-medium">{copy.units}</th>
              <th className="px-4 py-3 font-medium">{copy.cost}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            <tr>
              <td className="px-4 py-3">{copy.primary}</td>
              <td className="px-4 py-3">
                <CopyableText value={primary.model} label={`${copy.copyModel} ${primary.model}`} />
              </td>
              <td className="px-4 py-3">{Math.round(result.primaryUnits).toLocaleString()}</td>
              <td className="px-4 py-3">{money.format(result.primaryCost)}</td>
            </tr>
            <tr>
              <td className="px-4 py-3">{copy.fallback}</td>
              <td className="px-4 py-3">
                <CopyableText value={fallback.model} label={`${copy.copyModel} ${fallback.model}`} />
              </td>
              <td className="px-4 py-3">{Math.round(result.fallbackUnits).toLocaleString()}</td>
              <td className="px-4 py-3">{money.format(result.fallbackCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
