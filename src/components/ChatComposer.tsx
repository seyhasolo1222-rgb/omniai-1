import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  ArrowUp,
  Square,
  Mic,
  MicOff,
  Image as ImageIcon,
  FileText,
  Camera,
  FolderOpen,
  X,
} from 'lucide-react';

export interface AttachedFile {
  id: string;
  name: string;
  type: 'image' | 'file';
  previewUrl?: string;
}

interface ChatComposerProps {
  onSendMessage: (text: string, attachments?: AttachedFile[]) => void;
  isStreaming?: boolean;
  onStopStreaming?: () => void;
  selectedModelName?: string;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  onSendMessage,
  isStreaming,
  onStopStreaming,
  selectedModelName,
}) => {
  const [text, setText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea to fit content like ChatGPT
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isStreaming) {
      onStopStreaming?.();
      return;
    }

    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;

    onSendMessage(trimmed, attachments);
    setText('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleSimulateAttachment = (name: string, type: 'image' | 'file') => {
    const newFile: AttachedFile = {
      id: Math.random().toString(36).substring(7),
      name,
      type,
    };
    setAttachments((prev) => [...prev, newFile]);
    setIsMenuOpen(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        const newFile: AttachedFile = {
          id: Math.random().toString(36).substring(7),
          name: file.name,
          type,
          previewUrl: result,
        };
        setAttachments((prev) => [...prev, newFile]);
      };

      if (type === 'image') {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
    setIsMenuOpen(false);
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const hasContent = text.trim().length > 0 || attachments.length > 0;
  const placeholderText = selectedModelName
    ? `សួរ ${selectedModelName} អ្វីក៏បាន...`
    : 'សួរ Omni AI អ្វីក៏បាន...';

  return (
    <div className="w-full max-w-[768px] mx-auto px-4 pb-3">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFileInputChange(e, 'file')}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileInputChange(e, 'image')}
      />

      {/* Main Composer Box */}
      <div className="relative rounded-[26px] bg-[#f4f4f4] border border-[#e5e5e5] shadow-xs focus-within:border-neutral-300 transition-all p-2.5 sm:p-3">
        {/* Attachment Chips Preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2 pb-2">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-800 shadow-2xs"
              >
                {file.previewUrl && file.type === 'image' ? (
                  <img
                    src={file.previewUrl}
                    alt={file.name}
                    className="w-4 h-4 rounded object-cover"
                  />
                ) : file.type === 'image' ? (
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-neutral-600" />
                )}
                <span className="max-w-[150px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(file.id)}
                  className="p-0.5 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-700 ml-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input Row */}
        <div className="flex items-start">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            rows={1}
            disabled={isStreaming}
            className="w-full max-h-[200px] py-1.5 px-2 text-[14.5px] bg-transparent text-[#0d0d0d] placeholder:text-[#8e8e8e] resize-none outline-none leading-relaxed overflow-y-auto disabled:opacity-70"
          />
        </div>

        {/* Bottom Toolbar inside Composer */}
        <div className="flex items-center justify-between pt-1">
          {/* Left Actions: (+) Attachment Button & Popover + Thinking Level Option Buttons */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                disabled={isStreaming}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/80 transition-colors border border-neutral-300/80 bg-white shadow-2xs cursor-pointer disabled:opacity-50"
                title="បន្ថែមឯកសារ"
                aria-label="Add attachment"
              >
                <Plus
                  className={`w-4 h-4 transition-transform duration-150 ${
                    isMenuOpen ? 'rotate-45' : ''
                  }`}
                />
              </button>

              {/* Attachment Dropdown Menu */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute left-0 bottom-full mb-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 text-[13.5px]">
                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.click();
                        } else {
                          handleSimulateAttachment('ឯកសារ_គំរូ.pdf', 'file');
                        }
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium">ភ្ជាប់ឯកសារ</div>
                        <div className="text-[11px] text-neutral-400">PDF, Word, Excel, TXT</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (imageInputRef.current) {
                          imageInputRef.current.click();
                        } else {
                          handleSimulateAttachment('រូបភាព_គំរូ.png', 'image');
                        }
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium">បង្ហោះរូបថត</div>
                        <div className="text-[11px] text-neutral-400">JPG, PNG, WebP</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (imageInputRef.current) {
                          imageInputRef.current.click();
                        } else {
                          handleSimulateAttachment('រូបថត_កាមេរ៉ា.jpg', 'image');
                        }
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium">កាមេរ៉ា</div>
                        <div className="text-[11px] text-neutral-400">ថតរូបផ្ទាល់ពីឧបករណ៍</div>
                      </div>
                    </button>

                    <div className="h-px bg-neutral-100 my-1" />

                    <button
                      type="button"
                      onClick={() => handleSimulateAttachment('Google_Doc.gdoc', 'file')}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                        <FolderOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium">ភ្ជាប់ពី Cloud Drive</div>
                        <div className="text-[11px] text-neutral-400">Google Drive, Dropbox</div>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Action Controls: Mic + Send/Stop Button */}
          <div className="flex items-center gap-1.5">
            {/* Microphone Button */}
            <button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              disabled={isStreaming}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70'
              } disabled:opacity-50`}
              title={isRecording ? 'បញ្ឈប់ការកត់ត្រាសំឡេង' : 'បញ្ចូលសំឡេង'}
              aria-label="Voice input"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Circular Send / Stop Button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#0d0d0d] text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-xs active:scale-95"
                title="បញ្ឈប់ការបង្កើតចម្លើយ"
                aria-label="Stop generating"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!hasContent}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  hasContent
                    ? 'bg-[#0d0d0d] text-white hover:bg-neutral-800 cursor-pointer shadow-xs active:scale-95'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
                title="ផ្ញើសារ"
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Required Disclaimer Subtext */}
      <p className="text-[11.5px] text-neutral-400 text-center mt-2 font-normal leading-normal select-none">
        Omni AI អាចមានកំហុស។ សូមផ្ទៀងផ្ទាត់ព័ត៌មានសំខាន់ៗ។
      </p>
    </div>
  );
};
