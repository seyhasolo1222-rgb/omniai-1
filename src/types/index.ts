export type SidebarMenuItemId =
  | 'new_chat'
  | 'search'
  | 'images'
  | 'library'
  | 'projects'
  | 'create_video'
  | 'explore_gpts';

export type ThinkingLevelOption = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Conversation {
  id: string;
  title: string;
  period: 'today' | 'previous_7_days' | 'previous_30_days';
  updatedAt: string;
  previewMessage?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  thinkingLevel?: ThinkingLevelOption;
  attachments?: {
    name: string;
    type: 'image' | 'file';
    url?: string;
  }[];
}
