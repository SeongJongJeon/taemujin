package com.taemujin.core.utils;

import org.fusesource.jansi.AnsiConsole;

/**
 * Jansi를 사용하는 경우 글자의 color 값을 가지고 있는 클래스이다.
 *
 * @author SeongJong Jeon
 * @version 1.0
 * @since 1.0
 */
public class AnsiColorUtil {
    public static final String BLACK = "\u001B[30m";
    public static final String RED = "\u001B[31m";
    public static final String GREEN = "\u001B[32m";
    public static final String YELLOW = "\u001B[33m";
    public static final String BLUE = "\u001B[34m";
    public static final String PINK = "\u001B[35m";
    public static final String BLUISH_GREEN = "\u001B[36m";
    public static final String WHITE = "\u001B[37m";
    public static final String NOMAL = "\u001B[0m";

    static {
        AnsiConsole.systemInstall();
    }

    /**
     * 메시지를 콘솔에 보여준다.
     *
     * @param color   글자 색
     * @param message 메시지
     */
    public static void displayMessage(String color, String message) {
        AnsiConsole.out.println(color + message + AnsiColorUtil.NOMAL);
    }
}
