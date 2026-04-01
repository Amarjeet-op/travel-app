import { create } from 'zustand';
import type { Conversation } from '@/types/chat';

interface ChatState {
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  clearActiveConversation: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversation: null,
  setActiveConversation: (conv) => set({ activeConversation: conv }),
  clearActiveConversation: () => set({ activeConversation: null }),
}));
