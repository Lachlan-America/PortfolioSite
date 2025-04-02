import jwt from 'jsonwebtoken';

const SECRET = 'your-secret-key';
const users = new Map();  // Temporary user store

export function signup(req, res) {
    const { username, password } = req.body;

    if (users.has(username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    users.set(username, password);
    res.json({ message: 'User created' });
}

export function login(req, res) {
    const { username, password } = req.body;

    if (users.get(username) === password) {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
}