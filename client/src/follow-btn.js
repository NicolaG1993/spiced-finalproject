import { useState, useEffect } from "react";
import axios from "./axios";

export default function FollowButton(props) {
    let profileId = props.profileId;
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        console.log("FollowButton mounted");
        let abort = false;

        (async () => {
            try {
                const { data } = await axios.get(`/api/follow/${profileId}`);
                if (!abort) {
                    console.log("!abort");
                    console.log("useEffect data: ", data);
                    setButtonText(data.buttonText);
                }
            } catch (err) {
                console.log("err with axios: ", err);
                abort = true;
            }
        })();
        return () => {
            console.log("profileId in returned function: ", profileId);
            abort = true;
        };
    }, [profileId]);

    const btnRequest = async () => {
        console.log("btnRequest!");
        const { data } = await axios.post(`/api/follow/${profileId}`, {
            buttonText: buttonText,
        });
        console.log("btnRequest data: ", data);
        setButtonText(data.buttonText);
    };

    return (
        <>
            <button className="auto clear" onClick={() => btnRequest()}>
                {buttonText}
            </button>
        </>
    );
}
