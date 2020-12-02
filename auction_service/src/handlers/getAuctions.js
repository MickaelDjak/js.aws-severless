import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMW from './../lib/commonMidleware';
import config from './../config';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
    const {status} = event.queryStringParameters;
    let auctions;
    try {
        if (status) {
            let params = {
                TableName: config.AUCTION_TABLE_NAME,
                IndexName: config.AUCTION_TABLE_NAME_INDEX,
                KeyConditionExpression: "#status = :status",
                ExpressionAttributeValues: {":status": status},
                ExpressionAttributeNames: {"#status": "status"}
            };
            auctions = await dynamodb.query(params).promise();
        } else {
            let params = {TableName: config.AUCTION_TABLE_NAME};
            auctions = await dynamodb.scan(params).promise();
        }

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


