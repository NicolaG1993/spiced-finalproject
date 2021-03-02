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
const s3 = require("./s3"); //per post pics

const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");

const { uploader } = require("./upload");

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

app.post(
    "/profile-pic",
    uploader.single("file"),
    s3.upload,
    async (req, res) => {
        console.log("POST req to route /profile-pic");
        // console.log("req.body: ", req.body);
        // console.log("req.file: ", req.file);

        if (req.file) {
            const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;

            try {
                const { rows } = await db.uploadProfileImage(
                    url,
                    req.session.userId
                );
                res.json(rows[0]);
            } catch (err) {
                console.log("err with db.uploadProfileImage: ", err);
                res.json({ error: true });
            }
        } else {
            console.log("No file in uploader!");
            res.json({ error: true });
        }
    }
);

app.post("/update-bio", async (req, res) => {
    console.log("POST req to route /update-bio");
    console.log("req.body: ", req.body);

    if (req.body.bio) {
        try {
            const { rows } = await db.updateBio(
                req.body.bio,
                req.session.userId
            );
            res.json(rows[0]);
        } catch (err) {
            console.log("err with db.updateBio: ", err);
            res.json({ error: true });
        }
    } else {
        console.log("No text in bio!");
        res.json({ error: true });
    }
});

/////*****OTHER USER*****/////
app.get("/api/other-profile/:id", async (req, res) => {
    //can also use "/user/:id.json" instead
    console.log("GET req to route /api/other-profile/:id");
    try {
        const { rows } = await db.getUser(req.params.id);
        if (rows.length) {
            res.json(rows[0]);
        } else {
            console.log("err with db.getUser (other user): no user found");
            res.json({ error: true });
        }
    } catch (err) {
        console.log("err with db.getUser (other user): ", err);
        res.json({ error: true });
    }
});

/////*****FIND USERS*****/////
app.get("/api/find-users/:name", async (req, res) => {
    console.log("GET req to route /api/find-users/:name");

    if (req.params.name === "pageload") {
        try {
            const { rows } = await db.findRecentUsers();
            console.log("rows (findRecentUsers): ", rows);
            res.json(rows);
        } catch (err) {
            console.log("err with db.findRecentUsers: ", err);
            res.json({ error: true });
        }
    } else {
        try {
            const { rows } = await db.findUser(req.params.name);
            console.log("rows (findRecentUsers): ", rows);
            res.json(rows);
        } catch (err) {
            console.log("err with db.findUser: ", err);
            res.json({ error: true });
        }
    }
});

/////*****FOLLOWS*****/////
app.get("/api/follow/:id", async (req, res) => {
    console.log("GET req to route /api/follow/:id");

    let userId = req.session.userId;
    let profileId = req.params.id;
    console.log("userId: ", userId, " - profileId: ", profileId);

    try {
        const { rows } = await db.followStatus(userId, profileId);
        console.log("rows (followStatus): ", rows);

        if (!rows.length) {
            res.json({ buttonText: "Follow" });
        } else if (rows[0].following) {
            res.json({ buttonText: "Unfollow" });
        }
    } catch (err) {
        console.log("err with db.followStatus: ", err);
        res.json({ error: true });
    }
});

app.post("/api/follow/:id", async (req, res) => {
    console.log("POST req to route /api/follow/:id");
    let userId = req.session.userId;
    let profileId = req.params.id;
    let status = req.body.buttonText;

    if (status == "Follow") {
        try {
            const result = await db.follow(userId, profileId);
            res.json({
                buttonText: "Unfollow",
                profileId: result.recipient_id,
            });
        } catch (err) {
            console.log("err with db.follow: ", err);
            res.json({ error: true }); //mi serve qua?
        }
    } else if (status == "Unfollow") {
        try {
            const result = await db.unfollow(userId, profileId);
            res.json({
                buttonText: "Follow",
                profileId: result.recipient_id,
            });
        } catch (err) {
            console.log("err with db.unfollow: ", err);
            res.json({ error: true });
        }
    }
});

/////*****FOLLOWERS LIST*****/////
app.get("/api/get-followers", async (req, res) => {
    try {
        const { rows } = await db.followersList(req.session.userId);
        console.log("rows (followersList): ", rows);
        res.json({ rows, userId: req.session.userId });
    } catch (err) {
        console.log("err with db.followersList: ", err);
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

0) Progetto e features 🌵

1) Setup
1.a) notes from class -> if using react (create-react-app? , spiced setup)
1.b) node modules (quelli che ho sono giusti? me ne servono altri per le mie features?) 🐞
1.c) files tipo "jest.js", ".eslintrc.json", etc (vedi socialnetwork)
1.d) spiced-pg (usare mio postgres) 🐞
1.e) ordinare routes del server come in imageboard project (usando express.router -> ma sto usando react-router?) 🐞
1.f) come posso ordinare meglio i miei files in directories? (in client/src) 🐞

2) Credentials 🐞
2.a) AWS KEYS in secrets.json -> da dove le prendo? postgress credentials?
2.b) ses.js (send email) -> indirizzo email di spiced
2.c) s3.js (cosa fa?) -> bucket di spiced 
2.d) db.js / spicedPg (cosa fa?) -> cambiare nome var per mio pg? 

3) Profile 🐞
3.a) è un function comp (devo passargli props e fns da state in app, come id, first, etc)
di conseguenza non posso dichiarare fn dentro (sure) ne alterare state (not sure) - capire bene questo
3.b) creare ed usare Uploader solo dentro profile, non in app 🐞
3.c) rifare con redux (opzionale) 🐞

4) Follows 🌵
4.1) Update delle funzioni di friendships in sql e db
4.2) Il follow o non follow modifica il tasto solo per la persona che segue non per entrambe!
4.3) Sará comunque possibile vedere chi ci segue

5) Followers List 🐞
5.1) Update della funzione di friendList in db 🌵
5.2) Update delle funzioni di friendList in redux (actions e reducer) 🌵
5.3) Sistemare use selector (ho passato id da app come props, giusto?) 🌵
5.4) Usare solo un btn in following e followers (che si aggiorna solo per user) 🌵
5.5) devono esserci due liste diverse ma che possono contenere entrambe lo stesso profilo (se ci seguiamo a vicenda) 🌵
5.6) unfollow funziona solo se follow prima (in Follower List), se aggiorno la lista é ok (forse il problema é in reducer?) 🐞
5.7) se arrivo da un altra pagina il btn non matcha piu, ed ho un clone del mio elemento (praticamente tutto funziona solo se su quello che faccio nel component, quando esco iniziano i bugs) 🐞

6)

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
