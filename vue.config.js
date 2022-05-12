/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
	publicPath: '/streamlabs-controller',
	configureWebpack: {
		devServer: {
			allowedHosts: 'all',
			host: '0.0.0.0',
		},
	},
};
