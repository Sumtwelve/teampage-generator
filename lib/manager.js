const Employee = require("./employee");

class Manager extends Employee {
    constructor(name, id, email, officeNumber) {
        super(name, id, email);
        this.officeNumber = officeNumber;
    }

    getRole() {
        return "Manager";
    }

    getRoleSpecificDataField() {
        return "Office Number";
    }

    getPrintableInfo() {
        return super.getPrintableInfo().push(this.officeNumber);
    }
}

module.exports = Manager;