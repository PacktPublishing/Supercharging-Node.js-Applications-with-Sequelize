'use strict';

const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { SequelizeInstrumentation } = require('opentelemetry-instrumentation-sequelize');

const fs = require('fs');
const path = require('path');
const Sequelize = require('@sequelize/core');
const logger = require('pino')();
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
console.log(process.env)
console.log(process.env.NODE_ENV)
const config = require(__dirname + '/../config/config.json')[env];
console.log(config)
const db = {};

config.logging = (msg) => logger.info(msg);

const tracerProvider = new NodeTracerProvider({
  plugins: {
    sequelize: {
      // disabling the default/old plugin is required
      enabled: false,
      path: 'opentelemetry-plugin-sequelize'
    }
  }
});

registerInstrumentations({
  tracerProvider,
  instrumentations: [
    new SequelizeInstrumentation({
      // any custom instrument options here
    })
  ]
});

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
