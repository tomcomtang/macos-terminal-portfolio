import { useState } from 'react';
import { BsGithub, BsSpotify, BsTerminal, BsWechat } from 'react-icons/bs';
import { IoIosMail } from 'react-icons/io';
import { RiTerminalFill } from 'react-icons/ri';

export default function DesktopDock() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const handleEmailClick = () => {
    window.open('mailto:364786053@qq.com');
  };

  const handleGithubClick = () => {
    window.open('https://github.com/tomcomtang', '_blank');
  };

  const handleCalendarClick = () => {
    window.open('tel:18813676461');
  };

  const handleSpotifyClick = () => {
    window.open('https://open.spotify.com', '_blank');
  };

  const handleWeChatClick = () => {
    window.open('/wechat.jpg', '_blank');
  };

  const Tooltip = ({ text }: { text: string }) => (
    <div className='absolute -top-14 left-1/2 -translate-x-1/2'>
      <div className='relative px-3 py-1 bg-[#1d1d1f]/80 backdrop-blur-sm text-white text-sm rounded-lg whitespace-nowrap border border-px border-gray-600'>
        {text}
        <div className='absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-3 h-3 bg-[#1d1d1f]/80 backdrop-blur-sm rotate-45 border-b border-r border-gray-600' />
      </div>
    </div>
  );

  return (
    <div className='fixed bottom-0 left-1/2 -translate-x-1/2 hidden md:block z-50'>
      <div className='relative mb-2 p-3 bg-gradient-to-t from-gray-700 to-gray-800 backdrop-blur-2xl rounded-2xl'>
        <div className='flex items-end space-x-4'>
          {/* WeChat */}
          <button
            onClick={handleWeChatClick}
            onMouseEnter={() => setHoveredIcon('wechat')}
            onMouseLeave={() => setHoveredIcon(null)}
            className='relative group'
          >
            <div className='w-14 h-14 bg-[#1AAD19] rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-150 ease-out group-hover:scale-125 group-hover:-translate-y-2'>
              <BsWechat size={38} className='text-white' />
            </div>
            {hoveredIcon === 'wechat' && <Tooltip text='微信加我好友' />}
          </button>

          {/* Email */}
          <button
            onClick={handleEmailClick}
            onMouseEnter={() => setHoveredIcon('email')}
            onMouseLeave={() => setHoveredIcon(null)}
            className='relative group'
          >
            <div className='w-14 h-14 bg-gradient-to-t from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-150 ease-out group-hover:scale-125 group-hover:-translate-y-2'>
              <IoIosMail size={45} className='text-white' />
            </div>
            {hoveredIcon === 'email' && <Tooltip text='给我发邮件' />}
          </button>

          {/* Github */}
          <button
            onClick={handleGithubClick}
            onMouseEnter={() => setHoveredIcon('github')}
            onMouseLeave={() => setHoveredIcon(null)}
            className='relative group'
          >
            <div className='w-14 h-14  bg-gradient-to-t from-black to-black/60 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-150 ease-out group-hover:scale-125 group-hover:-translate-y-2'>
              <BsGithub size={45} className='text-gray-100' />
            </div>
            {hoveredIcon === 'github' && <Tooltip text='我的 GitHub' />}
          </button>

          {/* Calendar */}
          <button
            onClick={handleCalendarClick}
            onMouseEnter={() => setHoveredIcon('calendar')}
            onMouseLeave={() => setHoveredIcon(null)}
            className='relative group'
          >
            <div className='w-14 h-14 overflow-hidden shadow-lg transform transition-transform duration-150 ease-out group-hover:scale-125 group-hover:-translate-y-2'>
              <div className='absolute inset-0 bg-gradient-to-b from-white to-gray-200 rounded-xl'></div>

              <div className='absolute top-0 inset-x-0 h-5 bg-red-500 flex items-center justify-center rounded-t-xl'>
                <span className='text-xs font-semibold text-white uppercase'>
                  {new Date().toLocaleString('en-US', { month: 'short' })}
                </span>
              </div>

              <div className='absolute inset-0 flex items-end justify-center'>
                <span className='text-3xl font-light text-black'>
                  {new Date().getDate()}
                </span>
              </div>
            </div>
            {hoveredIcon === 'calendar' && <Tooltip text='预约沟通' />}
          </button>

          {/* Spotify */}
          <button
            onClick={handleSpotifyClick}
            onMouseEnter={() => setHoveredIcon('spotify')}
            onMouseLeave={() => setHoveredIcon(null)}
            className='relative group'
          >
            <div className='w-14 h-14 bg-gradient-to-t from-black to-black/60 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-150 ease-out group-hover:scale-125 group-hover:-translate-y-2'>
              <BsSpotify size={45} className='text-[#1ED760]' />
            </div>
            {hoveredIcon === 'spotify' && <Tooltip text='我的工作歌单' />}
          </button>

          {/* Divider */}
          <div className='flex items-center'>
            <div className='w-px h-14 bg-white/20' />
          </div>

          {/* Terminal */}
          <button
            onMouseEnter={() => setHoveredIcon('terminal')}
            onMouseLeave={() => setHoveredIcon(null)}
            className='relative group'
          >
            <div className='w-14 h-14 rounded-2xl overflow-hidden shadow-lg transform transition-transform duration-150 ease-out group-hover:scale-125 group-hover:-translate-y-2'>
              <div className='absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-500 rounded-xl'></div>
              <div className='absolute inset-[2px] rounded-xl bg-black'>
                <div className='absolute top-1 left-2'>
                  <RiTerminalFill size={20} className='text-white' />
                </div>
              </div>
            </div>
            {hoveredIcon === 'terminal' && <Tooltip text='终端' />}
          </button>
        </div>
      </div>
    </div>
  );
}
