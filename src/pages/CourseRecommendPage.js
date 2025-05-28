import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader';
import SearchBarWithButton from '../components/common/SearchBarWithButton';
import FilterSortSection from '../components/common/FilterSortSection';
import ListItemCard from '../components/common/ListItemCard';
import { FiFilter, FiHeart, FiMapPin, FiCalendar, FiStar } from 'react-icons/fi';
import bb from '../pages/images/bb.jpg';
import hh from '../pages/images/hh.jpg';
import dd from '../pages/images/dd.jpg';

const sortOptionsConfig = [
  { key: 'rating', label: '높은 평점순' },
  { key: 'recent', label: '최신 추천순' },
];

const regions = ['all', '서울', '강원도', '부산'];
const themes = ['all', '힐링', '드라이브', '맛집탐방'];

function CourseRecommendPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('rating');
  const [activeFilters, setActiveFilters] = useState({ region: 'all', theme: 'all' });
  const [courses, setCourses] = useState([]);
  const [loading] = useState(false);
  const [error] = useState(null);
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    const dummyCourses = [
      {
        id: '1',
        name: '서울 한옥 힐링 투어',
        description: '북촌 한옥마을과 창덕궁을 걸으며 전통의 멋을 느껴보세요.',
        theme: ['힐링', '고궁'],
        region: '서울',
        duration: '1일',
        sites: ['북촌 한옥마을', '창덕궁', '인사동'],
        imageUrl: hh,
        rating: 4.8,
        estimatedCost: { currency: '₩', amount: '15,000' },
      },
      {
        id: '2',
        name: '강원도 감성 드라이브',
        description: '고성 해안도로를 따라 펼쳐지는 바다와 숲의 조화!',
        theme: ['드라이브', '힐링'],
        region: '강원도',
        duration: '1박 2일',
        sites: ['고성 해안도로', '속초 중앙시장'],
        imageUrl: dd,
        rating: 4.6,
        estimatedCost: { currency: '₩', amount: '40,000' },
      },
      {
        id: '3',
        name: '부산 맛집 탐방',
        description: '국제시장부터 해운대까지! 입이 즐거운 부산 여행.',
        theme: ['맛집탐방'],
        region: '부산',
        duration: '2일',
        sites: ['자갈치시장', '해운대', '광안리'],
        imageUrl: bb,
        rating: 4.9,
        estimatedCost: { currency: '₩', amount: '55,000' },
      },
    ];

    setCourses(dummyCourses);
  }, []);

  const displayedCourses = useMemo(() => {
    let items = courses;

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      items = items.filter(course =>
        (course.name && course.name.toLowerCase().includes(lower)) ||
        (course.description && course.description.toLowerCase().includes(lower)) ||
        (course.theme && course.theme.some(t => t.toLowerCase().includes(lower)))
      );
    }

    if (activeFilters.region !== 'all') {
      items = items.filter(course =>
        course.region && course.region.toLowerCase() === activeFilters.region.toLowerCase()
      );
    }
    if (activeFilters.theme !== 'all') {
      items = items.filter(course =>
        course.theme && course.theme.some(t => t.toLowerCase() === activeFilters.theme.toLowerCase())
      );
    }

    switch (sortOrder) {
      case 'recent':
        items = items.slice().sort((a, b) => (b.id || '').localeCompare(a.id || ''));
        break;
      case 'rating':
      default:
        items = items.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
    return items;
  }, [courses, searchTerm, activeFilters, sortOrder]);

  const filterControls = (
    <div className="flex items-center space-x-2">
      <select
        value={activeFilters.region}
        onChange={(e) => setActiveFilters(prev => ({ ...prev, region: e.target.value }))}
        className="text-xs p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      >
        {regions.map(r => (
          <option key={r} value={r}>{r === 'all' ? '지역 전체' : r}</option>
        ))}
      </select>
      <select
        value={activeFilters.theme}
        onChange={(e) => setActiveFilters(prev => ({ ...prev, theme: e.target.value }))}
        className="text-xs p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      >
        {themes.map(t => (
          <option key={t} value={t}>{t === 'all' ? '테마 전체' : t}</option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <PageSectionHeader title="AI 추천 여행 코스" />

      <SearchBarWithButton
        placeholder="어떤 여행 코스를 찾으시나요? (예: 서울, 힐링)"
        searchTerm={searchTerm}
        onSearchChange={e => setSearchTerm(e.target.value)}
      />

      <FilterSortSection
        filterIcon={FiFilter}
        showSortOptions={showSortOptions}
        onFilterClick={() => setShowSortOptions(!showSortOptions)}
        sortOptions={sortOptionsConfig}
        currentSortKey={sortOrder}
        onSortOptionClick={key => { setSortOrder(key); setShowSortOptions(false); }}
        actionButton={filterControls}
      />

      <div className="flex-grow overflow-y-auto p-0 md:p-4">
        {!loading && !error && (
          displayedCourses.length > 0 ? (
            <div className="divide-y divide-gray-100 md:divide-y-0 md:space-y-4">
              {displayedCourses.map(course => (
                <div
                  key={course.id}
                  className="group md:rounded-lg md:shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden"
                >
                  <ListItemCard
                    imageUrl={course.imageUrl}
                    title={course.name}
                    tags={course.theme ? course.theme.map(t => ({ name: t })) : []}
                    imageSize="w-full h-40 md:h-48"
                    imageContainerClassName="md:rounded-t-lg"
                    onClick={() => navigate(`/courses/${course.id}`)}
                    cardClassName="p-0"
                    contentClassName="p-3 md:p-4 flex-grow"
                    textContainerClassName="flex flex-col justify-between flex-grow"
                    badge={
                      <button
                        onClick={(e) => { e.stopPropagation(); alert(`코스 ID ${course.id} 찜하기!`); }}
                        className="p-1.5 bg-black bg-opacity-30 text-white rounded-full hover:bg-opacity-50 transition-opacity"
                        title="찜하기"
                      >
                        <FiHeart size={16} />
                      </button>
                    }
                    customContent={
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2 mb-2">
                          {course.description}
                        </p>
                        <div className="border-t border-gray-100 pt-2 mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span className="flex items-center"><FiCalendar size={13} className="mr-1" />{course.duration}</span>
                            <span className="flex items-center"><FiMapPin size={13} className="mr-1" />{course.sites?.length || 0}개 경유지</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>예상 비용: {course.estimatedCost?.currency} {course.estimatedCost?.amount}</span>
                            <span className="flex items-center font-semibold text-amber-500">
                              <FiStar size={14} className="mr-0.5 fill-current" /> {course.rating ? course.rating.toFixed(1) : 'N/A'}
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
          )
        )}
      </div>
    </>
  );
}

export default CourseRecommendPage;
