// Retrieve data from InfluxDB
let influxData = msg.payload; // Assuming influxData is an array of results

// Initialize objects to store memory-related data
let memoryAvailable = {};
let memoryCache = {};
let memoryUsed = {};

// Separate the data based on measurement type
influxData.forEach(entry => {
    let time = new Date(entry._time).toLocaleTimeString(); // Convert timestamp to readable time

    // Store the value in the appropriate object
    if (entry._measurement === "Memory Available") {
        memoryAvailable[time] = entry._value;
    } else if (entry._measurement === "Memory Cache") {
        memoryCache[time] = entry._value;
    } else if (entry._measurement === "Memory Used") {
        memoryUsed[time] = entry._value;
    }
});

// Combine the data into a single table and calculate the memory used percentage
let data = [];

// Iterate over memoryUsed to build table rows
Object.keys(memoryUsed).forEach(time => {
    let usedMB = memoryUsed[time]; // Memory used in MB
    let cacheMB = memoryCache[time] || ''; // Memory cache in MB, empty if not available
    let availableMB = memoryAvailable[time]; // Memory available in MB

    // Calculate the percentage of memory used
    let usedPercentage = (usedMB / (usedMB + availableMB)) * 100;

    // Add a new row to the table
    data.push([
        { text: time, style: 'tableCell' },                            // Time
        { text: usedPercentage.toFixed(2) + '%', style: 'tableCell' }, // Memory used percentage
        { text: usedMB.toFixed(2), style: 'tableCell' },               // Memory used in MB
        { text: cacheMB ? cacheMB.toFixed(2) : '-', style: 'tableCell' } // Memory cache in MB
    ]);
});

// Add table headers to the beginning of the table
data.unshift([
    { text: 'Time', style: 'tableHeader' },               // Header for Time
    { text: 'Memory Used (%)', style: 'tableHeader' },    // Header for Memory Used Percentage
    { text: 'Memory Used (MB)', style: 'tableHeader' },   // Header for Memory Used in MB
    { text: 'Memory Cache (MB)', style: 'tableHeader' }   // Header for Memory Cache in MB
]);

// Define the PDF content and styles
msg.payload = {
    content: [
        // Title of the PDF
        { text: 'Memory Report', style: 'header' },

        // Table with data
        {
            table: {
                headerRows: 1, // Indicates the first row is a header
                widths: ['auto', 'auto', 'auto', 'auto'], // Set column widths to adjust dynamically
                body: data // The table content
            },
            // Define row layout
            layout: {
                fillColor: function (rowIndex) {
                    // Apply alternating row background colors
                    return rowIndex % 2 === 0 ? '#f3f3f3' : null; // Light gray for even rows
                }
            }
        }
    ],
    // Define styles for different elements in the PDF
    styles: {
        header: {
            fontSize: 18,           // Font size for the header title
            bold: true,             // Bold text
            margin: [0, 0, 0, 10],  // Spacing below the header
            alignment: 'center',    // Center-align the title
            color: '#1a73e8'        // Blue text color
        },
        tableHeader: {
            fontSize: 14,           // Font size for table headers
            bold: true,             // Bold header text
            fillColor: '#d3d3d3',   // Light gray background for header
            color: '#000000',       // Black text color
            margin: [5, 5, 5, 5],   // Padding around the text
            alignment: 'center'     // Center-align header text
        },
        tableCell: {
            fontSize: 12,           // Font size for table cells
            color: '#333333',       // Dark gray text color
            margin: [5, 5, 5, 5],   // Padding around the text
            alignment: 'center'     // Center-align cell text
        }
    }
};

// Return the formatted message for further processing in Node-RED
return msg;
