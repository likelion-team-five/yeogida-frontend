import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // 사용자 프로필 아이콘 (로그인 시 실제 프로필 이미지로 대체 가능)
import { FiSend } from "react-icons/fi"; // 보내기 아이콘

function CommentInput({
  currentUserImageUrl, // 현재 로그인한 사용자 프로필 이미지 URL
  placeholder = "따뜻한 댓글을 남겨주세요...",
  onSubmitComment, // (commentText: string) => void 형태의 콜백 함수
  buttonText = "등록",
  isReplyingTo, // 답글 대상 (예: '사용자이름')
  onCancelReply, // 답글 모드 취소 함수
}) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;
    if (onSubmitComment) {
      onSubmitComment(commentText);
    }
    setCommentText(""); // 입력창 비우기
    if (isReplyingTo && onCancelReply) {
      // 답글 모드였다면 취소
      onCancelReply();
    }
  };

  return (
    <div className="mt-auto pt-4 border-t border-gray-200">
      {isReplyingTo && (
        <div className="text-xs text-gray-500 mb-1.5 px-1 flex justify-between items-center">
          <span>@{isReplyingTo}님에게 답글 작성 중...</span>
          <button
            onClick={onCancelReply}
            className="text-red-500 hover:underline"
          >
            취소
          </button>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex items-start space-x-2 md:space-x-3"
      >
        {currentUserImageUrl ? (
          <img
            src={currentUserImageUrl}
            alt="내 프로필"
            className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover flex-shrink-0 mt-0.5"
          />
        ) : (
          <FaUserCircle
            size={34}
            className="text-gray-300 flex-shrink-0 mt-0.5"
          />
        )}
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={placeholder}
          rows="1" // 기본 한 줄, 내용에 따라 늘어남 (CSS나 JS로 조절 필요)
          className="flex-grow p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[44px]"
          onKeyDown={(e) => {
            // Shift+Enter는 줄바꿈, Enter는 전송
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={commentText.trim() === ""}
          className="px-3 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5"
        >
          <FiSend size={16} />
          <span>{buttonText}</span>
        </button>
      </form>
    </div>
  );
}

CommentInput.defaultProps = {
  onSubmitComment: (text) => console.log("Comment submitted:", text),
};

export default CommentInput;
