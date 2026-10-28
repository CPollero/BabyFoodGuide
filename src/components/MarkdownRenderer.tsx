import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple, safe parser for AI markdown responses
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let currentList: string[] = [];
  let isNumbered = false;

  const flushList = () => {
    if (currentList.length > 0) {
      if (isNumbered) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal pl-5 my-2.5 space-y-1.5 text-stone-700 text-sm leading-relaxed">
            {currentList.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-5 my-2.5 space-y-1.5 text-stone-700 text-sm leading-relaxed">
            {currentList.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ul>
        );
      }
      currentList = [];
    }
  };

  const formatInline = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-stone-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-stone-800">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-amber-100/70 text-amber-900 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');
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
      elements.push(
        <h4 key={`h4-${index}`} className="font-bold text-stone-900 text-base mt-3.5 mb-1.5 flex items-center gap-1.5">
          {line.replace('### ', '')}
        </h4>
      );
      return;
    }

    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${index}`} className="font-bold text-orange-950 text-lg mt-4 mb-2 pb-1 border-b border-orange-100">
          {line.replace('## ', '')}
        </h3>
      );
      return;
    }

    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${index}`} className="font-extrabold text-orange-900 text-xl mt-4 mb-2">
          {line.replace('# ', '')}
        </h2>
      );
      return;
    }

    // Callout / Blockquote
    if (line.startsWith('> ')) {
      flushList();
      const quoteText = line.replace(/^>\s*/, '');
      elements.push(
        <div key={`quote-${index}`} className="my-2.5 p-3 bg-amber-50/80 border-l-4 border-amber-400 rounded-r-xl text-xs md:text-sm text-stone-700 leading-relaxed">
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
    elements.push(
      <p
        key={`p-${index}`}
        className="text-stone-700 text-sm leading-relaxed my-1.5"
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
};
