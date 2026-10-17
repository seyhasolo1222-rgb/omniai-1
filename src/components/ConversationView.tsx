import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, Brain } from 'lucide-react';
import { ChatMessage, ThinkingLevelOption } from '../types';
import { OmniLogo } from './OmniLogo';
import { FormattedText } from './FormattedText';

interface ConversationViewProps {
  title: string;
  messages: ChatMessage[];
  isStreaming?: boolean;
  activeThinkingLevel?: ThinkingLevelOption;
  onRegenerate?: () => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  title,
  messages,
  isStreaming,
  activeThinkingLevel = 'MEDIUM',
  onRegenerate,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll as messages change or stream
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getThinkingLabel = (level?: ThinkingLevelOption) => {
    switch (level) {
      case 'LOW':
        return 'កម្រិតគិតទាប (Low)';
      case 'HIGH':
        return 'កម្រិតគិតខ្ពស់ (High)';
      case 'MEDIUM':
      default:
        return 'កម្រិតគិតមធ្យម (Medium)';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
      <div className="max-w-[768px] mx-auto space-y-6">
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          const isLast = index === messages.length - 1;
          const isMessageStreaming = isLast && !isUser && Boolean(isStreaming);

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              {isUser ? (
                /* User Bubble */
                <div className="max-w-[85%] md:max-w-[75%] rounded-[22px] bg-[#f4f4f4] px-4 py-3 text-[15px] text-[#0d0d0d] leading-relaxed whitespace-pre-wrap break-words shadow-2xs">
                  {message.content}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-200 flex flex-wrap gap-2">
                      {message.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-[12px] bg-white px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-700 shadow-2xs"
                        >
                          {att.url && att.type === 'image' ? (
                            <img
                              src={att.url}
                              alt={att.name}
                              className="w-5 h-5 rounded object-cover"
                            />
                          ) : (
                            <span>📎</span>
                          )}
                          <span className="max-w-[120px] truncate">{att.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Assistant Turn */
                <div className="w-full flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 mt-0.5">
                    <OmniLogo size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Subtle Thinking Level status badge */}
                    {(message.thinkingLevel || isMessageStreaming) && (
                      <div className="flex items-center gap-1.5 mb-2 text-[12px] text-neutral-400 select-none">
                        <Brain className={`w-3.5 h-3.5 ${isMessageStreaming ? 'text-neutral-700 animate-pulse' : 'text-neutral-400'}`} />
                        <span>
                          {isMessageStreaming
                            ? `កំពុងគិតពិចារណា (${getThinkingLabel(activeThinkingLevel)})...`
                            : getThinkingLabel(message.thinkingLevel)}
                        </span>
                      </div>
                    )}

                    {/* If message content is empty while streaming, show subtle loading dot animation */}
                    {!message.content && isMessageStreaming ? (
                      <div className="flex items-center gap-1.5 py-2 text-neutral-400">
                        <span
                          className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                    ) : (
                      <FormattedText
                        content={message.content}
                        isStreaming={isMessageStreaming}
                      />
                    )}

                    {/* Action Bar for AI response (visible when not streaming) */}
                    {!isMessageStreaming && message.content && (
                      <div className="flex items-center gap-2 mt-3 pt-1 text-neutral-400">
                        <button
                          onClick={() => handleCopy(message.id, message.content)}
                          className="p-1.5 rounded-lg hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="ចម្លងអត្ថបទ"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="ឆ្លើយតបល្អ"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="ឆ្លើយតបមិនល្អ"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                        {isLast && onRegenerate && (
                          <button
                            onClick={onRegenerate}
                            className="p-1.5 rounded-lg hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer ml-1"
                            title="បង្កើតចម្លើយឡើងវិញ"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
