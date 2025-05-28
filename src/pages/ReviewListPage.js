import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader';
import SearchBarWithButton from '../components/common/SearchBarWithButton';
import FilterSortSection from '../components/common/FilterSortSection';
import ReviewItem from '../components/review/ReviewItem';
import { FiPlusSquare } from 'react-icons/fi';
import axiosInstance from '../auth/axiosinstance';

// 날짜 문자열 ISO → Date 객체 변환 함수
const parseDateISO = (isoString) => {
  return new Date(isoString);
};

const sortOptionsConfig = [
  { key: 'latest', label: '최신순' },
  { key: 'likes', label: '좋아요순' },
  { key: 'oldest', label: '오래된순' },
];

function ReviewListPage() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API에서 리뷰 리스트 가져오기
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        sortBy: sortOrder === 'likes' ? 'likes' : 'created_at',
        order: sortOrder === 'oldest' ? 'asc' : 'desc',
      };
      console.log('Fetching reviews with params:', params); // 디버깅 콘솔
      const response = await axiosInstance.get('/api/v1/reviews', { params });

      // 디버깅: 상태 코드 확인
      console.log('API Response Status Code:', response.status); // 상태 코드 (200 등)
      console.log('API Response:', response.data); // 응답 데이터

      // 상태 코드가 200일 때만 데이터를 처리
      if (response.status === 200) {
        setReviews(response.data);
      } else {
        setError('리뷰 목록을 불러오는 데 실패했습니다.');
      }
    } catch (err) {
      setError('리뷰 목록을 불러오는 데 실패했습니다.');
      console.error('Error fetching reviews:', err); // 디버깅 콘솔
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시, 정렬/검색 조건 변경 시마다 API 호출
  useEffect(() => {
    console.log('Sort order changed:', sortOrder); // 디버깅 콘솔
    fetchReviews();
  }, [sortOrder]);

  // 검색어로 필터링
  const filteredReviews = useMemo(() => {
    console.log('Filtering reviews with search term:', searchTerm); // 디버깅 콘솔
    if (!searchTerm.trim()) return reviews;
    const lowerSearch = searchTerm.toLowerCase();
    return reviews.filter((review) =>
      review.title.toLowerCase().includes(lowerSearch) ||
      review.author.toLowerCase().includes(lowerSearch) ||
      (review.region && review.region.toLowerCase().includes(lowerSearch)) ||
      (review.place && review.place.toLowerCase().includes(lowerSearch))
    );
  }, [reviews, searchTerm]);

  return (
    <>
      <PageSectionHeader title="여행 후기" />
      <SearchBarWithButton
        placeholder="후기 제목, 작성자, 지역, 장소로 검색"
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        buttonText="새 후기 작성"
        buttonIcon={FiPlusSquare}
        onButtonClick={() => navigate('/reviews/write')}
      />
      <FilterSortSection
        showSortOptions={true}
        sortOptions={sortOptionsConfig}
        currentSortKey={sortOrder}
        onSortOptionClick={(key) => setSortOrder(key)}
        onFilterClick={() => {}}
      />

      <div className="flex-grow overflow-y-auto p-4">
        {loading && <p className="text-center text-gray-500">불러오는 중...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && filteredReviews.length === 0 && (
          <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
        )}

        {!loading && !error && filteredReviews.length > 0 && (
          filteredReviews.map((review) => (
            <ReviewItem
              key={review.reviewId}
              item={{
                id: review.reviewId,
                title: review.title,
                author: review.author,
                datetime: review.createdAt,
                image: null, // API에 이미지 필드 없으면 null 처리
                likes: review.likes,
                region: review.region,
                place: review.place,
              }}
              onClick={() => navigate(`/reviews/${review.reviewId}`)}
              isCurrentUserAuthor={false} // 인증 정보 연동 시 변경
            />
          ))
        )}
      </div>
    </>
  );
}

export default ReviewListPage;
