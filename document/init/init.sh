#!/bin/bash

# shell script path
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
echo "$SCRIPTPATH"

docker build -t rabbitmq-stomp -f RabbitMqDockerfile .

docker rm -f mysql_taemujin
docker rm -f rabbitMQ

# Execute RabbitMQ Container
docker run -d --hostname my-rabbit --name rabbitMQ \
--restart=always \
-p 9900:15672 -p 61613:61613 \
-e RABBITMQ_DEFAULT_USER=soul -e RABBITMQ_DEFAULT_PASS=098098 \
rabbitmq-stomp

# Execute MySQL
docker run -d --name mysql_taemujin \
--restart=always \
-p 3309:3306 \
-v "${SCRIPTPATH}/my.cnf":/etc/my.cnf \
-v /etc/localtime:/etc/localtime:ro \
-e MYSQL_ROOT_PASSWORD=098098 \
mysql/mysql-server:5.7.20 --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci

# Wait until start mysql instance
MAX_SECONDS=85
for (( c=1; c<=$MAX_SECONDS; c++ ))
do
   echo "$((MAX_SECONDS-c))"
   sleep 1
done

# Settings mysql env
docker exec -ti mysql_taemujin 'mysql' -uroot -p098098 -vvv -e'GRANT ALL PRIVILEGES ON *.* TO "root"@"%" IDENTIFIED BY "098098"'
docker exec -ti mysql_taemujin 'mysql' -uroot -p098098 -vvv -e"UPDATE mysql.user SET Grant_priv='Y', Super_priv='Y' WHERE User='root'"
docker exec -ti mysql_taemujin 'mysql' -uroot -p098098 -vvv -e"SET GLOBAL innodb_file_format = barracuda"
docker exec -ti mysql_taemujin 'mysql' -uroot -p098098 -vvv -e"SET GLOBAL innodb_file_format_max = barracuda"
docker exec -ti mysql_taemujin 'mysql' -uroot -p098098 -vvv -e"SET GLOBAL innodb_large_prefix = 'ON'"
docker exec -ti mysql_taemujin 'mysql' -uroot -p098098 -vvv -e"create user 'soul'@'%' identified by '098098'"
docker exec -ti mysql_taemujin 'mysql' -uroot -p098098 -vvv -e"grant all privileges on *.* to 'soul'@'%'"
docker exec -ti mysql_taemujin 'mysql' -uroot -p098098 -vvv -e"CREATE SCHEMA IF NOT EXISTS taemujin DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"