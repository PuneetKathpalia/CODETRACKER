import React from 'react';
import { Code, Braces } from 'lucide-react';
import { useQuestions } from '@/context/QuestionContext';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const { stats } = useQuestions();
  
  // Determine completion status for Puneet and Komal
  const puneetCompleted = stats.total > 0 && stats.completedByPuneet === stats.total;
  const komalCompleted = stats.total > 0 && stats.completedByKomal === stats.total;

  return (
    <div className="bg-gradient-to-r from-black to-[#121212] border-b border-[#333] sticky top-0 z-10">
      <div className="container flex flex-col items-center justify-between px-4 py-4 mx-auto md:flex-row">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#00EEFF] to-[#FF00AA] flex items-center justify-center">
            <Code className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00EEFF] to-[#FF00AA]">
            CodeTrack
          </h1>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <StatCard
            icon={<Braces className="w-4 h-4" />}
            label="Total"
            value={stats.total}
            color="bg-slate-800"
          />
          <StatCard
            label="Puneet"
            value={`${stats.completedByPuneet}/${stats.total}`}
            percentage={stats.total > 0 ? Math.round((stats.completedByPuneet / stats.total) * 100) : 0}
            color="bg-blue-900"
            status={puneetCompleted ? 'completed' : 'pending'}
          />
          <StatCard
            label="Komal"
            value={`${stats.completedByKomal}/${stats.total}`}
            percentage={stats.total > 0 ? Math.round((stats.completedByKomal / stats.total) * 100) : 0}
            color="bg-purple-900"
            status={komalCompleted ? 'completed' : 'pending'}
          />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon?: React.ReactNode;
  label: string;
  value: number | string;
  percentage?: number;
  color: string;
  status?: 'completed' | 'pending';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, percentage, color, status }) => {
  return (
    <div className={cn("rounded-lg px-3 py-2 text-center", color)}>
      <div className="flex items-center justify-center gap-1 mb-1">
        {icon}
        <span className="flex items-center gap-1 text-xs font-medium text-gray-300">
          {label}
          {status === 'completed' && <span title="Completed" className="ml-1 text-green-400">✔️</span>}
          {status === 'pending' && <span title="Pending" className="ml-1 text-yellow-400">⏳</span>}
        </span>
      </div>
      <div className="text-sm font-bold">{value}</div>
      {percentage !== undefined && (
        <div className="w-full h-1 mt-1 overflow-hidden bg-gray-700 rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-[#00EEFF] to-[#FF00AA]" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default Header;