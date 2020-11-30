import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMW from './../lib/commonMidleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  try {
    const auctions = await dynamodb.scan({
      TableName: process.env.AUCTION_TABLE_NAME,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({data: auctions})
    };
  } catch (e) {
    console.error(e);
    throw new createError.InternalServerError(e);
  }
}

export const handler = commonMW(getAuctions);


