import React from "react";
import { NavLink } from "react-router-dom"; 
import { GoHome, GoGraph, GoStar } from "react-icons/go";
import { AiOutlineCar, AiOutlineMessage } from "react-icons/ai";
import { FiMap, FiUser } from "react-icons/fi";

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    title={label}
    className={(
      { isActive }, // isActive prop을 사용하여 현재 경로와 일치하는지 확인
    ) =>
      `p-3 w-full flex flex-col justify-center items-center
       ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}
       focus:outline-none rounded-lg transition-colors duration-150`
    }
  >
    <Icon size={24} />
    {/* <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : ''}`}>{label}</span> */}
  </NavLink>
);

function LeftSidebar() {
  const navItems = [
    { id: "home", label: "시작페이지", icon: GoHome, path: "/" },
    { id: "reviews", label: "후기", icon: AiOutlineMessage, path: "/reviews" },
    { id: "courses", label: "코스추천", icon: FiMap, path: "/courses" }, // path를 /courses로 변경
    { id: "carpools", label: "카풀", icon: AiOutlineCar, path: "/carpools" },
    { id: "rankings", label: "랭킹", icon: GoGraph, path: "/rankings" },
    { id: "favorites", label: "찜", icon: GoStar, path: "/favorites" },
  ];

  const bottomNavItems = [
    { id: "mypage", label: "마이페이지", icon: FiUser, path: "/mypage" },
  ];

  return (
    <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 shadow-sm">
      <div className="w-10 h-10 bg-gray-300 rounded-md flex items-center justify-center text-sm text-gray-600 mb-6">
        로고
      </div>
      <nav className="flex-grow flex flex-col items-center space-y-3 w-full px-2">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            to={item.path} // to prop으로 경로 전달
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>
      <div className="w-full px-2 space-y-3 border-t border-gray-200 pt-3 mt-3">
        {bottomNavItems.map((item) => (
          <NavItem
            key={item.id}
            to={item.path}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>
    </div>
  );
}

export default LeftSidebar;
