import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { getConfig, getProfile } from "./api/profile";

export default async function SettingsProfilePage() {
  const [profile, config] = await Promise.all([getProfile(), getConfig()]);
  console.debug("getProfile", profile);

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
          username: profile.username,
          outputSrtThenTranslate:
            config.outputSrtThenTranslate === "1" ? true : false,
        }}
      />
    </div>
  );
}
