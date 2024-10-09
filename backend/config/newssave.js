const fs = require("fs");
const path = require("path");
const axios = require("axios");
const THREE_HOURS_IN_MS = 3 * 60 * 60 * 1000;
const filePath = path.join(__dirname, 'data.json');

const getnewsfromyahoo = async () => {
    const url = 'https://yahoo-finance15.p.rapidapi.com/api/v2/markets/news?tickers=AAPL&type=ALL';
    const options = {
        method: 'GET',
        url: url,
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.request(options);
        const updatedData = {
            timestamp: Date.now(),
            data: response.data.body, // Adjusted based on actual response structure
        };
        await saveDataToFile(updatedData);
        return updatedData; // Return the data fetched
    } catch (error) {
        console.error(error);
        return null; // Return null or handle error as needed
    }
}

async function saveDataToFile(data) {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error saving data to file:', err);
        } else {
            console.log('Data successfully saved to file');
        }
    });
}

async function checkAndUpdateData() {
    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Read the existing data
        const fileData = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(fileData);

        // Get the timestamp of the last update
        const lastUpdateTime = jsonData.timestamp;

        // Calculate the time difference
        const timeDifference = Date.now() - lastUpdateTime;

        // Check if the time difference is greater than 3 hours
        if (timeDifference > THREE_HOURS_IN_MS) {
            console.log('More than 3 hours since last update. Fetching new data...');
            return await getnewsfromyahoo();
        } else {
            console.log('Data was updated less than 3 hours ago. No need to fetch new data.');
            return jsonData.data;
        }
    } else {
        // If the file doesn't exist, fetch data for the first time
        console.log('File does not exist. Fetching data for the first time...');
        return await getnewsfromyahoo();
    }
}

module.exports = { checkAndUpdateData };