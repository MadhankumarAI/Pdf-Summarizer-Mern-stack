const ModelSelector = ({ onModelSelect }) => {
  const models = ['BART-large-cnn', 'T5-base', 'GPT-4o-mini'];

  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
        Neural Engine
      </label>
      <div className="relative">
        <select
          onChange={(e) => onModelSelect(e.target.value)}
          defaultValue={models[0]}
          className="appearance-none block w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-colors cursor-pointer"
        >
          {models.map((model) => (
            <option key={model} value={model} className="bg-gray-900 py-2">
              {model}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;