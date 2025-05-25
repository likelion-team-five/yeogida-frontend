import { IoChevronBack } from "react-icons/io5"; // 뒤로가기 아이콘

function PageSectionHeader({ title, showBackButton, onBackClick, actions }) {
  return (
    <div className="flex items-center justify-between p-4 h-16 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="text-gray-600 hover:text-gray-800 mr-3 p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="뒤로 가기"
          >
            <IoChevronBack size={24} />
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-800 truncate">
          {title}
        </h1>
      </div>
      <div className="flex items-center space-x-2">{actions}</div>
    </div>
  );
}

PageSectionHeader.defaultProps = {
  title: "페이지 제목",
  showBackButton: false,
  onBackClick: () => {},
  actions: null,
};

export default PageSectionHeader;
