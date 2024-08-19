import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { sayHello } from '../functions/hello_world_function/resource';
import { getIoTMessages } from '../functions/get_iot_messages/resource';

const schema = a.schema({

  getIoTMessages: a
    .query()
    .arguments({
      TableName: a.string()
    })
    .returns(a.string())
    .handler(a.handler.function(getIoTMessages)).authorization(allow => [allow.publicApiKey()]),

  sayHello: a
    .query()
    .arguments({
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(sayHello)).authorization(allow => [allow.publicApiKey()]),
  User: a.model({
    id: a.id(),
    email: a.string().required(),
    firstName: a.string().required(),
    lastName: a.string().required(),
    phone: a.string(),
    organization: a.string().required(),
    userRole: a.string(),
    platforms: a.hasMany('Platform', 'userID'),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization(allow => [allow.publicApiKey()]),

  Platform: a.model({
    id: a.id(),
    description: a.string(),
    userID: a.string().required(),
    user: a.belongsTo('User', 'userID'),
    buildings: a.hasMany('Building', 'platformID'),
    vehicles: a.hasMany('Vehicle', 'platformID'),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization(allow => [allow.publicApiKey()]),

  Building: a.model({
    id: a.id(),
    buildingName: a.string().required(),
    buildingDescription: a.string(),
    buildingAddress: a.string().required(),
    platformID: a.string().required(),
    platform: a.belongsTo('Platform', 'platformID'),
    units: a.hasMany('Unit', 'buildingID'),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization(allow => [allow.publicApiKey()]),

  Vehicle: a.model({
    id: a.id(),
    vehicleName: a.string().required(),
    vehiclePlateNumber: a.string().required(),
    vehicleDescription: a.string(),
    platformID: a.string().required(),
    platform: a.belongsTo('Platform', 'platformID'),
    units: a.hasMany('Unit', 'vehicleID'),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization(allow => [allow.publicApiKey()]),

  Unit: a.model({
    id: a.id(),
    buildingID: a.string(),
    building: a.belongsTo('Building', 'buildingID'),
    vehicleID: a.string(),
    vehicle: a.belongsTo('Vehicle', 'vehicleID'),
    devices: a.hasMany('Device', 'unitID'),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization(allow => [allow.publicApiKey()]),

  Device: a.model({
    id: a.id(),
    deviceType: a.enum(['GPS', 'TEMPERATURE_HUMIDITY']),
    unitID: a.string().required(),
    unit: a.belongsTo('Unit', 'unitID'),
    gpsDataID: a.string(),
    gpsData: a.hasOne('GPSData', 'deviceID'),
    temperatureHumidityDataID: a.string(),
    temperatureHumidityData: a.hasOne('TemperatureHumidityData', 'deviceID'),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization(allow => [allow.publicApiKey()]),

  GPSData: a.model({
    id: a.id(),
    latitude: a.float().required(),
    longitude: a.float().required(),
    altitude: a.float(),
    speed: a.float(),
    course: a.float(),
    satellites: a.integer(),
    hdop: a.float(),
    deviceID: a.string().required(),
    device: a.belongsTo('Device', 'deviceID'),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization(allow => [allow.publicApiKey()]),

  TemperatureHumidityData: a.model({
    id: a.id(),
    temperature: a.float().required(),
    humidity: a.float(),
    deviceID: a.string().required(),
    device: a.belongsTo('Device', 'deviceID'),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
  }).authorization(allow => [allow.publicApiKey()]),
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});