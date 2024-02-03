export const dynamic = 'force-dynamic'
import { defaultLocale, redirect } from "lib/navigation";

// This page only renders when the app is built statically (output: 'export')
export default function RootPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  redirect("/" + defaultLocale);
}
