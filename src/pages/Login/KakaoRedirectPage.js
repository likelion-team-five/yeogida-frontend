import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosinstance from '../../auth/axiosinstance'; // axios 인스턴스 경로 확인
import { setCookie, removeCookie, getCookie } from '../../auth/cookie'; // getCookie도 가져옴 (디버깅 및 중복 방지용)

function KakaoRedirectPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const codeProcessedRef = useRef(false); // 이 코드가 이미 처리되었는지 추적

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const kakaoCode = searchParams.get('code');

    console.log('[KakaoRedirectPage Effect]', 'Code:', kakaoCode, 'isProcessing:', isProcessing, 'codeProcessed:', codeProcessedRef.current);

    if (kakaoCode && !isProcessing && !codeProcessedRef.current) {
      setIsProcessing(true);
      codeProcessedRef.current = true; // 이 코드는 이제 처리된 것으로 간주

      const loginWithKakao = async () => {
        try {
          console.log('[KakaoRedirectPage] 백엔드로 인가 코드 전송:', kakaoCode);
          // 1. 백엔드에 인가 코드를 보내 토큰 받기
          const tokenResponse = await axiosinstance.post('/api/v1/auth/kakao/login/process', { code: kakaoCode });
          const { access, refresh } = tokenResponse.data;

          console.log('[KakaoRedirectPage] 토큰 수신 성공:', { access, refresh });

          // 2. 토큰을 먼저 쿠키에 저장 (다음 /users/me 요청 시 axiosinstance 인터셉터가 사용할 수 있도록)
          setCookie('accessToken', access);
          setCookie('refreshToken', refresh);
          console.log('[KakaoRedirectPage] 액세스/리프레시 토큰 쿠키에 저장 완료');

          // 3. 저장된 액세스 토큰(또는 방금 받은 access 변수)으로 /users/me API 호출
          console.log('[KakaoRedirectPage] /users/me API 호출 시도, 토큰:', access);
          const userProfileResponse = await axiosinstance.get('/api/v1/users/me', {
            // 인터셉터가 토큰을 넣어주므로 명시적 헤더 설정은 필수는 아닐 수 있으나,
            // 쿠키 저장 직후 인터셉터가 바로 반영 못할 경우를 대비해 명시적으로 넣어주는 것이 더 안전할 수 있음.
            // 여기서는 인터셉터에 의존. 문제가 계속되면 아래 주석 해제.
            // headers: { 'Authorization': `Bearer ${access}` }
          });
          const userData = userProfileResponse.data;
          console.log('[KakaoRedirectPage] 사용자 정보 수신 성공 (userData 객체):', userData);

          // 4. 사용자 정보를 문자열로 변환하여 쿠키에 저장
          const stringifiedUserData = JSON.stringify(userData);
          console.log('[KakaoRedirectPage] 쿠키에 저장할 currentUser (문자열):', stringifiedUserData);
          setCookie('currentUser', stringifiedUserData);

          console.log('[KakaoRedirectPage] 로그인 성공! 모든 정보 쿠키에 저장 완료.');
          navigate('/', { replace: true }); // 메인 페이지로 이동
        } catch (err) {
          const errorMessage = err.response?.data?.detail || '로그인 처리 중 오류가 발생했습니다.';
          console.error('[KakaoRedirectPage] 로그인 또는 사용자 정보 가져오기 실패:', errorMessage, err.response || err);
          alert(`로그인에 실패했습니다: ${errorMessage}`);
          // 실패 시 관련 쿠키 모두 제거
          removeCookie('accessToken');
          removeCookie('refreshToken');
          removeCookie('currentUser');
          navigate('/login', { replace: true });
        }
      };

      loginWithKakao();
    } else if (!kakaoCode && !isProcessing) {
      console.error('[KakaoRedirectPage] URL에 카카오 인가 코드 없음. 로그인 페이지로 이동.');
      navigate('/login', { replace: true });
    } else if (kakaoCode && codeProcessedRef.current && !isProcessing) {
      console.warn('[KakaoRedirectPage] 인가 코드가 이미 처리되었거나 처리 대기 중. 홈 또는 로그인으로 리다이렉트 시도.');
      if (getCookie('accessToken')) {
        navigate('/', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [location.search, navigate, isProcessing]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div>카카오 로그인 처리 중입니다...</div>
    </div>
  );
}

export default KakaoRedirectPage;