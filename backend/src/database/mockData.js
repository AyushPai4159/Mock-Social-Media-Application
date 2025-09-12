const MOCK_DATA = {
    users: `
        INSERT INTO Users (Username, Password, Email) VALUES 
        ('john_doe', 'password123', 'john@example.com'),
        ('jane_smith', 'password123', 'jane@example.com'),
        ('bob_wilson', 'password123', 'bob@example.com')
    `,
    
    posts: `
        INSERT INTO Posts (UserID, Content) VALUES 
        (1, 'First post! Hello world!'),
        (2, 'Beautiful day for coding!'),
        (3, 'Anyone want to collaborate on a project?'),
        (1, 'Learning database design is fun!')
    `,
    
    postMetrics: `
        INSERT INTO PostMetrics (PostID, LikeCount, ShareCount) VALUES 
        (1, 2, 1),
        (2, 5, 2),
        (3, 3, 0),
        (4, 1, 1)
    `,
    
    likes: `
        INSERT INTO Likes (PostID, UserID) VALUES 
        (1, 2), (1, 3),      -- Post 1 liked by users 2 and 3
        (2, 1), (2, 3), (2, 2),  -- Post 2 liked by users 1, 2, and 3
        (3, 1), (3, 2),      -- Post 3 liked by users 1 and 2
        (4, 2)               -- Post 4 liked by user 2
    `,
    
    shares: `
        INSERT INTO Shares (PostID, FromUserID, ToUserID) VALUES 
        (1, 2, 3),           -- User 2 shared post 1 with user 3
        (2, 1, 3),           -- User 1 shared post 2 with user 3
        (2, 3, 1),           -- User 3 shared post 2 with user 1
        (4, 1, 2)            -- User 1 shared post 4 with user 2
    `
};

module.exports = MOCK_DATA;