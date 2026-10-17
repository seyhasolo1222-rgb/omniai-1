import React, { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header, AVAILABLE_MODELS } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ConversationView } from './components/ConversationView';
import { ChatComposer, AttachedFile } from './components/ChatComposer';
import { VideoStudioPlaceholder } from './components/VideoStudioPlaceholder';
import { PlaceholderView } from './components/PlaceholderView';
import { SearchModal } from './components/SearchModal';
import { SettingsModal } from './components/SettingsModal';
import { SidebarMenuItemId, Conversation, ChatMessage, ThinkingLevelOption } from './types';
import { initialConversations } from './data/mockConversations';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState<SidebarMenuItemId>('new_chat');
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinkingLevel, setThinkingLevel] = useState<ThinkingLevelOption>('MEDIUM');
  const [selectedModelId, setSelectedModelId] = useState<string>('gemini-3.8-flash');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Store conversation messages keyed by conversation id
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({
    'conv-1': [
      {
        id: 'm1',
        role: 'user',
        content: 'តើខ្ញុំអាចរៀបចំ layout ដូច ChatGPT ដោយប្រើ Tailwind CSS យ៉ាងដូចម្តេច?',
        createdAt: '10:24 AM',
      },
      {
        id: 'm2',
        role: 'assistant',
        content:
          'ដើម្បីរៀបចំ Layout ដូច ChatGPT ដោយប្រើ Tailwind CSS អ្នកត្រូវការសមាសភាគសំខាន់ៗចំនួន ៣៖\n\n1. **Sidebar (របារចំហៀង)**៖ ទទឹងប្រហែល `260px` មានផ្ទៃខាងក្រោយពណ៌ប្រផេះស្រាល (`#f9f9f9`) និងអាចបង្រួមបាន (Collapsible)។\n2. **Header (របារក្បាល)**៖ កម្ពស់ `56px` មាន Model Selector នៅខាងឆ្វេង និងប៊ូតុងចែករំលែកនៅខាងស្តាំ។\n3. **Main Chat & Composer**៖ តំបន់ជជែកកណ្តាលដែលមាន Message Composer មូលកោងស្អាត (`rounded-[26px]`) នៅផ្នែកខាងក្រោម។',
        createdAt: '10:25 AM',
        thinkingLevel: 'MEDIUM',
      },
    ],
    'conv-2': [
      {
        id: 'm3',
        role: 'user',
        content: 'សូមជួយបង្កើតផែនការផ្សព្វផ្សាយផលិតផលថ្មីតាមបណ្តាញសង្គមសម្រាប់ឆ្នាំ ២០២៦។',
        createdAt: '08:45 AM',
      },
      {
        id: 'm4',
        role: 'assistant',
        content:
          'នេះជាផែនការយុទ្ធសាស្ត្រផ្សព្វផ្សាយជា ៣ ដំណាក់កាល៖\n\n• **ដំណាក់កាលទី ១ (មុនសម្ពោធ)**: បង្កើតវីដេអូខ្លី Teaser នៅលើ TikTok & Reels\n• **ដំណាក់កាលទី ២ (ថ្ងៃសម្ពោធ)**: ការផ្សាយបន្តផ្ទាល់ (Live Stream) និងសហការជាមួយ Influencers\n• **ដំណាក់កាលទី ៣ (ក្រោយសម្ពោធ)**: បង្ហាញមតិកែលម្អពីអតិថិជនដំបូង (User Testimonials)',
        createdAt: '08:46 AM',
        thinkingLevel: 'HIGH',
      },
    ],
  });

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Active Model Object
  const currentModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  // Handle select sidebar navigation item
  const handleSelectMenuItem = (id: SidebarMenuItemId) => {
    setActiveMenuItem(id);
    if (id === 'new_chat') {
      setActiveConversationId(null);
    }
  };

  // Handle select conversation from history
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setActiveMenuItem('new_chat');
  };

  // Handle delete conversation
  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  // Stop active AI streaming
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  // Handle send message from composer and stream response with selectedModelId & thinkingLevel
  const handleSendMessage = async (text: string, attachments?: AttachedFile[]) => {
    let convId = activeConversationId;

    if (!convId) {
      // Create new conversation
      convId = `conv-${Date.now()}`;
      const title = text.slice(0, 32) || 'ការសន្ទនាថ្មី';
      const newConv: Conversation = {
        id: convId,
        title,
        period: 'today',
        updatedAt: 'ឥឡូវនេះ',
        previewMessage: text,
      };

      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(convId);
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: 'ឥឡូវនេះ',
      attachments: attachments?.map((a) => ({
        name: a.name,
        type: a.type,
        url: a.previewUrl,
      })),
    };

    const aiMessageId = `msg-ai-${Date.now()}`;
    const initialAiMessage: ChatMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      createdAt: 'ឥឡូវនេះ',
      thinkingLevel,
    };

    const currentHistory = messagesMap[convId] || [];
    const updatedMessages = [...currentHistory, userMessage];

    // Update state with user message + empty assistant placeholder
    setMessagesMap((prev) => ({
      ...prev,
      [convId!]: [...updatedMessages, initialAiMessage],
    }));

    // Initiate real-time streaming request to selected model with thinkingLevel
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModelId,
          thinkingLevel,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          attachments: attachments?.map((a) => ({
            name: a.name,
            type: a.type,
            previewUrl: a.previewUrl,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `Error ${response.status}: Failed to reach Gemini API.`;
        setMessagesMap((prev) => ({
          ...prev,
          [convId!]: (prev[convId!] || []).map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: `⚠️ ${errorMessage}` } : msg
          ),
        }));
        setIsStreaming(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body stream is not available');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedText += parsed.text;
                setMessagesMap((prev) => ({
                  ...prev,
                  [convId!]: (prev[convId!] || []).map((msg) =>
                    msg.id === aiMessageId ? { ...msg, content: accumulatedText } : msg
                  ),
                }));
              }
              if (parsed.error) {
                accumulatedText += `\n\n⚠️ ${parsed.error}`;
                setMessagesMap((prev) => ({
                  ...prev,
                  [convId!]: (prev[convId!] || []).map((msg) =>
                    msg.id === aiMessageId ? { ...msg, content: accumulatedText } : msg
                  ),
                }));
              }
            } catch (err) {
              console.warn('Error parsing SSE chunk:', err);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Fetch error:', err);
        setMessagesMap((prev) => ({
          ...prev,
          [convId!]: (prev[convId!] || []).map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  content:
                    msg.content ||
                    '⚠️ មិនអាចតភ្ជាប់ទៅម៉ាស៊ីន AI បានទេ។ សូមប្រាកដថា GEMINI_API_KEY ត្រូវបានកំណត់នៅក្នុងផ្ទាំង Settings > Secrets។',
                }
              : msg
          ),
        }));
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate last response
  const handleRegenerate = () => {
    if (!activeConversationId) return;
    const currentList = messagesMap[activeConversationId] || [];
    if (currentList.length === 0) return;

    const lastUserMsg = [...currentList].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const currentMessages = activeConversationId ? messagesMap[activeConversationId] || [] : [];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-[#0d0d0d]">
      {/* 1. Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeItem={activeMenuItem}
        onSelectItem={handleSelectMenuItem}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-white relative">
        {/* Top Header with Custom Display Names & Thinking Level */}
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewChat={() => {
            setActiveConversationId(null);
            setActiveMenuItem('new_chat');
          }}
          thinkingLevel={thinkingLevel}
          onChangeThinkingLevel={setThinkingLevel}
          selectedModelId={selectedModelId}
          onSelectModel={setSelectedModelId}
        />

        {/* Dynamic Main Workspace depending on activeMenuItem */}
        {activeMenuItem === 'create_video' ? (
          <VideoStudioPlaceholder
            onBackToChat={() => {
              setActiveMenuItem('new_chat');
            }}
          />
        ) : activeMenuItem !== 'new_chat' && activeMenuItem !== 'search' ? (
          <PlaceholderView
            type={activeMenuItem}
            onBackToChat={() => {
              setActiveMenuItem('new_chat');
            }}
          />
        ) : (
          /* Conversational Screen */
          <div className="flex-1 flex flex-col h-full min-h-0">
            {/* If no active conversation or messages are empty, show WelcomeScreen */}
            {!activeConversationId || currentMessages.length === 0 ? (
              <WelcomeScreen onQuickPrompt={(p) => handleSendMessage(p)} />
            ) : (
              <ConversationView
                title={activeConv ? activeConv.title : 'Omni AI'}
                messages={currentMessages}
                isStreaming={isStreaming}
                activeThinkingLevel={thinkingLevel}
                onRegenerate={handleRegenerate}
              />
            )}

            {/* Pinned Bottom Message Composer */}
            <ChatComposer
              onSendMessage={handleSendMessage}
              isStreaming={isStreaming}
              onStopStreaming={handleStopStreaming}
              selectedModelName={currentModel.name}
            />
          </div>
        )}
      </main>

      {/* 3. Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false);
          if (activeMenuItem === 'search') {
            setActiveMenuItem('new_chat');
          }
        }}
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
      />

      {/* 4. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
