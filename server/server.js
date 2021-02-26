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
// const authRouter = require("./auth-routes").router;
// const profileRouter = require("./profile-routes").router;
const db = require("./db");
const bc = require("./bc");
const ses = require("./ses");
// const s3 = require("./s3"); //per post pics

const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");

// const { uploader } = require("./upload");

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

// app.use(authRouter);
// app.use(profileRouter);

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

/////*****AUTH*****/////
app.post("/registration", async (req, res) => {
    console.log("req.body: ", req.body);
    const { first, last, email, password } = req.body;
    try {
        const hashedPw = await bc.hash(password);
        const results = await db.userRegistration(first, last, email, hashedPw);
        req.session.userId = results.rows[0].id;
        console.log("db.userRegistration had no issues!");
        res.json({ results });
    } catch (err) {
        console.log("err in POST /registration", err.message);
        console.log(err.code);
        if (err.message === 'relation "users" does not exist') {
            // send back an error specific response
            console.log('relation "users" does not exist');
            res.json({ error: true });
        } else if (err.code == "54301") {
            // send back an error specific response
            console.log("err.code: 54301");
            res.json({ error: true });
        }
        res.json({ error: true });
    }
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.checkUser(email)
        .then((results) => {
            const hashFromDB = results.rows[0].password;
            bc.compare(password, hashFromDB)
                .then((match) => {
                    if (match) {
                        req.session.userId = results.rows[0].id;
                        res.json(results);
                    } else {
                        console.log("ERR in bc.compare, infos not correct!!!");
                        res.json({ error: true });
                    }
                })
                .catch((err) => {
                    console.log("ERR in bc.compare: ", err);
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.log("ERR in db.checkUser: ", err);
            res.json({ error: true });
        });
});

/////*****RESET PSW*****/////
app.post("/password/reset/start", (req, res) => {
    const email = req.body.email;

    db.checkUser(email)
        .then((results) => {
            console.log("results: ", results.rows[0].email);
            if (results.rows[0].email) {
                const code = cryptoRandomString({
                    length: 6,
                });
                db.storeCode(email, code)
                    .then(
                        ses
                            .sendEmail(
                                email,
                                code,
                                "Here is your reset password code"
                            )
                            .then(res.json({ codeSended: true }))
                            .catch((err) => {
                                console.log("ERR in ses.sendEmail: ", err);
                                res.json({ error: true });
                            })
                    )
                    .catch((err) => {
                        console.log("ERR in db.storeCode: ", err);
                        res.json({ error: true });
                        //questo errore non torna come render
                    });
            } else {
                res.json({ error: true });
            }
        })
        .catch((err) => {
            console.log("ERR in db.checkUser (reset post req): ", err);
            res.json({ error: true });
        });
});

app.post("/password/reset/verify", (req, res) => {
    const password = req.body.password;
    const code = req.body.code;

    db.checkCode(code)
        .then((results) => {
            console.log("results: ", results.rows);
            const email = results.rows[0].email;
            bc.hash(password)
                .then((hashedPw) => {
                    db.updatePassword(email, hashedPw)
                        .then(
                            //capire come passare email da post precedente (per update psw) forse con results.rows
                            res.json({ pswUpdated: true })
                        )
                        .catch((err) => {
                            console.log("ERR in db.updatePassword: ", err);
                            res.json({ error: true });
                        });
                })
                .catch((err) => {
                    console.log("ERR in hash:", err);
                });
        })
        .catch((err) => {
            console.log("ERR in db.checkCode: ", err);
            res.json({ error: true });
        });
});

/////*****USER*****/////
app.get("/user", async (req, res) => {
    console.log("GET req to route /user");

    try {
        const { rows } = await db.getUser(req.session.userId);
        res.json(rows[0]);
    } catch (err) {
        console.log("ERR in db.getUser: ", err);
        res.json({ error: true });
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

/*

OBBIETTIVI:

0) Progetto e features

1) Setup
1.a) notes from class -> if using react (create-react-app? , spiced setup)
1.b) node modules (quelli che ho sono giusti? me ne servono altri per le mie features?)
1.c) files tipo "jest.js", ".eslintrc.json", etc (vedi socialnetwork)
1.d) spiced-pg (usare mio postgres)
1.e) ordinare routes del server come in imageboard project (usando express.router -> ma sto usando react-router?)

2) Credentials
2.a) AWS KEYS in secrets.json -> da dove le prendo? postgress credentials?
2.b) ses.js (send email) -> indirizzo email di spiced
2.c) s3.js (cosa fa?) -> bucket di spiced 
2.d) db.js / spicedPg (cosa fa?) -> cambiare nome var per mio pg? 

3) 

4)

*/

/*
npm start
npm run dev
npm run dev:server
npm run dev:client

npm run test filename ??
sudo service postgresql start
killall node
*/
