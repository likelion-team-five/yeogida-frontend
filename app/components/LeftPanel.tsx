import { AiOutlineSearch } from "react-icons/ai";

function LeftPanel() {
  const listItems = [
    {
      id: 1,
      title: "후기 제목 1",
      date: "05/01 11:30 AM",
      imagePlaceholder: true,
    },
    {
      id: 2,
      title: "후기 제목 2",
      date: "04/08 11:30 PM",
      imagePlaceholder: true,
    },
    {
      id: 3,
      title: "후기 제목 3",
      date: "04/28 09:20 AM",
      imagePlaceholder: true,
    },
    {
      id: 4,
      title: "후기 제목 4",
      date: "04/20 05:30 PM",
      imagePlaceholder: true,
    },
  ];

  return (
    <div className="w-80 bg-white shadow-md flex flex-col p-4">
      <div className="flex items-center mb-4">
        <div className="relative flex-1 mr-2">
          <input
            type="text"
            placeholder="제목 검색"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm" // 폰트 크기 조절
          />
          <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />{" "}
        </div>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-sm">
          작성하기
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {listItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center border-b border-gray-200 py-4"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex-shrink-0 flex items-center justify-center text-gray-500 text-sm">
              {item.imagePlaceholder && "No Image"}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-base">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.date}</p>
            </div>
            <button className="text-gray-500 hover:text-gray-700 text-sm ml-2">
              설정
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeftPanel;
