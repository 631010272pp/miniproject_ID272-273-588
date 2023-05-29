const fetch = require('node-fetch');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter; // install csv-writer with npm
const csvtojson = require('csvtojson'); // install csvtojson with npm

fetch('http://49.231.43.88:3001/http://air4thai.pcd.go.th/services/getNewAQI_JSON.php')
    .then(response => response.json())
    .then(data => {
        // Write to CSV
        const writer = csvWriter({
            path: 'output.csv',
            header: ['lat', 'long', 'nameTH', 'nameEN', 'areaTH', 'areaEN', 'PM25', 'RiskLevel', 'Implications', 'Caution'].map(id => ({id, title: id})),
        });

        const records = data.stations.map(station => ({
            lat: station.lat,
            long: station.long,
            nameTH: station.nameTH,
            nameEN: station.nameEN,
            areaTH: station.areaTH,
            areaEN: station.areaEN,
            PM25: station.AQILast.PM25.aqi,
            // Assuming getRiskLevelAndWarning is defined somewhere and returns the correct structure
            ...getRiskLevelAndWarning(station.AQILast.PM25.aqi),
        }));

        writer.writeRecords(records)
            .then(() => {
                console.log('Data written successfully to CSV.');
                // Read from CSV and convert to JSON
                csvtojson()
                    .fromFile('output.csv')
                    .then(jsonObj => {
                        console.log(jsonObj);
                        // use jsonObj for further processing...
                    });
            })
            .catch(error => {
                console.log('Error writing to CSV:', error);
            });
    })
    .catch(error => {
        console.log('Error fetching data:', error);
    });
