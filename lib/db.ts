/** @module lib/db */
import Config from "../config";
import { MysqlDriver } from "./db-drivers/mysql";
import { debug } from "./util";

/**
 * Common signature for callback functions.
 */
export interface ICallback {
	(error: any, results?: any): void;
}

/**
 * Interface for database drivers that standardises method signatures and return
 * values for this database abstraction layer.
 */
export interface IDriver {
	/**
	 * Connection object with a library-specific type. Classes that implement
	 * this interface should manage the connection object internally.
	 */
	connection: any;

	/**
	 * Connects to database using parametesr and credentials set in /config.ts.
	 * Classes that implement this interface should manage the connection object
	 * internally.
	 *
	 * @param {Function} callback - Function to be called when connect operation
	 *   completes.
	 */
	connect(callback: (err: any) => void): void;

	/**
	 * Executes a query, expecting that zero or more rows of results will be
	 * provided in the result set.
	 *
	 * @param {string} sql - SQL statement with placeholders.
	 * @param {any[]} values - Values to insert into placeholders.
	 * @param {ICallback} callback - Function to be called when query operation
	 *   completes. An array will be passed as the 2nd parameter, with each
	 *   element in the array corresponding to one row of results.
	 */
	select(sql: string, values: any[], callback: ICallback): void;

	/**
	 * Executes a query, expecting that a single numeric value will be provided
	 * in the result set. Depending on the query type, the numeric value may be
	 * the ID of the last inserted row, or the number of rows affected.
	 *
	 * @param {string} sql - SQL statement with placeholders.
	 * @param {any[]} values - Values to insert into placeholders.
	 * @param {Icallback} callback - Function to be called when query operation
	 *   completes. A number will be passed as the 2nd parameter, which may
	 *   represent either the ID of the last inserted row or a count of the
	 *   number of rows affected.
	 */
	run(sql: string, values: any[], callback: ICallback): void;

	/**
	 * Closes the connection object managed by this database driver instance.
	 *
	 * @param {ICallback} callback - Function to be called when disconnect
	 *   operation completes.
	 */
	disconnect(callback?: (err: any) => void): void;
}

/**
 * Database abstraction layer. Returns results as promises rather than
 * callbacks.
 */
export class Database {
	private _driver: IDriver;

	/**
	 * Instantiates a database abstraction layer. Selects a driver based on
	 * values given in /config.ts.
	 *
	 * @constructor
	 */
	constructor() {
		switch (Config.dbDriver) {
			case "mysql":
				this._driver = new MysqlDriver();
				break;
			default:
				throw new Error("Unrecognsised database driver: " + Config.dbDriver);
		}
	}

	/**
	 * Connects to a database. Must be called before any queries can be made.
	 *
	 * @return {Promise<any>} Resolves when connection succeeds. Rejects when
	 *   connection attempt fails. Generic return type allows this to be the
	 *   start of a promise chain expecting any kind of return value.
	 */
	connect(): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			this._driver.connect((err) => {
				if (err) {
					debug("Database.connect() failed");
					reject(err);
				}
				else {
					debug("Database.connect() succeeded");
					resolve();
				}
			});
		});
	}

	/**
	 * Disconnects from a database. Should be called after all queries in the
	 * calling function have concluded.
	 *
	 * @return {Promise<void>} Resolves if disconnection is successful upon
	 *   completion of all outstanding queries. Rejects otherwise.
	 */
	disconnect(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._driver.disconnect((err) => {
				if (err) {
					debug("Database.disconnect() failed");
					reject(err);
				}
				else {
					debug("Database.disconnect() succeeded");
					resolve();
				}
			});
		});
	}

	/**
	 * Executes a query and promises to return an array representing zero or
	 * more rows of results.
	 *
	 * @param {string} sql - SQL statement with placeholders.
	 * @param {string} values - Values to insert into placeholders.
	 * @return {Promise<any[]>} Result set, with each array element representing
	 *   one row from the result set.
	 */
	select(sql: string, values: any[]): Promise<any[]> {
		debug("Database.select() called:", sql, values);
		return new Promise<any[]>((resolve, reject) => {
			if (this._driver.connection == null) {
				return reject("Database is not connected.");
			}

			this._driver.select(sql, values, (err: any, results: any[]) => {
				if (err) {
					debug("Database.select() failed");
					reject(err);
				}
				else {
					debug("Database.select() succeeded:", results);
					resolve(results);
				}
			});
		})
	}

	/**
	 * Executes a query and promises to return either the ID of the last
	 * inserted row, or a count of the number of affected rows.
	 *
	 * @param {string} sql - SQL statement with placeholders.
	 * @param {string} values - Values to insert into placeholders.
	 * @return {Promise<number>} Either the ID of the last inserted row, or a
	 *   count of the number of affected rows.
	 */
	run(sql: string, values: any[]): Promise<number> {
		debug("Database.select() called:", sql, values);
		return new Promise<number>((resolve, reject) => {
			if (this._driver.connection == null) {
				return reject("Database is not connected.");
			}

			this._driver.run(sql, values, (err: any, effect: number) => {
				if (err) {
					debug("Database.run() failed");
					reject(err);
				}
				else {
					debug("Database.run() succeeded:", effect);
					resolve(effect);
				}
			});
		})
	}
}