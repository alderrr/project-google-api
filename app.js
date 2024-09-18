const {google} = require("googleapis")
const fs = require("fs")
const path = require("path")
const readline = require("readline")

const SCOPES = ["https://www.googleapis.com/auth/drive.file"]
const TOKEN_PATH = "token.json"

// Load client secret from local file
fs.readFile("credentials.json",(err, content) => {
    if (err) {
        return console.error("Error loading client secret file", err)
    }
    authorize(JSON.parse(content), createCSVFile)
})

// Authorize a client with credentials
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
    // Check if a token is already saved
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
            return getAccessToken(oAuth2Client, callback)
        }
        oAuth2Client.setCredentials(JSON.parse(token))
        callback(oAuth2Client)
    })
}

// Get Access Token
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
    })
    
    console.log("Authorize this app by visiting this url:", authUrl)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.question("Enter the code from that page here:", (code) => {
        rl.close()
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                return console.error("Error retrieving access token", err)
            }
            oAuth2Client.setCredentials(token)
            // Store the token to disc for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) {
                    console.log(err)
                }
                console.log("Token stored to: ", TOKEN_PATH)
            })
            callback(oAuth2Client)
        })
    })
}

// Create CSV File
function createCSVFile(auth) {
    const drive = google.drive({ version: "v3", auth})
    const fileMetadata = {
        "name": "example.csv",
        "mimeType": "application/vnd.google-apps.spreadsheet"
    }
    const media = {
        mimeType: "text/csv",
        body: fs.createReadStream(path.join(__dirname, "example.csv")) //Path to local CSV File
    }
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id"
    }, (err, file) => {
        if (err) {
            console.error(err)
        } else {
            console.log("File id: ", file.data.id)
        }
    })
}

const csvContent = "name,email\nJohn Doe,john@example.com\nJane Doe,jane@example.com"

fs.writeFileSync("example.csv", csvContent)