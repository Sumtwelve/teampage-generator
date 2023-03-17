const Engineer = require('../lib/engineer');

describe('Engineer', () => {
    it('should hold solid references to its properties', () => {
        let engrName = "John";
        let engrID = "4";
        let engrEmail = "john@gmail.com";
        let engrGithub = "Pulsar"
        const engineer = new Engineer("John", "4", "john@gmail.com", "Pulsar");
        expect(engineer.name).toEqual(engrName);
        expect(engineer.id).toEqual(engrID);
        expect(engineer.email).toEqual(engrEmail);
        expect(engineer.githubUsername).toEqual(engrGithub);
    });

    describe('getName', () => {
        it('should return this.name', () => {
            const engineer = new Engineer("John", "4", "john@gmail.com", "Pulsar");
            expect(engineer.getName()).toEqual("John");
        });
    });

    describe('getID', () => {
        it('should return this.id', () => {
            const engineer = new Engineer("John", "4", "john@gmail.com", "Pulsar");
            expect(engineer.getID()).toEqual("4");
        });
    });

    describe('getEmail', () => {
        it('should return this.email', () => {
            const engineer = new Engineer("John", "4", "john@gmail.com", "Pulsar");
            expect(engineer.getEmail()).toEqual("john@gmail.com");
        });
    });

    describe('getRole', () => {
        it('should return the string \"Engineer\"', () => {
            const engineer = new Engineer("John", "4", "john@gmail.com", "Pulsar");
            expect(engineer.getRole()).toEqual("Engineer");
        });
    });

    describe('getRoleSpecificDataField', () => {
        it('should return the string \"GitHub Username\"', () => {
            let engrDataField = "GitHub Username";
            const engineer = new Engineer();
            expect(engineer.getRoleSpecificDataField()).toEqual(engrDataField);
        });
    });

    describe('getRoleSpecificData', () => {
        it('should return this.officeNumber', () => {
            let github = "Pulsar";
            const engineer = new Engineer("John", "4", "john@gmail.com", "Pulsar");
            expect(engineer.getRoleSpecificData()).toEqual(github);
        });
    });
});


// A new suite to test situations where Engineer instance might have undefined fields
describe('Engineer', () => {
    it('should have \'undefined\' for fields not set in initialization', () => {
        const incompleteEngineer = new Engineer();
        expect(incompleteEngineer.getName()).toBeUndefined();
        expect(incompleteEngineer.getID()).toBeUndefined();
        expect(incompleteEngineer.getEmail()).toBeUndefined();
        expect(incompleteEngineer.getRoleSpecificData()).toBeUndefined();
    });
});