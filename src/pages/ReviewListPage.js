import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader';
import SearchBarWithButton from '../components/common/SearchBarWithButton';
import FilterSortSection from '../components/common/FilterSortSection';
import ReviewItem from '../components/review/ReviewItem';
import { FiPlusSquare } from 'react-icons/fi';

// 날짜 파싱 함수
const parseDateTime = (datetimeStr) => {
    const parts = datetimeStr.match(/(\d{2})\/(\d{2})\s(\d{1,2}):(\d{2})\s(AM|PM)/i);
    if (!parts) return new Date(0);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    let hours = parseInt(parts[3], 10);
    const minutes = parseInt(parts[4], 10);
    const ampm = parts[5].toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, month, day, hours, minutes);
};

// 더미 데이터 (실제로는 API 호출 또는 상태 관리)
const initialReviewItems = [
  { id: 'review1', title: '후기 제목 1 - 정말 좋았던 강릉 여행!', datetime: '05/01 11:30 AM', image: 'https://via.placeholder.com/150/E6E6FA/000000?Text=Review1', author: '여행자A', likes: 120, category: "국내", commentsCount: 5 },
  { id: 'review2', title: '후기 제목 2 - 파리에서 생긴 일', datetime: '04/28 09:20 AM', image: null, author: '유럽매니아', likes: 85, category: "해외", commentsCount: 2 },
  { id: 'review3', title: '후기 제목 3 - 맛집 탐방기', datetime: '04/08 11:30 PM', image: 'https://via.placeholder.com/150/FFF0F5/000000?Text=Review3', author: '미식가C', likes: 200, category: "맛집", commentsCount: 10 },
  { id: 'review4', title: '후기 제목 4 - 가성비 최고 호텔 추천', datetime: '05/03 02:00 PM', image: null, author: '절약왕D', likes: 50, category: "숙소", commentsCount: 1 },
];

const sortOptionsConfig = [
  { key: 'latest', label: '최신순' },
  { key: 'likes', label: '인기순 (좋아요 많은 순)' },
  { key: 'oldest', label: '오래된순' },
];

function ReviewListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [activeOptionsMenuId, setActiveOptionsMenuId] = useState(null);

  // 1. filteredItems 정의 (useMemo)
  const filteredItems = useMemo(() => {
    if (!initialReviewItems) return []; // initialReviewItems가 없을 경우 빈 배열 반환
    if (!searchTerm) return initialReviewItems;
    return initialReviewItems.filter(item =>
      item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()) // item.title이 undefined가 아닌지 확인
    );
  }, [searchTerm]); // initialReviewItems는 상수이므로 의존성 배열에서 제외 가능, 혹은 포함해도 무방

  // 2. sortedAndFilteredItems 정의 (useMemo)
  const sortedAndFilteredItems = useMemo(() => {
    if (!filteredItems) return []; // filteredItems가 없을 경우 빈 배열 반환
    const itemsToSort = [...filteredItems]; // 원본 배열 수정을 피하기 위해 복사
    switch (sortOrder) {
      case 'likes':
        return itemsToSort.sort((a, b) => (b.likes || 0) - (a.likes || 0)); // likes가 undefined일 경우 0으로 처리
      case 'oldest':
        return itemsToSort.sort((a, b) => parseDateTime(a.datetime) - parseDateTime(b.datetime));
      case 'latest':
      default:
        return itemsToSort.sort((a, b) => parseDateTime(b.datetime) - parseDateTime(a.datetime));
    }
  }, [filteredItems, sortOrder]); // filteredItems 또는 sortOrder가 변경될 때만 재계산

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setActiveOptionsMenuId(null); // 검색 시 메뉴 닫기
  };

  const handleToggleOptionsMenu = (reviewId) => {
    setActiveOptionsMenuId(prevId => (prevId === reviewId ? null : reviewId));
  };

  const handleEditReview = (reviewId) => {
    navigate(`/reviews/${reviewId}/edit`);
    setActiveOptionsMenuId(null);
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm(`후기(ID: ${reviewId})를 정말 삭제하시겠습니까?`)) {
      console.log(`삭제할 후기 ID: ${reviewId}`);
      alert(`후기(ID: ${reviewId})가 삭제되었습니다. (API 호출 시뮬레이션)`);
      // 실제로는 API 호출 후 목록을 다시 불러오거나, 상태에서 해당 아이템을 제거합니다.
      // 예: setReviewItems(prevItems => prevItems.filter(item => item.id !== reviewId));
      // initialReviewItems를 상태로 만들고 업데이트해야 합니다. 지금은 const라 변경 불가.
    }
    setActiveOptionsMenuId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeOptionsMenuId) {
        const clickedElement = event.target;
        // 메뉴 버튼이나 메뉴 자신이 아닌 경우, 그리고 메뉴를 열기 위한 버튼이 아닌 경우 닫습니다.
        // data-menu-button 과 data-menu-dropdown 같은 속성을 버튼과 드롭다운에 추가하면 더 명확하게 구분 가능합니다.
        if (!clickedElement.closest(`[data-review-id="${activeOptionsMenuId}"] [aria-haspopup="true"]`) &&
            !clickedElement.closest(`[data-review-id="${activeOptionsMenuId}"] [role="menu"]`)) {
          // 위의 선택자는 예시이며, 실제 DOM 구조에 맞게 조정해야 합니다.
          // 더 간단하게는, 어떤 메뉴가 열려있을 때 페이지의 다른 영역을 클릭하면 닫히도록 합니다.
          // 하지만 이 방식은 다른 클릭 가능한 UI(예: 정렬 버튼)와 충돌할 수 있습니다.
        }
        // 가장 간단한 접근: 현재 activeOptionsMenuId 가 있는데, 클릭된 요소가
        // "더보기" 버튼 (FiMoreHorizontal 아이콘을 포함하는 버튼)이나,
        // 드롭다운 메뉴 자신이 아니라면 닫는다.
        // 이 로직은 개선이 필요할 수 있습니다.
        if (!event.target.closest('.options-menu-button-class') && !event.target.closest('.options-menu-dropdown-class')) {
            // setActiveOptionsMenuId(null); // 이 방식은 다른 요소 클릭 시 무조건 닫힘
        }
      }
    };
    // document.addEventListener('mousedown', handleClickOutside); // 이 부분은 더 정교한 처리가 필요하여 주석 처리
    // return () => {
    //   document.removeEventListener('mousedown', handleClickOutside);
    // };
  }, [activeOptionsMenuId]);


  return (
    <>
      <PageSectionHeader title="여행 후기" />
      <SearchBarWithButton
        placeholder="후기 제목 검색"
        buttonText="새 후기 작성"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onButtonClick={() => navigate('/reviews/write')}
        buttonIcon={FiPlusSquare}
      />
      <FilterSortSection
        showSortOptions={showSortOptions}
        onFilterClick={() => setShowSortOptions(!showSortOptions)}
        sortOptions={sortOptionsConfig}
        currentSortKey={sortOrder}
        onSortOptionClick={(key) => {
          setSortOrder(key);
          setShowSortOptions(false);
          setActiveOptionsMenuId(null); // 정렬 변경 시 메뉴 닫기
        }}
      />
      <div className="flex-grow overflow-y-auto">
        {/* sortedAndFilteredItems가 배열인지, 그리고 요소가 있는지 확인 후 렌더링 */}
        {Array.isArray(sortedAndFilteredItems) && sortedAndFilteredItems.length > 0 ? (
          sortedAndFilteredItems.map((item) => (
            <ReviewItem
              key={item.id}
              item={item}
              onClick={() => {
                setActiveOptionsMenuId(null); // 아이템 클릭 시 메뉴 닫기
                navigate(`/reviews/${item.id}`);
              }}
              isOptionsMenuOpen={activeOptionsMenuId === item.id}
              onToggleOptionsMenu={handleToggleOptionsMenu}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
              // 현재 사용자가 작성자인지 여부는 실제 인증 로직을 통해 결정
              isCurrentUserAuthor={item.author === '여행자A'} // 더미 데이터 기반 임시 조건
            />
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">
            {searchTerm ? '검색 결과가 없습니다.' : '등록된 후기가 없습니다.'}
          </p>
        )}
      </div>
    </>
  );
}

export default ReviewListPage;