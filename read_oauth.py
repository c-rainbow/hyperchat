
PATH = 'C:/Code/data/c_rainbow_test.txt'
GOOGLE_PATH = 'C:/Code/data/c_rainbow_test_google.txt'

USERNAME = 'c_rainbow_test'

def GetOauthCode():
    with open(PATH, 'r') as f:
        return f.read().strip()
        
        
def GetOauthCodeWithout():
    code = GetOauthCode()
    return code[6:]
        
def GetApiKeyGoogle():
    with open(GOOGLE_PATH, 'r') as f:
        return f.read().strip()
        