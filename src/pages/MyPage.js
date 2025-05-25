import React, { useState, useEffect } from "react"; // useEffect 추가
import PageSectionHeader from "../components/common/PageSectionHeader";
import ListItemCard from "../components/common/ListItemCard";
import {
  FiUser,
  FiEdit3,
  FiLogOut,
  FiHeart,
  FiMessageCircle,
  FiMapPin,
} from "react-icons/fi";

// 더미 데이터 (컴포넌트 외부에 위치)
const defaultUserProfile = {
  name: "게스트",
  email: "guest@example.com",
  profileImageUrl: "https://via.placeholder.com/100/CCCCCC/FFFFFF?Text=Guest",
  bio: "로그인하여 더 많은 기능을 이용해보세요.",
};

const defaultMyActivities = {
  reviews: [],
  carpools: [],
  favorites: [],
};

// MyPage 함수 선언부 수정
function MyPage({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState("reviews");
  const [displayedUserProfile, setDisplayedUserProfile] = useState(defaultUserProfile);
  const [displayedMyActivities, setDisplayedMyActivities] = useState(defaultMyActivities);
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태

  // currentUser prop이 변경될 때마다 프로필 및 활동 내역 업데이트
  useEffect(() => {
    if (currentUser) {
      // 실제 앱에서는 여기서 currentUser.id를 사용하여 API 호출로
      // 해당 사용자의 실제 프로필 및 활동 내역을 가져옵니다.
      // 예시: fetchUserProfile(currentUser.id).then(data => setDisplayedUserProfile(data));
      // fetchMyActivities(currentUser.id).then(data => setDisplayedMyActivities(data));

      // 여기서는 더미 데이터와 currentUser 정보를 통합하는 시뮬레이션
      setDisplayedUserProfile({
        name: currentUser.nickname || defaultUserProfile.name,
        email: currentUser.id || defaultUserProfile.email, // 카카오 ID 등
        profileImageUrl: currentUser.profileImageUrl || defaultUserProfile.profileImageUrl,
        bio: defaultUserProfile.bio, // 실제 사용자 bio가 있다면 대체
      });
      setDisplayedMyActivities({
        reviews: [
            { id: "r1", title: `${currentUser.nickname}님의 첫 후기`, date: "2025-04-10", thumbnailUrl: "https://via.placeholder.com/150/20B2AA/FFFFFF?Text=My+Jeju", category: "국내여행" },
            { id: "r2", title: `${currentUser.nickname}님의 두번째 후기`, date: "2025-02-15", thumbnailUrl: "https://via.placeholder.com/150/FFA500/FFFFFF?Text=Europe+Trip", category: "해외여행" },
        ],
        carpools: [
            { id: "c1", title: `${currentUser.nickname}님의 카풀`, date: "2025-05-30", status: "모집중" },
        ],
        favorites: [
            { id: "f1", title: `${currentUser.nickname}님의 찜 코스`, type: "코스", thumbnailUrl: "https://via.placeholder.com/150/87CEFA/FFFFFF?Text=Favorite+Course" },
        ],
      });
      setIsLoading(false);
    } else {
      // currentUser가 없으면 기본값으로 재설정 (로그아웃 시)
      setDisplayedUserProfile(defaultUserProfile);
      setDisplayedMyActivities(defaultMyActivities);
      setIsLoading(false);
    }
  }, [currentUser]); // currentUser가 변경될 때마다 useEffect 실행


  const tabs = [
    { id: "reviews", label: "내 후기", icon: FiMessageCircle },
    { id: "carpools", label: "내 카풀", icon: FiMapPin },
    { id: "favorites", label: "찜 목록", icon: FiHeart },
    { id: "settings", label: "정보 수정", icon: FiEdit3 },
  ];

  const renderTabContent = () => {
    // 렌더링 시에는 displayedMyActivities 사용
    switch (activeTab) {
      case "reviews":
        return displayedMyActivities.reviews.length > 0 ? (
          displayedMyActivities.reviews.map((item) => (
            <ListItemCard
              key={item.id}
              imageUrl={item.thumbnailUrl}
              title={item.title}
              subtitle={`작성일: ${item.date} | 카테고리: ${item.category}`}
              onClick={() => alert(`${item.title} 후기 상세보기`)}
              actions={
                <button className="text-xs text-blue-500 hover:underline">
                  수정
                </button>
              }
            />
          ))
        ) : (
          <p className="text-gray-500 p-4">작성한 후기가 없습니다.</p>
        );
      case "carpools":
        return displayedMyActivities.carpools.length > 0 ? (
          displayedMyActivities.carpools.map((item) => (
            <ListItemCard
              key={item.id}
              title={`${item.title} (${item.status})`}
              subtitle={`예정일: ${item.date}`}
              onClick={() => alert(`${item.title} 카풀 상세보기`)}
              actions={
                <button className="text-xs text-green-500 hover:underline">
                  관리
                </button>
              }
            />
          ))
        ) : (
          <p className="text-gray-500 p-4">등록한 카풀이 없습니다.</p>
        );
      case "favorites":
        return displayedMyActivities.favorites.length > 0 ? (
          displayedMyActivities.favorites.map((item) => (
            <ListItemCard
              key={item.id}
              imageUrl={item.thumbnailUrl}
              title={item.title}
              subtitle={`타입: ${item.type}`}
              onClick={() => alert(`${item.title} 찜 상세`)}
              actions={
                <button className="text-xs text-red-500 hover:underline">
                  찜 해제
                </button>
              }
            />
          ))
        ) : (
          <p className="text-gray-500 p-4">찜한 항목이 없습니다.</p>
        );
      case "settings":
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">개인 정보 수정</h3>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="nickname"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  닉네임
                </label>
                <input
                  type="text"
                  id="nickname"
                  defaultValue={displayedUserProfile.name} // displayedUserProfile 사용
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  소개
                </label>
                <textarea
                  id="bio"
                  rows="3"
                  defaultValue={displayedUserProfile.bio} // displayedUserProfile 사용
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                저장하기
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <>
        <PageSectionHeader title="마이페이지" />
        <div className="flex-grow flex items-center justify-center p-4">
          <p className="text-gray-500">내 정보를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageSectionHeader
        title="마이페이지"
        actions={
          <button
            className="flex items-center text-sm text-gray-500 hover:text-red-600 p-1.5 rounded-md hover:bg-gray-100"
            onClick={onLogout}
          >
            <FiLogOut size={18} className="mr-1" /> 로그아웃
          </button>
        }
      />

      {/* 프로필 섹션 */}
      <div className="p-6 bg-white m-4 rounded-lg shadow-md flex items-center space-x-4">
        <img
          src={displayedUserProfile.profileImageUrl} // displayedUserProfile 사용
          alt="프로필 이미지"
          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-gray-200"
        />
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              {displayedUserProfile.name} {/* displayedUserProfile 사용 */}
            </h2>
            <button className="text-blue-600 hover:text-blue-700 p-1.5 rounded-md hover:bg-blue-50">
              <FiEdit3 size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500">{displayedUserProfile.email}</p> {/* displayedUserProfile 사용 */}
          <p className="text-sm text-gray-600 mt-1 hidden md:block">
            {displayedUserProfile.bio} {/* displayedUserProfile 사용 */}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1 px-6 block md:hidden">
        {displayedUserProfile.bio} {/* displayedUserProfile 사용 */}
      </p>

      {/* 탭 네비게이션 */}
      <div className="px-4 border-b border-gray-200 bg-white">
        <nav className="flex space-x-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2.5 text-sm font-medium flex items-center space-x-1.5
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

      {/* 탭 콘텐츠 */}
      <div className="p-0 md:p-4">
        {renderTabContent()}
      </div>
    </>
  );
}

export default MyPage;