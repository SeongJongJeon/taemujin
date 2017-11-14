package com.taemujin.web.top.websocket.dto;

import lombok.Data;

@Data
public class ChatSdpDto {
    private SdpType type;

    private long callerUserId;
    private long calleeUserId;

    //session description protocol
    private Object sdp;
    private Object candidate;

    public enum SdpType {
        offer,   //caller가 callee 호출 (caller의 SDP 정보 전달)
        answer,  //callee가 caller에게 응답 (callee의 SDP 정보 전달)
        iceToCallee,
        iceToCaller,
    }
}
