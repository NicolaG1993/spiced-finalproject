import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFollowers, follow, unfollow } from "./redux/actions";

export default function Followers(props) {
    console.log("FOLLOWERS COMPONENT ACTIVATED");

    const dispatch = useDispatch();
    // const [buttonText, setButtonText] = useState("");

    const following = useSelector(
        (state) =>
            state.followersList &&
            state.followersList.filter(
                (elem) => elem.sender_id === props.userId || elem.following
            )
    );

    const followers = useSelector(
        (state) =>
            state.followersList &&
            state.followersList.filter(
                (elem) => elem.sender_id !== props.userId
            )
    );

    console.log("following: ", following);
    console.log("followers: ", followers);

    useEffect(() => {
        dispatch(getFollowers());
    }, []);

    // const btnRequest = async () => {
    //     console.log("btnRequest!");

    //     if (elem.sender_id === props.userId) {
    //         setButtonText(data.buttonText);
    //     } else {
    //         setButtonText(data.buttonText);
    //     }
    // };

    if (!following && !followers) {
        console.log("following: ", following);
        console.log("followers: ", followers);
        return null;
        // return (
        //     <div className="spinner-container">
        //         <div className="spinner"></div>
        //     </div>
        // );
        // return (
        //     <div>
        //         <h2>My Friends</h2>
        //         <p>No results</p>
        //     </div>
        // );
    }
    //eliminare questo if oppure friends.length

    return (
        <div className="followers-list">
            <h2>Following</h2>
            {following.map((elem, index) => {
                return (
                    <div className="userCard" key={index}>
                        <img
                            className="findusers"
                            src={elem.profile_pic_url || "/default.png"}
                            alt={`${elem.first} ${elem.last}`}
                        />
                        <p>
                            {elem.first} {elem.last}
                        </p>

                        <button onClick={() => dispatch(unfollow(elem.id))}>
                            Unfollow
                        </button>
                    </div>
                );
            })}

            <h2>Followers</h2>
            {followers.map((elem, index) => {
                let btnElem = (
                    <button onClick={() => dispatch(follow(elem.id))}>
                        Follow
                    </button>
                );

                if (elem.sender_id === props.userId || elem.following) {
                    btnElem = (
                        <button onClick={() => dispatch(unfollow(elem.id))}>
                            Unfollow
                        </button>
                    );
                }

                return (
                    <div className="userCard" key={index}>
                        <img
                            className="findusers"
                            src={elem.profile_pic_url || "/default.png"}
                            alt={`${elem.first} ${elem.last}`}
                        />
                        <p>
                            {elem.first} {elem.last}
                        </p>

                        {btnElem}
                    </div>
                );
            })}
        </div>
    );
}

// Remember that the whole process of putting data into redux is asynchronous - it all takes a bit of time! But the problem is that that map does not wait for data to actually exist in Redux before running. So the solution is to, in some way, tell map not to run until the data in Redux is there
// questo é perche scrivo "friends.length &&" o solo "friends(?)" prima di usare friends.map

//sistemare use selector
//usare solo un btn in followers
