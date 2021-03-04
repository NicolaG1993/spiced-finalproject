import { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            editingMode: false,
            bio: props.bio || "",
        };
        this.updateBio = this.updateBio.bind(this);
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

    async updateBio() {
        console.log("submit was clicked");
        try {
            const { data } = await axios.post("/update-bio", this.state);
            console.log("data-->Profile Bio Editor: ", data);
            this.props.setBio(data.bio);
            this.setState({ editingMode: false });
        } catch (err) {
            console.log("err in /update-bio-->submit bio: ", err);
            this.setState({
                error: true,
            });
        }
    }

    render() {
        console.log("this.props in BioEditor: ", this.props);
        if (this.state.editingMode) {
            return (
                <div className="bio-editor">
                    <h2>Editing Bio:</h2>
                    <textarea
                        name="bio"
                        defaultValue={this.props.bio}
                        onChange={(e) => this.handleChange(e)}
                    ></textarea>
                    <br />
                    <button onClick={() => this.updateBio()}>Save Bio</button>
                </div>
            );
        }
        return (
            <div className="bio-editor">
                <h2>Bio:</h2>
                <p>{this.props.bio}</p>
                <button onClick={() => this.setState({ editingMode: true })}>
                    Edit
                </button>
            </div>
        );
    }
}
