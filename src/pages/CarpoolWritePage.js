import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader';
import { FiSave, FiXCircle, FiMapPin, FiClock, FiUsers, FiDollarSign, FiInfo, FiShield, FiPlusCircle, FiEdit3 } from 'react-icons/fi';
import axiosInstance from '../auth/axiosinstance'; // axios 인스턴스

// 수정 모드 데이터 fetch 함수
const fetchExistingCarpoolDataForEdit = async (carpoolId) => {
  if (!carpoolId) return null;
  try {
    const response = await axiosInstance.get(`/api/v1/carpools/${carpoolId}`);
    console.log('GET 기존 카풀 데이터:', response.status, response.data);
    return response.data;
  } catch (error) {
    console.error('기존 카풀 데이터 불러오기 실패:', error);
    throw error;
  }
};

function CarpoolWritePage() {
  const { carpoolId: carpoolIdFromParams } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(carpoolIdFromParams);

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDateTime: '',
    availableSeats: '1',
    pricePerSeat: '',
    description: '',
    vehicleInfo: '',
    isFemaleOnly: false,
    rules: [],
  });
  const [customRule, setCustomRule] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && carpoolIdFromParams) {
      setIsLoading(true);
      fetchExistingCarpoolDataForEdit(carpoolIdFromParams)
        .then(data => {
          if (data) {
            // API로 받은 데이터를 formData 형태에 맞게 조정 필요시 여기서 변환
            setFormData({
              from: data.departure || '',
              to: data.destination || '',
              departureDateTime: data.departure_time ? data.departure_time.slice(0,16) : '', // datetime-local 형식 맞춤 (YYYY-MM-DDTHH:mm)
              availableSeats: data.seats_available?.toString() || '1',
              pricePerSeat: '', // 서버에 가격 정보 있으면 매핑
              description: data.description || '',
              vehicleInfo: '', // 서버에 차량 정보 있으면 매핑
              isFemaleOnly: false, // 서버에 있으면 매핑
              rules: [], // 서버에 있으면 매핑
            });
          } else {
            alert('수정할 카풀 정보를 찾을 수 없습니다.');
            navigate('/carpools');
          }
          setIsLoading(false);
        })
        .catch(error => {
          alert('카풀 정보 로딩 중 오류가 발생했습니다.');
          setIsLoading(false);
          navigate('/carpools');
        });
    }
  }, [isEditMode, carpoolIdFromParams, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddRule = () => {
    if(customRule.trim() && formData.rules.length < 5 && !formData.rules.includes(customRule.trim())) {
      setFormData(prev => ({...prev, rules: [...prev.rules, customRule.trim()]}));
      setCustomRule('');
    } else if (formData.rules.length >= 5) {
      alert('규칙은 최대 5개까지 추가할 수 있습니다.');
    }
  };

  const handleRemoveRule = (ruleToRemove) => {
    setFormData(prev => ({...prev, rules: prev.rules.filter(rule => rule !== ruleToRemove)}));
  };

  // 등록/수정 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수값 체크
    if (!formData.from || !formData.to || !formData.departureDateTime || !formData.availableSeats || !formData.pricePerSeat) {
      alert('별표(*) 표시된 필수 항목을 모두 입력해주세요.');
      return;
    }

    const payload = {
      departure: formData.from,
      destination: formData.to,
      departure_time: new Date(formData.departureDateTime).toISOString(),
      seats_available: parseInt(formData.availableSeats, 10),
      title: formData.description?.slice(0, 20) || '카풀', // 제목은 예시, 필요시 수정
      description: formData.description,
      // 필요시 차량 정보, 규칙 등 추가 필드도 전송
    };

    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(`/api/v1/carpools/${carpoolIdFromParams}`, payload);
        console.log('PUT 카풀 수정 성공:', response.status, response.data);
      } else {
        response = await axiosInstance.post('/api/v1/carpools', payload);
        console.log('POST 카풀 등록 성공:', response.status, response.data);
      }

      alert(`카풀이 ${isEditMode ? '수정' : '등록'}되었습니다!`);
      
      // 성공 후 상세 페이지 또는 목록 페이지 이동
      const newId = isEditMode ? carpoolIdFromParams : response.data.id;
      navigate(`/carpools/${newId}`);

    } catch (error) {
      console.error('카풀 등록/수정 실패:', error.response || error);
      alert('카풀 등록/수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
      navigate(isEditMode && carpoolIdFromParams ? `/carpools/${carpoolIdFromParams}` : '/carpools');
    }
  };

  const commonInputClass = "w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm";
  const commonLabelClass = "block text-sm font-medium text-gray-700 mb-1 flex items-center";
  const RequiredStar = () => <span className="text-red-500 ml-0.5">*</span>;

  if (isEditMode && isLoading) {
    return (
      <>
        <PageSectionHeader title="카풀 정보 로딩 중..." showBackButton onBackClick={handleCancel} />
        <div className="flex-grow flex items-center justify-center p-4">
          <p className="text-gray-500">기존 카풀 정보를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageSectionHeader
        title={isEditMode ? "카풀 정보 수정" : "새 카풀 등록"}
        showBackButton onBackClick={handleCancel}
        actions={
          <div className="flex space-x-2">
            <button onClick={handleCancel} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center space-x-1.5 shadow-sm"><FiXCircle size={16}/><span>취소</span></button>
            <button form="carpool-form" type="submit" className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md flex items-center space-x-1.5 shadow-sm"><FiSave size={16}/><span>{isEditMode ? "수정 완료" : "등록하기"}</span></button>
          </div>
        }
      />
      <div className="flex-grow overflow-y-auto p-4 md:p-6">
        <form id="carpool-form" onSubmit={handleSubmit} className="space-y-6 bg-white p-4 md:p-6 rounded-lg shadow-md">
          {/* 출발지/도착지 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            <div>
              <label htmlFor="from" className={commonLabelClass}><FiMapPin className="mr-1.5 text-gray-400"/>출발지<RequiredStar/></label>
              <input type="text" name="from" id="from" value={formData.from} onChange={handleChange} placeholder="정확한 출발 장소를 입력하세요" className={commonInputClass} required />
            </div>
            <div>
              <label htmlFor="to" className={commonLabelClass}><FiMapPin className="mr-1.5 text-gray-400"/>도착지<RequiredStar/></label>
              <input type="text" name="to" id="to" value={formData.to} onChange={handleChange} placeholder="정확한 도착 장소를 입력하세요" className={commonInputClass} required />
            </div>
          </div>

          {/* 출발시간/모집인원/가격 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-5">
            <div>
              <label htmlFor="departureDateTime" className={commonLabelClass}><FiClock className="mr-1.5 text-gray-400"/>출발 날짜 및 시간<RequiredStar/></label>
              <input type="datetime-local" name="departureDateTime" id="departureDateTime" value={formData.departureDateTime} onChange={handleChange} className={commonInputClass} required />
            </div>
            <div>
              <label htmlFor="availableSeats" className={commonLabelClass}><FiUsers className="mr-1.5 text-gray-400"/>모집 인원 (본인 제외)<RequiredStar/></label>
              <select name="availableSeats" id="availableSeats" value={formData.availableSeats} onChange={handleChange} className={commonInputClass} required>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}명</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="pricePerSeat" className={commonLabelClass}><FiDollarSign className="mr-1.5 text-gray-400"/>1인당 희망 비용 (원)<RequiredStar/></label>
              <input type="number" name="pricePerSeat" id="pricePerSeat" value={formData.pricePerSeat} onChange={handleChange} placeholder="예: 20000" className={commonInputClass} required min="0" step="1000" />
            </div>
          </div>

          {/* 차량 정보 */}
          <div>
            <label htmlFor="vehicleInfo" className={commonLabelClass}><FiInfo className="mr-1.5 text-gray-400"/>차량 정보 (선택)</label>
            <input type="text" name="vehicleInfo" id="vehicleInfo" value={formData.vehicleInfo} onChange={handleChange} placeholder="예: 현대 쏘나타 (흰색), 차량번호 일부" className={commonInputClass} />
          </div>

          {/* 상세 설명 */}
          <div>
            <label htmlFor="description" className={commonLabelClass}><FiEdit3 className="mr-1.5 text-gray-400"/>상세 설명 및 경유지 (선택)</label>
            <textarea name="description" id="description" rows="4" value={formData.description} onChange={handleChange} placeholder="경유지, 운행 스타일 (예: 휴게소 정차 여부, 음악 취향), 기타 전달사항 등을 자유롭게 입력해주세요." className={commonInputClass}></textarea>
          </div>

          {/* 탑승 조건 및 규칙 */}
          <div>
            <label className={commonLabelClass}><FiShield className="mr-1.5 text-gray-400"/>탑승 조건 및 규칙 (선택)</label>
            <div className="mt-2 space-y-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="isFemaleOnly" checked={formData.isFemaleOnly} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">여성 선호 (운전자 또는 동승자 관련)</span>
                </label>
                <div>
                    <div className="text-sm text-gray-700 mb-1">기타 규칙 (최대 5개):</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.rules.map(rule => (
                            <span key={rule} className="flex items-center gap-1 px-2.5 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                                {rule} <button type="button" onClick={() => handleRemoveRule(rule)} className="text-gray-500 hover:text-gray-700"><FiXCircle size={12}/></button>
                            </span>
                        ))}
                    </div>
                    {formData.rules.length < 5 && (
                        <div className="flex items-center gap-2">
                            <input type="text" value={customRule} onChange={e => setCustomRule(e.target.value)} onKeyDown={e => {if (e.key === 'Enter') {e.preventDefault(); handleAddRule();}}} placeholder="예: 금연 (입력 후 Enter 또는 버튼)" className="flex-grow p-2 border border-gray-300 rounded-md text-sm"/>
                            <button type="button" onClick={handleAddRule} className="px-3 py-2 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded-md flex items-center space-x-1"><FiPlusCircle size={14}/><span>규칙 추가</span></button>
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* 하단 액션 버튼 */}
          <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button type="button" onClick={handleCancel} className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none">취소</button>
            <button type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">{isEditMode ? "카풀 정보 수정" : "카풀 등록하기"}</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CarpoolWritePage;
