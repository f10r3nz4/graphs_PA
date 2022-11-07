export const QUERY = {
    SELECT_USERS: 'SELECT * FROM users',
    SELECT_USER: 'SELECT * FROM users WHERE email = ?',
    CREATE_USER: 'INSERT INTO users (email, password, role) VALUES(?, ?, ?)',
    ADD_TOKENS: 'UPDATE users SET token = token + ? WHERE email = ?',
    REMOVE_TOKENS: 'UPDATE users SET token = token - ? WHERE email = ?',
}