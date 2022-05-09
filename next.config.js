const path = require('path');

module.exports = {
  reactStrictMode: true,
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  eslint: {
    dirs: ["pages", "components", "lib", "scripts"], // Explicit defaults
  },
  i18n: {
    locales: ["en-GB"],
    defaultLocale: "en-GB",
  },
  webpack: (config, { buildId, dev }) => {
    config.resolve.symlinks = false;
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    };
    return config;
  },
};
