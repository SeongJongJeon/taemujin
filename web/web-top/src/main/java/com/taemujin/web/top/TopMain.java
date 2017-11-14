package com.taemujin.web.top;

import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.connector.Connector;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.SecurityAutoConfiguration;
import org.springframework.boot.context.embedded.EmbeddedServletContainerFactory;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;

import java.util.TimeZone;

@Slf4j
@EnableCaching(proxyTargetClass = true)
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
@ComponentScan({"com.taemujin"})
@PropertySource(value = {"classpath:core.properties", "classpath:top.properties"})
public class TopMain {
    @Profile({"local"})
    @Bean
    public EmbeddedServletContainerFactory servletContainer() {
        TomcatEmbeddedServletContainerFactory tomcat = new TomcatEmbeddedServletContainerFactory();
        tomcat.addAdditionalTomcatConnectors(createStandardConnector());
        return tomcat;
    }

    private Connector createStandardConnector() {
        Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
        connector.setPort(8080);
        return connector;
    }

    public static void main(String[] args) {
        //EC2서버의 타임존이 UTC 이므로
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
        System.setProperty("jsse.enableSNIExtension", "false");
        SpringApplication.run(TopMain.class, args);
        log.info("Start Top");
    }
}
