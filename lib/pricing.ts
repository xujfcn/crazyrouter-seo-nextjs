import pricingSnapshot from "@/content/pricing-snapshot.json";

type EndpointInfo = {
  path: string;
  method: string;
};

type PricingRule = {
  rule_id?: string;
  capability_bucket?: string;
  resolution?: string;
  has_audio?: boolean;
  platform_base_price?: number;
  official_price_usd?: number;
  platform_currency?: string;
  verification_status?: string;
};

type PricingModel = {
  model_name: string;
  quota_type?: number;
  model_ratio?: number;
  model_price?: number;
  completion_ratio?: number;
  discount?: number;
  billing_mode?: string;
  display_unit?: string;
  public_endpoint_types?: string[];
  supported_endpoint_types?: string[];
  series?: string;
  image_pricing?: {
    rules?: PricingRule[];
  };
  video_pricing?: {
    rules?: PricingRule[];
  };
};

type PricingSnapshot = {
  data: PricingModel[];
  supported_endpoint?: Record<string, EndpointInfo>;
};

export type PricingSummary = {
  modelName: string;
  billingMode: string;
  displayUnit: string;
  publicEndpointTypes: string[];
  supportedEndpointTypes: string[];
  basePrice?: number;
  unitPrice?: number;
  discount: number;
  currency: string;
  displayPrice: string;
  pricingSource: string;
  rule?: {
    id?: string;
    capability?: string;
    resolution?: string;
    verificationStatus?: string;
  };
};

const snapshot = pricingSnapshot as PricingSnapshot;

export const pricingUpdatedAt = "2026-06-06";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 4
});

function formatUsd(value: number) {
  return currencyFormatter.format(value);
}

function effectivePrice(basePrice: number | undefined, discount = 1) {
  if (basePrice === undefined) {
    return undefined;
  }

  return Number((basePrice * discount).toFixed(8));
}

function priceFromRule(rule: PricingRule | undefined) {
  if (!rule) {
    return undefined;
  }

  return rule.platform_base_price ?? rule.official_price_usd;
}

function pickRule(rules: PricingRule[] | undefined, modality: "image" | "video") {
  if (!rules?.length) {
    return undefined;
  }

  const verified = rules.filter((rule) => rule.verification_status === "verified");
  const pool = verified.length ? verified : rules;

  if (modality === "image") {
    return (
      pool.find((rule) => rule.capability_bucket === "t2i" && rule.resolution === "1K") ??
      pool.find((rule) => rule.capability_bucket === "t2i") ??
      pool.find((rule) => rule.resolution === "1K") ??
      pool[0]
    );
  }

  return (
    pool.find(
      (rule) =>
        rule.capability_bucket === "t2v" &&
        rule.resolution?.toLowerCase() === "720p" &&
        !rule.has_audio
    ) ??
    pool.find((rule) => rule.capability_bucket === "t2v" && !rule.has_audio) ??
    pool.find((rule) => rule.resolution?.toLowerCase() === "720p" && !rule.has_audio) ??
    pool.find((rule) => !rule.has_audio) ??
    pool[0]
  );
}

function normalizeDisplayUnit(model: PricingModel, rule?: PricingRule) {
  if (model.billing_mode === "per_second") {
    return "/second";
  }

  if (
    model.billing_mode === "per_image" ||
    model.image_pricing ||
    model.public_endpoint_types?.includes("image-generation")
  ) {
    return "/image";
  }

  if (model.public_endpoint_types?.includes("openai-video")) {
    return "/video job";
  }

  if (rule?.capability_bucket) {
    return `/${rule.capability_bucket}`;
  }

  return model.display_unit || "/unit";
}

function displayMode(model: PricingModel) {
  if (model.billing_mode) {
    return model.billing_mode;
  }

  if (model.public_endpoint_types?.includes("openai-video")) {
    return "per_video_job";
  }

  if (model.public_endpoint_types?.includes("image-generation")) {
    return "per_image";
  }

  return "usage_based";
}

export function getEndpointPath(endpointType: string) {
  return snapshot.supported_endpoint?.[endpointType];
}

export function getPricingModel(modelName: string) {
  return snapshot.data.find((model) => model.model_name === modelName);
}

export function getPricingSummary(modelName: string): PricingSummary | undefined {
  const model = getPricingModel(modelName);

  if (!model) {
    return undefined;
  }

  const imageRule = pickRule(model.image_pricing?.rules, "image");
  const videoRule = pickRule(model.video_pricing?.rules, "video");
  const selectedRule = imageRule ?? videoRule;
  const basePrice = priceFromRule(selectedRule) ?? (model.model_price || undefined);
  const discount = model.discount ?? 1;
  const unitPrice = effectivePrice(basePrice, discount);
  const displayUnit = normalizeDisplayUnit(model, selectedRule);
  const discountSuffix = discount !== 1 ? ` after ${discount}x discount` : "";
  const displayPrice =
    unitPrice !== undefined
      ? `${formatUsd(unitPrice)}${displayUnit}${discountSuffix}`
      : `See Pricing page${displayUnit !== "/unit" ? ` ${displayUnit}` : ""}`;

  return {
    modelName: model.model_name,
    billingMode: displayMode(model),
    displayUnit,
    publicEndpointTypes: model.public_endpoint_types ?? [],
    supportedEndpointTypes: model.supported_endpoint_types ?? [],
    basePrice,
    unitPrice,
    discount,
    currency: "USD",
    displayPrice,
    pricingSource: selectedRule ? "pricing rule" : "model_price",
    rule: selectedRule
      ? {
          id: selectedRule.rule_id,
          capability: selectedRule.capability_bucket,
          resolution: selectedRule.resolution,
          verificationStatus: selectedRule.verification_status
        }
      : undefined
  };
}
