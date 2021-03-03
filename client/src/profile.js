import BioEditor from "./bio-editor";
import ProfilePic from "./profile-pic";
import PostUploader from "./post-uploader";

export default function Profile(props) {
    console.log("Profile.js props", props);
    return (
        <div className="profileComp">
            <h1>
                {props.firstName} {props.lastName}
            </h1>
            <ProfilePic
                toggleUploader={props.toggleUploader}
                profilePicUrl={props.profilePicUrl}
                size="medium"
            />
            <BioEditor bio={props.bio} setBio={props.setBio} />

            <PostUploader />
        </div>
    );
}
