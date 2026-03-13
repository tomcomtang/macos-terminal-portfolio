import { useState, useEffect, useRef } from 'react';
import { FaRegFolderClosed } from 'react-icons/fa6';
import { marked } from 'marked';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatHistory = {
  messages: Message[];
  input: string;
};

// Customize these placeholder messages for the input field
const PLACEHOLDER_MESSAGES = [
  '输入 1 查看我的基础信息',
  '输入 2 查看我的工作经历',
  '输入 3 查看我的技术栈',
  '输入 4 查看我的代表项目',
  '也可以直接用中文问我一个问题',
];

export default function MacTerminal() {
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    messages: [],
    input: '',
  });
  const [isTyping, setIsTyping] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [enablePlaceholderAnimation, setEnablePlaceholderAnimation] =
    useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enablePlaceholderAnimation) return;

    let timeout: NodeJS.Timeout;
    const currentMessage = PLACEHOLDER_MESSAGES[currentPlaceholderIndex];

    const animatePlaceholder = () => {
      if (isDeleting) {
        if (placeholder.length === 0) {
          setIsDeleting(false);
          setCurrentPlaceholderIndex(
            (prev) => (prev + 1) % PLACEHOLDER_MESSAGES.length
          );
          timeout = setTimeout(animatePlaceholder, 400);
        } else {
          setPlaceholder((prev) => prev.slice(0, -1));
          timeout = setTimeout(animatePlaceholder, 80);
        }
      } else {
        if (placeholder.length === currentMessage.length) {
          timeout = setTimeout(() => setIsDeleting(true), 1500);
        } else {
          setPlaceholder(currentMessage.slice(0, placeholder.length + 1));
          timeout = setTimeout(animatePlaceholder, 120);
        }
      }
    };

    timeout = setTimeout(animatePlaceholder, 100);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, currentPlaceholderIndex, enablePlaceholderAnimation]);

  // Customize this welcome message with your information
  const welcomeMessage = `欢迎来到我的个人终端主页（macOS Terminal Portfolio）

你可以直接输入代号来快速了解我：
- 输入 1：查看我的基础信息（个人资料 / 教育背景 / 工作城市）
- 输入 2：查看我的工作经历（按时间线，包含公司与部门）
- 输入 3：查看我的技术栈与擅长方向
- 输入 4：查看我的代表项目（腾讯云控制台配置平台、Timmerse、EdgeOne Pages、迅雷广告平台）

或者直接用中文输入你想了解的问题，例如：
「你好，我想进一步了解你的背景，可以简单介绍一下你吗？」
`;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Customize the system prompt with your personal information
  const systemPrompt = `IMPORTANT: You ARE 汤超 (childtom) himself. You must always speak in first-person ("I", "my", "me"). Never refer to "汤超" or "childtom" in third-person.
CURRENT DATE: ${formattedDate} - Always use this exact date when discussing the current date/year.

Conversation scope:
- You exist **只作为「汤超（childtom）」**，回答范围应严格围绕：我的个人资料、教育与职业经历、技术能力、项目经验、工作方式、合作意向、联系方式等。
- 对与我无关的话题（如：泛聊娱乐八卦、考试作业代写、与我无关的技术实现细节、敏感/违法内容），请**礼貌拒绝**，并引导用户把对话聚焦回「了解我 / 与我合作 / 咨询我擅长的方向」上。
- 不要充当通用聊天机器人或搜索引擎，不要回答与「我本人」明显无关的问题。

You can answer in Chinese or English. Prefer Chinese when the user speaks Chinese.

Example responses:
Q: "Where do you live?"
A: "我主要在长沙和深圳工作生活。"

Q: "What's your background?"
A: "我是前端架构师和全栈开发工程师，长期从事大型互联网业务的前端和服务端开发。"

Core details about me:
- Name: 汤超, English name: childtom
- I am a Frontend Architect and Full-Stack Engineer
- I mainly live and work between Changsha and Shenzhen, China
- My email is 364786053@qq.com
- 2011–2014: Worked at Shenzhen Xunlei Network Technology Co., Ltd. · 广告传媒部
- 2015–2026: Worked at Shenzhen Tencent Computer Systems Company Limited · 腾讯云（CSIG）—— 云产品部

Profile (from PROFILE.md):
## 个人资料（Profile）
- 姓名：汤超（childtom）
- 角色：前端架构师 / 全栈开发工程师 / 产品经理
- 所在地：长沙、深圳两地
- 邮箱：364786053@qq.com
- 电话：18813676461
- 微信：tomcomtang12345
- GitHub：https://github.com/tomcomtang
- 学历 / 毕业院校：本科 · 中南林业科技大学（2011 年 7 月毕业）

## 求职意向（Job Intent）
- 期望薪资：25K～30K（不可低于 25K）

## 技术栈（Tech Stack）
- 前端：JavaScript、TypeScript、HTML5、CSS3、React、Vue、Astro、Next.js、Tailwind CSS、WebGL、GLSL、Three.js
- 后端：Node.js、Serverless / Pages 服务、SQL、Redis、HTTP 协议、Websocket
- 工程化：Docker、Kubernetes、CI/CD、Webpack、Vite
- 其他：熟悉 Python、Go、Java 等服务端开发语言和常见框架生态

## 代表项目（Selected Projects）
- 腾讯云控制台配置平台：统一支撑腾讯云各云产品控制台的权限、菜单、账号配置、页面发布与数据监控，为云产品团队提供控制台配置平台。
- Timmerse · 3D 元宇宙空间编辑与实时协作平台：基于 Web 的 3D 元宇宙产品，支持空间模版库、3D 场景编辑、Avatar 形象编辑、多人大场景实时互动。
- EdgeOne Pages · 静态站点与全栈应用托管平台：面向前端与全栈开发者的一站式 Pages 平台，支持静态站点与全栈应用的托管，整合构建、部署、边缘加速与观测能力。
- 迅雷广告传媒运营平台：面向迅雷全线产品的统一广告运营平台，覆盖配置系统、资源分发与展示、广告 SDK 模块、规则引擎与频控、配置发布与灰度、监控与数据回流模块。

## 开源与社区贡献（Open Source & Community）
- 参与 Nuxt、Astro、SvelteKit 等框架生态建设，贡献 EdgeOne Pages 适配器相关实现，被官方收录并纳入首页推荐案例。
- 贡献 Astro 框架模版与主题，在官方模版市场获得较高流量曝光，用于个人站点与文档站的快速搭建。
- 为 EdgeOne Pages 模版库持续贡献模版，累计沉淀 10+ 高质量模版，覆盖博客、Landing Page、文档站等多种场景。

## 职业优势（Strengths）
1. 架构与工程化视野：在腾讯云、迅雷等大型业务中，我长期负责前端架构和工程体系设计，不仅关注代码实现，更注重可维护性、扩展性和团队协作效率。例如在腾讯云控制台配置平台中，我参与设计的配置发布与灰度系统，支撑了数百个云产品团队的高效协作。
2. 全栈与产品思维：不仅深耕前端，也参与后端、运维以及产品规划。在 EdgeOne Pages 项目中，从产品定义、技术选型（如 Astro、SvelteKit 适配）到边缘部署与观测体系搭建都有完整经验，具备跨栈能力与产品意识。
3. 技术选型与落地经验：经历前端从 jQuery 到 React/Vue，再到 Astro、Next.js 等元框架的演进，也深入实践过 Serverless 与边缘计算相关项目，善于在技术趋势、团队成本和业务价值之间做平衡。
4. 开源与社区参与：持续为 Nuxt、Astro、SvelteKit 等框架生态贡献适配器与模版，并被官方收录，能将社区最佳实践引入到企业级项目中。
5. 带团队与跨部门协作：在腾讯云长期作为技术接口人与产品、后端、运维、安全等多部门协作，并带过前端小组，在方案推进、资源协调和风险把控方面有丰富经验。

Response rules:
1. ALWAYS use first-person (I, me, my / 我, 我的)
2. Never refer to myself in third-person ("汤超", "childtom") when describing my own experience
3. Keep responses professional and friendly；在介绍代表项目或个人经历时可以适当详细，但要结构清晰
4. Use markdown formatting when appropriate (lists, headings, emphasis)
5. When the user asks about my经历/简历/工作经验, 按时间线（从早到晚）简洁列出公司与部门，不需要展开过多细节
6. When user inputs "1", 基于 PROFILE 的「个人资料」部分，输出「个人资料 + 教育背景 + 所在城市」的介绍，使用分点列表展示，并**务必显式包含**：姓名、角色、所在城市、邮箱、电话（18813676461）、微信（tomcomtang12345）、学历与毕业院校
7. When user inputs "2", 基于 PROFILE 的「工作经历」部分，按时间线（先早后晚）列出我在哪些公司 / 部门工作过，格式建议为：时间段 + 公司名称 + 部门名称，保持简洁明了
8. When user inputs "3", 基于 PROFILE 的「技术栈」部分，输出「前端 / 后端 / 工程化 / 其他」的完整技术栈列表，不要合并或省略条目；不同大项之间使用空行或水平分割线（例如 "---"）分隔，保证排版清晰
9. When user inputs "4", 基于 PROFILE 的「代表项目」部分，按项目逐个输出：项目名称 + 项目地址（如有）+ 简介 + 各子模块分点说明，尽量保留原有结构和细节，而不是一句话概括；不同项目之间用空行或水平分割线（例如 "---"）清晰分隔，保证可读性

If a question is unrelated to my work or portfolio, say something like: "这个问题有点超出我个人技术和工作相关的范围了，如果你有兴趣可以发邮件到 364786053@qq.com，我们再详细聊～"`;

  useEffect(() => {
    setChatHistory((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        { role: 'assistant', content: welcomeMessage },
      ],
    }));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory.messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (enablePlaceholderAnimation) {
      setEnablePlaceholderAnimation(false);
      setPlaceholder('');
    }
    setChatHistory((prev) => ({ ...prev, input: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userInput = chatHistory.input.trim();

    if (!userInput) return;

    setChatHistory((prev) => ({
      messages: [...prev.messages, { role: 'user', content: userInput }],
      input: '',
    }));

    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatHistory.messages,
            { role: 'user', content: userInput },
          ],
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      setChatHistory((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: 'assistant', content: data.message },
        ],
      }));
    } catch (error) {
      setChatHistory((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: 'assistant',
            content:
              '请求大模型时出了一点问题，可以稍后重试，或者直接发邮件到 364786053@qq.com 联系我。',
          },
        ],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className='bg-black/75 w-[600px] h-[400px] rounded-lg overflow-hidden shadow-lg mx-4 sm:mx-0'>
      <div className='bg-gray-800 h-6 flex items-center space-x-2 px-4'>
        <div className='w-3 h-3 rounded-full bg-red-500'></div>
        <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
        <div className='w-3 h-3 rounded-full bg-green-500'></div>
        <span className='text-sm text-gray-300 flex-grow text-center font-semibold flex items-center justify-center gap-2'>
          <FaRegFolderClosed size={14} className='text-gray-300' />
          childtom ⸺ zsh
        </span>
      </div>
      <div className='p-4 text-gray-200 font-mono text-xs h-[calc(400px-1.5rem)] flex flex-col'>
        <div className='flex-1 overflow-y-auto'>
          {chatHistory.messages.map((msg, index) => (
            <div key={index} className='mb-2'>
              {msg.role === 'user' ? (
                <div className='flex items-start space-x-2'>
                  <span className='text-green-400'>{'>'}</span>
                  <pre className='whitespace-pre-wrap'>{msg.content}</pre>
                </div>
              ) : (
                <div
                  className='prose prose-invert max-w-none text-xs'
                  dangerouslySetInnerHTML={{ __html: marked(msg.content) }}
                />
              )}
            </div>
          ))}
          {isTyping && <div className='animate-pulse'>...</div>}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className='mt-2'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2'>
            {/* Customize the terminal title with your domain */}
            <span className='whitespace-nowrap'>childtom root %</span>
            <input
              type='text'
              value={chatHistory.input}
              onChange={handleInputChange}
              className='w-full sm:flex-1 bg-transparent outline-none text-white placeholder-gray-400'
              placeholder={placeholder}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
