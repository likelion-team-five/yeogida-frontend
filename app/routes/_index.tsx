import React from "react";
// LeftPanel 및 RightPanel 컴포넌트 경로를 실제 파일 위치에 맞게 수정해주세요.
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";

// 이 컴포넌트는 root.tsx의 <Outlet> 자리에 렌더링됩니다.
// 메인 콘텐츠 영역의 레이아웃을 정의합니다.
export default function IndexPage() {
  return (
    // flex 컨테이너로 LeftPanel과 RightPanel을 나란히 배치합니다.
    // h-full 클래스는 부모 요소(root.tsx의 flex-1 div)의 높이를 상속받아 채우게 합니다.
    <div className="flex h-full p-4">
      {" "}
      {/* 여기에 메인 콘텐츠 영역 전체의 패딩 추가 */}
      {/* 왼쪽 패널 */}
      <LeftPanel />
      {/* 오른쪽 패널 */}
      <RightPanel />
    </div>
  );
}
