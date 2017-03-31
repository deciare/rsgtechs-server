/** @module lib/region */
import { shim } from "promise.prototype.finally";
import { Database } from "../lib/db";

// Shim support for Promise.finally(), if needed
shim();

export class Region {
	id: number;
	name: string;

	constructor(values: any) {
		this.id = values.id;
		this.name = values.name;
	}
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
			.then((results: any[]) => {
				return Promise.resolve(new Region({
					id: results[0].id,
					name: results[0].name
				}));
			})
			.catch((err: any) => {
				return Promise.reject(err);
			})
			.finally(() => {
				db.disconnect();
			});
	}
}