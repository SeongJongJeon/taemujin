package com.taemujin.model.dao;

import com.taemujin.model.TestParent;
import com.taemujin.model.domain.User;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class TestUserDao extends TestParent {
    @Autowired
    private UserDao userDao;

    @Test
    public void selectAll() {
        List<User> users = userDao.selectUserList();
        for (User user : users) {
            System.out.println("### : " + user);
        }
    }
}
