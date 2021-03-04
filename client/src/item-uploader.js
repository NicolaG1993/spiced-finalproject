import { Component } from "react";
import axios from "./axios";

export default class ItemUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            file: null,
        };
        this.addItem = this.addItem.bind(this);
    }

    componentDidMount() {
        console.log("Item Uploader component did mount");
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

    async addItem() {
        console.log("addItem was clicked");
        // const formData = new FormData();
        // formData.append("file", this.state.file);

        try {
            const { data } = await axios.post("/api/add-item", this.state);
            console.log("data-->Item Uploader: ", data);
            this.props.postItem(data);
        } catch (err) {
            console.log("err in /item uploader-->submit item: ", err);
            this.setState({
                error: true,
            });
        }
    }

    render() {
        return (
            <div className={"item-uploader"}>
                <input
                    name="title"
                    placeholder="Title"
                    onChange={(e) => this.handleChange(e)}
                />
                <br />
                <textarea
                    name="text"
                    placeholder="Type something..."
                    defaultValue=""
                    onChange={(e) => this.handleChange(e)}
                ></textarea>{" "}
                {/* <br /> */}
                {/* <button toggleUploader={props.toggleUploader}>Add Image</button> */}
                <br />
                <input
                    name="price"
                    placeholder="Price"
                    onChange={(e) => this.handleChange(e)}
                />
                <select
                    name="category"
                    id="category"
                    onChange={(e) => this.handleChange(e)}
                >
                    <option value="Guitars">Guitars</option>
                    <option value="Drums">Drums</option>
                    <option value="Microphones">Microphones</option>
                    <option value="Keyboards">Keyboards</option>
                    <option value="Amps">Amps</option>
                    <option value="Pedals">Pedals</option>
                </select>
                <br />
                <button onClick={() => this.addItem()}>Add Image</button>
                <button onClick={() => this.addItem()}>Post</button>
                {this.state.error && <p>Something broke :(</p>}
            </div>
        );
    }
}
