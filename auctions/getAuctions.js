import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

const documentClient = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {

  try {    
    const params = {
      TableName : process.env.AUCTION_TABLE_NAME
    };
  
    const result =  await documentClient.scan(params).promise();
    const auctions = result.Items
    return {
      statusCode: 200,
      body: JSON.stringify({ auctions }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error }),
    };
  }
}

export const handler = getAuctions;


