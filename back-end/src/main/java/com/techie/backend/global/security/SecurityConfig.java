package com.techie.backend.global.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() { // 비밀번호를 암호화하는 메서드
        return new BCryptPasswordEncoder();
    }
    //BCrypt란?
        // hash 함수를 사용하여 입력된 비밀번호를 해시로 변환, 이 값은 복원을 할 수 없다.
        // 즉 안전하게 비밀번호를 저장할 수 있다.

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.
                csrf((auth)-> auth.disable()) // csrf disable
                .formLogin((auth)-> auth.disable()) // from 로그인 disable (JWT 토큰을 사용하기 위해)
                .httpBasic((auth)-> auth.disable()); // httpBasic disable (응답타입이 htmp이 나오면 안된댜.)
        http
                .authorizeHttpRequests((auth)-> auth // 인가 작업
                .requestMatchers("/login", "/", "join").permitAll() // .permitAll은 접근 권한이 없음을 의미
                .requestMatchers("/admin").hasRole("ADMIN") // ADMIN 등급만 접근 가능
                .anyRequest().authenticated()); // 그 외 나머지는 로그인한 회원만 접근할 수 있다.
        http
                .sessionManagement((session)-> session // 세션 설정
                        // jwt 방식의 가장 중요한 것은 세션을 stateless 상태로 관리하는 것이다.
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }



    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.addAllowedOriginPattern("http://localhost:3000");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return new CorsFilter(source);
    }



//                                    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/swagger-resources/**", "/webjars/**").permitAll()
//                                .requestMatchers("/static/**").permitAll()
//                                .requestMatchers("/log.png").permitAll()
//                                .requestMatchers("/").permitAll()
//                                .requestMatchers("/api/users/**").permitAll()
//                                .requestMatchers("/api/gpt/**").permitAll()
//                                .requestMatchers("/api/videos/**").permitAll()
//                                .requestMatchers("/api/users/me/**").authenticated()
}