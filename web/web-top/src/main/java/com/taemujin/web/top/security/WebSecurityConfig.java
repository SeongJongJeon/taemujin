package com.taemujin.web.top.security;

import com.taemujin.web.top.security.filter.AuthFilter;
import com.taemujin.web.top.security.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

/**
 * 9.2.2 The UserDetailsService 여기부터 보기
 */
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private AuthFilterDependencyManager authFilterDependencyManager;
    @Autowired
    private AuthService authService;

    @Override
    public void configure(WebSecurity web) throws Exception {
        //인증이 필요없는 리소스의 경우 지정
        web.ignoring()
                .antMatchers(
                        "/",
                        "/user/register",
                        "/user/login",
                        "/favicon.ico",
                        "/business/**",
                        "/thirdparty/**");
    }

    protected void configure(HttpSecurity http) throws Exception {
        //WebSecurity 에서 ignoring으로 처리하면 csrf 값을 클라이언트로 넘겨주질 않음, 하지만 filter가 적용되어 있어서 ignore로 처리해야 함.
        http.authorizeRequests()
                //hasRole 인경우 ROLE_GENERAL 과 같이 해야 함.
                .antMatchers("/chat/**").access("hasAuthority('GENERAL') or hasAuthority('ADMIN')")
                //나머지 URL은 모두 인증이 되어야 접근가능
                .antMatchers("/**").authenticated()
                .and()
                .addFilterBefore(new AuthFilter(authFilterDependencyManager), BasicAuthenticationFilter.class)
                .authenticationProvider(authService)
                .exceptionHandling().accessDeniedPage(authFilterDependencyManager.ACCESS_DENIED_PAGE)
                //cookie 기반으로 로그인 처리를 할 것이므로 STATELESS 설정
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                //session 기반이 아닌 겨우 아래와 같이 custom csrf 필터를 셋팅
                .and()
                .csrf().disable()/*.addFilterBefore(new StatelessCSRFFilter(), CsrfFilter.class)*/;
    }
}
