import { Component } from "react";
import axios from "./axios";

export default class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            post_id: this.props.postId,
        };
        this.postComment = this.postComment.bind(this);
    }

    async componentDidMount() {
        console.log("Comments component did mount");
        //usare postId che passo dal parent component
        try {
            const { data } = await axios.get(
                `/api/all-comments/${this.props.postId}`
            );
            console.log("data in Comments: ", data);

            this.setState({
                comments: data,
            });
        } catch (err) {
            console.log("err in home-->componentDidMount: ", err);
        }
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

    async postComment() {
        console.log("postComment activated");
        //dovrei fare try > post req qui, prima di get
        //magari usare postId che passo dal parent component
        try {
            const { data } = await axios.post("/api/post-comment", this.state);
            console.log("data-->Post Comment: ", data);
            try {
                const results = await axios.get(
                    `/api/all-comments/${this.props.postId}`
                );
                console.log("data in Comments: ", results.data);

                this.setState({
                    comments: results.data,
                });
            } catch (err) {
                console.log("err in home-->componentDidMount: ", err);
            }
        } catch (err) {
            console.log("err in Post Comment: ", err);
            this.setState({
                error: true,
            });
        }
    }

    render() {
        console.log("this.props in BioEditor: ", this.props);
        let comments = this.state.comments;

        return (
            <div className="comment-uploader">
                <textarea
                    name="newcomment"
                    placeholder="Type something..."
                    onChange={(e) => this.handleChange(e)}
                ></textarea>
                <br />
                <button onClick={() => this.postComment()}>Comment</button>
                <div className="comments">
                    {comments &&
                        comments.map((elem, index) => {
                            return (
                                <div className="comment" key={index}>
                                    <p>{elem.comment}</p>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }
}
