package com.taemujin.web.top.interceptor;

import com.taemujin.core.utils.JsonUtil;
import com.taemujin.model.domain.User;
import com.taemujin.model.dto.UserInfo;
import com.taemujin.model.security.AuthUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class DefaultInterceptor extends HandlerInterceptorAdapter {
    @Value("${env}")
    private String env;
    @Value("${resource.root.path}")
    private String resourceRootPath;
    @Value("${resource.version}")
    private String resourceVersion;

    private String resourcePath;

    @PostConstruct
    public void init() {
        if (StringUtils.isEmpty(resourceRootPath)) {
            resourcePath = "";
        } else {
            resourcePath = String.format("%s/%s/static/%s",
                    resourceRootPath,
                    env,
                    resourceVersion
            );
        }
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) {
        if (modelAndView != null) {
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                request.setAttribute("userInfo", JsonUtil.generateClassToJson(new UserInfo(user)));
            }
            request.setAttribute("resourcePath", resourcePath);
        }
    }
}
