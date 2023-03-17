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



// A function to generate as many HTML cards as there are members of the team.
// This function is similar to one found in index.js
// I wanted to avoid triple-nesting the loop this time, and I also made use of the class methods.
function generateCards(team) {

    // we need to build a long string and then return it
    let cardsHTML = "";

    // step 1: break `team` object into an array of its values (teamName and lists of members) and iterate over it
    for (let memberList of Object.values(team)) {
        // step 2: the first value in `team` is teamName, which we don't want to iterate over. Skip it by testing if current iteration is a string.
        if (typeof memberList !== "string") {
            // step 3: Iterate over the member lists, whose elements are individual instances of the role classes (Manager, Engineer, or Intern)
            for (let member of Object.values(memberList)) {
                // Get the member data by calling their instance methods.
                // If any piece of data is needed more than once, I call the method then store it in a variable (for efficiency I guess)
                let email = member.getEmail();
                let role = member.getRole();
                let roleSpecificField = member.getRoleSpecificDataField(); // for Manager, "Office Number". Engineer, "GitHub Username". For Intern, "School".

                // Now that we have data for this member, we can generate an HTML card and add it to our big long cardsHTML string
                cardsHTML += `<article class="card ${role.toLowerCase()}">
            <div class="card-header">
                <h3>${member.getName()}</h3>
                <h4>${role}</h4>
            </div>
            <div class="card-body">
                <ul>
                    <li>ID: ${member.getID()}</li>
                    <li>Email Address: <a target="_blank" href="mailto:${email}">${email}</a></li>
                    <li>${roleSpecificField}: ${displayRoleSpecificData(member)}</li>
                </ul>
            </div>
        </article>
        `;
            }
        }
    }

    // Trimmed to eliminate awkward spacing introduced by the newline on line 56-57.
    return cardsHTML.trim();

}

// The only purpose of this function is to make a clickable link for an Engineer's GitHub profile.
// If the `member` is not an Engineer, it just returns the plain role-specific data without imbedding it into an <a> tag.
function displayRoleSpecificData(member) {
    if (member.getRole() === "Engineer") {
        return `<a target="_blank" href="https://github.com/${member.getRoleSpecificData()}">${member.getRoleSpecificData()}</a>`;
    } else {
        return member.getRoleSpecificData();
    }
}

module.exports = generateHTML;