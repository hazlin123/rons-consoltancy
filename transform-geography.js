const fs = require('fs');
const path = require('path');

const rawDataPath = path.join(__dirname, 'packages', 'utils', 'src', 'data', 'kenya-geography-full.json');
const outputPath = path.join(__dirname, 'packages', 'utils', 'src', 'data', 'kenya-geography.json');

const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

const transformed = {
    counties: []
};

let countyId = 1;
let constituencyIdBase = 100;
let wardIdBase = 1000;

function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

for (const [countyName, countyData] of Object.entries(rawData)) {
    const county = {
        id: countyId++,
        name: toTitleCase(countyName),
        constituencies: []
    };

    let constituencyIndex = 1;
    for (const [constName, constData] of Object.entries(countyData.Constituencies)) {
        const constituency = {
            id: (county.id * 100) + constituencyIndex++,
            name: toTitleCase(constName),
            wards: []
        };

        let wardIndex = 1;
        const wards = Array.isArray(constData.Ward) ? constData.Ward : [];
        for (const wardName of wards) {
            constituency.wards.push({
                id: (constituency.id * 100) + wardIndex++,
                name: toTitleCase(wardName)
            });
        }

        county.constituencies.push(constituency);
    }

    transformed.counties.push(county);
}

fs.writeFileSync(outputPath, JSON.stringify(transformed, null, 4));
console.log('Transformation complete!');
console.log(`Processed ${transformed.counties.length} counties.`);
