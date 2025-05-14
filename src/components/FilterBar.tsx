import React, { useState } from 'react';
import { Search, Filter, SortDesc, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuestions } from '@/context/QuestionContext';
import { QuestionLevel, Question } from '@/types';
import { cn } from '@/lib/utils';

const FilterBar: React.FC = () => {
  const { 
    topics, 
    filterOptions, 
    setFilterOptions, 
    sortOptions, 
    setSortOptions 
  } = useQuestions();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(prev => ({ ...prev, search: e.target.value }));
  };
  
  const handleLevelChange = (value: string) => {
    setFilterOptions(prev => ({ 
      ...prev, 
      level: value as QuestionLevel | 'All'
    }));
  };
  
  const handleTopicChange = (value: string) => {
    setFilterOptions(prev => ({ ...prev, topic: value }));
  };
  
  const handleSortChange = (field: string) => {
    setSortOptions(prev => {
      if (prev.field === field) {
        return {
          ...prev,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return {
        ...prev,
        field: field as keyof Question | '',
        direction: 'asc',
      };
    });
  };
  
  const getSortIcon = (field: string) => {
    if (sortOptions.field !== field) return null;
    
    return sortOptions.direction === 'asc' 
      ? <SortAsc className="w-3 h-3 ml-1" /> 
      : <SortDesc className="w-3 h-3 ml-1" />;
  };
  
  const handleReset = () => {
    setFilterOptions({
      topic: '',
      level: 'All',
      search: '',
    });
    setSortOptions({
      field: 'createdAt',
      direction: 'desc',
    });
  };
  
  return (
    <div className="bg-[#121212] border border-[#333] rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {(['All', 'Easy', 'Medium', 'Hard'] as const).map((level) => {
          let colorClass = '';
          if (level === 'Easy') colorClass = 'bg-green-900 text-green-300 border border-green-700';
          if (level === 'Medium') colorClass = 'bg-amber-900 text-amber-300 border border-amber-700';
          if (level === 'Hard') colorClass = 'bg-red-900 text-red-300 border border-red-700';
          if (level === 'All') colorClass = 'bg-gradient-to-r from-[#00EEFF] to-[#FF00AA] text-black';
          const isActive = filterOptions.level === level;
          return (
            <Button
              key={level}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterOptions(prev => ({ ...prev, level }))}
              className={
                (isActive ? colorClass + ' font-bold shadow-lg' : colorClass + ' opacity-80') +
                ' min-w-[70px] transition-all duration-150'
              }
            >
              {level}
            </Button>
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <Input
            placeholder="Search questions..."
            value={filterOptions.search}
            onChange={handleSearchChange}
            className="pl-9 bg-[#1E1E1E] border-[#333]"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;