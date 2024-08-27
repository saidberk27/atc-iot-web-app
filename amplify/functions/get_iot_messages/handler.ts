import { DynamoDB } from 'aws-sdk';
import type { AppSyncResolverEvent } from 'aws-lambda';

const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event: AppSyncResolverEvent<{
  TableName?: string,
  TimeFrame: 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK',
  EndTime?: number
}>): Promise<string | null> => {
  const tableName = event.arguments.TableName || 'IoTMessages2';
  const timeFrame = event.arguments.TimeFrame;
  const endTime = event.arguments.EndTime || Date.now();

  let startTime: number;
  let dateKey: string;

  switch (timeFrame) {
    case 'MINUTE':
      startTime = endTime - 60 * 1000;
      dateKey = new Date(endTime).toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
      break;
    case 'HOUR':
      startTime = endTime - 60 * 60 * 1000;
      dateKey = new Date(endTime).toISOString().slice(0, 13); // YYYY-MM-DDTHH
      break;
    case 'DAY':
      startTime = endTime - 24 * 60 * 60 * 1000;
      dateKey = new Date(endTime).toISOString().slice(0, 10); // YYYY-MM-DD
      break;
    case 'WEEK':
      startTime = endTime - 7 * 24 * 60 * 60 * 1000;
      dateKey = new Date(endTime).toISOString().slice(0, 10); // YYYY-MM-DD (week's end date)
      break;
    default:
      throw new Error('Invalid TimeFrame');
  }

  const params = {
    TableName: tableName,
    IndexName: 'DateTimeIndex',
    KeyConditionExpression: 'dateKey = :dateKey AND #timestamp BETWEEN :startTime AND :endTime',
    ExpressionAttributeNames: {
      '#timestamp': 'timestamp'
    },
    ExpressionAttributeValues: {
      ':dateKey': dateKey,
      ':startTime': startTime,
      ':endTime': endTime
    }
  };

  try {
    const result = await dynamodb.query(params).promise();
    console.log(`Retrieved ${result.Items?.length} items`);
    return JSON.stringify(result.Items);
  } catch (error) {
    console.error('Error fetching IoT messages:', error);
    return null;
  }
};