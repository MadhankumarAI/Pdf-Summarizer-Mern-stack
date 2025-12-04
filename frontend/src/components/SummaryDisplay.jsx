const SummaryDisplay = ({ summary, highlightedPdf }) => {
  const handleDownload = () => {
    if (highlightedPdf) {
      const url = URL.createObjectURL(highlightedPdf);
      const a = document.createElement('a');
      a.href = url;
      a.download = `highlighted_${summary.filename}`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-1 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ccff00] to-transparent opacity-50"></div>
      
      <div className="bg-[#0A0A0B]/90 p-8 rounded-xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold font-syne text-white">Analysis Result</h2>
          <span className="text-xs font-mono text-gray-500 border border-gray-800 px-2 py-1 rounded">
            ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </span>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed text-sm md:text-base border-l-2 border-[#ccff00]/30 pl-4">
            {summary.summary}
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Detected Entities</h3>
          <div className="flex flex-wrap gap-2">
            {summary.keywords.map((keyword, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-[#ccff00] text-xs font-medium rounded-full transition-colors border border-transparent hover:border-[#ccff00]/30 cursor-default"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <button
            onClick={handleDownload}
            className="w-full bg-white text-black font-bold py-3 px-4 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download Annotated PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;