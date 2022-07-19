import { ApiClient } from "@twurple/api";
import { ElectronAuthProvider } from "@twurple/auth-electron";
import { ChatClient } from "@twurple/chat";


const REDIRECT_URI = 'http://localhost:8888/home';


export class AuthManager {
  private _isLoggedIn: boolean;
  private _clientId: string;
  private _authProvider: ElectronAuthProvider;
  private _apiClient: ApiClient;
  private _chatClient: ChatClient;

  constructor(clientId: string) {
    this._isLoggedIn = false;
    this._clientId = clientId;
  }


  async login() {
    if (this._isLoggedIn) {
      return;
    }

    this._isLoggedIn = true;
    
    this._authProvider = new ElectronAuthProvider({
      clientId: this._clientId,
      redirectUri: REDIRECT_URI,
    });

    
    this._apiClient = new ApiClient({
      authProvider: this._authProvider,
    });
    await this._apiClient.requestScopes(['channel:moderate', 'chat:edit', 'chat:read']);

    this._chatClient = new ChatClient({ authProvider: this._authProvider });
  }

  logout() {
    this._isLoggedIn = false;
    this._chatClient = null;
    this._apiClient = null;
    this._authProvider.allowUserChange();
  }
}