import React, { useState } from 'react';
import { Search, X, MessageSquare, Clock } from 'lucide-react';
import { Conversation } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  conversations,
  onSelectConversation,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim()
    ? conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          (c.previewMessage && c.previewMessage.toLowerCase().includes(query.toLowerCase()))
      )
    : conversations;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-100">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ស្វែងរកការសន្ទនា..."
            autoFocus
            className="w-full text-[15px] text-neutral-900 placeholder:text-neutral-400 bg-transparent outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[14px] text-neutral-400">
              រកមិនឃើញការសន្ទនាដែលត្រូវនឹង "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                {query ? 'លទ្ធផលស្វែងរក' : 'ការសន្ទនាថ្មីៗ'}
              </div>
              {filtered.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MessageSquare className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[14px] text-neutral-800 font-medium truncate">
                        {conv.title}
                      </div>
                      {conv.previewMessage && (
                        <div className="text-[12px] text-neutral-400 truncate">
                          {conv.previewMessage}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-400 shrink-0 ml-2">
                    <Clock className="w-3 h-3" />
                    <span>{conv.updatedAt}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
