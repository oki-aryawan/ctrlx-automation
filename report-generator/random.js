let data = [];

// simple random
for (let i = 0; i < 10; i++) {
    let time = new Date(Date.now() - i * 60000).toLocaleTimeString();
    let temp = (Math.random() * 10 + 20).toFixed(2);
    let hum = (Math.random() * 20 + 60).toFixed(2);
    data.push([time, temp + ' °C', hum + ' %']);
}

// Format PDF content
msg.payload = {
    content: [
        { text: 'Temperature and Humidity Report', style: 'header'},
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
