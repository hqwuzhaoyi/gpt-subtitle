import Form from "./Form";
import { SubtitleTable } from "./SubtitleTable";

export default function UploadPage() {
  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Form />
        <SubtitleTable />
      </div>
    </div>
  );
}
