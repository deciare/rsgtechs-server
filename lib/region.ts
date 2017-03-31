/** @module lib/region */
import { shim } from "promise.prototype.finally";
import Config from "../config";
import { Database } from "../lib/db";

// Shim support for Promise.finally(), if needed
shim();

export class Region {
	id: number;
	name: string;
}

export class RegionHelper {
	static getById(id: number): Promise<Region> {
		var db = new Database();

		return db.connect()
			.then(() => {
				return db.select(
					"SELECT * " +
					"FROM region " +
					"WHERE id=?",
					[ id ]
				);
			})
			.catch((err: any) => {
				return Promise.reject(err);
			})
			.finally(() => {
				db.disconnect();
			});
	}
}