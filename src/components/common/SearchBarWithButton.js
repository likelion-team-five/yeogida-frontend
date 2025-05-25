import { IoSearchOutline } from "react-icons/io5"; // 검색 아이콘

function SearchBarWithButton({
  placeholder,
  buttonText,
  onSearchChange,
  onSearchSubmit, // 엔터키 등으로 검색 실행 시
  onButtonClick,
  searchTerm, // 외부에서 검색어 상태를 제어할 경우
  buttonIcon: ButtonIcon, // 버튼에 아이콘을 넣을 경우
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && onSearchSubmit) {
      onSearchSubmit(searchTerm);
    }
  };

  return (
    <div className="p-3 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoSearchOutline className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "검색..."}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {buttonText && (
          <button
            onClick={onButtonClick}
            className="px-4 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex-shrink-0 flex items-center space-x-1.5"
          >
            {ButtonIcon && <ButtonIcon size={18} />}
            <span>{buttonText}</span>
          </button>
        )}
      </div>
    </div>
  );
}

SearchBarWithButton.defaultProps = {
  placeholder: "검색어를 입력하세요",
  onSearchChange: () => {},
  onButtonClick: () => {},
};

export default SearchBarWithButton;
