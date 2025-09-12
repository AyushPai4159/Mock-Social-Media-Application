const { pool } = require('../../config/db');

/* 
* - GETS ALL SHARES OF A SPECIFIC POST
* - SHOWS WHO SHARED IT AND TO WHOM
*/
async function getSharesByPost(postId) {
    try {
        const [shares] = await pool.query(`
            SELECT 
                s.ShareID,
                s.FromUserID,
                s.ToUserID,
                s.CreatedAt,
                u1.Username as SharedBy,
                u2.Username as SharedTo
            FROM Shares s
            JOIN Users u1 ON s.FromUserID = u1.UserID
            JOIN Users u2 ON s.ToUserID = u2.UserID
            WHERE s.PostID = ?
            ORDER BY s.CreatedAt DESC
        `, [postId]);
        return shares;
    } catch (error) {
        console.error('Error getting shares:', error);
        throw error;
    }
}

/* 
* - GETS ALL POSTS SHARED WITH A SPECIFIC USER
* - INCLUDES POST CONTENT AND WHO SHARED IT
*/
async function getPostsSharedWithUser(userId) {
    try {
        const [posts] = await pool.query(`
            SELECT 
                p.*,
                pm.LikeCount,
                pm.ShareCount,
                s.ShareID,
                s.CreatedAt as SharedAt,
                u.Username as SharedBy
            FROM Shares s
            JOIN Posts p ON s.PostID = p.PostID
            JOIN PostMetrics pm ON p.PostID = pm.PostID
            JOIN Users u ON s.FromUserID = u.UserID
            WHERE s.ToUserID = ?
            ORDER BY s.CreatedAt DESC
        `, [userId]);
        return posts;
    } catch (error) {
        console.error('Error getting shared posts:', error);
        throw error;
    }
}

/* 
* - GETS ALL POSTS A USER HAS SHARED
* - INCLUDES WHO THEY SHARED IT WITH
*/
async function getPostsSharedByUser(userId) {
    try {
        const [posts] = await pool.query(`
            SELECT 
                p.*,
                pm.LikeCount,
                pm.ShareCount,
                s.ShareID,
                s.CreatedAt as SharedAt,
                u.Username as SharedTo
            FROM Shares s
            JOIN Posts p ON s.PostID = p.PostID
            JOIN PostMetrics pm ON p.PostID = pm.PostID
            JOIN Users u ON s.ToUserID = u.UserID
            WHERE s.FromUserID = ?
            ORDER BY s.CreatedAt DESC
        `, [userId]);
        return posts;
    } catch (error) {
        console.error('Error getting shared posts:', error);
        throw error;
    }
}

module.exports = { 
    getSharesByPost, 
    getPostsSharedWithUser, 
    getPostsSharedByUser 
};