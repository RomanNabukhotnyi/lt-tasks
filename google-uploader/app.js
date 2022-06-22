import inquirer from 'inquirer';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import axios from 'axios'
import 'dotenv/config';

const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
});

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
})

const service = google.drive({ version: 'v3', auth: oauth2Client });

const uploadFile = async (name, path) => {
    try {
        const file = await service.files.create({
            requestBody: {
                name,
                parents: [process.env.FOLDER_ID]
            },
            media: {
                body: fs.createReadStream(path),
            },
            fields: "id",
        });
        console.log('Successfully uploaded!')
        return file.data.id;
    } catch (error) {
        console.log(error);
    }
}

const generateLink = async (fileId) => {
    try {
        await service.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        const result = await service.files.get({
            fileId,
            fields: 'webViewLink'
        })
        return result.data.webViewLink;
    } catch (error) {
        console.log(error);
    }
}

inquirer.prompt([
    {
        name: "p",
        message: "Drag and drop your image to terminal and press Enter for upload: ",
        type: "input",
    },
]).then(({ p }) => {
    let fileName = path.basename(p);
    const fileExtension = path.extname(p);
    console.log(`Path to file: ${p}`);
    console.log(`File name: ${fileName}`);
    console.log(`File extension: ${fileExtension}`);
    inquirer.prompt([
        {
            name: "changeName",
            message: `Your're uploading the file with the name: ${fileName}.\nWould you like to change it? `,
            type: "confirm",
        },
        {
            name: "newName",
            message: "Enter new file name (WITHOUT extension aka .jpg, .png, etc.): ",
            type: "input",
            when: ({ changeName }) => changeName
        }
    ]).then(async (answers) => {
        if (answers.changeName) {
            fileName = answers.newName + fileExtension;
            console.log(`New file name: ${fileName}`);
        }
        const fileId = await uploadFile(fileName, p);
        inquirer.prompt([
            {
                name: "shortenLink",
                message: `Would you like to shorten you link? `,
                type: "confirm",
            }
        ]).then(async ({ shortenLink }) => {
            const link = await generateLink(fileId);
            if (shortenLink) {
                const data = {
                    "urls": [
                        {
                            "long_url": link,
                        }
                    ]
                };
                try {
                    const auth = Buffer.from(`${process.env.API_USERNAME}:${process.env.API_KEY}`).toString('base64');
                    const response = await axios.post('https://tiny.cc/tiny/api/3/urls', data, {
                        headers: {
                            "Authorization": `Basic ${auth}`,
                        }
                    });
                    console.log(`Your short link is: ${response.data.urls[0].short_url_with_protocol}`);
                } catch (error) {
                    console.log(error)
                }
            } else {
                console.log(`Your link is: ${link}`);
            }

        });
    });
});