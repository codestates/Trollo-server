'use strict';

// const fs = require('fs');
// const { stringify } = require('node:querystring');
// const path = require('path');
// const { INTEGER } = require('sequelize');
import { Sequelize } from 'sequelize';
// const basename = path.basename(__filename);
const env = 'development';
import { Config } from '../config/config';
// config;
// const config = require(__dirname + '/../config/config.js')[env];
// const db = {};
const config = Config[env];
console.log(config);

export const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: config.dialect,
});
