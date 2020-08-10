const {exec} = require('child_process');

module.exports = {
  scanForWifiNetworks() {
    return new Promise((resolve, reject) => {
      exec(`ubus call onion wifi-scan "{'device':'ra0'}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error Code: ${error.code}, Error Signal: ${error.signal}`);
          reject(stderr.toString());
        } else {
          resolve(JSON.parse(stdout.toString()).results);
        }
      });
    });
  },
  getConfiguredWifiNetworks() {
    return new Promise((resolve, reject) => {
      exec('wifisetup list', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error Code: ${error.code}, Error Signal: ${error.signal}`);
          reject(stderr.toString());
        } else {
          resolve(JSON.parse(stdout.toString()).results.map(network => ({
            ssid: network.ssid,
            enabled: network.enabled,
            encryption: network.encryption,
          })));
        }
      });
    });
  },
  removeConfiguredWifiNetwork(ssid) {
    return new Promise((resolve, reject) => {
      exec(`wifisetup remove -ssid "${ssid}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error Code: ${error.code}, Error Signal: ${error.signal}`);
          reject(stderr.toString());
        } else {
          resolve();
        }
      });
    });
  },
  addWifiConfiguration(ssid, encryption, password) {
    return new Promise((resolve, reject) => {
      exec(`wifisetup add -ssid "${ssid}" -encr "${encryption}" -password "${password}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error Code: ${error.code}, Error Signal: ${error.signal}`);
          reject(stderr.toString());
        } else {
          resolve();
        }
      });
    });
  }
}