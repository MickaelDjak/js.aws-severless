import AWS from 'aws-sdk';
import config from "../config";
import auctionStatus from './auctionStatus';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getEndedAuction() {
    const now = new Date();
    const params = {
        TableName: config.AUCTION_TABLE_NAME,
        IndexName: config.AUCTION_TABLE_NAME_INDEX,
        KeyConditionExpression: '#status = :status AND endingAt <= :now',
        ExpressionAttributeValues: {
            ':status': auctionStatus.OPEN,
            ':now': now.toISOString()
        },
        ExpressionAttributeNames: {
            "#status": 'status'
        }
    }

    const result =  await dynamodb.query(params).promise();

    return result.Items;
}

export default getEndedAuction;