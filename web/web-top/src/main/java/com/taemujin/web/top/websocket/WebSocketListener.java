package com.taemujin.web.top.websocket;

import com.taemujin.model.domain.ChatRoom;
import com.taemujin.model.dto.UserInfo;
import com.taemujin.model.security.AuthUser;
import com.taemujin.model.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

/**
 * Session 이벤트 발생을 리스닝하기 위한 클래스
 */
@Service
public class WebSocketListener {
    @Autowired
    private SimpMessagingTemplate template;
    @Autowired
    private UserService userService;

    /**
     * Session 연결 (모바일 사파리에서는 화면 리프레쉬시 enter가 먼저 들어오고 exit가 나중에 들어옴)
     *
     * @param event
     */
    @EventListener
    public void handleConnectedEvent(SessionConnectedEvent event) {
        UserInfo chatUser = new UserInfo(((AuthUser) event.getUser()).getUser());

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setUserId(chatUser.getUserId());
        chatRoom.setUserName(chatUser.getUserName());
        chatRoom.setUserType(chatUser.getUserType());

//        System.out.println(String.format("enter - %s, %s", chatUser.getUserName(), event));
        template.convertAndSend("/topic/enterUser", userService.enterRoom(chatRoom));
    }

    /**
     * Session 연결 종료
     *
     * @param event
     */
    @EventListener
    public void handleDisconnectEvent(SessionDisconnectEvent event) {
        UserInfo chatUser = new UserInfo(((AuthUser) event.getUser()).getUser());
        userService.exitRoom(chatUser.getUserId());
//        System.out.println(String.format("exit - %s, %s", chatUser.getUserName(), event.toString()));
        template.convertAndSend("/topic/exitUser", chatUser);
    }

    /**
     * 구독 설정이 된경우
     *
     * @param event
     */
    @EventListener
    public void handleSubscribeEvent(SessionSubscribeEvent event) {
        /*String dest = (String) event.getMessage().getHeaders().get("simpDestination");
        if (!StringUtils.isEmpty(dest) && "/topic/enterUser".equals(dest)) {
            ChatUser chatUser = new ChatUser(((AuthUser) event.getUser()).getUser());
            template.convertAndSend("/topic/enterUser", chatUser);
        }*/
    }

    /**
     * 구독 해제된 된경우
     *
     * @param event
     */
    @EventListener
    public void handleUnsubscribeEvent(SessionUnsubscribeEvent event) {
//        template.convertAndSendToUser(event.getUser().getName(), "/queue/notify", "GREETINGS");
    }
}