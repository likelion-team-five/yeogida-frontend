function ListItemCard({
  imageElement,
  imageUrl,
  imageSize = 'w-10 h-10',
  imageContainerClassName = '',
  title,
  customContent,
  textContainerClassName = '',
  actions,
  onClick,
  cardClassName = '',
  contentClassName = '',
}) {
  return (
    <div className={`flex items-start ${cardClassName}`} onClick={onClick}>
      <div className={`flex-shrink-0 ${imageContainerClassName}`}>
        {imageElement ?? (
          <img
            src={imageUrl}
            alt="썸네일"
            className={`${imageSize} object-cover rounded-full`}
          />
        )}
      </div>

      <div className={`flex-grow ${textContainerClassName}`}>
        <div className={contentClassName}>
          {title}
          {customContent}
        </div>
      </div>

      {actions && <div className="ml-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

export default ListItemCard;
