import axios from "./axios";
import { Component } from "react";

export default class Shiop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }

    componentDidMount() {
        console.log("Shop component did mount");
        console.log("this.props: ", this.props);
    }

    render() {
        console.log("this.state in home: ", this.state);
        // if (!this.state.posts) {
        //     return null;
        //     // return (
        //     //     <div className="spinner-container">
        //     //         <div className="spinner"></div>
        //     //     </div>
        //     // );
        // }
        return (
            <div id="shop">
                <h1>Shop</h1>

                <div className="slider">Some images here...</div>

                <h2>Posts from the community</h2>
            </div>
        );
    }
}
