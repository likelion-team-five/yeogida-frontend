import React from "react";
import { useNavigate } from "react-router-dom";
import ListItemCard from "../components/common/ListItemCard";
import {
  FiCompass,
  FiMessageSquare,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";
import haeundaeImg from '../pages/images/haeundae.webp';
import coffee from '../pages/images/coffee.jpg';
import jeju from '../pages/images/jeju.jpg';
import history from '../pages/images/history.png';

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

const popularCourses = [
  {
    id: "courseA",
    title: "제주 동부 2박 3일 힐링 코스",
    thumbnailUrl: jeju,
    summary: "아름다운 해변과 오름을 따라 즐기는 여유로운 여행",
    tags: [{ name: "제주" }, { name: "힐링" }],
  },
  {
    id: "courseB",
    title: "경주 역사 문화 탐방 1일 코스",
    thumbnailUrl: history,
    summary: "신라의 숨결을 느낄 수 있는 알찬 당일치기 코스",
    tags: [{ name: "경주" }, { name: "역사" }],
  },
];

const latestReviews = [
  {
    id: "reviewX",
    title: "부산 해운대 맛집 투어 후기!",
    thumbnailUrl: haeundaeImg,
    author: "여행가A",
    date: "2025-05-23",
    likes: 15,
    commentsCount: 3,
  },
  {
    id: "reviewY",
    title: "강릉 커피거리 카페 추천",
    thumbnailUrl: coffee,
    author: "커피사랑B",
    date: "2025-05-22",
    likes: 22,
    commentsCount: 5,
  },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="p-6 md:p-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-4xl font-bold mb-4">여행의 모든 순간, 함께 만들어요!</h1>
          <p className="text-lg opacity-90 mb-8">
            나만의 코스를 계획하고, 생생한 후기를 공유하며, 함께 떠날 카풀 메이트를 찾아보세요.
          </p>
        </div>
      </div>

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

      <section className="p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">인기 여행 코스 !!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularCourses.map((course) => (
            <div key={course.id} className="bg-white rounded shadow overflow-hidden">
              <img src={course.thumbnailUrl} alt={course.title} className="w-full object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.summary}</p>
                <div className="flex flex-wrap gap-1">
                  {course.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">최신 여행 후기 !!</h2>
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
            onClick={() => navigate(`/reviews/${review.id}`)}
          />
        ))}
      </section>
    </>
  );
}

export default HomePage;
