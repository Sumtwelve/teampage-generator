const Employee = require("./employee");

class Intern extends Employee {
    constructor(name, id, email, school) {
        super(name, id, email);
        this.school = school;
    }

    getRole() {
        return "Intern";
    }

    getRoleSpecificDataField() {
        return "School";
    }

    getPrintableInfo() {
        return super.getPrintableInfo().push(this.school);
    }
}

module.exports = Intern;