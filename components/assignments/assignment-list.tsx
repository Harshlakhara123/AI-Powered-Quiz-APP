"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AssignmentCard, type AssignmentType } from "@/components/assignments/assignment-card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface AssignmentListProps {
  assignments: AssignmentType[];
}

type SortOption = "date-desc" | "date-asc" | "alpha-asc" | "alpha-desc";

export function AssignmentList({ assignments }: AssignmentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const filteredAndSortedAssignments = useMemo(() => {
    // Filter
    let result = assignments.filter((assignment) =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "alpha-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "alpha-desc") {
        return b.title.localeCompare(a.title);
      } else if (sortBy === "date-asc") {
        // @ts-ignore
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        // date-desc default
        // @ts-ignore
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [assignments, searchQuery, sortBy]);

  const getSortLabel = () => {
    switch (sortBy) {
      case "date-desc": return "Newest First";
      case "date-asc": return "Oldest First";
      case "alpha-asc": return "Alphabetical (A-Z)";
      case "alpha-desc": return "Alphabetical (Z-A)";
      default: return "Filter By";
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm">
        <div className="flex border-r border-slate-100 pr-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-slate-500 font-medium rounded-xl hover:bg-slate-100 transition-colors h-11 px-4">
                <span className="mr-2 opacity-50">Y</span> {getSortLabel()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-2xl shadow-lg border-slate-100">
              <DropdownMenuItem onClick={() => setSortBy("date-desc")} className="cursor-pointer font-medium py-2">Newest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("date-asc")} className="cursor-pointer font-medium py-2">Oldest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("alpha-asc")} className="cursor-pointer font-medium py-2">Alphabetical (A-Z)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("alpha-desc")} className="cursor-pointer font-medium py-2">Alphabetical (Z-A)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1 flex items-center relative h-11 rounded-xl bg-slate-50 border border-transparent hover:border-slate-200 transition-colors focus-within:border-orange-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/10 overflow-hidden">
           <Search size={18} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
           <Input 
             placeholder="Search past assignments..." 
             className="border-none shadow-none bg-transparent focus-visible:ring-0 pl-10 h-full w-full placeholder:text-slate-400 font-medium text-slate-700"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 auto-rows-max" style={{ paddingBottom: '100px' }}>
        {filteredAndSortedAssignments.length > 0 ? (
          filteredAndSortedAssignments.map((assignment) => (
            <AssignmentCard key={assignment._id} assignment={assignment} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
            No assignments found matching "{searchQuery}"
          </div>
        )}
      </div>
    </>
  );
}
