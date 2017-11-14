package com.taemujin.model.dao;

import com.taemujin.model.domain.User;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDao {
    List<User> selectUserList();
}
