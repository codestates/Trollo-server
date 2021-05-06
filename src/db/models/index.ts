'use strict';

import { Sequelize } from 'sequelize';
const env = 'development';
import { Config } from '../config/config';
const config = Config[env];
console.log(config);

export const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	port: config.port,
	dialect: config.dialect,
});
