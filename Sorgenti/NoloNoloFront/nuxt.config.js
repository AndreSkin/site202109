const colors = require( "vuetify/es5/util/colors" ).default

module.exports = {

	/*server: {
		port: 8000
	},*/

	target: 'static',
	// Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
	ssr: false,

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'NoloNoloPlus',
		htmlAttrs: {
			lang: 'en'
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' },
			{ name: 'format-detection', content: 'telephone=no' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [],

	// https://nuxtjs.org/docs/configuration-glossary/configuration-loading/
	loading: false,

	// https://nuxtjs.org/docs/directory-structure/nuxt-config#privateruntimeconfig
	privateRuntimeConfig: {
		// …: process.env.…,
	},

	// https://nuxtjs.org/docs/configuration-glossary/configuration-servermiddleware
	serverMiddleware: [],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		// '~/plugins/….js',
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: [
		{ path: '~/components', extensions: ['vue'] },
	],

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		'@nuxtjs/eslint-module',
		// https://go.nuxtjs.dev/vuetify
		'@nuxtjs/vuetify'
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
	],

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {},

	// Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
	vuetify: {
		theme: {
			dark: false,
			themes: {
				dark: {
					primary: "#FFCA28",
			        secondary: "#1976D2",
			        accent: "#82B1FF",
			        error: "#FF5252",
			        info: "#2196F3",
			        success: "#4CAF50",
			        warning: "#FB8C00"
				}
			}
		}
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
	}
}
