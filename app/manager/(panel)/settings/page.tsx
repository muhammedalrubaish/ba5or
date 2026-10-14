import { getSettingsFresh } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettingsFresh();
  return (
    <>
      <h1 className="mgr-title">الإعدادات</h1>
      {settings.updatedAt && <p className="muted">آخر تعديل: {formatDateTime(settings.updatedAt)}</p>}
      <SettingsForm settings={settings} />
    </>
  );
}
