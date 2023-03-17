const Employee = require("./employee");

class Engineer extends Employee {
    constructor(name, id, email, githubUsername) {
        super(name, id, email);
        this.githubUsername = githubUsername;
    }

    getRole() {
        return "Engineer";
    }

    getGithub() {
        return this.githubUsername;
    }

    getRoleSpecificDataField() {
        return "GitHub Username";
    }

    getRoleSpecificData() {
        return this.githubUsername;
    }
}

module.exports = Engineer;