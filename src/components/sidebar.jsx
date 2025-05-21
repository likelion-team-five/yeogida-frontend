import React from 'react';
import { ReactComponent as SideLogo } from '../image/start/여기다시작로고.svg';
import { ReactComponent as MainIcon } from '../image/sidebar/react-icons/AiOutlineHome.svg';
import { ReactComponent as RankIcon } from '../image/sidebar/react-icons/PiRanking.svg';
import { ReactComponent as CarpoolIcon } from '../image/sidebar/react-icons/AiOutlineCar.svg';
import { ReactComponent as CourseIcon } from '../image/sidebar/react-icons/AiOutlineShareAlt.svg';
import { ReactComponent as MyIcon } from '../image/sidebar/react-icons/GoPerson.svg';

function Sidebar() {
    return (
    <div className = 'sidebar'>
        <div className='sidebar-logo'>
            <SideLogo width = '100' height = '100' />
        </div>
        <div className="sidebar-divider" />
        <ul className="sidebar-menu">
            <li>
                <a href="/main">
                    <MainIcon />
                </a>
            </li>
            <li>
                <a href="/rank">
                    <RankIcon />
                </a>
                </li>
            <li>
                <a href="/carpool">
                    <CarpoolIcon />
                </a>
                </li>
            <li>
                <a href="/course">
                    <CourseIcon />
                </a>
            </li>
            <div className="sidebar-divider2" />
            <li>
                <a href="/my">
                    <MyIcon />
                </a>
                </li>
      </ul>
    </div>
    );
}

export default Sidebar;