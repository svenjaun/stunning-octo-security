const { Pool, Client } = require('pg')
const config = require('./../config');


const client = new Client({
    user: config.db_user,
    host: config.db_url,
    database: config.db_name,
    password: config.db_password,
    port: 5432,
})
client.connect()
client.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log(err.stack)
    } else {
        console.log("DB-Client connected")
    }
})

module.exports.getRoleId = async (name) => {
    const query = 'SELECT * FROM octo_role where name = $1'
    const values = [name]
    try {
        const res = await client.query(query, values)
        return res.rows[0]
    } catch (err) {
        console.log(err.stack)
        return "-1";
    }

}

module.exports.saveUser = async (username, email, pw, role, key) => {
    const query = 'INSERT INTO octo_user(username, email, pw_hash, role_id, key) VALUES ($1, $2, $3, $4, $5)'
    const values = [username, email, pw, role, key]
    try {
        await client.query(query, values);
        return true
    } catch (err) {
        return false;
    }
}

module.exports.getUser = async (username) => {
    const query = 'SELECT u.id, u.username, u.email, u.pw_hash, r.name as role_name FROM octo_user u join octo_role r on r.id = u.role_id where username = $1'
    const values = [username]

    try {
        const res = await client.query(query, values)
        return res.rows[0]
    } catch (err) {
        return null;
    }
}

module.exports.getUserRole = async (username) => {
    const query = 'SELECT r.name as role FROM octo_user u join octo_role r on r.id = u.role_id where username = $1'
    const values = [username]
    try {
        const res = await client.query(query, values)
        return res.rows[0]["role"]
    } catch (err) {
        console.log(err);
        return null;
    }
}


module.exports.getAllUser = async (role) => {
    let query = 'SELECT u.id, u.username, r.name as role_name FROM octo_user u join octo_role r on r.id = u.role_id'
    if (role === "Octo_Admin" || role === "Octo_Boss") {
        query = 'SELECT u.id, u.username, u.email, r.name as role_name FROM octo_user u join octo_role r on r.id = u.role_id'
    }
    const values = []

    try {
        const res = await client.query(query, values)
        return res.rows
    } catch (err) {
        return null;
    }
}

module.exports.getImportance = async (role) => {
    let query = 'SELECT importance FROM octo_role where name = $1'
    const values = [role]

    try {
        const res = await client.query(query, values)
        return res.rows[0]
    } catch (err) {
        console.log(err);
        return 0;
    }
}

module.exports.grantAdmin = async (email) => {
    const query = "UPDATE octo_user set role_id = (SELECT id from octo_role where name = 'Octo_Admin') where email = $1"
    const values = [email]

    try {
        await client.query(query, values)
        return true
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports.removeAdmin = async (email) => {
    const query = "UPDATE octo_user set role_id = (SELECT id from octo_role where name = 'Octo_User') where email = $1"
    const values = [email]

    try {
        await client.query(query, values)
        return true
    } catch (err) {
        console.log(err);
        return false;
    }
}