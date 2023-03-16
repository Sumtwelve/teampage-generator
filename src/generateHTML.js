function generateHTML(team) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="./style.css">
    <title>${team.teamName}</title>
</head>
<body>
    <h1>${team.teamName}</h1>
    <section class="cards-section">
        ${generateCards(team)}
    </section>
</body>
</html>`;

}



// This function is similar to one found in index.js
// I wanted to avoid triple-nesting the loop this time, and I also made use of the class methods.
function generateCards(team) {

    // we need to build a long string
    let cardsHTML = "";

    // step 1: break `team` object into an array of its values and iterate over it
    for (let memberList of Object.values(team)) {
        // step 2: the first value in `team` is teamName, which we don't want to iterate over. Skip it by testing if it's a string.
        if (typeof memberList !== "string") {
            // step 3: Iterate over each element of the member lists, which are instances of the role classes (Manager, Engineer, or Intern)
            for (let member of Object.values(memberList)) {
                // getPrintableInfo() returns an array of the member data
                let memberDataArr = member.getPrintableInfo();
                let name = member.getName();
                let id = member.getID();
                let email = member.getEmail();
                let roleSpecificField = member.getRoleSpecificDataField(); // for Manager, office number. Engineer, GitHub username. For Intern, school.
                let roleSpecificData = member.getRoleSpecificData();
                let role = member.getRole();

                // Now that we have our data, we can return a finished HTML card.
                // Note: getRoleSpecificDataField() returns the NAME of the role specific data. Manager -> "Office Number". Engineer -> "GitHub Username", Intern -> "School"
                cardsHTML += `<article class="card ${role.toLowerCase()}">
            <div class="card-header">
                <h3>${name}</h3>
                <h4>${role}</h4>
            </div>
            <div class="card-body">
                <ul>
                    <li>ID: ${id}</li>
                    <li>Email Address: <a target="_blank" href="mailto:${email}">${email}</a></li>
                    <li>${roleSpecificField}: ${displayRoleSpecificData(member)}</li>
                </ul>
            </div>
        </article>
        `;
            }
        }
    }

    return cardsHTML.trim();

}

// The only purpose of this function is to make a clickable link for an Engineer's GitHub profile
function displayRoleSpecificData(member) {
    if (member.getRole() === "Engineer") {
        return `<a target="_blank" href="https://github.com/${member.getRoleSpecificData()}">${member.getRoleSpecificData()}</a>`;
    } else {
        return member.getRoleSpecificData();
    }
}

module.exports = generateHTML;