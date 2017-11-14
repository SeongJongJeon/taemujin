package com.taemujin.model.security;

import com.taemujin.model.domain.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Arrays;
import java.util.Collection;

@Data
@EqualsAndHashCode(callSuper=false)
public class AuthUser extends AbstractAuthenticationToken {
    private User user;

    public AuthUser() {
        super(Arrays.asList());
    }

    public AuthUser(User user, Collection<SimpleGrantedAuthority> authorities) {
        super(authorities);
        this.user = user;
    }

    @Override
    public Object getCredentials() {
        return user.getPassword();
    }

    @Override
    public Object getPrincipal() {
        return user;
    }
}
