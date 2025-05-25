// src/pages/CourseRecommendPage.js
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader'; // 경로 확인
import SearchBarWithButton from '../components/common/SearchBarWithButton'; // 경로 확인
import FilterSortSection from '../components/common/FilterSortSection'; // 경로 확인
import ListItemCard from '../components/common/ListItemCard'; // 경로 확인
import { FiFilter, FiHeart, FiMapPin, FiCalendar, FiStar } from 'react-icons/fi';

// 더미 데이터 (실제로는 API를 통해 AI 추천 코스를 받아옴)
const initialRecommendedCourses = [
  { id: 'ai_course_1', title: 'AI 추천! 여유로운 주말, 서울 고궁 나들이 코스', summary: '경복궁에서 시작하여 창덕궁 후원까지, 조선의 아름다움을 느껴보세요. 주변 맛집과 찻집도 함께 추천합니다.', thumbnailUrl: 'https://via.placeholder.com/300x200/B0E0E6/000000?Text=Seoul+Palace', tags: [{name: '서울'}, {name: '주말'}, {name: '고궁'}, {name: '힐링'}], rating: 4.8, duration: '반나절', totalStops: 5, estimatedCost: '3만원 이내' },
  { id: 'ai_course_2', title: '자연과 함께! 강원도 1박 2일 힐링 드라이브 코스', summary: '설악산의 절경과 동해안의 푸른 바다를 따라 드라이브하며 스트레스를 날려보세요. 신선한 해산물 맛집도 포함!', thumbnailUrl: 'https://via.placeholder.com/300x200/90EE90/000000?Text=Gangwon+Drive', tags: [{name: '강원도'}, {name: '1박2일'}, {name: '자연'}, {name: '드라이브'}], rating: 4.5, duration: '1박 2일', totalStops: 7, estimatedCost: '15만원 내외' },
  { id: 'ai_course_3', title: '미식가를 위한 부산 당일치기 맛집 완전 정복', summary: '돼지국밥, 밀면, 씨앗호떡부터 신선한 해산물까지! 부산의 대표 먹거리를 하루에 모두 즐겨보세요.', thumbnailUrl: 'https://via.placeholder.com/300x200/FFA07A/FFFFFF?Text=Busan+Foodie', tags: [{name: '부산'}, {name: '당일치기'}, {name: '맛집탐방'}, {name: '미식'}], rating: 4.9, duration: '1일', totalStops: 6, estimatedCost: '5만원 이내' },
  { id: 'ai_course_4', title: '아이와 함께! 경기도 체험 학습 주말 나들이', summary: '박물관, 과학관, 자연휴양림 등 아이들의 호기심을 자극하고 함께 즐길 수 있는 교육적인 코스입니다.', thumbnailUrl: 'https://via.placeholder.com/300x200/FFDAB9/000000?Text=Gyeonggi+Kids', tags: [{name: '경기도'}, {name: '주말'}, {name: '아이와함께'}, {name: '체험학습'}], rating: 4.6, duration: '1일', totalStops: 4, estimatedCost: '7만원 내외' },
];

const sortOptionsConfig = [
  { key: 'rating', label: '높은 평점순' },
  { key: 'popularity', label: '인기순 (예시)' },
  { key: 'recent', label: '최신 추천순' },
];

function CourseRecommendPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('rating');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ region: 'all', theme: 'all', duration: 'all' });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const displayedCourses = useMemo(() => {
    let items = initialRecommendedCourses.filter(course =>
      (course.title && course.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.summary && course.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.tags && course.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    if (activeFilters.region !== 'all') {
      items = items.filter(course => course.tags && course.tags.some(tag => tag.name.toLowerCase().includes(activeFilters.region.toLowerCase())));
    }
    if (activeFilters.theme !== 'all') {
      items = items.filter(course => course.tags && course.tags.some(tag => tag.name.toLowerCase().includes(activeFilters.theme.toLowerCase())));
    }
    // 기간 필터 로직 (필요시 추가)

    switch (sortOrder) {
      case 'recent':
        items.sort((a, b) => (b.id || '').localeCompare(a.id || '')); // ID 기반 임시 정렬
        break;
      case 'popularity':
        items.sort((a,b) => ((b.rating || 0) * 100 + (b.totalStops || 0)) - ((a.rating || 0) * 100 + (a.totalStops || 0)) );
        break;
      case 'rating':
      default:
        items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    return items;
  }, [searchTerm, sortOrder, activeFilters]);

  const filterControls = (
    <div className="flex items-center space-x-2">
      <select
        value={activeFilters.region}
        onChange={(e) => setActiveFilters(prev => ({ ...prev, region: e.target.value }))}
        className="text-xs p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      >
        <option value="all">지역 전체</option>
        <option value="서울">서울</option>
        <option value="강원도">강원도</option>
        <option value="부산">부산</option>
        <option value="경기도">경기도</option>
        <option value="제주">제주도</option>
      </select>
      <select
        value={activeFilters.theme}
        onChange={(e) => setActiveFilters(prev => ({ ...prev, theme: e.target.value }))}
        className="text-xs p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      >
        <option value="all">테마 전체</option>
        <option value="힐링">힐링</option>
        <option value="드라이브">드라이브</option>
        <option value="맛집탐방">맛집탐방</option>
        <option value="고궁">고궁</option>
        <option value="아이와함께">아이와함께</option>
      </select>
    </div>
  );

  return (
    <>
      <PageSectionHeader title="AI 추천 여행 코스" />
      <SearchBarWithButton
        placeholder="어떤 여행 코스를 찾으시나요? (예: 서울, 힐링)"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        // 생성 기능 없으므로 buttonText, onButtonClick 제거
      />
      <FilterSortSection
        filterIcon={FiFilter}
        showSortOptions={showSortOptions}
        onFilterClick={() => setShowSortOptions(!showSortOptions)}
        sortOptions={sortOptionsConfig}
        currentSortKey={sortOrder}
        onSortOptionClick={(key) => {
          setSortOrder(key);
          setShowSortOptions(false);
        }}
        actionButton={filterControls}
      />
      <div className="flex-grow overflow-y-auto p-0 md:p-4">
        {displayedCourses.length > 0 ? (
          <div className="divide-y divide-gray-100 md:divide-y-0 md:space-y-4">
            {displayedCourses.map(course => (
              <div
                key={course.id}
                className="group md:rounded-lg md:shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden"
                // ListItemCard에 onClick을 직접 전달하여 클릭 가능하도록 함
              >
                <ListItemCard
                  imageUrl={course.thumbnailUrl}
                  title={course.title}
                  // description prop은 짧은 요약 정보로 활용 가능 (여기서는 customContent에 포함)
                  tags={course.tags}
                  imageSize="w-full h-40 md:h-48" // 이미지 크기 조정 (w-full로 너비 꽉 채움)
                  imageContainerClassName="md:rounded-t-lg" // 데스크탑에서 이미지 상단 모서리 둥글게
                  onClick={() => navigate(`/courses/${course.id}`)}
                  cardClassName="p-0" // ListItemCard 자체의 패딩은 제거하고 내부에서 조절
                  contentClassName="p-3 md:p-4 flex-grow" // 콘텐츠 영역 패딩
                  textContainerClassName="flex flex-col justify-between flex-grow" // 내부 요소들이 공간을 채우도록
                  badge={ // 찜하기 버튼
                    <button
                        onClick={(e) => { e.stopPropagation(); alert(`코스 ID ${course.id} 찜하기!`); }}
                        className="p-1.5 bg-black bg-opacity-30 text-white rounded-full hover:bg-opacity-50 transition-opacity"
                        title="찜하기"
                    >
                        <FiHeart size={16}/>
                    </button>
                  }
                  customContent={
                    <div className="mt-2"> {/* customContent 상단 간격 */}
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2 mb-2">
                        {course.summary}
                      </p>
                      <div className="border-t border-gray-100 pt-2 mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span className="flex items-center"><FiCalendar size={13} className="mr-1"/>{course.duration}</span>
                          <span className="flex items-center"><FiMapPin size={13} className="mr-1"/>{course.totalStops}개 경유지</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>예상 비용: {course.estimatedCost}</span>
                          <span className="flex items-center font-semibold text-amber-500">
                            <FiStar size={14} className="mr-0.5 fill-current"/> {course.rating ? course.rating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="p-6 text-center text-gray-500">
            {searchTerm ? '검색된 추천 코스가 없습니다.' : '추천 코스가 없습니다.'}
          </p>
        )}
      </div>
    </>
  );
}

export default CourseRecommendPage;