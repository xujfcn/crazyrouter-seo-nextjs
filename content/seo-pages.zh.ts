import {
  seoPages,
  type CalculatorPreset,
  type PageSection,
  type SeoPage,
  type TestEvidence
} from "@/content/seo-pages";
import { getPricingSummary } from "@/lib/pricing";

const bySlug = new Map(seoPages.map((page) => [page.slug, page]));

function base(slug: string) {
  const page = bySlug.get(slug);

  if (!page) {
    throw new Error(`Missing English SEO page for ${slug}`);
  }

  return page;
}

function evidence(label: string, result: string, source: TestEvidence): TestEvidence {
  return {
    ...source,
    label,
    result
  };
}

function translateEvidence(items: TestEvidence[] | undefined): TestEvidence[] | undefined {
  if (!items?.length) {
    return undefined;
  }

  return items.filter((item) => item.status === "200").map((item) => {
    if (item.label === "Pricing API reachable") {
      return evidence("价格 API 返回 200", "已返回当前指南使用的模型价格、端点类型和计费方式。", item);
    }

    if (item.label === "Target models visible to API key") {
      return evidence(
        "模型列表返回 200",
        "已返回目标模型列表，包含本组指南使用的图片与视频模型。",
        item
      );
    }

    return item;
  });
}

function cnPreset(
  presets: CalculatorPreset[] | undefined,
  labels: Record<string, { label: string; unitLabel: string }>
) {
  return presets?.map((preset) => ({
    ...preset,
    label: labels[preset.model]?.label ?? preset.label,
    unitLabel: labels[preset.model]?.unitLabel ?? preset.unitLabel
  }));
}

const presetLabels = {
  "gpt-image-2": { label: "GPT Image 2", unitLabel: "张图片" },
  "nano-banana-2": { label: "Nano Banana 2", unitLabel: "张图片" },
  "grok-4-image": { label: "Grok 4 Image", unitLabel: "张图片" },
  "qwen-image-max": { label: "Qwen Image Max", unitLabel: "张图片" },
  "veo-3.1-fast": { label: "Veo 3.1 Fast", unitLabel: "秒" },
  "veo-3.1": { label: "Veo 3.1", unitLabel: "秒" }
};

function cnDisplayPrice(price: string | undefined) {
  if (!price) {
    return "见价格页";
  }

  return price
    .replace("/image", "/张")
    .replace("/second", "/秒")
    .replace("See Pricing page", "见价格页")
    .replace(/ after ([0-9.]+)x discount/, "（已按 $1 折扣）");
}

function cnAvailabilityBullets(models: string[]) {
  return models.map((model) => {
    const pricing = getPricingSummary(model);
    const endpoints = pricing?.publicEndpointTypes.join(", ") || "见价格页";
    return `${model}：${cnDisplayPrice(pricing?.displayPrice)}；公开端点类型：${endpoints}。`;
  });
}

function page(slug: string, patch: Omit<Partial<SeoPage>, "slug"> & { sections: PageSection[] }): SeoPage {
  const source = base(slug);

  return {
    ...source,
    ...patch,
    slug,
    codeSamples: source.codeSamples,
    testEvidence: translateEvidence(source.testEvidence),
    calculatorPresets: cnPreset(source.calculatorPresets, presetLabels)
  };
}

