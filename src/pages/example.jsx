import React from 'react';
import { useNavigate } from 'react-router-dom';

function Example() {
  const navigate = useNavigate();

  // 버튼 이름과 경로를 배열로 관리하겠습니당~~
  const routes = [
    { name: '시작', path: '/start' },
    { name: '메인', path: '/main' },
    { name: '후기', path: '/review' },
    { name: '후기상세', path: '/rdetail' },
    { name: '후기글 작성', path: '/rwrite' },
    { name: '랭킹', path: '/rank' },
    { name: '카풀', path: '/carpool' },
    { name: '카풀상세', path: '/cdetail' },
    { name: '카풀글 작성', path: '/cwrite' },
    { name: '코스추천', path: '/course' },
    { name: '마이', path: '/my' },
    { name: '찜', path: '/heart' },
    { name: '지도', path: '/map' },
    { name: '사이드바', path: '/sidebar' },


  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🌟 페이지모음</h1>
      {routes.map(({ name, path }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          style={{
            margin: '0.5rem',
            padding: '1rem 2rem',
            fontSize: '16px',
            borderRadius: '8px',
          }}
        >
          {name} 페이지로 이동
        </button>
      ))}
    </div>
  );
}

export default Example;
