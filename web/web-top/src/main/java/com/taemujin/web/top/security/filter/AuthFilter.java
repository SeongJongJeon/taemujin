package com.taemujin.web.top.security.filter;

import com.taemujin.core.utils.CryptUtil;
import com.taemujin.model.domain.User;
import com.taemujin.model.security.AuthUser;
import com.taemujin.web.common.utils.HttpServletUtil;
import com.taemujin.web.top.security.AuthFilterDependencyManager;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

public class AuthFilter extends OncePerRequestFilter {
    private AuthFilterDependencyManager authFilterDependencyManager;

    public AuthFilter(AuthFilterDependencyManager authFilterDependencyManager) {
        this.authFilterDependencyManager = authFilterDependencyManager;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String xAuth = HttpServletUtil.getCookie(request, authFilterDependencyManager.getAuthKey());
        AuthUser authDto = null;
        if (StringUtils.isEmpty(xAuth)) {   //인증이 필요한 페이지에 접근한 경우 쿠키값이 없을때
            response.sendRedirect(authFilterDependencyManager.ACCESS_DENIED_PAGE);
            return;
        } else {
            //인증처리
            long userId = CryptUtil.generateCookieToUserId(xAuth);
            User user = authFilterDependencyManager.getAuthService().findUser(userId);

            Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority(user.getUserType().toString()));

            authDto = new AuthUser(user, authorities);
        }
        SecurityContextHolder.getContext().setAuthentication(authDto);
        filterChain.doFilter(request, response);
    }
}
