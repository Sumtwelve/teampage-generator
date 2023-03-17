const Intern = require('../lib/intern');

describe('Intern', () => {
    it('should hold solid references to its properties', () => {
        let intrnName = "John";
        let intrnID = "4";
        let intrnEmail = "john@gmail.com";
        let intrnSchool = "BYU";
        const intern = new Intern("John", "4", "john@gmail.com", "BYU");
        expect(intern.name).toEqual(intrnName);
        expect(intern.id).toEqual(intrnID);
        expect(intern.email).toEqual(intrnEmail);
        expect(intern.school).toEqual(intrnSchool);
    });

    describe('getName', () => {
        it('should return this.name', () => {
            const intern = new Intern("John", "4", "john@gmail.com", "BYU");
            expect(intern.getName()).toEqual("John");
        });
    });

    describe('getID', () => {
        it('should return this.id', () => {
            const intern = new Intern("John", "4", "john@gmail.com", "BYU");
            expect(intern.getID()).toEqual("4");
        });
    });

    describe('getEmail', () => {
        it('should return this.email', () => {
            const intern = new Intern("John", "4", "john@gmail.com", "BYU");
            expect(intern.getEmail()).toEqual("john@gmail.com");
        });
    });

    describe('getRole', () => {
        it('should return the string \"Intern\"', () => {
            const intern = new Intern("John", "4", "john@gmail.com", "BYU");
            expect(intern.getRole()).toEqual("Intern");
        });
    });

    describe('getRoleSpecificDataField', () => {
        it('should return the string \"School\"', () => {
            let intrnDataField = "School";
            const intern = new Intern();
            expect(intern.getRoleSpecificDataField()).toEqual(intrnDataField);
        });
    });

    describe('getRoleSpecificData', () => {
        it('should return this.officeNumber', () => {
            let school = "BYU";
            const intern = new Intern("John", "4", "john@gmail.com", "BYU");
            expect(intern.getRoleSpecificData()).toEqual(school);
        });
    });
});


// A new suite to test situations where Intern instance might have undefined fields
describe('Intern', () => {
    it('should have \'undefined\' for fields not set in initialization', () => {
        // nothing set on intitialization means all fields should be undefined
        const incompleteIntern = new Intern();
        expect(incompleteIntern.getName()).toBeUndefined();
        expect(incompleteIntern.getID()).toBeUndefined();
        expect(incompleteIntern.getEmail()).toBeUndefined();
        expect(incompleteIntern.getRoleSpecificData()).toBeUndefined();
    });
});