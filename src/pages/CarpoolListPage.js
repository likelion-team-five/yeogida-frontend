import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader'; // 경로 확인
import SearchBarWithButton from '../components/common/SearchBarWithButton'; // 경로 확인
import FilterSortSection from '../components/common/FilterSortSection'; // 경로 확인
import ListItemCard from '../components/common/ListItemCard'; // 경로 확인
import { FiPlusSquare, FiUsers, FiFilter, FiClock, FiDollarSign, FiNavigation } from 'react-icons/fi'; // FiNavigation 추가
import { FaUserCircle } from 'react-icons/fa'; // 운전자 이미지 없을 시

// 더미 데이터
const initialCarpoolItems = [
  { id: 'cp1', from: '서울역 KTX 타는 곳', to: '부산 해운대 해수욕장', departureTime: '2025-06-10 08:00', availableSeats: 2, totalSeats: 4, price: '30,000', driver: { name: '친절한김기사', profileImg: 'https://via.placeholder.com/40/A52A2A/FFFFFF?Text=D1', rating: 4.8 }, isFemaleOnly: false, vehicleInfo: "SUV (싼타페)" },
  { id: 'cp2', from: '강남 고속버스터미널', to: '강릉 경포해변 중앙광장', departureTime: '2025-06-12 14:00', availableSeats: 1, totalSeats: 3, price: '20,000', driver: { name: '안전운전이여사', profileImg: null, rating: 4.9 }, isFemaleOnly: true, vehicleInfo: "세단 (그랜저)" },
  { id: 'cp3', from: '인천공항 T1 도착층', to: '명동역 4번 출구', departureTime: '2025-06-11 18:30', availableSeats: 3, totalSeats: 3, price: '15,000', driver: { name: '공항전문박프로', profileImg: 'https://via.placeholder.com/40/008000/FFFFFF?Text=D3', rating: 4.5 }, isFemaleOnly: false, vehicleInfo: "승합차 (카니발)" },
  { id: 'cp4', from: '수원시청역', to: '에버랜드 정문', departureTime: '2025-06-15 09:30', availableSeats: 0, totalSeats: 2, price: '10,000', driver: { name: '주말드라이버', profileImg: null, rating: 4.2 }, isFemaleOnly: false, vehicleInfo: "경차 (모닝)" },
];

const sortOptionsConfig = [
  { key: 'departureTime', label: '출발 시간 순' },
  { key: 'priceLow', label: '낮은 가격 순' },
  { key: 'priceHigh', label: '높은 가격 순' },
  { key: 'rating', label: '운전자 평점 순'},
];

// 날짜 포맷팅 헬퍼
const formatDepartureTime = (timeStr) => {
  const date = new Date(timeStr);
  return date.toLocaleString('ko-KR', {
    month: 'short', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: true
  });
};


function CarpoolListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('departureTime');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [filters, setFilters] = useState({ date: '', gender: 'all', seats: 'any' });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const displayedCarpools = useMemo(() => {
    let items = initialCarpoolItems.filter(cp =>
      (`${cp.from} ${cp.to}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cp.driver.name && cp.driver.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filters.gender !== 'all') {
      items = items.filter(cp => filters.gender === 'female' ? cp.isFemaleOnly === true : cp.isFemaleOnly === false); // 남성전용은 없다고 가정
    }
    if (filters.date) {
        items = items.filter(cp => new Date(cp.departureTime).toDateString() === new Date(filters.date).toDateString());
    }
    if (filters.seats !== 'any') {
        items = items.filter(cp => cp.availableSeats >= parseInt(filters.seats));
    }


    switch(sortOrder) {
        case 'priceLow': items.sort((a, b) => parseFloat(a.price.replace(/[^0-9.-]+/g,"")) - parseFloat(b.price.replace(/[^0-9.-]+/g,""))); break;
        case 'priceHigh': items.sort((a, b) => parseFloat(b.price.replace(/[^0-9.-]+/g,"")) - parseFloat(a.price.replace(/[^0-9.-]+/g,""))); break;
        case 'rating': items.sort((a,b) => (b.driver.rating || 0) - (a.driver.rating || 0)); break;
        case 'departureTime':
        default: items.sort((a,b) => new Date(a.departureTime) - new Date(b.departureTime)); break;
    }
    return items;
  }, [searchTerm, sortOrder, filters]);

  const filterControlsCarpool = (
     <div className="flex flex-wrap items-center gap-2">
      <input type="date" value={filters.date} onChange={e => setFilters(prev => ({...prev, date: e.target.value}))} className="text-xs p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"/>
      <select value={filters.gender} onChange={e => setFilters(prev => ({...prev, gender: e.target.value}))} className="text-xs p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
        <option value="all">성별 무관</option>
        <option value="female">여성 선호</option> {/* "여성 전용" 보다는 "선호"가 나을 수 있음 */}
      </select>
      <select value={filters.seats} onChange={e => setFilters(prev => ({...prev, seats: e.target.value}))} className="text-xs p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
        <option value="any">좌석 무관</option>
        <option value="1">1석 이상</option>
        <option value="2">2석 이상</option>
        <option value="3">3석 이상</option>
      </select>
    </div>
  );

  return (
    <>
      <PageSectionHeader title="카풀 찾기" />
      <SearchBarWithButton
        placeholder="출발지 또는 도착지를 입력하세요"
        buttonText="카풀 등록"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onButtonClick={() => navigate('/carpools/write')}
        buttonIcon={FiPlusSquare}
      />
      <FilterSortSection
        filterIcon={FiFilter}
        showSortOptions={showSortOptions}
        onFilterClick={() => setShowSortOptions(!showSortOptions)}
        sortOptions={sortOptionsConfig}
        currentSortKey={sortOrder}
        onSortOptionClick={(key) => { setSortOrder(key); setShowSortOptions(false); }}
        actionButton={filterControlsCarpool}
      />
      <div className="flex-grow overflow-y-auto">
        {displayedCarpools.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {displayedCarpools.map(cp => (
              <ListItemCard
                key={cp.id}
                // 운전자 프로필 이미지를 사용, 없으면 플레이스홀더
                imageUrl={cp.driver.profileImg} // ListItemCard에서 null/undefined 시 플레이스홀더 처리
                title={ // 제목에 출발지와 도착지를 더 강조
                    <div className="flex items-center font-semibold">
                        <span className="truncate max-w-[calc(50%-1rem)]">{cp.from}</span>
                        <FiNavigation size={16} className="text-blue-500 mx-1.5 flex-shrink-0" />
                        <span className="truncate max-w-[calc(50%-1rem)]">{cp.to}</span>
                    </div>
                }
                // subtitle 대신 customContent에 주요 정보 통합
                onClick={() => navigate(`/carpools/${cp.id}`)}
                imageSize="w-10 h-10 rounded-full" // 운전자 프로필 이미지 크기
                imageContainerClassName="mr-3 mt-0.5" // 이미지 오른쪽 마진
                cardClassName="p-3 md:p-4 hover:bg-blue-50 transition-colors" // 카드 패딩 및 호버 효과
                contentClassName="p-0" // ListItemCard 내부 content 영역 패딩 제거 (customContent에서 조절)
                textContainerClassName="flex-grow min-w-0"
                customContent={
                  <div className="text-xs">
                    <div className="flex items-center text-gray-600 mb-1">
                      <FiClock size={13} className="mr-1.5 text-gray-400"/>
                      {formatDepartureTime(cp.departureTime)}
                    </div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <FaUserCircle size={13} className="mr-1.5 text-gray-400"/> {/* 아이콘을 FaUserCircle로 변경 */}
                      운전자: {cp.driver.name} (평점: {cp.driver.rating || 'N/A'})
                    </div>
                    <div className="flex items-center text-gray-600">
                        <FiUsers size={13} className="mr-1.5 text-gray-400"/>
                        남은 좌석: <span className={`font-semibold ml-1 ${cp.availableSeats > 0 ? 'text-green-600' : 'text-red-500'}`}>{cp.availableSeats}</span> / {cp.totalSeats}
                        {cp.isFemaleOnly && <span className="ml-2 px-1.5 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full">여성선호</span>}
                    </div>
                  </div>
                }
                actions={ // 가격 정보
                  <div className="text-right flex flex-col items-end ml-2 flex-shrink-0">
                    <p className="text-sm md:text-base font-bold text-blue-600">{cp.price}원</p>
                    {cp.availableSeats === 0 && <span className="text-xs text-red-500 font-semibold">마감</span>}
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <p className="p-6 text-center text-gray-500">{searchTerm || filters.date || filters.gender !=='all' || filters.seats !=='any' ? '조건에 맞는 카풀이 없습니다.' : '등록된 카풀이 없습니다.'}</p>
        )}
      </div>
    </>
  );
}

export default CarpoolListPage;