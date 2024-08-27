//TODO scan() yerine query() ekle.

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

  switch (timeFrame) {
    case 'MINUTE':
      startTime = endTime - 60 * 1000; // 1 minute ago
      break;
    case 'HOUR':
      startTime = endTime - 60 * 60 * 1000; // 1 hour ago
      break;
    case 'DAY':
      startTime = endTime - 24 * 60 * 60 * 1000; // 24 hours ago
      break;
    case 'WEEK':
      startTime = endTime - 7 * 24 * 60 * 60 * 1000; // 7 days ago
      break;
    default:
      throw new Error('Invalid TimeFrame');
  }

  const params = {
    TableName: tableName,
    FilterExpression: '#timestamp BETWEEN :startTime AND :endTime',
    ExpressionAttributeNames: {
      '#timestamp': 'timestamp'
    },
    ExpressionAttributeValues: {
      ':startTime': startTime,
      ':endTime': endTime
    }
  };

  try {
    const result = await dynamodb.scan(params).promise();
    console.log(`Retrieved ${result.Items?.length} items`);
    return JSON.stringify(result.Items);
  } catch (error) {
    console.error('Error fetching IoT messages:', error);
    return null;
  }
};