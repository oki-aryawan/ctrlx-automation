let chartImageBase64 = msg.payload;  // Base64 string of the chart image

let content = [
    { text: 'Chart Report', style: 'header' },
    {
        image: 'data:image/png;base64,' + chartImageBase64,  // Embed the chart image
        width: 500,
        height: 250,
        margin: [0, 20, 0, 0]
    }
];

msg.payload = {
    content: content,
    styles: {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
        }
    }
};

return msg;
