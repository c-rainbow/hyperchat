import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import {
  ChatFragment,
  EmoteParser,
  TwitchEmoteTags,
} from '../common/twitch-ext-emotes';
import { createWindow } from './helpers';
import {
  translate,
  translateToEngOrKor,
  translateToEngOrKorFragments,
} from './lib/translator';

const isProd: boolean = process.env.NODE_ENV === 'production';

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
})();

const emoteParser = new EmoteParser();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.handle('translate', async (event, line) => {
  const result = await translate(line);
  return result;
});

ipcMain.handle('translateToEngOrKor', async (event, line) => {
  const result = await translateToEngOrKor(line);
  return result;
});

ipcMain.handle(
  'translateFragments',
  async (event, fragments: ChatFragment[]) => {
    const result = await translateToEngOrKorFragments(fragments);
    return result;
  }
);

ipcMain.handle(
  'getFragments',
  async (
    event,
    channelId: string,
    message: string,
    emoteTags: TwitchEmoteTags
  ) => {
    const fragments = await emoteParser.parse(channelId, message, emoteTags);
    return fragments;
  }
);
