package com.taemujin.model.service;

import com.taemujin.core.enumtype.DefaultEnum;
import com.taemujin.core.utils.CryptUtil;
import com.taemujin.model.domain.ChatRoom;
import com.taemujin.model.domain.User;
import com.taemujin.model.dto.JsonResult;
import com.taemujin.model.repository.ChatRoomRepository;
import com.taemujin.model.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Transactional
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChatRoomRepository chatRoomRepository;

    public JsonResult register(String username, String password) {
        User user = userRepository.findByName(username);
        if (user != null) {
            return new JsonResult();
        }
        user = new User();
        user.setName(username);
        user.setPassword(CryptUtil.generatePasswordWithSha256(password));
        user.setUserType(DefaultEnum.UserType.GENERAL);

        userRepository.save(user);

        return new JsonResult();
    }

    public JsonResult login(User user) {
        JsonResult result = new JsonResult();

        user = userRepository.findByNameAndPassword(user.getName(), CryptUtil.generatePasswordWithSha256(user.getPassword()));
        if (user == null) {
            result.setCode(500);
            return result;
        }

        result.setMessage(CryptUtil.generateUserIdToCookie(user.getId()));
        return result;
    }

    public List<ChatRoom> enterRoom(ChatRoom chatRoom) {
        ChatRoom tempChatRoom = chatRoomRepository.findOne(chatRoom.getUserId());
        if (tempChatRoom == null) {
            chatRoomRepository.save(chatRoom);
        }
        List<ChatRoom> roomList = chatRoomRepository.findAllByOrderByCreatedDateAsc();
        return roomList;
    }

    public void exitRoom(long userId) {
        ChatRoom chatRoom = chatRoomRepository.findOne(userId);
        if (chatRoom != null) {
            chatRoomRepository.delete(chatRoom);
        }
    }
}
