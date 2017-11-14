package com.taemujin.web.top.websocket.dto;

import com.taemujin.core.enumtype.DefaultEnum;
import com.taemujin.model.domain.User;
import lombok.Data;

@Data
public class ChatUser {
    private long userId;
    private String userName;
    private DefaultEnum.UserType userType;

    public ChatUser() {

    }

    public ChatUser(User user) {
        userId = user.getId();
        userName = user.getName();
        userType = user.getUserType();
    }
}
