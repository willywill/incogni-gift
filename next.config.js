/** @type {import('next').NextConfig} */
const nextConfig = {
	compiler: {
		styledComponents: {
			displayName: true,
			ssr: true,
		},
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	}
};

module.exports = nextConfig;
