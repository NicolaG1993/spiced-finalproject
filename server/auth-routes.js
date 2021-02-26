// //FILE IN ATTESA DI CHIAMATA CON INSEGNANTE
// const express = require("express");
// const router = express.Router();
// const cryptoRandomString = require("crypto-random-string");

// const db = require("./db");
// const bc = require("./bc");
// const ses = require("./ses");

// /////*****AUTH*****/////
// router.post("/api/registration", async (req, res) => {
//     console.log("req.body: ", req.body);
//     const { first, last, email, password } = req.body;
//     try {
//         const hashedPw = await bc.hash(password);
//         const results = await db.userRegistration(first, last, email, hashedPw);
//         req.session.userId = results.rows[0].id;
//         console.log("db.userRegistration had no issues!");
//         res.json({ results });
//     } catch (err) {
//         console.log("err in POST /registration", err.message);
//         console.log(err.code);
//         if (err.message === 'relation "users" does not exist') {
//             // send back an error specific response
//             console.log('relation "users" does not exist');
//             res.json({ error: true });
//         } else if (err.code == "54301") {
//             // send back an error specific response
//             console.log("err.code: 54301");
//             res.json({ error: true });
//         }
//         res.json({ error: true });
//     }
// });

// router.post("/login", (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     db.checkUser(email)
//         .then((results) => {
//             const hashFromDB = results.rows[0].password;
//             bc.compare(password, hashFromDB)
//                 .then((match) => {
//                     if (match) {
//                         req.session.userId = results.rows[0].id;
//                         res.json(results);
//                     } else {
//                         console.log("ERR in bc.compare, infos not correct!!!");
//                         res.json({ error: true });
//                     }
//                 })
//                 .catch((err) => {
//                     console.log("ERR in bc.compare: ", err);
//                     res.json({ error: true });
//                 });
//         })
//         .catch((err) => {
//             console.log("ERR in db.checkUser: ", err);
//             res.json({ error: true });
//         });
// });

// /////*****RESET PSW*****/////
// router.post("/password/reset/start", (req, res) => {
//     const email = req.body.email;

//     db.checkUser(email)
//         .then((results) => {
//             console.log("results: ", results.rows[0].email);
//             if (results.rows[0].email) {
//                 const code = cryptoRandomString({
//                     length: 6,
//                 });
//                 db.storeCode(email, code)
//                     .then(
//                         ses
//                             .sendEmail(
//                                 email,
//                                 code,
//                                 "Here is your reset password code"
//                             )
//                             .then(res.json({ codeSended: true }))
//                             .catch((err) => {
//                                 console.log("ERR in ses.sendEmail: ", err);
//                                 res.json({ error: true });
//                             })
//                     )
//                     .catch((err) => {
//                         console.log("ERR in db.storeCode: ", err);
//                         res.json({ error: true });
//                         //questo errore non torna come render
//                     });
//             } else {
//                 res.json({ error: true });
//             }
//         })
//         .catch((err) => {
//             console.log("ERR in db.checkUser (reset post req): ", err);
//             res.json({ error: true });
//         });
// });

// router.post("/password/reset/verify", (req, res) => {
//     const password = req.body.password;
//     const code = req.body.code;

//     db.checkCode(code)
//         .then((results) => {
//             console.log("results: ", results.rows);
//             const email = results.rows[0].email;
//             bc.hash(password)
//                 .then((hashedPw) => {
//                     db.updatePassword(email, hashedPw)
//                         .then(
//                             //capire come passare email da post precedente (per update psw) forse con results.rows
//                             res.json({ pswUpdated: true })
//                         )
//                         .catch((err) => {
//                             console.log("ERR in db.updatePassword: ", err);
//                             res.json({ error: true });
//                         });
//                 })
//                 .catch((err) => {
//                     console.log("ERR in hash:", err);
//                 });
//         })
//         .catch((err) => {
//             console.log("ERR in db.checkCode: ", err);
//             res.json({ error: true });
//         });
// });

// exports.router = router;
