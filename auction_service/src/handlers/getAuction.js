import AWS from 'aws-sdk';
import commonMW from './../lib/commonMidleware';
import createError from 'http-errors';
import config from './../config';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
    let auction;
    try {
        auction = await dynamodb.get({
            TableName: config.AUCTION_TABLE_NAME,
            Key: {id},
        }).promise();
    } catch (e) {
        console.error(e);
        throw new createError.InternalServerError(e);
    }

    return auction;
}

async function getAuction(event, context) {
    const {id} = event.pathParameters;
    let auction = await getAuctionById(id);

    if (auction.Item) {
        return {
            statusCode: 200,
            body: JSON.stringify({data: auction.Item})
        };
    }

    throw new createError.NotFound(`Auction with id #${id} nof found!`);
}

export const handler = commonMW(getAuction);


