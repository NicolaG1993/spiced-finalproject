import axios from "./axios";
import { Component } from "react";

import PostUploader from "./post-uploader";
// import PostImageUploader from "./post-image-uploader";
import Posts from "./posts";
import { Link } from "react-router-dom";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
        this.postPost = this.postPost.bind(this);
    }

    async componentDidMount() {
        console.log("Home component did mount");
        console.log("this.props: ", this.props);

        try {
            const { data } = await axios.get(`/api/all-posts`);
            console.log("data in Posts: ", data);
            this.setState({
                posts: data,
            });
        } catch (err) {
            console.log("err in home-->componentDidMount: ", err);
        }
    }

    async postPost() {
        console.log("postPost state: ", this.state);
        try {
            const { data } = await axios.get(`/api/all-posts`);
            console.log("data in Posts: ", data);

            this.setState({
                posts: data,
            });
        } catch (err) {
            console.log("err in home-->componentDidMount: ", err);
        }
    }

    // async postComment() {
    //     console.log("postComment activated");
    //     try {
    //         const results = await axios.get(`/api/all-comments`);
    //         console.log("data in Posts: ", results.data);

    //         this.setState({
    //             comments: results.data,
    //         });
    //     } catch (err) {
    //         console.log("err in home-->componentDidMount: ", err);
    //     }
    // }

    // async postComment() {
    //     console.log("postComment state: ", this.state);
    //     try {
    //         const { data } = await axios.get(`/api/all-comments`);
    //         console.log("data in Comments: ", data);

    //         this.setState({
    //             comments: data,
    //         });
    //     } catch (err) {
    //         console.log("err in home-->componentDidMount: ", err);
    //     }
    // }

    render() {
        console.log("this.state in home: ", this.state);
        if (!this.state.posts) {
            return null;
            // return (
            //     <div className="spinner-container">
            //         <div className="spinner"></div>
            //     </div>
            // );
        }
        return (
            <div id="home">
                <h1>Hi {this.props.firstName}</h1>

                <Link to={`/shop`}>
                    <div className="slider">
                        <p>Go to the shop</p>
                    </div>
                </Link>

                <h2>Posts from the community</h2>

                <PostUploader postPost={this.postPost} />

                <Posts posts={this.state.posts} size="small" />
            </div>
        );
    }
}

// On my home page i have 2 components, one is the post uploader, the other one is the posts list
// They are working fine only if i refresh the page, otherwise the last post doesnt show up
// Basicly I need to re-render my Posts component when i post something from the uploader

// forse non devo passare postComment da home, perche comments é un class component (provare a dichiararlo la e fare anche la get req)
