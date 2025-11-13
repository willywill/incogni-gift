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
	async headers() {
		return [
			{
				source: "/api/:path*",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "https://www.incognigift.com",
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, POST, PUT, DELETE, OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type, Authorization, Cookie",
					},
					{
						key: "Access-Control-Allow-Credentials",
						value: "true",
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
