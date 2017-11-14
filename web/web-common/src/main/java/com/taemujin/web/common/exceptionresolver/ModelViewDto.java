package com.taemujin.web.common.exceptionresolver;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Data
@AllArgsConstructor
public class ModelViewDto {
    private HttpServletRequest req;
    private HttpServletResponse res;
    private Exception ex;
    /**
     * 페이지 호출의 경우 Resource(js, css 등등)의 prefix 패스를 넘겨주기 위함
     */
    private String resourcePath;
    /**
     * error/jsonException
     */
    private String jsonViewName;
    /**
     * error/pageException
     */
    private String pageViewName;
}
