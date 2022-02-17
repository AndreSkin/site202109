module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		parser: '@babel/eslint-parser',
		requireConfigFile: false
	},
	extends: [
		'@nuxtjs',
		'plugin:nuxt/recommended'
	],
	plugins: [
	],
	// add your custom rules here
	rules: {
		'array-bracket-spacing': 'off',
		'arrow-parens': 'off',
		'camelcase': 'off',
		'comma-dangle': 'off',
		'computed-property-spacing': 'off',
		'indent': ['error', 'tab'],
		'yoda': 'off',
		'no-tabs': 'off',
		'object-curly-newline': 'off',
		'object-curly-spacing': 'off',
		'one-var': 'off',
		'padded-blocks': 'off',
		'quote-props': 'off',
		'quotes': 'off',
		'space-before-function-paren': 'off',
		'space-in-parens': 'off',
		'spaced-comment': 'off',
		'template-curly-spacing': 'off',
		'vue/html-indent': ['error', 'tab'],
		'vue/singleline-html-element-content-newline': 'off',
		"no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
	}
}
