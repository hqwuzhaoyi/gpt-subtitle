import { StyleSwitcher } from "@/components/style-switcher";
import UploadPage from "./preview/tasks/page";

export default function Example() {
  return (
    <div className="container relative p-10">
      <StyleSwitcher />
      {/* <HomeNav className="[&>a:first-child]:text-primary" /> */}
      <section className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-background shadow-xl">
          <UploadPage />
        </div>
      </section>
    </div>
  );
}
