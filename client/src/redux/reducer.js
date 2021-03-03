export function reducer(state = {}, action) {
    if (action.type === "GET_FOLLOWERS") {
        state = {
            ...state,
            followersList: action.payload,
            userId: action.userId,
        };
        console.log("state in get followers(reducer): ", state);
    }

    if (action.type === "FOLLOW") {
        console.log("state in follow(reducer): ", state);
        console.log("action in follow(reducer): ", action);
        state = {
            ...state,
            followersList: state.followersList.map((elem) => {
                if (elem.sender_id === action.profileId) {
                    return {
                        ...elem,
                        following: true,
                    };
                } else {
                    return elem;
                }
            }),
        };
    }

    if (action.type === "UNFOLLOW") {
        console.log("state in unfollow(reducer): ", state);
        console.log("action: ", action);
        state = {
            ...state,
            followersList: state.followersList.map((elem) => {
                if (elem.sender_id === action.profileId) {
                    return {
                        ...elem,
                        following: false,
                        sender_id:
                            elem.sender_id === state.userId
                                ? undefined
                                : elem.sender_id,
                    };
                } else {
                    return elem;
                }
            }),
        };
    }

    if (action.type === "GET_ALL_POSTS") {
        state = {
            ...state,
            posts: action.payload,
            userId: action.userId,
        };
        console.log("state in get all post(reducer): ", state);
    }

    return state;
}
