// import Form from "./Form";
import { useTranslations } from "next-intl";
import { SubtitleTable } from "./SubtitleTable";

export default function UploadPage() {
  const t = useTranslations("Translate");
  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{
            t('title')
          }</h2>
          <p className="text-muted-foreground">
            {
              t('description')
            }
          </p>
        </div>
        {/* <Form /> */}
        <SubtitleTable />
      </div>
    </div>
  );
}
