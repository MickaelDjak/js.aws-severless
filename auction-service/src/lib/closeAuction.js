import AWS from 'aws-sdk';
import config from "../config";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function closeAuctions(auction) {
    const params = {
        TableName: config.AUCTION_TABLE_NAME,
        Key: {id:auction.id },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeValues: {
            ':status': "CLOSED"
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        },
    }

    const result =  await dynamodb.update(params).promise();

    return result.Items;
}

export default closeAuctions;