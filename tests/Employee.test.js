const Employee = require('../lib/employee');

describe('Employee', () => {
    describe('getName', () => {
        it('should return this.name', () => {
            const employee = new Employee("John", "4", "john@gmail.com");
            expect(employee.getName()).toEqual("John");
        })
    })
})

describe('Employee', () => {
    describe('getID', () => {
        it('should return this.id', () => {
            const employee = new Employee("John", "4", "john@gmail.com");
            expect(employee.getID()).toEqual("4");
        })
    })
})

describe('Employee', () => {
    describe('getEmail', () => {
        it('should return this.email', () => {
            const employee = new Employee("John", "4", "john@gmail.com");
            expect(employee.getEmail()).toEqual("john@gmail.com");
        })
    })
})

describe('Employee', () => {
    describe('getRole', () => {
        it('should return the string \"Employee\"', () => {
            const employee = new Employee("John", "4", "john@gmail.com");
            expect(employee.getRole()).toEqual("Employee");
        })
    })
})