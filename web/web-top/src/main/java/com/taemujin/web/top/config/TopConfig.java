package com.taemujin.web.top.config;

import ch.qos.logback.classic.helpers.MDCInsertingServletFilter;
import com.taemujin.web.common.exceptionresolver.FreemarkerExceptionHandler;
import com.taemujin.web.common.resolver.CustomCookieLocaleResolver;
import com.taemujin.web.top.interceptor.DefaultInterceptor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactory;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactoryBean;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;
import org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver;

import java.net.JarURLConnection;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

@Configuration
@ComponentScan("com.taemujin")
@EnableSpringDataWebSupport
public class TopConfig extends WebMvcConfigurerAdapter {
    @Bean
    public DefaultInterceptor defaultInterceptor() {
        return new DefaultInterceptor();
    }

    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(defaultInterceptor());
//        registry.addWebRequestInterceptor(openEntityManagerInViewInterceptor());
    }

    /**
     * Freemarker 설정
     *
     * @return
     * @throws Exception
     */
    @Bean
    public ViewResolver viewResolver() {
        FreeMarkerViewResolver resolver = new FreeMarkerViewResolver();
        resolver.setCache(false);
        resolver.setExposeSpringMacroHelpers(true);
        resolver.setPrefix("/views/ftl/");
        resolver.setSuffix(".ftl");
        resolver.setContentType("text/html; charset=UTF-8");
        return resolver;
    }

    /**
     * Freemarker 에러 발생시 설정
     *
     * @return
     * @throws Exception
     */
    @Bean
    public FreeMarkerConfigurer freemarkerConfig() throws Exception {
        FreeMarkerConfigurationFactory factory = new FreeMarkerConfigurationFactoryBean();
        factory.setTemplateLoaderPaths("classpath:templates", "classpath:/org/springframework/web/servlet/view/freemarker");
        factory.setDefaultEncoding("UTF-8");

        //freemarker 에서 문법 에러나 오류 발생시 핸들링 하기위한 클래스 등록
        freemarker.template.Configuration configuration = factory.createConfiguration();
        configuration.setTemplateExceptionHandler(freemarkerExceptionHandler());

        FreeMarkerConfigurer configurer = new FreeMarkerConfigurer();
        configurer.setConfiguration(configuration);
        return configurer;
    }

    @Bean
    public FreemarkerExceptionHandler freemarkerExceptionHandler() {
        return new FreemarkerExceptionHandler();
    }

    /**
     * i18n 클래스 하위의 properties 파일들을 추출한다
     *
     * @param bundles
     * @param prefix
     * @param splitPath
     * @throws Exception
     */
    private void getMessageBaseNames(Set<String> bundles, String prefix, String splitPath) throws Exception {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("/i18n/**");
        for (Resource resource : resources) {
            if (resource.getFilename().endsWith(".properties")) {

                String filePath = "";
                if (resource.getURL().getProtocol().equals("jar")) {
                    JarURLConnection connection = (JarURLConnection) resource.getURL().openConnection();
                    filePath = connection.getURL().getPath();
                }
                if (resource.getURL().getProtocol().equals("file")) {
                    filePath = resource.getFile().getPath();
                }

                String path = filePath.split(splitPath)[1];
                path = path.replaceAll("\\.properties", "");
                path = path.replaceAll("_[a-zA-Z]{2}$", "");
                bundles.add(prefix + path);
            }
        }
    }

    /**
     * 메시지 소스를 설정
     *
     * @return
     */
    @Bean
    public MessageSource messageSource() throws Exception {
        String prefix = "classpath:i18n";
        String classPathName = "i18n";

        Set<String> bundles = new HashSet<>();
        getMessageBaseNames(bundles, prefix, classPathName);

        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames(bundles.stream().toArray(String[]::new));
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setCacheSeconds(-1);
        messageSource.setFallbackToSystemLocale(false);
        return messageSource;
    }

    /**
     * 파라미터로 lang 이라는 파라미터를 받게되면 해당 locale로 설정한다.
     * ex) en(영어), ko(한국어), zh(중국어)
     *
     * @return
     */
    @Bean
    public LocaleChangeInterceptor localeChangeInterceptor() {
        LocaleChangeInterceptor localeChangeInterceptor = new LocaleChangeInterceptor();
        localeChangeInterceptor.setParamName("lang");
        return localeChangeInterceptor;
    }

    /**
     * Cookie 설정의 language 또는 Accept-Language 헤더(AcceptHeaderLocaleResolver)의 Locale 정보를 읽어서 처리할지 결정한다
     * document.cookie="lang=zh; expires=Thu, 18 Dec 2020 12:00:00 UTC; path=/";
     *
     * @return
     */
    @Bean(name = "localeResolver")
    public LocaleResolver cookieLocaleResolver() {
        CustomCookieLocaleResolver localeResolver = new CustomCookieLocaleResolver();
        localeResolver.setCookieName("lang");
        localeResolver.setCookieMaxAge(-1);
        localeResolver.setDefaultLocale(new Locale("en_US"));
        return localeResolver;
    }

    /**
     * Logback의 [%X{req.xForwardedFor}] [%X{req.remoteHost}] [%X{req.requestURI}] 사용
     *
     * @return
     */
    @Bean
    public FilterRegistrationBean someFilterRegistration() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new MDCInsertingServletFilter());
        registration.addUrlPatterns("/*");
        registration.setName("MDCInsertingServletFilter");
        registration.setOrder(1);
        return registration;
    }
}
