import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface MarkdownRendererProps {
  content: string;
  isUserMessage?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isUserMessage = false }) => {
  const { mode, t } = useTheme();
  const isDark = mode === 'oscuro';

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let currentList: string[] = [];
  let isNumbered = false;

  const formatInline = (text: string): string => {
    if (isUserMessage) {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-white/90">$1</em>')
        .replace(/`([^`]+)`/g, '<code class="bg-black/20 text-white px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
    }

    const boldColor = isDark ? 'text-white font-extrabold' : 'text-stone-900 font-bold';
    const italicColor = isDark ? 'text-emerald-200' : 'text-stone-800';
    const codeClass = isDark
      ? 'bg-white/10 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded text-xs font-mono'
      : 'bg-amber-100/70 text-amber-900 px-1.5 py-0.5 rounded text-xs font-mono';

    return text
      .replace(/\*\*(.*?)\*\*/g, `<strong class="${boldColor}">$1</strong>`)
      .replace(/\*(.*?)\*/g, `<em class="italic ${italicColor}">$1</em>`)
      .replace(/`([^`]+)`/g, `<code class="${codeClass}">$1</code>`);
  };

  const flushList = () => {
    if (currentList.length > 0) {
      const listTextColor = isUserMessage ? 'text-white' : t.textPrimary;
      if (isNumbered) {
        elements.push(
          <ol
            key={`ol-${elements.length}`}
            className={`list-decimal pl-5 my-2.5 space-y-1.5 ${listTextColor} text-sm leading-relaxed`}
          >
            {currentList.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul
            key={`ul-${elements.length}`}
            className={`list-disc pl-5 my-2.5 space-y-1.5 ${listTextColor} text-sm leading-relaxed`}
          >
            {currentList.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ul>
        );
      }
      currentList = [];
    }
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      return;
    }

    // Headers
    if (line.startsWith('### ')) {
      flushList();
      const h4Color = isUserMessage
        ? 'text-white'
        : isDark
        ? 'text-white'
        : 'text-stone-900';
      elements.push(
        <h4 key={`h4-${index}`} className={`font-bold text-base mt-3.5 mb-1.5 flex items-center gap-1.5 ${h4Color}`}>
          {line.replace('### ', '')}
        </h4>
      );
      return;
    }

    if (line.startsWith('## ')) {
      flushList();
      const h3Color = isUserMessage
        ? 'text-white border-white/20'
        : isDark
        ? `${t.accentText} border-emerald-800/80`
        : 'text-orange-950 border-orange-100';
      elements.push(
        <h3 key={`h3-${index}`} className={`font-bold text-lg mt-4 mb-2 pb-1 border-b ${h3Color}`}>
          {line.replace('## ', '')}
        </h3>
      );
      return;
    }

    if (line.startsWith('# ')) {
      flushList();
      const h2Color = isUserMessage
        ? 'text-white'
        : isDark
        ? 'text-emerald-100'
        : 'text-orange-900';
      elements.push(
        <h2 key={`h2-${index}`} className={`font-extrabold text-xl mt-4 mb-2 ${h2Color}`}>
          {line.replace('# ', '')}
        </h2>
      );
      return;
    }

    // Callout / Blockquote
    if (line.startsWith('> ')) {
      flushList();
      const quoteText = line.replace(/^>\s*/, '');
      const quoteClasses = isUserMessage
        ? 'bg-black/20 border-white/60 text-white'
        : isDark
        ? 'bg-white/5 border-emerald-400 text-emerald-100'
        : 'bg-amber-50/80 border-amber-400 text-stone-700';

      elements.push(
        <div key={`quote-${index}`} className={`my-2.5 p-3 border-l-4 rounded-r-xl text-xs md:text-sm leading-relaxed ${quoteClasses}`}>
          <span dangerouslySetInnerHTML={{ __html: formatInline(quoteText) }} />
        </div>
      );
      return;
    }

    // Bullet points
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const itemText = line.substring(2);
      if (isNumbered && currentList.length > 0) flushList();
      isNumbered = false;
      currentList.push(itemText);
      return;
    }

    // Numbered list
    const numMatch = line.match(/^\d+\.\s+(.*)/);
    if (numMatch) {
      if (!isNumbered && currentList.length > 0) flushList();
      isNumbered = true;
      currentList.push(numMatch[1]);
      return;
    }

    // Regular paragraph
    flushList();
    const pColor = isUserMessage ? 'text-white' : t.textPrimary;
    elements.push(
      <p
        key={`p-${index}`}
        className={`${pColor} text-sm leading-relaxed my-1.5`}
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
};
