function RightPanel() {
  return (
    <div className="flex-1 p-4 flex flex-col bg-white shadow-md ml-4 rounded-md">
      <div className="flex-1 bg-gray-200 rounded-md flex items-center justify-center text-gray-700">
        <img
          src="/korea_map.png"
          alt="한국 지도"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
}

export default RightPanel;
