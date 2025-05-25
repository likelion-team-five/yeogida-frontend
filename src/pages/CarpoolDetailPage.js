import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader';
import { FiUser, FiClock, FiMapPin, FiUsers, FiDollarSign, FiMessageCircle, FiEdit, FiTrash2, FiCheckCircle, FiXCircle, FiShield, FiInfo, FiPhoneCall, FiNavigation } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

// 더미 데이터 및 fetch 함수
const fetchCarpoolDetailData = async (carpoolId) => {
  if (!carpoolId) return null;
  console.log(`Fetching carpool detail for ID: ${carpoolId}`);
  return new Promise(resolve => setTimeout(() => resolve({
    id: carpoolId,
    from: '서울역 KTX 타는 곳 앞 (스타벅스 앞)',
    to: '부산 해운대 해수욕장 입구 (관광안내소 옆)',
    departureTime: '2025-06-10 08:00:00',
    estimatedArrivalTime: '2025-06-10 13:30:00',
    availableSeats: 2,
    totalSeats: 4,
    pricePerSeat: '30,000원',
    driver: { name: '친절한김기사', profileImg: null, rating: 4.8, totalDrives: 120, bio: "안전하고 편안한 운행을 약속드립니다. 비흡연 차량이며, 시간 약속을 중요하게 생각합니다. 간단한 음료는 드셔도 괜찮습니다." },
    vehicle: { type: 'SUV', model: '현대 싼타페 (2023년형)', color: '흰색', number: '12가3456' },
    routeDescription: "중간에 안성휴게소에서 15분 정차 예정입니다. 도착지 근처 지하철역(해운대역)까지는 협의 후 이동 가능합니다.",
    rules: ["반려동물 동승 불가", "차내 금연", "음식물은 냄새 없는 것만", "시간 엄수"],
    isFemaleOnly: false,
    passengers: [
      { id: 'p1', name: '여행객A', profileImg: null },
      { id: 'p2', name: '직장인B', profileImg: null },
    ],
    isCurrentUserDriver: carpoolId === 'cp1', // 예시: cp1의 운전자만 현재 유저
    currentUserApplicationStatus: carpoolId === 'cp2' ? 'pending' : null, // 예시
  }), 300));
};

// InfoItem 컴포넌트
const InfoItem = ({ icon: Icon, label, value, valueClassName = "text-gray-800 font-medium" }) => (
  <div className="flex items-start py-2.5">
    <Icon size={18} className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
    <div className="flex-grow">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className={`text-sm ${valueClassName}`}>{value}</p>
    </div>
  </div>
);

// Section 컴포넌트
const Section = ({ title, icon: Icon, children }) => (
    <section className="bg-white p-4 sm:p-5 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <Icon size={20} className="mr-2 text-blue-600" /> {title}
        </h2>
        {children}
    </section>
);

