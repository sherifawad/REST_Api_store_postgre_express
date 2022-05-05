export const objectOmit = <T>(object: T, keys: string[]) => {
	const condition: string[] = [];
	keys.forEach(key => {
		condition.push(`k !== ${key}`);
	});
	console.log("🚀 ~ file: arrayUtils.ts ~ line 3 ~ condition", condition);

	return Object.fromEntries(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		Object.entries(object).filter(([k]) => condition.join(" && "))
	);
};
