
class User {
    constructor(id, username, wins) {
        this.id = id;
        this.username = username;

        this.wins = wins;
    }

    getId() {
        return this.id;
    }
    /**
     * @param {string} username
     */
    setUsername(username) {
        this.username = username;
    }
    getUsername() {
        return this.username;
    }
    getWins() {
        return this.wins;
    }   
    receiveMessage() {
        // TODO: receive message from user
    }
    sendMessage(msg) {
        // TODO: send message to user
    }
}

export default User;