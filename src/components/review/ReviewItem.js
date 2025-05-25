import { BsCardImage } from 'react-icons/bs';
import { FiThumbsUp, FiMessageSquare, FiMoreHorizontal, FiEdit2, FiTrash2 } from 'react-icons/fi'; // 수정, 삭제 아이콘 추가

function ReviewItem({
  item,
  onClick, // 아이템 전체 클릭 시
  isOptionsMenuOpen, // 현재 아이템의 메뉴가 열려있는지 여부
  onToggleOptionsMenu, // 메뉴를 토글하는 함수 (해당 아이템 ID 전달)
  onEdit, // 수정 버튼 클릭 시 콜백
  onDelete, // 삭제 버튼 클릭 시 콜백
  isCurrentUserAuthor, // 현재 사용자가 이 글의 작성자인지 여부 (메뉴 항목 표시에 사용)
}) {
  if (!item) return null;

  const handleOptionsClick = (e) => {
    e.stopPropagation(); // 아이템 전체 클릭 이벤트 전파 방지
    if (onToggleOptionsMenu) {
      onToggleOptionsMenu(item.id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(item.id);
    if (onToggleOptionsMenu) onToggleOptionsMenu(null); // 메뉴 닫기
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(item.id);
    if (onToggleOptionsMenu) onToggleOptionsMenu(null); // 메뉴 닫기
  };


  return (
    <div
      onClick={onClick}
      className="flex p-3 md:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150 bg-white relative" // relative 추가
    >
      {/* 이미지 영역 */}
      <div className="w-24 h-20 md:w-32 md:h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 mr-3 md:mr-4 flex-shrink-0 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <BsCardImage size={30} />
        )}
      </div>

      {/* 내용 영역 */}
      <div className="flex-grow min-w-0">
        {item.category && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full mb-1 inline-block">
            {item.category}
          </span>
        )}
        <h3 className="text-sm md:text-base font-semibold text-gray-800 truncate group-hover:text-blue-600">
          {item.title}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {item.author ? `${item.author} · ` : ''}{item.datetime}
        </p>
        {(item.likes !== undefined || item.commentsCount !== undefined) && (
          <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1.5 md:mt-2">
            {item.likes !== undefined && ( <span className="flex items-center"><FiThumbsUp size={13} className="mr-0.5" /> {item.likes}</span>)}
            {item.commentsCount !== undefined && ( <span className="flex items-center"><FiMessageSquare size={13} className="mr-0.5" /> {item.commentsCount}</span>)}
          </div>
        )}
      </div>

      {/* 더보기/설정 버튼 영역 */}
      <div className="ml-2 flex-shrink-0">
        <button
          onClick={handleOptionsClick}
          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          title="옵션 더보기"
          aria-haspopup="true"
          aria-expanded={isOptionsMenuOpen}
        >
          <FiMoreHorizontal size={18} />
        </button>

        {/* 설정 메뉴 드롭다운 */}
        {isOptionsMenuOpen && (
          <div
            className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-10 py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu" // 위 버튼에 id="options-menu" 추가하면 좋음
          >
            {/* isCurrentUserAuthor 와 같은 조건으로 메뉴 아이템 표시 여부 결정 가능 */}
            {isCurrentUserAuthor ? (
              <>
                <button
                  onClick={handleEditClick}
                  className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                  role="menuitem"
                >
                  <FiEdit2 size={14} className="mr-2" /> 수정하기
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center"
                  role="menuitem"
                >
                  <FiTrash2 size={14} className="mr-2" /> 삭제하기
                </button>
              </>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); alert('신고 기능 미구현'); if (onToggleOptionsMenu) onToggleOptionsMenu(null);}}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                role="menuitem"
               >
                신고하기
              </button>
            )}
            {/* 다른 메뉴 아이템들 (예: 공유하기) 추가 가능 */}
          </div>
        )}
      </div>
    </div>
  );
}

ReviewItem.defaultProps = {
  onClick: () => {},
  isOptionsMenuOpen: false,
  onToggleOptionsMenu: () => {},
  onEdit: () => {},
  onDelete: () => {},
  isCurrentUserAuthor: false, // 기본적으로는 작성자가 아님
};

export default ReviewItem;