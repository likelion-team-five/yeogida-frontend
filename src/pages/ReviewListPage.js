import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader';
import SearchBarWithButton from '../components/common/SearchBarWithButton';
import FilterSortSection from '../components/common/FilterSortSection';
import ReviewItem from '../components/review/ReviewItem';
import { FiPlusSquare } from 'react-icons/fi';
import axiosInstance from '../auth/axiosinstance';
import ss from '../pages/images/ss.jpg';
import gg from '../pages/images/gg.jpg';

const parseDateISO = (isoString) => new Date(isoString);

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
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        sortBy: sortOrder === 'likes' ? 'likes' : 'created_at',
        order: sortOrder === 'oldest' ? 'asc' : 'desc',
      };
      const response = await axiosInstance.get('/api/v1/reviews', { params });
      if (response.status === 200) {
        setReviews(response.data);
      } else {
        setError('리뷰 목록을 불러오는 데 실패했습니다.');
      }
    } catch (err) {
      setError('리뷰 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [sortOrder]);

  useEffect(() => {
    if (!loading && reviews.length === 0 && !error) {
      setReviews([
        {
          reviewId: 1,
          title: '제주도 여행은 언제나 옳다!',
          author: '홍길동',
          createdAt: '2025-05-01T10:00:00Z',
          likes: 12,
          region: '제주',
          place: '성산일출봉',
          image: ss
        },
        {
          reviewId: 2,
          title: '서울의 숨은 맛집 소개',
          author: '김영희',
          createdAt: '2025-05-10T12:30:00Z',
          likes: 8,
          region: '서울',
          place: '을지로',
          image: gg
        }
      ]);
    }
  }, [loading, reviews.length, error]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredReviews = useMemo(() => {
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
      <div ref={filterRef}>
        <FilterSortSection
          showSortOptions={showFilters}
          sortOptions={sortOptionsConfig}
          currentSortKey={sortOrder}
          onSortOptionClick={(key) => setSortOrder(key)}
          onFilterClick={() => setShowFilters((prev) => !prev)}
        />
      </div>

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
                image: review.image || null,
                likes: review.likes,
                region: review.region,
                place: review.place,
              }}
              onClick={() => navigate(`/reviews/${review.reviewId}`)}
              isCurrentUserAuthor={false}
            />
          ))
        )}
      </div>
    </>
  );
}

export default ReviewListPage;
