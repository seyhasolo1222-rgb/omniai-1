import React from 'react';
import { ArrowLeft, Image as ImageIcon, BookOpen, Boxes, Compass } from 'lucide-react';
import { SidebarMenuItemId } from '../types';

interface PlaceholderViewProps {
  type: SidebarMenuItemId;
  onBackToChat: () => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ type, onBackToChat }) => {
  const configs = {
    images: {
      title: 'វិចិត្រសាលរូបភាព (Images)',
      desc: 'ស្វែងរក និងបង្កើតរូបភាពជាមួយ Omni AI',
      icon: ImageIcon,
      emptyText: 'មិនទាន់មានរូបភាពដែលបានបង្កើតនៅឡើយទេ',
    },
    library: {
      title: 'បណ្ណាល័យ (Library)',
      desc: 'ឯកសារ គំនិត និងការសន្ទនាដែលបានរក្សាទុក',
      icon: BookOpen,
      emptyText: 'បណ្ណាល័យរបស់អ្នកទទេស្អាត',
    },
    projects: {
      title: 'គម្រោងការងារ (Projects)',
      desc: 'រៀបចំការសន្ទនា និងឯកសារតាមគម្រោងជាក់លាក់',
      icon: Boxes,
      emptyText: 'មិនទាន់មានគម្រោងការងារត្រូវបានបង្កើតទេ',
    },
    explore_gpts: {
      title: 'ស្វែងរក GPT (Explore GPTs)',
      desc: 'ស្វែងរកម៉ូដែល AI ជំនាញឯកទេសសម្រាប់តម្រូវការផ្សេងៗ',
      icon: Compass,
      emptyText: 'បញ្ជី GPT ជំនាញនឹងបង្ហាញនៅទីនេះ',
    },
    new_chat: {
      title: 'ជជែកថ្មី',
      desc: '',
      icon: Compass,
      emptyText: '',
    },
    search: {
      title: 'ស្វែងរក',
      desc: '',
      icon: Compass,
      emptyText: '',
    },
    create_video: {
      title: 'បង្កើតវីដេអូ',
      desc: '',
      icon: Compass,
      emptyText: '',
    },
  };

  const current = configs[type] || configs.library;
  const Icon = current.icon;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 select-none">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto text-neutral-800">
          <Icon className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-[#0d0d0d]">{current.title}</h2>
          <p className="text-[13.5px] text-neutral-500">{current.desc}</p>
        </div>

        <div className="p-8 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 text-neutral-400 text-[13px]">
          {current.emptyText}
        </div>

        <div>
          <button
            onClick={onBackToChat}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 text-[13px] font-medium hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ត្រឡប់ទៅការជជែក</span>
          </button>
        </div>
      </div>
    </div>
  );
};
