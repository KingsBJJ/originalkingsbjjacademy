module.exports = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.hbs$/,
      loader: 'handlebars-loader',
    });
    return config;
  },
};