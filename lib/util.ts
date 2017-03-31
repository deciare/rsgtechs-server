/** @module lib/util */

/**
 * Checks whether the given value is an integer greater than or equal to 1.
 *
 * @param {number} value - Value to check.
 * @return {boolean} true if given value is integer >= 1; false otherwise.
 */
export function isPositiveInt(value: number): boolean {
	var retval = true;

	// Confirm that the value is a number.
	if (Number.isNaN(value)) {
		retval = false;
	}
	// Confirm that the value is positive and is an integer.
	else if (value < 1 || value % 1 !== 0) {
		retval = false;
	}

	return retval;
}