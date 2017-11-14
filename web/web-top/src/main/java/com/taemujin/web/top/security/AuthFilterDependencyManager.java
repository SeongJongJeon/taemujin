package com.taemujin.web.top.security;

import com.taemujin.web.top.security.service.AuthService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@Component
public class AuthFilterDependencyManager {
    @Value("${auth.key}")
    private String authKey;
    @Autowired
    private AuthService authService;

    public final String ACCESS_DENIED_PAGE = "/?isDenial=Y";
}
