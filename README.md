# Google Drive CSV Uploader with Progress OpenEdge Integration

This project demonstrates the integration of **Progress OpenEdge** and **Node.js** to securely generate, encode, and upload CSV files to **Google Drive** using the Google Drive API.

## Features

- **CSV File Generation**: The CSV content is generated in Progress OpenEdge and formatted based on user-provided data.
- **Base64 Encryption**: The generated CSV data is encrypted into base64 format within Progress OpenEdge to ensure security during transmission.
- **Node.js Script Execution**: A Node.js script is called via an OS command from OpenEdge, which decodes the base64 string back to CSV format.
- **Google Drive Upload**: The Node.js script uploads the decoded CSV file to Google Drive using the Google Drive API.
- **OAuth2 Authentication**: Supports OAuth2 for Google Drive access, handling authentication, token generation, and token storage for future use.
- **Timestamped File Creation**: The uploaded CSV file is saved locally with a timestamp to prevent overwriting and ensure traceability.
- **Automatic Folder Creation**: The Node.js script automatically creates a folder if one doesn’t exist, ensuring that CSV files are organized by timestamp.

## How It Works

1. **Progress OpenEdge**: 
   - Generates CSV content based on user input.
   - Encrypts the CSV content to base64.
   - Passes the base64 data to a Node.js script via OS command.

2. **Node.js**:
   - Decodes the base64 string back into CSV content.
   - Saves the decoded CSV file locally with a unique timestamp.
   - Uploads the CSV file to Google Drive using OAuth2 authentication.

3. **Google Drive API**:
   - The script uploads the CSV file to a designated Google Drive folder.
   - OAuth2 is used to authenticate the script, allowing secure file upload.