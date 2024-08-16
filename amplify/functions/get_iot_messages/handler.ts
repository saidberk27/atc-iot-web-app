import { DynamoDB } from 'aws-sdk';
import type { AppSyncResolverEvent } from 'aws-lambda';

const dynamodb = new DynamoDB.DocumentClient();

export const handler = async (event: AppSyncResolverEvent<{ TableName?: string }>): Promise<string | null> => {
  const tableName = event.arguments.TableName || 'IoTMessages'; // Varsayılan tablo adı
  const params = {
    TableName: tableName,
  };

  try {
    console.log("Debug yapıyoruzz");
    const result = await dynamodb.scan(params).promise();
    console.log(result);
    // Dönüş tipini string olarak ayarlıyoruz
    return JSON.stringify(result.Items);
  } catch (error) {
    console.error('Error fetching IoT messages:', error);
    // Hata durumunda null döndürüyoruz
    return null;
  }
};