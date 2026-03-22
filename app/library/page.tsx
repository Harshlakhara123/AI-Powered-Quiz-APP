import { ComingSoon } from "@/components/coming-soon";

export default function LibraryPage() {
  return (
    <div className="h-full p-4 md:p-8">
      <ComingSoon 
        title="My Library" 
        description="A centralized hub where you'll be able to access all your created assignment sheets, historical templates, and favorite questions." 
      />
    </div>
  );
}
