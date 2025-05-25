import React from 'react';
import { BsCardImage } from 'react-icons/bs';

function ListItemCard({
  imageUrl,
  title,
  subtitle,
  description,
  tags,
  actions, // 이 컴포넌트에서는 주로 제목 옆 작은 액션 또는 뱃지 아래 사용 가정
  onClick,
  imageSize = "w-24 h-20", // 기본 이미지 크기
  customContent, // 카드 하단에 들어갈 추가적인 React 노드
  badge, // 이미지 우측 상단 또는 특정 위치에 표시될 뱃지
  cardClassName = "bg-white", // 카드 전체에 적용할 추가 클래스 (예: 패딩, 그림자 등)
  contentClassName = "p-3 flex-grow", // 이미지 제외한 오른쪽 콘텐츠 영역 전체 클래스
  imageContainerClassName = "flex-shrink-0", // 이미지 컨테이너에 적용할 클래스
  textContainerClassName = "flex-grow min-w-0", // 텍스트 내용 부분을 감싸는 클래스 (텍스트 넘침 처리 위함)
}) {
  return (
    <div
      onClick={onClick}
      className={`flex ${cardClassName} ${onClick ? 'hover:bg-gray-50 cursor-pointer' : ''} transition-colors duration-150 overflow-hidden`}
      // overflow-hidden 추가: 내부 요소가 카드를 벗어나는 것을 방지
    >
      {/* Image Section */}
      {imageUrl !== undefined && ( // imageUrl prop이 명시적으로 있을 때만 이미지 섹션 렌더링
        <div className={`${imageSize} bg-gray-100 relative ${imageContainerClassName}`}>
          {imageUrl ? (
            <img src={imageUrl} alt={title || 'list item image'} className="w-full h-full object-cover" />
          ) : (
            // 이미지가 없을 경우 플레이스홀더 아이콘
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <BsCardImage size={Math.min(parseInt(imageSize.split(' ')[0].replace('w-', ''), 10) / 1.5, 40)} />
            </div>
          )}
          {badge && <div className="absolute top-1.5 right-1.5 z-10">{badge}</div>}
        </div>
      )}

      {/* Content Section */}
      <div className={`${contentClassName} ${textContainerClassName} flex flex-col justify-between`}>
        <div> {/* 상단 내용 (제목, 부제목, 설명, 태그) */}
          <div className="flex justify-between items-start">
            {title && (
              <h3 className="text-base font-semibold text-gray-800 truncate pr-2 group-hover:text-blue-600">
                {/* group 클래스는 이 ListItemCard를 사용하는 부모에서 설정해야 효과가 있음 */}
                {title}
              </h3>
            )}
            {/* actions는 제목 옆에 위치할 간단한 아이콘/버튼 등에 사용 */}
            {actions && !customContent && <div className="flex-shrink-0 ml-auto pl-2">{actions}</div>}
          </div>

          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>
          )}

          {description && (
            <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-2 sm:line-clamp-3">
              {/* line-clamp는 Tailwind Typography 플러그인 필요 또는 커스텀 CSS */}
              {description}
            </p>
          )}

          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map((tag, index) => ( // key는 고유해야 하므로 index도 추가 (tag.id가 있다면 그것 사용)
                <span
                  key={tag.id || `${tag.name}-${index}`}
                  className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Custom Content (주로 카드 하단에 위치) */}
        {customContent && <div className="mt-auto pt-2">{customContent}</div>}
      </div>
    </div>
  );
}

ListItemCard.defaultProps = {
  onClick: () => {},
};

export default ListItemCard;