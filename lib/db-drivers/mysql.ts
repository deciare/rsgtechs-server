/** @module lib/db-drivers/mysql */
import * as Mysql from 'mysql';

import Config from "../../config";
import { ICallback, IDriver } from "../db";
import { debug } from "../util";

/**
 * Wrapper for node-mysql. Provides consistent method signatures and return
 * values for database abstraction layer.
 */
export class MysqlDriver implements IDriver {
	connection: Mysql.IConnection = null;

	/**
	 * Instantiates a wrapper for node-mysql.
	 *
	 * @constructor
	 */
	constructor() {
	}

	connect(callback: (err: any) => void): void {
		this.connection = Mysql.createConnection({
			host: Config.dbHostname,
			port: Config.dbPort,
			database: Config.dbName,
			user: Config.dbUsername,
			password: Config.dbPassword
		});
		this.connection.connect(callback);
	}

	select(sql: string, values: any[], callback: ICallback): void {
		this.connection.query(sql, values, callback);
	}

	run(sql: string, values: any[], callback: ICallback): void {
		this.connection.query(sql, values, (err: Mysql.IError, results: any) => {
			if (err) {
				callback(err);
			}
			else {
				let queryType: string = sql.trim().split(" ")[0].toUpperCase();
				let effect: number;

				// Depending on the query type, the mysql module returns a
				// different kind of information under a different property in
				// the result set.
				switch (queryType) {
					case "INSERT":
						effect = results.insertId;
						break;
					case "UPDATE":
						effect = results.affectedRows;
						break;
					case "DELETE":
						effect = results.changedRows;
						break;
				}

				// Call the user's callback, letting them know the effect their
				// query had.
				callback(null, effect);
			}
		});
	}

	disconnect(callback?: (err: any) => void): void {
		this.connection.end((err) => {
			if (err) {
				callback(err);
			}
			else {
				this.connection = null;
				callback(null);
			}
		});
	}
}