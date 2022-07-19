import { ChatMessageType } from '../common/types';
import { IChatManager } from './lib/chatManager';
import { IChatMemoManager } from './lib/chatMemoManager';
import { AuthManager } from './lib/authManager';

const clientId = '6fjj7iajdlzf75do1evi2fswkul6rs';
const redirectUri = 'http://localhost:8888/home';

/**
 *
 * @param ipcMain Electron's IpcMain object
 */
export function addIpcHandlers(
  ipcMain: Electron.IpcMain,
  chatManager: IChatManager,
  chatMemoManager: IChatMemoManager,
  authManager: AuthManager
) {
  ipcMain.on('ping', async (event, message: string) => {
    console.log('Ping message:', message);
  });

  ipcMain.on('chat.join', async (event, channel: string) => {
    console.log('Joining a channel:', channel);
    await chatManager.join(channel);
  });

  ipcMain.on('chat.part', async (event, channel: string) => {
    console.log('Parting from a channel:', channel);
    await chatManager.part(channel);
  });

  ipcMain.on('chat.star', async (event, chat: ChatMessageType) => {
    console.log('Starring a chat:', chat);
    await chatMemoManager.starChat(chat);
  });

  ipcMain.on('chat.unstar', async (event, chatId: string) => {
    console.log('Unstarring from a channel:', chatId);
    await chatMemoManager.unstarChat(chatId);
  });

  ipcMain.on('user.login', async (event) => {
    await authManager.login();
  });

  ipcMain.on('user.logout', (event) => {
    authManager.logout();
  });

  console.log('Handlers were added');
}
