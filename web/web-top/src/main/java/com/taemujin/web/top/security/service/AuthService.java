package com.taemujin.web.top.security.service;

import com.taemujin.model.domain.User;
import com.taemujin.model.repository.UserRepository;
import com.taemujin.model.security.AuthUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Transactional
@Service
public class AuthService implements AuthenticationProvider {
    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public User findUser(long userId) {
        return userRepository.findOne(userId);
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        return authentication;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return AuthUser.class.isAssignableFrom(authentication);
    }
}
