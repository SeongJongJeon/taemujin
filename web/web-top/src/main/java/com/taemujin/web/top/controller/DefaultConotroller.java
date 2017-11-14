package com.taemujin.web.top.controller;

import com.taemujin.core.enumtype.DefaultEnum;
import com.taemujin.model.domain.ChatRoom;
import com.taemujin.model.domain.User;
import com.taemujin.model.dto.JsonResult;
import com.taemujin.model.repository.ChatRoomRepository;
import com.taemujin.model.service.UserService;
import com.taemujin.web.common.utils.HttpServletUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Controller
public class DefaultConotroller {
    @Value("${auth.key}")
    private String authKey;

    @Autowired
    private UserService userService;
    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @RequestMapping(value = "/")
    public String index(HttpServletRequest req, @RequestParam(value = "isDenial", defaultValue = "N") DefaultEnum.YesOrNo isDenial) {
        req.setAttribute("isDenial", isDenial);
        return "index";
    }

    @RequestMapping(value = "/chatRoom")
    public String viewChat() {
        return "chatRoom";
    }

    @RequestMapping(value = "/findAllChatRoomUser")
    @ResponseBody
    public List<ChatRoom> findAllChatRoomUser() {
        return chatRoomRepository.findAll();
    }


    @RequestMapping(value = "/webrtc")
    public String viewWebrtc() {
        return "webrtc";
    }


    @RequestMapping(value = "/user/register")
    @ResponseBody
    public JsonResult register(@RequestParam("userName") String userName, @RequestParam("password") String password) {
        return userService.register(userName, password);
    }

    @RequestMapping(value = "/user/login")
    @ResponseBody
    public JsonResult login(HttpServletRequest req, HttpServletResponse res, User user) {
        JsonResult result = userService.login(user);
        if (result.getCode() == 200) {
            HttpServletUtil.createCookie(req, res, authKey, result.getMessage(), null, null);
            result.setMessage("SUCCESS");
        }

        return result;
    }
}
