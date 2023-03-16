const Employee = require("./employee");

class Engineer extends Employee {
    constructor(name, id, email, githubUsername) {
        super(name, id, email);
        this.githubUsername = githubUsername;
    }

    getRole() {
        return "Engineer";
    }

    getRoleSpecificDataField() {
        return "GitHub Username";
    }

    getPrintableInfo() {
        return super.getPrintableInfo().push(this.githubUsername);
    }
}

module.exports = Engineer;