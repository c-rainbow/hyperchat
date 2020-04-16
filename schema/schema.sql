

-- 한자단어 -> 한글단어 맵핑
CREATE TABLE "Hanjas" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "hanja" VARCHAR(255) UNIQUE NOT NULL,
    "hangul" VARCHAR(255) NOT NULL,
    "hangul2" VARCHAR(255) NULL,
    "hangul3" VARCHAR(255) NULL,
    "hangul4" VARCHAR(255) NULL
);


CREATE TABLE "TwitchUsers" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "twitch_id" INTEGER UNIQUE NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL
);
CREATE INDEX idx_username ON TwitchUsers("username");
CREATE INDEX idx_display_name ON TwitchUsers("display_name");


CREATE TABLE "ChatBookmarks" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "streamer_id" INTEGER NOT NULL,
    "chatter_id" INTEGER NOT NULL,
    "chat_timestamp" TIMESTAMP NOT NULL,
    "chat_text" TEXT NOT NULL,
    "raw_chat" TEXT NOT NULL,  -- tags, text, etc 전부 포함
    FOREIGN KEY ("streamer_id") REFERENCES TwitchUsers("twitch_id"),
    FOREIGN KEY ("chatter_id") REFERENCES TwitchUsers("twitch_id")
);
CREATE INDEX idx_streamer_id ON ChatBookmarks("streamer_id");


CREATE TABLE "UsernameChanges" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "known_change_time" TIMESTAMP CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES TwitchUsers("twitch_id")
);
CREATE INDEX idx_user_id ON UsernameChanges("user_id");

