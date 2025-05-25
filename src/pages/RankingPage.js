import React, { useState } from "react";
import PageSectionHeader from "../components/common/PageSectionHeader";
import ListItemCard from "../components/common/ListItemCard";
import { FiAward, FiTrendingUp, FiUserCheck, FiCalendar } from "react-icons/fi";

// 더미 데이터
const rankingData = {
  courses: [
    {
      id: "c1",
      rank: 1,
      title: "제주 완전정복 3박4일 코스",
      score: "1,250 찜",
      thumbnailUrl:
        "https://via.placeholder.com/150/8A2BE2/FFFFFF?Text=Rank+Course+1",
    },
    {
      id: "c2",
      rank: 2,
      title: "서울 도심 미식 탐방",
      score: "980 찜",
      thumbnailUrl:
        "https://via.placeholder.com/150/5F9EA0/FFFFFF?Text=Rank+Course+2",
    },
    {
      id: "c3",
      rank: 3,
      title: "부산 바다와 야경 만끽",
      score: "760 찜",
      thumbnailUrl:
        "https://via.placeholder.com/150/008080/FFFFFF?Text=Rank+Course+3",
    },
  ],
  reviews: [
    {
      id: "r1",
      rank: 1,
      title: "인생샷 100장! 강릉 여행 후기",
      score: "550 좋아요",
      author: "사진작가A",
      thumbnailUrl:
        "https://via.placeholder.com/150/FF7F50/FFFFFF?Text=Rank+Review+1",
    },
    {
      id: "r2",
      rank: 2,
      title: "혼자 떠난 유럽 한달살이",
      score: "480 좋아요",
      author: "나홀로여행",
      thumbnailUrl:
        "https://via.placeholder.com/150/6495ED/FFFFFF?Text=Rank+Review+2",
    },
  ],
  users: [
    {
      id: "u1",
      rank: 1,
      name: "여행고수김씨",
      score: "후기 50개",
      profileImageUrl:
        "https://via.placeholder.com/80/778899/FFFFFF?Text=User1",
    },
    {
      id: "u2",
      rank: 2,
      name: "카풀왕박씨",
      score: "카풀 30회",
      profileImageUrl:
        "https://via.placeholder.com/80/B0C4DE/FFFFFF?Text=User2",
    },
  ],
};

const RankingItem = ({
  rank,
  imageUrl,
  title,
  subtitle,
  score,
  onClick,
  imageSize = "w-20 h-16",
}) => (
  <ListItemCard
    imageUrl={imageUrl}
    title={`${rank}. ${title}`}
    subtitle={subtitle}
    onClick={onClick}
    imageSize={imageSize}
    actions={
      <span className="text-sm font-semibold text-blue-600">{score}</span>
    }
    customContent={
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
        {rank}
      </div>
    }
  />
);

function RankingPage() {
  const [activeTab, setActiveTab] = useState("courses"); // 'courses', 'reviews', 'users'
  const [sortPeriod, setSortPeriod] = useState("weekly"); // 'weekly', 'monthly', 'all'

  const tabs = [
    { id: "courses", label: "인기 코스", icon: FiTrendingUp },
    { id: "reviews", label: "베스트 후기", icon: FiAward },
    { id: "users", label: "우수 활동 회원", icon: FiUserCheck },
  ];

  const periodOptions = [
    { id: "weekly", label: "주간", icon: FiCalendar },
    { id: "monthly", label: "월간", icon: FiCalendar },
    { id: "all", label: "전체", icon: FiCalendar },
  ];

  const renderRankingList = () => {
    let data;
    switch (activeTab) {
      case "courses":
        data = rankingData.courses;
        return data.map((item) => (
          <RankingItem
            key={item.id}
            rank={item.rank}
            imageUrl={item.thumbnailUrl}
            title={item.title}
            score={item.score}
            onClick={() => alert(`${item.title} 상세 보기`)}
          />
        ));
      case "reviews":
        data = rankingData.reviews;
        return data.map((item) => (
          <RankingItem
            key={item.id}
            rank={item.rank}
            imageUrl={item.thumbnailUrl}
            title={item.title}
            subtitle={`작성자: ${item.author}`}
            score={item.score}
            onClick={() => alert(`${item.title} 상세 보기`)}
          />
        ));
      case "users":
        data = rankingData.users;
        return data.map((item) => (
          <RankingItem
            key={item.id}
            rank={item.rank}
            imageUrl={item.profileImageUrl}
            title={item.name}
            score={item.score}
            imageSize="w-16 h-16 rounded-full" // 사용자 프로필 이미지는 원형으로
            onClick={() => alert(`${item.name} 프로필 보기`)}
          />
        ));
      default:
        return <p className="p-4 text-gray-500">랭킹 정보가 없습니다.</p>;
    }
  };

  return (
    <>
      <PageSectionHeader title="랭킹" />

      {/* 탭 네비게이션 */}
      <div className="px-4 border-b border-gray-200 bg-white">
        <nav className="flex space-x-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-3 text-sm font-medium flex items-center space-x-1.5
                          ${
                            activeTab === tab.id
                              ? "border-b-2 border-blue-500 text-blue-600"
                              : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          } focus:outline-none whitespace-nowrap`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 기간 정렬 옵션 (선택 사항) */}
      <div className="p-3 flex justify-end items-center bg-gray-50 border-b border-gray-200">
        {periodOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSortPeriod(opt.id)}
            className={`ml-2 px-3 py-1 text-xs rounded-full
                        ${
                          sortPeriod === opt.id
                            ? "bg-blue-500 text-white font-semibold"
                            : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                        }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 랭킹 목록 */}
      <div className="divide-y divide-gray-100">{renderRankingList()}</div>
    </>
  );
}

export default RankingPage;
