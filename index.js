const inquirer = require("inquirer");
const fs = require("fs");

// Create a `team` object in the global scope.
// This will allow us to save inquirer's `answers` data externally
// and then reuse the inquirer with new prompts without having to worry about losing any data.
// FIELDS:
// dataNeeded (array): When adding a member of this role, the program will ask for each the infos in this array.
// list (array): A list of all team members (each stored as objects) with this role.
let team = {
    teamName: "",
    managers: [],
    engineers: [],
    interns: []
}

// I want the assignable roles to persist between script runs.
// My solution to this is to store all roles (including user-created roles)
// in a separate file, then read and split that file into this `roles` array.
// When the user creates a new role, it will be written to the roles.txt file.
let roles = fs.readFileSync("./lib/roles.txt", "utf-8", (err, data) => {
    err ? console.error(err) : console.log(`DEBUG: ROLES DATA! ${data}`);
});
roles = roles.split("\r\n"); // apparently all newlines in .txt files have a carriage return attached to them (?)
//console.log(roles); // debug

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
        let mgr = {
            name: answers.mgrName,
            employeeID: answers.mgrID,
            email: answers.mgrEmail,
            officeNumber: answers.mgrOfficeNum
        };

        // Push new manager object to the `managers` array of the `team` object.
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
    inquirer
        .prompt([
            {
                type: "list",
                message: "MAIN MENU\nWhat would you like to do?",
                choices: ["Add team member", "Edit my team", "Finish entering data and build the webpage", "Exit without generating the webpage"],
                name: "mainMenuAction"
            },
            // Only two of those options require "Are you sure?" prompts.
            {
                type: "list",
                message: "Are you sure you would like to generate the webpage now?",
                choices: ["Yes, generate it now", "No, go back to the main menu"],
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
                    if (answers.finishYesNo === "Yes, generate it now") {
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
                choices: roles,
                name: "newMemberRole"
            },
            {
                type: "input",
                message: "Name:",
                name: "newMemberName"
            }
        ])
}


function editTeam(team) {
    console.log("editTeam() called!");
}


function generateWebpage(team) {
    console.log("generateWebpage() called!");
}