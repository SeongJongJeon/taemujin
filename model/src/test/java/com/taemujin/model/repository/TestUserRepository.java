package com.taemujin.model.repository;

import com.taemujin.core.enumtype.DefaultEnum;
import com.taemujin.model.TestParent;
import com.taemujin.model.domain.User;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

public class TestUserRepository extends TestParent {
    @Autowired
    private UserRepository userRepository;

    @Test
    @Rollback(false)
    public void save() {
        User user = new User();
        user.setName("seongjong");
        user.setUserType(DefaultEnum.UserType.GENERAL);
        userRepository.save(user);
    }

    @Test
    @Rollback(false)
    public void modify(){
        User user = userRepository.findOne(1l);
        user.setName("abc4");
    }
}
