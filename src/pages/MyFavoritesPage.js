import React, { useState, useEffect } from "react";
import PageSectionHeader from "../components/common/PageSectionHeader";
import ListItemCard from "../components/common/ListItemCard";
import { FiHeart, FiMap, FiMessageSquare, FiThumbsDown } from "react-icons/fi"; 
import axiosInstance from "../auth/axiosinstance";

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

  // ✅ 찜 목록 API 호출
  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/api/v1/courses/favorites/");

      // ✅ 콘솔 로그 추가
      console.log("[찜 목록 API] 응답 상태 코드:", res.status);
      console.log("[찜 목록 API] 응답 데이터:", res.data);

      setFavorites({
        courses: res.data.courses || [],
        reviews: res.data.reviews || [],
        carpools: res.data.carpools || [],
      });
    } catch (err) {
      console.error("찜 목록 불러오기 실패:", err);
      setError("찜 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleUnfavorite = async (itemId, itemType) => {
    if (!window.confirm("이 항목을 찜 목록에서 삭제하시겠습니까?")) return;

    try {
      if (itemType === "courses") {
        await axiosInstance.delete(`/api/v1/courses/${itemId}/favorite`);
      } else if (itemType === "reviews") {
        await axiosInstance.delete(`/api/v1/reviews/${itemId}/likes`);
      } else if (itemType === "carpools") {
        await axiosInstance.delete(`/api/v1/carpools/${itemId}/likes`);
      }

      setFavorites((prev) => ({
        ...prev,
        [itemType]: prev[itemType].filter((item) => item.id !== itemId),
      }));

      alert("찜 해제가 완료되었습니다.");
    } catch (error) {
      console.error("찜 해제 실패:", error);
      alert("찜 해제 중 오류가 발생했습니다.");
    }
  };

  const handleFavorite = async (itemId, itemType) => {
    try {
      if (itemType === "courses") {
        await axiosInstance.post(`/api/v1/courses/${itemId}/favorite`);
      } else if (itemType === "reviews") {
        await axiosInstance.post(`/api/v1/reviews/${itemId}/likes`);
      } else if (itemType === "carpools") {
        await axiosInstance.post(`/api/v1/carpools/${itemId}/likes`);
      }
      alert("찜이 추가되었습니다.");
      fetchFavorites();
    } catch (error) {
      console.error("찜 추가 실패:", error);
      alert("찜 추가 중 오류가 발생했습니다.");
    }
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
