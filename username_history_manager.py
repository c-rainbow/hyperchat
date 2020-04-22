import sqlite3





class UsernameHistoryManager(object):

    def __init__(self):
        self.conn = sqlite3.connect('db/test.db', check_same_thread=False)
        self.db_cursor = self.conn.cursor()
        self.user_dict = {}  # id(int) -> (username, display_name)

        self.loadAllUsernames()

    def loadAllUsernames(self):
        self.db_cursor.execute('SELECT * FROM TwitchUsers')
        rows = self.db_cursor.fetchall()
        for row in rows:
            twitch_id = row[1]
            print(twitch_id, type(twitch_id))
            username = row[2]
            display_name = row[3]

            self.user_dict[twitch_id] = (username, display_name)

    def CheckForUpdate(self, twitch_id, new_username, new_display_name, timestamp):
        twitch_id = int(twitch_id)
        old_username, old_display_name = self.user_dict.get(twitch_id, (None, None))
        if old_username != new_username or old_display_name != new_display_name:
            # Append to UsernameChanges table
            self.db_cursor.execute(
                "INSERT INTO UsernameChanges(user_id, username, display_name, known_change_time) VALUES(?, ?, ?, ?)",
                (twitch_id, new_username, new_display_name, timestamp))
            # Update TwitchUsers table
            self.db_cursor.execute(
                "REPLACE INTO TwitchUsers(twitch_id, username, display_name) VALUES(?, ?, ?)",
                (twitch_id, new_username, new_display_name))

            self.conn.commit()
            # Update user_dict dictionary
            self.user_dict[twitch_id] = (new_username, new_display_name)

        






