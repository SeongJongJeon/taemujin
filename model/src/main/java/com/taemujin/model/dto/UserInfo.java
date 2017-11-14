package com.taemujin.model.dto;

import com.taemujin.core.enumtype.DefaultEnum;
import com.taemujin.model.domain.User;
import lombok.Data;

@Data
public class UserInfo {
    private long userId;
    private String userName;
    private DefaultEnum.UserType userType;

    public UserInfo() {

    }

    public UserInfo(User user) {
        userId = user.getId();
        userName = user.getName();
        userType = user.getUserType();
    }
}
