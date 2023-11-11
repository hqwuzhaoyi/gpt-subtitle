import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { getProfile } from "./api/profile";

export default async function SettingsProfilePage() {
  const data = await getProfile();
  console.debug("getProfile", data);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm
        defaultValues={{
          username: data.username,
        }}
      />
    </div>
  );
}
