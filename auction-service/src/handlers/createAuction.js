import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import commonMW from './../lib/commonMidleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {

    const {title, amount} = event.body;

    const createdAt =  new Date()
    const endingAt =  new Date()

    endingAt.setMinutes(endingAt.getMinutes() + 3)

    const auction = {
        id: uuid(),
        title,
        status: "OPEN",
        createdAt: createdAt.toISOString(),
        endingAt: endingAt.toISOString(),
        highestBit: {
            amount: Number(amount) || 0
        }
    };

    try {
        await dynamodb.put({
            TableName: process.env.AUCTION_TABLE_NAME,
            Item: auction
        }).promise();
    } catch (e) {
        console.error(e);
        throw new createError.InternalServerError(e);
    }

    return {
        statusCode: 201,
        body: JSON.stringify({data: auction})
    };
}

export const handler = commonMW(createAuction);


