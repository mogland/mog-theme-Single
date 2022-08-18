module.exports = {
  apps: [
    {
      name: 'nx-theme-Single',
      script: 'npx next start -p 2323',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '180M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}