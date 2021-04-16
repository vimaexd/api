module.exports = {
  apps: [
    {
      name: 'api',
      script: 'dist/index.js',
      watch: true,
      env: {NODE_ENV: 'production'},
    },
  ],
};
