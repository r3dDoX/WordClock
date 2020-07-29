const os = require('os');
const {exec} = require('child_process');

if (os.arch() === 'mipsel' && os.hostname().startsWith('Omega-')) {
  exec('./scripts/install.sh', (error) => {
    if (error) {
      console.error('Failed to install ledchain');
      return;
    }

    console.log('Successfully installed ledchain');
  });
}