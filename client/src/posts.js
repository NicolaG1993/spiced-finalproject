import { useState, useEffect } from "react";
import axios from "./axios";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllPosts } from "./redux/actions";
import { Link } from "react-router-dom";

export default function Posts() {
    // console.log("Posts.js props", props);

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        console.log("POSTS ACTIVATED!!!");
        let abort = false;

        (async () => {
            try {
                const { data } = await axios.get(`/api/all-posts`);
                console.log("data in Posts: ", data);
                if (!abort) {
                    console.log("!abort");
                    setPosts(data.rows);
                }
            } catch (err) {
                console.log("err with axios: ", err);
                abort = true;
            }
        })();
        return () => {
            abort = true;
        };
    }, []);

    return (
        <div className="postsComp">
            {posts.map((elem, index) => {
                return (
                    <div key={index}>
                        <p>{elem.text}</p>
                    </div>
                );
            })}
        </div>
    );
}
