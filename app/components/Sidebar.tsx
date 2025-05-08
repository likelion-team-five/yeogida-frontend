import {
  AiOutlineHome,
  AiOutlineForm,
  AiOutlineBarChart,
  AiOutlineCar,
  AiOutlineShareAlt,
  AiOutlineUser,
} from "react-icons/ai";

function Sidebar() {
  return (
    <div className="w-24 bg-white shadow-md flex flex-col">
      {/* 로고 영역 */}
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        <img src="/logo.png" alt="로고" className="h-10" />
      </div>

      {/* 네비게이션 목록 영역 */}
      <nav className="flex-1 py-4 flex flex-col">
        <ul>
          <li className="flex items-center justify-center py-5 px-6 text-gray-700 hover:bg-gray-200 cursor-pointer">
            <AiOutlineHome className="text-xl" />
          </li>
          <li className="flex items-center justify-center py-5 px-6 text-gray-700 hover:bg-gray-200 cursor-pointer">
            <AiOutlineBarChart className="text-xl" />
          </li>
          <li className="flex items-center justify-center py-5 px-6 text-gray-700 hover:bg-gray-200 cursor-pointer">
            <AiOutlineCar className="text-xl" />
          </li>
          <li className="flex items-center justify-center py-5 px-6 text-gray-700 hover:bg-gray-200 cursor-pointer">
            <AiOutlineShareAlt className="text-xl" />
          </li>
        </ul>
      </nav>

      <div className="py-4 border-t border-gray-200">
        <div className="flex items-center justify-center py-3 px-6 text-gray-700 hover:bg-gray-200 cursor-pointer">
          <AiOutlineUser className="text-xl" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
