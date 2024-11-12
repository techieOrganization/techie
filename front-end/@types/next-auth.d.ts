// import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    token: string; // 사용자 토큰 추가
    // 다른 속성도 필요에 따라 추가할 수 있습니다.
  }

  interface Session {
    user: User; // 세션에 사용자 정의 User 타입 사용
  }
}
