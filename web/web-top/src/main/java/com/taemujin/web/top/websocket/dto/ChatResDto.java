package com.taemujin.web.top.websocket.dto;

import lombok.Data;

import java.util.Map;

@Data
public class ChatResDto {
    private String type;
    private String message;
    private Map<Long, ChatUser> joinedUserMap;
}
