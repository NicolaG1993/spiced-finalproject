export function reducer(state = {}, action) {
    if (action.type === "GET_FOLLOWERS") {
        state = {
            ...state,
            followersList: action.payload,
        };
        console.log("state in get followers(reducer): ", state);
    }

    if (action.type === "FOLLOW") {
        console.log("state in follow(reducer): ", state);
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
        state = {
            ...state,
            followersList: state.followersList.filter(
                (elem) => !elem.sender_id !== action.profileId
            ),
        };
    }

    return state;
}
