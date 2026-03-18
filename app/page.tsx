export default function Home() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-10 text-center">
      {/* Placeholder for the illustration in your image */}
      <div className="relative w-64 h-64 mb-8">
         <div className="absolute inset-0 bg-white/50 rounded-full scale-110"></div>
         <div className="relative flex items-center justify-center h-full text-8xl">📄</div>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 mb-2">No assignments yet</h1>
      <p className="text-slate-500 max-w-sm mb-10 leading-relaxed">
        Create your first assignment to start collecting and grading student submissions. 
        You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      <button className="bg-black text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
        <span className="text-xl">+</span> Create Your First Assignment
      </button>
    </div>
  );
}