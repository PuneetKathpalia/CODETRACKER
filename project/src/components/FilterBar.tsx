import React, { useState } from 'react';
import { Search, Filter, SortDesc, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuestions } from '@/context/QuestionContext';
import { QuestionLevel } from '@/types';
import { cn } from '@/lib/utils';

const FilterBar: React.FC = () => {
  const { 
    topics, 
    filterOptions, 
    setFilterOptions, 
    sortOptions, 
    setSortOptions 
  } = useQuestions();
  
  const [isOpen, setIsOpen] = useState(false);
  
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
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        field,
        direction: 'asc'
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
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full md:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters & Sort
        </Button>
      </div>
      
      {isOpen && (
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
          <div>
            <label className="block mb-1 text-xs text-gray-400">Difficulty Level</label>
            <Select 
              value={filterOptions.level} 
              onValueChange={handleLevelChange}
            >
              <SelectTrigger className="bg-[#1E1E1E] border-[#333]">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block mb-1 text-xs text-gray-400">Topic</label>
            <Select 
              value={filterOptions.topic} 
              onValueChange={handleTopicChange}
            >
              <SelectTrigger className="bg-[#1E1E1E] border-[#333]">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Topics</SelectItem>
                {topics.map(topic => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block mb-1 text-xs text-gray-400">Sort By</label>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className={cn("text-xs", sortOptions.field === 'createdAt' && "bg-[#333]")}
                onClick={() => handleSortChange('createdAt')}
              >
                Date {getSortIcon('createdAt')}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={cn("text-xs", sortOptions.field === 'level' && "bg-[#333]")}
                onClick={() => handleSortChange('level')}
              >
                Level {getSortIcon('level')}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className={cn("text-xs", sortOptions.field === 'topic' && "bg-[#333]")}
                onClick={() => handleSortChange('topic')}
              >
                Topic {getSortIcon('topic')}
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-white"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;