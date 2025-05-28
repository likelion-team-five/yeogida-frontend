import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageSectionHeader from "../components/common/PageSectionHeader"; // 경로 확인
import CommentInput from "../components/review/CommentInput"; // 경로 확인
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineHeart, AiFillHeart, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BsCardImage, BsArrowReturnRight } from "react-icons/bs";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axiosInstance from "../auth/axiosinstance"; // axios 인스턴스

// 테스트용 로그인된 사용자 정보
const loggedInUser = {
  profileImageUrl: 'https://via.placeholder.com/40/LoggedInUser/FFFFFF?Text=Me', // 로그인된 사용자 이미지 (테스트용)
};

// 후기 상세 정보를 가져오는 API 호출
const fetchReviewDetailData = async (reviewId) => {
  if (!reviewId) return null;
  try {
    const response = await axiosInstance.get(`/api/v1/reviews/${reviewId}`);
    return response.data; // 실제 후기 데이터 반환
  } catch (error) {
    console.error("후기 상세 정보를 가져오는 데 오류가 발생했습니다:", error);
    throw error; // 오류 발생 시 에러 처리
  }
};

// 댓글 작성 API
const submitComment = async (reviewId, commentText) => {
  try {
    const response = await axiosInstance.post(`/api/v1/reviews/${reviewId}/comments`, { text: commentText });
    return response.data; // 새로 작성된 댓글 반환
  } catch (error) {
    console.error("댓글 작성 오류:", error);
    throw error;
  }
};

// 좋아요 API
const toggleLikeReview = async (reviewId, isLiked) => {
  try {
    const url = `/api/v1/reviews/${reviewId}/likes`;
    const method = isLiked ? 'delete' : 'post'; // 좋아요 취소는 DELETE, 좋아요 추가는 POST
    const response = await axiosInstance[method](url);
    return response.data; // 성공적인 응답 반환
  } catch (error) {
    console.error("좋아요 오류:", error);
    throw error;
  }
};

// 후기 삭제 API
const deleteReview = async (reviewId) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/reviews/${reviewId}`);
    return response.data; // 삭제된 후기 반환
  } catch (error) {
    console.error("후기 삭제 오류:", error);
    throw error;
  }
};

// 댓글 삭제 API
const deleteComment = async (reviewId, commentId) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/reviews/${reviewId}/comments/${commentId}`);
    return response.data; // 삭제된 댓글 반환
  } catch (error) {
    console.error("댓글 삭제 오류:", error);
    throw error;
  }
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
      fetchReviewDetailData(reviewId).then((data) => {
        if (data) {
          setReview(data);
          setIsLiked(data.isLikedByCurrentUser); // 사용자가 이미 좋아요를 눌렀는지 여부를 설정
        } else {
          navigate('/reviews', { replace: true }); // 데이터가 없으면 목록으로 이동
        }
        setIsLoading(false);
      }).catch((error) => {
        console.error("후기 상세 정보를 가져오는 데 오류가 발생했습니다:", error);
        setIsLoading(false);
        navigate('/reviews', { replace: true });
      });
    } else {
      setIsLoading(false);
      navigate('/reviews', { replace: true });
    }
  }, [reviewId, navigate]);

  const handleLike = async () => {
    try {
      const updatedReview = await toggleLikeReview(review.id, isLiked);
      setIsLiked(!isLiked);
      setReview((prevReview) => ({
        ...prevReview,
        likes: updatedReview.likes,
      }));
    } catch (error) {
      console.error("좋아요 추가 오류:", error);
    }
  };

  const handleEdit = () => {
    if (review) {
      navigate(`/reviews/${review.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (review && window.confirm('정말로 이 후기를 삭제하시겠습니까?')) {
      try {
        await deleteReview(review.id);
        alert(`후기 ID ${review.id} 삭제 완료`);
        navigate('/reviews');
      } catch (error) {
        console.error("후기 삭제 오류:", error);
        alert("후기 삭제 실패");
      }
    }
  };

  const handleSubmitComment = async (commentText) => {
    try {
      const newComment = await submitComment(review.id, commentText);
      setReview((prevReview) => ({
        ...prevReview,
        comments: [...prevReview.comments, newComment],
      }));
      alert("댓글이 등록되었습니다.");
    } catch (error) {
      console.error("댓글 작성 오류:", error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  const handleGoBack = () => {
    navigate('/reviews');
  };

  const navigateImage = (direction) => {
    if (!review || !review.images || review.images.length === 0) return;
    let newIndex = currentImageIndex + direction;
    if (newIndex < 0) newIndex = review.images.length - 1;
    else if (newIndex >= review.images.length) newIndex = 0;
    setCurrentImageIndex(newIndex);
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
          {review.authorProfileImg ? (
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
              {comment.profileImg ? (
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
