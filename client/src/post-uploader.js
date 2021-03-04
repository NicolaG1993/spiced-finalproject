import { Component } from "react";
import axios from "./axios";

export default class PostUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            file: null,
        };
        this.post = this.post.bind(this);
    }

    componentDidMount() {
        console.log("Uploader component did mount");
    }

    handleChange(e) {
        console.log("e target name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState: ", this.state)
        );
    }

    async post() {
        console.log("post was clicked");
        // const formData = new FormData();
        // formData.append("file", this.state.file);

        try {
            const { data } = await axios.post("/add-posts", this.state);
            console.log("data-->Post Uploader: ", data);
            this.props.postPost(data);
        } catch (err) {
            console.log("err in /post uploader-->submit post: ", err);
            this.setState({
                error: true,
            });
        }
    }

    render() {
        return (
            <div className="post-uploader">
                <textarea
                    name="text"
                    placeholder="Type something..."
                    defaultValue={this.props.bio}
                    onChange={(e) => this.handleChange(e)}
                ></textarea>{" "}
                {/* <br /> */}
                {/* <button toggleUploader={props.toggleUploader}>Add Image</button> */}
                <br />
                <button onClick={() => this.post()}>Post</button>
                {this.state.error && <p>Something broke :(</p>}
            </div>
        );
    }
}
