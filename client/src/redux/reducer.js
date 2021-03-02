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
                    };
                } else {
                    return elem;
                }
            }),
        };
    }

    return state;
}
