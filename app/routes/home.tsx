import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";

export default function IndexPage() {
  return (
    <div className="flex h-full p-4">
      <LeftPanel />
      <RightPanel />
    </div>
  );
}
