const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/testexe"
);

module.exports.addUser = (email, password) => {
    return db.query(
        `
        INSERT INTO users (email, password)
        VALUES ($1, $2)
        RETURNING id, email
    `,
        [email, password]
    );
};

module.exports.login = (email) => {
    return db.query(
        `
        SELECT password, id, email FROM users WHERE email = $1
    `,
        [email]
    );
};

module.exports.getRepos = (userId) => {
    return db.query(
        `
    SELECT * FROM repos WHERE refId = $1
    `,
        [userId]
    );
};

module.exports.addRepo = (
    refId,
    owner,
    projName,
    url,
    stars,
    forks,
    issues,
    timestamp
) => {
    return db.query(
        `
        INSERT INTO repos (refId, owner, proj_name, url, stars, forks, issues, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `,
        [refId, owner, projName, url, stars, forks, issues, timestamp]
    );
};
