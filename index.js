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
        team.teamName = toNameCase(answers.teamName);

        // Create a new manager object to insert into the team object.
        // This method allows us to call the inquirer multiple times
        // without having to worry about losing any answers data.
        let mgr = new Manager(
            toNameCase(answers.mgrName), 
            answers.mgrID,
            answers.mgrEmail.toLowerCase(),
            answers.mgrOfficeNum
        );

        // Push new manager object to the `manager.list` array of the `team` object.
        team.managers.push(mgr);
        //console.log("DEBUG: Successfully pushed first manager to managers list!");
        console.log("\nTeam name and first manager added successfully.")

        mainMenu();
    })
    .catch((error) => {
        console.error(error);
    });


// Function to display the Main Menu
// Calling inquirer inside a function like this allows recursion,
// which in turn allows teams of infinite size to be made.
function mainMenu() {
    console.log("\n=====================\n----  MAIN MENU  ----\n=====================\n");
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
                choices: ["Yes, add another", "No, go back to main menu"],
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
                        toNameCase(answers.newMemberName),
                        answers.newMemberID,
                        answers.newMemberEmail.toLowerCase(),
                        toNameCase(answers.newMemberRoleSpecificInfo)
                    );
                    break;

                case "Engineer":
                    newMember = new Engineer(
                        toNameCase(answers.newMemberName),
                        answers.newMemberID,
                        answers.newMemberEmail.toLowerCase(),
                        toNameCase(answers.newMemberRoleSpecificInfo)
                    );
                    break;

                case "Intern":
                    newMember = new Intern(
                        toNameCase(answers.newMemberName),
                        answers.newMemberID,
                        answers.newMemberEmail.toLowerCase(),
                        toNameCase(answers.newMemberRoleSpecificInfo)
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

                // Make dist/ folder if it somehow doesn't exist (maybe it got deleted)
                if (!fs.existsSync("./dist/")) {
                    fs.mkdirSync("./dist/");
                }

                // Generated files will be in `dist/[teamName]/`. We can't have duplicate folder names or else files will get overwritten.
                // To solve this, I count the number of files in dist/ and filter it down to the ones that start with the team name.
                // if you're reading this send me an email that says "i am your biggest fan i read the entire source code ♥ A+"
                let folderName = team.teamName; // by default folder name will just be team name
                let distFiles = fs.readdirSync(`./dist/`, (err) => {if (err) console.error(err)});
                let numDupeFolders = 0;
                for (fileName of distFiles) {
                    if (fileName.startsWith(team.teamName)) {
                        numDupeFolders++;
                        folderName = `${team.teamName}_${numDupeFolders + 1}`;
                    }
                }

                // If the above code works, we won't ever need to check if this directory already exists. We can just create it right now!!!!
                fs.mkdirSync(`./dist/${folderName}/`);
                
                // NOW WE'RE READY TO WRITE THE HTML AND CSS FILES!!
                // first is the HTML!
                fs.writeFile(
                    `./dist/${folderName}/index.html`,
                    generateHTML(team),
                    ((err) => err ? console.error(err) : console.log(`File ./dist/${folderName}/index.html successfully written!`))
                );

                // next is the CSS!
                fs.writeFile(
                    `./dist/${folderName}/style.css`,
                    generateCSS(),
                    ((err) => err ? console.error(err) : console.log(`File ./dist/${folderName}/style.css successfully written!`))
                );

            } else {
                mainMenu();
            }
        });
}


// A function to print to the console a neatly formatted overview of the user's team.
// This function will be called when the user is ready to 
function printTeam(team) {

    // Print the team name in all caps OUTSIDE of the for loop
    console.log(team.teamName);

    // My first ever triple-nested for loop. A little ugly. This only happened because of the way the `team` object is structured,
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


// Function to get the name of the data field specific to a role.
// I hate that I had to write this.
function getRoleSpecificDataField(role) {
    switch (role) {
        case "Manager":
            return "Office Number";
        
        case "Engineer":
            return "GitHub Username";

        case "Intern":
            return "School";

        default:
            console.error("ERROR: Bad value detected for `role` variable inside index.js/getRoleSpecificDataField().\nIf prompted for input, enter the appropriate data for this member's role:\nManager: Office number\nEngineer: GitHub Username\nIntern: School Name.\nI apologize for this error.");
    }
}


// Function to capitalize all first letters of words in a sentence.
function toNameCase(str) {
    return str.trim()
    .split(" ")
    .map(word => word[0].toUpperCase() + word.substring(1))
    .join(" ");
}



// This message displays anytime the CLI terminates. Probably only when user selects "Exit without saving" from the main menu.
console.log("\nThanks for using the Teampage Generator. Goodbye!");