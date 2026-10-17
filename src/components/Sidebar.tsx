import React, { useState } from 'react';
import {
  SquarePen,
  Search,
  Image as ImageIcon,
  BookOpen,
  Boxes,
  Video,
  Compass,
  PanelLeftClose,
  MoreHorizontal,
  Trash2,
  Share2,
  Pencil,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
} from 'lucide-react';
import { SidebarMenuItemId, Conversation } from '../types';
import { OmniLogo } from './OmniLogo';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeItem: SidebarMenuItemId;
  onSelectItem: (id: SidebarMenuItemId) => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeItem,
  onSelectItem,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onOpenSettings,
  onOpenSearch,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeMenuConvId, setActiveMenuConvId] = useState<string | null>(null);

  // Group conversations
  const todayConvs = conversations.filter((c) => c.period === 'today');
  const prev7Convs = conversations.filter((c) => c.period === 'previous_7_days');
  const prev30Convs = conversations.filter((c) => c.period === 'previous_30_days');

  // Exact 7 items in exact requested order
  const mainMenuItems = [
    {
      id: 'new_chat' as SidebarMenuItemId,
      label: 'ជជែកថ្មី',
      icon: SquarePen,
      onClick: () => onSelectItem('new_chat'),
    },
    {
      id: 'search' as SidebarMenuItemId,
      label: 'ស្វែងរក',
      icon: Search,
      onClick: () => {
        onSelectItem('search');
        onOpenSearch();
      },
    },
    {
      id: 'images' as SidebarMenuItemId,
      label: 'រូបភាព',
      icon: ImageIcon,
      onClick: () => onSelectItem('images'),
    },
    {
      id: 'library' as SidebarMenuItemId,
      label: 'បណ្ណាល័យ',
      icon: BookOpen,
      onClick: () => onSelectItem('library'),
    },
    {
      id: 'projects' as SidebarMenuItemId,
      label: 'គម្រោង',
      icon: Boxes,
      onClick: () => onSelectItem('projects'),
    },
    {
      id: 'create_video' as SidebarMenuItemId,
      label: 'បង្កើតវីដេអូ AI',
      icon: Video,
      onClick: () => onSelectItem('create_video'),
      badge: 'ថ្មី',
    },
    {
      id: 'explore_gpts' as SidebarMenuItemId,
      label: 'ស្វែងរក GPT',
      icon: Compass,
      onClick: () => onSelectItem('explore_gpts'),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden transition-opacity duration-200"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-[260px] bg-[#f9f9f9] border-r border-[#ececec] select-none transition-all duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:-ml-[260px]'
        }`}
      >
        {/* Top Header / Brand Row */}
        <div className="flex items-center justify-between h-[56px] px-3 border-b border-[#f0f0f0]">
          <button
            onClick={() => onSelectItem('new_chat')}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#ececec] transition-colors text-left group"
          >
            <OmniLogo size={24} />
            <span className="font-semibold text-[15px] tracking-tight text-[#0d0d0d] font-sans">
              Omni AI
            </span>
          </button>

          <button
            onClick={onToggle}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-[#ececec] rounded-lg transition-colors"
            title="បិទរបារចំហៀង"
            aria-label="Toggle sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Top 7 Navigation Menu Items */}
        <div className="px-2 py-2 space-y-0.5 border-b border-[#f0f0f0]">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-[14px] rounded-lg transition-colors text-left ${
                  isSelected
                    ? 'bg-[#ececec] text-[#0d0d0d] font-medium'
                    : 'text-[#424242] hover:bg-[#ececec] hover:text-[#0d0d0d]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-[18px] h-[18px] shrink-0 text-neutral-600" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[11px] font-medium text-neutral-500 bg-neutral-200/80 px-1.5 py-0.2 rounded text-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Conversation History Section */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
          {/* Today Group */}
          {todayConvs.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[11px] font-semibold text-neutral-400 tracking-wider">
                ថ្ងៃនេះ
              </div>
              <div className="space-y-0.5 mt-0.5">
                {todayConvs.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isSelected={activeConversationId === conv.id}
                    isMenuOpen={activeMenuConvId === conv.id}
                    onSelect={() => onSelectConversation(conv.id)}
                    onToggleMenu={(e) => {
                      e.stopPropagation();
                      setActiveMenuConvId(activeMenuConvId === conv.id ? null : conv.id);
                    }}
                    onDelete={() => {
                      onDeleteConversation(conv.id);
                      setActiveMenuConvId(null);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Previous 7 Days Group */}
          {prev7Convs.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[11px] font-semibold text-neutral-400 tracking-wider">
                ៧ ថ្ងៃកន្លងទៅ
              </div>
              <div className="space-y-0.5 mt-0.5">
                {prev7Convs.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isSelected={activeConversationId === conv.id}
                    isMenuOpen={activeMenuConvId === conv.id}
                    onSelect={() => onSelectConversation(conv.id)}
                    onToggleMenu={(e) => {
                      e.stopPropagation();
                      setActiveMenuConvId(activeMenuConvId === conv.id ? null : conv.id);
                    }}
                    onDelete={() => {
                      onDeleteConversation(conv.id);
                      setActiveMenuConvId(null);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Previous 30 Days Group */}
          {prev30Convs.length > 0 && (
            <div>
              <div className="px-2.5 py-1 text-[11px] font-semibold text-neutral-400 tracking-wider">
                ៣០ ថ្ងៃកន្លងទៅ
              </div>
              <div className="space-y-0.5 mt-0.5">
                {prev30Convs.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isSelected={activeConversationId === conv.id}
                    isMenuOpen={activeMenuConvId === conv.id}
                    onSelect={() => onSelectConversation(conv.id)}
                    onToggleMenu={(e) => {
                      e.stopPropagation();
                      setActiveMenuConvId(activeMenuConvId === conv.id ? null : conv.id);
                    }}
                    onDelete={() => {
                      onDeleteConversation(conv.id);
                      setActiveMenuConvId(null);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Area at Bottom */}
        <div className="relative p-2 border-t border-[#f0f0f0]">
          {/* Profile Popover / Settings Dropdown */}
          {profileMenuOpen && (
            <div className="absolute bottom-full left-2 right-2 mb-2 bg-white rounded-xl shadow-lg border border-[#e5e5e5] p-1.5 z-50 text-[13px] animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                <div className="font-medium text-neutral-900">Seyha Solo</div>
                <div className="text-[11px] text-neutral-400 truncate">seyhasolo1222@gmail.com</div>
              </div>

              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-neutral-500" />
                <span>ការកំណត់ (Settings)</span>
              </button>

              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  window.open('https://help.openai.com', '_blank');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors text-left"
              >
                <HelpCircle className="w-4 h-4 text-neutral-500" />
                <span>ជំនួយ និងមតិកែលម្អ</span>
              </button>

              <div className="h-px bg-neutral-100 my-1" />

              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>ចាកចេញ (Log out)</span>
              </button>
            </div>
          )}

          {/* User Button */}
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#ececec] transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center font-semibold text-xs shrink-0 tracking-wide">
                SS
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-medium text-neutral-900 truncate">Seyha Solo</div>
                <div className="text-[11px] text-neutral-400">គម្រោងឥតគិតថ្លៃ</div>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 shrink-0" />
          </button>
        </div>
      </aside>
    </>
  );
};

interface ConversationItemProps {
  conv: Conversation;
  isSelected: boolean;
  isMenuOpen: boolean;
  onSelect: () => void;
  onToggleMenu: (e: React.MouseEvent) => void;
  onDelete: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conv,
  isSelected,
  isMenuOpen,
  onSelect,
  onToggleMenu,
  onDelete,
}) => {
  return (
    <div className="relative group">
      <button
        onClick={onSelect}
        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[13.5px] rounded-lg transition-colors text-left ${
          isSelected
            ? 'bg-[#ececec] text-[#0d0d0d] font-medium'
            : 'text-[#424242] hover:bg-[#ececec] hover:text-[#0d0d0d]'
        }`}
      >
        <span className="truncate pr-4">{conv.title}</span>

        {/* Action Trigger Button */}
        <div
          role="button"
          tabIndex={0}
          onClick={onToggleMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleMenu(e as any);
            }
          }}
          className={`p-1 rounded-md hover:bg-neutral-300/60 transition-opacity ${
            isSelected || isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          title="ជម្រើសបន្ថែម"
        >
          <MoreHorizontal className="w-3.5 h-3.5 text-neutral-600" />
        </div>
      </button>

      {/* Mini Dropdown Menu for Conversation */}
      {isMenuOpen && (
        <div
          className="absolute right-2 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-30 text-[12.5px]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => alert('មុខងារចែករំលែកត្រូវបានរៀបចំ')}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-neutral-700 hover:bg-neutral-100 text-left"
          >
            <Share2 className="w-3.5 h-3.5 text-neutral-500" />
            <span>ចែករំលែក</span>
          </button>
          <button
            onClick={() => alert('ប្តូរឈ្មោះការសន្ទនា')}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-neutral-700 hover:bg-neutral-100 text-left"
          >
            <Pencil className="w-3.5 h-3.5 text-neutral-500" />
            <span>ប្តូរឈ្មោះ</span>
          </button>
          <div className="h-px bg-neutral-100 my-1" />
          <button
            onClick={onDelete}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 text-left"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>លុបចោល</span>
          </button>
        </div>
      )}
    </div>
  );
};
