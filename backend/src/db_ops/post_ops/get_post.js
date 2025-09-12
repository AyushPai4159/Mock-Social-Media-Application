const { pool}  = require('../../config/db');


/*
 * - RETURNS ALL POSTS FROM THE DATABASE SORTED BY THE MOST RECENT POST
 * - CAN INDEX INTO RETURNED ARRAY TO GET THE MOST RECENT POST LIKE THIS: posts[0]
 * - CAN USE THIS IN FRONT END TO DISPLAY ALL POSTS
*/


async function getAllPosts() {
    try {
        const [posts] = await pool.query(`
            SELECT 
                p.PostID,
                p.Content,
                p.UserID,
                p.CreatedAt,
                pm.LikeCount,
                pm.ShareCount
            FROM Posts p
            LEFT JOIN PostMetrics pm ON p.PostID = pm.PostID
            ORDER BY p.CreatedAt DESC
        `);
        return posts;
    } catch (error) {
        console.error('Error getting posts:', error);
        throw error;
    }
}


async function getPostsByUser(userId) {
    try {
        const [posts] = await pool.query(`
            SELECT 
                p.*,
                pm.LikeCount,
                pm.ShareCount
            FROM Posts p
            LEFT JOIN PostMetrics pm ON p.PostID = pm.PostID
            WHERE p.UserID = ?
            ORDER BY p.CreatedAt DESC
        `, [userId]);
        return posts;
    } catch (error) {
        console.error('Error getting user posts:', error);
        throw error;
    }
}

async function getPostById(postId) {
    try {
        const [posts] = await pool.query(`
            SELECT 
                p.PostID,
                p.Content,
                p.UserID,
                p.CreatedAt,
                pm.LikeCount,
                pm.ShareCount
            FROM Posts p
            LEFT JOIN PostMetrics pm ON p.PostID = pm.PostID
            WHERE p.PostID = ?
        `, [postId]);
        
        return posts[0] || null;  // Return null if no post found
    } catch (error) {
        console.error('Error getting post by ID:', error);
        throw error;
    }
}

async function getPostsSharedWithUser(userId) {
    try {
        const [posts] = await pool.query(`
            SELECT 
                p.PostID,
                p.Content,
                p.UserID,
                p.CreatedAt,
                pm.LikeCount,
                pm.ShareCount,
                s.ShareID,
                s.CreatedAt as SharedAt,
                u.Username as SharedBy
            FROM Shares s
            JOIN Posts p ON s.PostID = p.PostID
            LEFT JOIN PostMetrics pm ON p.PostID = pm.PostID
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

module.exports = { getAllPosts, getPostsByUser, getPostById, getPostsSharedWithUser };