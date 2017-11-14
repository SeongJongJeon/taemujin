package com.taemujin.web.common.exceptionresolver;

import com.taemujin.core.utils.JsonUtil;
import com.taemujin.web.common.utils.HttpServletUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class DefaultExceptionResolver {
    //예외 발생시 공통 응답상태 코드
    public final int COMMON_STATUS = HttpStatus.INTERNAL_SERVER_ERROR.value();
    //log에 stacktrace를 남길 것인지 여부
    public final boolean IS_PRINT_STACK = true;
    //log에 파라미터를 남길 것인지 여부
    public final boolean IS_PRINT_PARAMS = true;

    //log 작성시 파라미터 포맷
    public final String LOG_PARAM_FORMAT = ", [QueryString:%s], [RequestBody:%s]";
    //log 작성시 StackTrace 포맷
    public final String LOG_STACK_FORMAT = ", [StackTrace:%s]";
    //log 작성시 전체포맷 LOG_PARAM_FORMAT 및 LOG_STACK_FORMAT 맨 마지막에 append
    public final String LOG_FORMAT = "[ClientIP:%s], [Referrer:%s], [RequestURL:%s], [Message:%s], [Action:%s]%s%s";

    /**
     * 예외 발생시 로그를 찍는다.
     *
     * @param req
     * @param ex
     * @param stackSize 스택의 몇번째까지 추출할지
     * @return
     */
    public String makeLog(HttpServletRequest req, Exception ex, int stackSize) {
        String params;
        String stack;

        stackSize = stackSize == 0 ? 5 : stackSize;

        //파라미터 작성
        if (IS_PRINT_PARAMS) {
            String queryString = "";
            if (!StringUtils.isEmpty(req.getQueryString())) {
                queryString = req.getQueryString();
            }

            params = String.format(LOG_PARAM_FORMAT, queryString, "");
        }

        if (IS_PRINT_STACK) {
            String[] rootCauseStackTrace = ExceptionUtils.getRootCauseStackTrace(ex);
            String tempTrace = "";
            if (rootCauseStackTrace != null) {
                stackSize = rootCauseStackTrace.length >= stackSize ? stackSize : rootCauseStackTrace.length;
                for (int i = 0; i < stackSize; i++) {
                    tempTrace += rootCauseStackTrace[i];
                }
            }

            stack = String.format(LOG_STACK_FORMAT, tempTrace);
        }

        String logs = String.format(LOG_FORMAT, HttpServletUtil.getClientIp(req), req.getHeader("referer"), req.getRequestURL(), ex.getMessage(), req.getMethod().toUpperCase(), params, stack);
        return logs;
    }

    /**
     * Ajax 요청인지 페이지 요청인지를 구분하여 Json또는 에러 페이지를 호출한다
     *
     * @param modelViewDto
     * @return
     */
    public ModelAndView generateModelAndView(ModelViewDto modelViewDto) {
        ModelAndView mav = new ModelAndView();

        //정의된 예외클래스의 코드값 및 메시지 추출
        int responseCode = COMMON_STATUS;
        String exMsg = "Unknown exception";
        try {
            Field f = modelViewDto.getEx().getClass().getDeclaredField("code");
            f.setAccessible(true);
            responseCode = (int) f.get(modelViewDto.getEx());
            exMsg = modelViewDto.getEx().getMessage();
        } catch (Exception e1) {
        }
        modelViewDto.getRes().setStatus(responseCode);

        //Json 타입으로 응답을 받고자 하는경우 (AJAX 요청인 경우)
        String acceptHeader = modelViewDto.getReq().getHeader("Accept");
        if (!StringUtils.isEmpty(acceptHeader) && acceptHeader.contains(MediaType.APPLICATION_JSON_VALUE)) {
            Map<String, Object> result = new HashMap<>();
            result.put("code", responseCode);
            result.put("message", exMsg);

            mav.addObject("jsonError", JsonUtil.generateClassToJson(result));
            mav.setViewName(modelViewDto.getJsonViewName());
        } else {    //alert 메시지 노출 후 home으로 리다이렉트
            mav.addObject("jsonError", exMsg);
            mav.addObject("errorCode", responseCode);
            mav.addObject("resourcePath", modelViewDto.getResourcePath());
            mav.setViewName(modelViewDto.getPageViewName());
        }
        return mav;
    }
}