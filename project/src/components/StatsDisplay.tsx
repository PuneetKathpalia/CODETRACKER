import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { useQuestions } from '@/context/QuestionContext';

const StatsDisplay: React.FC = () => {
  const { stats } = useQuestions();
  
  // Prepare data for Level Breakdown chart
  const levelData = [
    { name: 'Easy', value: stats.easy, color: 'hsl(var(--chart-1))' },
    { name: 'Medium', value: stats.medium, color: 'hsl(var(--chart-2))' },
    { name: 'Hard', value: stats.hard, color: 'hsl(var(--chart-3))' },
  ];
  
  // Prepare data for Topic Breakdown chart
  const topicData = Object.entries(stats.topics)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Just show top 5 topics
  
  // Prepare data for Completion chart
  const completionData = [
    {
      name: 'Puneet',
      completed: stats.completedByPuneet,
      remaining: stats.total - stats.completedByPuneet,
    },
    {
      name: 'Komal',
      completed: stats.completedByKomal,
      remaining: stats.total - stats.completedByKomal,
    },
  ];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E1E1E] p-2 border border-[#333] rounded-md text-xs">
          <p className="font-semibold">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-[#121212] border border-[#333] rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-6">Statistics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Difficulty Level Breakdown */}
        <div>
          <h3 className="text-sm font-medium mb-3 text-gray-300">Difficulty Level Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Top Topics */}
        <div>
          <h3 className="text-sm font-medium mb-3 text-gray-300">Top Topics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--chart-2))" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Completion Progress */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-medium mb-3 text-gray-300">Completion Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={completionData}
                layout="vertical"
                stackOffset="expand"
                barSize={40}
              >
                <XAxis type="number" domain={[0, stats.total]} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="completed" 
                  stackId="a"
                  name="Completed"
                  fill="hsl(var(--chart-4))"
                />
                <Bar 
                  dataKey="remaining" 
                  stackId="a" 
                  name="Remaining"
                  fill="hsl(var(--chart-5))"
                  opacity={0.3}
                />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;