import { CreateFromBitmapOptions } from 'electron';
import { ChatUserstate } from 'tmi.js';
import create, { StateCreator } from 'zustand';
import { ChatFragment } from '../../common/twitch-ext-emotes';



export interface SelectedUserState {
  user?: ChatUserstate;
  selectUser: (user: ChatUserstate) => void;
}


export const useSelectedUserStore = create<SelectedUserState>((set) => ({
  user: null,
  selectUser: (user: ChatUserstate) => set({ user }),
}));


export interface SelectedChatState {
  user?: ChatUserstate;
  chat?: ChatFragment[];
  selectChat: (user: ChatUserstate, chat: ChatFragment[]) => void;
}


export const useSelectedChatStore = create<SelectedChatState>((set) => ({
  user: null,
  selectChat: (user: ChatUserstate, chat: ChatFragment[]) => set({ user, chat }),
}));