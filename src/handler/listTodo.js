'use strict'

const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.listTodo = (req, res) => {

    // const params = {
    //     TableName: 'Test'
    // };

    // dynamoDb.scan(params, (error, data) => {
    //     if(error) {
    //         console.error(error);
    //         callback(new Error(error));
    //         return;
    //     }

    //     const response = {
    //         statusCode: 200,
    //         body: JSON.stringify(data.Items)
    //     };

    //     callback(null, response);
    // });

    res.status(500).json({ error: "Could not retreive user" });
}