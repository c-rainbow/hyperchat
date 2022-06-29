import create from 'zustand';
import { ChatMessageType } from '../../common/types';

export interface ChatListState {
  chats: ChatMessageType[];
  maxSize: number;
  setMaxSize: (newSize: number) => void;
  addChat: (newChat: ChatMessageType) => void;
}

export const useChatListStore = create<ChatListState>((set, get) => ({
  chats: [],
  maxSize: 100,
  setMaxSize: (newSize: number) => {
    if (newSize < 1) {
      throw new Error('Chat list size is too small');
    }
    let currentChats = get().chats;
    if (currentChats.length > newSize) {
      currentChats = currentChats.slice(-newSize);
    }

    set({ maxSize: newSize, chats: currentChats });
  },
  addChat: (newChat: ChatMessageType) => {
    const maxSize = get().maxSize;
    const currentChats = get().chats;
    let newChats = [...currentChats, newChat];
    if (newChats.length > maxSize) {
      newChats = newChats.slice(-maxSize);
    }

    set({ chats: newChats });
  },
}));

export interface SelectedChatState {
  chat?: ChatMessageType;
  selectChat: (chat: ChatMessageType) => void;
}

export const useSelectedChatStore = create<SelectedChatState>((set) => ({
  selectChat: (chat: ChatMessageType) => set({ chat }),
}));
