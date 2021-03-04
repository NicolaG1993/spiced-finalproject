export default function Logo() {
    return (
        <div className="logo">
            <img src="/logo-white.png" alt="logo" />
        </div>
    );
}

// things in the public folder get served automatically, so if you go to localhost:8080/logo.png it will check if there is anything in the public folder and serve that
