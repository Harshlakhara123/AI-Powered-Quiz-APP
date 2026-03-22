"use client";

import { MoreVertical } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface AssignmentType {
  _id: string;
  title: string;
  status?: string;
  createdAt?: string | Date;
  formMetadata?: {
    dueDate?: string | Date;
  };
}

export function AssignmentCard({ assignment }: { assignment: AssignmentType }) {
  const router = useRouter();
  
  const createdDate = assignment.createdAt
    ? format(new Date(assignment.createdAt), "dd-MM-yyyy")
    : "Unknown date";
    
  const dueDate = assignment.formMetadata?.dueDate
    ? format(new Date(assignment.formMetadata.dueDate), "dd-MM-yyyy")
    : "N/A";

  const isPending = assignment.status === "pending" || assignment.status === "processing";

  return (
    <Card 
      onClick={() => router.push(`/assignment/${assignment._id}`)}
      className="cursor-pointer rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden bg-white group"
    >
      {isPending && (
        <div className="absolute top-0 left-0 w-full h-1 bg-orange-400 animate-pulse" />
      )}
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-2 items-center">
            {isPending && (
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse inline-block" />
            )}
            <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{assignment.title}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors rounded-full opacity-60 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl shadow-lg border-slate-100">
              <DropdownMenuItem asChild className="cursor-pointer font-medium py-2" onClick={(e) => e.stopPropagation()}>
                <Link href={`/assignment/${assignment._id}`}>View Assignment</Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 focus:text-red-700 py-2 font-medium"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await fetch(`/api/assignment/${assignment._id}`, { method: 'DELETE' });
                    router.refresh();
                  } catch (error) {
                    console.error("Failed to delete", error);
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Assigned on:</span>
            <span className="text-slate-700">{createdDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Due:</span>
            <span className="text-slate-700">{dueDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
