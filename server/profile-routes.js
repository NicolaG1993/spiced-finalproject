// //FILE IN ATTESA DI CHIAMATA CON INSEGNANTE
// const express = require("express");
// const router = express.Router();
// const db = require("./db");
// const s3 = require("./s3"); //per post pics

// /////*****USER*****/////
// router.get("/user", async (req, res) => {
//     console.log("GET req to route /user");

//     try {
//         const { rows } = await db.getUser(req.session.userId);
//         res.json(rows[0]);
//     } catch (err) {
//         console.log("ERR in db.getUser: ", err);
//         res.json({ error: true });
//     }
// });

// //code here

// exports.router = router;
