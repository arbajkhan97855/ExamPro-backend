const db = require("../config/db");

const getStudentById = async (id) => {

    const sql = `
        SELECT
            id,
            fullname,
            email,
            mobile,
            profile_image,
            role,
            status,
            created_at
        FROM users
        WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    return rows;
};

module.exports = {
    getStudentById
};