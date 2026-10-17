import React from 'react';
import { OmniLogo } from './OmniLogo';

interface WelcomeScreenProps {
  onQuickPrompt?: (text: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onQuickPrompt }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 select-none">
      <div className="flex flex-col items-center text-center max-w-xl mx-auto space-y-4">
        {/* Subtle, refined Omni AI emblem */}
        <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-200/60 mb-2">
          <OmniLogo size={28} />
        </div>

        {/* Centered Welcome Heading in Khmer */}
        <h1 className="text-[26px] sm:text-[30px] font-semibold text-[#0d0d0d] tracking-tight leading-snug">
          តើថ្ងៃនេះខ្ញុំអាចជួយអ្វីអ្នកបានខ្លះ?
        </h1>
      </div>
    </div>
  );
};
