import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { Client } from 'tmi.js';
import { createWindow } from './helpers';
import { addIpcHandlers } from './ipcHandlers';
import { AuthManager } from './lib/authManager';
import { ChatManager } from './lib/chatManager';
import defaultChatMemoManager from './lib/chatMemoManager';
import defaultEmoteParser from './lib/emoteParser';
import defaultTranslator from './lib/translator';

let chatManager: ChatManager = null;
let authManager: AuthManager = null;

const isProd: boolean = process.env.NODE_ENV === 'production';
const twitchClientId = process.env.TWITCH_CLIENT_ID || '6fjj7iajdlzf75do1evi2fswkul6rs';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }

  chatManager = new ChatManager(
    mainWindow,
    new Client({}),
    defaultEmoteParser,
    defaultTranslator
  );
  await chatManager.connect();

  authManager = new AuthManager(twitchClientId);

  // Add event handlers
  addIpcHandlers(ipcMain, chatManager, defaultChatMemoManager, authManager);
  console.log('App is ready');
})();

app.on('window-all-closed', async () => {
  await chatManager.disconnect();
  app.quit();
});
