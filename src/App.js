import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

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
import LoginPage from './pages/LoginPage';
import LeftSidebar from './components/common/LeftSidebar';


// MainAppContent 컴포넌트: 로그인된 사용자를 위한 실제 앱 콘텐츠
function MainAppContent({ currentUser, onLogout }) { // onLogout prop을 받음
  const location = useLocation(); // 필요 없으므로 제거해도 됨

  // 이중 방어: 로그인되지 않은 상태에서 실수로 MainAppContent가 렌더링되면 로그인 페이지로 리다이렉트
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ message: "로그인이 필요한 서비스입니다." }} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <LeftSidebar currentUser={currentUser} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage currentUser={currentUser} />} />
          {/* MyPage에 onLogout prop을 전달 */}
          <Route path="/mypage" element={<MyPage currentUser={currentUser} onLogout={onLogout} />} />
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

          {/* 로그인 후 /login 경로로 직접 접근 시 홈으로 리다이렉트 */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          {/* 정의되지 않은 모든 경로 접근 시 홈으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// App 컴포넌트: 최상위 라우터 설정 및 로그인 상태에 따른 렌더링 (이전과 동일)
function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user data", e);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    console.log('로그인 성공:', userData);
    setCurrentUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => { // 이 handleLogout 함수를 MyPage로 전달
    console.log('로그아웃 처리');
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    if (window.Kakao && window.Kakao.Auth && window.Kakao.Auth.getAccessToken()) {
      window.Kakao.Auth.logout(() => {
        console.log('카카오 세션 로그아웃 성공');
      });
    }
    window.location.href = '/login'; // 로그아웃 후 로그인 페이지로 이동
  };


  return (
    <Router>
      {currentUser ? (
        <MainAppContent currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/login" replace state={{ message: "로그인이 필요한 서비스입니다." }} />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;