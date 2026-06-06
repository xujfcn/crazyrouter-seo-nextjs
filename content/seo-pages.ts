import { getEndpointPath, getPricingSummary, type PricingSummary } from "@/lib/pricing";

export type PageKind = "model" | "comparison" | "alternative" | "tool";

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
  },
  {
    label: "Model list requires a token",
    method: "GET",
    url: `${apiBase}/v1/models`,
    status: "401",
    result: "Confirmed protected model availability checks require Authorization: Bearer YOUR_API_KEY."
  },
  {
    label: "Chat completions rejects GET",
    method: "GET",
    url: `${apiBase}/v1/chat/completions`,
    status: "404",
    result: "Confirmed hand-written HTTP calls must use the documented POST method."
  }
];

const protectedPostEvidence: TestEvidence[] = [
  {
    label: "Image generation endpoint requires a token",
    method: "POST",
    url: `${openAiBase}/images/generations`,
    status: "401",
    result: "Endpoint exists and enforces Bearer auth before accepting generation payloads."
  },
  {
    label: "Video creation endpoint requires a token",
    method: "POST",
    url: `${openAiBase}/video/create`,
    status: "401",
    result: "Endpoint exists and enforces Bearer auth before accepting video jobs."
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
      "You can test the public pricing endpoint without a key. Actual model calls and GET /v1/models require Authorization: Bearer YOUR_API_KEY, so production validation must use a CrazyRouter API key."
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

export const seoPages: SeoPage[] = [
  {
    kind: "model",
    slug: "gpt-image-2-api",
    title: "GPT Image 2 API Guide | CrazyRouter",
    description:
      "Build with gpt-image-2 on CrazyRouter using OpenAI Images-compatible endpoints, Pricing page model data, and docs-aligned parameters.",
    eyebrow: "Image API Guide",
    h1: "GPT Image 2 API guide",
    intro:
      "GPT Image pages now target gpt-image-2 because that is the model returned by the CrazyRouter Pricing API. This page does not use the removed gpt-image-1 SEO target.",
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
        heading: "Pricing page alignment",
        body:
          "The live Pricing API contains gpt-image-2 with image-generation as its public endpoint type. This is the model name used in code, metadata, internal links, and sitemap URLs.",
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
        heading: "Useful feature surface",
        body:
          "This page is functional for implementation planning: it exposes the current pricing row, endpoint mapping, cURL/Python examples, and a related cost calculator that uses the same pricing snapshot."
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
    testEvidence: [...authenticatedEvidence, protectedPostEvidence[0]],
    related: ["nano-banana-2-api", "grok-4-image-api", "ai-api-cost-calculator"]
  },
  {
    kind: "model",
    slug: "veo-3-1-api",
    title: "Veo 3.1 API Guide with Fast and Quality Models | CrazyRouter",
    description:
      "Use veo-3.1-fast and veo-3.1 through CrazyRouter's unified video API with pricing snapshot data and docs-aligned request examples.",
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
        heading: "Pricing page alignment",
        body:
          "The current Pricing API returns veo-3.1-fast and veo-3.1 with public_endpoint_types set to unified-video and billing mode per_second.",
        bullets: availabilityBullets(veoModels)
      },
      {
        heading: "Current public contract",
        body:
          "The docs currently cover text-to-video and single-image-to-video at the customer contract level. Reference assets, start/end frames, audio-enabled rows, and 4K are present in pricing details as beta or provider capabilities, but should not be promised as the default public route until verification is closed.",
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
    testEvidence: [...authenticatedEvidence, protectedPostEvidence[1]],
    related: ["gpt-image-2-api", "ai-api-cost-calculator", "crazyrouter-vs-apimart"]
  },
  {
    kind: "model",
    slug: "nano-banana-2-api",
    title: "Nano Banana 2 API Guide | CrazyRouter",
    description:
      "Use nano-banana-2 through CrazyRouter's OpenAI Images-compatible API with live Pricing page data and docs-aligned image parameters.",
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
        heading: "Pricing page alignment",
        body:
          "The Nano Banana family is present in the Pricing API, but this page's primary SEO target is nano-banana-2 because the docs identify it as the recommended current image path.",
        bullets: availabilityBullets(["nano-banana-2", "nano-banana-pro", "nano-banana"])
      },
      {
        heading: "Docs-aligned request fields",
        body:
          "Use POST /v1/images/generations with model nano-banana-2. The public parameters are prompt, image_input, resolution, aspect_ratio, output_format, output_compression, and n. Do not pass Gemini-native fields such as generationConfig or imageOutputOptions.",
        bullets: [
          "Text-to-image: omit image_input.",
          "Reference image edit: pass one or more image URLs in image_input.",
          "Use output_format png, jpeg, or jpg depending on downstream needs."
        ]
      },
      {
        heading: "Functional use on this SEO page",
        body:
          "The page includes pricing-row cards, endpoint evidence, code samples, and an internal link to the calculator with Nano Banana 2 as a preset."
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
    testEvidence: [...authenticatedEvidence, protectedPostEvidence[0]],
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
      "This page targets grok-4-image because it appears in the live CrazyRouter Pricing API and uses image-generation as the public endpoint type.",
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
        heading: "Pricing page alignment",
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
    testEvidence: [...authenticatedEvidence, protectedPostEvidence[0]],
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
      "Qwen Image is a model-family page built around the three Qwen image rows currently returned by CrazyRouter's Pricing API.",
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
        heading: "Pricing page alignment",
        body:
          "The page uses only Qwen Image models currently exposed in Pricing: qwen-image-plus, qwen-image-max, and qwen-image-2.0.",
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
        question: "Does this page cover Qwen image editing?",
        answer:
          "No. The Qwen docs page says this first public batch covers text-to-image. Editing capability should be evaluated separately when the public route is documented."
      }
    ],
    codeSamples: samples(
      "qwen-image-max",
      "image-generation",
      "A premium product poster for a glass perfume bottle with soft studio lighting"
    ),
    testEvidence: [...authenticatedEvidence, protectedPostEvidence[0]],
    related: ["gpt-image-2-api", "nano-banana-2-api", "ai-api-cost-calculator"]
  },
  {
    kind: "comparison",
    slug: "crazyrouter-vs-apimart",
    title: "CrazyRouter vs Apimart.ai | AI API Platform Comparison",
    description:
      "Compare CrazyRouter and Apimart.ai for AI API discovery, production routing, pricing data, and developer integration workflow.",
    eyebrow: "Competitor Comparison",
    h1: "CrazyRouter vs Apimart.ai",
    intro:
      "This comparison is written for teams that started with AI API discovery and now need a production integration path. It avoids unverifiable traffic claims and focuses on the product decision: marketplace-style discovery versus docs-aligned API routing.",
    primaryKeyword: "crazyrouter vs apimart",
    secondaryKeywords: ["apimart alternative", "apimart.ai alternative", "ai api marketplace"],
    cta: "Compare production routing",
    updatedAt: "2026-06-06",
    intent:
      "People searching this comparison are usually deciding whether to browse API options or standardize one operational gateway for model calls.",
    docsRefs: [
      "crazyrouter-docs/llms-guide.mdx",
      "crazyrouter-docs/api-endpoint.mdx",
      "crazyrouter-docs/ai-tools.mdx"
    ],
    pricingModels: pricingRefs(["gpt-image-2", "veo-3.1", "nano-banana-2", "grok-4-image"]),
    sections: [
      {
        heading: "Short decision",
        body:
          "Use Apimart.ai-style discovery when the job is browsing available APIs. Use CrazyRouter when the job is production integration: one base URL, bearer auth, pricing rows, endpoint types, logs, and model-specific documentation."
      },
      {
        heading: "What CrazyRouter can prove on-page",
        body:
          "The strongest comparison angle is not a vague feature checklist. It is direct operational evidence: public pricing API, endpoint mappings, docs-backed model guides, and testable cURL examples under the same /guide path.",
        bullets: [
          "Pricing truth source: GET https://cn.crazyrouter.com/api/pricing.",
          "OpenAI-compatible base URL: https://cn.crazyrouter.com/v1.",
          "Model pages link to exact docs files and endpoint types.",
          "The calculator uses actual model rows, not placeholder unit prices."
        ]
      },
      {
        heading: "Where this page should convert",
        body:
          "A comparison page should send users into a concrete next step: choose one model guide, verify the endpoint, estimate monthly cost, then create an API key on the main CrazyRouter site."
      }
    ],
    faqs: [
      {
        question: "Is this page claiming CrazyRouter has more traffic than Apimart.ai?",
        answer:
          "No. Traffic claims require third-party analytics or search-console data that is not available inside this project. This page positions CrazyRouter as a production API-routing alternative using verifiable product facts."
      },
      {
        question: "What internal links should support this competitor page?",
        answer:
          "Link from model guides, the cost calculator, the Apimart alternative page, and any AI API marketplace content hub. Keep all SEO routes under /guide to avoid conflicts."
      }
    ],
    testEvidence: authenticatedEvidence,
    related: ["apimart-ai-alternative", "ai-api-cost-calculator", "gpt-image-2-api"]
  },
  {
    kind: "alternative",
    slug: "apimart-ai-alternative",
    title: "Apimart.ai Alternative for Production AI APIs | CrazyRouter",
    description:
      "Looking for an Apimart.ai alternative? Compare CrazyRouter for production AI API routing, pricing visibility, and docs-backed model integration.",
    eyebrow: "Alternative Page",
    h1: "A production-focused Apimart.ai alternative",
    intro:
      "If Apimart.ai helped you think about API discovery, CrazyRouter should help with the next job: putting image, video, and chat model calls behind one documented production API layer.",
    primaryKeyword: "apimart alternative",
    secondaryKeywords: ["apimart.ai alternative", "best apimart alternatives", "ai api marketplace alternative"],
    cta: "Evaluate CrazyRouter",
    updatedAt: "2026-06-06",
    intent:
      "Searchers looking for an Apimart alternative want criteria, a practical migration path, and proof that the alternative can handle real API work.",
    docsRefs: [
      "crazyrouter-docs/api-endpoint.mdx",
      "crazyrouter-docs/authentication.mdx",
      "crazyrouter-docs/llms-guide.mdx"
    ],
    pricingModels: pricingRefs(["gpt-image-2", "veo-3.1-fast", "qwen-image-max", "nano-banana-2"]),
    sections: [
      {
        heading: "Why teams look beyond an API marketplace",
        body:
          "Discovery is useful early, but production teams need a stable base URL, consistent authentication, endpoint-specific examples, pricing data they can automate against, and a path for model comparison without rewriting every integration."
      },
      {
        heading: "Migration path",
        body:
          "Do not migrate every workload at once. Pick one model family, confirm it exists in Pricing, run GET /v1/models with your key, make one POST request, and log cost, latency, and failure class.",
        bullets: [
          "Start with gpt-image-2 or qwen-image-max for image tests.",
          "Start with veo-3.1-fast for short video tests.",
          "Use the calculator to model accepted-output cost before moving production volume."
        ]
      },
      {
        heading: "Path architecture",
        body:
          "This SEO project deliberately uses /guide/* for competitor, model, and calculator pages. That keeps it separate from existing tool routes such as /tools/pricing-calculator and /tools/model-comparison."
      }
    ],
    faqs: [
      commonFaqs.pricingTruth,
      commonFaqs.baseUrl,
      {
        question: "Who is CrazyRouter best for?",
        answer:
          "CrazyRouter is best for developers and teams that want one integration layer across supported models, with pricing visibility and docs-backed endpoint behavior."
      }
    ],
    testEvidence: authenticatedEvidence,
    related: ["crazyrouter-vs-apimart", "gpt-image-2-api", "ai-api-cost-calculator"]
  },
  {
    kind: "tool",
    slug: "ai-api-cost-calculator",
    title: "AI API Cost Calculator with CrazyRouter Pricing | CrazyRouter",
    description:
      "Estimate image and video API costs using CrazyRouter Pricing page model rows for gpt-image-2, Veo, Nano Banana, Grok, and Qwen Image.",
    eyebrow: "Interactive Tool",
    h1: "AI API cost calculator",
    intro:
      "This is a real calculator page, not a placeholder. Presets are generated from the same Pricing API snapshot used by the model guides, and the controls estimate request units, retries, fallback share, and accepted-output cost.",
    primaryKeyword: "ai api cost calculator",
    secondaryKeywords: ["openai api price calculator", "video api cost calculator", "image api pricing calculator"],
    cta: "Estimate model cost",
    updatedAt: "2026-06-06",
    intent:
      "Users searching for an API cost calculator are usually budgeting a real integration. The page should give them an immediate number and link to model-specific implementation guides.",
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
          "Every preset comes from the committed Pricing API snapshot. For image and video models that expose detailed rule rows, the preset uses a verified or first available platform_base_price row. For simple per-request rows, it uses model_price and discount where applicable."
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

export function getPagePath(page: SeoPage) {
  return `/guide/${page.slug}`;
}

export function findPageBySlug(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}

export function getPagePricing(page: SeoPage): PricingSummary[] {
  return page.pricingModels
    .map((item) => getPricingSummary(item.model))
    .filter((item): item is PricingSummary => Boolean(item));
}
