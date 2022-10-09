import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

const documentClient = new AWS.DynamoDB.DocumentClient();

async function getAuctionById(event, context) {
  try {    
    const { id } = event.pathParameters
    const params = {
      TableName : process.env.AUCTION_TABLE_NAME,
      Key: { id },
    };
  
    const result =  await documentClient.get(params).promise();
    const auction = result.Item
    return {
      statusCode: 200,
      body: JSON.stringify({ auction }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error }),
    };
  }
}

export const handler = getAuctionById;


