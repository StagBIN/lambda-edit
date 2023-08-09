const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

const tableName = "content";

exports.handler = async(event) => {
    const body = JSON.parse(event['body']);

    // const readParams  = {
    //     TableName: tableName,
    //     KeyConditionExpression: 'id = :hashKey',
    //     ExpressionAttributeValues: {
    //         ':hashKey': event.pathParameters.id,
    //     },
    // }; 

    // const readData = await documentClient.query(readParams).promise();

    // if (!readData.Items.length) {
    //     return {
    //         statusCode: 404,
    //         headers: {
    //             'Access-Control-Allow-Origin': '*'
    //         },
    //         body: JSON.stringify({ error: "Not found" })
    //     };
    // }    

    // if (readData.Items[0].isEncrypted){
    //     return {
    //         statusCode: 403,
    //         headers: {
    //             'Access-Control-Allow-Origin': '*'
    //         },
    //         body: JSON.stringify({error: "Update not allowed"}),
    //     };
    // }

    const params = {
        TableName: tableName,
        Key: {
            id: event.pathParameters.id
        },
        UpdateExpression: "set #data = :data",
        ConditionExpression: "#id = :id AND buid = :buid",
        ExpressionAttributeValues: {
            ":data": body.data,
            ":id": event.pathParameters.id,
            ":buid": event.headers.buid ? event.headers.buid : ""
        },
        ExpressionAttributeNames: {
            "#data": "data",
            "#id": "id"
        },
        ReturnValues: "ALL_NEW"
    };
    
    var response = {};
    
    try {
        const data = await documentClient.update(params).promise();

        response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(data.Attributes),
        };
    } catch (e) {
        response = {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({error: "Non-existent"}),
        };
    }

    return response;
};
