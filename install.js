const os = require('os');

if (os.arch() === 'mipsel' && os.hostname().startsWith('Omega-')) {
  exec('./scripts/install.sh', (error) => {
    if (error) {
      console.error('Failed to install ledchain');
    }

    console.log('Successfully installed ledchain');
  });
}