// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import ListItemCard from "../components/common/ListItemCard"; // 경로 확인
import {
  FiCompass,
  FiMessageSquare,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";

// FeatureButton 컴포넌트는 클릭 시 navigate 함수를 직접 호출하도록 onClick을 전달받습니다.
const FeatureButton = ({ icon: Icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left w-full flex items-start space-x-4"
  >
    <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <FiArrowRight size={20} className="text-gray-400 ml-auto self-center" />
  </button>
);

// 더미 데이터 (실제로는 API 호출 또는 상태 관리)
const popularCourses = [
  {
    id: "courseA",
    title: "제주 동부 2박 3일 힐링 코스",
    thumbnailUrl:
      "https://via.placeholder.com/300x200/FFA07A/FFFFFF?Text=Jeju+Course",
    summary: "아름다운 해변과 오름을 따라 즐기는 여유로운 여행",
    tags: [{ name: "제주" }, { name: "힐링" }],
  },
  {
    id: "courseB",
    title: "경주 역사 문화 탐방 1일 코스",
    thumbnailUrl:
      "https://via.placeholder.com/300x200/98FB98/FFFFFF?Text=Gyeongju+History",
    summary: "신라의 숨결을 느낄 수 있는 알찬 당일치기 코스",
    tags: [{ name: "경주" }, { name: "역사" }],
  },
];

const latestReviews = [
  {
    id: "reviewX",
    title: "부산 해운대 맛집 투어 후기!",
    thumbnailUrl:
      "https://via.placeholder.com/150/ADD8E6/FFFFFF?Text=Busan+Food",
    author: "여행가A",
    date: "2025-05-23",
    likes: 15,
    commentsCount: 3,
  }, // commentsCount 추가
  {
    id: "reviewY",
    title: "강릉 커피거리 카페 추천",
    thumbnailUrl:
      "https://via.placeholder.com/150/FFD700/FFFFFF?Text=Gangneung+Coffee",
    author: "커피사랑B",
    date: "2025-05-22",
    likes: 22,
    commentsCount: 5,
  }, // commentsCount 추가
];

function HomePage() {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <>
      {/* Hero Section */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center py-12">
          {/* 로고 이미지가 있다면 public 폴더에 넣고 /logo-white.png 와 같이 절대 경로로 사용하거나, import 해서 사용 */}
          {/* <img src="/logo-white.png" alt="서비스 로고" className="h-16 mx-auto mb-6" /> */}
          <h1 className="text-4xl font-bold mb-4">
            여행의 모든 순간, 함께 만들어요!
          </h1>
          <p className="text-lg opacity-90 mb-8">
            나만의 코스를 계획하고, 생생한 후기를 공유하며, 함께 떠날 카풀
            메이트를 찾아보세요.
          </p>
        </div>
      </div>

      {/* 주요 기능 바로가기 버튼 */}
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureButton
          icon={FiCompass}
          title="나만의 코스 찾기"
          description="취향에 맞는 여행 코스를 추천받고 직접 만들어보세요."
          onClick={() => navigate("/courses")}
        />
        <FeatureButton
          icon={FiMessageSquare}
          title="생생한 여행 후기"
          description="다른 여행자들의 실제 경험담을 확인하고 팁을 얻으세요."
          onClick={() => navigate("/reviews")}
        />
        <FeatureButton
          icon={FiUsers}
          title="함께 떠날 카풀"
          description="목적지가 같은 여행자와 카풀하여 비용과 즐거움을 나눠보세요."
          onClick={() => navigate("/carpools")}
        />
      </div>

      {/* 인기 여행 코스 */}
      <section className="p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          인기 여행 코스 🚌
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularCourses.map((course) => (
            <ListItemCard
              key={course.id}
              imageUrl={course.thumbnailUrl}
              title={course.title}
              description={course.summary}
              tags={course.tags}
              // onClick={() => navigate(`/courses/${course.id}`)} // 코스 상세 라우트가 있다면
              onClick={() =>
                alert(
                  `${course.title} 코스 상세 페이지로 이동 (라우트 설정 필요: /courses/${course.id})`,
                )
              }
              imageSize="w-full h-40"
            />
          ))}
        </div>
      </section>

      {/* 최신 후기 */}
      <section className="p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          최신 여행 후기 ✍️
        </h2>
        {latestReviews.map((review) => (
          <ListItemCard
            key={review.id}
            imageUrl={review.thumbnailUrl}
            title={review.title}
            subtitle={`작성자: ${review.author} | ${review.date}`}
            actions={
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span>❤️ {review.likes}</span>
                <span>💬 {review.commentsCount}</span>
              </div>
            }
            onClick={() => navigate(`/reviews/${review.id}`)} // 후기 상세 페이지로 이동
          />
        ))}
      </section>
    </>
  );
}

export default HomePage;
