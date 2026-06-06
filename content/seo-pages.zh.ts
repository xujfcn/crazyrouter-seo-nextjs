import {
  seoPages,
  type CalculatorPreset,
  type PageSection,
  type SeoPage,
  type TestEvidence
} from "@/content/seo-pages";

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

  return items.map((item) => {
    if (item.label === "Pricing API reachable") {
      return evidence("价格 API 可访问", "已返回这些页面使用的公开模型价格目录。", item);
    }

    if (item.label === "Model list requires a token") {
      return evidence("模型列表需要密钥", "已确认模型可用性检查需要 Authorization: Bearer YOUR_API_KEY。", item);
    }

    if (item.label === "Chat completions rejects GET") {
      return evidence("Chat completions 拒绝 GET", "已确认手写 HTTP 请求必须使用文档要求的 POST 方法。", item);
    }

    if (item.label === "Image generation endpoint requires a token") {
      return evidence("图片生成端点需要密钥", "端点存在，并且在接受生成参数前会校验 Bearer 认证。", item);
    }

    if (item.label === "Video creation endpoint requires a token") {
      return evidence("视频创建端点需要密钥", "端点存在，并且在接受视频任务前会校验 Bearer 认证。", item);
    }

    if (item.label === "Target models visible to API key") {
      return evidence(
        "目标模型对本地 API key 可见",
        "已确认 gpt-image-2、veo-3.1-fast、veo-3.1、nano-banana-2、nano-banana-pro、nano-banana、grok-4-image、qwen-image-plus、qwen-image-max、qwen-image-2.0 对本地 CrazyRouter API key 可见。",
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
      "本页只围绕 CrazyRouter 价格页当前提供的 gpt-image-2 编写，使用 https://cn.crazyrouter.com/v1 的文档路径，并把模型名、价格、端点和代码示例保持一致。",
    primaryKeyword: "gpt-image-2 api",
    secondaryKeywords: ["gpt image api", "openai 图片生成 api", "gpt-image-2 价格"],
    cta: "创建 API Key",
    intent:
      "搜索 GPT Image API 的开发者通常需要确认模型名、图片生成端点、不可用参数和真实计费口径，而不是只看泛化的图片模型介绍。",
    sections: [
      {
        heading: "与价格页对齐",
        body:
          "CrazyRouter 价格 API 当前包含 gpt-image-2，并公开 image-generation 端点类型。本页的标题、代码、内部链接和 sitemap 都使用这个模型名。",
        bullets: base("gpt-image-2-api").sections[0].bullets
      },
      {
        heading: "文档参数规则",
        body:
          "gpt-image-2 使用 POST /v1/images/generations 做生成，使用 POST /v1/images/edits 做编辑。不要传 response_format、style、input_fidelity、background=transparent 或 quality=standard；需要输出格式时使用 output_format。",
        bullets: [
          "OpenAI SDK 的 base_url 设置为 https://cn.crazyrouter.com/v1。",
          "先用 n=1 做小流量验证，再扩大批量调用。",
          "生成结果 URL 应由业务侧及时下载或转存。"
        ]
      },
      {
        heading: "页面提供的实际功能",
        body:
          "本页包含价格卡片、端点证据、cURL/Python 示例和相关指南入口，可直接用于开发检查，不是占位 SEO 页面。"
      }
    ],
    faqs: [
      {
        question: "这些价格来自哪里？",
        answer:
          "页面读取的是 GET https://cn.crazyrouter.com/api/pricing 的提交快照，该接口对应 CrazyRouter 价格页。发布前如果价格页变更，需要重新同步快照。"
      },
      {
        question: "OpenAI SDK 应该配置哪个 Base URL？",
        answer: "OpenAI 兼容 SDK 使用 https://cn.crazyrouter.com/v1；手写 cURL 使用完整路径，例如 https://cn.crazyrouter.com/v1/images/generations。"
      },
      {
        question: "gpt-image-2 可以直接使用 size 和 quality 吗？",
        answer:
          "按当前文档，gpt-image-2 不应发送 quality=standard 等不支持参数。建议按文档字段最小化请求体，再逐项增加业务需要的参数。"
      }
    ]
  }),
  page("veo-3-1-api", {
    title: "Veo 3.1 API 中文接入指南 | CrazyRouter",
    description: "使用 CrazyRouter 接入 veo-3.1-fast 和 veo-3.1，包含统一视频端点、按秒计费和接口检查证据。",
    eyebrow: "视频 API 指南",
    h1: "Veo 3.1 API 中文接入指南",
    intro:
      "本页覆盖 CrazyRouter 当前公开的 Veo 3.1 视频模型：veo-3.1-fast 和 veo-3.1。它按价格页、文档和 cn.crazyrouter.com 实测结果组织。",
    primaryKeyword: "veo 3.1 api",
    secondaryKeywords: ["veo api", "google veo api", "veo 3.1 价格"],
    cta: "测试 Veo 3.1",
    intent:
      "评估视频 API 的团队需要知道公开模型别名、创建任务路径、查询方式、按秒计费，以及 fast 和 quality 路线如何选择。",
    sections: [
      {
        heading: "与价格页对齐",
        body:
          "当前价格 API 返回 veo-3.1-fast 和 veo-3.1，public_endpoint_types 为 unified-video，billing_mode 为 per_second。",
        bullets: base("veo-3-1-api").sections[0].bullets
      },
      {
        heading: "当前公开调用约定",
        body:
          "文档当前主要覆盖文生视频和单图生视频的客户侧调用。参考素材、首尾帧、带音频和 4K 等能力在价格规则中可能出现 beta 或供应商能力标记，正式页面不应默认承诺。",
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
          "可以访问公开价格接口；实际模型列表和视频任务需要 Authorization: Bearer YOUR_API_KEY。"
      },
      {
        question: "本页覆盖哪些视频模型？",
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
      "Nano Banana 2 在价格 API 中以 nano-banana-2 暴露，并使用 image-generation 公开端点。本页聚焦当前推荐的 OpenAI Images 兼容路径。",
    primaryKeyword: "nano banana 2 api",
    secondaryKeywords: ["nano banana api", "gemini 图片 api", "nano-banana-2 价格"],
    cta: "测试 Nano Banana 2",
    intent:
      "评估 Gemini 图片路线的团队需要明确公开模型别名、图片生成路径、参考图参数和按图计费假设。",
    sections: [
      {
        heading: "与价格页对齐",
        body:
          "Nano Banana 系列在价格 API 中存在；本页主目标是 nano-banana-2，因为文档将它作为当前图片路径的推荐目标。",
        bullets: base("nano-banana-2-api").sections[0].bullets
      },
      {
        heading: "文档字段约定",
        body:
          "使用 POST /v1/images/generations，model 为 nano-banana-2。公开参数包含 prompt、image_input、resolution、aspect_ratio、output_format、output_compression 和 n，不要直接传 Gemini 原生字段。",
        bullets: [
          "文生图：不传 image_input。",
          "参考图编辑：在 image_input 中传一个或多个图片 URL。",
          "按下游需求选择 png、jpeg 或 jpg 输出格式。"
        ]
      },
      {
        heading: "页面实际用途",
        body:
          "页面包含价格行、接口证据、代码样例和成本计算器入口，适合在发布前逐项检查模型与文档是否一致。"
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
      "本页只围绕价格 API 中当前存在的 grok-4-image 编写，并按 image-generation 公开端点展示接入方式。",
    primaryKeyword: "grok 4 image api",
    secondaryKeywords: ["grok 图片 api", "xai 图片 api", "grok-4-image 价格"],
    cta: "测试 Grok 图片生成",
    intent:
      "开发者在比较图片 API 时，需要先知道 Grok 图片模型有哪些不同参数，避免直接复制通用 OpenAI Images 请求体导致失败。",
    sections: [
      {
        heading: "与价格页对齐",
        body:
          "当前价格 API 中 grok-4-image 对客户公开 image-generation 端点。展示价格应以 CrazyRouter 价格页和消费日志为准。",
        bullets: base("grok-4-image-api").sections[0].bullets
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
          "本页价格卡片来自 CrazyRouter 价格 API 快照，并在页面中展示 public_endpoint_types 和 supported_endpoint_types。"
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
      "搜索 Qwen Image API 的开发者需要区分客户侧公开别名和供应商侧执行细节，并拿到可复制的图片生成路径。",
    sections: [
      {
        heading: "与价格页对齐",
        body:
          "本页只使用价格页当前公开的 Qwen Image 模型：qwen-image-plus、qwen-image-max 和 qwen-image-2.0。",
        bullets: base("qwen-image-api").sections[0].bullets
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
        question: "本页覆盖 Qwen 图片编辑吗？",
        answer:
          "不覆盖。当前 Qwen 文档页说明首批公开路径聚焦文生图，编辑能力应等公开路由明确后再单独评估。"
      },
      {
        question: "Base URL 是什么？",
        answer:
          "OpenAI 兼容 SDK 使用 https://cn.crazyrouter.com/v1。"
      }
    ]
  }),
  page("crazyrouter-vs-apimart", {
    title: "CrazyRouter vs Apimart.ai 中文对比 | AI API 平台比较",
    description: "比较 CrazyRouter 与 Apimart.ai 在 AI API 发现、生产路由、价格数据和开发接入流程上的差异。",
    eyebrow: "竞品对比",
    h1: "CrazyRouter vs Apimart.ai 中文对比",
    intro:
      "本页面向已经从 API 发现阶段进入生产接入阶段的团队。它不做无法验证的流量断言，而是围绕产品决策展开：API 市场式发现，还是文档对齐的生产 API 路由。",
    primaryKeyword: "crazyrouter vs apimart",
    secondaryKeywords: ["apimart 替代", "apimart.ai 替代", "ai api 市场"],
    cta: "比较生产路由",
    intent:
      "搜索这个对比的人通常在决定：继续浏览 API 市场，还是把模型调用收敛到一个可运营、可计费、可观测的统一网关。",
    sections: [
      {
        heading: "一句话决策",
        body:
          "如果目标是浏览有哪些 API，Apimart.ai 式发现有价值；如果目标是生产接入，CrazyRouter 的重点是一套 Base URL、Bearer 认证、价格行、端点类型、日志和模型文档。"
      },
      {
        heading: "CrazyRouter 页面能证明什么",
        body:
          "更强的对比点不是泛化功能清单，而是可复查的运营证据：公开价格 API、端点映射、模型指南和同一路径下的可复制 cURL 示例。",
        bullets: [
          "价格来源：GET https://cn.crazyrouter.com/api/pricing。",
          "OpenAI 兼容 Base URL：https://cn.crazyrouter.com/v1。",
          "模型页链接到具体 docs 文件和 endpoint type。",
          "成本计算器使用真实模型行，不使用占位价格。"
        ]
      },
      {
        heading: "页面应该如何转化",
        body:
          "竞品页应把用户引导到具体下一步：选一个模型指南，核对端点，估算月成本，然后到 CrazyRouter 主站创建 API Key。"
      }
    ],
    faqs: [
      {
        question: "本页是否声称 CrazyRouter 流量高于 Apimart.ai？",
        answer:
          "不声称。流量判断需要第三方分析或 Search Console 数据，本项目内没有这类数据。本页只使用可验证的产品事实做定位。"
      },
      {
        question: "这个竞品页应该由哪些内部链接支撑？",
        answer:
          "应从模型指南、成本计算器、Apimart 替代页和 AI API 市场主题页链接过来，并统一放在 /guide 或 /zh/guide 路径下。"
      }
    ]
  }),
  page("apimart-ai-alternative", {
    title: "Apimart.ai 替代方案：面向生产的 AI API 网关 | CrazyRouter",
    description: "正在寻找 Apimart.ai 替代方案？比较 CrazyRouter 在生产 AI API 路由、价格可见性和文档化接入上的能力。",
    eyebrow: "替代方案页面",
    h1: "面向生产接入的 Apimart.ai 替代方案",
    intro:
      "如果 Apimart.ai 解决的是 API 发现问题，CrazyRouter 要解决的是下一步：把图片、视频和聊天模型调用放到一层文档化的生产 API 网关之后。",
    primaryKeyword: "apimart 替代",
    secondaryKeywords: ["apimart.ai 替代", "apimart alternatives", "ai api 市场替代"],
    cta: "评估 CrazyRouter",
    intent:
      "搜索 Apimart 替代方案的用户需要判断标准、迁移路径和真实 API 工作负载的证据，而不是只有营销口号。",
    sections: [
      {
        heading: "为什么团队会离开纯 API 市场",
        body:
          "发现阶段很有用，但生产团队需要稳定 Base URL、一致认证、端点级示例、可自动化读取的价格数据，以及不重写所有集成也能比较模型的路径。"
      },
      {
        heading: "迁移路径",
        body:
          "不要一次迁移所有工作负载。先选一个模型族，确认它在价格页存在，用密钥跑 GET /v1/models，再发一次 POST 请求，并记录成本、时延和失败类型。",
        bullets: [
          "图片测试可以先从 gpt-image-2 或 qwen-image-max 开始。",
          "短视频测试可以从 veo-3.1-fast 开始。",
          "扩大生产流量前，先用成本计算器估算有效产出成本。"
        ]
      },
      {
        heading: "路径架构",
        body:
          "本 SEO 项目使用 /guide/* 和 /zh/guide/* 承载竞品页、模型页和计算器页，避免占用已有 /tools/pricing-calculator、/tools/model-comparison 等工具路径。"
      }
    ],
    faqs: [
      {
        question: "CrazyRouter 更适合谁？",
        answer:
          "更适合希望用一层统一接入覆盖多个支持模型，并需要价格可见、文档明确和端点行为可复查的开发者与团队。"
      },
      {
        question: "是否需要马上迁移所有调用？",
        answer:
          "不需要。建议先选一个模型族做小流量验证，再按日志、成本和失败率决定下一步。"
      }
    ]
  }),
  page("ai-api-cost-calculator", {
    title: "AI API 成本计算器：基于 CrazyRouter 价格页 | CrazyRouter",
    description: "使用 CrazyRouter 价格页模型行估算 gpt-image-2、Veo、Nano Banana、Grok 和 Qwen Image 的图片与视频 API 成本。",
    eyebrow: "交互工具",
    h1: "AI API 成本计算器",
    intro:
      "这是一个真实可用的计算器页面，不是占位内容。预设价格来自同一份价格 API 快照，可估算请求用量、重试率、兜底占比和有效产出成本。",
    primaryKeyword: "ai api 成本计算器",
    secondaryKeywords: ["openai api 价格计算器", "视频 api 成本计算器", "图片 api 价格计算器"],
    cta: "估算模型成本",
    intent:
      "搜索 API 成本计算器的用户通常正在规划真实集成。页面需要立即给出数字，并把用户引导到具体模型接入指南。",
    sections: [
      {
        heading: "计算器衡量什么",
        body:
          "计算器会把重试后的计费用量、兜底模型流量和有效产出率合并估算。它适合在付费生成测试前做预算，最终账单仍应以控制台和消费日志为准。"
      },
      {
        heading: "价格来源",
        body:
          "每个预设都来自提交的价格 API 快照。对包含详细规则的图片和视频模型，预设会优先选择 verified 或第一条可用的 platform_base_price；简单按请求计费的模型则使用 model_price 和 discount。"
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
