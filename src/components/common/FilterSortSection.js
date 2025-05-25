import { TbFilter } from "react-icons/tb"; // 기본 필터 아이콘

function FilterSortSection({
  filterIcon: FilterIcon = TbFilter, // 기본 필터 아이콘, props로 변경 가능
  onFilterClick,
  showSortOptions, // 드롭다운 표시 여부 (외부에서 제어)
  sortOptions = [], // { key: 'id', label: '옵션명' } 형태의 배열
  currentSortKey,
  onSortOptionClick,
  actionButton, // 오른쪽에 표시될 추가 액션 버튼 (ReactNode)
}) {
  return (
    <div className="p-3 flex justify-between items-center bg-white border-b border-gray-200">
      <div className="relative">
        <button
          onClick={onFilterClick}
          className="text-gray-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-gray-100 focus:outline-none"
          aria-haspopup="true"
          aria-expanded={showSortOptions}
          title="필터 및 정렬"
        >
          <FilterIcon size={22} />
        </button>
        {showSortOptions && sortOptions.length > 0 && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-200 z-20">
            {" "}
            {/* z-index 추가 */}
            <ul className="py-1">
              {sortOptions.map((option) => (
                <li key={option.key}>
                  <button
                    onClick={() => onSortOptionClick(option.key)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none
                                ${currentSortKey === option.key ? "font-semibold text-blue-600 bg-blue-50" : "text-gray-700"}`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}

export default FilterSortSection;
