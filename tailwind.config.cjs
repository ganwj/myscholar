const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				// teal
				primary: {
					50: '#f0fdfa',
					100: '#ccfbf1',
					200: '#99f6e4',
					300: '#5eead4',
					400: '#2dd4bf',
					500: '#14b8a6',
					600: '#0d9488',
					700: '#0f766e',
					800: '#115e59',
					900: '#134e4a'
				},
				blue: {
					50: '#b6d4fe',
					100: '#9ec5fe',
					200: '#86b7fe',
					300: '#6ea8fe',
					400: '#569afe',
					500: '#3d8bfd',
					600: '#257dfd',
					700: '#0d6efd',
					800: '#0c63e4',
					900: '#0a58ca'
				}
			}
		}
	}
};

module.exports = config;
