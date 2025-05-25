// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // React Router import
import LeftSidebar from "./components/common/LeftSidebar"; // 경로 확인

// 페이지 컴포넌트 import
import HomePage from "./pages/HomePage";
import MyPage from "./pages/MyPage";
import RankingPage from "./pages/RankingPage";
import ReviewListPage from "./pages/ReviewListPage";
import ReviewDetailPage from "./pages/ReviewDetailPage";
import ReviewWritePage from "./pages/ReviewWritePage";
import CourseRecommendPage from "./pages/CourseRecommendPage";
import MyFavoritesPage from "./pages/MyFavoritesPage";
import CarpoolListPage from "./pages/CarpoolListPage";
import CarpoolDetailPage from "./pages/CarpoolDetailPage";
import CourseDetailPage from './pages/CourseDetailPage';
import CarpoolWritePage from "./pages/CarpoolWritePage";

function App() {
  return (
    <Router>
      {" "}
      {/* BrowserRouter로 전체를 감쌉니다 */}
      <div className="flex h-screen bg-gray-100">
        <LeftSidebar /> {/* onNavigate, currentPage props 제거 */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <Routes>
            {" "}
            {/* Routes로 Route들을 감쌉니다 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/rankings" element={<RankingPage />} />
            <Route path="/courses" element={<CourseRecommendPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/favorites" element={<MyFavoritesPage />} />
            <Route path="/reviews" element={<ReviewListPage />} />
            <Route path="/reviews/write" element={<ReviewWritePage />} />{" "}
            {/* 새 글 작성 */}
            <Route
              path="/reviews/:reviewId"
              element={<ReviewDetailPage />}
            />{" "}
            {/* 상세 보기, :reviewId는 URL 파라미터 */}
            <Route
              path="/reviews/:reviewId/edit"
              element={<ReviewWritePage />}
            />{" "}
            {/* 글 수정 */}
            <Route path="/carpools" element={<CarpoolListPage />} />
            <Route path="/carpools/write" element={<CarpoolWritePage />} />
            <Route
              path="/carpools/:carpoolId"
              element={<CarpoolDetailPage />}
            />
            <Route
              path="/carpools/:carpoolId/edit"
              element={<CarpoolWritePage />}
            />
            {/* <Route path="/nodata" element={<NoDataPage message="페이지를 찾을 수 없습니다." />} /> */}
            {/* 일치하는 경로가 없을 때 홈으로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
