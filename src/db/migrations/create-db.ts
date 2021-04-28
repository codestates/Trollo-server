import { QueryInterface, Sequelize, Options } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();
// db생성 부분
class options implements Options {
	dialect!: 'mysql';
	username!: string;
	password!: string;
}
// option으로 만들어서 밑에서 new Sequelize로 옵션 넣어주고,
const createDBOptions = new options();
createDBOptions.username = process.env.DATABASE_USERNAME || 'root';
createDBOptions.password = process.env.DATABASE_PASSWORD || 'your password';
createDBOptions.dialect = 'mysql';

let db_name = process.env.DATABASE_NAME || 'new DataBase';

const dbCreateSequelize = new Sequelize(createDBOptions);

console.log(`======Create DataBase : ${db_name}======`);

dbCreateSequelize
	.getQueryInterface()
	.createDatabase(db_name)
	.then(() => {
		console.log('✅db create success!');
	})
	.catch(e => {
		console.log('❗️error in create db : ', e);
	});
