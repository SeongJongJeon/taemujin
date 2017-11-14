package com.taemujin.web.top.exceptionresolver;

import com.taemujin.web.common.exceptionresolver.DefaultExceptionResolver;
import com.taemujin.web.common.exceptionresolver.ModelViewDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@ControllerAdvice
public class CommonExceptionResolver extends DefaultExceptionResolver {
    private final String NOTIFICATION_TITLE = "예외 발생";
    @Value("${env}")
    private String env;

    @ExceptionHandler({
            Exception.class,
    })
    public ModelAndView defaultExceptionHandler(HttpServletRequest req, HttpServletResponse res, Exception ex) {
        String logMsg = makeLog(req, ex, 20);

        log.error(logMsg);

        ModelViewDto modelViewDto = new ModelViewDto(req, res, ex, null, null, null);
        return generateModelAndView(modelViewDto);
    }
}
