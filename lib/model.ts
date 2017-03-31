/** @module lib/model */
import { debug } from "./util";

/**
 * Class modelling the most basic JSON object returned by this application.
 * All other models should extend this class.
 */
export class Base {
	success: boolean;
	error: string;

	constructor(success: boolean, error?: any) {
		this.success = success;
		if (error !== undefined) {
			debug(error);
			if (error instanceof Error) {
				// TODO: proper logging of stack traces somewhere not visible to
				// the end user.
				this.error = error.message;
			}
			else if (typeof error !== "string") {
				this.error = error.toString();
			}
			else {
				this.error = error;
			}
		}
	}
}

/**
 * Class representing a region.
 */
export class Region extends Base {
	id: number;
	name: string;

	constructor(values: any) {
		super(true);
		this.id = values.id;
		this.name = values.name;
	}
}

/**
 * Class representing a list of regions.
 */
export class RegionList extends Base {
	regions: Region[];

	constructor() {
		super(true);
	}
}