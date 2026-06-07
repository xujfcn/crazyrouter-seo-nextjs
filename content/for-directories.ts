export type DirectoryLocale = "en" | "zh" | "ru" | "ja" | "zh-tw" | "vi";

export type DirectoryPageContent = {
  locale: DirectoryLocale;
  htmlLang: string;
  path: string;
  title: string;
  description: string;
  ogDescription: string;
  eyebrow: string;
  h1: string;
  heroText: string;
  registerLabel: string;
  docsLabel: string;
  copyDescriptionsEyebrow: string;
  copyDescriptionsTitle: string;
  descriptionLabels: {
    short: string;
    medium: string;
    long: string;
  };
  descriptions: {
    short: string;
    medium: string;
    long: string;
  };
  metadataEyebrow: string;
  metadataTitle: string;
  categoriesTitle: string;
  anchorsTitle: string;
  linksEyebrow: string;
  linksTitle: string;
  coreLinksTitle: string;
  targetPagesTitle: string;
  technicalEyebrow: string;
  technicalTitle: string;
  technicalCards: Array<{
    title: string;
    text: string;
  }>;
  faqEyebrow: string;
  faqTitle: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  officialLinks: Array<[string, string]>;
  categories: string[];
  anchors: string[];
  targetPages: Array<[string, string]>;
};

const sharedCategories = [
  "AI API Gateway",
  "OpenAI-compatible API",
  "AI Model Router",
  "Developer Tools",
  "LLM API",
  "Multimodal AI API",
  "Claude Code API Gateway",
  "Codex CLI API Gateway",
  "MCP Gateway",
  "OpenRouter Alternative"
];

const sharedAnchors = [
  "Crazyrouter",
  "Crazyrouter AI API Gateway",
  "OpenAI-compatible AI API gateway",
  "AI model pricing tracker",
  "Claude Code API gateway",
  "Codex CLI API gateway",
  "MCP gateway for AI models",
  "OpenRouter alternative"
];

const sharedTargetPages: Array<[string, string]> = [
  ["AI tool directories", "https://crazyrouter.com/register"],
  ["Developer directories", "https://crazyrouter.com/docs"],
  ["MCP directories", "https://crazyrouter.com/docs"],
  ["Claude Code / Codex directories", "https://crazyrouter.com/guide/ai-api-platform-comparison"],
  ["AI image API directories", "https://crazyrouter.com/guide/gpt-image-2-api"],
  ["Alternative pages", "https://crazyrouter.com/guide/ai-api-platform-comparison"],
  ["Cost optimization articles", "https://crazyrouter.com/guide/ai-api-cost-calculator"]
];

const sharedOfficialLinks: Array<[string, string]> = [
  ["Main site", "https://crazyrouter.com"],
  ["Register", "https://crazyrouter.com/register"],
  ["Documentation", "https://crazyrouter.com/docs"],
  ["API endpoint guide", "https://crazyrouter.com/docs/api-endpoint"],
  ["Model guide hub", "/guide"],
  ["Chinese guide hub", "/zh/guide"]
];

export const directoryLocales: DirectoryLocale[] = ["en", "zh", "ru", "ja", "zh-tw", "vi"];

export const directoryPagePaths: Record<DirectoryLocale, string> = {
  en: "/for-directories",
  zh: "/zh/for-directories",
  ru: "/ru/for-directories",
  ja: "/ja/for-directories",
  "zh-tw": "/zh-tw/for-directories",
  vi: "/vi/for-directories"
};

export const directoryLanguageAlternates: Record<string, string> = {
  en: directoryPagePaths.en,
  "zh-CN": directoryPagePaths.zh,
  ru: directoryPagePaths.ru,
  ja: directoryPagePaths.ja,
  "zh-TW": directoryPagePaths["zh-tw"],
  vi: directoryPagePaths.vi
};

