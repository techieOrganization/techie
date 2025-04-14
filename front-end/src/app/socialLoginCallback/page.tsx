'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { decodeJWT } from '@/components/authservice/AuthLogin';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '@/redux/reducer';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Socialcallback = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const token = searchParams.get('access_token');
    console.log(token);
    if (token) {
      const decodedJWT = decodeJWT(token);
      dispatch(setUserInfo(decodedJWT));
      window.dispatchEvent(new Event('loginStatusChanged'));
      router.push('/');
      Cookies.set('token', token);
    } else {
      console.error();
    }
  }, [dispatch, searchParams, router]);
  return <div>로그인 중...</div>;
};
export default Socialcallback;
