export type Result<T> = {
	[Key in keyof T]: () => T[Key];
};

export type Res<T> = {
	[Key in keyof T]: (val: T[Key]) => string;
};
