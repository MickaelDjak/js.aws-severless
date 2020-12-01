import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';

import commonMW from './../lib/commonMidleware';
import auctionStatus from './../lib/auctionStatus';
import config from './../config';
import {getAuctionById} from './getAuction';
import schema from './../lib/schemas/placeBidSchema'

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    const {id} = event.pathParameters;
    const {amount} = event.body;

    let auction = await getAuctionById(id);
    if (Number(auction.Item.highestBit.amount) >= Number(amount)) {
        throw new createError.Forbidden("You can't make highest bit less or equal than current price");
    }

    if ( auction.Item.status === auctionStatus.CLOSE) {
        throw new createError.Forbidden("You can't bit closed auction");
    }

    let result;
    try {
        result = await dynamodb.update({
            TableName: config.AUCTION_TABLE_NAME,
            Key: {id},
            UpdateExpression: "SET highestBit.amount = :amount",
            ExpressionAttributeValues: {
                ':amount': amount || 0
            },
            ReturnValues: 'ALL_NEW'
        }).promise();
    } catch (e) {
        console.error(e);
        throw new createError.InternalServerError(e);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({data: result.Attributes})
    };
}

export const handler = commonMW(placeBid).use(validator({inputSchema: schema}));


