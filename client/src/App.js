import axios from "./axios";
import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import Logo from "./Logo";
import Home from "./Home";

export class App extends Component {
    constructor(props) {
        super(props);

        // Initialize App's state
        this.state = {
            first: "",
            last: "",
            profilePicUrl: props.profile_pic_url || "",
            bio: "",
            size: "",
        };
    }

    async componentDidMount() {
        console.log("App component did mount");

        try {
            const { data } = await axios.get("/user");
            console.log("data: ", data);

            this.setState({
                id: data.id,
                first: data.first,
                last: data.last,
                profilePicUrl: data.profile_pic_url,
                bio: data.bio,
            });
        } catch (err) {
            console.log("err in app-->componentDidMount: ", err);
        }
    }

    render() {
        console.log("this.state in app: ", this.state);
        if (!this.state.id) {
            return null;
            // return (
            //     <div className="spinner-container">
            //         <div className="spinner"></div>
            //     </div>
            // );
        }
        return (
            <BrowserRouter>
                <div className={"app"}>
                    <div className={"header"}></div>
                    <Link to={"/"}>
                        <Logo />
                    </Link>
                    <nav>
                        <Link to={`/`}>Profile</Link>
                        <a href="/logout">Logout</a>
                    </nav>

                    <div className={"main"}>
                        {this.state.error && <p>Something broke :(</p>}
                        <Route exact path="/" render={() => <Home />} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