function CarpoolDetailPage() {
  const { carpoolId } = useParams();
  const navigate = useNavigate();
  const [carpool, setCarpool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    if (carpoolId) {
      setIsLoading(true);
      fetchCarpoolDetailData(carpoolId).then(data => {
        if (data) {
          setCarpool(data);
          setApplicationStatus(data.currentUserApplicationStatus);
        } else { navigate('/carpools', { replace: true }); }
        setIsLoading(false);
      }).catch(error => {
        console.error("Error fetching carpool detail:", error);
        setIsLoading(false); navigate('/carpools', { replace: true });
      });
    } else { setIsLoading(false); navigate('/carpools', { replace: true }); }
  }, [carpoolId, navigate]);

  const handleApply = () => { setApplicationStatus('pending'); alert('카풀을 신청했습니다.'); };
  const handleCancelApplication = () => { setApplicationStatus(null); alert('카풀 신청을 취소했습니다.'); };
  const handleGoBack = () => navigate('/carpools');

  if (isLoading) {
    return (
        <>
          <PageSectionHeader title="로딩 중..." showBackButton onBackClick={handleGoBack} />
          <div className="flex-grow flex items-center justify-center p-4"><p>카풀 정보를 불러오는 중...</p></div>
        </>
    );
  }

  if (!carpool) {
    return (
        <>
          <PageSectionHeader title="오류" showBackButton onBackClick={handleGoBack} />
          <div className="flex-grow flex items-center justify-center p-4"><p>카풀 정보를 찾을 수 없습니다.</p></div>
        </>
    );
  }

  const departureDate = new Date(carpool.departureTime);
  const arrivalDate = new Date(carpool.estimatedArrivalTime);

  return (
    <>
      <PageSectionHeader
        title="카풀 상세 정보"
        showBackButton onBackClick={handleGoBack}
        actions={
          carpool.isCurrentUserDriver && (
            <div className="flex space-x-2">
              <button onClick={() => navigate(`/carpools/${carpool.id}/edit`)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md" title="수정"><FiEdit size={18}/></button>
              <button onClick={() => { if(window.confirm('이 카풀을 삭제하시겠습니까?')) { alert('카풀이 삭제되었습니다. (API 호출 필요)'); navigate('/carpools');}}} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md" title="삭제"><FiTrash2 size={18}/></button>
            </div>
          )
        }
      />
      <div className="flex-grow overflow-y-auto bg-gray-50 p-3 sm:p-4">
        {/* 운전자 정보 */}
        <Section title="운전자 정보" icon={FiUser}>
          <div className="flex items-center mb-3">
            {carpool.driver.profileImg ?
              <img src={carpool.driver.profileImg} alt={carpool.driver.name} className="w-16 h-16 rounded-full mr-4 border object-cover"/> :
              <FaUserCircle size={64} className="text-gray-300 mr-4"/>
            }
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-800">{carpool.driver.name}</h3>
              <p className="text-xs text-gray-500">별점: {carpool.driver.rating || 'N/A'} (총 {carpool.driver.totalDrives || 0}회 운행)</p>
            </div>
            <button className="ml-auto p-2 text-blue-500 hover:bg-blue-50 rounded-full" title="메시지 보내기 (구현필요)">
              <FiMessageCircle size={22} />
            </button>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{carpool.driver.bio}</p>
        </Section>

        {/* 여정 정보 */}
        <Section title="여정 상세" icon={FiNavigation}>
          <InfoItem icon={FiMapPin} label="출발지" value={carpool.from} />
          <InfoItem icon={FiMapPin} label="도착지" value={carpool.to} />
          <InfoItem icon={FiClock} label="출발 시간" value={departureDate.toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12:true })} />
          <InfoItem icon={FiClock} label="예상 도착 시간" value={arrivalDate.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12:true })} />
          <InfoItem icon={FiUsers} label="모집 현황" value={`${carpool.passengers.length}명 참여 / ${carpool.availableSeats > 0 ? `${carpool.availableSeats}석 가능` : '마감'}`} valueClassName={carpool.availableSeats > 0 ? "text-green-600 font-semibold" : "text-red-500 font-semibold"} />
          <InfoItem icon={FiDollarSign} label="1인당 비용" value={`${carpool.pricePerSeat}원`} />
          {carpool.isFemaleOnly && <InfoItem icon={FiShield} label="탑승 조건" value="여성 선호" valueClassName="text-pink-600 font-semibold" />}
        </Section>

        {/* 차량 및 규칙 정보 */}
        <Section title="차량 및 추가 정보" icon={FiInfo}>
            <h4 className="text-sm font-semibold text-gray-700 mb-0.5">차량 정보</h4>
            <p className="text-sm text-gray-600 mb-2">{carpool.vehicle.type} ({carpool.vehicle.model}, {carpool.vehicle.color}, {carpool.vehicle.number})</p>
            {carpool.routeDescription && <>
                <h4 className="text-sm font-semibold text-gray-700 mt-2 mb-0.5">경로 설명</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line mb-2">{carpool.routeDescription}</p>
            </>}
            {carpool.rules.length > 0 && (
                <>
                    <h4 className="text-sm font-semibold text-gray-700 mt-2 mb-1">카풀 규칙</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5 pl-1">
                        {carpool.rules.map((rule, i) => <li key={i}>{rule}</li>)}
                    </ul>
                </>
            )}
        </Section>

        {/* 참여자 목록 */}
        <Section title={`현재 참여자 (${carpool.passengers.length}명)`} icon={FiUsers}>
          {carpool.passengers.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {carpool.passengers.map(p => (
                <div key={p.id} className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  {p.profileImg ?
                    <img src={p.profileImg} alt={p.name} className="w-6 h-6 rounded-full object-cover"/> :
                    <FaUserCircle size={24} className="text-gray-400"/>
                  }
                  <span className="text-sm text-gray-700">{p.name}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-500">아직 참여한 인원이 없습니다.</p>}
        </Section>

        {/* 신청 버튼 영역 */}
        {!carpool.isCurrentUserDriver && (
          <div className="p-3 mt-2 sticky bottom-3 bg-gray-50 z-10">
            {applicationStatus === null && carpool.availableSeats > 0 && (
              <button onClick={handleApply} className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 text-base">
                <FiCheckCircle size={20}/>
                <span>카풀 신청하기 ({carpool.availableSeats}석 남음)</span>
              </button>
            )}
            {applicationStatus === 'pending' && (
                 <div className="w-full py-3 bg-yellow-100 text-yellow-700 font-semibold rounded-lg shadow-md text-center flex items-center justify-center space-x-2">
                    <FiClock size={20}/>
                    <span>신청 수락 대기 중...</span>
                    <button onClick={handleCancelApplication} className="ml-2 text-xs text-yellow-600 hover:underline">(신청 취소)</button>
                </div>
            )}
            {applicationStatus === 'approved' && (
                <div className="w-full py-3 bg-green-100 text-green-700 font-semibold rounded-lg shadow-md text-center flex items-center justify-center space-x-2">
                    <FiCheckCircle size={20}/>
                    <span>카풀 참여 확정!</span>
                </div>
            )}
             {carpool.availableSeats === 0 && applicationStatus !== 'approved' && (
                <div className="w-full py-3 bg-gray-200 text-gray-600 font-semibold rounded-lg shadow-md text-center">모집 마감</div>
             )}
          </div>
        )}
      </div>
    </>
  );
}

export default CarpoolDetailPage;