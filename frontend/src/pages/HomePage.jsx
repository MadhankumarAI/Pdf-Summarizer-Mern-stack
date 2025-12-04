import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ModelSelector from '../components/ModelSelector';
import SummaryDisplay from '../components/SummaryDisplay';
import api from '../api/axios';

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [model, setModel] = useState('BART-large-cnn');
  const [summary, setSummary] = useState(null);
  const [highlightedPdf, setHighlightedPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
    if (!file || !model) {
      setError('// ERROR: INPUT_MISSING');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('pdf', file);
    
    setIsLoading(true);
    setError(null);
    setSummary(null);
    setHighlightedPdf(null);

    try {
      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { filePath } = uploadResponse.data;

      const summarizeResponse = await api.post('/summarize', {
        filePath,
        model,
      }, {
        responseType: 'arraybuffer' 
      });
      
      const summaryData = JSON.parse(atob(summarizeResponse.headers['x-summary']));
      setSummary(summaryData);
      const blob = new Blob([summarizeResponse.data], { type: 'application/pdf' });
      setHighlightedPdf(blob);

    } catch (err) {
      setError('// SYSTEM FAILURE: PROCESSING_ERROR');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-4 animate-slide-up">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none text-white">
          Unpack <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-emerald-400">Intelligence.</span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base font-light">
          Upload your accreditation documents. Select your neural engine. Extract the signal from the noise.
        </p>
      </header>

      <main className="animate-slide-up delay-100">
        <div className="glass-panel p-1 rounded-2xl">
          <div className="bg-[#0A0A0B] rounded-xl p-6 md:p-10 space-y-8 border border-white/5">
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FileUpload onFileSelect={(f) => setFile(f)} />
              </div>
              
              <div className="space-y-6 flex flex-col justify-between">
                <ModelSelector onModelSelect={(m) => setModel(m)} />
                
                <button
                  onClick={handleSummarize}
                  disabled={isLoading || !file}
                  className="w-full btn-primary py-4 rounded-lg relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                        Processing...
                      </>
                    ) : (
                      <>Generate Synthesis &rarr;</>
                    )}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {error && (
        <div className="animate-slide-up text-[#ff3333] bg-[#ff3333]/10 border border-[#ff3333]/20 p-4 rounded-lg text-center font-mono text-sm">
          {error}
        </div>
      )}

      {summary && (
        <div className="animate-slide-up delay-200">
           <SummaryDisplay summary={summary} highlightedPdf={highlightedPdf} />
        </div>
      )}
    </div>
  );
};

export default HomePage;