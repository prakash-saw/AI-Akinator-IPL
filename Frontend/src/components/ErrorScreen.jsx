import { AlertCircle } from 'lucide-react';

const ErrorScreen = ({ errorMsg, onRetry }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-red-950/20 rounded-3xl border border-red-900/50">
    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
    <h2 className="text-2xl font-bold mb-2">Connection Interrupted</h2>
    <p className="text-slate-400 mb-6">{errorMsg}</p>
    <button onClick={onRetry} className="px-6 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-500 transition-colors">
      Try Again
    </button>
  </div>
);

export default ErrorScreen;
