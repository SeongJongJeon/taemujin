FROM java:8

CMD mdkir -p /data/logs
CMD mdkir -p /data/logs/log
CMD chmod 777 /data/logs/log
CMD mkdir /data/web

VOLUME /data

COPY app.jar /data/web/app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/data/web/app.jar"]
CMD [""]