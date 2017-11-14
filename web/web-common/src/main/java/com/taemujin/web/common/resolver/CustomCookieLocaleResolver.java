package com.taemujin.web.common.resolver;

import org.springframework.web.servlet.i18n.CookieLocaleResolver;

import javax.servlet.http.HttpServletRequest;
import java.util.Locale;

/**
 * Created by soul on 2016. 8. 26..
 *
 * @version 1.0
 * @since 1.0
 */
public class CustomCookieLocaleResolver extends CookieLocaleResolver {
	@Override
	protected Locale determineDefaultLocale(HttpServletRequest req) {
		String acceptLanguage = req.getHeader("Accept-Language");
		if (acceptLanguage == null || acceptLanguage.trim().isEmpty()) {
			return super.determineDefaultLocale(req);
		}
		return req.getLocale();
	}
}
