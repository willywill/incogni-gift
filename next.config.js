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
};

module.exports = nextConfig;
