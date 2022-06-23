import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { translate, translateToEngOrKor } from './lib/translator';
import { EmoteManager } from '../common/emotes';

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

const emoteManager = new EmoteManager();

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

ipcMain.handle('getFragments', async (event, channel: string, text: string, emotes: {[emoteId: string]: string[]}) => {
  console.log('Inside getFragments');
  const fragments = await emoteManager.convertTextToFragments(channel, text, emotes);
  return fragments;
});
