const express = require("express");
const app = express();
const path = require("path");
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const { compare, hash } = require("./bc");

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(express.json());

const cookieSessionMw = cookieSession({
    secret: `secret string`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});

app.use(cookieSessionMw);

app.get("/user/id.json", (req, res) => {
    if (req.session.sessId) {
        res.json({
            userId: req.session.sessId,
        });
    } else {
        res.json({
            userId: null,
        });
    }
});

app.post("/user/register.json", async (req, res) => {
    // console.log('req.body:', req.body); // works
    const { email, pass } = req.body;
    if (email !== "" && email.length > 3 && pass !== "" && pass.length > 3) {
        try {
            const hashedPassword = await hash(pass);
            const addUser = await db.addUser(email, hashedPassword);
            // console.log(addUser.rows[0]);
            req.session.sessId = addUser.rows[0].id;
            res.json(addUser.rows[0]);
        } catch (err) {
            console.log("error in adding user", err);
            res.json({ success: false });
        }
    } else {
        console.log("provide valid credentials");
        res.json({ success: false });
    }
});

app.post("/user/login.json", async (req, res) => {
    if (req.body.email !== "" && req.body.pass !== "") {
        try {
            let tempId;
            const login = await db.login(req.body.email);
            tempId = login.rows[0].id;
            const comparison = await compare(
                req.body.pass,
                login.rows[0].password
            );
            if (comparison) {
                req.session.sessId = tempId;
                res.json({
                    id: login.rows[0].id,
                });
            } else {
                throw new Error("password doesnt match");
            }
        } catch (err) {
            console.log("login error on backend", err);
            res.json({
                success: false,
            });
        }
    } else {
        console.log("provide valid login credentials");
        res.json({
            success: false,
        });
    }
});

app.get("/repos", async (req, res) => {
    try {
        const data = await db.getRepos(req.session.sessId);
        res.json(data.rows);
    } catch (err) {
        console.log("error in retreiving a repos from db", err);
    }
});

app.post("/add-repo", async (req, res) => {
    // console.log("req.body: ", req.body);
    const { owner, projName, url, stars, forks, issues, timestamp } = req.body;
    try {
        const data = await db.addRepo(
            req.session.sessId,
            owner,
            projName,
            url,
            stars,
            forks,
            issues,
            timestamp
        );
        // console.log("returned data from database", data.rows);
        res.json(data.rows[0]);
    } catch (err) {
        console.log("error in adding data to the db", err);
    }
});

app.delete(`/delete-repo/:id`, async (req, res) => {
    // console.log("req.params:", req.params);
    try {
        // eslint-disable-next-line no-unused-vars
        const data = await db.deleteRow(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.log("error in deleting a row from db", error);
        res.json({ success: false });
    }
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
