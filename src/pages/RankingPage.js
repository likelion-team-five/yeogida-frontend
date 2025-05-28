import React, { useState, useEffect } from "react";
import PageSectionHeader from "../components/common/PageSectionHeader";
import ListItemCard from "../components/common/ListItemCard";
import { FiAward, FiTrendingUp, FiUserCheck, FiCalendar } from "react-icons/fi";
import axiosInstance from "../auth/axiosinstance";

const tabs = [
  { id: "courses", label: "인기 코스", icon: FiTrendingUp },
  { id: "reviews", label: "베스트 후기", icon: FiAward },
  { id: "users", label: "우수 활동 회원", icon: FiUserCheck },
];

const periodOptions = [
  { id: "weekly", label: "주간" },
  { id: "monthly", label: "월간" },
  { id: "all", label: "전체" },
];

const RankingItem = ({ rank, imageUrl, title, subtitle, score, onClick, imageSize = "w-20 h-16" }) => (
  <ListItemCard
    imageUrl={imageUrl}
    title={`${rank}. ${title}`}
    subtitle={subtitle}
    onClick={onClick}
    imageSize={imageSize}
    actions={<span className="text-sm font-semibold text-blue-600">{score}</span>}
    customContent={
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
        {rank}
      </div>
    }
  />
);

function RankingPage() {
  const [activeTab, setActiveTab] = useState("courses");
  const [sortPeriod, setSortPeriod] = useState("weekly");
  const [data, setData] = useState({ courses: [], reviews: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API 호출 함수에 콘솔 로그 추가
  const fetchRankingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/api/v1/rankings?period=${sortPeriod}`);
      console.log("응답 상태 코드:", res.status); 
      console.log("랭킹 API 응답 데이터:", res.data); // <== 여기서 콘솔 출력
      setData({
        courses: res.data.courses || [],
        reviews: res.data.reviews || [],
        users: res.data.users || [],
      });
    } catch (e) {
      console.error("랭킹 API 호출 에러:", e);
      setError("랭킹 데이터를 불러오는데 실패했습니다.");
      setData({ courses: [], reviews: [], users: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankingData();
  }, [sortPeriod]);

  const renderRankingList = () => {
    if (loading) return <p className="p-4 text-center">로딩 중...</p>;
    if (error) return <p className="p-4 text-center text-red-500">{error}</p>;

    let list = [];
    switch (activeTab) {
      case "courses":
        list = data.courses;
        return list.map((item) => (
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
        list = data.reviews;
        return list.map((item) => (
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
        list = data.users;
        return list.map((item) => (
          <RankingItem
            key={item.nickname}
            rank={item.rank}
            imageUrl={item.profile_Image}
            title={item.nickname}
            subtitle={`레벨: ${item.level} | 후기: ${item.reviewCount} | 좋아요: ${item.likeCount} | 뱃지: ${item.badge}`}
            score={""}
            imageSize="w-16 h-16 rounded-full"
            onClick={() => alert(`${item.nickname} 프로필 보기`)}
          />
        ));
      default:
        return <p className="p-4 text-center text-gray-500">랭킹 정보가 없습니다.</p>;
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

      {/* 기간 정렬 옵션 */}
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
