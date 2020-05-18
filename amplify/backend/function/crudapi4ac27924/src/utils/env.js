const dotenv = require('dotenv');

const loadVarsByEnv = () => {
  // will load different environmental variable contexts
  switch (process.env.NODE_ENV) {
    case "prod": {
      logger.info("loaded prod config from external");
      break;
    }
    case "dev": {
      dotenv.config();
      break;
    }
    default: {
      console.log('loading from local .env since nothing was specficed')
      dotenv.config();
      break;
    }
  }
};

module.exports = {
  loadVarsByEnv
}