import React, { useState, useEffect } from 'react';
import { getCookie, removeCookie, setCookie } from './auth/cookie'; 
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axiosinstance from './auth/axiosinstance';

// 페이지 컴포넌트들 import (경로는 실제 프로젝트에 맞게 수정)
import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import RankingPage from './pages/RankingPage';
import ReviewListPage from './pages/ReviewListPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import ReviewWritePage from './pages/ReviewWritePage';
import CourseRecommendPage from './pages/CourseRecommendPage';
import CourseDetailPage from './pages/CourseDetailPage';
import MyFavoritesPage from './pages/MyFavoritesPage';
import CarpoolListPage from './pages/CarpoolListPage';
import CarpoolDetailPage from './pages/CarpoolDetailPage';
import CarpoolWritePage from './pages/CarpoolWritePage';
import LoginPage from './pages/Login/LoginPage';
import KakaoRedirectPage from './pages/Login/KakaoRedirectPage';
import LeftSidebar from './components/common/LeftSidebar';

// App 내부 로직을 담을 컴포넌트
function MainAppContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[App.js useEffect] 실행, 현재 경로:', location.pathname);
    setIsLoading(true);

    const initializeUser = async () => {
      const accessToken = getCookie('accessToken');
      let userFromCookie = getCookie('currentUser'); // 쿠키에서 값을 가져옴 (타입은 문자열 또는 객체일 수 있음)

      console.log('[App.js useEffect] 쿠키 확인 - accessToken 존재:', !!accessToken, '| userFromCookie 존재:', !!userFromCookie);
      if (userFromCookie) {
        console.log('[App.js useEffect] 쿠키에서 읽은 userFromCookie (타입:', typeof userFromCookie, '):', userFromCookie);
      }

      if (accessToken) {
        let parsedUser = null;
        if (userFromCookie) { // currentUser 쿠키가 있다면
          if (typeof userFromCookie === 'string') {
            try {
              parsedUser = JSON.parse(userFromCookie);
              console.log('[App.js useEffect] 문자열 currentUser 쿠키 파싱 성공:', parsedUser);
            } catch (error) {
              console.error('[App.js useEffect] currentUser 쿠키 파싱 실패 (문자열):', error, '원본:', userFromCookie);
              // 파싱 실패 시 관련 쿠키 모두 제거 및 로그아웃 처리
              removeCookie('accessToken');
              removeCookie('refreshToken');
              removeCookie('currentUser');
              setCurrentUser(null); // 상태도 null로
            }
          } else if (typeof userFromCookie === 'object' && userFromCookie !== null) {
            parsedUser = userFromCookie; // 이미 객체면 그대로 사용
            console.log('[App.js useEffect] 객체 currentUser 쿠키 그대로 사용:', parsedUser);
          } else {
            console.warn('[App.js useEffect] 예상치 못한 타입의 currentUser 쿠키 값. 값:', userFromCookie, '타입:', typeof userFromCookie);
            // 이 경우에도 안전하게 로그아웃 처리
            removeCookie('accessToken');
            removeCookie('refreshToken');
            removeCookie('currentUser');
            setCurrentUser(null);
          }
        }
        
        // parsedUser가 성공적으로 설정되었으면 currentUser 상태 업데이트
        if (parsedUser) {
          setCurrentUser(parsedUser);
        } else if (!userFromCookie) { 
          // accessToken은 있지만 currentUser 쿠키가 없는 경우 (예: 새로고침, 직접 접속)
          // /users/me API를 호출하여 사용자 정보를 가져옴
          console.log('[App.js useEffect] AccessToken은 있으나 currentUser 쿠키 없음. /users/me API 호출 시도.');
          try {
            const response = await axiosinstance.get('/api/v1/users/me'); // 인터셉터가 토큰을 넣어줌
            const userData = response.data;
            setCurrentUser(userData);
            const stringifiedUserData = JSON.stringify(userData); // 쿠키에는 항상 문자열로 저장 권장
            setCookie('currentUser', stringifiedUserData);
            console.log('[App.js useEffect] /users/me API로 사용자 정보 로드 성공:', userData);
            console.log('[App.js useEffect] 쿠키에 저장한 currentUser (문자열):', stringifiedUserData);
          } catch (error) {
            console.error('[App.js useEffect] /users/me API 호출 실패:', error.response ? error.response.data : error.message);
            removeCookie('accessToken');
            removeCookie('refreshToken');
            removeCookie('currentUser');
            setCurrentUser(null);
            if (location.pathname !== '/login' && location.pathname !== '/kakao-redirect') {
              navigate('/login', { replace: true });
            }
          }
        }
      } else {
        // 액세스 토큰이 없으면 명시적으로 로그아웃 상태로 처리
        setCurrentUser(null);
        removeCookie('currentUser');
        removeCookie('refreshToken');
        console.log('[App.js useEffect] AccessToken 없음. 로그아웃 상태.');
        // 로그인 페이지나 카카오 리다이렉트 페이지가 아니면 로그인 페이지로 강제 이동
        if (location.pathname !== '/login' && location.pathname !== '/kakao-redirect') {
            navigate('/login', { replace: true });
        }
      }
      setIsLoading(false); // 사용자 초기화 완료
    };

    initializeUser();
  }, [location.pathname, navigate]); // navigate도 의존성에 추가

  const handleLogout = () => {
    console.log('[App.js handleLogout] 로그아웃 시작');
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('currentUser');
    setCurrentUser(null);
    navigate('/login', { replace: true });
    console.log('[App.js handleLogout] 로그아웃 처리 완료, 로그인 페이지로 이동');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>애플리케이션 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {currentUser && <LeftSidebar currentUser={currentUser} onLogout={handleLogout} />}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Routes>
          <Route
            path="/login"
            element={!currentUser ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route 
            path="/kakao-redirect" 
            element={<KakaoRedirectPage />}
          />

          {currentUser ? (
            <>
              <Route path="/" element={<HomePage currentUser={currentUser} />} />
              <Route path="/mypage" element={<MyPage currentUser={currentUser} onLogout={handleLogout} />} />
              <Route path="/rankings" element={<RankingPage currentUser={currentUser} />} />
              <Route path="/courses" element={<CourseRecommendPage currentUser={currentUser} />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage currentUser={currentUser} />} />
              <Route path="/favorites" element={<MyFavoritesPage currentUser={currentUser} />} />
              <Route path="/reviews" element={<ReviewListPage currentUser={currentUser} />} />
              <Route path="/reviews/write" element={<ReviewWritePage currentUser={currentUser} />} />
              <Route path="/reviews/:reviewId" element={<ReviewDetailPage currentUser={currentUser} />} />
              <Route path="/reviews/:reviewId/edit" element={<ReviewWritePage currentUser={currentUser} />} />
              <Route path="/carpools" element={<CarpoolListPage currentUser={currentUser} />} />
              <Route path="/carpools/write" element={<CarpoolWritePage currentUser={currentUser} />} />
              <Route path="/carpools/:carpoolId" element={<CarpoolDetailPage currentUser={currentUser} />} />
              <Route path="/carpools/:carpoolId/edit" element={<CarpoolWritePage currentUser={currentUser} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
             (location.pathname !== '/login' && location.pathname !== '/kakao-redirect') ?
             <Route path="*" element={<Navigate to="/login" replace />} /> : null
          )}
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <MainAppContent />
    </Router>
  );
}

export default App;