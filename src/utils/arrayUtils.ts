/* eslint-disable no-await-in-loop */
// https://advancedweb.hu/how-to-use-async-functions-with-array-some-and-every-in-javascript/

export const asyncSome = async <T>(
	arr: T[],
	predicate: (arg0: T) => unknown
) => {
	for (const e of arr) {
		if (await predicate(e)) return true;
	}
	return false;
};

export const asyncEvery = async <T>(
	arr: T[],
	predicate: (arg0: T) => unknown
) => {
	for (const e of arr) {
		if (!(await predicate(e))) return false;
	}
	return true;
};
