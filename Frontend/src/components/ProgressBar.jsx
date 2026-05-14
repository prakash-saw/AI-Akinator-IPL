const ProgressBar = ({ current, max }) => (
  <div className="w-full bg-slate-800 rounded-full h-2.5 mb-6 border border-slate-700 overflow-hidden">
    <div
      className="bg-gradient-to-r from-amber-500 to-amber-300 h-2.5 transition-all duration-500 ease-out"
      style={{ width: `${(current / max) * 100}%` }}
    />
  </div>
);

export default ProgressBar;
