var map = L.map('map').setView([13.736717, 100.523186], 7); // set the initial view to the center of Thailand

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

function getRiskLevelAndWarning(pm25Aqi) {
    if (pm25Aqi <= 50) {
        return {
            riskLevel: 'Good',
            implications: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
            caution: 'None',
        };
    } else if (pm25Aqi <= 100) {
        return {
            riskLevel: 'Moderate',
            implications: 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.',
            caution: 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.',
        };
    } else if (pm25Aqi <= 150) {
        return {
            riskLevel: 'Unhealthy for Sensitive Groups',
            implications: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
            caution: 'Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.',
        };
    } else {
        return {
            riskLevel: 'Unhealthy',
            implications: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects',
            caution: 'Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion.',
        };
    }
}

fetch('http://49.231.43.88:3001/http://air4thai.pcd.go.th/services/getNewAQI_JSON.php')
.then(response => response.json())
.then(data => {
    console.log(data);
    for (let station of data.stations) {
        var pm25Aqi = station.AQILast.PM25.aqi;
        var color = pm25Aqi < 50 ? 'green' : (pm25Aqi < 100 ? 'yellow' : (pm25Aqi < 150 ? 'orange' : 'red'));
        var radius = Math.max(6, pm25Aqi / 10); // adjust this to control the size of the circles

        var circle = L.circleMarker([station.lat, station.long], {
            color: color,
            radius: radius,
            fillOpacity: 0.5,
        }).addTo(map);

        var {riskLevel, implications, caution} = getRiskLevelAndWarning(pm25Aqi);

        var popupContent = `<b>Station:</b> ${station.nameTH} (${station.nameEN})<br/>
                            <b>Area:</b> ${station.areaTH} (${station.areaEN})<br/>
                            <b>PM 2.5:</b> ${pm25Aqi} AQI (${station.AQILast.PM25.value})<br/>
                            <b>Risk Level:</b> ${riskLevel}<br/>
                            <b>Health Implications:</b> ${implications}<br/>
                            <b>Cautionary Statement:</b> ${caution}`;
        circle.bindPopup(popupContent);
    }
})
.catch(error => {
    console.log('error:', error);
});