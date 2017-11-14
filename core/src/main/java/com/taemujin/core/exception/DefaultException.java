package com.taemujin.core.exception;

/**
 * Created by alex on 2016. 12. 20..
 */
public class DefaultException extends RuntimeException {
    private static final String MSG = "Unknown exception";
    private int code = 500;

    public DefaultException() {
        super(MSG);
    }

    public DefaultException(String msg) {
        super(msg);
    }

    public DefaultException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public DefaultException(Throwable cause) {
        super(cause);
    }
}
