package com.taemujin.core.exception.system;


import com.taemujin.core.exception.DefaultException;

/**
 * 권한이 없는 URL에 접근한 경우
 */
public class NotAccessException extends DefaultException {
    private static final String MSG = "Not access";
    private int code = 701;

    public NotAccessException() {
        super(MSG);
    }
}