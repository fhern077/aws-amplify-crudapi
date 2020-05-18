const dynamoose = require('dynamoose');
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
})


module.exports = {
  dynamoose
}




