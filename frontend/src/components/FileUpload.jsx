import { useState } from 'react';

const FileUpload = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      setSelectedFile(null);
      onFileSelect(null);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  return (
    <div className="w-full h-full min-h-[200px]">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
        Source Document (PDF)
      </label>
      <div 
        className={`
          relative group h-full flex flex-col items-center justify-center p-8 
          border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'border-[#ccff00] bg-[#ccff00]/5' 
            : 'border-gray-800 hover:border-gray-600 bg-gray-900/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleFileChange} 
          accept="application/pdf" 
        />
        
        {!selectedFile ? (
          <div className="text-center space-y-3 pointer-events-none">
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-[#ccff00] text-black' : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Drop file or click to browse</p>
              <p className="text-xs text-gray-600 mt-1">MAX 10MB</p>
            </div>
          </div>
        ) : (
          <div className="text-center w-full pointer-events-none">
            <div className="w-12 h-12 mx-auto bg-[#ccff00] rounded-full flex items-center justify-center mb-3 text-black">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <p className="text-sm font-medium text-white truncate max-w-[200px] mx-auto">{selectedFile.name}</p>
            <p className="text-xs text-[#ccff00] mt-1">Ready to process</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;