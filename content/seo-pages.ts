import { getEndpointPath, getPricingSummary, type PricingSummary } from "@/lib/pricing";

export type PageKind = "model" | "comparison" | "alternative" | "tool";
export type PageLocale = "en" | "zh";

export type TestEvidence = {
  label: string;
  method: string;
  url: string;
  status: string;
  result: string;
};

export type CodeSample = {
  label: string;
  language: string;
  code: string;
};

export type PageSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type PricingModelRef = {
  model: string;
  usageLabel?: string;
};

export type CalculatorPreset = {
  label: string;
  model: string;
  unitLabel: string;
  unitPrice: number;
  defaultUnits: number;
};

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
  intent: string;
  docsRefs: string[];
  pricingModels: PricingModelRef[];
  endpointType?: string;
  sections: PageSection[];
  faqs: {
    question: string;
    answer: string;
  }[];
  codeSamples?: CodeSample[];
  testEvidence?: TestEvidence[];
  related: string[];
  calculatorPresets?: CalculatorPreset[];
};

const apiBase = "https://cn.crazyrouter.com";
const openAiBase = "https://cn.crazyrouter.com/v1";
const pricingApi = "https://cn.crazyrouter.com/api/pricing";

const publicEvidence: TestEvidence[] = [
  {
    label: "Pricing API reachable",
    method: "GET",
    url: pricingApi,
    status: "200",
    result: "Returned the public model pricing catalog used by these pages."
  }
];

const modelAvailabilityEvidence: TestEvidence = {
  label: "Target models visible to API key",
  method: "GET",
  url: `${apiBase}/v1/models`,
  status: "200",
  result:
    "Authenticated check confirmed gpt-image-2, veo-3.1-fast, veo-3.1, nano-banana-2, nano-banana-pro, nano-banana, grok-4-image, qwen-image-plus, qwen-image-max, and qwen-image-2.0 are visible to the local CrazyRouter API key."
};

const authenticatedEvidence = [...publicEvidence, modelAvailabilityEvidence];

const commonFaqs = {
  pricingTruth: {
    question: "Where do these model prices come from?",
    answer:
      "The page reads from a committed snapshot of GET https://cn.crazyrouter.com/api/pricing, which mirrors the live CrazyRouter Pricing page. Re-run the pricing sync script before publishing if the Pricing page changes."
  },
  auth: {
    question: "Can I test this without an API key?",
    answer:
      "Start by checking the public pricing endpoint. To list models or make model calls, create an API key at https://crazyrouter.com and send it as Bearer authorization."
  },
  baseUrl: {
    question: "Which Base URL should an OpenAI-compatible client use?",
    answer:
      "OpenAI-compatible SDKs should use https://cn.crazyrouter.com/v1. Hand-written cURL requests should use the full endpoint path, such as https://cn.crazyrouter.com/v1/images/generations."
  }
};

function endpointLabel(endpointType: string) {
  const endpoint = getEndpointPath(endpointType);
  return endpoint ? `${endpoint.method} ${endpoint.path}` : endpointType;
}

