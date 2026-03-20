"use client";

import { usePDF } from "react-to-pdf";
import { Download, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Question {
  question: string;
  marks: number;
  difficulty?: string;
  options?: string[];
}

interface Section {
  title?: string;
  questions?: Question[];
}

interface OutputAssignment {
  title: string;
  generatedContent?: {
    sections?: Section[];
  };
  formMetadata?: {
    totalMarks?: number;
  };
}

interface OutputUser {
  schoolName?: string;
}

export function AssignmentOutput({ assignment, user }: { assignment: OutputAssignment; user: OutputUser }) {
  const router = useRouter();
  
  const { toPDF, targetRef } = usePDF({ filename: `${String(assignment.title).replace(/\s+/g, '_')}.pdf` });

  const content = assignment.generatedContent;
  const sections: Section[] = content?.sections || [];
  
  const totalMarks = assignment.formMetadata?.totalMarks || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-[#333] text-white p-6 rounded-[2rem] flex flex-col md:flex-row shadow-sm justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif leading-tight">
            Certainly, Let&apos;s generate a customized Question Paper for your classes based on the preferred chapters.
          </h2>
          <Button 
            className="mt-4 bg-white text-black hover:bg-slate-200 rounded-full font-semibold flex items-center gap-2"
            onClick={() => toPDF()}
          >
            <Download size={16} /> Download as PDF
          </Button>
        </div>
        <div className="hidden md:block opacity-20 text-8xl leading-none font-serif select-none -translate-y-4 translate-x-4 mix-blend-overlay pointer-events-none">
          ”
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Button variant="ghost" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft size={16} className="mr-2" /> Back
        </Button>
      </div>

      {/* The Printable Paper Area */}
      <div 
        className="bg-white rounded-[2rem] shadow-sm overflow-hidden" 
        style={{ minHeight: '800px' }}
      >
        <div className="p-10 md:p-16 text-black" ref={targetRef}>
          {/* Header */}
          <div className="text-center mb-10 border-b border-slate-300 pb-8 space-y-2 relative">
             <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide uppercase">{user.schoolName || "Delhi Public School"}</h1>
             <p className="text-lg font-serif">{assignment.title}</p>
             <p className="text-md font-medium">Class: _________________</p>
             
             <div className="flex justify-between items-center text-sm font-semibold mt-8 text-neutral-600">
               <div>Time Allowed: 45 minutes</div>
               <div>Maximum Marks: {totalMarks}</div>
             </div>
          </div>

          <div className="mb-8 space-y-4">
            <p className="font-semibold text-sm">All questions are compulsory unless stated otherwise.</p>
            <div className="space-y-2 text-sm">
               <div className="flex w-64 items-end">
                 <span className="w-24">Name:</span>
                 <div className="flex-1 border-b border-black"></div>
               </div>
               <div className="flex w-64 items-end">
                 <span className="w-24">Roll Number:</span>
                 <div className="flex-1 border-b border-black"></div>
               </div>
               <div className="flex w-full max-w-sm items-end gap-4">
                 <div className="flex flex-1 items-end">
                    <span className="w-16">Class:</span>
                    <div className="flex-1 border-b border-black"></div>
                 </div>
                 <div className="flex flex-1 items-end">
                    <span className="w-16">Section:</span>
                    <div className="flex-1 border-b border-black"></div>
                 </div>
               </div>
            </div>
          </div>

          {/* Sections Map */}
          {sections.map((section, idx) => (
             <div key={idx} className="mb-12">
               {section.title && (
                 <h2 className="text-center text-xl font-bold mb-6 font-serif underline underline-offset-4">
                   {section.title}
                 </h2>
               )}

               <div className="space-y-6">
                 {section.questions?.map((q, qIdx) => {
                   let diffColor = "bg-green-100 text-green-700 border-green-200";
                   if (q.difficulty?.toLowerCase() === "medium") diffColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
                   if (q.difficulty?.toLowerCase() === "hard" || q.difficulty?.toLowerCase() === "challenging") diffColor = "bg-red-100 text-red-700 border-red-200";

                   return (
                     <div key={qIdx} className="flex gap-4 text-sm md:text-base leading-relaxed break-inside-avoid">
                       <span className="font-semibold shrink-0">{qIdx + 1}.</span>
                       <div className="flex-1">
                         <div className="flex justify-between items-start gap-4 mb-2">
                           <div className="flex-1">
                             <span className="mr-2">
                               <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${diffColor}`}>
                                 {q.difficulty || "Moderate"}
                               </span>
                             </span>
                             {q.question}
                           </div>
                           <span className="font-semibold whitespace-nowrap shrink-0">[{q.marks} Marks]</span>
                         </div>
                         
                         {q.options && q.options.length > 0 && (
                           <ol className="list-[lower-alpha] pl-6 space-y-1 mt-3">
                             {q.options.map((opt: string, optIdx: number) => (
                               <li key={optIdx}>{opt}</li>
                             ))}
                           </ol>
                         )}
                       </div>
                     </div>
                   );
                 })}
               </div>
             </div>
          ))}

          <div className="mt-16 text-center font-bold text-sm tracking-widest uppercase">
            End of Question Paper
          </div>
        </div>
      </div>
    </div>
  );
}
