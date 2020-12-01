import AWS from 'aws-sdk';
import config from "../config";
import auctionStatus from './auctionStatus';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function closeAuctions(auction) {
    const params = {
        TableName: config.AUCTION_TABLE_NAME,
        Key: {id:auction.id },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeValues: {
            ':status': auctionStatus.CLOSE
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        },
    }

    const result =  await dynamodb.update(params).promise();

    return result.Items;
}

export default closeAuctions;