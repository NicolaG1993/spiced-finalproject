import { useState, useEffect } from "react";
import axios from "./axios";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllPosts } from "./redux/actions";
import { Link } from "react-router-dom";

import Comments from "./comments";

export default function Posts(props) {
    console.log("Posts.js props", props);
    let posts = props.posts.rows;

    if (!posts) {
        console.log("posts is empty: ", posts);
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

    return (
        <div className="postsComp">
            {posts.map((elem, index) => {
                var date = new Date(elem.created_at);
                var ukDate = new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "long",
                    timeStyle: "short",
                }).format(date);
                return (
                    <div className="post" key={index}>
                        <img
                            src={elem.profile_pic_url || "default.jpg"}
                            className={`${props.size}`}
                        />
                        <div className="poster">
                            <p>
                                <strong>
                                    {elem.first} {elem.last}:
                                </strong>
                            </p>
                            <p>{ukDate}</p>

                            <p className="text">{elem.text}</p>
                        </div>
                        <Comments postId={elem.post_id} size="very-small" />
                    </div>
                );
            })}
        </div>
    );
}
