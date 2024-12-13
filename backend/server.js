const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
const port = 3000;

AWS.config.update({
    region: 'us-west-1',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

app.use(cors());
app.use(express.json());

app.get('/getDB/:userID', async (req, res) => {
    const userID = req.params.userID;
    const urlParams = new URLSearchParams();
    urlParams.append('UserID', userID);

    const params = {
        TableName: 'dummy', 
        Key: {
            'UserID': urlParams.get('UserID'),
        },
    };

    try {
        const data = await dynamoDB.get(params).promise();
        if (data.Item) {
            res.json({ success: true, data: data.Item });
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching data from DynamoDB:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
