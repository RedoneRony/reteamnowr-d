import AWS from 'aws-sdk';

const documentClient = new AWS.DynamoDB.DocumentClient();

async function updateAuctionById(event, context) {
  try {    
   
    const { id } = event.pathParameters;
    const { title, amount } = JSON.parse(event.body);
    const params = {
      TableName : process.env.AUCTION_TABLE_NAME,
      Key: { id },
      UpdateExpression: 'SET #tl = :tl, #hBid = :hBid',
      ExpressionAttributeNames: {
        "#tl": "title",
        "#hBid": "heightBid"
      },
      ExpressionAttributeValues: {
        ':tl': title,
        ':hBid': {
          amount: amount
        }
      },
      ReturnValues: 'UPDATED_NEW',
    };
    
  
    const result =  await documentClient.update(params).promise();
    const auction = result
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

export const handler = updateAuctionById;


