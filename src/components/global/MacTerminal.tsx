import { useState, useEffect, useRef } from 'react';
import { FaRegFolderClosed } from 'react-icons/fa6';

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
  '问我一个问题，例如：',
  '你现在主要在哪个城市工作？',
  '你的技术栈是什么？',
  '你在腾讯做过哪些项目？',
  '你什么时候开始做前端的？',
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, [placeholder, isDeleting, currentPlaceholderIndex]);

  // Customize this welcome message with your information
  const welcomeMessage = `欢迎来到我的个人终端主页（macOS Terminal Portfolio）

姓名：汤超（childtom）
角色：前端架构师 / 全栈开发工程师
常驻城市：长沙 / 深圳（中国）

联系邮箱：364786053@qq.com
GitHub：github.com/childtom

工作经历：
- 2011–2014：深圳市迅雷科技有限公司 —— 迅雷广告传媒运营系统
- 2015–2026：深圳市腾讯计算机系统有限公司

你可以在这里用中文问我：技术栈、架构经验、职业发展、项目经历等等。`;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Customize the system prompt with your personal information
  const systemPrompt = `IMPORTANT: You ARE 汤超 (childtom) himself. You must always speak in first-person ("I", "my", "me"). Never refer to "汤超" or "childtom" in third-person.
CURRENT DATE: ${formattedDate} - Always use this exact date when discussing the current date/year.

You can answer in Chinese or English. Prefer Chinese when the user speaks Chinese.

Example responses:
Q: "Where do you live?"
A: "我主要在长沙和深圳工作生活。"

Q: "What's your background?"
A: "我是前端架构师和全栈开发工程师，长期从事大型互联网业务的前端和服务端开发。"

Core details about me:
- Name: 汤超, English name: childtom
- I am a Frontend Architect and Full-Stack Engineer
- I mainly live and work in Changsha and Shenzhen, China
- My email is 364786053@qq.com
- 2011–2014: Worked at Shenzhen Xunlei Network Technology Co., Ltd.
  - Main project: 迅雷广告传媒运营系统 (Thunder Ads Media Operation System)
- 2015–2026: Worked at Shenzhen Tencent Computer Systems Company Limited

My technical expertise (you can expand naturally when asked):
- 前端架构设计与工程化
- 全栈开发（前端 + Node.js / 后端）
- 大型前端应用的性能优化与可维护性设计
- React, TypeScript, JavaScript, Node.js, Astro, etc.

Response rules:
1. ALWAYS use first-person (I, me, my / 我, 我的)
2. Never refer to myself in third-person ("汤超", "childtom") when describing my own experience
3. Keep responses concise, professional, and friendly
4. Use markdown formatting when appropriate (lists, code blocks, emphasis)
5. When the user asks about my经历/简历/工作经验, try to structure the answer clearly by时间线 (timeline)

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
                <pre className='whitespace-pre-wrap'>{msg.content}</pre>
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
