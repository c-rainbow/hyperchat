import { ChatManager } from "./lib/chatManager";


/**
 * 
 * @param ipcMain Electron's IpcMain object
 */
export function addIpcHandlers(ipcMain: Electron.IpcMain, chatManager: ChatManager) {

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

  console.log('Handlers were added');
}