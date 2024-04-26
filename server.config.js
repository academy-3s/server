module.exports = {
  apps: [
    {
      name: 'server',
      script: './index.js',
      instances: 0,
      exec_mode: 'cluster',
      watch: false
    }
  ]
};
