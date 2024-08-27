let influxData = msg.payload;
let memoryAvailable = {};
let memoryCache = {};
let memoryUsed = {};

influxData.forEach(entry => {
    let time = new Date(entry._time).toLocaleTimeString();
    if (entry._measurement === "Memory Available") {
        memoryAvailable[time] = entry._value;
    } else if (entry._measurement === "Memory Chace") {
        memoryCache[time] = entry._value;
    } else if (entry._measurement === "Memory Used") {
        memoryUsed[time] = entry._value;}
});

let data = [];

Object.keys(memoryUsed).forEach(time => {
    let usedMB = memoryUsed[time];
    let cacheMB = memoryCache[time] || '';
    let availableMB = memoryAvailable[time];
    let usedPercentage = (usedMB / (usedMB + availableMB)) * 100;

    data.push([{ text: time, alignment: 'center' },
    { text: usedPercentage.toFixed(2), alignment: 'center' },
    { text: usedMB.toFixed(2), alignment: 'center' },
    { text: cacheMB.toFixed(2), alignment: 'center' }]);
});

// Format PDF content
msg.payload = {
    content: [
        { text: 'Memory Report', style: 'header' },
        {
            table: {
                body: [
                    [{ text: 'Time', alignment: 'center' },
                    { text: 'Memory Used (MB)', alignment: 'center' },
                    { text: 'Memory Used (%)', alignment: 'center' },
                    { text: 'Memory Cache (MB)', alignment: 'center' }],
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
