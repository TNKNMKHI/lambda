import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamodbClient = new DynamoDBClient({
  region: 'us-east-1',
});
const docClient = DynamoDBDocumentClient.from(dynamodbClient);

export const handler = async (event) => {
  // 日付をyyyymmddで取得
  const current_time = new Date();
  let month = current_time.getMonth() + 1;
  let day = current_time.getDate();
  if (month < 10) {
    month = "0" + String(month);
  } else {
    month = String(month);
  }
  if (day < 10) {
    day = "0" + String(day);
  } else {
    day = String(day);
  }

  const date = Number(String(current_time.getFullYear()) + month + day);

  // dynamoDBにqueryを実行して本日分のデータを取得する
  try {
    const command = new QueryCommand({
      TableName: "danger",
      KeyConditionExpression: "#hn = :val1",
      ExpressionAttributeNames: {
        "#hn": "date"
      },
      ExpressionAttributeValues: {
        ":val1": date
      }
    });

    // 検索をかけて返却
    const response = await docClient.send(command);
    console.log(response);
    return response;

  } catch (err) {
    console.error("Error querying DynamoDB", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'something is wrong',
      })
    };
  }
};
