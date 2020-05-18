const { uuid } = require('uuidv4');
const { dynamoose } = require('../utils/db');
const schema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    required: true,
    default: uuid,
  },
  page: {
    type: String,
    index: {
      "name": "pageIndex",
      "global": true
    }
  },
  ipAddress: {
    type: String,
  },
  time: {
    type: Date,
  },
}, {
  useNativeBooleans: true,
  timestamps: true,
  throughput: { read: 1, write: 1 },
});

const tableName = 'Analytics';
const model = dynamoose.model(tableName, schema, { create: true });
model.tableSchema = schema;
model.tableName = tableName;

module.exports = model;