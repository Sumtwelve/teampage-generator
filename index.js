const inquirer = require("inquirer");
const fs = require("fs");

const Employee = require("./lib/employee");
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const generateHTML = require("./src/generateHTML");
const generateCSS = require("./src/generateCSS");

// Create a `team` object in the global scope.
// Most of the Inquirer stuff is recursive, so data will be saved here between runs so the recursion
// doesn't override the team data.
let team = {
    teamName: "",
    managers: [],
    engineers: [],
    interns: []
};


// Welcome the user to the app and do some explaining.
console.log("Welcome to Sumtwelve's Team Page Generator!");
console.log("\nA series of prompts will guide you through creating a webpage\nthat will store useful info and links about your team members.\n");
console.log("To begin, you must enter a Team Name and at least one Team Manager.\n")

// Team has to have a name and at least one manager, so take care of those immediately.
inquirer
    .prompt([
        {
            type: "input",
            message: "What is your team called?",
            name: "teamName"
        },
        {
            type: "input",
            message: "Enter the following for your Team Manager\nName:",
            name: "mgrName"
        },
        {
            type: "input",
            message: "Employee ID:",
            name: "mgrID"
        },
        {
            type: "input",
            message: "Email address:",
            name: "mgrEmail"
        },
        {
            type: "input",
            message: "Office number:",
            name: "mgrOfficeNum"
        }
    ])
    .then((answers) => {
        // Set the Team Name into the `team` object
        team.teamName = answers.teamName;

        // Create a new manager object to insert into the team object.
        // This method allows us to call the inquirer multiple times
        // without having to worry about losing any answers data.
        let mgr = new Manager(
            answers.mgrName, 
            answers.mgrID,
            answers.mgrEmail,
            answers.mgrOfficeNum
        );

        // Push new manager object to the `manager.list` array of the `team` object.
        team.managers.push(mgr);
        console.log("DEBUG: Successfully pushed first manager to managers list!");

        mainMenu();
    })
    .catch((error) => {
        console.error(error);
    });


// Function to display the Main Menu
// Calling inquirer inside a function like this allows recursion,
// which in turn allows teams of infinite size to be made.
function mainMenu() {
    console.log("\nMAIN MENU");
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["Add team member", "Finish entering data and build the webpage", "Exit without generating the webpage"],
                name: "mainMenuAction"
            },
            // Only two of those options require "Are you sure?" prompts.
            {
                type: "list",
                message: "Are you sure you would like to move on? You'll have a chance to review your team and add more members if needed.",
                choices: ["Yes, continue to team review", "No, go back to the main menu"],
                name: "finishYesNo",
                when: (answers) => answers.mainMenuAction === "Finish entering data and build the webpage"
            },
            {
                type: "list",
                message: "Are you sure you want to exit now? All information entered will be permanently lost.",
                choices: ["Yes, exit now without saving", "No, go back to the main menu"],
                name: "exitYesNo",
                when: (answers) => answers.mainMenuAction === "Exit without generating the webpage"
            }
        ])
        .then((answers) => {
            switch (answers.mainMenuAction) {
                case "Add team member":
                    addMemberToTeam(team);
                    break;
                
                case "Edit my team":
                    editTeam(team);
                    break;

                case "Finish entering data and build the webpage":
                    if (answers.finishYesNo === "Yes, continue to team review") {
                        generateWebpage(team);
                    } else {
                        mainMenu();
                    }
                    break;

                case "Exit without generating the webpage":
                    if (answers.exitYesNo === "No, go back to the main menu") {
                        mainMenu();
                    } else {
                        // This lets the script run out without generating any files,
                        // therefore exiting without saving.
                        console.log("Teampage generator cancelled. Goodbye!");
                    }
                    break;

                default:
                    console.log("ERROR: Invaild selection somehow passed in. Returning to main menu.");
                    mainMenu();
            }
        });
}


