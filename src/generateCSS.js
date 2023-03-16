// This CSS is hard-coded. I only put it here so that I could keep this massive block of text tucked away and out of sight.
function generateCSS() {
    return `:root {
    --manager: #ce4384;
    --engineer: #2a995c;
    --intern: #3369ff;
}

html, body {
    margin: 0;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
    color: white;
    background-color: rgb(77, 130, 179);
    text-align: center;
    padding: 40px;
    margin: 0;
    font-size: 50px;
    font-weight: bold;
}

h3 {
    margin: 0;
    margin-bottom: 5px;
    font-size: 25px;
}

h4 {
    margin: 0;
    font-size: 20px;
}

.cards-section {
    display: flex;
    flex-flow: row wrap;
    gap: 50px;
    margin: 30px;
}

.card {
    box-shadow: 5px 5px 5px rgb(126, 126, 126);
}


.manager {
    background-color: var(--manager);
}

.manager h3 {
    text-decoration: underline;
}

.engineer {
    background-color: var(--engineer);
}

.intern {
    background-color: var(--intern);
}

.card-header {
    color: white;
    padding: 15px;
}

.card-body {
    background-color: #e9e9e9;
    padding: 15px;
}

ul {
    background-color: white;
    list-style-type: none;
    padding: 0;
    margin: 0;
}

li {
    padding: 15px 20px;
    border: 1px solid rgb(184, 184, 184);
}`;
}

module.exports = generateCSS;