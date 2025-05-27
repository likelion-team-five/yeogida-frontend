import React, { useState, useEffect } from 'react';
import { getCookie, removeCookie } from './auth/cookie';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = () => {
      const userFromCookie = getCookie('currentUser');
      if (userFromCookie) {
        try {
          setCurrentUser(JSON.parse(userFromCookie));
        } catch (error) {
          console.error('Failed to parse user data:', error);
          removeCookie('currentUser');
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  const handleLogout = () => {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('currentUser');
    setCurrentUser(null);
    window.location.href = '/login';
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <div className="flex h-screen bg-gray-100">
        {currentUser && <LeftSidebar currentUser={currentUser} />}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Routes>
            {/* 공개 라우트 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/kakao-redirect" element={<KakaoRedirectPage />} />

            {currentUser ? (
              <>
                {/* 인증된 사용자용 라우트 */}
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
                
                {/* 인증된 사용자의 잘못된 경로 처리 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                {/* 인증되지 않은 사용자는 모든 경로를 로그인으로 리다이렉트 */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;