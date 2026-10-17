import React from 'react';
import { Video, Sparkles, Film, ArrowLeft } from 'lucide-react';

interface VideoStudioPlaceholderProps {
  onBackToChat: () => void;
}

export const VideoStudioPlaceholder: React.FC<VideoStudioPlaceholderProps> = ({ onBackToChat }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 select-none">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Modern minimal Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto text-neutral-800 shadow-2xs">
          <Video className="w-8 h-8" />
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-xs font-medium text-neutral-700">
            <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            <span>កំពុងរៀបចំស្ទូឌីយោវីដេអូ</span>
          </div>
          <h2 className="text-2xl font-semibold text-[#0d0d0d] tracking-tight">
            បង្កើតវីដេអូ AI (Omni Video Studio)
          </h2>
          <p className="text-[14px] text-neutral-500 leading-relaxed max-w-sm mx-auto">
            ស្ទូឌីយោវីដេអូ AI ជំនាន់ក្រោយ បែប CapCut នឹងត្រូវដាក់បញ្ចូលក្នុងជំហានបន្ទាប់ បន្ទាប់ពីចំណុចប្រទាក់គេហទំព័រត្រូវបានអនុម័ត។
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/60 text-left text-[13px] text-neutral-600 space-y-2">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-neutral-800 shrink-0" />
            <span>បង្កើតវីដេអូពីអត្ថបទ (Text-to-Video Generation)</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-800 shrink-0" />
            <span>ការកាត់ត និងបញ្ចូលសំឡេងស្វ័យប្រវត្តិ</span>
          </div>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-neutral-800 shrink-0" />
            <span>ទ្រង់ទ្រាយសម្រាប់ TikTok, YouTube Shorts & Reels</span>
          </div>
        </div>

        {/* Back to Chat Button */}
        <div>
          <button
            onClick={onBackToChat}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0d0d0d] text-white text-[14px] font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ត្រឡប់ទៅការជជែក (Back to Chat)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
