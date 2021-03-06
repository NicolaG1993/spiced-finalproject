import axios from "../axios";

export async function getFollowers() {
    try {
        const { data } = await axios.get("/api/get-followers");

        console.log("data in getFollowers(actions): ", data.rows);
        console.log("userId in getFollowers(actions): ", data.userId);
        return {
            type: "GET_FOLLOWERS",
            payload: data.rows,
            userId: data.userId,
        };
    } catch (err) {
        console.log("err in getFollowers(actions): ", err);
    }
}

export async function follow(profileId) {
    try {
        const { data } = await axios.post(`/api/follow/${profileId}`, {
            buttonText: "Follow",
        });
        console.log("data in post follow(actions): ", data);
        console.log("profileId in follow(actions): ", profileId);
        return {
            type: "FOLLOW",
            friendsList: data,
            profileId: profileId, // controllare key ?
        };
    } catch (err) {
        console.log("err in follow(actions): ", err);
    }
}

export async function unfollow(profileId) {
    try {
        const { data } = await axios.post(`/api/follow/${profileId}`, {
            buttonText: "Unfollow",
        });
        console.log("data in post unfollow(actions): ", data);
        return {
            type: "UNFOLLOW",
            friendsList: data,
            profileId: profileId, // controllare key ?
        };
    } catch (err) {
        console.log("err in unfollow(actions): ", err);
    }
}

export async function getAllPosts() {
    try {
        const { data } = await axios.get("/api/all-posts");

        console.log("data in getAllPosts(actions): ", data);
        return {
            type: "GET_ALL_POSTS",
            payload: data.rows,
            userId: data.userId,
        };
    } catch (err) {
        console.log("err in getAllPosts(actions): ", err);
    }
}

export async function chatMessages(msgs) {
    try {
        console.log("msgs in chatMessages(actions): ", msgs);
        return {
            type: "GET_MSGS",
            payload: msgs,
        };
    } catch (err) {
        console.log("err in chatMessages(actions): ", err);
    }
}

export async function chatMessage(msg) {
    try {
        console.log("msg in chatMessage(actions): ", msg);
        return {
            type: "POST_MSG",
            payload: msg,
        };
    } catch (err) {
        console.log("err in chatMessage(actions): ", err);
    }
}
