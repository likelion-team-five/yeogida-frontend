import React from 'react';
import Sidebar from '../../components/sidebar';

function Rank() {
  const rankingData = [
    { rank: 1, nickname: '김동한', level: 61, review: 125, like: 455},
    { rank: 2, nickname: '김송희', level: 51, review: 165, like: 533},
    { rank: 3, nickname: '김시현', level: 41, review: 65, like: 274},
    { rank: 4, nickname: '박윤지', level: 31, review: 76, like: 452},
    { rank: 5, nickname: '오승민', level: 21, review: 96, like: 244},
    { rank: 6, nickname: '이지연', level: 21, review: 32, like: 162},
    { rank: 7, nickname: '전진수', level: 21, review: 12, like: 87},
  ];

  return (
    <div className="ranking-page">
      <Sidebar />
      <h1>Rank</h1>
      <div className='ranking-container'>
        <table className="ranking-table">
          <thead>
            <tr className='category'>
              <th>Rank</th>
              <th>사진</th>
              <th>뱃지</th>
              <th>이름</th>
              <th>레벨</th>
              <th>후기 작성</th>
              <th>좋아요</th>
              <th>여행 후기 페이지</th>
            </tr>
          </thead>
          <tbody>
            {rankingData.map(({ rank, nickname, level, review, like }) => (
              <tr key={rank}>
                <td>{rank}</td>
                <td>사진</td>
                <td>뱃지</td>
                <td>{nickname}</td>
                <td>{level}</td>
                <td>{review}</td>
                <td>{like}</td>
                <td>
                  <button className='review-page'>여행 후기 페이지</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Rank;