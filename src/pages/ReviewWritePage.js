import React, { useState, useEffect } from "react";
import PageSectionHeader from "../components/common/PageSectionHeader";
import { FiUploadCloud, FiTag, FiSave, FiXCircle } from "react-icons/fi";
import axiosInstance from "../auth/axiosinstance";

const fetchExistingReviewDataForEdit = async (reviewIdToEdit) => {
  if (!reviewIdToEdit) return null;
  console.log(`Fetching review data for editing: ${reviewIdToEdit}`);

  try {
    const response = await axiosInstance.get(`/api/v1/reviews/${reviewIdToEdit}`);
    console.log("Fetched data for editing:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching review data for edit:", error);
    throw error;
  }
};

function ReviewWritePage({ reviewIdToEdit, onNavigate }) {
  const isEditMode = Boolean(reviewIdToEdit);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentTagInput, setCurrentTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && reviewIdToEdit) {
      setIsLoading(true);
      fetchExistingReviewDataForEdit(reviewIdToEdit)
        .then((data) => {
          if (data) {
            setTitle(data.title || "");
            setContent(data.content || "");
            setImages(data.images || []);
            setTags(data.tags || []);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching review data for edit:", error);
          setIsLoading(false);
          if (onNavigate) onNavigate("reviews");
        });
    }
  }, [isEditMode, reviewIdToEdit, onNavigate]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (images.length + files.length > 5) {
      alert("사진은 최대 5장까지 첨부할 수 있습니다.");
      return;
    }
    const newImages = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file: file,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (imageId) => {
    const imageToRemove = images.find((img) => img.id === imageId);
    if (imageToRemove && imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleTagInputKeyDown = (event) => {
    if (event.key === "Enter" && currentTagInput.trim()) {
      event.preventDefault();
      if (tags.length < 10 && !tags.includes(currentTagInput.trim())) {
        setTags((prev) => [...prev, currentTagInput.trim()]);
      }
      setCurrentTagInput("");
    } else if (
      event.key === "Backspace" &&
      !currentTagInput &&
      tags.length > 0
    ) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const getCsrfTokenFromCookie = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='));
    return cookieValue ? cookieValue.split('=')[1] : null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("title", title);
    formDataToSubmit.append("content", content);
    tags.forEach((tag) => formDataToSubmit.append("tags[]", tag));
    images.forEach((img) => {
      if (img.file) {
        formDataToSubmit.append("images[]", img.file);
      } else if (isEditMode && img.url) {
        formDataToSubmit.append("existingImageUrls[]", img.url);
      }
    });
    if (isEditMode) formDataToSubmit.append("reviewId", reviewIdToEdit);

    const csrfToken = getCsrfTokenFromCookie();
    if (!csrfToken) {
      console.error("CSRF Token not found in cookies!");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/v1/reviews", formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
      });

      alert(isEditMode ? "후기가 수정되었습니다!" : "후기가 등록되었습니다!");
      if (onNavigate) {
        onNavigate(isEditMode ? "reviewDetail" : "reviews", isEditMode ? reviewIdToEdit : null);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("후기 제출에 실패했습니다. 다시 시도해주세요.");
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
      }
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "작성을 취소하시겠습니까? 변경사항이 저장되지 않을 수 있습니다."
      )
    ) {
      if (onNavigate) {
        onNavigate(
          isEditMode ? "reviewDetail" : "reviews",
          isEditMode ? reviewIdToEdit : null
        );
      } else {
        window.history.back();
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <PageSectionHeader
          title="데이터 로딩 중..."
          showBackButton
          onBackClick={handleCancel}
        />
        <div className="flex-grow flex items-center justify-center p-4">
          <p className="text-gray-500">기존 후기 정보를 불러오는 중입니다...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageSectionHeader
        title={isEditMode ? "후기 수정" : "새 후기 작성"}
        showBackButton={true}
        onBackClick={handleCancel}
      />
      <div className="flex-grow overflow-y-auto p-4 md:p-6">
        <form
          id="review-form"
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-4 md:p-6 rounded-lg shadow"
        >
          {/* 제목 입력 */}
          <div>
            <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="멋진 여행 후기의 제목을 입력해주세요"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
              required
            />
          </div>

          {/* 내용 입력 */}
          <div>
            <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="review-content"
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="여행 경험을 자세하게 공유해주세요. (방문했던 장소, 좋았던 점, 팁 등)"
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사진 첨부 (최대 5장)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>파일 선택</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="pl-1">또는 파일을 여기로 끌어다 놓으세요</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF 최대 10MB</p>
              </div>
            </div>
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {images.map((image) => (
                  <div key={image.id} className="relative group aspect-square">
                    <img
                      src={image.url}
                      alt="미리보기"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                      title="이미지 삭제"
                    >
                      <FiXCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 태그 입력 */}
          <div>
            <label htmlFor="review-tags" className="block text-sm font-medium text-gray-700 mb-1">
              태그 (Enter로 추가, 최대 10개)
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2.5 border border-gray-300 rounded-md">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiXCircle size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                id="review-tags"
                value={currentTagInput}
                onChange={(e) => setCurrentTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder={
                  tags.length >= 10
                    ? "최대 10개까지 가능"
                    : tags.length === 0
                    ? "예: #제주도 #가족여행"
                    : ""
                }
                className="flex-grow p-1 outline-none text-sm min-w-[100px]"
                disabled={tags.length >= 10}
              />
            </div>
          </div>

          {/* 하단 액션 버튼 */}
          <div className="pt-5 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditMode ? "후기 수정 완료" : "후기 등록하기"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ReviewWritePage;
