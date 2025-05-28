import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader';
import { FiClock, FiMapPin, FiUsers, FiDollarSign, FiUser, FiInfo, FiEdit, FiTrash2 } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import axiosInstance from '../auth/axiosinstance';

const fetchCarpoolDetailData = async (carpoolId) => {
  if (!carpoolId) return null;
  try {
    const response = await axiosInstance.get(`/api/v1/carpools/${carpoolId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("API 호출 실패, 상태 코드:", response.status);
      throw new Error("응답 실패");
    }
  } catch (error) {
    console.error("카풀 정보 로딩 실패:", error);
    throw error;
  }
};

const deleteCarpool = async (carpoolId) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/carpools/${carpoolId}`);
    return response.status === 204;
  } catch (error) {
    console.error("카풀 삭제 실패:", error);
    return false;
  }
};

function CarpoolDetailPage() {
  const { carpoolId } = useParams();
  const navigate = useNavigate();
  const [carpool, setCarpool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (carpoolId) {
      fetchCarpoolDetailData(carpoolId)
        .then(data => {
          setCarpool({
            ...data,
            driver: data.driver || { name: "홍길동", rating: "N/A", profileImg: "", totalDrives: 0, bio: "안전하게 모시겠습니다." },
            vehicle: data.vehicle || { type: "세단", model: "쏘나타", color: "검정", number: "12가 3456" },
            rules: data.rules || ["금연", "음식물 반입 금지"],
            comments: data.comments || []
          });
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          navigate('/carpools', { replace: true });
        });
    }
  }, [carpoolId, navigate]);

  const handleGoBack = () => navigate('/carpools');
  const handleEdit = () => navigate(`/carpools/${carpoolId}/edit`);
  const handleDelete = async () => {
    if (window.confirm("정말 이 카풀을 삭제하시겠습니까?")) {
      const success = await deleteCarpool(carpoolId);
      if (success) {
        alert("카풀이 삭제되었습니다.");
        navigate('/carpools');
      } else {
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <PageSectionHeader title="로딩 중..." showBackButton onBackClick={handleGoBack} />
        <div className="p-4 text-center">카풀 정보를 불러오는 중...</div>
      </>
    );
  }

  if (!carpool) {
    return (
      <>
        <PageSectionHeader title="오류" showBackButton onBackClick={handleGoBack} />
        <div className="p-4 text-center">카풀 정보를 찾을 수 없습니다.</div>
      </>
    );
  }

  const departureDate = new Date(carpool.departure_time);
  const arrivalDate = new Date(carpool.estimated_arrival_time);

  return (
    <>
      <PageSectionHeader
        title={carpool.title || "카풀 상세 정보"}
        showBackButton onBackClick={handleGoBack}
        actions={
          <div className="flex space-x-2">
            <button onClick={handleEdit} className="p-2 text-blue-600 hover:bg-blue-100 rounded"><FiEdit size={18} /></button>
            <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-100 rounded"><FiTrash2 size={18} /></button>
          </div>
        }
      />
      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 flex items-center"><FiUser className="mr-2" />운전자 정보</h2>
          <div className="flex items-center mb-2">
            {carpool.driver.profileImg ? (
              <img src={carpool.driver.profileImg} alt={carpool.driver.name} className="w-10 h-10 rounded-full mr-3 object-cover border" />
            ) : (
              <FaUserCircle size={40} className="text-gray-300 mr-3" />
            )}
            <div>
              <p className="text-sm font-medium">{carpool.driver.name}</p>
              <p className="text-xs text-gray-500">별점: {carpool.driver.rating} (총 {carpool.driver.totalDrives}회 운행)</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{carpool.driver.bio}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2 flex items-center"><FiInfo className="mr-2" />차량 정보</h2>
          <p className="text-sm">종류: {carpool.vehicle.type}</p>
          <p className="text-sm">모델: {carpool.vehicle.model}</p>
          <p className="text-sm">색상: {carpool.vehicle.color}</p>
          <p className="text-sm">번호판: {carpool.vehicle.number}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">여정 상세</h2>
          <p className="text-sm flex items-center"><FiMapPin className="mr-2 text-blue-500" />출발지: {carpool.departure}</p>
          <p className="text-sm flex items-center"><FiMapPin className="mr-2 text-blue-500" />도착지: {carpool.destination}</p>
          <p className="text-sm flex items-center"><FiClock className="mr-2 text-blue-500" />출발 시간: {departureDate.toLocaleString('ko-KR')}</p>
          <p className="text-sm flex items-center"><FiClock className="mr-2 text-blue-500" />예상 도착 시간: {arrivalDate.toLocaleString('ko-KR')}</p>
          <p className={`text-sm flex items-center ${carpool.seats_available > 0 ? 'text-green-600' : 'text-red-500'}`}><FiUsers className="mr-2 text-blue-500" />{carpool.passengers?.length || 0}명 참여 / {carpool.seats_available > 0 ? `${carpool.seats_available}석 가능` : '마감'}</p>
          <p className="text-sm flex items-center"><FiDollarSign className="mr-2 text-blue-500" />1인당 비용: {carpool.price_per_seat ? `${carpool.price_per_seat}원` : '정보 없음'}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">설명</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line">{carpool.description || "설명이 없습니다."}</p>
        </div>

        {carpool.rules && carpool.rules.length > 0 && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">탑승 규칙</h2>
            <ul className="list-disc pl-5 text-sm text-gray-600">
              {carpool.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {carpool.comments && carpool.comments.length > 0 && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">댓글</h2>
            <ul className="space-y-2">
              {carpool.comments.map((comment) => (
                <li key={comment.id} className="border-b pb-2">
                  <p className="text-sm text-gray-600">{comment.content}</p>
                  <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString('ko-KR')}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default CarpoolDetailPage;
