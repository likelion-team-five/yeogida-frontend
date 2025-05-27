import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosinstance from '../../auth/axiosinstance';
import { setCookie } from '../../auth/cookie';

function KakaoRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    console.log('인가코드:', code);

    const loginWithKakao = async () => {
      if (code) {
        try {
          const res = await axiosinstance.post('/api/v1/auth/kakao/login/process', { code });
          const { accessToken, refreshToken, user } = res.data;

          setCookie('accessToken', accessToken);
          setCookie('refreshToken', refreshToken);
          setCookie('currentUser', JSON.stringify(user));

          navigate('/');
        } catch (err) {
          console.error('카카오 로그인 실패:', err);
          alert('로그인 실패');
          navigate('/login');
        }
      } else {
        alert('인가 코드가 없습니다.');
        navigate('/login');
      }
    };

    loginWithKakao();
  }, [navigate]);

  return <div>로그인 처리 중입니다...</div>;
}


export default KakaoRedirectPage;
