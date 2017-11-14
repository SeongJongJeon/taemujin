package com.taemujin.core.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by admin on 2017. 4. 14..
 */
public class TagStripUtil {
    /**
     * script 및 style 태그를 제거한다
     *
     * @param content
     * @return
     */
    public static String stripTag(String content) {
        String[] scriptRegex = new String[]{"<(/)?[ ]*script[^>]*>", "<(/)?[ ]*style[^>]*>"};
        for (String script : scriptRegex) {
            Pattern pattern2 = Pattern.compile(script);
            if (content != null) {
                Matcher matcher2 = pattern2.matcher(content);
                StringBuffer str = new StringBuffer(content.length());
                while (matcher2.find()) {
                    matcher2.appendReplacement(str, Matcher.quoteReplacement(" "));
                }
                matcher2.appendTail(str);
                content = str.toString();
            }
        }

        return content;
    }
}
