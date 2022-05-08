export const sleep = (delay: number) => {
	const start = new Date().getTime();
	while (new Date().getTime() < start + delay);
};
