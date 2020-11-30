import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMW from './../lib/commonMidleware';
import config from './../config';
import {getAuctionById} from './getAuction'


const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    const {id} = event.pathParameters;
    const {amount} = event.body;

    let auction = await getAuctionById(id);
    if (Number(auction.Item.highestBit.amount) >= Number(amount)) {
        throw new createError.Forbidden("You can't make highest bit less or equal than current price");
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

export const handler = commonMW(placeBid);


