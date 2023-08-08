// import Form from "./Form";
import { SubtitleTable } from "./SubtitleTable";

export default function UploadPage() {
  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Translate</h2>
          <p className="text-muted-foreground">
            Translate subtitles using translation services.
          </p>
        </div>
        {/* <Form /> */}
        <SubtitleTable />
      </div>
    </div>
  );
}
