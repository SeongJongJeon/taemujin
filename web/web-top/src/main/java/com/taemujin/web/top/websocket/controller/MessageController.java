package com.taemujin.web.top.websocket.controller;

import com.taemujin.model.domain.User;
import com.taemujin.model.repository.UserRepository;
import com.taemujin.web.top.websocket.dto.ChatReqDto;
import com.taemujin.web.top.websocket.dto.ChatSdpDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Date;

@Controller
public class MessageController {
    @Autowired
    private SimpMessagingTemplate template;
    @Autowired
    private UserRepository userRepository;

    /**
     * Annotation 설명
     * MessageMapping - STOMP client의 send에 대한 target url
     * SendTo - STOMP client의 subscribe에 대한 target url을 지정
     * SubscribeEvent - client에서 subscribe 할 수 있는 url을 지정 (특정 message가 발생하거나 event가 발생했을 때 Client에 값을 전송하는데 사용합니다.)
     *
     * @param headerAccessor
     * @param chatReqDto
     */
    @MessageMapping("/chat/user")
    public void sendMessageToRoom(SimpMessageHeaderAccessor headerAccessor, ChatReqDto chatReqDto) {
        String destination = "/topic/message";
        chatReqDto.setCreatedDate(new Date());
        this.template.convertAndSend(destination, chatReqDto);
    }

    /**
     * Caller와 Callee의 SDP 정보를 교환
     *
     * @param chatSdpDto
     * @param pc
     */
    @MessageMapping(value = "/target/user/exchangeSdp")
    public void exchangeSdp(ChatSdpDto chatSdpDto, Principal pc) {
        String destination = "/queue/exchangeSdp";

        User user = null;
        switch (chatSdpDto.getType()) {
            case offer: //callee에게 응답
                user = userRepository.findOne(chatSdpDto.getCalleeUserId());
                break;
            case answer:    //caller에게 응답
                user = userRepository.findOne(chatSdpDto.getCallerUserId());
                break;
        }
        this.template.convertAndSendToUser(user.toString(), destination, chatSdpDto);
    }

    /**
     * caller와 callee가 ice candidate를 다른 peer로 전달
     *
     * @param chatSdpDto
     * @param pc
     */
    @MessageMapping(value = "/target/user/exchangeIceCandidate")
    public void exchangeIceCandidate(ChatSdpDto chatSdpDto, Principal pc) {
        String destination = "/queue/exchangeIceCandidate";

        User user = null;
        switch (chatSdpDto.getType()) {
            case iceToCallee: //callee에게 응답
                user = userRepository.findOne(chatSdpDto.getCalleeUserId());
                break;
            case iceToCaller:    //caller에게 응답
                user = userRepository.findOne(chatSdpDto.getCallerUserId());
                break;
        }

        this.template.convertAndSendToUser(user.toString(), destination, chatSdpDto);
    }

    @MessageMapping(value = "/target/user/drawing")
    public void viewWebrtc(ChatReqDto chatReqDto, Principal pc) {
        String destination = "/queue/drawing";

        User user = userRepository.findOne(chatReqDto.getUserId());
        this.template.convertAndSendToUser(user.toString(), destination, chatReqDto.getMessage());
    }

    /*@MessageExceptionHandler
    public void handleException(Exception message) {
        System.out.println("$$$$$$$");
        System.out.println(message);
    }*/
}
