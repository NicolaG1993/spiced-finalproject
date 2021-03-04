import { Component } from "react";
import axios from "./axios";
import FollowButton from "./follow-btn";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }

    async componentDidMount() {
        console.log("OtherProfile component did mount");
        console.log("this.props.match: ", this.props.match);
        console.log("id: ", this.props.match.params.id);
        try {
            const { data } = await axios.get(
                `/api/other-profile/${this.props.match.params.id}`
            );
            console.log("data --> other-profile: ", data);

            if (this.props.match.params.id == this.props.userId) {
                return this.props.history.push("/profile");
            }
            this.setState({
                id: data.id,
                first: data.first,
                last: data.last,
                profilePicUrl: data.profile_pic_url,
                bio: data.bio,
            });
        } catch (err) {
            console.log("err in /other-profile component-->get user: ", err);
            this.setState({
                error: true,
            });
        }
    }

    render() {
        console.log("this.props in OtherProfile: ", this.props);
        console.log("this.state in OtherProfile: ", this.state);
        if (!this.state.id) {
            return null;
            // return (
            //     <div className="spinner-container">
            //         <div className="spinner"></div>
            //     </div>
            // );
        }
        return (
            <div className="profileComp">
                <h1>
                    {this.state.first} {this.state.last}
                </h1>
                <img
                    src={this.state.profilePicUrl || "/default.png"}
                    alt={`${this.state.first} ${this.state.last}`}
                    className={`${this.props.size} blue-frame`}
                />
                <h2>Bio:</h2>
                <p>{this.state.bio}</p>
                <FollowButton profileId={this.state.id} />
            </div>
        );
    }
}
