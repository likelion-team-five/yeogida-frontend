import React from 'react';
import Sidebar from '../../components/sidebar';
import { ReactComponent as ArrowIcon } from '../../image/mypage/react-icons/MdNavigateBefore.svg';
import { ReactComponent as ProfileIcon } from '../../image/mypage/react-icons/Vector.svg';
import { ReactComponent as LevelIcon } from '../../image/mypage/react-icons/free-icon-rocket-8064905 1.svg';
import { useState } from 'react';
import Button from '../../components/confirm_button';

function My() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    level: 5,
    nickname: '홍길동',
    id: 'hong123',
  });

  return (
    <div className='mypage'>
      <Sidebar />
      <div className = 'box1'>
        <ArrowIcon onClick={() => window.history.back()} style={{ cursor: 'pointer' }}/>
        <h1>마이페이지</h1>
      </div>
      <div className = 'white-box'>
        <h1>회원 정보</h1>
        <div className = 'level-box'>
          <ProfileIcon className='profile-icon'/>
            <div className='level-text'>
              <div className='level-icon'>
                <LevelIcon width='25px' height='25px'/>
                <h1>Lv. {userInfo.level}</h1>
              </div>
              <h3>Nickname : {userInfo.nickname}</h3>
              <h3>ID : {userInfo.id}</h3>
            </div>
        </div>
        <div className='box4'>
          <p onClick={() => setIsLogoutModalOpen(true)}>
            <span className='click'>로그아웃</span>
          </p>
          <p onClick={() => setIsDeleteModalOpen(true)}>
            <span className='click'>탈퇴하기</span>
          </p>
          <p onClick={() => window.location.href = '/heart'}>
          <span className='click'>찜</span>
          </p>
        </div>
      </div>
      {isLogoutModalOpen && (
        <Button
          message="로그아웃 하시겠습니까?"
          onConfirm={() => {
            console.log('로그아웃 처리됨');
            setIsLogoutModalOpen(false);
          }}
          onCancel={() => setIsLogoutModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && (
        <Button
          message="회원 탈퇴를 하시겠습니까?"
          onConfirm={() => {
            console.log('탈퇴 처리됨');
            setIsDeleteModalOpen(false);
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
          confirmText="탈퇴"
        />
      )}
    </div> 
  );
}

export default My;