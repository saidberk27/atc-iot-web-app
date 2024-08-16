import { defineFunction } from '@aws-amplify/backend';

export const getIoTMessages = defineFunction({
    name: 'get-iot-messages',
    entry: './handler.ts'
});