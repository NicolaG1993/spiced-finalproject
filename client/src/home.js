// import axios from "./axios";
import { Component } from "react";

import PostUploader from "./post-uploader";
// import PostImageUploader from "./post-image-uploader";
import Posts from "./posts";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            posts: "",
        };

        this.postPost = this.postPost.bind(this);
    }

    async componentDidMount() {
        console.log("Home component did mount");
        console.log("this.props: ", this.props);
    }

    postPost(post) {
        console.log("postPost activated");
        console.log("postPost state: ", this.state);
        this.setState({
            posts: post,
        });
    }

    render() {
        return (
            <div id="home">
                <h1>Hi {this.props.firstName}</h1>

                <div className="slider">Some images here...</div>

                <h2>Posts from the community</h2>

                <PostUploader postPost={this.postPost} />

                <div className="feeds">
                    Feeds will be here...
                    <br />
                </div>

                <Posts />
            </div>
        );
    }
}

// On my home page i have 2 components, one is the post uploader, the other one is the posts list
// They are working fine only if i refresh the page, otherwise the last post doesnt show up
// Basicly I need to re-render my Posts component when i post something from the uploader
