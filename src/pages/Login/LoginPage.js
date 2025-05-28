import React, { useEffect } from 'react';
import logo from '../../pages/images/logo1.svg';

const LoginPage = () => {
  const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;

    window.location.href = 'https://meaningful-barbette-moda-backend-69ee5792.koyeb.app/api/v1/auth/login/kakao/';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <img src={logo} alt="로고" className="w-48 sm:w-64 mb-8" />
      <button
        onClick={handleKakaoLogin}
        className="w-full max-w-xs h-14 bg-[#FEE500] text-black rounded-full flex items-center justify-center shadow-md hover:brightness-110 transition-all"
      >
        <img
          src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
          alt="카카오톡"
          className="w-6 h-6 mr-2"
        />
        <span className="font-semibold">카카오로 로그인</span>
      </button>
    </div>
  );
};

export default LoginPage;