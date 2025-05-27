// KakaoRedirectPage.js
import React, { useEffect, useState, useRef } from 'react'; // useRef 추가
import { useLocation, useNavigate } from 'react-router-dom';
import axiosinstance from '../../auth/axiosinstance';
import { setCookie } from '../../auth/cookie';

function KakaoRedirectPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const codeSentRef = useRef(false); // ★★★ 인가 코드를 이미 보냈는지 추적하는 ref ★★★

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const kakaoCode = searchParams.get('code');

    console.log('[KakaoRedirectPage Effect]', 'Code:', kakaoCode, 'isProcessing:', isProcessing, 'codeSent:', codeSentRef.current);

    if (kakaoCode && !isProcessing && !codeSentRef.current) { // ★★★ codeSentRef.current 조건 추가 ★★★
      setIsProcessing(true);
      codeSentRef.current = true; // ★★★ 코드 보냈다고 표시 ★★★

      const loginWithKakao = async () => {
        try {
          console.log('[KakaoRedirectPage] 백엔드로 인가 코드 전송 시도:', kakaoCode);
          const res = await axiosinstance.post('/api/v1/auth/kakao/login/process', { code: kakaoCode });
          // ... (이하 성공 로직 동일)
          const { access, refresh } = res.data;
          setCookie('accessToken', access);
          setCookie('refreshToken', refresh);
          console.log('[KakaoRedirectPage] 로그인 성공');
          navigate('/', { replace: true });
        } catch (err) {
          // ... (이하 실패 로직 동일)
          const errorMessage = err.response?.data?.detail || '로그인 처리 중 오류가 발생했습니다.';
          console.error('[KakaoRedirectPage] 로그인 실패:', errorMessage, err);
          alert(errorMessage);
          navigate('/login', { replace: true });
        }
        // 이 시점에서는 isProcessing을 false로 바꿔도 되지만, 페이지 이동하므로 큰 의미는 없음
        // setIsProcessing(false);
      };
      loginWithKakao();
    } else if (!kakaoCode && !isProcessing) {
      console.error('[KakaoRedirectPage] URL에 카카오 인가 코드 없음. 로그인 페이지로 이동.');
      navigate('/login', { replace: true });
    } else if (kakaoCode && codeSentRef.current) {
      console.warn('[KakaoRedirectPage] 인가 코드가 이미 처리되었습니다. 중복 요청 방지됨.');
    }
  }, [location.search, navigate, isProcessing]); // isProcessing은 사실상 초기 제어용

  return <div>로그인 처리 중입니다...</div>;
}
export default KakaoRedirectPage;