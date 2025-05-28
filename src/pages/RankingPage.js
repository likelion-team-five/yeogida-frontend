import React, { useState, useEffect } from "react";
import PageSectionHeader from "../components/common/PageSectionHeader";
import ListItemCard from "../components/common/ListItemCard";
import { FiAward, FiTrendingUp, FiUserCheck } from "react-icons/fi";
import bb from "../pages/images/bb.jpg";
import hh from "../pages/images/hh.jpg";
import dd from "../pages/images/dd.jpg";
import pp from '../pages/images/pp.png';

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

  useEffect(() => {
    // 더미 데이터
    setData({
      courses: [
        {
          id: "1",
          rank: 1,
          thumbnailUrl: bb,
          title: "서울 한옥 힐링 투어",
          score: "4.9",
        },
        {
          id: "2",
          rank: 2,
          thumbnailUrl: hh,
          title: "강원도 감성 드라이브",
          score: "4.7",
        },
        {
          id: "3",
          rank: 3,
          thumbnailUrl: dd,
          title: "부산 맛집 탐방",
          score: "4.6",
        },
      ],
      reviews: [
        {
          id: "101",
          rank: 1,
          thumbnailUrl: hh,
          title: "한옥 마을 너무 좋아요!",
          author: "여행자1",
          score: "👍 58",
        },
        {
          id: "102",
          rank: 2,
          thumbnailUrl: dd,
          title: "부산 먹방 여행 성공!",
          author: "푸드헌터",
          score: "👍 49",
        },
        {
          id: "103",
          rank: 3,
          thumbnailUrl: bb,
          title: "힐링 제대로 했습니다",
          author: "초보엄마",
          score: "👍 41",
        },
      ],
      users: [
        {
          nickname: "여행천재",
          rank: 1,
          profile_Image: pp,
          level: 5,
          reviewCount: 28,
          likeCount: 154,
          badge: "여행의 신",
        },
        {
          nickname: "감성작가",
          rank: 2,
          profile_Image: pp,
          level: 4,
          reviewCount: 19,
          likeCount: 92,
          badge: "감성왕",
        },
        {
          nickname: "초보엄마",
          rank: 3,
          profile_Image: pp,
          level: 3,
          reviewCount: 12,
          likeCount: 45,
          badge: "가족여행러",
        },
      ],
    });
  }, [sortPeriod]);

  const renderRankingList = () => {
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
            score={`${item.score}점`}
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

      <div className="divide-y divide-gray-100">{renderRankingList()}</div>
    </>
  );
}

export default RankingPage;