export const zhSeoPages: SeoPage[] = [
  page("gpt-image-2-api", {
    title: "GPT Image 2 API 中文接入指南 | CrazyRouter",
    description:
      "使用 CrazyRouter 接入 gpt-image-2：包含 OpenAI Images 兼容端点、价格页模型数据、参数限制和可复查的接口证据。",
    eyebrow: "图片 API 指南",
    h1: "GPT Image 2 API 中文接入指南",
    intro:
      "使用 CrazyRouter 调用 gpt-image-2 生成和编辑图片。OpenAI 兼容客户端把 base_url 配置为 https://cn.crazyrouter.com/v1，图片生成请求发送到 /v1/images/generations。",
    primaryKeyword: "gpt-image-2 api",
    secondaryKeywords: ["gpt image api", "openai 图片生成 api", "gpt-image-2 价格"],
    cta: "创建 API Key",
    intent:
      "适合正在把图片生成接入到后端服务、自动化脚本或内部工具的开发者。你可以在这里确认模型名、生成端点、常用参数、价格口径和最小可运行示例。",
    sections: [
      {
        heading: "接入前先确认三件事",
        body:
          "gpt-image-2 走 OpenAI Images 兼容接口。新接入时先固定模型名、Base URL 和生成端点，再根据业务需要增加 size、quality、output_format 等参数。",
        bullets: [
          "模型名：gpt-image-2。",
          "OpenAI 兼容 Base URL：https://cn.crazyrouter.com/v1。",
          "图片生成端点：POST https://cn.crazyrouter.com/v1/images/generations。"
        ]
      },
      {
        heading: "生成图片的推荐请求方式",
        body:
          "最小请求只需要 model、prompt 和 n。需要控制尺寸时使用 size；需要控制质量时使用 quality；需要指定文件格式时使用 output_format。响应默认从 data[0].url 读取图片地址。",
        bullets: [
          "size 可使用 auto 或宽x高，例如 1024x1024、1536x1024、1024x1536。",
          "quality 可使用 auto、low、medium、high；旧客户端传 standard 时服务端会归一为 auto。",
          "output_format 可使用 png、jpeg 或 webp；如果要压缩 jpeg/webp，再配合 output_compression。"
        ]
      },
      {
        heading: "编辑图片和多图参考",
        body:
          "如果要编辑已有图片，使用 POST /v1/images/edits，并用 multipart/form-data 上传 image 或 image[]。gpt-image-2 最多支持 16 张参考图，适合做局部编辑、风格参考和多图融合。"
      }
    ],
    faqs: [
      {
        question: "这些价格来自哪里？",
        answer:
          "价格卡片来自 CrazyRouter 价格页对应的 GET https://cn.crazyrouter.com/api/pricing 快照，用来展示当前公开模型名、端点类型和计费方式。"
      },
      {
        question: "OpenAI SDK 应该配置哪个 Base URL？",
        answer: "OpenAI 兼容 SDK 使用 https://cn.crazyrouter.com/v1；手写 cURL 使用完整路径，例如 https://cn.crazyrouter.com/v1/images/generations。"
      },
      {
        question: "gpt-image-2 可以直接使用 size 和 quality 吗？",
        answer:
          "可以。当前 GPT Image 文档支持 size 和 quality。size 可以是 auto 或符合限制的宽x高；quality 可以是 auto、low、medium、high，旧客户端传 standard 时会被归一为 auto。"
      }
    ]
  }),
  page("veo-3-1-api", {
    title: "Veo 3.1 API 中文接入指南 | CrazyRouter",
    description: "使用 CrazyRouter 接入 veo-3.1-fast 和 veo-3.1，包含统一视频端点、按秒计费和接口检查证据。",
    eyebrow: "视频 API 指南",
    h1: "Veo 3.1 API 中文接入指南",
    intro:
      "通过 CrazyRouter 统一视频 API 调用当前公开的 Veo 3.1 视频模型：veo-3.1-fast 和 veo-3.1。创建与查询任务都使用 https://cn.crazyrouter.com。",
    primaryKeyword: "veo 3.1 api",
    secondaryKeywords: ["veo api", "google veo api", "veo 3.1 价格"],
    cta: "测试 Veo 3.1",
    intent:
      "评估视频 API 的团队需要知道公开模型别名、创建任务路径、查询方式、按秒计费，以及 fast 和 quality 路线如何选择。",
    sections: [
      {
        heading: "可用模型和计费方式",
        body:
          "当前价格目录返回 veo-3.1-fast 和 veo-3.1，公开端点类型为 unified-video，计费方式为按生成秒数计费。",
        bullets: cnAvailabilityBullets(["veo-3.1-fast", "veo-3.1"])
      },
      {
        heading: "当前公开调用约定",
        body:
          "当前 Veo 文档主要覆盖文生视频和单图生视频。参考素材、首尾帧、带音频和 4K 等扩展能力，请在接入前核对最新 Veo 文档和价格规则。",
        bullets: [
          "创建任务：POST https://cn.crazyrouter.com/v1/video/create。",
          "查询任务：GET https://cn.crazyrouter.com/v1/video/query?id={task_id}。",
          "首次测试建议：一个文本提示词、16:9、720P、短时长。"
        ]
      },
      {
        heading: "Fast 与质量路线选择",
        body:
          "需要更快返回时先测 veo-3.1-fast；更重视输出质量且能接受更高成本或更长时延时，再测试 veo-3.1。"
      }
    ],
    faqs: [
      {
        question: "Veo 是按请求计费还是按生成秒数计费？",
        answer:
          "当前价格 API 将 veo-3.1-fast 和 veo-3.1 标记为 per_second 模型，本站成本计算器也按秒作为默认输入。"
      },
      {
        question: "不带 API key 可以测试吗？",
        answer:
          "可以先查看公开价格接口；创建视频任务前需要在 https://crazyrouter.com 创建 API Key，并在请求里传入 Bearer 认证。"
      },
      {
        question: "当前指南包含哪些视频模型？",
        answer:
          "当前视频指南覆盖 veo-3.1-fast 和 veo-3.1，并按价格页的 unified-video 与 per_second 计费口径展示。"
      }
    ]
  }),
  page("nano-banana-2-api", {
    title: "Nano Banana 2 API 中文接入指南 | CrazyRouter",
    description: "使用 CrazyRouter 的 OpenAI Images 兼容接口接入 nano-banana-2，并查看价格页模型行和参数规则。",
    eyebrow: "图片 API 指南",
    h1: "Nano Banana 2 API 中文接入指南",
    intro:
      "Nano Banana 2 在 CrazyRouter 中使用标准模型名 nano-banana-2，并通过 OpenAI Images 兼容的 /v1/images/generations 接入。",
    primaryKeyword: "nano banana 2 api",
    secondaryKeywords: ["nano banana api", "gemini 图片 api", "nano-banana-2 价格"],
    cta: "测试 Nano Banana 2",
    intent:
      "评估 Gemini 图片路线的团队需要明确公开模型别名、图片生成路径、参考图参数和按图计费假设。",
    sections: [
      {
        heading: "可用模型和计费方式",
        body:
          "Nano Banana 系列在价格目录中提供多个模型行。新接入建议优先使用 nano-banana-2，再按输出质量、成本和参考图需求比较其他同系列模型。",
        bullets: cnAvailabilityBullets(["nano-banana-2", "nano-banana-pro", "nano-banana"])
      },
      {
        heading: "请求字段",
        body:
          "使用 POST /v1/images/generations，model 为 nano-banana-2。公开参数包含 prompt、image_input、resolution、aspect_ratio、output_format、output_compression 和 n，不要直接传 Gemini 原生字段。",
        bullets: [
          "文生图：不传 image_input。",
          "参考图编辑：在 image_input 中传一个或多个图片 URL。",
          "按下游需求选择 png、jpeg 或 jpg 输出格式。"
        ]
      },
      {
        heading: "接入建议",
        body:
          "先用 1 张图片和 1K 分辨率验证输出，再逐步增加参考图、分辨率和输出格式。需要管理账号、充值或查看消费记录时进入 https://crazyrouter.com。"
      }
    ],
    faqs: [
      {
        question: "Nano Banana 2 应该调用 Gemini 原生 generateContent 吗？",
        answer:
          "CrazyRouter 当前公开约定建议从 POST /v1/images/generations 开始，供应商原生字段转换由网关侧处理。"
      },
      {
        question: "能否用参考图？",
        answer:
          "可以按文档把图片 URL 放入 image_input，但应先用少量参考图做计费和输出稳定性验证。"
      }
    ]
  }),
  page("grok-4-image-api", {
    title: "Grok 4 Image API 中文接入指南 | CrazyRouter",
    description: "使用 CrazyRouter 接入 grok-4-image，查看 OpenAI Images 兼容端点、价格行和 Grok 专属参数限制。",
    eyebrow: "图片 API 指南",
    h1: "Grok 4 Image API 中文接入指南",
    intro:
      "使用 CrazyRouter 接入标准模型名 grok-4-image，通过 OpenAI Images 兼容端点生成图片，并按 Grok 图片模型的参数边界发起请求。",
    primaryKeyword: "grok 4 image api",
    secondaryKeywords: ["grok 图片 api", "xai 图片 api", "grok-4-image 价格"],
    cta: "测试 Grok 图片生成",
    intent:
      "开发者在比较图片 API 时，需要先知道 Grok 图片模型有哪些不同参数，避免直接复制通用 OpenAI Images 请求体导致失败。",
    sections: [
      {
        heading: "可用模型和计费方式",
        body:
          "当前价格目录中 grok-4-image 对客户公开 image-generation 端点。实际费用以 CrazyRouter 价格页、控制台和消费日志为准。",
        bullets: cnAvailabilityBullets(["grok-4-image"])
      },
      {
        heading: "Grok 专属参数",
        body:
          "文档提示 Grok 图片模型不要传 size、quality 或 style。应使用 aspect_ratio 和 resolution，并从 n=1 开始控制成本。",
        bullets: [
          "推荐 response_format 使用 url。",
          "aspect_ratio 可用 1:1、16:9、9:16、3:2 或 auto。",
          "resolution 可用 1k 或 2k。"
        ]
      },
      {
        heading: "评估流程",
        body:
          "建议把 Grok 4 Image 与 GPT Image 2、Qwen Image 放在同一提示词集下比较，关注提示词遵循度、有效输出率、临时 URL 处理和失败后的真实成本。"
      }
    ],
    faqs: [
      {
        question: "grok-4-image 可以使用 size=1024x1024 吗？",
        answer:
          "不建议。Grok 图片文档说明 size 不支持，应使用 aspect_ratio 和 resolution。"
      },
      {
        question: "价格从哪里读取？",
        answer:
          "价格卡片来自 GET https://cn.crazyrouter.com/api/pricing，并展示公开端点类型、支持端点类型和当前计费口径。"
      }
    ]
  }),
  page("qwen-image-api", {
    title: "Qwen Image API 中文接入指南 | CrazyRouter",
    description: "使用 CrazyRouter 接入 qwen-image-plus、qwen-image-max 和 qwen-image-2.0 的 OpenAI Images 兼容 API。",
    eyebrow: "图片 API 指南",
    h1: "Qwen Image API 中文接入指南",
    intro:
      "Qwen Image 是一个模型族页面，覆盖 CrazyRouter 价格 API 当前返回的三个 Qwen 图片模型。",
    primaryKeyword: "qwen image api",
    secondaryKeywords: ["qwen-image-plus api", "qwen-image-max api", "qwen-image-2.0 api"],
    cta: "测试 Qwen Image API",
    intent:
      "搜索 Qwen Image API 的开发者需要确认客户侧标准模型名、图片生成端点、Base URL 和最小可运行请求。",
    sections: [
      {
        heading: "可用模型和计费方式",
        body:
          "当前 Qwen Image 接入使用价格目录公开的模型：qwen-image-plus、qwen-image-max 和 qwen-image-2.0。",
        bullets: cnAvailabilityBullets(["qwen-image-plus", "qwen-image-max", "qwen-image-2.0"])
      },
      {
        heading: "客户侧协议",
        body:
          "CrazyRouter 通过 OpenAI Images 兼容的 POST /v1/images/generations 路由暴露这些 Qwen Image 模型。供应商侧同步或异步执行由网关处理。",
        bullets: [
          "质量优先的文生图基线可先测 qwen-image-max。",
          "标准请求先使用 size 和 n。",
          "response_format 只在 Qwen 文档允许 url 或 b64_json 时使用。"
        ]
      },
      {
        heading: "何时比较 Qwen Image",
        body:
          "当业务包含中文提示词、海报式构图或需要阿里系图片生成路线时，Qwen Image 值得纳入同一评估集。"
      }
    ],
    faqs: [
      {
        question: "当前包含 Qwen 图片编辑吗？",
        answer:
          "当前 Qwen Image 文档聚焦文生图。图片编辑能力应等对应公开能力和参数说明明确后再接入。"
      },
      {
        question: "Base URL 是什么？",
        answer:
          "OpenAI 兼容 SDK 使用 https://cn.crazyrouter.com/v1。"
      }
    ]
  }),
  page("ai-api-platform-comparison", {
    title: "AI API 平台对比：CrazyRouter、Apimart、OpenRouter、AIML API | CrazyRouter",
    description: "比较 CrazyRouter 与 Apimart.ai、OpenRouter、AIML API、Requesty、Eden AI、Replicate 等 AI API 平台的适用场景。",
    eyebrow: "平台对比",
    h1: "AI API 平台对比",
    intro:
      "选择 AI API 平台时，不只是比较某一家竞品。更重要的是判断你处在哪个阶段：浏览 API、路由大量 LLM、聚合多家供应商，还是把真实生产请求放到可计费、可观测、文档清晰的 API 网关后面。",
    primaryKeyword: "ai api 平台对比",
    secondaryKeywords: ["apimart 替代", "openrouter 替代", "aiml api 替代", "ai api 市场"],
    cta: "比较 API 平台",
    intent:
      "适合已经看过多个 AI API 平台，正在决定生产流量应该接入哪一层网关的开发者和团队。",
    sections: [
      {
        heading: "先按使用阶段判断",
        body:
          "发现阶段需要能快速浏览供应商、模型类别和 API 能力；生产阶段更需要稳定 Base URL、一致认证、端点级示例、价格可见、控制台账单和消费日志。CrazyRouter 更偏后者。"
      },
      {
        heading: "主要平台怎么区分",
        body:
          "这些平台并不是同一个定位。把它们放在一起看，能更清楚地区分发现市场、模型路由、多供应商聚合和生产 API 网关。",
        bullets: [
          "Apimart.ai：更适合先浏览 API 品类和发现可用服务。",
          "OpenRouter：更适合通过 OpenAI 兼容接口路由大量 LLM。",
          "AIML API：更适合用一个 API 面覆盖较多模型和多模态能力。",
          "Requesty：更偏 AI gateway，关注路由、观测、密钥和成本控制。",
          "Eden AI：更偏多供应商聚合和工作流型 AI 能力接入。",
          "Replicate：更适合运行托管的社区模型和开源模型。"
        ]
      },
      {
        heading: "CrazyRouter 适合什么场景",
        body:
          "当你已经明确要接入图片、视频、聊天、Embedding 或兜底链路时，CrazyRouter 的价值在于把标准模型名、端点、价格、文档和消费记录放到同一套接入流程中。API 请求使用 https://cn.crazyrouter.com；账号登录、充值、控制台和消费记录使用 https://crazyrouter.com。",
        bullets: [
          "价格来源：GET https://cn.crazyrouter.com/api/pricing。",
          "OpenAI 兼容 Base URL：https://cn.crazyrouter.com/v1。",
          "模型页链接到具体 CrazyRouter 文档和 endpoint type。",
          "成本估算使用真实模型行，不使用泛化类别价格。"
        ]
      },
      {
        heading: "推荐评估流程",
        body:
          "先选一个真实工作负载，再选择平台。图片生成可以从 gpt-image-2、qwen-image-max 或 nano-banana-2 开始；视频生成可以从 veo-3.1-fast 开始。复制标准模型名，核对端点和价格，再用成本计算器估算月费用。"
      }
    ],
    faqs: [
      {
        question: "这里是否比较各平台流量高低？",
        answer:
          "不比较。流量判断需要第三方分析或 Search Console 数据。这里比较的是平台定位、API 接入方式、价格可见性和生产工作流。"
      },
      {
        question: "为什么不单独保留 Apimart.ai 替代页？",
        answer:
          "Apimart.ai 只是发现型平台中的一个例子。对正在选型的开发者来说，把 Apimart.ai、OpenRouter、AIML API、Requesty、Eden AI、Replicate 与 CrazyRouter 放在同一张决策框架里更有帮助。"
      }
    ]
  }),
  page("ai-api-cost-calculator", {
    title: "AI API 成本计算器：基于 CrazyRouter 价格页 | CrazyRouter",
    description: "使用 CrazyRouter 价格页模型行估算 gpt-image-2、Veo、Nano Banana、Grok 和 Qwen Image 的图片与视频 API 成本。",
    eyebrow: "交互工具",
    h1: "AI API 成本计算器",
    intro:
      "用 CrazyRouter 当前价格目录估算图片与视频 API 成本。你可以调整请求用量、重试率、兜底占比和有效产出率，快速看到月度预算变化。",
    primaryKeyword: "ai api 成本计算器",
    secondaryKeywords: ["openai api 价格计算器", "视频 api 成本计算器", "图片 api 价格计算器"],
    cta: "估算模型成本",
    intent:
      "适合正在规划图片、视频或多模型兜底方案的团队，用来在实际付费生成前估算预算和单个有效产出的成本。",
    sections: [
      {
        heading: "计算器衡量什么",
        body:
          "计算器会把重试后的计费用量、兜底模型流量和有效产出率合并估算。它适合在付费生成测试前做预算，最终账单仍应以控制台和消费日志为准。"
      },
      {
        heading: "价格来源",
        body:
          "每个预设都来自 GET https://cn.crazyrouter.com/api/pricing 的价格目录。图片和视频模型优先使用已验证或当前可用的公开计费规则；最终账单仍以 https://crazyrouter.com 控制台和消费日志为准。"
      }
    ],
    faqs: [
      {
        question: "为什么有效产出成本不同于请求成本？",
        answer:
          "重试、失败生成和被业务拒收的结果都会改变真实生产成本。有效产出成本会把总预估费用除以团队实际保留的输出数量。"
      },
      {
        question: "计算器包含哪些模型？",
        answer:
          "当前中文计算器包含 gpt-image-2、nano-banana-2、grok-4-image、qwen-image-max、veo-3.1-fast 和 veo-3.1。"
      }
    ]
  })
];

export function findZhPageBySlug(slug: string) {
  return zhSeoPages.find((page) => page.slug === slug);
}
