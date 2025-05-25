import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader';
import { FiMapPin, FiClock, FiDollarSign, FiStar, FiEdit, FiHeart, FiShare2, FiNavigation, FiList, FiTag, FiInfo, FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';

// 더미 데이터 및 fetch 함수
const fetchCourseDetailData = async (courseId) => {
  if (!courseId) return null;
  console.log(`Fetching course detail for ID: ${courseId}`);
  // API 호출 시뮬레이션 (initialRecommendedCourses에서 ID로 찾기)
  return new Promise(resolve => {
    setTimeout(() => {
      const course = initialRecommendedCourses.find(c => c.id === courseId) || // initialRecommendedCourses는 CourseRecommendPage의 데이터를 가져와야 함
                     // 또는 별도의 상세 데이터 구조 정의
                     { // 임시 상세 데이터
                        id: courseId,
                        title: `AI 추천 상세! ${courseId} 완전 정복`,
                        summary: `이 코스는 ${courseId}를 탐험하는 최고의 방법입니다. AI가 엄선한 경유지와 액티비티를 즐겨보세요.`,
                        description: `코스에 대한 아주 상세한 설명입니다. 각 경유지별 특징, 이동 방법, 예상 소요 시간, 팁 등을 포함합니다.\n\n1. 첫 번째 경유지: 아름다운 풍경과 역사적인 의미가 있는 곳입니다. (예상 소요: 2시간)\n   - 추천 활동: 사진 촬영, 산책\n   - 참고: 입장료 있음\n\n2. 두 번째 경유지: 현지 음식을 맛볼 수 있는 최고의 맛집입니다. (예상 소요: 1시간 30분)\n   - 추천 메뉴: 지역 특산물 요리\n\n3. 세 번째 경유지: ...`,
                        thumbnailUrl: `https://via.placeholder.com/800x400/A2D2FF/000000?Text=Course+Detail+${courseId}`,
                        images: [
                            `https://via.placeholder.com/600x350/BDE0FE/000000?Text=${courseId}+Stop+1`,
                            `https://via.placeholder.com/600x350/FFC8DD/000000?Text=${courseId}+Stop+2`,
                            `https://via.placeholder.com/600x350/FFAFCC/000000?Text=${courseId}+Stop+3`,
                        ],
                        tags: [{name: 'AI추천'}, {name: '핵심코스'}, {name: '특별한경험'}],
                        rating: 4.7,
                        duration: '1박 2일',
                        totalStops: 8,
                        estimatedCost: '20만원',
                        stops: [
                            { id: 's1', name: '첫 번째 경유지: A 박물관', description: '역사와 예술을 동시에 느낄 수 있는 곳.', lat: 37.5665, lng: 126.9780, image: `https://via.placeholder.com/150/BDE0FE/000000?Text=${courseId}+S1` },
                            { id: 's2', name: '두 번째 경유지: B 전통 시장', description: '활기 넘치는 시장에서 현지 음식을 맛보세요.', lat: 37.5700, lng: 126.9790, image: `https://via.placeholder.com/150/FFC8DD/000000?Text=${courseId}+S2` },
                            { id: 's3', name: '세 번째 경유지: C 전망대', description: '도시의 아름다운 야경을 감상할 수 있습니다.', lat: 37.5650, lng: 126.9800, image: `https://via.placeholder.com/150/FFAFCC/000000?Text=${courseId}+S3` },
                        ],
                        isFavoritedByCurrentUser: false,
                     };
      resolve(course);
    }, 300);
  });
};
// CourseRecommendPage의 initialRecommendedCourses 데이터를 이 파일에서도 접근 가능하도록 하거나,
// 별도의 데이터 소스(예: context, Redux, 또는 API 호출)에서 가져와야 합니다.
// 여기서는 임시로 fetchCourseDetailData 내부에 상세 데이터 구조를 포함시켰습니다.
const initialRecommendedCourses = [ /* CourseRecommendPage의 더미 데이터와 동일하게 정의 */ ];


function CourseDetailPage() {
  const { courseId } = useParams(); // App.js에서 설정한 :courseId 파라미터
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    if (courseId) {
      setIsLoading(true);
      fetchCourseDetailData(courseId).then(data => {
        if (data) {
          setCourse(data);
          setIsFavorited(data.isFavoritedByCurrentUser || false);
        } else {
          navigate('/courses', { replace: true }); // 코스 정보 없으면 목록으로
        }
        setIsLoading(false);
      }).catch(error => {
        console.error("Error fetching course detail:", error);
        setIsLoading(false);
        navigate('/courses', { replace: true });
      });
    } else {
      setIsLoading(false);
      navigate('/courses', { replace: true });
    }
  }, [courseId, navigate]);

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // 실제 API 호출로 찜 상태 업데이트
    console.log(`Course ${courseId} 찜 상태 변경: ${!isFavorited}`);
  };

  const navigateImage = (direction) => {
    if (!course || !course.images || course.images.length === 0) return;
    let newIndex = currentImageIndex + direction;
    if (newIndex < 0) newIndex = course.images.length - 1;
    else if (newIndex >= course.images.length) newIndex = 0;
    setCurrentImageIndex(newIndex);
  };

  const handleGoBack = () => navigate('/courses');

  if (isLoading) {
    return (
      <>
        <PageSectionHeader title="코스 정보 로딩 중..." showBackButton onBackClick={handleGoBack} />
        <div className="flex-grow flex items-center justify-center p-4"><p>추천 코스 정보를 불러오고 있습니다...</p></div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <PageSectionHeader title="오류" showBackButton onBackClick={handleGoBack} />
        <div className="flex-grow flex items-center justify-center p-4"><p>코스 정보를 찾을 수 없습니다.</p></div>
      </>
    );
  }

  return (
    <>
      <PageSectionHeader
        title={course.title}
        showBackButton
        onBackClick={handleGoBack}
        actions={
          <div className="flex items-center space-x-2">
            <button onClick={handleToggleFavorite} className={`p-2 rounded-full transition-colors ${isFavorited ? 'bg-red-100 text-red-500 hover:bg-red-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-red-500'}`} title={isFavorited ? "찜 해제" : "찜하기"}>
              <FiHeart size={20} className={isFavorited ? "fill-current" : ""}/>
            </button>
            <button onClick={() => alert('공유 기능!')} className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 hover:text-blue-500 transition-colors" title="공유하기">
              <FiShare2 size={20}/>
            </button>
            {/* AI 추천 코스는 보통 수정 기능이 없음 */}
            {/* <button className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200" title="수정"><FiEdit size={18}/></button> */}
          </div>
        }
      />
      <div className="flex-grow overflow-y-auto bg-gray-50">
        {/* 대표 이미지 또는 이미지 슬라이더 */}
        {course.images && course.images.length > 0 ? (
          <div className="relative group bg-black">
             <div className="aspect-[16/9] w-full"> {/* 높이 조절은 이 비율로 */}
                <img src={course.images[currentImageIndex]} alt={`코스 이미지 ${currentImageIndex + 1}`} className="w-full h-full object-cover" />
             </div>
            {course.images.length > 1 && (
              <>
                <button onClick={() => navigateImage(-1)} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" aria-label="이전"><FiChevronLeft size={28}/></button>
                <button onClick={() => navigateImage(1)} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" aria-label="다음"><FiChevronRight size={28}/></button>
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {course.images.map((_, idx) => (<button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`block w-2.5 h-2.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white scale-110' : 'bg-gray-400 opacity-60 hover:bg-white'}`}></button>))}
                </div>
              </>
            )}
          </div>
        ) : course.thumbnailUrl ? (
          <div className="aspect-[16/9] w-full bg-gray-200"><img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" /></div>
        ) : null}

        <div className="p-4 md:p-6">
          {/* 코스 기본 정보 */}
          <section className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-2xl font-bold text-gray-800 leading-tight">{course.title}</h1>
                <span className="flex items-center text-lg font-bold text-amber-500">
                    <FiStar size={20} className="mr-1 fill-current"/> {course.rating.toFixed(1)}
                </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{course.summary}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {course.tags.map(tag => (
                <span key={tag.name} className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">{tag.name}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm border-t border-gray-100 pt-3">
              <div className="flex items-center text-gray-700"><FiCalendar size={16} className="mr-1.5 text-gray-500"/>기간: {course.duration}</div>
              <div className="flex items-center text-gray-700"><FiMapPin size={16} className="mr-1.5 text-gray-500"/>경유지: {course.totalStops}곳</div>
              <div className="flex items-center text-gray-700"><FiDollarSign size={16} className="mr-1.5 text-gray-500"/>예상비용: {course.estimatedCost}</div>
            </div>
          </section>

          {/* 코스 상세 설명 */}
          {course.description && (
            <section className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center"><FiInfo size={20} className="mr-2"/>코스 소개</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {course.description}
              </div>
            </section>
          )}

          {/* 경유지 목록 */}
          {course.stops && course.stops.length > 0 && (
            <section className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><FiList size={20} className="mr-2"/>주요 경유지</h2>
              <div className="space-y-4">
                {course.stops.map((stop, index) => (
                  <div key={stop.id} className="flex items-start p-3 border border-gray-100 rounded-md hover:shadow-sm transition-shadow">
                    <span className="mr-3 mt-1 flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</span>
                    {stop.image && <img src={stop.image} alt={stop.name} className="w-20 h-20 object-cover rounded-md mr-3 flex-shrink-0"/>}
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-800">{stop.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{stop.description}</p>
                      {/* 여기에 지도 링크나 간단한 정보 추가 가능 */}
                    </div>
                    <button onClick={() => alert(`경로안내: ${stop.name}`)} className="ml-2 p-1.5 text-blue-500 hover:bg-blue-50 rounded-full" title="경로 안내">
                        <FiNavigation size={18}/>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
          {/* 관련 후기, 댓글 등 추가 섹션 가능 */}
        </div>
      </div>
    </>
  );
}

export default CourseDetailPage;