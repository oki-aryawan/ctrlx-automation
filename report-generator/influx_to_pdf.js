let influxData = msg.payload;
let temperatureData = {};
let humidityData = {};

influxData.forEach(entry => {
    let time = new Date(entry._time).toLocaleTimeString();
    if (entry._measurement === "temp") {
        temperatureData[time] = entry._value;
    } else if (entry._measurement === "hum") {
        humidityData[time] = entry._value;
    }
});

let data = [];

Object.keys(temperatureData).forEach(time => {
    let tempC = temperatureData[time];
    let humPercentage = humidityData[time] || ''; // Humidity might not be available for some times

    data.push([{ text: time, alignment: 'center' },
    { text: tempC.toFixed(2), alignment: 'center' },
    { text: humPercentage ? humPercentage.toFixed(2) : '', alignment: 'center' }]);
});

// Format PDF content
msg.payload = {
    content: [
        { text: 'Environmental Report', style: 'header' },
        {
            table: {
                body: [
                    [{ text: 'Time', alignment: 'center' },
                    { text: 'Temperature (C)', alignment: 'center' },
                    { text: 'Humidity (%)', alignment: 'center' }],
                    ...data
                ]
            }
        }
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
        }
    }
};

return msg;
