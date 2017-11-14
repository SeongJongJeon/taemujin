package com.taemujin.web.top.websocket;

import com.taemujin.web.top.websocket.interceptor.HttpSessionInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptorAdapter;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {
    @Value("${rabbitmq.host}")
    private String rabbitmqHost;
    @Value("${rabbitmq.port}")
    private int rabbitmqPort;
    @Value("${rabbitmq.user}")
    private String rabbitmqUser;
    @Value("${rabbitmq.pwd}")
    private String rabbitmqPwd;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        //in-memory 메시지 브로커(클라이언트로 메시지를 전송하기 위한 접두어 - topic)
        //registry.enableSimpleBroker("/topic", "/queue");
        //queue : 대기열에 등록된 사용자중 한명의 사용자에게만 전달, topic : topic에 가입된 모든 사용자에게 메시지 전달
        registry.enableStompBrokerRelay("/queue", "/topic")
                .setRelayHost(rabbitmqHost)
                .setRelayPort(rabbitmqPort)
                .setSystemLogin(rabbitmqUser)
                .setSystemPasscode(rabbitmqPwd)
                .setClientLogin(rabbitmqUser)
                .setClientPasscode(rabbitmqPwd);
        //목적지가 /app으로 시작하는 메시지는 @MessageMapping 어노테이션이 붙은 메소드로 라우팅되며, 브로커의 큐나 토픽으로 전달되지 않음 (클라이언트가 서버로 메시지를 전송한 경우)
        registry.setApplicationDestinationPrefixes("/message");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //Stomp 지원
        //접두어가 app일때 매핑된다
        //SockJS의 fallback option을 가능하게 함. (Websocket을 사용못하는 브라우져에서는 적절하게 처리)
        //interceptor의 경우는 쿠키 값을 읽어서 로그인 사용자 정보를 얻기 위함
        registry.addEndpoint("/chat").setAllowedOrigins("*").withSockJS().setInterceptors(httpSessionInterceptor());
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(81920);
        container.setMaxBinaryMessageBufferSize(81920);
        container.setMaxSessionIdleTimeout(6 * 10000 * 60);
        return container;
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptorAdapter() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
//                User user = (User) accessor.getSessionAttributes().get("user");
                if (accessor.getCommand() != null) {
                    switch (accessor.getCommand()) {
                        case CONNECT:   //사용자 접속시
//                            template.convertAndSend("/topic/userList", "abcccc");
//                            log.info(String.format("CONNECT - %s", user.toString()));
                            break;
                        case DISCONNECT:   //사용자 연결해제
//                            template.convertAndSend("/topic/userList", "abcccc");
//                            log.info(String.format("DISCONNECT - %s", user.toString()));
                            break;
                        case SUBSCRIBE:  //구독 설정시
                            break;
                        case UNSUBSCRIBE:  //구독 해제시
                            break;
                        case SEND:  //메시지 전송시
                            break;
                    }
                } else {
//                    log.info(defaultLog + ", " + accessor.getHeader("simpMessageType").toString());
                }

                return message;
            }
        });
    }

    @Bean
    public HttpSessionInterceptor httpSessionInterceptor() {
        return new HttpSessionInterceptor();
    }
}
