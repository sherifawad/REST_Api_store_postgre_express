module.exports = {
	env: {
		node: true,
		es2021: true
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"eslint-config-airbnb-base",
		"airbnb-typescript/base",
		"plugin:prettier/recommended"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: "./tsconfig.json"
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"prettier/prettier": "error",
		"@typescript-eslint/no-unused-vars": "error",
		"@typescript-eslint/no-explicit-any": "error",
		"strict": ["error", "global"],
		"no-console": ["off"],
		"no-use-before-define": "off",
		"no-nested-ternary": ["off"],
		"max-len": ["error", { code: 400 }],
		"indent": ["error", "tab"],
		"no-empty": ["error", { allowEmptyCatch: true }],
		"no-this-before-super": ["off"],
		"no-useless-constructor": ["off"],
		"no-empty-function": [
			"error",
			{ allow: ["constructors", "arrowFunctions"] }
		],
		"no-param-reassign": ["error", { props: false }],
		"no-underscore-dangle": ["off"],
		"import/no-extraneous-dependencies": [
			"error",
			{
				devDependencies: true,
				optionalDependencies: false,
				peerDependencies: false
			}
		],
		"import/prefer-default-export": ["off"],
		"no-new": ["off"],
		"prefer-template": ["error"],
		"no-plusplus": ["off"],
		"func-style": ["error", "expression"],
		"no-new-func": "error",
		"prefer-arrow-callback": "error",
		"arrow-parens": ["error", "as-needed"],
		"arrow-body-style": ["error", "as-needed"],
		"new-cap": "error",
		"no-invalid-this": "error",
		"prefer-destructuring": [
			"error",
			{ array: true, object: true },
			{ enforceForRenamedProperties: true }
		],
		"no-eval": "error",
		"no-implied-eval": "error",
		"eqeqeq": "error",
		"no-with": "error",
		"semi": ["error", "always"],
		"comma-dangle": ["error", "never"],
		"indent": 0,
		"no-confusing-arrow": 0,
		"no-const-assign": 2,
		"no-shadow": 0,
		"no-return-assign": 0,
		"no-prototype-builtins": 0,
		"no-restricted-syntax": 0,
		"no-unused-expressions": 0,
		"object-curly-newline": 0,
		"import/no-unresolved": 0,
		"implicit-arrow-linebreak": 0,
		"function-paren-newline": 0,
		"consistent-return": 0,
		"max-classes-per-file": 0,
		"operator-linebreak": 0,
		"nonblock-statement-body-position": 0,
		"generator-star-spacing": 0,
		"camelcase": 0
	}
};
