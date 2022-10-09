const { getEndedAuctions } = require('../lib/getEndedAuctions')

async function processAuctions(event, context) {

  console.log("arn -- ",process.env.AUCTION_TABLE_NAME_ARN)
  const items = await getEndedAuctions();

  console.log("Processing Scheduling items", items);
}

export const handler = processAuctions;