function addMemberToTeam(team) {
    console.log("\nEnter the following for new team member:");
    inquirer
        .prompt([
            {
                type: "list",
                message: "Role:",
                choices: ["Manager", "Engineer", "Intern"],
                name: "newMemberRole"
            },
            {
                type: "input",
                message: "Name:",
                name: "newMemberName"
            },
            {
                type: "input",
                message: "Employee ID:",
                name: "newMemberID"
            },
            {
                type: "input",
                message: "Email Address:",
                name: "newMemberEmail"
            },
            // I know this next one looks a bit convoluted, but let me explain.
            // Each role has a unique piece of info it needs. Managers -> Office Number; Engineers -> GitHub Username; Interns -> School
            // Rather than write a switch statement AFTER the prompts and then call a whole new inquirer to prompt the user for this unique info,
            // I wrote a method in the Employee class that will return the unique data field as a string, given the role.
            {
                type: "input",
                message: (answers) => `${getRoleSpecificDataField(answers.newMemberRole)}:`,
                name: "newMemberRoleSpecificInfo"
            },
            {
                type: "list",
                message: "Add another team member?",
                choices: ["No, go back to main menu", "Yes, add another"],
                name: "addAnotherTeamMemberYesNo"
            }
        ])
        .then((answers) => {

            // let newMember = {
            //     role: answers.newMemberRole,
            //     name: answers.newMemberName,
            //     employeeID: answers.newMemberID,
            //     email: answers.newMemberEmail
            // };

            let newMember;

            // I was trying to avoid writing a switch statement... guess it could be worse.
            // FIXME: This code is repetitive. How can I make the program decide which class to instantiate
            // depending on the contents of a string?
            switch (answers.newMemberRole) {
                case "Manager":
                    newMember = new Manager(
                        answers.newMemberName,
                        answers.newMemberID,
                        answers.newMemberEmail,
                        answers.newMemberRoleSpecificInfo
                    );
                    break;

                case "Engineer":
                    newMember = new Engineer(
                        answers.newMemberName,
                        answers.newMemberID,
                        answers.newMemberEmail,
                        answers.newMemberRoleSpecificInfo
                    );
                    break;

                case "Intern":
                    newMember = new Intern(
                        answers.newMemberName,
                        answers.newMemberID,
                        answers.newMemberEmail,
                        answers.newMemberRoleSpecificInfo
                    );
                    break;

                default:
                    console.error(`addMemberToTeam() :: Error when adding new member: Unexpected role "${answers.newMemberRole}" in switch statement.\nReturning to main menu.`);
                    mainMenu();
                    break;
            }

            // debug stuff
            //console.log("get printable info function for new member:\n" + newMember.getPrintableInfo());

            // PUSH TO TEAM OBJECT!!
            // This selects an array within the team object.
            // The name of the array is a key in the team object, so that's how this method selects it by passing in a string.
            // Note that I had to add an 's' manually (⤵) to actually match the name of that array.
            team[`${answers.newMemberRole.toLowerCase()}s`].push(newMember);

            // RECURSION!!
            if (answers.addAnotherTeamMemberYesNo === "Yes, add another") {
                addMemberToTeam(team);
            } else {
                mainMenu();
            }
        })
        .catch((error) => {
            if (error.isTtyError) {
                console.error("Error: Prompt couldn't be rendered in the current environment");
            } else {
                console.error(error);
            }
        });
}

// TODO: Implement the "Edit Team" feature later.
// function editTeam(team) {
//     console.log("Here is your team so far:")
// }


function generateWebpage(team) {

    console.log("Here's your team so far:");

    printTeam(team);

    inquirer
        .prompt([
            {
                type: "list",
                message: "Does this look correct and complete?",
                choices: ["No, go back to main menu", "Yes, generate webpage now"],
                name: "generateNowYesNo"
            }
        ])
        .then((answers) => {
            if (answers.generateNowYesNo === "Yes, generate webpage now") {
                // first is the HTML!
                fs.writeFile(
                    `./dist/${team.teamName}/index.html`,
                    // TODO: finish this once you've written the HTML generator
                )
            } else {
                mainMenu();
            }
        })
}


// A function to print to the console a neatly formatted overview of the user's team
function printTeam(team) {

    // Print the team name in all caps OUTSIDE of the for loop
    console.log(team.teamName.toUpperCase());

    // TODO: implement a team member counting feature into the main `for` loop
    let teamMemberCount = 0;

    // My first ever triple-nested for loop. This only happened because of the way the `team` object is structured,
    // since I have to reach in three levels to get to the actual member data. There's probably a more efficient way to do this.
    for (let memberListName in team) {
        // Loop will grab `teamName` element of `team`. To prevent this, only proceed if an array was grabbed.
        if (typeof team[memberListName] === "object") {
            console.log(`+-------------- ${memberListName.toUpperCase()} ---------------\n|`);
            for (let member of team[memberListName]) {
                
                for (let data of Object.values(member)) {
                    console.log(`|  ${data}`);
                }
                console.log("|");
                
            }
        } else continue; // this happens when team.teamName is grabbed
    }

    console.log("+---------------------------------------");
    //console.log(`Total Team Members: ${teamMemberCount}`);
}


// Function to get the name of the data field specific to a role
function getRoleSpecificDataField(role) {
    switch (role) {
        case "Manager":
            return "Office Number";
        
        case "Engineer":
            return "GitHub Username";

        case "Intern":
            return "School";

        default:
            return "ERROR";
    }
}


// Function to capitalize the first letter of a string
function toNameCase(str) {
    return `${str.substring(0,1).toUpperCase()}${str.substring(1)}`;
}