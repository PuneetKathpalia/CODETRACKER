// import React from 'react';
import { QuestionProvider } from '@/context/QuestionContext';
import Header from '@/components/Header';
import AddQuestionForm from '@/components/AddQuestionForm';
import FilterBar from '@/components/FilterBar';
import QuestionList from '@/components/QuestionList';
import StatsDisplay from '@/components/StatsDisplay';

function App() {
  return (
    <QuestionProvider>
      <div className="min-h-screen bg-black text-white w-screen overflow-x-hidden">
        <Header />
        
        <main className="w-full px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[2000px] mx-auto">
            <div className="lg:col-span-2 space-y-6">
              <AddQuestionForm />
              <FilterBar />
              <QuestionList />
            </div>
            
            <div className="lg:col-span-1">
              <StatsDisplay />
            </div>
          </div>
        </main>
        
        <footer className="border-t border-[#333] py-6 text-center text-gray-500 text-sm w-full">
          <p>CodeTrack &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </QuestionProvider>
  );
}

export default App;