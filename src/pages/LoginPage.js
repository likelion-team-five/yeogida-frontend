import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const logoIllustrationPath = '/input_file_0.png'; // 이미지 파일 경로

// 카카오 SDK 초기화 함수는 실제 카카오 SDK 호출을 하지 않으므로 간략화
const initKakao = () => {
  console.log('카카오 SDK 초기화 시뮬레이션');
  // 실제 앱에서는 window.Kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);
};

function LoginPage({ onLoginSuccess, loginMessage }) {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false); // 로그인 시도 중 상태 (버튼 비활성화용)

  useEffect(() => {
    initKakao(); // 컴포넌트 마운트 시 초기화 시뮬레이션
    if (loginMessage) {
      // alert(loginMessage); 
    }
  }, [loginMessage]);

  const handleKakaoLogin = () => {
    setIsLoggingIn(true);

    console.log('카카오 로그인 시도 시뮬레이션...');
    setTimeout(() => {
      const mockUserData = { id: 'user123', nickname: '여행러', token: 'fakeServiceToken12345' };
      if (onLoginSuccess) {
        onLoginSuccess(mockUserData);
      }
      setIsLoggingIn(false);
      navigate('/', { replace: true });
    }, 1500);
  };

  return (
    // 최상위 div에 flex 속성으로 중앙 정렬
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      {/* 서비스 로고/일러스트 (이미지 사용) */}
      <div className="mb-10 text-center">
        <img
          src={logoIllustrationPath} // 로고 이미지 파일 경로
          alt="여.기다 로고 및 일러스트"
          className="w-48 sm:w-64 mx-auto" // 이미지 너비 조정 및 중앙 정렬
        />
      </div>

      {/* 카카오 로그인 버튼 */}
      <button
        onClick={handleKakaoLogin}
        disabled={isLoggingIn}
        className={`w-full max-w-xs h-14 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm transition-all duration-300
                   ${isLoggingIn ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-gray-400'}`}
      >
        {/* 카카오톡 아이콘 (이미지 사용) */}
        <div className="w-8 h-8 rounded-full bg-[#FEE500] mr-3 flex items-center justify-center flex-shrink-0">
          <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png" alt="카카오톡 아이콘" className="w-5 h-5"/>
        </div>
        <span className="text-base font-medium text-gray-700">카카오톡으로 로그인하기</span>
      </button>

      {/* 로그인 시도 중 메시지 */}
      {isLoggingIn && (
        <div className="mt-6 text-sm text-blue-600 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          로그인 진행 중...
        </div>
      )}

      {/* 로그인 필요 메시지 */}
      {loginMessage && !isLoggingIn && (
        <p className="mt-4 text-sm text-red-500 max-w-xs text-center">{loginMessage}</p>
      )}

      {/* 개인 정보 보호 정책 문구 */}
      <p className="text-xs text-gray-400 mt-8 max-w-xs text-center">
        로그인은 개인 정보 보호 정책 및 서비스 이용 약관에 동의하는 것을 의미하며,
        서비스 이용을 위해 최소한의 개인 정보가 수집될 수 있습니다.
      </p>
    </div>
  );
}

export default LoginPage;