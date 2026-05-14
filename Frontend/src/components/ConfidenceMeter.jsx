const ConfidenceMeter = ({ value }) => {
  let color = 'text-red-400';
  if (value > 40) color = 'text-amber-400';
  if (value > 70) color = 'text-green-400';

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm theme-panel-secondary">
      <div className={`text-4xl font-black ${color} tracking-tighter mb-1 drop-shadow-md`}>
        {value || 0}%
      </div>
      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">AI Confidence</div>
    </div>
  );
};

export default ConfidenceMeter;
