"use client";

import { useState } from "react";
import { Download, ChevronLeft, Trash2, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { updateAssignmentAction } from "@/lib/actions/assignment";

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
  _id: string;
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
  const [localAssignment, setLocalAssignment] = useState<OutputAssignment>(assignment);
  const [isSaving, setIsSaving] = useState(false);
  
  const content = localAssignment.generatedContent;
  const sections: Section[] = content?.sections || [];
  
  const totalMarks = localAssignment.formMetadata?.totalMarks || 0;

  const saveChanges = async (newContent: any, newFormMetadata: any) => {
    setIsSaving(true);
    await updateAssignmentAction(localAssignment._id, newContent, newFormMetadata);
    setIsSaving(false);
  };

  const calculateTotalMarks = (sectionsToCheck: Section[]) => {
    let total = 0;
    sectionsToCheck.forEach(sec => {
      sec.questions?.forEach(q => {
        total += Number(q.marks) || 0;
      });
    });
    return total;
  };

  const handleDeleteQuestion = (sectionIdx: number, questionIdx: number) => {
    if (!content?.sections) return;
    const newSections = JSON.parse(JSON.stringify(content.sections));
    newSections[sectionIdx].questions.splice(questionIdx, 1);
    
    const newTotal = calculateTotalMarks(newSections);
    
    const newContent = { ...content, sections: newSections };
    const newMetadata = { ...localAssignment.formMetadata, totalMarks: newTotal };

    setLocalAssignment(prev => ({
      ...prev,
      generatedContent: newContent,
      formMetadata: newMetadata
    }));

    saveChanges(newContent, newMetadata);
  };

  const handleMarksChange = (sectionIdx: number, questionIdx: number, newMarks: number) => {
    if (!content?.sections) return;
    const newSections = JSON.parse(JSON.stringify(content.sections));
    newSections[sectionIdx].questions[questionIdx].marks = newMarks;
    
    const newTotal = calculateTotalMarks(newSections);

    const newContent = { ...content, sections: newSections };
    const newMetadata = { ...localAssignment.formMetadata, totalMarks: newTotal };

    setLocalAssignment(prev => ({
      ...prev,
      generatedContent: newContent,
      formMetadata: newMetadata
    }));

    saveChanges(newContent, newMetadata);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 print:p-0 print:m-0 print:space-y-0 print:pb-0 print:max-w-none w-full">
      {/* Top Banner */}
      <div className="bg-[#333] text-white p-6 rounded-[2rem] flex flex-col md:flex-row shadow-sm justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold font-serif leading-tight">
            Certainly, Let&apos;s generate a customized Question Paper for your classes based on the preferred chapters.
          </h2>
          <div className="flex gap-3">
            <Button 
              className="mt-4 bg-white text-black hover:bg-slate-200 rounded-full font-semibold flex items-center gap-2"
              onClick={handlePrint}
            >
              <Printer size={16} /> Print / Save as PDF
            </Button>
          </div>
        </div>
        <div className="hidden md:block opacity-20 text-8xl leading-none font-serif select-none -translate-y-4 translate-x-4 mix-blend-overlay pointer-events-none">
          ”
        </div>
      </div>

      <div className="flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft size={16} className="mr-2" /> Back
        </Button>
        {isSaving && (
          <div className="flex items-center text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving changes...
          </div>
        )}
      </div>

      {/* The Printable Paper Area */}
      <div 
        className="bg-white rounded-[2rem] shadow-sm overflow-hidden" 
        style={{ minHeight: '800px' }}
      >
        <div className="p-10 md:p-16 text-black">
          {/* Header */}
          <div className="text-center mb-10 border-b border-slate-300 pb-8 space-y-2 relative">
             <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide uppercase">{user.schoolName || "Delhi Public School"}</h1>
             <p className="text-lg font-serif">{assignment.title}</p>
             <p className="text-md font-medium">Class: _________________</p>
             
             <div className="flex justify-between items-center text-sm font-semibold mt-8 text-neutral-600">
               <div>Time Allowed: 45 minutes</div>
               <div>Maximum Marks: <span className="text-orange-600">{totalMarks}</span></div>
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
                     <div key={qIdx} className="group flex gap-4 text-sm md:text-base leading-relaxed break-inside-avoid relative">
                       <span className="font-semibold shrink-0">{qIdx + 1}.</span>
                       <div className="flex-1">
                         <div className="flex justify-between items-start gap-4 mb-2">
                           <div className="flex-1 mt-1">
                             <span className="mr-2">
                               <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${diffColor}`}>
                                 {q.difficulty || "Moderate"}
                               </span>
                             </span>
                             {q.question}
                           </div>
                            <div className="flex items-center gap-1 font-semibold whitespace-nowrap shrink-0 ml-4 py-1">
                              [
                              <input 
                                 type="number" 
                                 className="w-10 text-center bg-transparent border border-transparent rounded-md hover:bg-orange-50/50 focus:bg-orange-50/50 focus:border-orange-500/30 focus:ring-4 focus:ring-orange-500/10 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all duration-200"
                                 value={q.marks}
                                 onChange={(e) => handleMarksChange(idx, qIdx, Number(e.target.value))}
                              /> 
                              Marks]
                              <button 
                                onClick={() => handleDeleteQuestion(idx, qIdx)} 
                                className="text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100 absolute -right-10 top-1 p-1.5 rounded-full"
                                title="Delete Question"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
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
