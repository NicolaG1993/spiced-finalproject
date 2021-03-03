import { Component } from "react";
import axios from "./axios";

export default class PostImageUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            file: null,
        };
        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        console.log("Uploader component did mount");
    }

    handleChange(e) {
        console.log("e.target: ", e.target.files[0]);
        this.setState({ file: e.target.files[0] });
    }

    async submit() {
        console.log("submit was clicked");
        const formData = new FormData();
        formData.append("file", this.state.file);

        // try {
        //     const { data } = await axios.post("/post-pic", formData);
        //     console.log("data-->Post Pic Uploader: ", data);

        //     await this.props.setProfilePicUrl(data.profile_pic_url);
        // } catch (err) {
        //     console.log("err in Uploader-->submit: ", err);
        //     this.setState({
        //         error: true,
        //     });
        // }
    }

    render() {
        return (
            <div className={"uploader"}>
                <input type="file" onChange={(e) => this.handleChange(e)} />
                <button onClick={() => this.submit()}>Upload</button>
                {this.state.error && <p>Something broke :(</p>}
            </div>
        );
    }
}
