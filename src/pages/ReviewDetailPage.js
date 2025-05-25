import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageSectionHeader from '../components/common/PageSectionHeader'; // 경로 확인
import CommentInput from '../components/review/CommentInput'; // 경로 확인
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineHeart, AiFillHeart, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { BsCardImage, BsChatDots, BsArrowReturnRight } from 'react-icons/bs';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// 더미 데이터 및 fetch 함수 (실제로는 API 호출)
const fetchReviewDetailData = async (reviewId) => {
  if (!reviewId) return null;
  console.log(`Fetching review detail for ID: ${reviewId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleData = {
        id: reviewId,
        title: `샘플 후기: ${reviewId}의 멋진 경험`,
        author: '여행가김샘플',
        // authorProfileImg: 'https://via.placeholder.com/40/7B68EE/FFFFFF?Text=S', // 이미지가 있는 경우
        authorProfileImg: null, // 이미지가 없는 경우 테스트용
        date: '2025년 05월 10일',
        content: `이것은 ${reviewId}에 대한 상세 후기 내용입니다. \n아주 즐거운 여행이었고, 다양한 경험을 했습니다. 특히 음식이 맛있었고 풍경이 아름다웠습니다. \n\n다음에 또 방문하고 싶은 곳입니다. 여러분께도 강력 추천합니다!\n\n#샘플태그 #여행 #추천`,
        images: [
          `https://via.placeholder.com/800x500/ADD8E6/000000?Text=Sample+Image+1+for+${reviewId}`,
          `https://via.placeholder.com/800x500/90EE90/000000?Text=Sample+Image+2+for+${reviewId}`,
          `https://via.placeholder.com/800x500/FFB6C1/000000?Text=Sample+Image+3+for+${reviewId}`,
        ],
        likes: Math.floor(Math.random() * 200) + 50,
        isLikedByCurrentUser: Math.random() < 0.5,
        isCurrentUserAuthor: reviewId === 'review1', // 예시: review1의 작성자만 현재 유저
        comments: [
          { id: 'c1', user: '댓글러1', profileImg: undefined, text: `정말 좋은 후기네요, ${reviewId}에 대한 정보 감사합니다!`, date: '3일 전', isReply: false },
          { id: 'c2', user: '여행가김샘플', profileImg: undefined,  text: '읽어주셔서 감사합니다!', date: '2일 전', isReply: true, replyingTo: '댓글러1' },
          { id: 'c3', user: '익명사용자', profileImg: undefined,  text: '잘 봤습니다~', date: '1일 전', isReply: false },
        ]
      };
      resolve(sampleData);
    }, 300);
  });
};


function ReviewDetailPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reviewId) {
      setIsLoading(true);
      fetchReviewDetailData(reviewId).then(data => {
        if (data) {
          setReview(data);
          setIsLiked(data.isLikedByCurrentUser);
        } else {
          navigate('/reviews', { replace: true });
        }
        setIsLoading(false);
      }).catch(error => {
        console.error("Error fetching review detail:", error);
        setIsLoading(false);
        navigate('/reviews', { replace: true });
      });
    } else {
      setIsLoading(false);
      navigate('/reviews', { replace: true });
    }
  }, [reviewId, navigate]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setReview(prev => prev ? ({ ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 }) : null);
    // 실제 API 호출
  };

  const handleEdit = () => {
    if (review) {
      navigate(`/reviews/${review.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (review && window.confirm('정말로 이 후기를 삭제하시겠습니까?')) {
      console.log(`Deleting review ID ${review.id}`);
      // 실제 API 호출
      alert(`후기 ID ${review.id} 삭제 완료`);
      navigate('/reviews');
    }
  };

  const navigateImage = (direction) => {
    if (!review || !review.images || review.images.length === 0) return;
    let newIndex = currentImageIndex + direction;
    if (newIndex < 0) newIndex = review.images.length - 1;
    else if (newIndex >= review.images.length) newIndex = 0;
    setCurrentImageIndex(newIndex);
  };

  const handleSubmitComment = (commentText) => {
    if (!review) return;
    console.log(`Submitting comment for review ${review.id}:`, commentText);
    const newCommentEntry = {
      id: `c${Date.now()}`,
      user: '현재사용자', // 실제로는 로그인된 사용자 정보 사용
      profileImg: loggedInUser.profileImageUrl, // 현재 로그인 유저 프로필 이미지
      text: commentText,
      date: '방금 전',
      isReply: false,
    };
    setReview(prev => prev ? ({ ...prev, comments: [...prev.comments, newCommentEntry] }) : null);
    alert('댓글이 등록되었습니다.');
    // 실제 API 호출
  };

  const handleGoBack = () => {
    navigate('/reviews');
  };

  // 현재 로그인한 사용자 정보 (예시, 실제로는 인증 상태에서 가져옴)
  const loggedInUser = {
    // profileImageUrl: 'https://via.placeholder.com/40/LoggedInUser/FFFFFF?Text=Me', // 로그인 유저 이미지 있는 경우
    profileImageUrl: null, // 로그인 유저 이미지 없는 경우 테스트용
  };

  if (isLoading) {
    return (
      <>
        <PageSectionHeader title="로딩 중..." showBackButton={true} onBackClick={handleGoBack} />
        <div className="flex-grow flex items-center justify-center p-4">
          <p className="text-gray-500">후기 정보를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  if (!review) {
    return (
      <>
        <PageSectionHeader title="오류" showBackButton={true} onBackClick={handleGoBack} />
        <div className="flex-grow flex items-center justify-center p-4">
          <p className="text-red-500">후기 정보를 불러올 수 없습니다. 목록으로 돌아갑니다.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageSectionHeader
        title={review.title}
        showBackButton={true}
        onBackClick={handleGoBack}
        actions={
          review.isCurrentUserAuthor && (
            <div className="flex space-x-2">
              <button onClick={handleEdit} className="text-blue-600 hover:text-blue-700 p-1.5 rounded-md hover:bg-blue-50" title="수정">
                <AiOutlineEdit size={20} />
              </button>
              <button onClick={handleDelete} className="text-red-500 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50" title="삭제">
                <AiOutlineDelete size={20} />
              </button>
            </div>
          )
        }
      />
      <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-white">
        {/* 작성자 정보 */}
        <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
          {review.authorProfileImg ? ( // <--- 수정된 부분: 작성자 프로필 이미지 또는 플레이스홀더
            <img src={review.authorProfileImg} alt={review.author} className="w-10 h-10 rounded-full mr-3 object-cover"/>
          ) : (
            <FaUserCircle size={40} className="text-gray-300 mr-3" />
          )}
          <div>
            <p className="font-semibold text-gray-800">{review.author}</p>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>
        </div>

        {/* 이미지 슬라이더 */}
        {review.images && review.images.length > 0 && (
          <div className="mb-6 relative group">
            <div className="aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <img src={review.images[currentImageIndex]} alt={`후기 이미지 ${currentImageIndex + 1}`} className="w-full h-full object-contain" />
            </div>
            {review.images.length > 1 && (
              <>
                <button onClick={() => navigateImage(-1)} className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" aria-label="이전 이미지"><FiChevronLeft size={24}/></button>
                <button onClick={() => navigateImage(1)} className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" aria-label="다음 이미지"><FiChevronRight size={24}/></button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {review.images.map((_, idx) => (<button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`block w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'bg-white scale-125' : 'bg-gray-400 opacity-70 hover:bg-white'}`}></button>))}
                </div>
              </>
            )}
          </div>
        )}
        {(!review.images || review.images.length === 0) && ( <div className="w-full aspect-[16/10] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-6 shadow-md"><BsCardImage size={60} /></div>)}

        {/* 본문 내용 */}
        <div className="prose prose-sm sm:prose-base max-w-none mb-6 whitespace-pre-line text-gray-700 leading-relaxed">{review.content}</div>

        {/* 좋아요 버튼 및 통계 */}
        <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-6">
          <button onClick={handleLike} className={`flex items-center space-x-1.5 px-3 py-2 rounded-md transition-colors text-sm ${isLiked ? 'text-red-500 bg-red-50 hover:bg-red-100 font-semibold' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>
            {isLiked ? <AiFillHeart size={20}/> : <AiOutlineHeart size={20}/>}
            <span>{isLiked ? '좋아요 취소' : '좋아요'}</span>
          </button>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{review.likes}</span>명이 좋아합니다 <span className="mx-2 text-gray-300">|</span> <span className="font-semibold">{review.comments.length}</span>개의 댓글
          </div>
        </div>

        {/* 댓글 목록 */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4">댓글 ({review.comments.length})</h3>
        <div className="space-y-4 mb-6">
          {review.comments.map(comment => (
            <div key={comment.id} className={`flex ${comment.isReply ? 'ml-8 md:ml-10' : ''}`}>
              {comment.isReply && <BsArrowReturnRight size={18} className="text-gray-400 mr-2 mt-1.5 flex-shrink-0"/>}
              {comment.profileImg ? ( // <--- 수정된 부분: 댓글 작성자 프로필 이미지 또는 플레이스홀더
                <img src={comment.profileImg} alt={comment.user} className="w-8 h-8 rounded-full mr-2.5 flex-shrink-0 object-cover"/>
              ) : (
                <FaUserCircle size={32} className="text-gray-300 mr-2.5 flex-shrink-0" />
              )}
              <div className="flex-1 bg-gray-50 p-3 rounded-lg shadow-sm">
                <div className="flex justify-between items-baseline"><p className="text-sm font-semibold text-gray-700">{comment.user} {comment.replyingTo && <span className="text-xs text-gray-500">to @{comment.replyingTo}</span>}</p><p className="text-xs text-gray-400">{comment.date}</p></div>
                <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
              </div>
            </div>
          ))}
          {review.comments.length === 0 && <p className="text-gray-500">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>}
        </div>

        {/* 댓글 입력 */}
        <CommentInput
          currentUserImageUrl={loggedInUser.profileImageUrl} // 현재 로그인 유저 이미지 (없으면 CommentInput 내부에서 처리)
          onSubmitComment={handleSubmitComment}
        />
      </div>
    </>
  );
}

export default ReviewDetailPage;