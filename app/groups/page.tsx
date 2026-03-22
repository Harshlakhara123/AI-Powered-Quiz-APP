import { ComingSoon } from "@/components/coming-soon";

export default function GroupsPage() {
  return (
    <div className="h-full p-4 md:p-8">
      <ComingSoon 
        title="My Groups" 
        description="Organize your students into classes and groups to easily assign quizzes and track their progress." 
      />
    </div>
  );
}
