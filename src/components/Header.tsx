import React, { useState } from 'react';
import {
  PanelLeft,
  ChevronDown,
  SquarePen,
  Share,
  Sparkles,
  Zap,
  Check,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Brain,
  Gauge,
} from 'lucide-react';
import { ThinkingLevelOption } from '../types';

export interface ModelConfig {
  id: string;
  name: string;
  desc: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'ជំនួយការទូទៅ (Smart Assistant)',
    desc: 'ម៉ូដែលទូទៅឆ្លាតវៃ គាំទ្រការគិតស៊ីជម្រៅ (Thinking Level)',
    badge: 'លំនាំដើម',
    icon: Sparkles,
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'ជំនួយការលឿនរហ័ស (Speedy Bot)',
    desc: 'ឆ្លើយរហ័សទាន់ចិត្ត សន្សំសំចៃពេលវេលាសម្រាប់ការងារទូទៅ',
    badge: 'លឿន',
    icon: Zap,
  },
  {
    id: 'gemini-3.1-pro',
    name: 'ជំនួយការជំនាញខ្ពស់ (Expert AI)',
    desc: 'ការវិភាគ និងការគិតកម្រិតខ្ពស់សម្រាប់គម្រោងស្មុគស្មាញ (Omni AI Pro)',
    badge: 'ជំនាញ',
    icon: ShieldCheck,
  },
];

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onNewChat: () => void;
  thinkingLevel: ThinkingLevelOption;
  onChangeThinkingLevel: (level: ThinkingLevelOption) => void;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  onNewChat,
  thinkingLevel,
  onChangeThinkingLevel,
  selectedModelId,
  onSelectModel,
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [thinkingDropdownOpen, setThinkingDropdownOpen] = useState(false);
  const [temporaryChat, setTemporaryChat] = useState(false);

  const activeModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  const thinkingOptions: {
    level: ThinkingLevelOption;
    labelKm: string;
    labelEn: string;
    desc: string;
    speed: string;
  }[] = [
    {
      level: 'LOW',
      labelKm: 'ទាប (Low)',
      labelEn: 'Low',
      desc: 'ឆ្លើយតបរហ័សទាន់ចិត្ត សន្សំសំចៃពេលវេលា',
      speed: 'លឿនបំផុត',
    },
    {
      level: 'MEDIUM',
      labelKm: 'មធ្យម (Medium)',
      labelEn: 'Medium',
      desc: 'តុល្យភាពរវាងល្បឿនឆ្លើយ និងជម្រៅនៃការគិត',
      speed: 'តុល្យភាពល្អ',
    },
    {
      level: 'HIGH',
      labelKm: 'ខ្ពស់ (High)',
      labelEn: 'High',
      desc: 'គិតពិចារណាស៊ីជម្រៅបំផុត សម្រាប់បញ្ហាស្មុគស្មាញ',
      speed: 'គិតល្អិតល្អន់',
    },
  ];

  const currentThinking =
    thinkingOptions.find((t) => t.level === thinkingLevel) || thinkingOptions[1];

  return (
    <header className="relative flex items-center justify-between h-[56px] px-3 md:px-4 bg-white/95 backdrop-blur-md sticky top-0 z-30 shrink-0 border-b border-[#f2f2f2]">
      {/* Left side: Sidebar Toggle + Model Selector + Thinking Level */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          title={isSidebarOpen ? 'បិទរបារចំហៀង' : 'បើករបារចំហៀង'}
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* Model Selector Dropdown Trigger with Custom Display Names */}
        <div className="relative">
          <button
            onClick={() => {
              setModelDropdownOpen(!modelDropdownOpen);
              setThinkingDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 text-neutral-800 transition-colors group cursor-pointer max-w-[260px] sm:max-w-none"
            title="ជ្រើសរើសជំនួយការ AI"
          >
            <div className="flex items-center gap-1.5 font-semibold text-[14px] sm:text-[15.5px] tracking-tight truncate">
              <span className="truncate">{activeModel.name}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-transform shrink-0 ${
                modelDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Model Selector Dropdown Menu */}
          {modelDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setModelDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1.5 w-84 bg-white rounded-2xl shadow-xl border border-neutral-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[11px] font-semibold text-neutral-400 px-3 py-1.5 uppercase tracking-wider">
                  ជ្រើសរើសជំនួយការ AI (Select Assistant)
                </div>
                <div className="space-y-1">
                  {AVAILABLE_MODELS.map((model) => {
                    const isCurrent = model.id === selectedModelId;
                    const Icon = model.icon;
                    return (
                      <button
                        key={model.id}
                        onClick={() => {
                          onSelectModel(model.id);
                          setModelDropdownOpen(false);
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isCurrent ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] font-medium text-neutral-900 truncate">
                              {model.name}
                            </span>
                            {isCurrent && <Check className="w-4 h-4 text-neutral-900 shrink-0 ml-1" />}
                          </div>
                          <p className="text-[12px] text-neutral-500 mt-0.5 leading-snug">
                            {model.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="h-px bg-neutral-100 my-2" />

                {/* Temporary Chat Toggle */}
                <div className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-neutral-50 transition-colors">
                  <div className="pr-2">
                    <div className="text-[13px] font-medium text-neutral-800">
                      ការជជែកបណ្តោះអាសន្ន
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      មិនរក្សាទុកក្នុងប្រវត្តិជជែកឡើយ
                    </div>
                  </div>
                  <button
                    onClick={() => setTemporaryChat(!temporaryChat)}
                    className="text-neutral-600 hover:text-neutral-900 cursor-pointer"
                  >
                    {temporaryChat ? (
                      <ToggleRight className="w-6 h-6 text-neutral-900" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-neutral-300" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Thinking Level (កម្រិតនៃការគិត) Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setThinkingDropdownOpen(!thinkingDropdownOpen);
              setModelDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-200/80 bg-neutral-50/80 hover:bg-neutral-100 text-neutral-800 text-[13px] font-medium transition-colors cursor-pointer"
            title="ជ្រើសរើសកម្រិតនៃការគិត (Thinking Level)"
          >
            <Brain className="w-3.5 h-3.5 text-neutral-700" />
            <span className="hidden md:inline text-neutral-500">កម្រិតនៃការគិត:</span>
            <span className="font-semibold text-neutral-900">{currentThinking.labelKm}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                thinkingDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Thinking Level Dropdown Menu */}
          {thinkingDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setThinkingDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1.5 w-76 bg-white rounded-2xl shadow-xl border border-neutral-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2 px-3 py-1.5 text-[11.5px] font-semibold text-neutral-400 uppercase tracking-wider">
                  <Brain className="w-3.5 h-3.5 text-neutral-500" />
                  <span>កម្រិតនៃការគិត (Thinking Level)</span>
                </div>

                <div className="space-y-1 mt-1">
                  {thinkingOptions.map((opt) => {
                    const isSelected = opt.level === thinkingLevel;
                    return (
                      <button
                        key={opt.level}
                        onClick={() => {
                          onChangeThinkingLevel(opt.level);
                          setThinkingDropdownOpen(false);
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-100 text-neutral-900'
                            : 'hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <div className="mt-0.5">
                          <Gauge className={`w-4 h-4 ${isSelected ? 'text-neutral-900' : 'text-neutral-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[13.5px] font-semibold">
                              {opt.labelKm}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-neutral-900" />}
                          </div>
                          <p className="text-[12px] text-neutral-500 mt-0.5 leading-snug">
                            {opt.desc}
                          </p>
                          <span className="inline-block mt-1 text-[11px] font-medium text-neutral-500 bg-neutral-200/60 px-1.5 py-0.2 rounded">
                            {opt.speed}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={onNewChat}
          className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          title="ជជែកថ្មី"
          aria-label="New chat"
        >
          <SquarePen className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Omni AI', url: window.location.href }).catch(() => {});
            }
          }}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          title="ចែករំលែក"
        >
          <Share className="w-4 h-4" />
          <span>ចែករំលែក</span>
        </button>
      </div>
    </header>
  );
};
