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

const competitorRelated = [
  "fal-ai-alternative",
  "wavespeed-ai-alternative",
  "piapi-alternative",
  "cometapi-alternative",
  "replicate-alternative",
  "aimlapi-alternative",
  "eachlabs-alternative"
];

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
    title: "AI API 平台替代方案：CrazyRouter 与主流平台对比 | CrazyRouter",
    description:
      "比较 CrazyRouter 与 fal.ai、WaveSpeed AI、PiAPI、CometAPI、Replicate、AIML API、Eachlabs 在生产 API 接入中的差异。",
    eyebrow: "平台替代方案",
    h1: "AI API 平台替代方案",
    intro:
      "AI API 平台看起来都能接入模型，但实际定位不同。有的平台适合发现模型，有的平台适合托管社区模型，有的平台偏工作流编排。CrazyRouter 更适合把已经确定的图片、视频、聊天或 Embedding 请求接入到清晰的生产 API 网关。",
    primaryKeyword: "ai api 替代方案",
    secondaryKeywords: ["fal ai 替代", "replicate 替代", "aiml api 替代", "ai api 平台"],
    cta: "查看平台差异",
    intent:
      "适合已经看过多个 AI API 平台，正在决定后端生产请求应该接入哪一层网关的开发者和团队。",
    sections: [
      {
        heading: "先按工作流判断",
        body:
          "发现阶段需要快速浏览供应商、模型类别和 API 能力；托管阶段需要能部署或运行社区模型；生产阶段更需要稳定 Base URL、一致认证、端点级示例、价格可见、控制台账单和消费日志。CrazyRouter 更偏生产阶段。"
      },
      {
        heading: "按平台逐一比较",
        body:
          "下面这些平台都可以成为选型对象，但每个平台的替代原因不同。建议先打开与当前供应商对应的页面，再用真实模型名、端点和价格行做小批量请求验证。",
        bullets: [
          "fal.ai：从生成式媒体模型市场，转向更稳定的生产 API 网关。",
          "WaveSpeed AI：从宽泛创意模型平台，转向价格与端点更清晰的接入流程。",
          "PiAPI：从模型专属任务 API，转向 CrazyRouter 当前公开支持的图片和视频路线。",
          "CometAPI：从大模型聚合面，转向更容易核对价格和用量的生产接入。",
          "Replicate：从托管社区模型和自定义模型，转向已选定模型的生产 API 调用。",
          "AIML API：从广泛 OpenAI 兼容模型面，转向模型行、价格和端点更明确的网关。",
          "Eachlabs：从工作流编排产品，转向由开发者自己控制的直接 API 集成。"
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
    faqs: [],
    related: competitorRelated
  }),
  page("fal-ai-alternative", {
    title: "fal.ai 替代方案：生产图片与视频 API 接入 | CrazyRouter",
    description:
      "比较 fal.ai 与 CrazyRouter 在生成式媒体 API、标准模型名、价格可见性、端点路径和生产迁移流程上的差异。",
    eyebrow: "平台替代方案",
    h1: "fal.ai 替代方案",
    intro:
      "fal.ai 适合探索生成式媒体模型、使用模型市场和 serverless 模型执行。CrazyRouter 更适合已经进入生产接入阶段的团队：需要标准模型名、固定 API 域名、清晰价格行、控制台账单和消费记录。",
    primaryKeyword: "fal ai 替代",
    secondaryKeywords: ["fal.ai alternative", "fal api 替代", "fal ai 价格"],
    cta: "开始接入 CrazyRouter",
    intent:
      "适合已经确定图片或视频生成工作负载，正在把测试请求迁移到可计费、可复查、可长期维护的 API 网关的团队。",
    sections: [
      {
        heading: "什么时候选择 CrazyRouter",
        body:
          "当你不只是试模型，而是要把图片、视频、聊天或 Embedding 请求接入后端服务时，CrazyRouter 的优势更明显。API 请求使用 https://cn.crazyrouter.com；登录、充值、API Key、控制台和消费记录使用 https://crazyrouter.com。",
        bullets: [
          "标准模型名可以直接从价格卡片复制，减少模型别名写错的风险。",
          "图片生成使用 POST https://cn.crazyrouter.com/v1/images/generations。",
          "视频创建使用 CrazyRouter 文档中的视频路径，例如 POST https://cn.crazyrouter.com/v1/video/create。"
        ]
      },
      {
        heading: "fal.ai 仍然适合的场景",
        body:
          "如果你需要 fal.ai 专属模型端点、模型市场原生示例，或自定义 serverless 模型部署，fal.ai 仍然是合适选择。CrazyRouter 不替代所有 fal serverless 场景。"
      },
      {
        heading: "迁移路径",
        body:
          "先迁移一个真实工作负载，不要一次替换全部调用。图片生成可以先测 gpt-image-2、nano-banana-2 或 qwen-image-max；视频生成可以先测 veo-3.1-fast。完成小批量请求后，再用控制台消费记录核对有效产出成本。",
        bullets: cnAvailabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "veo-3.1-fast"])
      },
      {
        heading: "选择建议",
        body:
          "模型探索、模型市场和自定义 serverless 执行优先选 fal.ai；稳定后端接入、价格可见、标准端点和消费记录优先选 CrazyRouter。"
      }
    ],
    faqs: [],
    related: ["ai-api-platform-comparison", "wavespeed-ai-alternative", "replicate-alternative", "ai-api-cost-calculator"]
  }),
  page("wavespeed-ai-alternative", {
    title: "WaveSpeed AI 替代方案：生产 API 工作流 | CrazyRouter",
    description:
      "比较 WaveSpeed AI 与 CrazyRouter 在图片、视频、多模态模型接入、价格可见性和生产 API 工作流上的差异。",
    eyebrow: "平台替代方案",
    h1: "WaveSpeed AI 替代方案",
    intro:
      "WaveSpeed AI 更偏宽泛创意模型平台和快速生成体验。CrazyRouter 更适合需要把模型调用落到后端生产环境的团队：固定 API 地址、标准模型名、价格行、端点示例和控制台消费记录都要能核对。",
    primaryKeyword: "wavespeed ai 替代",
    secondaryKeywords: ["wavespeed 替代", "wavespeed api 替代", "wavespeed ai 价格"],
    cta: "测试 CrazyRouter API",
    intent:
      "适合从创意生成和模型试用阶段，进入后端 API 接入、预算核算和稳定调用阶段的团队。",
    sections: [
      {
        heading: "什么时候选择 CrazyRouter",
        body:
          "如果你的目标不是浏览最多模型，而是让生产请求稳定运行，CrazyRouter 更直接。模型名、价格、端点和示例代码都围绕同一套接入路径组织，账号侧操作集中在 https://crazyrouter.com。",
        bullets: [
          "API 请求域名固定为 https://cn.crazyrouter.com。",
          "OpenAI 兼容 SDK 使用 https://cn.crazyrouter.com/v1。",
          "价格卡片来自 CrazyRouter 当前价格目录，不用泛化类别价格估算。"
        ]
      },
      {
        heading: "WaveSpeed AI 仍然适合的场景",
        body:
          "如果团队更看重创意模型广度、平台自带工具和特定模型的速度体验，WaveSpeed AI 仍然值得保留在评估列表里。"
      },
      {
        heading: "迁移路径",
        body:
          "先选择一个模型族做验证。图片生成建议从 gpt-image-2、nano-banana-2 或 qwen-image-max 开始；视频生成建议先用 veo-3.1-fast 做短时长任务，再比较 veo-3.1。",
        bullets: cnAvailabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "veo-3.1-fast", "veo-3.1"])
      },
      {
        heading: "选择建议",
        body:
          "创意工具和模型广度优先时继续评估 WaveSpeed AI；端点清晰、账单可复查、生产后端可长期维护时优先评估 CrazyRouter。"
      }
    ],
    faqs: [],
    related: ["ai-api-platform-comparison", "fal-ai-alternative", "eachlabs-alternative", "veo-3-1-api"]
  }),
  page("piapi-alternative", {
    title: "PiAPI 替代方案：稳定图片与视频 API 接入 | CrazyRouter",
    description:
      "比较 PiAPI 与 CrazyRouter 在模型专属任务 API、图片视频生成、标准模型名、价格可见性和迁移路径上的差异。",
    eyebrow: "平台替代方案",
    h1: "PiAPI 替代方案",
    intro:
      "PiAPI 常用于接入 Midjourney、Kling、Suno 等模型或任务型能力。CrazyRouter 更适合当前价格页已公开的图片、视频、聊天和 Embedding 路线，尤其是需要标准模型名、端点示例和消费记录的生产接入。",
    primaryKeyword: "piapi 替代",
    secondaryKeywords: ["piapi ai 替代", "midjourney api 替代", "piapi 价格"],
    cta: "复制模型名测试",
    intent:
      "适合希望减少模型专属任务 API 依赖，把已支持的图片或视频生成调用迁移到更清晰生产网关的团队。",
    sections: [
      {
        heading: "什么时候选择 CrazyRouter",
        body:
          "当你的需求可以映射到 CrazyRouter 当前公开模型时，接入会更容易核对。每个页面都会把模型名、价格行、端点类型和示例代码放在一起，方便工程侧直接落地。",
        bullets: [
          "图片生成使用 POST https://cn.crazyrouter.com/v1/images/generations。",
          "统一视频创建使用 POST https://cn.crazyrouter.com/v1/video/create。",
          "账号、充值、API Key 和消费记录使用 https://crazyrouter.com。"
        ]
      },
      {
        heading: "PiAPI 仍然适合的场景",
        body:
          "如果你的产品依赖 PiAPI 专属的 Midjourney、音乐或其他任务动作，而这些动作不在 CrazyRouter 当前公开价格目录里，应该继续保留原有接入。"
      },
      {
        heading: "迁移路径",
        body:
          "先把现有 PiAPI 调用按图片生成、图片编辑、视频生成、音乐生成和模型专属任务拆开。只迁移 CrazyRouter 已有价格行和文档路径的部分，其他能力等公开模型行明确后再评估。",
        bullets: cnAvailabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "grok-4-image"])
      },
      {
        heading: "选择建议",
        body:
          "模型专属任务能力优先时继续使用 PiAPI；已支持模型的稳定生产调用、价格核对和消费记录优先时使用 CrazyRouter。"
      }
    ],
    faqs: [],
    related: ["ai-api-platform-comparison", "cometapi-alternative", "fal-ai-alternative", "gpt-image-2-api"]
  }),
  page("cometapi-alternative", {
    title: "CometAPI 替代方案：生产 AI API 接入 | CrazyRouter",
    description:
      "比较 CometAPI 与 CrazyRouter 在 AI API 聚合、模型命名、端点清晰度、价格可见性和生产迁移上的差异。",
    eyebrow: "平台替代方案",
    h1: "CometAPI 替代方案",
    intro:
      "CometAPI 更容易被需要广泛模型聚合的团队纳入选型。CrazyRouter 更适合已经确定要跑哪些模型、并希望在生产前核对模型名、端点、价格和消费记录的团队。",
    primaryKeyword: "cometapi 替代",
    secondaryKeywords: ["comet api 替代", "cometapi 价格", "ai api 替代"],
    cta: "查看 CrazyRouter 价格",
    intent:
      "适合需要保留 AI API 聚合能力，同时让核心生产请求具备更清楚价格、端点和账单记录的团队。",
    sections: [
      {
        heading: "什么时候选择 CrazyRouter",
        body:
          "CrazyRouter 的优势在于把生产调用需要的信息放在同一条路径里：复制模型名，确认端点，查看价格行，运行示例请求，再到控制台核对消费。",
        bullets: [
          "价格来源：GET https://cn.crazyrouter.com/api/pricing。",
          "OpenAI 兼容 Base URL：https://cn.crazyrouter.com/v1。",
          "控制台、充值和账单记录：https://crazyrouter.com。"
        ]
      },
      {
        heading: "CometAPI 仍然适合的场景",
        body:
          "如果首要目标是尽可能广的模型目录，CometAPI 仍然有价值。CrazyRouter 更适合其公开模型目录里已经有明确价格和端点的生产工作负载。"
      },
      {
        heading: "迁移路径",
        body:
          "不要先迁移整个模型目录。选一个高频调用路径，找到 CrazyRouter 对应模型名，完成小批量请求，然后比较延迟、成功率和有效产出成本。",
        bullets: cnAvailabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "veo-3.1-fast"])
      },
      {
        heading: "选择建议",
        body:
          "模型目录广度优先时继续评估 CometAPI；模型名、端点、价格和消费记录可复查优先时评估 CrazyRouter。"
      }
    ],
    faqs: [],
    related: ["ai-api-platform-comparison", "aimlapi-alternative", "piapi-alternative", "ai-api-cost-calculator"]
  }),
  page("replicate-alternative", {
    title: "Replicate 替代方案：生产 AI API 网关 | CrazyRouter",
    description:
      "比较 Replicate 与 CrazyRouter 在托管社区模型、自定义模型部署、商业模型 API 接入、价格可见性和生产记录上的差异。",
    eyebrow: "平台替代方案",
    h1: "Replicate 替代方案",
    intro:
      "Replicate 擅长托管社区模型、开源模型和自定义模型部署。CrazyRouter 更适合不需要部署模型、而是要把选定的商业图片、视频、聊天或 Embedding 模型接入生产网关的团队。",
    primaryKeyword: "replicate 替代",
    secondaryKeywords: ["replicate api 替代", "replicate 价格", "replicate ai 替代"],
    cta: "测试生产 API",
    intent:
      "适合正在区分“模型托管平台”和“生产 API 网关”的团队，尤其是已经确定不需要自己部署模型的场景。",
    sections: [
      {
        heading: "什么时候选择 CrazyRouter",
        body:
          "如果产品不需要运行自定义模型，而是调用 CrazyRouter 已公开的模型路线，CrazyRouter 的生产接入更直接：统一域名、标准模型名、端点示例、价格卡片和控制台消费记录。",
        bullets: [
          "图片模型可使用 OpenAI Images 兼容端点。",
          "视频模型可使用统一视频创建和查询流程。",
          "成本估算使用当前 CrazyRouter 价格行。"
        ]
      },
      {
        heading: "Replicate 仍然适合的场景",
        body:
          "如果你需要托管开源模型、运行社区模型，或部署自己的模型版本，Replicate 仍然更合适。CrazyRouter 不用于任意模型托管。"
      },
      {
        heading: "迁移路径",
        body:
          "先把 Replicate 调用分成自定义模型、社区模型和主流 API 工作负载。自定义和社区模型继续留在 Replicate；主流图片与视频请求可按 CrazyRouter 的价格行逐步迁移测试。",
        bullets: cnAvailabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "veo-3.1-fast", "veo-3.1"])
      },
      {
        heading: "选择建议",
        body:
          "模型托管和开源实验优先选 Replicate；选定模型的生产 API 调用、端点清晰和账单记录优先选 CrazyRouter。"
      }
    ],
    faqs: [],
    related: ["ai-api-platform-comparison", "fal-ai-alternative", "aimlapi-alternative", "veo-3-1-api"]
  }),
  page("aimlapi-alternative", {
    title: "AIML API 替代方案：生产模型路由 | CrazyRouter",
    description:
      "比较 AIML API 与 CrazyRouter 在 OpenAI 兼容接入、广泛模型目录、价格可见性、标准模型名和控制台记录上的差异。",
    eyebrow: "平台替代方案",
    h1: "AIML API 替代方案",
    intro:
      "AIML API 通常用于用一个 API 面接入大量模型。CrazyRouter 更适合希望在较小但清晰的模型集合里，获得标准模型名、端点路径、价格行和控制台记录的生产团队。",
    primaryKeyword: "aiml api 替代",
    secondaryKeywords: ["aimlapi 替代", "aiml api 价格", "openai compatible api 替代"],
    cta: "配置 CrazyRouter Base URL",
    intent:
      "适合需要 OpenAI 兼容接入，同时要求模型价格、端点行为和用量记录更容易复查的团队。",
    sections: [
      {
        heading: "什么时候选择 CrazyRouter",
        body:
          "CrazyRouter 适合在生产发布前把每个支持模型都核对清楚：模型名是什么、端点怎么调用、价格来自哪里、消费记录在哪里看。",
        bullets: [
          "OpenAI 兼容 SDK 使用 https://cn.crazyrouter.com/v1。",
          "API 请求使用 https://cn.crazyrouter.com。",
          "API Key、充值、账单和消费记录使用 https://crazyrouter.com。"
        ]
      },
      {
        heading: "AIML API 仍然适合的场景",
        body:
          "如果首要目标是一个 API 品牌下覆盖尽可能多模型，AIML API 仍然有优势。CrazyRouter 更适合当前公开目录中价格和端点已经明确的模型。"
      },
      {
        heading: "迁移路径",
        body:
          "先从 OpenAI 兼容客户端配置开始。替换 base_url，复制一个 CrazyRouter 标准模型名，跑小批量请求，再决定是否扩大到更多模型。",
        bullets: cnAvailabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "grok-4-image"])
      },
      {
        heading: "选择建议",
        body:
          "模型广度优先时继续评估 AIML API；模型行、端点、价格和用量记录清晰优先时评估 CrazyRouter。"
      }
    ],
    faqs: [],
    related: ["ai-api-platform-comparison", "cometapi-alternative", "replicate-alternative", "gpt-image-2-api"]
  }),
  page("eachlabs-alternative", {
    title: "Eachlabs 替代方案：直接 AI API 集成 | CrazyRouter",
    description:
      "比较 Eachlabs 与 CrazyRouter 在 AI 工作流编排、媒体生成管线、直接 API 调用、价格可见性和生产集成上的差异。",
    eyebrow: "平台替代方案",
    h1: "Eachlabs 替代方案",
    intro:
      "Eachlabs 更偏 AI 工作流和多步骤媒体生成管线。CrazyRouter 更适合开发者自己控制业务流程，只需要稳定调用模型 API、核对价格和查看生产消费记录的场景。",
    primaryKeyword: "eachlabs 替代",
    secondaryKeywords: ["eachlabs ai 替代", "ai workflow api 替代", "媒体生成 api 替代"],
    cta: "接入直接 API",
    intent:
      "适合正在判断应该使用工作流型产品，还是把模型调用直接放进后端服务和任务系统的团队。",
    sections: [
      {
        heading: "什么时候选择 CrazyRouter",
        body:
          "如果你的应用已经有自己的任务系统、队列、审核和业务流程，直接 API 网关通常更容易维护。CrazyRouter 让模型调用保持简单：选择模型、复制端点、传 Bearer 认证，再到控制台核对用量。",
        bullets: [
          "直接 API 请求使用 https://cn.crazyrouter.com。",
          "控制台、API Key、充值和消费记录使用 https://crazyrouter.com。",
          "模型名和价格来自 CrazyRouter 当前价格目录。"
        ]
      },
      {
        heading: "Eachlabs 仍然适合的场景",
        body:
          "如果团队需要可视化工作流、媒体管线编排或给非开发人员使用的生成流程，Eachlabs 仍然更匹配。CrazyRouter 更接近后端 API 网关。"
      },
      {
        heading: "迁移路径",
        body:
          "保留应用自己的编排逻辑，把单个模型调用逐步换到 CrazyRouter。先从图片生成或短视频任务开始，因为这些模型已经有价格行和文档路径可以核对。",
        bullets: cnAvailabilityBullets(["gpt-image-2", "nano-banana-2", "qwen-image-max", "veo-3.1-fast"])
      },
      {
        heading: "选择建议",
        body:
          "工作流工具和可视化编排优先选 Eachlabs；开发者自控流程、直接模型调用、价格可见和消费记录优先选 CrazyRouter。"
      }
    ],
    faqs: [],
    related: ["ai-api-platform-comparison", "wavespeed-ai-alternative", "fal-ai-alternative", "veo-3-1-api"]
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
          "计算器会把重试后的计费用量、兜底模型请求和有效产出率合并估算。它适合在付费生成测试前做预算，最终账单仍应以控制台和消费日志为准。"
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
