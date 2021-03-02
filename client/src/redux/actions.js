import axios from "../axios";

export async function getFollowers() {
    try {
        const { data } = await axios.get("/api/get-followers");
        console.log("data in getFollowers(actions): ", data);
        return {
            type: "GET_FOLLOWERS",
            payload: data,
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
