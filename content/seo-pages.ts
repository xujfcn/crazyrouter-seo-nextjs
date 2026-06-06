export type PageKind = "model" | "pricing" | "compare" | "alternative" | "tool";

export type SeoPage = {
  kind: PageKind;
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  cta: string;
  updatedAt: string;
  sections: {
    heading: string;
    body: string;
    bullets?: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  related: string[];
};

const commonFaqs = {
  openAiCompatible: {
    question: "Is CrazyRouter compatible with OpenAI SDKs?",
    answer:
      "Yes. CrazyRouter is designed around OpenAI-compatible API patterns so teams can route model calls through one endpoint with fewer client-side changes."
  },
  productionUse: {
    question: "Can I use these APIs in production?",
    answer:
      "Yes. These pages are written for developers evaluating production API usage, including pricing, routing, fallback behavior, and operational tradeoffs."
  }
};

export const seoPages: SeoPage[] = [
  {
    kind: "model",
    slug: "sora-api",
    title: "Sora API for Developers | CrazyRouter",
    description:
      "Use Sora through a unified AI API gateway with OpenAI-compatible patterns, fallback routing, pricing guidance, and implementation notes.",
    eyebrow: "Video Generation API",
    h1: "Sora API for production video workflows",
    intro:
      "Build video generation features with a single routing layer for Sora-style models, pricing controls, and a developer workflow that fits production apps.",
    primaryKeyword: "sora api",
    secondaryKeywords: ["sora 2 api", "sora api key", "sora api pricing", "sora api documentation"],
    cta: "Start routing Sora API requests",
    updatedAt: "2026-06-06",
    sections: [
      {
        heading: "When to use this page",
        body:
          "This guide is for teams comparing Sora API providers and deciding how to add video generation without wiring every model vendor separately.",
        bullets: [
          "You need a stable API layer for model experiments.",
          "You want fallback options when video generation providers are slow or unavailable.",
          "You need practical pricing and implementation guidance before committing."
        ]
      },
      {
        heading: "CrazyRouter angle",
        body:
          "CrazyRouter is positioned as the routing and compatibility layer rather than only a model catalog. The value is lower integration overhead, one billing surface, and a path to swap or fallback between supported video models."
      },
      {
        heading: "Implementation checklist",
        body:
          "Start with a minimal request, log response latency and failure modes, then add retry budgets and model fallback. Keep generated asset storage separate from the request layer so vendor changes do not affect your app database."
      }
    ],
    faqs: [
      commonFaqs.openAiCompatible,
      {
        question: "What should I compare before choosing a Sora API provider?",
        answer:
          "Compare model availability, request latency, retry behavior, pricing per generation, content policy constraints, and whether your provider supports fallback routing."
      },
      commonFaqs.productionUse
    ],
    related: ["sora-api-price", "gpt-image-1-api", "crazyrouter-vs-apimart"]
  },
  {
    kind: "model",
    slug: "gpt-image-1-api",
    title: "GPT Image 1 API Guide | CrazyRouter",
    description:
      "Explore GPT Image 1 API usage, pricing considerations, image generation workflow design, and OpenAI-compatible routing with CrazyRouter.",
    eyebrow: "Image Generation API",
    h1: "GPT Image 1 API for image generation apps",
    intro:
      "Use GPT Image 1 through a unified API routing layer for product image generation, creative tools, batch workflows, and fallback-ready integrations.",
    primaryKeyword: "gpt-image-1 api",
    secondaryKeywords: ["gpt image api", "gpt-4o image api", "openai image generation api"],
    cta: "Build with GPT Image 1 routing",
    updatedAt: "2026-06-06",
    sections: [
      {
        heading: "Best-fit use cases",
        body:
          "GPT Image 1 is relevant when output quality and prompt following matter more than raw generation volume. Teams often evaluate it for product visuals, ad variants, thumbnails, and creative editing flows.",
        bullets: [
          "Marketing creative generation",
          "App-native image editing tools",
          "Batch visual asset generation",
          "Model comparison against other image APIs"
        ]
      },
      {
        heading: "Routing benefits",
        body:
          "A gateway reduces the cost of future model migration. Instead of embedding provider-specific assumptions in your app, you can isolate model names, retry logic, usage logging, and cost controls in one layer."
      },
      {
        heading: "What to measure",
        body:
          "Track request success rate, generation latency, average cost per accepted asset, prompt retry rate, and human acceptance rate. Those metrics matter more than headline model availability."
      }
    ],
    faqs: [
      commonFaqs.openAiCompatible,
      {
        question: "How should I estimate GPT Image 1 API costs?",
        answer:
          "Estimate cost per successful asset, not just cost per request. Include retries, discarded generations, resolution, and post-processing workflow costs."
      },
      commonFaqs.productionUse
    ],
    related: ["openai-api-price-calculator", "sora-api", "crazyrouter-vs-apimart"]
  },
  {
    kind: "model",
    slug: "veo-3-api",
    title: "Veo 3 API Provider Guide | CrazyRouter",
    description:
      "Compare Veo 3 API integration requirements, pricing factors, and fallback design for production video generation workflows.",
    eyebrow: "Video Model Routing",
    h1: "Veo 3 API routing for production teams",
    intro:
      "Evaluate Veo 3 API access through the lens of implementation reliability, cost control, and routing flexibility.",
    primaryKeyword: "veo 3 api",
    secondaryKeywords: ["veo 3 api key", "veo 3 api pricing", "google veo api"],
    cta: "Compare video API routing options",
    updatedAt: "2026-06-06",
    sections: [
      {
        heading: "Why routing matters",
        body:
          "Video generation APIs have higher latency and higher unit costs than text APIs. A routing layer helps isolate vendor-specific errors and lets teams test multiple video models without rewriting client code."
      },
      {
        heading: "Provider evaluation criteria",
        body:
          "Look at queue time, maximum video length, resolution support, content policy restrictions, webhook support, storage handling, and retry semantics."
      },
      {
        heading: "Conversion intent",
        body:
          "People searching for Veo 3 API are often evaluating availability and implementation path. A page should answer access, pricing, code, and fallback questions before sending users to signup."
      }
    ],
    faqs: [
      {
        question: "Can CrazyRouter help compare Veo 3 against other video APIs?",
        answer:
          "Yes. CrazyRouter pages should make model tradeoffs explicit and connect Veo 3 evaluation to Sora, Seedance, and other video model options."
      },
      commonFaqs.productionUse
    ],
    related: ["sora-api", "sora-api-price", "ai-api-cost-calculator"]
  },
  {
    kind: "pricing",
    slug: "sora-api-price",
    title: "Sora API Pricing and Cost Planning | CrazyRouter",
    description:
      "Plan Sora API costs with practical pricing factors, retry budgeting, fallback strategy, and production cost controls.",
    eyebrow: "API Pricing",
    h1: "Sora API pricing: what production teams should calculate",
    intro:
      "Sora API pricing decisions should include more than per-generation cost. Teams need to budget retries, failed jobs, storage, moderation, and accepted output rate.",
    primaryKeyword: "sora api price",
    secondaryKeywords: ["sora api pricing", "sora 2 api cost", "sora 2 api pricing"],
    cta: "Estimate Sora API costs",
    updatedAt: "2026-06-06",
    sections: [
      {
        heading: "Cost model",
        body:
          "A useful Sora API cost model includes generated seconds, resolution, retries, failed jobs, rejected outputs, storage transfer, and post-processing. The cheapest request is not always the cheapest accepted video.",
        bullets: [
          "Cost per request",
          "Cost per accepted output",
          "Retry and timeout rate",
          "Queue time and operational delay",
          "Fallback provider cost"
        ]
      },
      {
        heading: "How CrazyRouter should position this",
        body:
          "The pricing page should lead users toward a calculator and signup flow, but it should also educate them on real operating cost. This creates more trust than a thin table of model prices."
      }
    ],
    faqs: [
      {
        question: "Why is cost per accepted video better than cost per request?",
        answer:
          "Because failed jobs, rejected outputs, and retries still consume time and often consume budget. Production teams need the cost of usable assets."
      },
      commonFaqs.openAiCompatible
    ],
    related: ["sora-api", "ai-api-cost-calculator", "veo-3-api"]
  },
  {
    kind: "compare",
    slug: "crazyrouter-vs-apimart",
    title: "CrazyRouter vs Apimart.ai | AI API Platform Comparison",
    description:
      "Compare CrazyRouter and Apimart.ai for AI API routing, model discovery, production integration, pricing control, and developer workflows.",
    eyebrow: "Competitor Comparison",
    h1: "CrazyRouter vs Apimart.ai",
    intro:
      "Apimart.ai is useful for AI API discovery and marketplace-style evaluation. CrazyRouter is better positioned for teams that need production routing, unified integration, and operational control.",
    primaryKeyword: "crazyrouter vs apimart",
    secondaryKeywords: ["apimart alternative", "apimart.ai alternative", "ai api marketplace"],
    cta: "Compare CrazyRouter for your API stack",
    updatedAt: "2026-06-06",
    sections: [
      {
        heading: "Short version",
        body:
          "Choose Apimart.ai if you primarily want to browse API options. Choose CrazyRouter if you want an API gateway layer that helps route, monitor, and operate model requests in production."
      },
      {
        heading: "Comparison criteria",
        body:
          "A useful comparison should cover API compatibility, model coverage, pricing transparency, fallback routing, logs, support, and developer onboarding.",
        bullets: [
          "Model discovery versus production routing",
          "Documentation depth and code examples",
          "Cost controls and usage visibility",
          "Fallback behavior and operational reliability"
        ]
      },
      {
        heading: "Where CrazyRouter should win",
        body:
          "CrazyRouter should emphasize OpenAI-compatible integration, multi-model routing, usage visibility, production support, and cost control. These are stronger conversion arguments than claiming to list every API."
      }
    ],
    faqs: [
      {
        question: "Is Apimart.ai a direct CrazyRouter competitor?",
        answer:
          "It is a relevant search and evaluation competitor for AI API users, especially around model API discovery. CrazyRouter should position itself around production routing and unified integration."
      },
      {
        question: "What pages should link to this comparison?",
        answer:
          "Model API pages, pricing pages, AI API marketplace pages, and alternative pages should all link to the CrazyRouter vs Apimart.ai comparison."
      }
    ],
    related: ["apimart-ai-alternative", "sora-api", "gpt-image-1-api"]
  },
  {
    kind: "alternative",
    slug: "apimart-ai-alternative",
    title: "Apimart.ai Alternative for Production AI APIs | CrazyRouter",
    description:
      "Looking for an Apimart.ai alternative? Compare CrazyRouter for OpenAI-compatible routing, model fallback, pricing control, and production API usage.",
    eyebrow: "Alternative Page",
    h1: "A production-focused Apimart.ai alternative",
    intro:
      "If you are comparing AI API marketplaces, CrazyRouter gives you a more production-oriented path: one API layer, model routing, and operational visibility.",
    primaryKeyword: "apimart alternative",
    secondaryKeywords: ["apimart.ai alternative", "best apimart alternatives", "ai api marketplace alternative"],
    cta: "Evaluate CrazyRouter as your API layer",
    updatedAt: "2026-06-06",
    sections: [
      {
        heading: "Why teams look for alternatives",
        body:
          "Teams usually look beyond marketplace-style directories when they need predictable integration, stable request handling, cost visibility, and provider fallback."
      },
      {
        heading: "What to compare",
        body:
          "Compare how each platform handles authentication, request format, supported models, logs, billing, rate limits, and support. Those details matter after the first API test succeeds."
      },
      {
        heading: "Migration path",
        body:
          "Start by routing one low-risk model workload through CrazyRouter. Measure latency, error rate, output quality, and cost. Expand only after the operational metrics are acceptable."
      }
    ],
    faqs: [
      {
        question: "Who is CrazyRouter best for?",
        answer:
          "CrazyRouter is best for developers and teams that want one API integration layer across multiple AI models, with practical routing and cost controls."
      },
      commonFaqs.openAiCompatible
    ],
    related: ["crazyrouter-vs-apimart", "ai-api-cost-calculator", "sora-api"]
  },
  {
    kind: "tool",
    slug: "ai-api-cost-calculator",
    title: "AI API Cost Calculator | CrazyRouter",
    description:
      "Estimate AI API costs for text, image, and video model workloads with request volume, retry rate, and accepted output assumptions.",
    eyebrow: "Free Tool",
    h1: "AI API cost calculator for model routing decisions",
    intro:
      "Plan AI API spend by modeling request volume, retries, accepted outputs, and fallback usage across text, image, and video workloads.",
    primaryKeyword: "ai api cost calculator",
    secondaryKeywords: ["openai api price calculator", "sora api cost calculator", "model api pricing calculator"],
    cta: "Calculate API costs",
    updatedAt: "2026-06-06",
    sections: [
      {
        heading: "What this tool should calculate",
        body:
          "The first version can be simple: monthly request volume, average retry rate, estimated unit cost, accepted output rate, and fallback percentage. That is enough to make the page useful and conversion-oriented."
      },
      {
        heading: "SEO value",
        body:
          "Tool pages can attract high-intent traffic because users searching for calculators are often close to implementation or budgeting decisions."
      }
    ],
    faqs: [
      {
        question: "Should API pricing pages include calculators?",
        answer:
          "Yes. Calculators make pricing pages more useful and differentiate them from thin competitor pages that only summarize public model information."
      },
      commonFaqs.productionUse
    ],
    related: ["sora-api-price", "gpt-image-1-api", "apimart-ai-alternative"]
  }
];

export const pageKindPath: Record<PageKind, string> = {
  model: "models",
  pricing: "pricing",
  compare: "compare",
  alternative: "alternatives",
  tool: "tools"
};

export function getPagePath(page: SeoPage) {
  return `/${pageKindPath[page.kind]}/${page.slug}`;
}

export function findPage(kind: PageKind, slug: string) {
  return seoPages.find((page) => page.kind === kind && page.slug === slug);
}

export function findPageBySlug(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}
