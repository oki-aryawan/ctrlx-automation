[
    {
        "id": "57040be76619013c",
        "type": "tab",
        "label": "PLC to Report",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "4e26b5716ec6a7ea",
        "type": "ctrlx-datalayer-subscribe",
        "z": "57040be76619013c",
        "subscription": "bb84fa8d76d57446",
        "path": "plc/app/Application/sym/PLC_PRG/temp",
        "name": "Temp",
        "x": 150,
        "y": 140,
        "wires": [
            [
                "5f7aed4b3413653c",
                "e5d2df9ed68dd5d1"
            ]
        ]
    },
    {
        "id": "a576220c5232bcbc",
        "type": "ctrlx-datalayer-subscribe",
        "z": "57040be76619013c",
        "subscription": "bb84fa8d76d57446",
        "path": "plc/app/Application/sym/PLC_PRG/hum",
        "name": "Hum",
        "x": 150,
        "y": 220,
        "wires": [
            [
                "927ee9804f5d864d",
                "da04acd8e705c565"
            ]
        ]
    },
    {
        "id": "5f7aed4b3413653c",
        "type": "influxdb out",
        "z": "57040be76619013c",
        "influxdb": "866056b97a38d240",
        "name": "temp",
        "measurement": "temp",
        "precision": "",
        "retentionPolicy": "",
        "database": "database",
        "precisionV18FluxV20": "ms",
        "retentionPolicyV18Flux": "",
        "org": "boschrexroth",
        "bucket": "plc",
        "x": 330,
        "y": 140,
        "wires": []
    },
    {
        "id": "927ee9804f5d864d",
        "type": "influxdb out",
        "z": "57040be76619013c",
        "influxdb": "866056b97a38d240",
        "name": "hum",
        "measurement": "hum",
        "precision": "",
        "retentionPolicy": "",
        "database": "database",
        "precisionV18FluxV20": "ms",
        "retentionPolicyV18Flux": "",
        "org": "boschrexroth",
        "bucket": "plc",
        "x": 330,
        "y": 220,
        "wires": []
    },
    {
        "id": "c11d9a46e096b175",
        "type": "file",
        "z": "57040be76619013c",
        "name": "path",
        "filename": "solutions/activeConfiguration/node-RED/ReportResult/PLC_Report.pdf",
        "filenameType": "str",
        "appendNewline": true,
        "createDir": true,
        "overwriteFile": "true",
        "encoding": "none",
        "x": 730,
        "y": 440,
        "wires": [
            [
                "888d6b9c73a767c9"
            ]
        ]
    },
    {
        "id": "888d6b9c73a767c9",
        "type": "debug",
        "z": "57040be76619013c",
        "name": "debug kiew",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 890,
        "y": 380,
        "wires": []
    },
    {
        "id": "b96abc422f91de5e",
        "type": "pdfmake",
        "z": "57040be76619013c",
        "name": "",
        "outputType": "Buffer",
        "inputProperty": "payload",
        "options": "{}",
        "outputProperty": "payload",
        "x": 680,
        "y": 380,
        "wires": [
            [
                "c11d9a46e096b175"
            ]
        ]
    },
    {
        "id": "2d30ac6fa99a17fd",
        "type": "function",
        "z": "57040be76619013c",
        "name": "Format PDF with InfluxDB Data",
        "func": "let influxData = msg.payload;\nlet temperatureData = {};\nlet humidityData = {};\n\ninfluxData.forEach(entry => {\n    let time = new Date(entry._time).toLocaleTimeString();\n    if (entry._measurement === \"temp\") {\n        temperatureData[time] = entry._value;\n    } else if (entry._measurement === \"hum\") {\n        humidityData[time] = entry._value;\n    }\n});\n\nlet data = [];\n\nObject.keys(temperatureData).forEach(time => {\n    let tempC = temperatureData[time];\n    let humPercentage = humidityData[time] || ''; // Humidity might not be available for some times\n\n    data.push([{ text: time, alignment: 'center' },\n    { text: tempC.toFixed(2), alignment: 'center' },\n    { text: humPercentage ? humPercentage.toFixed(2) : '', alignment: 'center' }]);\n});\n\n// Format PDF content\nmsg.payload = {\n    content: [\n        { text: 'Environmental Report', style: 'header' },\n        {\n            table: {\n                body: [\n                    [{ text: 'Time', alignment: 'center' },\n                    { text: 'Temperature (C)', alignment: 'center' },\n                    { text: 'Humidity (%)', alignment: 'center' }],\n                    ...data\n                ]\n            }\n        }\n    ],\n    styles: {\n        header: {\n            fontSize: 18,\n            bold: true,\n            margin: [0, 0, 0, 10]\n        }\n    }\n};\n\nreturn msg;\n",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 470,
        "y": 440,
        "wires": [
            [
                "b96abc422f91de5e"
            ]
        ]
    },
    {
        "id": "9418dd4596828bd2",
        "type": "influxdb in",
        "z": "57040be76619013c",
        "influxdb": "866056b97a38d240",
        "name": "get_data_from_Influx",
        "query": "from(bucket: \"plc\")\n  |> range(start: -1h)\n  |> filter(fn: (r) => r[\"_measurement\"] == \"hum\" or r[\"_measurement\"] == \"temp\")\n  |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)\n  |> yield(name: \"mean\")\n",
        "rawOutput": false,
        "precision": "",
        "retentionPolicy": "",
        "org": "boschrexroth",
        "x": 440,
        "y": 380,
        "wires": [
            [
                "2d30ac6fa99a17fd"
            ]
        ]
    },
    {
        "id": "fdc8bead1cd90c2a",
        "type": "inject",
        "z": "57040be76619013c",
        "name": "Generate Report",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payloadType": "date",
        "x": 200,
        "y": 360,
        "wires": [
            [
                "9418dd4596828bd2"
            ]
        ]
    },
    {
        "id": "e5d2df9ed68dd5d1",
        "type": "function",
        "z": "57040be76619013c",
        "name": "function 5",
        "func": "msg.topic = \"Temperature\";\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 480,
        "y": 180,
        "wires": [
            [
                "ac14f10ac5ee06ae"
            ]
        ]
    },
    {
        "id": "ac14f10ac5ee06ae",
        "type": "ui_chart",
        "z": "57040be76619013c",
        "name": "chart",
        "group": "c1d1e3961cdd15e5",
        "order": 1,
        "width": 0,
        "height": 0,
        "label": "Data Monitoring",
        "chartType": "line",
        "legend": "true",
        "xformat": "HH:mm",
        "interpolate": "linear",
        "nodata": "",
        "dot": true,
        "ymin": "",
        "ymax": "",
        "removeOlder": "10",
        "removeOlderPoints": "50",
        "removeOlderUnit": "60",
        "cutout": 0,
        "useOneColor": false,
        "useUTC": false,
        "colors": [
            "#1f77b4",
            "#9bfd99",
            "#ff7f0e",
            "#2ca02c",
            "#98df8a",
            "#d62728",
            "#ff9896",
            "#9467bd",
            "#c5b0d5"
        ],
        "outputs": 1,
        "useDifferentColor": false,
        "className": "",
        "x": 710,
        "y": 180,
        "wires": [
            []
        ]
    },
    {
        "id": "da04acd8e705c565",
        "type": "function",
        "z": "57040be76619013c",
        "name": "function 6",
        "func": "msg.topic = \"Humidity\";\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 500,
        "y": 280,
        "wires": [
            [
                "ac14f10ac5ee06ae"
            ]
        ]
    },
    {
        "id": "b2b5903b6843f127",
        "type": "ui_button",
        "z": "57040be76619013c",
        "name": "",
        "group": "c1d1e3961cdd15e5",
        "order": 2,
        "width": 7,
        "height": 1,
        "passthru": false,
        "label": "Generate PDF Report",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "className": "",
        "icon": "",
        "payload": "",
        "payloadType": "str",
        "topic": "",
        "topicType": "str",
        "x": 180,
        "y": 400,
        "wires": [
            [
                "9418dd4596828bd2"
            ]
        ]
    },
    {
        "id": "fe296855dd9af80d",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 2,
        "width": 11,
        "height": 1
    },
    {
        "id": "3152c1fbe25839af",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 4,
        "width": 11,
        "height": 1
    },
    {
        "id": "52b3e2bd8f782de8",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 6,
        "width": 11,
        "height": 1
    },
    {
        "id": "58924f9b541ce18b",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 8,
        "width": 11,
        "height": 1
    },
    {
        "id": "f53b7bc8f72b233c",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 9,
        "width": 11,
        "height": 1
    },
    {
        "id": "3c5aef73320dce60",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 10,
        "width": 11,
        "height": 1
    },
    {
        "id": "506e6b7ded370c96",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 11,
        "width": 11,
        "height": 1
    },
    {
        "id": "18d2470e64a2d40c",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 12,
        "width": 11,
        "height": 1
    },
    {
        "id": "77d3c77f01770263",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 18,
        "width": 11,
        "height": 1
    },
    {
        "id": "48f6024e0a6ddc73",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 19,
        "width": 11,
        "height": 1
    },
    {
        "id": "1434e13378e1ce55",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 20,
        "width": 11,
        "height": 1
    },
    {
        "id": "127d46b44e08475e",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 21,
        "width": 11,
        "height": 1
    },
    {
        "id": "4c68f8561f9b723b",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 22,
        "width": 11,
        "height": 1
    },
    {
        "id": "f1ef5199138a2584",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 24,
        "width": 11,
        "height": 1
    },
    {
        "id": "bbae911adb282429",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 25,
        "width": 11,
        "height": 1
    },
    {
        "id": "291146afaa677852",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 26,
        "width": 11,
        "height": 1
    },
    {
        "id": "8a287f44519f93f2",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 27,
        "width": 11,
        "height": 1
    },
    {
        "id": "ca765542fb09bf50",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 28,
        "width": 11,
        "height": 1
    },
    {
        "id": "37f0484b1a3c389b",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 30,
        "width": 11,
        "height": 1
    },
    {
        "id": "76c88da41b78fecd",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 31,
        "width": 11,
        "height": 1
    },
    {
        "id": "1aaf8f3b17cdb3a2",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 32,
        "width": 11,
        "height": 1
    },
    {
        "id": "68d5da75b919dc08",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 33,
        "width": 11,
        "height": 1
    },
    {
        "id": "0ff893ecb2fdc6e2",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 34,
        "width": 11,
        "height": 1
    },
    {
        "id": "4912afb8fc4da81b",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 36,
        "width": 11,
        "height": 1
    },
    {
        "id": "fd73cbfb71ce7e35",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 37,
        "width": 11,
        "height": 1
    },
    {
        "id": "4b5751bc8709bf22",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 38,
        "width": 11,
        "height": 1
    },
    {
        "id": "607d57ec9e0bd873",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 39,
        "width": 11,
        "height": 1
    },
    {
        "id": "b577948fa23e8dea",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "86dc78c2e72cf050",
        "order": 40,
        "width": 11,
        "height": 1
    },
    {
        "id": "f0766fb65dd277e6",
        "type": "ui_spacer",
        "z": "57040be76619013c",
        "name": "spacer",
        "group": "c1d1e3961cdd15e5",
        "order": 3,
        "width": 10,
        "height": 1
    },
    {
        "id": "bb84fa8d76d57446",
        "type": "ctrlx-config-subscription",
        "device": "20e52a117557521a",
        "name": "system",
        "publishIntervalMs": ""
    },
    {
        "id": "866056b97a38d240",
        "type": "influxdb",
        "hostname": "127.0.0.1",
        "port": "8086",
        "protocol": "http",
        "database": "database",
        "name": "influx",
        "usetls": false,
        "tls": "",
        "influxdbVersion": "2.0",
        "url": "http://localhost:8086",
        "timeout": "10",
        "rejectUnauthorized": true
    },
    {
        "id": "c1d1e3961cdd15e5",
        "type": "ui_group",
        "name": "PLC Example",
        "tab": "0fed98870d4791a8",
        "order": 1,
        "disp": true,
        "width": 17,
        "collapse": false,
        "className": ""
    },
    {
        "id": "86dc78c2e72cf050",
        "type": "ui_group",
        "name": "Memory",
        "tab": "d7d6b4190c2cd015",
        "order": 1,
        "disp": true,
        "width": 19,
        "collapse": false,
        "className": ""
    },
    {
        "id": "20e52a117557521a",
        "type": "ctrlx-config",
        "name": "Boschrexroth123",
        "hostname": "localhost",
        "debug": false
    },
    {
        "id": "0fed98870d4791a8",
        "type": "ui_tab",
        "name": "Monitoring",
        "icon": "dashboard",
        "order": 1,
        "disabled": false,
        "hidden": false
    },
    {
        "id": "d7d6b4190c2cd015",
        "type": "ui_tab",
        "name": "System Monitoring",
        "icon": "dashboard",
        "order": 4,
        "disabled": false,
        "hidden": false
    }
]
