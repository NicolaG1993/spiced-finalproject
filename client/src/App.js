import axios from "./axios";
import { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import Logo from "./logo";
import Home from "./home";

import Profile from "./profile";
import ProfilePic from "./profile-pic";
import Uploader from "./uploader";
import OtherProfile from "./other-profile";
import SearchUsers from "./find-people";
import Followers from "./followers-list";
import Chat from "./chat";
import Shop from "./shop";

// import PostUploader from "./post-uploader";
// import PostImageUploader from "./post-image-uploader";

export class App extends Component {
    constructor(props) {
        super(props);

        // Initialize App's state
        //posso eliminare ?
        this.state = {
            first: "",
            last: "",
            profilePicUrl: props.profile_pic_url || "",
            bio: "",
            size: "",
        };

        this.toggleUploader = this.toggleUploader.bind(this);
        this.setProfilePicUrl = this.setProfilePicUrl.bind(this);
        this.setBio = this.setBio.bind(this);
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

    toggleUploader() {
        console.log("toggleUploader activated");
        if (this.state.uploaderVisible) {
            this.setState({
                uploaderVisible: false,
            });
        } else {
            this.setState({
                uploaderVisible: true,
            });
        }
    }

    setProfilePicUrl(profilePicUrl) {
        console.log("setProfilePicUrl activated");
        this.setState({
            profilePicUrl: profilePicUrl,
            uploaderVisible: false,
        });
    }

    setBio(bioText) {
        console.log("setBio activated");
        this.setState({
            bio: bioText,
        });
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
                    <div className={"header"}>
                        <Link to={"/"}>
                            <Logo />
                        </Link>
                        <ProfilePic
                            firstName={this.state.first}
                            lastName={this.state.last}
                            profilePicUrl={this.state.profilePicUrl}
                            size="small"
                        />
                    </div>
                    <nav>
                        <Link to={`/profile`}>Profile</Link>
                        <Link to={`/users`}>Search</Link>
                        <Link to={`/followers`}>Followers</Link>
                        <Link to={`/chat`}>Messages</Link>
                        <Link to={`/shop`}>Shop</Link>
                        <a href="/logout">Logout</a>
                    </nav>

                    <div className={"main"}>
                        {this.state.error && <p>Something broke :(</p>}

                        <Route
                            exact
                            path="/"
                            render={() => <Home firstName={this.state.first} />}
                        />

                        <Route
                            path="/profile"
                            render={() => (
                                <Profile
                                    firstName={this.state.first}
                                    lastName={this.state.last}
                                    profilePicUrl={this.state.profilePicUrl}
                                    bio={this.state.bio}
                                    toggleUploader={this.toggleUploader}
                                    setBio={this.setBio}
                                />
                            )}
                        />

                        {this.state.uploaderVisible && (
                            <Uploader
                                // Passing down methods with arrow function (no binding needed):
                                setProfilePicUrl={(profilePicUrl) =>
                                    this.setProfilePicUrl(profilePicUrl)
                                }
                            />
                        )}

                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                    userId={this.state.id}
                                    size="medium"
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/users"
                            render={() => <SearchUsers />}
                        />

                        <Route
                            path="/followers"
                            render={() => <Followers userId={this.state.id} />}
                        />

                        <Route path="/chat" render={() => <Chat />} />

                        <Route path="/shop" render={() => <Shop />} />

                        <Route path="/item/:id" render={() => <Item />} />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
