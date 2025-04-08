import jwt from 'jsonwebtoken';
import User from "./models/User.js"; 
import ChatServer from "./server.js";


/**
* Creates a new user if the username is not already taken. This function is called when the user submits the signup form.
* 
* @param {object} req - The request object from the client (an object containing the cleartext username and password).
* @param {object} res - The Server's response to the client (an object containing the response code and success message).
*/
export async function createUser(req, res) {
    const { username, password } = req.body;
    ChatServer.debug(`Creating user: '${username}'...`);

    try {
        // Find the user in the database model
        const users = await User.findOne({ username });
        
        // Check if the username is already taken
        if (users != null) {
            ChatServer.debug(`User '${username}' already exists`);
            return res.status(400).json({ message: 'User already exists' });
        }
        if (username.length > 16) {
            ChatServer.debug(`Username '${username}' is too long (16 characters max)`);
            return res.status(400).json({ message: 'Username must be less than 16 characters long!' });
        }
        // Make new object of the User model with the username and password
        const user = new User({ username, password });

        // Save the user to the database
        await user.save();
        ChatServer.debug(`User '${username}' created successfully`);
        res.status(201).json({message: 'User created successfully'});

    } catch (err) {
        ChatServer.debug(`Error creating user: ${err.message}`);
        res.status(400).json({message: err.message});
    }
}

/**
* Logs in the user if their hashed password matches the user. A JWT token is generated and sent back to the client.
* This function is called when the user submits the login form.
* 
* @param {object} req - The request object from the client (an object containing the cleartext username and password).
* @param {object} res - The Server's response to the client (an object containing the JWT with expiry).
*/
export async function loginUser(req, res) {
    // Obtain parameters from the request body
    // This is where you would typically hash the password and compare it with the stored hash
    const { username, password } = req.body;
    ChatServer.debug(`Logging in user: '${username}'...`);

    try {
        // Find the user in the database model
        const user = await User.findOne({ username });
    
        // If no user found, return an error
        if (!user) {
            ChatServer.debug(`User '${username}' not found`);
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        // TODO: Use bcrypt to hash the password and compare it with the stored hash
        if (user.password !== password) {
            ChatServer.debug(`Invalid password for user '${username}'`);
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        // If the username and password match, proceed with login and send 
        ChatServer.debug(`User '${username}' logged in successfully`);
        ChatServer.debug(ChatServer.SECRET_KEY);
        const token = jwt.sign({ userId: user._id, username: user.username }, ChatServer.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token });

        // No duplicate userames are allowed
        ChatServer.USERS.set(username, token);

    } catch (err) {
        ChatServer.debug(`Error logging the user in: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
}

/**
* Verifies if the username is available. This function is called when the user types in the username input field.
* 
* @param {object} req - The request object from the client (containing the current inputted username).
* @param {object} res - The Server's response to the client (code and related status message).
*/
export async function checkUsername(req, res) {
    const { username } = req.body;
    ChatServer.debug(`Checking availability for username: '${username}'`);

    try {
        // Query the user in the database model
        const user = await User.findOne({ username }); 
        if (user) {
            ChatServer.debug(`User '${username}' already exists`);
            return res.status(400).json({ message: 'Username already taken' });
        }
        // If no user found, return success
        ChatServer.debug(`User '${username}' is available`);
        res.status(200).json({ message: 'Username is available' });

    } catch (err) {
        ChatServer.debug(`Error checking username: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
}