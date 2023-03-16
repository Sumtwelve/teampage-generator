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
        <article class="card manager">
            <div class="card-header">
                <h3>Stacy Rodriguez</h3>
                <h4>Manager</h4>
            </div>
            <div class="card-body">
                <ul>
                    <li>ID: 329328</li>
                    <li>Email Address: <a target="_blank" href="mailto:srodriguez@gmail.com">srodriguez@gmail.com</a></li>
                    <li>Office Number: 45</li>
                </ul>
            </div>
        </article>
        <article class="card engineer">
            <div class="card-header">
                <h3>Percy Ibanez</h3>
                <h4>Engineer</h4>
            </div>
            <div class="card-body">
                <ul>
                    <li>ID: 766584</li>
                    <li>Email Address: <a target="_blank" href="mailto:pibanez@gmail.com">pibanez@gmail.com</a></li>
                    <li>GitHub Username: <a target="_blank" href="https://github.com/Pulsar">Pulsar</a></li>
                </ul>
            </div>
        </article>
        <article class="card intern">
            <div class="card-header">
                <h3>Hailey Alberts</h3>
                <h4>Intern</h4>
            </div>
            <div class="card-body">
                <ul>
                    <li>ID: 954433</li>
                    <li>Email Address: <a target="_blank" href="mailto:halberts@gmail.com">halberts@gmail.com</a></li>
                    <li>School: The University of Utah</li>
                </ul>
            </div>
        </article>
    </section>
</body>
</html>`;

}


function generateCards(team) {
    
}

module.exports = generateHTML;