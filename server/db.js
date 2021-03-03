const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/finalproject"
);

// USER REGISTRATION & LOGIN
module.exports.userRegistration = (firstName, lastName, email, hashedPw) => {
    const myQuery = `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`;
    const keys = [firstName, lastName, email, hashedPw];
    return db.query(myQuery, keys);
};

module.exports.checkUser = (email) => {
    const myQuery = `SELECT * FROM users WHERE email = $1`;
    const key = [email];
    return db.query(myQuery, key);
};

// RESET PASSWORD
module.exports.storeCode = (email, code) => {
    const myQuery = `INSERT INTO reset_codes (email, code) VALUES ($1, $2) RETURNING id`;
    const keys = [email, code];
    return db.query(myQuery, keys);
};

module.exports.checkCode = (code) => {
    const myQuery = `SELECT * FROM reset_codes
    WHERE code = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`;
    const key = [code];
    return db.query(myQuery, key);
};

module.exports.updatePassword = (email, password) => {
    const myQuery = `UPDATE users SET password = $2 WHERE email = $1`;
    const keys = [email, password];
    return db.query(myQuery, keys);
};

// PROFILE
module.exports.getUser = (id) => {
    const myQuery = `SELECT * FROM users WHERE id = $1`;
    const key = [id];
    return db.query(myQuery, key);
};

module.exports.uploadProfileImage = (url, id) => {
    const q = `UPDATE users SET profile_pic_url = $1 WHERE id = $2 RETURNING profile_pic_url`; //senza returnin non vedo l'immagine appena la carico, ma solo se ricarico la pagin
    const keys = [url, id];
    return db.query(q, keys);
};

module.exports.updateBio = (bio, id) => {
    const q = `UPDATE users SET bio = $1 WHERE id = $2 RETURNING bio`;
    const keys = [bio, id];
    return db.query(q, keys);
};

// FIND USERS
module.exports.findRecentUsers = () => {
    const myQuery = `SELECT * FROM users ORDER BY id DESC LIMIT 3;`;
    return db.query(myQuery);
};

module.exports.findUser = (str) => {
    const myQuery = `SELECT * FROM users WHERE first ILIKE $1 ORDER BY first ASC`;
    const key = [str + "%"];
    return db.query(myQuery, key);
};

// FOLLOWS
module.exports.followStatus = (userId, id) => {
    const myQuery = `SELECT * FROM follows
    WHERE (sender_id = $1 AND recipient_id = $2)`;
    const keys = [userId, id];
    return db.query(myQuery, keys);
};

module.exports.follow = (userId, id) => {
    const myQuery = `INSERT INTO follows (sender_id, recipient_id) VALUES ($1, $2)`;
    const keys = [userId, id];
    return db.query(myQuery, keys);
};

module.exports.unfollow = (userId, id) => {
    const myQuery = `DELETE FROM follows
    WHERE (sender_id = $1 AND recipient_id = $2)`;
    const keys = [userId, id];
    return db.query(myQuery, keys);
};

// FOLLOWERS LIST
module.exports.followersList = (id) => {
    const myQuery = `SELECT users.id, first, last, profile_pic_url, sender_id, following
    FROM follows
    JOIN users
    ON (recipient_id = $1 AND sender_id = users.id)
    OR (sender_id = $1 AND recipient_id = users.id)`;
    const key = [id];
    return db.query(myQuery, key);
};

// POSTS
module.exports.followingUsersPosts = (userId) => {
    const myQuery = `SELECT users.id, first, last, profile_pic_url, sender_id
    FROM follows
    JOIN users
    ON (sender_id = users.id AND recipient_id = $1)
    JOIN comments
    ON comments.user_id = users.id
    ORDER BY posts.created_at DESC
    LIMIT 10`;
    const key = [userId];
    return db.query(myQuery, key);
}; // not tested yet

module.exports.userPosts = (userId) => {
    const myQuery = `SELECT users.id, first, last, profile_pic_url
    FROM users
    JOIN comments
    ON (users.id = $1 AND comments.user_id = users.id)
    ORDER BY posts.created_at DESC
    LIMIT 10`;
    const key = [userId];
    return db.query(myQuery, key);
}; // not tested yet

module.exports.postPost = (id, text, pic) => {
    const myQuery = `INSERT INTO posts (sender_id, text, pic_url) VALUES ($1, $2, $3)`;
    const keys = [id, text, pic];
    return db.query(myQuery, keys);
}; // not tested yet

// COMMENTS
