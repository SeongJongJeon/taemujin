package com.taemujin.web.top.websocket.interceptor;

import com.taemujin.core.utils.CryptUtil;
import com.taemujin.model.domain.User;
import com.taemujin.web.common.utils.HttpServletUtil;
import com.taemujin.web.top.security.AuthFilterDependencyManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 *
 */
@Slf4j
public class HttpSessionInterceptor implements HandshakeInterceptor {
    @Value("${auth.key}")
    private String authKey;
    @Autowired
    private AuthFilterDependencyManager authFilterDependencyManager;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (!(request instanceof ServletServerHttpRequest)) {
            return false;
        }

        String xAuth = HttpServletUtil.getCookie(((ServletServerHttpRequest) request).getServletRequest(), authKey);
        if (StringUtils.isEmpty(xAuth)) {
            return false;
        }

        long userId = CryptUtil.generateCookieToUserId(xAuth);
        User user = authFilterDependencyManager.getAuthService().findUser(userId);
//        attributes.put("user", user.getName());
//        attributes.put("user-name", user.getName());
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {

    }
}
