const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get("/users", async function (req, res) {
    const now = new Date();
    const params =  {
      TableName: USERS_TABLE,
      IndexName: 'statusAndCreatedAt',
      KeyConditionExpression: '#status = :status AND createdAt <= :now',
      ExpressionAttributeValues: {
        ':status': 'OPEN',
        ':now': now.toISOString(),
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    }

  try {
    console.log(params)
    const results = await dynamoDbClient.query(params).promise();
    console.log(results)

    // if (Item) {
      // const { userId, name } = Item;
    res.json(results.Items);
    // } else {
    //   res
    //     .status(404)
    //     .json({ error: 'Could not find user with provided "userId"' });
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

// get value using global index
app.get("/users/process", async function (req, res) {
  const now = new Date();
  const params =  {
    TableName: USERS_TABLE,
    IndexName: 'statusAndCreatedAt',
    KeyConditionExpression: '#status = :status AND createdAt <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': now.toISOString(),
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  }

try {
  console.log(params)
  const results = await dynamoDbClient.query(params).promise();
  console.log(results)

  res.json(results.Items);
  
} catch (error) {
  console.log(error);
  res.status(500).json({ error: "Could not retreive user" });
}
});

// single item
app.get("/users/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.post("/users", async function (req, res) {
  const { userId, name } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ userId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
