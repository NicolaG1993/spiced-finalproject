import PostUploader from "./post-uploader";

export default function Home() {
    console.log("HOME ACTIVATED");
    return (
        <div id="home">
            <h1>HOME</h1>

            <div className="slider">Some images here...</div>

            <PostUploader />

            <div className="feeds">Feeds will be here...</div>
        </div>
    );
}
