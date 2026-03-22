import { ComingSoon } from "@/components/coming-soon";

export default function SettingsPage() {
  return (
    <div className="h-full p-4 md:p-8">
      <ComingSoon 
        title="Settings" 
        description="Manage your account preferences, configure API keys, and personalize your experience." 
      />
    </div>
  );
}
