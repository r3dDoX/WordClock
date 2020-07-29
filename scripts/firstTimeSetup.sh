opkg update;

# install ledchain kernel module
opkg install p44-ledchain;

# install node and npm
opkg install node;
opkg install node-npm;

# install project
npm i;

echo "put this into /etc/rc.local to have it start on boot:"
echo "npm start --prefix /root >> /root/log.txt 2>&1"
