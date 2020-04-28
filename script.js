var stateData;
var covidData;

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th")
        let text = document.createTextNode(key)
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (let key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

async function main() {
    await fetch('https://api.covid19india.org/state_district_wise.json')
        .then(response => {
            return response.json();
        })
        .then(data => covidData = data)
        .catch(err => {
            console.log(`Error: ${err.message}`)
        })

    await fetch('http://ip-api.com/json/')
        .then((response) => {
            return response.json();
        })
        .then(data => stateData = data)
        .catch(err => {
            console.log(`Error: ${err.message}`)
        })

    console.log(covidData);
    console.log(stateData);

    let currentState = stateData.regionName;
    let showndata
    try {
        showndata = covidData[currentState]['districtData'];
    } catch (error) {
        document.getElementById("stat").innerHTML = `Oops! Your state was not found in the API used.`
    }
    let array1 = [];
    let names = [];
    for (var prop in showndata) {
        names.push(prop);
    }
    let index = 0;
    let total = 0;
    Object.values(showndata).forEach((entry) => {
        array1.push({
            name: names[index],
            active: entry.active,
            confirmed: entry.confirmed,
        })
        total += entry.active;
        index++;
    })
    console.log(array1);


    let table = document.querySelector("table");
    let data = ["District", "Active", "Confirmed"]
    generateTableHead(table, data);
    generateTable(table, array1);
    if (total >= 850) {
        document.getElementById("stat").innerHTML = `In this state, the amount of COVID-19 is 
        <var class=\"severe\">very high</var>. Please stay indoors. Total: ${total}`;
    } else if (total >= 450) {
        document.getElementById("stat").innerHTML = `In this state, the amount of COVID-19 is 
        <var class=\"medium\">less severe</var>. You still must exercise caution, but it is more lenient in
        this category. Total: ${total}`;
    } else if (total >= 125) {
        document.getElementById("stat").innerHTML = `In this state, the amount of COVID-19 is 
        <var class=\"fine\">ok</var>. You must still stay inside to prevent further spread. Total: ${total}`;
    } else {
        document.getElementById("stat").innerHTML = `This state has managed to get their COVID-19
        spread down. This is <var class=\"fine\">very good</var>. Self isolation will still help further. Total: ${total}`;
    }
}

main();