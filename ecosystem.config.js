module.exports = {
  apps : [
      {
        name: "api",
        script: "index.js",
        watch: true,
        env: {
          "NODE_ENV": "production",
        }
      }
  ]
}
