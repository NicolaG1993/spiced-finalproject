const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

const cookieSession = require("cookie-session");
let cookie_sec;
if (process.env.secretCookie) {
    cookie_sec = process.env.secretCookie;
} else {
    cookie_sec = require("./secrets.json").secretCookie;
}

const {
    requireLoggedInUser,
    requireLoggedOutUser,
    setToken,
    dealWithCookieVulnerabilities,
} = require("./middleware");
const db = require("./db");
const bc = require("./bc");
const ses = require("./ses");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");

const { uploader } = require("./upload");
const s3 = require("./s3");

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});
const cookieSessionMiddleware = cookieSession({
    secret: cookie_sec,
    maxAge: 1000 * 60 * 60 * 24 * 14,
}); //puo andare in middleware.js ?

/////*****MIDDLEWARES*****/////
app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(setToken);
app.use(dealWithCookieVulnerabilities); // mi serve questo?

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/////*****WELCOME*****/////
app.get("/welcome", requireLoggedOutUser, (req, res) => {
    if (req.session.userId) {
        res.redirect("/"); //app?
    } else {
        // is start.js
        res.sendFile(path.join(__dirname, "..", "client", "index.html"));
    }
});

/////*****MORE*****/////
app.get("/logout", requireLoggedInUser, (req, res) => {
    req.session = null;
    res.redirect("/welcome"); //welcome ?
});

app.get("*", requireLoggedInUser, (req, res) => {
    // if they are logged in, send over the HTML
    // and once the client has the HTML, start.js will render the <p> tag onscreen
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, () => {
    console.log("I'm listening.");
});
