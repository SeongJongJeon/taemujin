#!/bin/bash
for i in {1..20}
do
   echo "$((20-i))"
   sleep 1
done

echo "TURNSERVER_ENABLED=1" >> /etc/default/coturn

cat <<EOT >> /etc/turnserver.conf
listening-port=8443
tls-listening-port=5349

fingerprint
lt-cred-mech
realm=javaweb.iptime.org

use-auth-secret
static-auth-secret=098098
total-quota=100
bps-capacity=0
stale-nonce
log-file=/var/log/turnserver/turn.log
no-loopback-peers
no-multicast-peers
EOT