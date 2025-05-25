import React, { useState } from "react";
import PageSectionHeader from "../components/common/PageSectionHeader";
import ListItemCard from "../components/common/ListItemCard";
import { FiHeart, FiMap, FiMessageSquare, FiThumbsDown } from "react-icons/fi"; // 아이콘

// 더미 데이터
const favoriteData = {
  courses: [
    {
      id: "fav_c1",
      title: "제주 동부 2박 3일 힐링 코스",
      thumbnailUrl:
        "https://via.placeholder.com/150/FFA07A/FFFFFF?Text=Fav+Course1",
      summary: "아름다운 해변과 오름...",
      dateFavorited: "2025-05-20",
    },
    {
      id: "fav_c2",
      title: "경주 역사 문화 탐방",
      thumbnailUrl:
        "https://via.placeholder.com/150/98FB98/FFFFFF?Text=Fav+Course2",
      summary: "신라의 숨결을...",
      dateFavorited: "2025-05-18",
    },
  ],
  reviews: [
    {
      id: "fav_r1",
      title: "부산 해운대 맛집 투어 후기!",
      thumbnailUrl:
        "https://via.placeholder.com/150/ADD8E6/FFFFFF?Text=Fav+Review1",
      author: "여행가A",
      dateFavorited: "2025-05-22",
    },
  ],
  carpools: [
    {
      id: "fav_cp1",
      title: "서울역 → 강릉역 (주말 오전)",
      thumbnailUrl:
        "https://via.placeholder.com/150/DDA0DD/FFFFFF?Text=Fav+Carpool1",
      departureTime: "2025-06-01 09:00",
      dateFavorited: "2025-05-15",
    },
  ],
};

function MyFavoritesPage() {
  const [activeTab, setActiveTab] = useState("courses"); // 'courses', 'reviews', 'carpools'
  // 실제로는 각 탭의 데이터를 API로 가져오거나 상태 관리 필요
  const [favorites, setFavorites] = useState(favoriteData);

  const tabs = [
    { id: "courses", label: "찜한 코스", icon: FiMap },
    { id: "reviews", label: "찜한 후기", icon: FiMessageSquare },
    { id: "carpools", label: "찜한 카풀", icon: FiHeart }, // 카풀 아이콘으로 변경 필요
  ];

  const handleUnfavorite = (itemId, itemType) => {
    if (window.confirm("이 항목을 찜 목록에서 삭제하시겠습니까?")) {
      setFavorites((prev) => ({
        ...prev,
        [itemType]: prev[itemType].filter((item) => item.id !== itemId),
      }));
      alert(`${itemId} 항목 찜 해제됨 (API 호출 필요)`);
    }
  };

  const renderFavoriteList = () => {
    const currentItems = favorites[activeTab] || [];
    if (currentItems.length === 0) {
      return (
        <p className="p-4 text-center text-gray-500">
          찜한{" "}
          {tabs.find((t) => t.id === activeTab)?.label.replace("찜한 ", "")}
          이(가) 없습니다.
        </p>
      );
    }

    return currentItems.map((item) => (
      <ListItemCard
        key={item.id}
        imageUrl={item.thumbnailUrl}
        title={item.title}
        subtitle={
          item.summary ||
          `찜한 날짜: ${item.dateFavorited} ${item.author ? `| 작성자: ${item.author}` : ""}`
        }
        onClick={() => alert(`${item.title} 상세 보기`)}
        actions={
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUnfavorite(item.id, activeTab);
            }}
            className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50"
            title="찜 해제"
          >
            <FiThumbsDown size={18} />
          </button>
        }
      />
    ));
  };

  return (
    <>
      <PageSectionHeader title="내가 찜한 목록" />

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

      {/* 찜 목록 */}
      <div className="flex-grow overflow-y-auto divide-y divide-gray-100">
        {renderFavoriteList()}
      </div>
    </>
  );
}

export default MyFavoritesPage;
