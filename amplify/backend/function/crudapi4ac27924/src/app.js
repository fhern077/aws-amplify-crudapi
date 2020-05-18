/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const path = require('path');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const express = require('express');
const bodyParser = require('body-parser');
const Analytics = require('./models/analytics');
const { loadVarsByEnv } = require('./utils/env');

// load environment vars before starting server
loadVarsByEnv();

// declare a new express app
const app = express()

app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())
// host public folder
app.use(express.static(path.join(__dirname, '/public')))

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

app.post('/api/analytics', async (req, res) => {
  const { page, ipAddress } = req.body;
  try {
    const analytics = await Analytics.create({ ipAddress, page, time: Date.now() });
    res.json(analytics).status(200)
  }
  catch (err) {
    console.log(err);
    res.send(err).status(500)
  }
})

app.get('/api/analytics/', async (req, res) => {
  try {
    const queryRes = await Analytics.scan("").exec()
    res.json({ count: queryRes }).status(200);
  }
  catch (err) {
    console.log(err);
    res.error(err).status(500)
  }
})

app.get('/api/analytics/:page', async (req, res) => {
  const { page } = req.params;
  try {
    const queryRes = await Analytics.query("page").eq(page).exec()
    res.json({ count: queryRes }).status(200);
  }
  catch (err) {
    console.log(err);
    res.error(err).status(500)
  }
})


app.listen(process.env.port || 3000, () => {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
