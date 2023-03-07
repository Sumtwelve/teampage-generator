const inquirer = require("inquirer");
const fs = require("fs");

const employee = require("./lib/Employee");
const manager = require("./lib/Manager");

// Create a `team` object in the global scope.
// This will allow us to save inquirer's `answers` data externally
// and then reuse the inquirer with new prompts without having to worry about losing any data.
// FIELDS:
// dataNeeded (array): When adding a member of this role, the program will ask for the info in this field.
// list (array): A list of all team members (each stored as objects) with this role.
let team = {
    teamName: "",
    manager: {
        dataNeeded: "Office Number",
        list: []
    },
    engineer: {
        dataNeeded: "GitHub Username",
        list: []
    },
    intern: {
        dataNeeded: "School",
        list: []
    }
};

// ------ TEAM MEMBER DATA FORMAT EXAMPLE ------ //
// list: [
//     {
//         role: "Manager",
//         name: "Lisa Schoener",
//         employeeID: "4423",
//         email: "lschoener@gmail.com",
//         officeNumber: "28"
//     }
// ]


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
            role: "Manager",
            name: answers.mgrName,
            employeeID: answers.mgrID,
            email: answers.mgrEmail,
            officeNumber: answers.mgrOfficeNum
        };

        // Push new manager object to the `manager.list` array of the `team` object.
        team.manager.list.push(mgr);
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
            // I'd rather just use the selected role (answers.newMemberRole) to find and display the `dataNeeded` field,
            // which I created exactly for this purpose.
            {
                type: "input",
                message: (answers) => `${team[answers.newMemberRole.toLowerCase()].dataNeeded}:`,
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

            let uniqueMemberInfo = team[answers.newMemberRole.toLowerCase()].dataNeeded;

            let newMember = {
                role: answers.newMemberRole,
                name: answers.newMemberName,
                employeeID: answers.newMemberID,
                email: answers.newMemberEmail
            };

            // I was trying to avoid writing a switch statement... but here I think it's okay.
            // The newMember object needs to have a certain element at the end, and the name of that element
            // will depend on the role of the new member.
            // The following is the only way I can think of to do that dynamically.
            switch (uniqueMemberInfo) {
                case "Office Number":
                    newMember["officeNumber"] = answers.newMemberRoleSpecificInfo;
                    break;
                
                case "GitHub Username":
                    newMember["githubUsername"] = answers.newMemberRoleSpecificInfo;
                    break;

                case "School":
                    newMember["school"] = answers.newMemberRoleSpecificInfo;
                    break;

                default:
                    console.error(`addMemberToTeam() :: Error when adding new member: Unexpected value "${uniqueMemberInfo}" for uniqueMemberInfo in switch statement.\nReturning to main menu.`);
                    mainMenu();
                    break;
            }

            // PUSH TO TEAM OBJECT!!
            team[answers.newMemberRole.toLowerCase()].list.push(newMember);

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

// TODO: Implement this feature later.
// function editTeam(team) {
//     console.log("Here is your team so far:")
// }


function generateWebpage(team) {

    let mgrPlural = "";
    if (team.manager.list.length > 1)
        mgrPlural = "S";

    let engPlural = "";
    if (team.engineer.list.length > 1)
        engPlural = "S";

    let internPlural = "";
    if (team.intern.list.length > 1)
        internPlural = "S";


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
                // TODO: Run the two fs.writeFile functions which each call to the scripts in the utils/ folder
            }
        })
}


// A function to print to the console a neatly formatted overview of the user's team
function printTeam(team) {

    // Print the team name in all caps OUTSIDE of the for loop
    console.log(team.teamName.toUpperCase());

    let teamObjLength = Object.keys(team);

    for (let i = 1; i < teamObjLength; i++) {
        for (let j = 0; j < team[Object.keys(team)[i]].list.length; j++) {
            
        }
    }
}