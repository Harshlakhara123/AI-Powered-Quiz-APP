"use client";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import { CloudUpload, Plus, Mic, X, ArrowLeft, ArrowRight } from "lucide-react";
import { useCreateAssignmentStore } from "@/store/useCreateAssignmentStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const questionTypeOptions = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  dueDate: z.string().optional(),
  file: z.any().refine((val) => val instanceof File, "File is required"),
  questionTypes: z.array(
    z.object({
      type: z.string(),
      count: z.number().min(1),
      marks: z.number().min(1),
    })
  ).min(1, "At least one question type is required"),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateForm() {
  const router = useRouter();
  const { status, setUploading, setProcessing, error, setError, generatedContent } = useCreateAssignmentStore();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      dueDate: "",
      questionTypes: [
        { type: "Multiple Choice Questions", count: 4, marks: 1 },
      ],
      additionalInfo: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questionTypes",
  });

  const watchQuestionTypes = watch("questionTypes");
  const watchFile = watch("file");

  const totalQuestions = watchQuestionTypes.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);
  const totalMarks = watchQuestionTypes.reduce((acc, curr) => acc + (Number(curr.count) || 0) * (Number(curr.marks) || 0), 0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [], "application/pdf": [] },
    maxSize: 10 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setValue("file", acceptedFiles[0]);
      }
    },
  });

  const onSubmit = async (data: FormValues) => {
    setUploading();

    try {
      const formData = new FormData();
      formData.set("title", data.title);
      formData.set("image", data.file);
      formData.set("formMetadata", JSON.stringify({
        dueDate: data.dueDate,
        questionTypes: data.questionTypes,
        additionalInfo: data.additionalInfo,
        totalQuestions,
        totalMarks,
      }));

      const res = await fetch("/api/assignment/create", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to upload.");
        return;
      }

      setProcessing(result.assignmentId, process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4001");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (status === "uploading" || status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center h-full">
        <div className="w-24 h-24 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-8" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {status === "uploading" ? "Uploading Document..." : "Generating Questions..."}
        </h2>
        <p className="text-slate-500 max-w-sm">
          Please wait while our AI analyzes your document and generates the assignment.
        </p>
      </div>
    );
  }

  useEffect(() => {
    if (status === "completed" && generatedContent) {
      const assignId = useCreateAssignmentStore.getState().assignmentId;
      if (assignId) {
        router.push(`/assignment/${assignId}`);
      }
    }
  }, [status, generatedContent, router]);

  if (status === "completed" && generatedContent) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Create Assignment</h1>
        <p className="text-sm text-slate-500">Set up a new assignment for your students</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-[2rem] shadow-sm">
        
        <div>
          <label className="block text-sm font-semibold text-slate-800 tracking-tight mb-2">Assignment Title</label>
          <Input 
            {...register("title")} 
            placeholder="e.g. Science Midterm Chapter 5" 
            className="rounded-xl border-slate-200 shadow-sm focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all duration-200"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
           <div 
             {...getRootProps()} 
             className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 group
               ${isDragActive ? "border-orange-500 bg-orange-50" : "border-slate-300 hover:border-orange-400 hover:bg-orange-50/30"}
               ${errors.file ? "border-red-500 bg-red-50" : ""}
             `}
           >
             <input {...getInputProps()} />
             <CloudUpload size={40} className="text-slate-400 group-hover:text-orange-500 transition-colors duration-300 mx-auto mb-4" />
             {watchFile ? (
               <p className="font-semibold text-slate-700 mb-2">{watchFile.name}</p>
             ) : (
               <p className="font-semibold text-slate-700 mb-2">Choose a file or drag & drop it here</p>
             )}
             <p className="text-xs text-slate-400 mb-6">JPEG, PNG, PDF upto 10MB</p>
             <Button type="button" variant="outline" className="rounded-full px-6 border-slate-300">
               Browse Files
             </Button>
           </div>
           {errors.file && <p className="text-red-500 text-xs mt-2 text-center">{errors.file.message as string}</p>}
           <p className="text-center text-xs text-slate-400 mt-3">Upload your preferred document or image</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800 tracking-tight mb-2">Due Date</label>
          <div className="relative">
            <Input 
               type="date"
               {...register("dueDate")} 
               className="rounded-xl border-slate-200 w-full shadow-sm focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800 tracking-tight mb-4">Question Type</label>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm relative group">
                <div className="flex-1">
                  <select
                    {...register(`questionTypes.${index}.type` as const)}
                    className="w-full bg-transparent font-medium text-slate-700 border-none outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500/20 rounded-md py-1"
                  >
                    {questionTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                
                <div className="w-px h-8 bg-slate-200 mx-2" />

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold mb-1 tracking-wider">No. of Questions</span>
                    <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 p-0.5">
                       <button type="button" onClick={() => setValue(`questionTypes.${index}.count`, Math.max(1, watchQuestionTypes[index]?.count - 1))} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500 hover:text-slate-800 font-medium">-</button>
                       <Input type="number" {...register(`questionTypes.${index}.count` as const, { valueAsNumber: true })} className="w-10 text-center border-none p-0 h-7 focus-visible:ring-0 mx-1 font-semibold text-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                       <button type="button" onClick={() => setValue(`questionTypes.${index}.count`, watchQuestionTypes[index]?.count + 1)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500 hover:text-slate-800 font-medium">+</button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold mb-1 tracking-wider">Marks</span>
                    <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 p-0.5">
                       <button type="button" onClick={() => setValue(`questionTypes.${index}.marks`, Math.max(1, watchQuestionTypes[index]?.marks - 1))} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500 hover:text-slate-800 font-medium">-</button>
                       <Input type="number" {...register(`questionTypes.${index}.marks` as const, { valueAsNumber: true })} className="w-10 text-center border-none p-0 h-7 focus-visible:ring-0 mx-1 font-semibold text-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                       <button type="button" onClick={() => setValue(`questionTypes.${index}.marks`, watchQuestionTypes[index]?.marks + 1)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500 hover:text-slate-800 font-medium">+</button>
                    </div>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => remove(index)}
                  className="absolute -right-2 -top-2 bg-white rounded-full p-1.5 shadow-sm border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                >
                   <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => append({ type: "Short Questions", count: 1, marks: 2 })}
            className="mt-4 text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-full"
          >
            <Plus size={16} className="mr-2" /> Add Question Type
          </Button>

          <div className="flex flex-col items-end mt-4 text-sm font-semibold text-slate-700 space-y-1">
             <p>Total Questions : {totalQuestions}</p>
             <p>Total Marks : {totalMarks}</p>
          </div>
        </div>

        <div>
           <label className="block text-sm font-semibold text-slate-800 tracking-tight mb-2">Additional Information (For better output)</label>
           <div className="relative group">
             <Textarea 
               {...register("additionalInfo")} 
               placeholder="e.g Generate a question paper for 3 hour exam duration..." 
               className="rounded-2xl border-slate-200 shadow-sm resize-none min-h-[100px] pr-12 pb-10 focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all duration-200"
             />
             <div className="absolute right-3 bottom-3 p-2.5 bg-slate-50 text-slate-400 rounded-xl cursor-pointer hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200 ring-1 ring-slate-200/50">
               <Mic size={18} />
             </div>
           </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-between items-center pt-6 pb-6 w-full">
           <Button type="button" variant="outline" className="rounded-full px-6 h-12" onClick={() => router.back()}>
             <ArrowLeft size={16} className="mr-2" /> Previous
           </Button>
           
           <Button type="submit" className="rounded-full px-8 h-12 bg-black text-white hover:bg-slate-800">
             Next <ArrowRight size={16} className="ml-2" />
           </Button>
        </div>
      </form>
    </div>
  );
}
