import React, { useState } from 'react';
import { X, Settings, User, Shield, Moon, Sun, Globe } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'account' | 'security'>('general');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [language, setLanguage] = useState<'km' | 'en'>('km');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col md:flex-row h-[480px]">
        {/* Left Navigation Tabs */}
        <div className="w-full md:w-52 bg-neutral-50/70 border-b md:border-b-0 md:border-r border-neutral-200 p-3 flex md:flex-col gap-1 shrink-0">
          <div className="hidden md:block px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            ការកំណត់ (Settings)
          </div>

          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-colors text-left ${
              activeTab === 'general'
                ? 'bg-neutral-200/70 text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>ទូទៅ (General)</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-colors text-left ${
              activeTab === 'account'
                ? 'bg-neutral-200/70 text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>គណនី (Account)</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-colors text-left ${
              activeTab === 'security'
                ? 'bg-neutral-200/70 text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>សុវត្ថិភាព (Security)</span>
          </button>
        </div>

        {/* Content Pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <h3 className="text-[17px] font-semibold text-neutral-900">
              {activeTab === 'general' && 'ការកំណត់ទូទៅ'}
              {activeTab === 'account' && 'ព័ត៌មានគណនី'}
              {activeTab === 'security' && 'សុវត្ថិភាព និងភាពឯកជន'}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[14px]">
            {activeTab === 'general' && (
              <>
                {/* Theme Selector */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div>
                    <div className="font-medium text-neutral-800">រូបរាងចំណុចប្រទាក់ (Theme)</div>
                    <div className="text-xs text-neutral-400">ជ្រើសរើសទម្រង់ពណ៌ដែលអ្នកពេញចិត្ត</div>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                    <button
                      onClick={() => setTheme('light')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        theme === 'light' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-600'
                      }`}
                    >
                      ភ្លឺ (Light)
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        theme === 'dark' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-600'
                      }`}
                    >
                      ងងឹត (Dark)
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        theme === 'system' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-600'
                      }`}
                    >
                      ប្រព័ន្ធ
                    </button>
                  </div>
                </div>

                {/* Language Selector */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div>
                    <div className="font-medium text-neutral-800">ភាសា (Language)</div>
                    <div className="text-xs text-neutral-400">ភាសាបង្ហាញសម្រាប់គេហទំព័រ</div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'km' | 'en')}
                    className="px-3 py-1.5 text-xs rounded-lg border border-neutral-200 bg-white text-neutral-800 focus:outline-none"
                  >
                    <option value="km">ភាសាខ្មែរ (Khmer)</option>
                    <option value="en">English (US)</option>
                  </select>
                </div>

                {/* Clear all chats */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-800">លុបប្រវត្តិជជែកទាំងអស់</div>
                    <div className="text-xs text-neutral-400">លុបចោលការសន្ទនាទាំងអស់ចេញពីគណនី</div>
                  </div>
                  <button
                    onClick={() => alert('ជម្រើសនេះនឹងលុបប្រវត្តិជជែករបស់អ្នក។')}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                  >
                    លុបទាំងអស់
                  </button>
                </div>
              </>
            )}

            {activeTab === 'account' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-neutral-100">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-base">
                    SS
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">Seyha Solo</div>
                    <div className="text-xs text-neutral-400">seyhasolo1222@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-600">កញ្ចប់សេវាកម្ម</span>
                  <span className="text-xs font-medium bg-neutral-100 px-2.5 py-1 rounded-md text-neutral-800">
                    Omni AI ឥតគិតថ្លៃ
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-neutral-600">ធ្វើបច្ចុប្បន្នភាពគណនីទៅ Plus</span>
                  <button
                    onClick={() => alert('គម្រោង Plus នឹងមានក្នុងពេលឆាប់ៗនេះ')}
                    className="px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    ដំឡើងទៅ Plus
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <div>
                    <div className="font-medium text-neutral-800">ការផ្ទៀងផ្ទាត់ ២ ជាន់ (2FA)</div>
                    <div className="text-xs text-neutral-400">ការពារគណនីរបស់អ្នកបន្ថែម</div>
                  </div>
                  <button
                    onClick={() => alert('មុខងារ 2FA នឹងបើកដំណើរការឆាប់ៗ')}
                    className="px-3 py-1.5 text-xs font-medium border border-neutral-200 rounded-lg hover:bg-neutral-50"
                  >
                    បើកដំណើរការ
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-800">ឧបករណ៍ដែលកំពុងភ្ជាប់</div>
                    <div className="text-xs text-neutral-400">Chrome នៅលើ macOS · សកម្មភាពបច្ចុប្បន្ន</div>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">កំពុងប្រើ</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
