import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader';
import SearchBarWithButton from '../components/common/SearchBarWithButton';
import FilterSortSection from '../components/common/FilterSortSection';
import { FiPlusSquare, FiUsers, FiFilter, FiClock, FiNavigation } from 'react-icons/fi';
import { AiFillPicture } from 'react-icons/ai';
import axiosInstance from '../auth/axiosinstance';
import ListItemCard from '../components/ListItemCard';

const sortOptionsConfig = [
  { key: 'departureTime', label: '출발 시간 순' },
  { key: 'seats', label: '남은 좌석 순' },
];

const formatDepartureTime = (timeStr) => {
  if (!timeStr) return '날짜 정보 없음';
  const date = new Date(timeStr);
  return isNaN(date) ? '잘못된 날짜' : date.toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

function CarpoolListPage() {
  const navigate = useNavigate();
  const [carpools, setCarpools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('departureTime');
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    const fetchCarpools = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/api/v1/carpools');
        console.log('[카풀 목록] 상태코드:', response.status);
        console.log('[카풀 목록] 데이터:', response.data);
        setCarpools(response.data);
      } catch (err) {
        console.error('카풀 데이터 불러오기 실패:', err);
        setError('카풀 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarpools();
  }, []);

  const displayedCarpools = useMemo(() => {
    let items = [...carpools];

    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      items = items.filter(cp =>
        (`${cp.departure} ${cp.destination}`.toLowerCase().includes(lowerTerm)) ||
        (cp.title && cp.title.toLowerCase().includes(lowerTerm))
      );
    }

    switch (sortOrder) {
      case 'seats':
        items.sort((a, b) => b.seats_available - a.seats_available);
        break;
      case 'departureTime':
      default:
        items.sort((a, b) => new Date(a.departure_time) - new Date(b.departure_time));
        break;
    }

    return items;
  }, [carpools, searchTerm, sortOrder]);

  return (
    <>
      <PageSectionHeader title="카풀 목록" />

      <SearchBarWithButton
        placeholder="출발지 또는 도착지를 입력하세요"
        buttonText="카풀 등록"
        searchTerm={searchTerm}
        onSearchChange={e => setSearchTerm(e.target.value)}
        onButtonClick={() => navigate('/carpools/write')}
        buttonIcon={FiPlusSquare}
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
      />

      <div className="flex-grow overflow-y-auto p-4">
        {isLoading ? (
          <p className="text-center text-gray-500">카풀 목록을 불러오는 중입니다...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : displayedCarpools.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {displayedCarpools.map(cp => (
              <ListItemCard
                key={cp.id}
                imageElement={
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <AiFillPicture size={30} className="text-black-400" />
                  </div>
                }
                title={
                  <div className="flex flex-col">
                    <div className="text-sm font-bold">{cp.title || '제목 없음'}</div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="truncate max-w-[45%]">{cp.departure}</span>
                      <FiNavigation size={14} className="mx-1 text-blue-500" />
                      <span className="truncate max-w-[45%]">{cp.destination}</span>
                    </div>
                  </div>
                }
                onClick={() => navigate(`/carpools/${cp.id}`)}
                imageSize="w-10 h-10 rounded-full"
                imageContainerClassName="mr-3 mt-0.5"
                cardClassName="p-3 md:p-4 hover:bg-blue-50 transition-colors cursor-pointer"
                contentClassName="p-0"
                textContainerClassName="flex-grow min-w-0"
                customContent={
                  <div className="text-xs">
                    <div className="flex items-center text-gray-600 mb-1">
                      <FiClock size={13} className="mr-1.5 text-gray-400" />
                      {formatDepartureTime(cp.departure_time)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiUsers size={13} className="mr-1.5 text-gray-400" />
                      남은 좌석: <span className={`ml-1 font-semibold ${cp.seats_available > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {cp.seats_available}
                      </span>
                    </div>
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 p-6">등록된 카풀이 없습니다.</p>
        )}
      </div>
    </>
  );
}

export default CarpoolListPage;