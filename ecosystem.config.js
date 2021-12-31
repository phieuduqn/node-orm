module.exports = {
  apps: [{
    name: 'xp_api_services',
    script: 'app.js',
    exec_mode: 'cluster',
    instances: 'max',
    env: {
      name: 'xp_app_dev',
      NODE_ENV: 'development'
    },
    env_production: {
      name: 'xp_app_prod',
      NODE_ENV: 'production'
    }
  }]
}
