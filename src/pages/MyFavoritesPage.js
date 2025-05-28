import React, { useState, useEffect } from "react";
import PageSectionHeader from "../components/common/PageSectionHeader";
import ListItemCard from "../components/common/ListItemCard";
import { FiHeart, FiMap, FiMessageSquare, FiThumbsDown } from "react-icons/fi";
import bb from "../pages/images/bb.jpg";
import hh from "../pages/images/hh.jpg";
import dd from "../pages/images/dd.jpg";
import qq from "../pages/images/qq.jpg";

function MyFavoritesPage() {
  const [activeTab, setActiveTab] = useState("courses");
  const [favorites, setFavorites] = useState({ courses: [], reviews: [], carpools: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tabs = [
    { id: "courses", label: "찜한 코스", icon: FiMap },
    { id: "reviews", label: "찜한 후기", icon: FiMessageSquare },
    { id: "carpools", label: "찜한 카풀", icon: FiHeart },
  ];

  useEffect(() => {

    const dummyFavorites = {
      courses: [
        {
          id: "1",
          title: "서울 한옥 힐링 투어",
          thumbnailUrl: bb,
          dateFavorited: "2025-05-01",
          summary: "전통과 힐링이 어우러진 한옥 여행",
        },
      ],
      reviews: [
        {
          id: "2",
          title: "부산 맛집 최고였어요!",
          thumbnailUrl: qq,
          author: "맛집헌터",
          createdAt: "2025-05-03",
          summary: "광안리에서 먹은 해산물이 아직도 생각나요.",
        },
      ],
      carpools: [
        {
          id: "3",
          title: "서울 → 강릉 5/10(금) 08:00 출발",
          thumbnailUrl: hh,
          createdAt: "2025-05-05",
          summary: "편하게 갈 수 있어 좋아요! (3자리 남음)",
        },
      ],
    };

    setFavorites(dummyFavorites);
  }, []);

  const handleUnfavorite = (itemId, itemType) => {
    alert(`찜 해제: ${itemType} - ${itemId}`);
  };

  const handleFavorite = (itemId, itemType) => {
    alert(`찜 추가: ${itemType} - ${itemId}`);
  };

  const renderFavoriteList = () => {
    if (loading) {
      return <p className="p-4 text-center text-gray-500">로딩 중...</p>;
    }
    if (error) {
      return <p className="p-4 text-center text-red-500">{error}</p>;
    }

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
          `찜한 날짜: ${item.dateFavorited || item.createdAt || ""} ${
            item.author ? `| 작성자: ${item.author}` : ""
          }`
        }
        onClick={() => alert(`${item.title} 상세 보기`)}
        actions={
          <>
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFavorite(item.id, activeTab);
              }}
              className="text-green-600 hover:text-green-800 p-1 rounded-md hover:bg-green-50 ml-2"
              title="찜 추가"
            >
              <FiHeart size={18} />
            </button>
          </>
        }
      />
    ));
  };

  return (
    <>
      <PageSectionHeader title="내가 찜한 목록" />

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

      <div className="flex-grow overflow-y-auto divide-y divide-gray-100">
        {renderFavoriteList()}
      </div>
    </>
  );
}

export default MyFavoritesPage;
