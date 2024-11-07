import {google} from "googleapis"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'

// Define input variables
const inputCSVName = process.argv[2]
const inputCSVValue = process.argv[3]
const decodedValue = atob(inputCSVValue)

// Function to get the current timestamp
function formatTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[-:.]/g, "").slice(0, 14); // Format: YYYYMMDDHHMMSS
}

// Define other variables
const SCOPES = ["https://www.googleapis.com/auth/drive.file"]
const CREDENTIALS_PATH = "credentials.json"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path for the data folder and CSV file
const DATA_FOLDER_PATH = path.join(__dirname, "LOG");
const timestamp = formatTimestamp()
const CSV_FILE_PATH = path.join(DATA_FOLDER_PATH, `${inputCSVName}_${timestamp}.csv`); //!

// Create the data folder if it doesn't exist
if (!fs.existsSync(DATA_FOLDER_PATH)) {
    fs.mkdirSync(DATA_FOLDER_PATH);
}

// Create CSV file content
const csvContent = decodedValue; //!
fs.writeFileSync(CSV_FILE_PATH, csvContent); // Write CSV to the new path

// Load client secret from local file
const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES
})

const drive = google.drive({ version: "v3", auth})

// Create CSV File
async function createCSVFile() {
    const fileMetadata = {
        "name": `${inputCSVName}_${timestamp}.csv`, //!
        "mimeType": "application/vnd.google-apps.spreadsheet"
    }
    const media = {
        mimeType: "text/csv",
        body: fs.createReadStream(CSV_FILE_PATH) //Path to local CSV File
    }
    try {
        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id"
        })
        console.log("File id: ", file.data.id);
    } catch (err) {
        console.error(err)
    }
}

// Call the function to create CSV file
createCSVFile()