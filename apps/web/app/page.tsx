import { StyleSwitcher } from "@/components/style-switcher";
import UploadPage from "./preview/tasks/page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Example() {
  const cookieStore = cookies();
  const proxyUrlHasBeenSet = cookieStore.get("proxyUrlHasBeenSet");

  if (!proxyUrlHasBeenSet) {
    redirect("/initial-setup");
  }

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