function modelCode(model: string, endpointType: string, prompt: string) {
  const endpoint = getEndpointPath(endpointType);

  if (endpointType === "image-generation") {
    return {
      curl: `curl -X POST ${openAiBase}/images/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "${model}",
    "prompt": "${prompt}",
    "n": 1
  }'`,
      python: `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="${openAiBase}",
)

response = client.images.generate(
    model="${model}",
    prompt="${prompt}",
    n=1,
)

print(response.data[0].url)`
    };
  }

  if (endpointType === "openai-video") {
    return {
      curl: `curl -X POST ${openAiBase}/video/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "${model}",
    "prompt": "${prompt}",
    "size": "1280x720",
    "duration": 5
  }'`,
      python: `import requests

response = requests.post(
    "${openAiBase}/video/generations",
    headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY",
    },
    json={
        "model": "${model}",
        "prompt": "${prompt}",
        "size": "1280x720",
        "duration": 5,
    },
    timeout=240,
)

print(response.json())`
    };
  }

  if (endpointType === "unified-video") {
    return {
      curl: `curl -X POST ${openAiBase}/video/create \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "${model}",
    "prompt": "${prompt}",
    "aspect_ratio": "16:9",
    "size": "720P"
  }'`,
      python: `import requests

response = requests.post(
    "${openAiBase}/video/create",
    headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY",
    },
    json={
        "model": "${model}",
        "prompt": "${prompt}",
        "aspect_ratio": "16:9",
        "size": "720P",
    },
    timeout=240,
)

print(response.json())`
    };
  }

  return {
    curl: `curl -X ${endpoint?.method ?? "POST"} ${apiBase}${endpoint?.path ?? ""} \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    python: ""
  };
}

function samples(model: string, endpointType: string, prompt: string): CodeSample[] {
  const code = modelCode(model, endpointType, prompt);

  return [
    {
      label: "cURL",
      language: "bash",
      code: code.curl
    },
    {
      label: "Python",
      language: "python",
      code: code.python
    }
  ].filter((item) => item.code.length > 0);
}

function availabilityBullets(models: string[]) {
  return models.map((model) => {
    const pricing = getPricingSummary(model);
    const endpointTypes = pricing?.publicEndpointTypes.join(", ") || "not found";
    const price = pricing?.displayPrice || "Pricing page row available";
    return `${model}: ${price}; public_endpoint_types = ${endpointTypes}.`;
  });
}

function pricingRefs(models: string[]) {
  return models.map((model) => ({ model }));
}

const veoModels = ["veo-3.1-fast", "veo-3.1"];
const qwenModels = ["qwen-image-plus", "qwen-image-max", "qwen-image-2.0"];
const imageModels = ["gpt-image-2", "nano-banana-2", "grok-4-image", ...qwenModels];
const videoModels = veoModels;
const competitorPricingModels = [
  "gpt-image-2",
  "nano-banana-2",
  "qwen-image-max",
  "grok-4-image",
  "veo-3.1-fast",
  "veo-3.1"
];
const competitorDocsRefs = [
  "crazyrouter-docs/llms-guide.mdx",
  "crazyrouter-docs/api-endpoint.mdx",
  "crazyrouter-docs/images/gpt-image.mdx",
  "crazyrouter-docs/video/unified.mdx"
];

type AlternativeInput = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intent: string;
  sections: PageSection[];
  codeModel: string;
  codeEndpointType: string;
  prompt: string;
  related?: string[];
};

function alternativePage(input: AlternativeInput): SeoPage {
  return {
    kind: "alternative",
    slug: input.slug,
    title: input.title,
    description: input.description,
    eyebrow: "Platform Alternative",
    h1: input.h1,
    intro: input.intro,
    primaryKeyword: input.primaryKeyword,
    secondaryKeywords: input.secondaryKeywords,
    cta: "Start with CrazyRouter",
    updatedAt: "2026-06-06",
    intent: input.intent,
    docsRefs: competitorDocsRefs,
    pricingModels: pricingRefs(competitorPricingModels),
    sections: input.sections,
    faqs: [],
    codeSamples: samples(input.codeModel, input.codeEndpointType, input.prompt),
    testEvidence: authenticatedEvidence,
    related: input.related ?? ["ai-api-platform-comparison", "ai-api-cost-calculator", "gpt-image-2-api"]
  };
}

const competitorAlternativePages: SeoPage[] = [
  alternativePage({
    slug: "fal-ai-alternative",
    title: "fal.ai Alternative for Production Image and Video APIs | CrazyRouter",
    description:
      "Compare fal.ai and CrazyRouter for production image and video API work: model access, pricing visibility, endpoints, and migration steps.",
    h1: "fal.ai alternative for production API teams",
    intro:
      "fal.ai is strong for generative media builders who want a large model marketplace and serverless model execution. CrazyRouter is the practical alternative when the work has moved from model exploration to stable API calls, visible pricing rows, and account records for production usage.",
    primaryKeyword: "fal ai alternative",
    secondaryKeywords: ["fal.ai alternative", "fal api alternative", "fal ai pricing alternative"],
    intent:
      "Use this comparison when your team already knows the image or video workload it wants to run and needs a simpler production gateway around standard model names, endpoint examples, and spend records.",
    codeModel: "gpt-image-2",
    codeEndpointType: "image-generation",
    prompt: "A clean product photo of a black wireless headset on a white background",
    sections: [
      {
        heading: "When CrazyRouter is the better fit",
        body:
          "Choose CrazyRouter when you want image, video, chat, and embedding calls behind one operational API layer rather than a model-marketplace workflow. API requests use https://cn.crazyrouter.com, while login, recharge, API keys, and usage records stay on https://crazyrouter.com.",
        bullets: [
          "Standard model names are copied directly from the CrazyRouter pricing catalog.",
          "OpenAI-compatible image calls use POST https://cn.crazyrouter.com/v1/images/generations.",
          "Video creation uses documented CrazyRouter video paths such as POST https://cn.crazyrouter.com/v1/video/create."
        ]
      },
      {
        heading: "Where fal.ai remains strong",
        body:
          "fal.ai is still a strong choice when you need fal-specific model endpoints, marketplace-native examples, or custom serverless model deployment. CrazyRouter should not be treated as a replacement for every fal Serverless use case."
      },
      {
        heading: "Migration path",
        body:
          "Start with one workload, usually image generation or short video generation. Pick a standard CrazyRouter model name, copy the endpoint, run a small request set, then compare accepted-output cost in the CrazyRouter console before moving recurring traffic.",
        bullets: availabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "veo-3.1-fast"])
      },
      {
        heading: "Decision summary",
        body:
          "Use fal.ai for marketplace exploration and custom serverless execution. Use CrazyRouter when production needs clear model rows, consistent API authentication, visible billing, and a gateway your backend can keep stable."
      }
    ]
  }),
  alternativePage({
    slug: "wavespeed-ai-alternative",
    title: "WaveSpeed AI Alternative for API Production Workloads | CrazyRouter",
    description:
      "Compare WaveSpeed AI and CrazyRouter for image, video, and multimodal API workflows with visible pricing and documented endpoint paths.",
    h1: "WaveSpeed AI alternative for production API workflows",
    intro:
      "WaveSpeed AI focuses on broad creative model access, fast generation, and multiple integration surfaces. CrazyRouter is a focused alternative for teams that want production API calls tied to standard model names, pricing rows, and console usage records.",
    primaryKeyword: "wavespeed ai alternative",
    secondaryKeywords: ["wavespeed alternative", "wavespeed api alternative", "wavespeed ai pricing"],
    intent:
      "Use this comparison when you are moving from playground-style creative generation into a backend API integration that must be easy to price, audit, and maintain.",
    codeModel: "veo-3.1-fast",
    codeEndpointType: "unified-video",
    prompt: "A cinematic 5 second shot of a glass bottle rotating on a studio turntable",
    sections: [
      {
        heading: "When CrazyRouter is the better fit",
        body:
          "CrazyRouter is a better fit when your team wants one production-oriented gateway for selected model families rather than the widest possible creative catalog. The same account can manage API keys, recharge, and usage records on https://crazyrouter.com while requests go to https://cn.crazyrouter.com.",
        bullets: [
          "Model names and endpoint types are visible before implementation.",
          "Pricing cards use the CrazyRouter pricing API snapshot, not generic category estimates.",
          "The code path can stay close to OpenAI-compatible image and chat clients."
        ]
      },
      {
        heading: "Where WaveSpeed AI remains strong",
        body:
          "WaveSpeed AI is a strong option when your team wants a very broad creative catalog, desktop or workflow integrations, or platform-specific speed claims around supported models."
      },
      {
        heading: "Migration path",
        body:
          "Choose one model family first. For image generation, test gpt-image-2, nano-banana-2, or qwen-image-max. For video generation, test veo-3.1-fast before trying the quality route.",
        bullets: availabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "veo-3.1-fast", "veo-3.1"])
      },
      {
        heading: "Decision summary",
        body:
          "Use WaveSpeed AI when catalog breadth and creative tooling are the top priority. Use CrazyRouter when the priority is a controlled backend integration with explicit model rows, endpoint paths, and billing records."
      }
    ]
  }),
  alternativePage({
    slug: "piapi-alternative",
    title: "PiAPI Alternative for Stable Image and Video API Access | CrazyRouter",
    description:
      "Compare PiAPI and CrazyRouter for teams that need production-ready image and video APIs with documented model names and pricing visibility.",
    h1: "PiAPI alternative for stable image and video APIs",
    intro:
      "PiAPI is often evaluated for access to creative models and unofficial or third-party model workflows. CrazyRouter is the better fit when your production code should rely on documented CrazyRouter model names, visible prices, and standard endpoint paths.",
    primaryKeyword: "piapi alternative",
    secondaryKeywords: ["piapi ai alternative", "midjourney api alternative", "piapi pricing alternative"],
    intent:
      "Use this comparison when your team wants to reduce dependence on model-specific task APIs and move supported image or video workloads into a clearer production gateway.",
    codeModel: "gpt-image-2",
    codeEndpointType: "image-generation",
    prompt: "A high detail ecommerce image of a stainless steel water bottle on a gray background",
    sections: [
      {
        heading: "When CrazyRouter is the better fit",
        body:
          "CrazyRouter is better when you can map the workload to supported public models such as gpt-image-2, nano-banana-2, qwen-image-max, grok-4-image, or Veo 3.1. The API contract is easier to audit because each page ties the model name to a price row and endpoint type.",
        bullets: [
          "Image generation uses POST https://cn.crazyrouter.com/v1/images/generations.",
          "Unified video creation uses POST https://cn.crazyrouter.com/v1/video/create.",
          "Account, recharge, API keys, and usage records use https://crazyrouter.com."
        ]
      },
      {
        heading: "Where PiAPI remains strong",
        body:
          "PiAPI can remain useful if your workflow depends on PiAPI-specific Midjourney, music, or creative task actions that are not part of CrazyRouter's current public pricing catalog."
      },
      {
        heading: "Migration path",
        body:
          "List the exact PiAPI actions in your product, then separate them into image generation, image editing, video generation, and model-specific actions. Move only the supported CrazyRouter workloads first, and keep unavailable actions on their existing provider until a documented model row exists.",
        bullets: availabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "grok-4-image"])
      },
      {
        heading: "Decision summary",
        body:
          "Use PiAPI for PiAPI-specific creative task APIs. Use CrazyRouter for supported production workloads where stable model names, endpoint examples, and cost records matter more than model-specific task features."
      }
    ]
  }),
  alternativePage({
    slug: "cometapi-alternative",
    title: "CometAPI Alternative for Production AI API Access | CrazyRouter",
    description:
      "Compare CometAPI and CrazyRouter for production AI API routing, model naming, endpoint clarity, pricing visibility, and migration planning.",
    h1: "CometAPI alternative for production AI API access",
    intro:
      "CometAPI is usually considered by teams that want broad AI model access through one provider. CrazyRouter is a focused alternative when selected models need clearer price rows, endpoint mappings, and console records before production traffic moves.",
    primaryKeyword: "cometapi alternative",
    secondaryKeywords: ["comet api alternative", "cometapi pricing", "ai api alternative"],
    intent:
      "Use this comparison when broad model access is useful, but your backend team needs tighter control over model naming, endpoint paths, and billing verification.",
    codeModel: "gpt-image-2",
    codeEndpointType: "image-generation",
    prompt: "A polished landing page hero image of an AI developer console on a laptop",
    sections: [
      {
        heading: "When CrazyRouter is the better fit",
        body:
          "CrazyRouter works well when production calls need a clear contract: a copied model name, an endpoint from the docs, and a price row that can be checked before launch. This is especially helpful for teams that need to explain monthly spend to product or finance stakeholders.",
        bullets: [
          "Pricing source: GET https://cn.crazyrouter.com/api/pricing.",
          "OpenAI-compatible Base URL: https://cn.crazyrouter.com/v1.",
          "Console and billing records: https://crazyrouter.com."
        ]
      },
      {
        heading: "Where CometAPI remains strong",
        body:
          "CometAPI can be a good fit when the main requirement is access to a broad and frequently changing model catalog. CrazyRouter is intentionally better for the subset of models it exposes with documented pricing and endpoint behavior."
      },
      {
        heading: "Migration path",
        body:
          "Start by replacing one high-volume call path, not the whole catalog. Verify the CrazyRouter model row, run a small batch, compare latency and accepted-output cost, then move the next call path.",
        bullets: availabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "veo-3.1-fast"])
      },
      {
        heading: "Decision summary",
        body:
          "Use CometAPI when catalog breadth is the primary requirement. Use CrazyRouter when the production priority is model clarity, pricing visibility, and a narrower set of documented workflows."
      }
    ]
  }),
  alternativePage({
    slug: "replicate-alternative",
    title: "Replicate Alternative for Production AI API Gateways | CrazyRouter",
    description:
      "Compare Replicate and CrazyRouter for teams choosing between hosted model execution and a production gateway for selected AI APIs.",
    h1: "Replicate alternative for production API teams",
    intro:
      "Replicate is strong for running hosted community models and custom model deployments. CrazyRouter is a better alternative when you want selected commercial image, video, chat, and embedding models behind one production gateway with visible pricing and account records.",
    primaryKeyword: "replicate alternative",
    secondaryKeywords: ["replicate api alternative", "replicate pricing alternative", "replicate ai alternative"],
    intent:
      "Use this comparison when the question is not model hosting itself, but how to run known model APIs through a stable gateway with clearer pricing and operational records.",
    codeModel: "gpt-image-2",
    codeEndpointType: "image-generation",
    prompt: "A realistic product render of a modern desk lamp on a walnut desk",
    sections: [
      {
        heading: "When CrazyRouter is the better fit",
        body:
          "CrazyRouter is a better fit when your product does not need to deploy custom models and instead needs reliable access to supported public model routes. You get a consistent API domain, model-name cards, documented endpoints, and usage records in the main console.",
        bullets: [
          "Image model routes can use the OpenAI Images-compatible endpoint.",
          "Video routes can use the unified video creation and query flow.",
          "Cost planning uses current CrazyRouter pricing rows."
        ]
      },
      {
        heading: "Where Replicate remains strong",
        body:
          "Replicate remains the stronger choice when your team needs hosted open-source models, custom model deployment, or community model experimentation that is not exposed in CrazyRouter's current catalog."
      },
      {
        heading: "Migration path",
        body:
          "Separate Replicate usage into custom/community models and mainstream API workloads. Keep custom deployments on Replicate, then test CrazyRouter for mainstream image and video calls where the matching price rows are available.",
        bullets: availabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "veo-3.1-fast", "veo-3.1"])
      },
      {
        heading: "Decision summary",
        body:
          "Use Replicate for model hosting and open-source experimentation. Use CrazyRouter for production API routing when selected models, endpoint clarity, and cost records are more important than running arbitrary models."
      }
    ]
  }),
  alternativePage({
    slug: "aimlapi-alternative",
    title: "AIML API Alternative for Production Model Routing | CrazyRouter",
    description:
      "Compare AIML API and CrazyRouter for OpenAI-compatible AI API access, pricing visibility, supported model names, and production workflow control.",
    h1: "AIML API alternative for production model routing",
    intro:
      "AIML API is usually evaluated for broad model access through a unified API surface. CrazyRouter is the alternative for teams that want a smaller, documented set of production routes with visible pricing, copyable model names, and account-level usage records.",
    primaryKeyword: "aiml api alternative",
    secondaryKeywords: ["aimlapi alternative", "aiml api pricing", "openai compatible api alternative"],
    intent:
      "Use this comparison when your team values OpenAI-compatible access but also needs model-specific price rows, endpoint mappings, and a console workflow that is easy to audit.",
    codeModel: "gpt-image-2",
    codeEndpointType: "image-generation",
    prompt: "A sharp studio image of a developer dashboard with charts and model usage cards",
    sections: [
      {
        heading: "When CrazyRouter is the better fit",
        body:
          "CrazyRouter is better when the team wants each supported model to be tied to pricing, documentation, and a tested endpoint path before production release. This reduces ambiguity when engineering and finance both need to understand API usage.",
        bullets: [
          "Use https://cn.crazyrouter.com/v1 as the OpenAI-compatible Base URL.",
          "Use https://cn.crazyrouter.com for API requests outside the main console.",
          "Use https://crazyrouter.com for API keys, recharge, billing, and usage records."
        ]
      },
      {
        heading: "Where AIML API remains strong",
        body:
          "AIML API remains useful when the primary requirement is a very broad model catalog under one API brand. CrazyRouter should be evaluated for the models it exposes with clear price rows and endpoint behavior."
      },
      {
        heading: "Migration path",
        body:
          "Start with the OpenAI-compatible client configuration. Swap the base URL, copy one CrazyRouter model name from the price card, and run a narrow request set before changing larger workloads.",
        bullets: availabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "grok-4-image"])
      },
      {
        heading: "Decision summary",
        body:
          "Use AIML API when breadth is the most important selection factor. Use CrazyRouter when selected model coverage, pricing visibility, and production account records are more important."
      }
    ]
  }),
  alternativePage({
    slug: "eachlabs-alternative",
    title: "Eachlabs Alternative for Direct AI API Integration | CrazyRouter",
    description:
      "Compare Eachlabs and CrazyRouter for teams choosing between workflow-style AI orchestration and direct production API integration.",
    h1: "Eachlabs alternative for direct AI API integration",
    intro:
      "Eachlabs is often considered for AI workflow building and multi-step media pipelines. CrazyRouter is the better alternative when developers want direct API calls, clear model prices, and production usage records instead of a workflow-first product surface.",
    primaryKeyword: "eachlabs alternative",
    secondaryKeywords: ["eachlabs ai alternative", "ai workflow api alternative", "media api alternative"],
    intent:
      "Use this comparison when your team needs to decide whether an AI workflow tool or a direct API gateway is the right layer for production integration.",
    codeModel: "veo-3.1-fast",
    codeEndpointType: "unified-video",
    prompt: "A short product video showing a smartwatch floating above a matte black surface",
    sections: [
      {
        heading: "When CrazyRouter is the better fit",
        body:
          "CrazyRouter is better when your application code should own the workflow and call models directly. The API layer stays simple: choose a supported model, copy the endpoint, send Bearer authentication, and review usage records in the console.",
        bullets: [
          "Direct API requests use https://cn.crazyrouter.com.",
          "Console operations use https://crazyrouter.com.",
          "Pricing and model names come from the CrazyRouter pricing catalog."
        ]
      },
      {
        heading: "Where Eachlabs remains strong",
        body:
          "Eachlabs remains useful when the team wants a workflow builder, media pipeline orchestration, or non-developer surfaces around AI generation. CrazyRouter is intentionally closer to a backend API gateway."
      },
      {
        heading: "Migration path",
        body:
          "Keep orchestration in your application or job system, then move individual model calls into CrazyRouter one by one. Start with image generation or short video tasks where the pricing row and endpoint are already documented.",
        bullets: availabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "veo-3.1-fast"])
      },
      {
        heading: "Decision summary",
        body:
          "Use Eachlabs for workflow-first teams and visual orchestration. Use CrazyRouter for developer-owned production workflows that need direct model calls, visible pricing, and account records."
      }
    ]
  })
];

export const seoPages: SeoPage[] = [
  {
    kind: "model",
    slug: "gpt-image-2-api",
    title: "GPT Image 2 API Guide | CrazyRouter",
    description:
      "Build with gpt-image-2 on CrazyRouter using OpenAI Images-compatible endpoints, current pricing data, and documented parameters.",
    eyebrow: "Image API Guide",
    h1: "GPT Image 2 API guide",
    intro:
      "Use CrazyRouter to call gpt-image-2 for image generation and editing. OpenAI-compatible clients should use https://cn.crazyrouter.com/v1, and account or billing actions stay on https://crazyrouter.com.",
    primaryKeyword: "gpt-image-2 api",
    secondaryKeywords: ["gpt image api", "openai image generation api", "gpt-image-2 pricing"],
    cta: "Create an API key",
    updatedAt: "2026-06-06",
    intent:
      "Image API evaluators need a clean model name, the correct Images API route, unsupported-parameter warnings, and cost assumptions based on the Pricing page.",
    docsRefs: [
      "crazyrouter-docs/images/gpt-image.mdx",
      "crazyrouter-docs/api-endpoint.mdx",
      "crazyrouter-docs/llms-guide.mdx"
    ],
    pricingModels: pricingRefs(["gpt-image-2"]),
    endpointType: "image-generation",
    sections: [
      {
        heading: "Available model and pricing",
        body:
          "The current pricing catalog contains gpt-image-2 with image-generation as its public endpoint type. Use this exact model name in code and cost planning.",
        bullets: availabilityBullets(["gpt-image-2"])
      },
      {
        heading: "Parameter rules from docs",
        body:
          "gpt-image-2 uses POST /v1/images/generations for generation and POST /v1/images/edits for editing. Do not send response_format, style, input_fidelity, background=transparent, or quality=standard. Use output_format to choose png, jpeg, or webp.",
        bullets: [
          "For SDKs, set base_url to https://cn.crazyrouter.com/v1.",
          "For cURL, call https://cn.crazyrouter.com/v1/images/generations directly.",
          "For high-quality requests, set a long client timeout or use streaming where appropriate."
        ]
      },
      {
        heading: "Implementation checklist",
        body:
          "Start with one image, confirm the response URL, then add size, quality, and output_format controls as needed. Use the calculator to estimate spend before moving regular traffic."
      }
    ],
    faqs: [
      commonFaqs.pricingTruth,
      commonFaqs.baseUrl,
      {
        question: "Can I keep using response_format=b64_json with gpt-image-2?",
        answer:
          "No. The CrazyRouter GPT Image docs explicitly say response_format is not a gpt-image-2 parameter. Use output_format and read data[0].url by default."
      }
    ],
    codeSamples: samples(
      "gpt-image-2",
      "image-generation",
      "A clean product photo of a ceramic coffee mug on a white background"
    ),
    testEvidence: authenticatedEvidence,
    related: ["nano-banana-2-api", "grok-4-image-api", "ai-api-cost-calculator"]
  },
  {
    kind: "model",
    slug: "veo-3-1-api",
    title: "Veo 3.1 API Guide with Fast and Quality Models | CrazyRouter",
    description:
      "Use veo-3.1-fast and veo-3.1 through CrazyRouter's unified video API with current pricing data and documented request examples.",
    eyebrow: "Video API Guide",
    h1: "Veo 3.1 API guide",
    intro:
      "This page covers the two public Veo aliases returned by the Pricing API: veo-3.1-fast and veo-3.1. The public contract is text-to-video and single-image-to-video through the unified video API.",
    primaryKeyword: "veo 3.1 api",
    secondaryKeywords: ["veo 3 api", "veo api pricing", "veo video api", "google veo api"],
    cta: "Test unified video API",
    updatedAt: "2026-06-06",
    intent:
      "Developers comparing Veo API options need to know which public aliases are exposed, whether the public contract covers their use case, and what per-second pricing rules apply.",
    docsRefs: [
      "crazyrouter-docs/video/veo.mdx",
      "crazyrouter-docs/video/unified.mdx",
      "crazyrouter-docs/api-endpoint.mdx",
      "crazyrouter-docs/llms-guide.mdx"
    ],
    pricingModels: pricingRefs(veoModels),
    endpointType: "unified-video",
    sections: [
      {
        heading: "Available models and pricing",
        body:
          "The current Pricing API returns veo-3.1-fast and veo-3.1 with public_endpoint_types set to unified-video and billing mode per_second.",
        bullets: availabilityBullets(veoModels)
      },
      {
        heading: "Current public contract",
        body:
          "The public Veo guide currently covers text-to-video and single-image-to-video. For reference assets, start/end frames, audio-enabled rows, or 4K output, check the current Veo docs and pricing rules before adding them to a production workflow.",
        bullets: [
          "Creation: POST https://cn.crazyrouter.com/v1/video/create.",
          "Query: GET https://cn.crazyrouter.com/v1/video/query?id={task_id}.",
          "Recommended first test: one text prompt, 16:9, 720P, short duration."
        ]
      },
      {
        heading: "Fast versus quality decision",
        body:
          "Use veo-3.1-fast when time to first result matters. Use veo-3.1 when the output quality is more important than generation cost or latency."
      }
    ],
    faqs: [
      commonFaqs.pricingTruth,
      commonFaqs.auth,
      {
        question: "Is Veo billed per request or per generated second?",
        answer:
          "The current Pricing API marks both veo-3.1-fast and veo-3.1 as per_second models. The cost calculator on this site uses seconds as the default input for these models."
      }
    ],
    codeSamples: samples(
      "veo-3.1",
      "unified-video",
      "A cinematic shot of a spaceship landing on Mars, dust clouds rising"
    ),
    testEvidence: authenticatedEvidence,
    related: ["gpt-image-2-api", "ai-api-cost-calculator", "ai-api-platform-comparison"]
  },
  {
    kind: "model",
    slug: "nano-banana-2-api",
    title: "Nano Banana 2 API Guide | CrazyRouter",
    description:
      "Use nano-banana-2 through CrazyRouter's OpenAI Images-compatible API with current pricing data and documented image parameters.",
    eyebrow: "Image API Guide",
    h1: "Nano Banana 2 API guide",
    intro:
      "Nano Banana 2 is available in the Pricing API as nano-banana-2 and uses the image-generation public endpoint type. This guide focuses on the current OpenAI Images-compatible path.",
    primaryKeyword: "nano banana 2 api",
    secondaryKeywords: ["nano banana api", "gemini image api", "nano-banana-2 pricing"],
    cta: "Generate with Nano Banana 2",
    updatedAt: "2026-06-06",
    intent:
      "Image teams evaluating Gemini image routes need the public model alias, endpoint, resolution parameters, and per-image pricing assumptions in one place.",
    docsRefs: [
      "crazyrouter-docs/images/nano-banana-2.mdx",
      "crazyrouter-docs/chat/gemini/image-gen.mdx",
      "crazyrouter-docs/api-endpoint.mdx"
    ],
    pricingModels: pricingRefs(["nano-banana-2", "nano-banana-pro", "nano-banana"]),
    endpointType: "image-generation",
    sections: [
      {
        heading: "Available models and pricing",
        body:
          "The Nano Banana family is present in the pricing catalog. Start with nano-banana-2 for new integrations, then compare related models by output quality, cost, and reference-image needs.",
        bullets: availabilityBullets(["nano-banana-2", "nano-banana-pro", "nano-banana"])
      },
      {
        heading: "Request fields",
        body:
          "Use POST /v1/images/generations with model nano-banana-2. The public parameters are prompt, image_input, resolution, aspect_ratio, output_format, output_compression, and n. Do not pass Gemini-native fields such as generationConfig or imageOutputOptions.",
        bullets: [
          "Text-to-image: omit image_input.",
          "Reference image edit: pass one or more image URLs in image_input.",
          "Use output_format png, jpeg, or jpg depending on downstream needs."
        ]
      },
      {
        heading: "Implementation checklist",
        body:
          "Begin with one 1K image and one reference-free prompt. Add image_input, aspect_ratio, resolution, and output format controls only after the baseline request is stable."
      }
    ],
    faqs: [
      commonFaqs.pricingTruth,
      commonFaqs.baseUrl,
      {
        question: "Should I call Gemini native generateContent for Nano Banana 2?",
        answer:
          "For the public CrazyRouter contract, start with POST /v1/images/generations. The docs state that CrazyRouter handles provider-native field conversion on the server side."
      }
    ],
    codeSamples: samples(
      "nano-banana-2",
      "image-generation",
      "A clean ecommerce hero shot of a red apple on a white background"
    ),
    testEvidence: authenticatedEvidence,
    related: ["gpt-image-2-api", "qwen-image-api", "ai-api-cost-calculator"]
  },
  {
    kind: "model",
    slug: "grok-4-image-api",
    title: "Grok 4 Image API Guide | CrazyRouter",
    description:
      "Use grok-4-image on CrazyRouter with the OpenAI Images-compatible endpoint, Pricing API row, and parameter warnings from the docs.",
    eyebrow: "Image API Guide",
    h1: "Grok 4 Image API guide",
    intro:
      "Use the standard model name grok-4-image through CrazyRouter's OpenAI Images-compatible endpoint, with Grok-specific request parameters.",
    primaryKeyword: "grok 4 image api",
    secondaryKeywords: ["grok image api", "xai image api", "grok-4-image pricing"],
    cta: "Test Grok image generation",
    updatedAt: "2026-06-06",
    intent:
      "Developers comparing image APIs need to see Grok-specific parameter differences before copying a generic OpenAI Images request.",
    docsRefs: [
      "crazyrouter-docs/images/grok.mdx",
      "crazyrouter-docs/api-endpoint.mdx",
      "crazyrouter-docs/llms-guide.mdx"
    ],
    pricingModels: pricingRefs(["grok-4-image"]),
    endpointType: "image-generation",
    sections: [
      {
        heading: "Available model and pricing",
        body:
          "The current Pricing API row for grok-4-image exposes image-generation to customers. Pricing display should follow the Pricing page and consumption logs, not upstream marketing copy.",
        bullets: availabilityBullets(["grok-4-image"])
      },
      {
        heading: "Grok-specific parameters",
        body:
          "The docs warn not to pass size, quality, or style to Grok image models. Use aspect_ratio and resolution instead, and start with n=1 for stable cost control.",
        bullets: [
          "Recommended response_format: url.",
          "Use aspect_ratio values such as 1:1, 16:9, 9:16, 3:2, or auto.",
          "Use resolution values such as 1k or 2k."
        ]
      },
      {
        heading: "Evaluation workflow",
        body:
          "Compare Grok 4 Image against GPT Image 2 and Qwen Image on prompt adherence, accepted-output rate, temporary URL handling, and effective cost after rejected generations."
      }
    ],
    faqs: [
      commonFaqs.pricingTruth,
      commonFaqs.auth,
      {
        question: "Can I use size=1024x1024 with grok-4-image?",
        answer:
          "No. The Grok image docs say size is not supported. Use aspect_ratio and resolution for Grok image requests."
      }
    ],
    codeSamples: [
      {
        label: "cURL",
        language: "bash",
        code: `curl -X POST ${openAiBase}/images/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "grok-4-image",
    "prompt": "A tiny yellow cube on a plain white background, minimal product photo",
    "n": 1,
    "response_format": "url",
    "aspect_ratio": "1:1",
    "resolution": "1k"
  }'`
      },
      {
        label: "Python",
        language: "python",
        code: `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="${openAiBase}",
)

response = client.images.generate(
    model="grok-4-image",
    prompt="A tiny yellow cube on a plain white background, minimal product photo",
    n=1,
    response_format="url",
    extra_body={
        "aspect_ratio": "1:1",
        "resolution": "1k",
    },
)

print(response.data[0].url)`
      }
    ],
    testEvidence: authenticatedEvidence,
    related: ["gpt-image-2-api", "qwen-image-api", "ai-api-cost-calculator"]
  },
  {
    kind: "model",
    slug: "qwen-image-api",
    title: "Qwen Image API Guide | CrazyRouter",
    description:
      "Use qwen-image-plus, qwen-image-max, and qwen-image-2.0 through CrazyRouter's OpenAI Images-compatible API.",
    eyebrow: "Image API Guide",
    h1: "Qwen Image API guide",
    intro:
      "Qwen Image covers the standard customer-facing model names qwen-image-plus, qwen-image-max, and qwen-image-2.0 through CrazyRouter's OpenAI Images-compatible endpoint.",
    primaryKeyword: "qwen image api",
    secondaryKeywords: ["qwen-image-plus api", "qwen-image-max api", "qwen-image-2.0 api"],
    cta: "Test Qwen Image API",
    updatedAt: "2026-06-06",
    intent:
      "Developers searching for Qwen Image API access need one page that separates current public model aliases from provider-internal execution details.",
    docsRefs: [
      "crazyrouter-docs/images/qwen.mdx",
      "crazyrouter-docs/api-endpoint.mdx",
      "crazyrouter-docs/llms-guide.mdx"
    ],
    pricingModels: pricingRefs(qwenModels),
    endpointType: "image-generation",
    sections: [
      {
        heading: "Available models and pricing",
        body:
          "Current Qwen Image access uses the public pricing rows for qwen-image-plus, qwen-image-max, and qwen-image-2.0.",
        bullets: availabilityBullets(qwenModels)
      },
      {
        heading: "Customer-facing protocol",
        body:
          "CrazyRouter exposes these Qwen Image models through the OpenAI Images-compatible POST /v1/images/generations route. Provider-side synchronous or asynchronous execution is handled behind the gateway.",
        bullets: [
          "Use model qwen-image-max for a quality-first text-to-image baseline.",
          "Use size and n for standard OpenAI Images-compatible requests.",
          "Use response_format only where the Qwen docs allow url or b64_json."
        ]
      },
      {
        heading: "When to compare Qwen Image",
        body:
          "Qwen Image is useful when Chinese prompt handling, poster-like composition, or Alibaba-backed image generation is part of the evaluation set."
      }
    ],
    faqs: [
      commonFaqs.pricingTruth,
      commonFaqs.baseUrl,
      {
        question: "Does this guide include Qwen image editing?",
        answer:
          "No. The Qwen docs page says this first public batch covers text-to-image. Editing capability should be evaluated separately when the public route is documented."
      }
    ],
    codeSamples: samples(
      "qwen-image-max",
      "image-generation",
      "A premium product poster for a glass perfume bottle with soft studio lighting"
    ),
    testEvidence: authenticatedEvidence,
    related: ["gpt-image-2-api", "nano-banana-2-api", "ai-api-cost-calculator"]
  },
  {
    kind: "comparison",
    slug: "ai-api-platform-comparison",
    title: "AI API Platform Alternatives for Production Teams | CrazyRouter",
    description:
      "Compare CrazyRouter with fal.ai, WaveSpeed AI, PiAPI, CometAPI, Replicate, AIML API, and Eachlabs for production API work.",
    eyebrow: "Platform Alternatives",
    h1: "AI API platform alternatives",
    intro:
      "AI API platforms overlap, but they are not interchangeable. Use this hub to compare CrazyRouter with creative model marketplaces, broad API aggregators, hosted model platforms, and workflow-first products.",
    primaryKeyword: "ai api alternatives",
    secondaryKeywords: ["fal ai alternative", "replicate alternative", "aiml api alternative", "ai api platform alternatives"],
    cta: "Compare API platforms",
    updatedAt: "2026-06-06",
    intent:
      "Use this hub when you are choosing where production traffic should run after initial model discovery is complete.",
    docsRefs: [
      "crazyrouter-docs/llms-guide.mdx",
      "crazyrouter-docs/api-endpoint.mdx",
      "crazyrouter-docs/ai-tools.mdx"
    ],
    pricingModels: pricingRefs(["gpt-image-2", "veo-3.1", "nano-banana-2", "grok-4-image"]),
    sections: [
      {
        heading: "Quick decision framework",
        body:
          "Discovery-first platforms help you browse providers and model categories. Hosted model platforms help with custom or community models. Workflow-first products help non-developer teams build media pipelines. CrazyRouter is better suited when the next step is shipping an integration with one API base, Bearer authentication, pricing rows, endpoint mappings, and usage records."
      },
      {
        heading: "One-page alternatives",
        body:
          "Each platform below deserves its own decision page because the reason to switch is different. Start with the closest current provider, then compare the model rows and endpoint paths against your real workload.",
        bullets: [
          "fal.ai: compare marketplace-style generative media access with a production gateway.",
          "WaveSpeed AI: compare broad creative model access with documented API pricing and records.",
          "PiAPI: compare model-specific creative task APIs with supported CrazyRouter routes.",
          "CometAPI: compare broad AI API access with a narrower documented production workflow.",
          "Replicate: compare hosted model execution with a gateway for selected commercial APIs.",
          "AIML API: compare broad OpenAI-compatible access with model-specific pricing visibility.",
          "Eachlabs: compare workflow-first orchestration with direct developer-owned API calls."
        ]
      },
      {
        heading: "Where CrazyRouter fits",
        body:
          "CrazyRouter should be evaluated when the buyer already knows the workload they want to run: image generation, video generation, chat, embeddings, or a fallback chain. API calls use https://cn.crazyrouter.com; account login, recharge, console, and usage records use https://crazyrouter.com.",
        bullets: [
          "Pricing truth source: GET https://cn.crazyrouter.com/api/pricing.",
          "OpenAI-compatible base URL: https://cn.crazyrouter.com/v1.",
          "Model pages link to exact docs files and endpoint types.",
          "Cost planning uses actual model rows rather than generic category estimates."
        ]
      },
      {
        heading: "Evaluation workflow",
        body:
          "Pick one workload, copy the standard model name, confirm the endpoint, estimate monthly spend, then run a small request set with your CrazyRouter API key. For image work, start with gpt-image-2, qwen-image-max, or nano-banana-2. For video work, start with veo-3.1-fast."
      }
    ],
    faqs: [],
    testEvidence: authenticatedEvidence,
    related: ["fal-ai-alternative", "replicate-alternative", "aimlapi-alternative", "ai-api-cost-calculator"]
  },
  ...competitorAlternativePages,
  {
    kind: "tool",
    slug: "ai-api-cost-calculator",
    title: "AI API Cost Calculator with CrazyRouter Pricing | CrazyRouter",
    description:
      "Estimate image and video API costs using CrazyRouter Pricing page model rows for gpt-image-2, Veo, Nano Banana, Grok, and Qwen Image.",
    eyebrow: "Interactive Tool",
    h1: "AI API cost calculator",
    intro:
      "Estimate image and video API cost from CrazyRouter's current pricing catalog. Adjust usage, retry rate, fallback share, and accepted-output rate to see how monthly spend changes.",
    primaryKeyword: "ai api cost calculator",
    secondaryKeywords: ["openai api price calculator", "video api cost calculator", "image api pricing calculator"],
    cta: "Estimate model cost",
    updatedAt: "2026-06-06",
    intent:
      "Use this before paid generation tests to estimate budget and cost per accepted output for real image, video, or fallback-model workflows.",
    docsRefs: [
      "crazyrouter-docs/reference/official-pricing-methods.mdx",
      "crazyrouter-docs/llms-guide.mdx",
      "crazyrouter-docs/ai-tools.mdx"
    ],
    pricingModels: pricingRefs([...imageModels, ...videoModels]),
    sections: [
      {
        heading: "What the calculator measures",
        body:
          "The calculator estimates billable units after retries, splits part of traffic to a fallback model, and computes cost per accepted output. It is useful before running a paid generation test, but final billing should still be checked against the console and consumption logs."
      },
      {
        heading: "Pricing source",
        body:
          "Every preset comes from GET https://cn.crazyrouter.com/api/pricing. For final billing, check the CrazyRouter console and consumption logs at https://crazyrouter.com."
      }
    ],
    faqs: [
      commonFaqs.pricingTruth,
      {
        question: "Why does accepted-output cost differ from request cost?",
        answer:
          "Retries, failed generations, and rejected outputs all change the true production cost. Accepted-output cost divides total estimated spend by outputs your team actually keeps."
      }
    ],
    testEvidence: authenticatedEvidence,
    related: ["gpt-image-2-api", "veo-3-1-api", "nano-banana-2-api"],
    calculatorPresets: [
      preset("gpt-image-2", "GPT Image 2", "images", 1000),
      preset("nano-banana-2", "Nano Banana 2", "images", 1000),
      preset("grok-4-image", "Grok 4 Image", "images", 1000),
      preset("qwen-image-max", "Qwen Image Max", "images", 1000),
      preset("veo-3.1-fast", "Veo 3.1 Fast", "seconds", 800),
      preset("veo-3.1", "Veo 3.1", "seconds", 800)
    ].filter((item): item is CalculatorPreset => Boolean(item))
  }
];

function preset(
  model: string,
  label: string,
  unitLabel: string,
  defaultUnits: number
): CalculatorPreset | undefined {
  const pricing = getPricingSummary(model);
  const unitPrice = pricing?.unitPrice;

  if (unitPrice === undefined) {
    return undefined;
  }

  return {
    label,
    model,
    unitLabel,
    unitPrice,
    defaultUnits
  };
}

export function getPagePath(page: SeoPage, locale: PageLocale = "en") {
  return locale === "zh" ? `/zh/guide/${page.slug}` : `/guide/${page.slug}`;
}

export function findPageBySlug(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}

export function getPagePricing(page: SeoPage): PricingSummary[] {
  return page.pricingModels
    .map((item) => getPricingSummary(item.model))
    .filter((item): item is PricingSummary => Boolean(item));
}
