import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

const documentClient = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {

  const { title } = JSON.parse(event.body);

  const currentDate =  new Date();
  const endingDate = new Date();
  endingDate.setHours(currentDate.getHours() +1 );

  const auction = {
    __typename: 'AuctionsTable',
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: currentDate.toISOString(),
    endingDate: endingDate.toISOString(),
    heightBid: {
      amount: 0,                                                                               
    }
  }

  const params = {
    TableName : process.env.AUCTION_TABLE_NAME,
    Item: auction
  };

  await documentClient.put(params).promise();
  return {
    statusCode: 200,
    body: JSON.stringify({ auction }),
  };
}

export const handler = createAuction;


