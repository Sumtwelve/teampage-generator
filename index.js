const inquirer = require("inquirer");

console.log("Welcome to Sumtwelve's Team Page Generator!");
console.log("\nA series of prompts will guide you through creating a webpage\nto store useful info and links about your team members.");

inquirer
    .prompt(
        {
            type: "input",
            message: "What should we call your team?",
            name: "teamName"
        }
    )
    .then((answers) => {
        // TODO: handle the responses
    })
    .catch((error) => {
        console.error(error);
    });