export const directoryPages: Record<DirectoryLocale, DirectoryPageContent> = {
  en: {
    locale: "en",
    htmlLang: "en",
    path: directoryPagePaths.en,
    title: "Crazyrouter Directory Listing & Media Kit",
    description:
      "Official Crazyrouter descriptions, categories, links, anchor text, and FAQ for AI tool directories, developer lists, MCP directories, and technical writers.",
    ogDescription:
      "Official listing information for directories, technical blogs, AI tool catalogs, and developer resource lists.",
    eyebrow: "Official listing info",
    h1: "Crazyrouter directory listing and media kit",
    heroText:
      "Official descriptions, categories, links, and anchor text for AI tool directories, developer resource lists, MCP directories, benchmark writers, and technical blogs.",
    registerLabel: "Register",
    docsLabel: "Documentation",
    copyDescriptionsEyebrow: "Copy-ready descriptions",
    copyDescriptionsTitle: "Product descriptions",
    descriptionLabels: { short: "Short", medium: "Medium", long: "Long" },
    descriptions: {
      short:
        "Crazyrouter is an OpenAI-compatible AI API gateway for accessing 600+ text, image, video, and audio models through one API key.",
      medium:
        "Crazyrouter helps developers route AI model requests through a unified OpenAI-compatible API gateway. Teams can access 600+ models, compare pricing, test multimodal APIs, and configure tools such as Claude Code, Codex CLI, and MCP workflows with one API key.",
      long:
        "Crazyrouter is a production-focused AI API gateway for developers building with multiple model providers. It offers OpenAI-compatible endpoints, unified access to 600+ AI models, model pricing guidance, multimodal API support, and documentation for Claude Code, Codex CLI, MCP, image generation, video generation, audio models, and AI API cost planning. Directory editors, benchmark authors, and technical writers can use this page for official product descriptions, recommended categories, links, and anchor text."
    },
    metadataEyebrow: "Directory metadata",
    metadataTitle: "Recommended listing details",
    categoriesTitle: "Suggested categories",
    anchorsTitle: "Suggested anchor text",
    linksEyebrow: "Official links",
    linksTitle: "Use the most relevant target URL",
    coreLinksTitle: "Core links",
    targetPagesTitle: "Target page by listing type",
    technicalEyebrow: "Technical summary",
    technicalTitle: "Developer details",
    technicalCards: [
      {
        title: "API format",
        text: "OpenAI-compatible endpoints for chat, images, audio, video, embeddings, and model routing use cases."
      },
      {
        title: "Developer tools",
        text: "Useful for Claude Code, Codex CLI, MCP workflows, OpenAI SDK migration, and multi-model app testing."
      },
      {
        title: "Use cases",
        text: "Model access, API cost planning, fallback routing, multimodal testing, and AI API platform comparison."
      }
    ],
    faqEyebrow: "FAQ",
    faqTitle: "Common questions",
    faqs: [
      {
        question: "What is Crazyrouter?",
        answer:
          "Crazyrouter is an OpenAI-compatible AI API gateway that lets developers access many AI models through one API key and one integration pattern."
      },
      {
        question: "Who should list Crazyrouter?",
        answer:
          "AI tool directories, API directories, developer tool lists, MCP directories, Claude Code and Codex CLI resource lists, and technical blogs covering AI API cost or model routing can list Crazyrouter."
      },
      {
        question: "Which URL should directories use?",
        answer:
          "General AI tool directories can use the register page, developer directories can use the docs, and content pages should link to the most relevant guide or benchmark page."
      },
      {
        question: "Is Crazyrouter OpenAI-compatible?",
        answer:
          "Yes. Crazyrouter provides OpenAI-compatible API endpoints so developers can reuse familiar request formats and SDK patterns."
      }
    ],
    officialLinks: sharedOfficialLinks,
    categories: sharedCategories,
    anchors: sharedAnchors,
    targetPages: sharedTargetPages
  },
  zh: {
    locale: "zh",
    htmlLang: "zh-CN",
    path: directoryPagePaths.zh,
    title: "Crazyrouter 目录收录资料与媒体包",
    description:
      "Crazyrouter 官方目录收录资料，提供产品简介、分类、链接、推荐锚文本和 FAQ，供 AI 工具目录、开发者目录、MCP 目录和技术作者引用。",
    ogDescription: "面向目录站、技术博客、AI 工具导航和开发者资源列表的 Crazyrouter 官方收录资料。",
    eyebrow: "官方收录资料",
    h1: "Crazyrouter 目录收录资料与媒体包",
    heroText:
      "给 AI 工具目录、开发者资源列表、MCP 目录、benchmark 作者和技术博客使用的官方产品简介、分类、链接和推荐锚文本。",
    registerLabel: "注册",
    docsLabel: "文档",
    copyDescriptionsEyebrow: "可复制简介",
    copyDescriptionsTitle: "产品描述",
    descriptionLabels: { short: "短版", medium: "中版", long: "长版" },
    descriptions: {
      short: "Crazyrouter 是一个 OpenAI 兼容的 AI API 网关，开发者可通过一个 API Key 访问 600+ 文本、图片、视频和音频模型。",
      medium:
        "Crazyrouter 帮助开发者通过统一的 OpenAI 兼容 API 网关路由 AI 模型请求。团队可以访问 600+ 模型、比较价格、测试多模态 API，并用一个 API Key 配置 Claude Code、Codex CLI 和 MCP 工作流。",
      long:
        "Crazyrouter 是面向生产环境的 AI API 网关，适合需要接入多个模型提供商的开发者。它提供 OpenAI 兼容接口、600+ AI 模型统一访问、模型价格参考、多模态 API 支持，以及 Claude Code、Codex CLI、MCP、图片生成、视频生成、音频模型和 AI API 成本规划文档。目录编辑、benchmark 作者和技术作者可以使用本页面的官方产品描述、推荐分类、链接和锚文本。"
    },
    metadataEyebrow: "目录元信息",
    metadataTitle: "推荐收录信息",
    categoriesTitle: "推荐分类",
    anchorsTitle: "推荐锚文本",
    linksEyebrow: "官方链接",
    linksTitle: "根据收录类型选择目标页",
    coreLinksTitle: "核心链接",
    targetPagesTitle: "不同收录类型的目标页",
    technicalEyebrow: "技术摘要",
    technicalTitle: "开发者信息",
    technicalCards: [
      { title: "API 格式", text: "OpenAI 兼容接口，支持聊天、图片、音频、视频、embeddings 和模型路由场景。" },
      { title: "开发者工具", text: "适用于 Claude Code、Codex CLI、MCP 工作流、OpenAI SDK 迁移和多模型应用测试。" },
      { title: "使用场景", text: "模型接入、API 成本规划、故障转移路由、多模态测试和 AI API 平台对比。" }
    ],
    faqEyebrow: "FAQ",
    faqTitle: "常见问题",
    faqs: [
      { question: "Crazyrouter 是什么？", answer: "Crazyrouter 是一个 OpenAI 兼容的 AI API 网关，让开发者通过一个 API Key 和一种集成方式访问多个 AI 模型。" },
      { question: "哪些站点适合收录 Crazyrouter？", answer: "AI 工具目录、API 目录、开发者工具列表、MCP 目录、Claude Code 和 Codex CLI 资源列表，以及覆盖 AI API 成本或模型路由的技术博客都适合收录 Crazyrouter。" },
      { question: "目录站应该使用哪个 URL？", answer: "通用 AI 工具目录可使用注册页，开发者目录可使用文档页，内容文章应链接到最相关的 guide、工具页或 benchmark 页面。" },
      { question: "Crazyrouter 是否兼容 OpenAI API？", answer: "是。Crazyrouter 提供 OpenAI 兼容接口，开发者可以复用熟悉的请求格式和 SDK 模式。" }
    ],
    officialLinks: sharedOfficialLinks,
    categories: sharedCategories,
    anchors: sharedAnchors,
    targetPages: sharedTargetPages
  },
  ru: {
    locale: "ru",
    htmlLang: "ru",
    path: directoryPagePaths.ru,
    title: "Crazyrouter: информация для каталогов и медиа",
    description:
      "Официальные описания Crazyrouter, категории, ссылки, анкоры и FAQ для каталогов AI-инструментов, списков разработчиков, MCP-каталогов и технических авторов.",
    ogDescription: "Официальная информация Crazyrouter для каталогов, технических блогов, AI-каталогов и списков ресурсов для разработчиков.",
    eyebrow: "Официальная информация",
    h1: "Crazyrouter: страница для каталогов и медиа",
    heroText:
      "Официальные описания, категории, ссылки и анкоры для каталогов AI-инструментов, списков ресурсов для разработчиков, MCP-каталогов, авторов benchmark и технических блогов.",
    registerLabel: "Регистрация",
    docsLabel: "Документация",
    copyDescriptionsEyebrow: "Готовые описания",
    copyDescriptionsTitle: "Описания продукта",
    descriptionLabels: { short: "Короткое", medium: "Среднее", long: "Длинное" },
    descriptions: {
      short: "Crazyrouter — OpenAI-совместимый AI API gateway для доступа к 600+ текстовым, графическим, видео- и аудиомоделям через один API key.",
      medium:
        "Crazyrouter помогает разработчикам направлять запросы к AI-моделям через единый OpenAI-совместимый API gateway. Команды могут получать доступ к 600+ моделям, сравнивать цены, тестировать мультимодальные API и настраивать Claude Code, Codex CLI и MCP workflow с одним API key.",
      long:
        "Crazyrouter — production-focused AI API gateway для разработчиков, которые работают с несколькими поставщиками моделей. Он предоставляет OpenAI-совместимые endpoints, единый доступ к 600+ AI-моделям, данные о ценах моделей, поддержку мультимодальных API и документацию для Claude Code, Codex CLI, MCP, генерации изображений, видео, аудиомоделей и планирования стоимости AI API. Редакторы каталогов, авторы benchmark и технические авторы могут использовать эту страницу для официальных описаний продукта, рекомендуемых категорий, ссылок и anchor text."
    },
    metadataEyebrow: "Данные для каталога",
    metadataTitle: "Рекомендуемые данные для листинга",
    categoriesTitle: "Рекомендуемые категории",
    anchorsTitle: "Рекомендуемый anchor text",
    linksEyebrow: "Официальные ссылки",
    linksTitle: "Выберите наиболее релевантный URL",
    coreLinksTitle: "Основные ссылки",
    targetPagesTitle: "Целевая страница по типу листинга",
    technicalEyebrow: "Техническое резюме",
    technicalTitle: "Информация для разработчиков",
    technicalCards: [
      { title: "Формат API", text: "OpenAI-совместимые endpoints для chat, images, audio, video, embeddings и сценариев model routing." },
      { title: "Инструменты разработчика", text: "Подходит для Claude Code, Codex CLI, MCP workflow, миграции с OpenAI SDK и тестирования multi-model приложений." },
      { title: "Сценарии", text: "Доступ к моделям, планирование стоимости API, fallback routing, мультимодальное тестирование и сравнение AI API платформ." }
    ],
    faqEyebrow: "FAQ",
    faqTitle: "Частые вопросы",
    faqs: [
      { question: "Что такое Crazyrouter?", answer: "Crazyrouter — OpenAI-совместимый AI API gateway, который позволяет разработчикам получать доступ ко многим AI-моделям через один API key и один паттерн интеграции." },
      { question: "Кому стоит добавить Crazyrouter?", answer: "Crazyrouter подходит для каталогов AI-инструментов, API-каталогов, списков developer tools, MCP-каталогов, ресурсов Claude Code и Codex CLI, а также технических блогов про стоимость AI API или model routing." },
      { question: "Какой URL использовать каталогам?", answer: "Общие AI-каталоги могут использовать страницу регистрации, developer directories — документацию, а контентные страницы должны ссылаться на самый релевантный guide или benchmark." },
      { question: "Crazyrouter совместим с OpenAI API?", answer: "Да. Crazyrouter предоставляет OpenAI-совместимые API endpoints, чтобы разработчики могли использовать знакомые форматы запросов и SDK-подходы." }
    ],
    officialLinks: sharedOfficialLinks,
    categories: sharedCategories,
    anchors: sharedAnchors,
    targetPages: sharedTargetPages
  },
  ja: {
    locale: "ja",
    htmlLang: "ja",
    path: directoryPagePaths.ja,
    title: "Crazyrouter ディレクトリ掲載情報とメディアキット",
    description:
      "AI ツールディレクトリ、開発者向けリスト、MCP ディレクトリ、技術記事向けの Crazyrouter 公式説明文、カテゴリ、リンク、アンカーテキスト、FAQ。",
    ogDescription: "ディレクトリ、技術ブログ、AI ツールカタログ、開発者リソースリスト向けの Crazyrouter 公式掲載情報。",
    eyebrow: "公式掲載情報",
    h1: "Crazyrouter ディレクトリ掲載情報とメディアキット",
    heroText:
      "AI ツールディレクトリ、開発者リソースリスト、MCP ディレクトリ、benchmark 作成者、技術ブログ向けの公式説明文、カテゴリ、リンク、アンカーテキストです。",
    registerLabel: "登録",
    docsLabel: "ドキュメント",
    copyDescriptionsEyebrow: "コピー用説明文",
    copyDescriptionsTitle: "製品説明",
    descriptionLabels: { short: "短文", medium: "中文", long: "長文" },
    descriptions: {
      short: "Crazyrouter は、1 つの API Key で 600+ のテキスト、画像、動画、音声モデルにアクセスできる OpenAI 互換の AI API gateway です。",
      medium:
        "Crazyrouter は、統一された OpenAI 互換 API gateway を通じて AI モデルリクエストをルーティングできる開発者向けサービスです。チームは 600+ モデルへのアクセス、価格比較、マルチモーダル API のテスト、Claude Code、Codex CLI、MCP workflow の設定を 1 つの API Key で行えます。",
      long:
        "Crazyrouter は、複数のモデルプロバイダーを利用する開発者向けの production-focused AI API gateway です。OpenAI 互換 endpoints、600+ AI モデルへの統一アクセス、モデル価格情報、マルチモーダル API サポート、Claude Code、Codex CLI、MCP、画像生成、動画生成、音声モデル、AI API コスト計画のドキュメントを提供します。ディレクトリ編集者、benchmark 作成者、技術ライターは、このページの公式説明文、推奨カテゴリ、リンク、アンカーテキストを利用できます。"
    },
    metadataEyebrow: "掲載メタデータ",
    metadataTitle: "推奨掲載情報",
    categoriesTitle: "推奨カテゴリ",
    anchorsTitle: "推奨アンカーテキスト",
    linksEyebrow: "公式リンク",
    linksTitle: "掲載タイプに合う URL を選択",
    coreLinksTitle: "主要リンク",
    targetPagesTitle: "掲載タイプ別のリンク先",
    technicalEyebrow: "技術概要",
    technicalTitle: "開発者向け情報",
    technicalCards: [
      { title: "API 形式", text: "Chat、images、audio、video、embeddings、model routing に対応する OpenAI 互換 endpoints。" },
      { title: "開発者ツール", text: "Claude Code、Codex CLI、MCP workflow、OpenAI SDK 移行、multi-model アプリのテストに利用できます。" },
      { title: "ユースケース", text: "モデルアクセス、API コスト計画、fallback routing、マルチモーダルテスト、AI API プラットフォーム比較。" }
    ],
    faqEyebrow: "FAQ",
    faqTitle: "よくある質問",
    faqs: [
      { question: "Crazyrouter とは何ですか？", answer: "Crazyrouter は、1 つの API Key と 1 つの統合パターンで多くの AI モデルにアクセスできる OpenAI 互換の AI API gateway です。" },
      { question: "どのようなサイトが Crazyrouter を掲載すべきですか？", answer: "AI ツールディレクトリ、API ディレクトリ、開発者ツールリスト、MCP ディレクトリ、Claude Code / Codex CLI リソース、AI API コストや model routing を扱う技術ブログに適しています。" },
      { question: "ディレクトリではどの URL を使うべきですか？", answer: "一般的な AI ツールディレクトリは登録ページ、開発者向けディレクトリはドキュメント、記事ページは最も関連性の高い guide または benchmark ページにリンクしてください。" },
      { question: "Crazyrouter は OpenAI API と互換性がありますか？", answer: "はい。Crazyrouter は OpenAI 互換 API endpoints を提供しているため、開発者は使い慣れたリクエスト形式や SDK パターンを再利用できます。" }
    ],
    officialLinks: sharedOfficialLinks,
    categories: sharedCategories,
    anchors: sharedAnchors,
    targetPages: sharedTargetPages
  },
  "zh-tw": {
    locale: "zh-tw",
    htmlLang: "zh-TW",
    path: directoryPagePaths["zh-tw"],
    title: "Crazyrouter 目錄收錄資料與媒體包",
    description:
      "Crazyrouter 官方目錄收錄資料，提供產品簡介、分類、連結、推薦錨文字與 FAQ，供 AI 工具目錄、開發者目錄、MCP 目錄和技術作者引用。",
    ogDescription: "面向目錄站、技術部落格、AI 工具導航與開發者資源列表的 Crazyrouter 官方收錄資料。",
    eyebrow: "官方收錄資料",
    h1: "Crazyrouter 目錄收錄資料與媒體包",
    heroText:
      "提供給 AI 工具目錄、開發者資源列表、MCP 目錄、benchmark 作者與技術部落格使用的官方產品簡介、分類、連結和推薦錨文字。",
    registerLabel: "註冊",
    docsLabel: "文件",
    copyDescriptionsEyebrow: "可複製簡介",
    copyDescriptionsTitle: "產品描述",
    descriptionLabels: { short: "短版", medium: "中版", long: "長版" },
    descriptions: {
      short: "Crazyrouter 是一個 OpenAI 相容的 AI API 閘道，開發者可透過一個 API Key 存取 600+ 文字、圖片、影片和音訊模型。",
      medium:
        "Crazyrouter 協助開發者透過統一的 OpenAI 相容 API 閘道路由 AI 模型請求。團隊可以存取 600+ 模型、比較價格、測試多模態 API，並用一個 API Key 設定 Claude Code、Codex CLI 和 MCP 工作流。",
      long:
        "Crazyrouter 是面向正式環境的 AI API 閘道，適合需要接入多個模型供應商的開發者。它提供 OpenAI 相容 endpoints、600+ AI 模型統一存取、模型價格參考、多模態 API 支援，以及 Claude Code、Codex CLI、MCP、圖片生成、影片生成、音訊模型和 AI API 成本規劃文件。目錄編輯、benchmark 作者和技術作者可以使用本頁面的官方產品描述、推薦分類、連結和錨文字。"
    },
    metadataEyebrow: "目錄元資訊",
    metadataTitle: "推薦收錄資訊",
    categoriesTitle: "推薦分類",
    anchorsTitle: "推薦錨文字",
    linksEyebrow: "官方連結",
    linksTitle: "依收錄類型選擇目標頁",
    coreLinksTitle: "核心連結",
    targetPagesTitle: "不同收錄類型的目標頁",
    technicalEyebrow: "技術摘要",
    technicalTitle: "開發者資訊",
    technicalCards: [
      { title: "API 格式", text: "OpenAI 相容 endpoints，支援聊天、圖片、音訊、影片、embeddings 和模型路由場景。" },
      { title: "開發者工具", text: "適用於 Claude Code、Codex CLI、MCP 工作流、OpenAI SDK 遷移和多模型應用測試。" },
      { title: "使用場景", text: "模型接入、API 成本規劃、fallback routing、多模態測試和 AI API 平台比較。" }
    ],
    faqEyebrow: "FAQ",
    faqTitle: "常見問題",
    faqs: [
      { question: "Crazyrouter 是什麼？", answer: "Crazyrouter 是一個 OpenAI 相容的 AI API 閘道，讓開發者透過一個 API Key 和一種整合方式存取多個 AI 模型。" },
      { question: "哪些站點適合收錄 Crazyrouter？", answer: "AI 工具目錄、API 目錄、開發者工具列表、MCP 目錄、Claude Code 和 Codex CLI 資源列表，以及涵蓋 AI API 成本或模型路由的技術部落格都適合收錄 Crazyrouter。" },
      { question: "目錄站應該使用哪個 URL？", answer: "一般 AI 工具目錄可使用註冊頁，開發者目錄可使用文件頁，內容文章應連到最相關的 guide、工具頁或 benchmark 頁面。" },
      { question: "Crazyrouter 是否相容 OpenAI API？", answer: "是。Crazyrouter 提供 OpenAI 相容 API endpoints，開發者可以沿用熟悉的請求格式和 SDK 模式。" }
    ],
    officialLinks: sharedOfficialLinks,
    categories: sharedCategories,
    anchors: sharedAnchors,
    targetPages: sharedTargetPages
  },
  vi: {
    locale: "vi",
    htmlLang: "vi",
    path: directoryPagePaths.vi,
    title: "Crazyrouter: thông tin niêm yết thư mục và media kit",
    description:
      "Thông tin chính thức của Crazyrouter gồm mô tả, danh mục, liên kết, anchor text và FAQ cho thư mục công cụ AI, danh sách dành cho developer, MCP directory và tác giả kỹ thuật.",
    ogDescription: "Thông tin niêm yết chính thức của Crazyrouter cho thư mục, blog kỹ thuật, catalog công cụ AI và danh sách tài nguyên developer.",
    eyebrow: "Thông tin chính thức",
    h1: "Crazyrouter: thông tin niêm yết thư mục và media kit",
    heroText:
      "Mô tả, danh mục, liên kết và anchor text chính thức cho thư mục công cụ AI, danh sách tài nguyên developer, MCP directory, tác giả benchmark và blog kỹ thuật.",
    registerLabel: "Đăng ký",
    docsLabel: "Tài liệu",
    copyDescriptionsEyebrow: "Mô tả có thể sao chép",
    copyDescriptionsTitle: "Mô tả sản phẩm",
    descriptionLabels: { short: "Ngắn", medium: "Trung bình", long: "Dài" },
    descriptions: {
      short: "Crazyrouter là AI API gateway tương thích OpenAI, cho phép truy cập 600+ model văn bản, hình ảnh, video và âm thanh bằng một API key.",
      medium:
        "Crazyrouter giúp developer định tuyến yêu cầu AI model qua một OpenAI-compatible API gateway thống nhất. Team có thể truy cập 600+ model, so sánh giá, thử nghiệm multimodal API và cấu hình Claude Code, Codex CLI, MCP workflow bằng một API key.",
      long:
        "Crazyrouter là AI API gateway tập trung cho môi trường production, dành cho developer xây dựng với nhiều nhà cung cấp model. Nền tảng cung cấp OpenAI-compatible endpoints, quyền truy cập thống nhất tới 600+ AI model, hướng dẫn giá model, hỗ trợ multimodal API và tài liệu cho Claude Code, Codex CLI, MCP, tạo ảnh, tạo video, model âm thanh và lập kế hoạch chi phí AI API. Biên tập viên thư mục, tác giả benchmark và người viết kỹ thuật có thể dùng trang này cho mô tả sản phẩm chính thức, danh mục đề xuất, liên kết và anchor text."
    },
    metadataEyebrow: "Metadata cho directory",
    metadataTitle: "Thông tin niêm yết đề xuất",
    categoriesTitle: "Danh mục đề xuất",
    anchorsTitle: "Anchor text đề xuất",
    linksEyebrow: "Liên kết chính thức",
    linksTitle: "Dùng URL phù hợp nhất",
    coreLinksTitle: "Liên kết chính",
    targetPagesTitle: "Trang đích theo loại niêm yết",
    technicalEyebrow: "Tóm tắt kỹ thuật",
    technicalTitle: "Thông tin cho developer",
    technicalCards: [
      { title: "Định dạng API", text: "OpenAI-compatible endpoints cho chat, images, audio, video, embeddings và các trường hợp model routing." },
      { title: "Công cụ developer", text: "Phù hợp với Claude Code, Codex CLI, MCP workflow, chuyển đổi từ OpenAI SDK và kiểm thử ứng dụng multi-model." },
      { title: "Use cases", text: "Truy cập model, lập kế hoạch chi phí API, fallback routing, kiểm thử multimodal và so sánh nền tảng AI API." }
    ],
    faqEyebrow: "FAQ",
    faqTitle: "Câu hỏi thường gặp",
    faqs: [
      { question: "Crazyrouter là gì?", answer: "Crazyrouter là AI API gateway tương thích OpenAI, cho phép developer truy cập nhiều AI model bằng một API key và một mẫu tích hợp." },
      { question: "Trang nào nên niêm yết Crazyrouter?", answer: "Thư mục công cụ AI, API directory, danh sách developer tools, MCP directory, tài nguyên Claude Code và Codex CLI, cũng như blog kỹ thuật về chi phí AI API hoặc model routing đều phù hợp." },
      { question: "Directory nên dùng URL nào?", answer: "Thư mục công cụ AI tổng quát có thể dùng trang đăng ký, developer directory có thể dùng tài liệu, còn trang nội dung nên liên kết tới guide hoặc benchmark phù hợp nhất." },
      { question: "Crazyrouter có tương thích OpenAI API không?", answer: "Có. Crazyrouter cung cấp OpenAI-compatible API endpoints để developer có thể dùng lại định dạng request và pattern SDK quen thuộc." }
    ],
    officialLinks: sharedOfficialLinks,
    categories: sharedCategories,
    anchors: sharedAnchors,
    targetPages: sharedTargetPages
  }
};
