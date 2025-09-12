const CREATE_DATABASE = `CREATE DATABASE IF NOT EXISTS proj421`;

const CREATE_TABLES = {
    users: `
        CREATE TABLE IF NOT EXISTS Users (
            UserID INT PRIMARY KEY AUTO_INCREMENT,
            Username VARCHAR(50) UNIQUE NOT NULL,
            Password VARCHAR(255) NOT NULL,
            Email VARCHAR(100) UNIQUE NOT NULL,
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CHECK (LENGTH(Username) >= 3),
            CHECK (LENGTH(Password) >= 8)
        )
    `,
    posts: `
        CREATE TABLE IF NOT EXISTS Posts (
            PostID INT PRIMARY KEY AUTO_INCREMENT,
            UserID INT NOT NULL,
            Content TEXT NOT NULL,
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CHECK (LENGTH(Content) > 0),
            CHECK (LENGTH(Content) <= 500),
            FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
        )
    `,
    postMetrics: `
        CREATE TABLE IF NOT EXISTS PostMetrics (
            PostMetricID INT PRIMARY KEY AUTO_INCREMENT,
            PostID INT UNIQUE NOT NULL,
            LikeCount INT DEFAULT 0,
            ShareCount INT DEFAULT 0,
            LastUpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CHECK (LikeCount >= 0),
            CHECK (ShareCount >= 0),
            FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE
        )
    `,
    likes: `
        CREATE TABLE IF NOT EXISTS Likes (
            LikeID INT PRIMARY KEY AUTO_INCREMENT,
            PostID INT NOT NULL,
            UserID INT NOT NULL,
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_like (PostID, UserID),
            FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE,
            FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
        )
    `,
    shares: `
        CREATE TABLE IF NOT EXISTS Shares (
            ShareID INT PRIMARY KEY AUTO_INCREMENT,
            PostID INT NOT NULL,
            FromUserID INT NOT NULL,
            ToUserID INT NOT NULL,
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CHECK (FromUserID != ToUserID),
            FOREIGN KEY (PostID) REFERENCES Posts(PostID) ON DELETE CASCADE,
            FOREIGN KEY (FromUserID) REFERENCES Users(UserID) ON DELETE CASCADE,
            FOREIGN KEY (ToUserID) REFERENCES Users(UserID) ON DELETE CASCADE
        )
    `,
    bannedWords: `
        CREATE TABLE IF NOT EXISTS BannedWords (
            WordID INT PRIMARY KEY AUTO_INCREMENT,
            Word VARCHAR(50) NOT NULL UNIQUE
        )
    `

};

const CREATE_TRIGGERS = {
    beforePostInsert: `
        CREATE TRIGGER before_post_insert
        BEFORE INSERT ON Posts
        FOR EACH ROW
        BEGIN
            DECLARE contains_banned_word BOOLEAN;
            
            SELECT EXISTS (
                SELECT 1 FROM BannedWords 
                WHERE NEW.Content LIKE CONCAT('%', Word, '%')
            ) INTO contains_banned_word;
            
            IF contains_banned_word THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Post contains inappropriate content';
            END IF;
        END
    `,
    beforePostUpdate: `
        CREATE TRIGGER before_post_update
        BEFORE UPDATE ON Posts
        FOR EACH ROW
        BEGIN
            DECLARE contains_banned_word BOOLEAN;
            
            SELECT EXISTS (
                SELECT 1 FROM BannedWords 
                WHERE NEW.Content LIKE CONCAT('%', Word, '%')
            ) INTO contains_banned_word;
            
            IF contains_banned_word THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Post contains inappropriate content';
            END IF;
        END
    `
};

const INITIAL_DATA = {
    bannedWords: `
        INSERT IGNORE INTO BannedWords (Word) VALUES 
        ('fuck'),
        ('shit'),
        ('damn'),
        ('bitch')
    `
};

const CREATE_PROCEDURES = {
    updatePost: `
        CREATE PROCEDURE UpdatePost(
            IN p_post_id INT,
            IN p_user_id INT,
            IN p_new_content TEXT
        )
        BEGIN
            DECLARE post_exists INT;
            
            -- Check if post exists and belongs to user
            SELECT COUNT(*) INTO post_exists
            FROM Posts
            WHERE PostID = p_post_id AND UserID = p_user_id;
            
            IF post_exists = 0 THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Post not found or user not authorized';
            ELSE
                -- Update the post
                UPDATE Posts 
                SET Content = p_new_content,
                    CreatedAt = CURRENT_TIMESTAMP
                WHERE PostID = p_post_id;
                
                -- Return the updated post data
                SELECT PostID, UserID, Content, CreatedAt
                FROM Posts
                WHERE PostID = p_post_id;
            END IF;
        END
    `,
    calculateUserStats: `
        CREATE PROCEDURE CalculateUserStats(
            IN p_user_id INT
        )
        BEGIN
            -- Create temporary table to store user stats
            CREATE TEMPORARY TABLE IF NOT EXISTS UserStats (
                StatName VARCHAR(50),
                StatValue INT
            );
            
            -- Calculate total posts
            INSERT INTO UserStats
            SELECT 'TotalPosts', COUNT(*)
            FROM Posts
            WHERE UserID = p_user_id;
            
            -- Calculate total likes received on their posts
            INSERT INTO UserStats
            SELECT 'TotalLikesReceived', COUNT(L.LikeID)
            FROM Posts P
            LEFT JOIN Likes L ON P.PostID = L.PostID
            WHERE P.UserID = p_user_id;
            
            -- Calculate total shares received on their posts
            INSERT INTO UserStats
            SELECT 'TotalSharesReceived', COUNT(S.ShareID)
            FROM Posts P
            LEFT JOIN Shares S ON P.PostID = S.PostID
            WHERE P.UserID = p_user_id;
            
            -- Return all stats in a format that matches our frontend expectations
            SELECT 
                MAX(CASE WHEN StatName = 'TotalPosts' THEN StatValue ELSE 0 END) as TotalPosts,
                MAX(CASE WHEN StatName = 'TotalLikesReceived' THEN StatValue ELSE 0 END) as TotalLikesReceived,
                MAX(CASE WHEN StatName = 'TotalSharesReceived' THEN StatValue ELSE 0 END) as TotalSharesReceived
            FROM UserStats;
            
            -- Clean up
            DROP TEMPORARY TABLE IF EXISTS UserStats;
        END
    `
};

module.exports = {
    CREATE_DATABASE,
    CREATE_TABLES,
    CREATE_PROCEDURES,
    INITIAL_DATA,
    CREATE_TRIGGERS
};