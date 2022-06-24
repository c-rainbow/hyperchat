import create from 'zustand';
import { ChatMessageType } from '../../common/types';

export interface SelectedChatState {
  chat?: ChatMessageType;
  selectChat: (chat: ChatMessageType) => void;
}

export const useSelectedChatStore = create<SelectedChatState>((set) => ({
  selectChat: (chat: ChatMessageType) => set({ chat }),
}));
