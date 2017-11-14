package com.taemujin.core.utils;


import org.apache.commons.text.StringEscapeUtils;

/**
 * Created by admin on 2017. 7. 6..
 */
public class UnicodeUtil {
    /**
     * 가나다라마바사 > \uAC00\uB098\uB2E4\uB77C\uB9C8\uBC14\uC0AC 와 같이 변경한다
     *
     * @param data
     * @return
     */
    public static String escape(String data) {
        return StringEscapeUtils.escapeJava(data);
    }

    /**
     * \uAC00\uB098\uB2E4\uB77C\uB9C8\uBC14\uC0AC > 가나다라마바사 와 같이 변경한다
     *
     * @param data
     * @return
     */
    public static String unescape(String data) {
        return StringEscapeUtils.unescapeJava(data);
    }
}
