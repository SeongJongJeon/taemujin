package com.taemujin.web.top.websocket.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ChatReqDto {
    private String type;

    private long userId;
    private String userName;
    private String message;

    private Date createdDate;
}
