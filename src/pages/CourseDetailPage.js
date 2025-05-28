import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader';
import { FiMapPin, FiClock, FiDollarSign, FiChevronLeft, FiChevronRight, FiNavigation, FiUsers } from 'react-icons/fi';
import axiosinstance from "../auth/axiosinstance"

function CarpoolDetailPage() {
  const { carpool_id } = useParams(); // URL 파라미터
  const navigate = useNavigate();

  const [carpool, setCarpool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!carpool_id) {
      navigate('/carpools', { replace: true });
      return;
    }

    const fetchCarpoolDetail = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/api/v1/carpools/${carpool_id}`);
        setCarpool(response.data);
      } catch (error) {
        console.error('카풀 상세 정보 로딩 실패:', error);
        alert('카풀 정보를 불러오지 못했습니다.');
        navigate('/carpools', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarpoolDetail();
  }, [carpool_id, navigate]);

  const handleGoBack = () => {
    navigate('/carpools');
  };

  const navigateImage = (direction) => {
    if (!carpool || !carpool.images || carpool.images.length === 0) return;
    let newIndex = currentImageIndex + direction;
    if (newIndex < 0) newIndex = carpool.images.length - 1;
    else if (newIndex >= carpool.images.length) newIndex = 0;
    setCurrentImageIndex(newIndex);
  };

  if (isLoading) {
    return (
      <>
        <PageSectionHeader title="카풀 정보 로딩 중..." showBackButton onBackClick={handleGoBack} />
        <div className="flex-grow flex items-center justify-center p-4">
          <p className="text-gray-500">카풀 정보를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  if (!carpool) {
    return (
      <>
        <PageSectionHeader title="오류" showBackButton onBackClick={handleGoBack} />
        <div className="flex-grow flex items-center justify-center p-4">
          <p className="text-red-500">카풀 정보를 찾을 수 없습니다.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageSectionHeader
        title={carpool.title || '카풀 상세'}
        showBackButton
        onBackClick={handleGoBack}
      />
      <div className="flex-grow overflow-y-auto bg-gray-50">
        {/* 이미지 슬라이더 (만약 images 필드가 있고 길이가 1 이상일 때) */}
        {carpool.images && carpool.images.length > 0 ? (
          <div className="relative group bg-black">
            <div className="aspect-[16/9] w-full">
              <img
                src={carpool.images[currentImageIndex]}
                alt={`카풀 이미지 ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            {carpool.images.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage(-1)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  aria-label="이전 이미지"
                >
                  <FiChevronLeft size={28} />
                </button>
                <button
                  onClick={() => navigateImage(1)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  aria-label="다음 이미지"
                >
                  <FiChevronRight size={28} />
                </button>
              </>
            )}
          </div>
        ) : null}

        <div className="p-4 md:p-6 bg-white rounded-md shadow-md m-4">
          {/* 기본 정보 */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2">{carpool.title}</h1>
            <div className="text-gray-700 mb-2">{carpool.description}</div>
            <div className="grid grid-cols-2 gap-4 text-gray-600 text-sm">
              <div className="flex items-center">
                <FiMapPin className="mr-1" /> 출발지: {carpool.departure}
              </div>
              <div className="flex items-center">
                <FiMapPin className="mr-1" /> 도착지: {carpool.destination}
              </div>
              <div className="flex items-center">
                <FiClock className="mr-1" /> 출발 시간: {new Date(carpool.departure_time).toLocaleString('ko-KR')}
              </div>
              <div className="flex items-center">
                <FiUsers className="mr-1" /> 좌석 수: {carpool.seats_available}석
              </div>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <section>
            <h2 className="text-lg font-semibold mb-3">댓글 ({carpool.comments?.length || 0})</h2>
            {carpool.comments && carpool.comments.length > 0 ? (
              <ul className="space-y-3 max-h-60 overflow-y-auto border border-gray-200 rounded p-3">
                {carpool.comments.map((comment) => (
                  <li key={comment.id} className="bg-gray-100 p-2 rounded">
                    <p>{comment.content}</p>
                    <small className="text-gray-500">{new Date(comment.created_at).toLocaleString('ko-KR')}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">등록된 댓글이 없습니다.</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default CarpoolDetailPage;
