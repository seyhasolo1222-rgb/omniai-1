import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface FormattedTextProps {
  content: string;
  isStreaming?: boolean;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ content, isStreaming }) => {
  // Split content by code blocks: ```code```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-[15px] text-[#0d0d0d]">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Code block
          const lines = part.slice(3, -3).split('\n');
          const language = lines[0].trim();
          const code = lines.slice(language ? 1 : 0).join('\n');

          return <CodeBlock key={index} code={code} language={language} />;
        }

        // Standard text with inline formatting
        return <ParagraphBlock key={index} text={part} />;
      })}

      {isStreaming && (
        <span
          className="inline-block w-1.5 h-4 ml-0.5 bg-neutral-900 rounded-xs animate-pulse align-middle"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-neutral-200/90 bg-[#1e1e1e] text-neutral-100 text-[13.5px] font-mono">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#2d2d2d] text-neutral-400 text-xs">
        <span className="font-sans font-medium uppercase tracking-wider">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>បានចម្លង</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>ចម្លងកូដ</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto overflow-y-hidden leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const ParagraphBlock: React.FC<{ text: string }> = ({ text }) => {
  const paragraphs = text.split('\n');

  return (
    <>
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();
        if (!trimmed) {
          return <div key={i} className="h-1.5" />;
        }

        // Header ###
        if (para.startsWith('### ')) {
          return (
            <h4 key={i} className="text-[16px] font-bold text-neutral-900 mt-2">
              {renderInlineStyles(para.replace(/^###\s+/, ''))}
            </h4>
          );
        }

        // Header ##
        if (para.startsWith('## ')) {
          return (
            <h3 key={i} className="text-[18px] font-bold text-neutral-900 mt-3">
              {renderInlineStyles(para.replace(/^##\s+/, ''))}
            </h3>
          );
        }

        // Header #
        if (para.startsWith('# ')) {
          return (
            <h2 key={i} className="text-[20px] font-bold text-neutral-900 mt-3.5">
              {renderInlineStyles(para.replace(/^#\s+/, ''))}
            </h2>
          );
        }

        // Unordered List bullet: • or - or *
        if (/^[\*\-•]\s+/.test(para)) {
          return (
            <div key={i} className="flex items-start gap-2.5 ml-2 my-0.5">
              <span className="text-neutral-400 mt-1 shrink-0">•</span>
              <div className="flex-1">{renderInlineStyles(para.replace(/^[\*\-•]\s+/, ''))}</div>
            </div>
          );
        }

        // Numbered List: 1. or 2. or 3.
        const numMatch = para.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start gap-2.5 ml-2 my-0.5">
              <span className="text-neutral-500 font-mono text-[13px] mt-0.5 shrink-0">
                {numMatch[1]}.
              </span>
              <div className="flex-1">{renderInlineStyles(numMatch[2])}</div>
            </div>
          );
        }

        return (
          <p key={i} className="leading-relaxed">
            {renderInlineStyles(para)}
          </p>
        );
      })}
    </>
  );
};

// Render inline styles like **bold**, *italic*, and `code`
function renderInlineStyles(text: string): React.ReactNode {
  // Regex to split bold and code
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-neutral-900">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 bg-neutral-100 rounded text-[13.5px] font-mono text-neutral-800 border border-neutral-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return token;
  });
}
