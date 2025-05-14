import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { db } from '@/firebaseConfig';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  setDoc
} from 'firebase/firestore';
import { Question, FilterOptions, SortOptions, Stats } from '@/types';

interface QuestionContextType {
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id' | 'createdAt'>) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  toggleCompletion: (id: string, user: 'Puneet' | 'Komal') => void;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  sortOptions: SortOptions;
  setSortOptions: React.Dispatch<React.SetStateAction<SortOptions>>;
  filteredQuestions: Question[];
  stats: Stats;
  topics: string[];
}

const QuestionContext = createContext<QuestionContextType | null>(null);

export const useQuestions = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useQuestions must be used within a QuestionProvider');
  }
  return context;
};

export const QuestionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = React.useState<Question[]>([]);
  React.useEffect(() => {
    const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Question));
    });
    return unsubscribe;
  }, []);
  
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    topic: '',
    level: 'All',
    search: '',
  });
  
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'createdAt',
    direction: 'desc',
  });

  const addQuestion = useCallback(async (question: Omit<Question, 'id' | 'createdAt'>) => {
    const newQuestion = {
      ...question,
      createdAt: Date.now(),
    };
    await addDoc(collection(db, 'questions'), newQuestion);
  }, []);

  const updateQuestion = useCallback(async (id: string, updates: Partial<Question>) => {
    const questionRef = doc(db, 'questions', id);
    await updateDoc(questionRef, updates);
  }, []);

  const deleteQuestion = useCallback(async (id: string) => {
    const questionRef = doc(db, 'questions', id);
    await deleteDoc(questionRef);
  }, []);

  const toggleCompletion = useCallback(async (id: string, user: 'Puneet' | 'Komal') => {
    const question = questions.find(q => q.id === id);
    if (!question) return;
    const questionRef = doc(db, 'questions', id);
    if (user === 'Puneet') {
      await updateDoc(questionRef, { completedByPuneet: !question.completedByPuneet });
    } else {
      await updateDoc(questionRef, { completedByKomal: !question.completedByKomal });
    }
  }, [questions]);

  // Get unique topics from questions
  const topics = useMemo(() => {
    const topicSet = new Set(questions.map((q) => q.topic));
    return Array.from(topicSet).sort();
  }, [questions]);

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    let results = [...questions];
    
    // Apply filters
    if (filterOptions.level !== 'All') {
      results = results.filter((q) => q.level === filterOptions.level);
    }
    
    if (filterOptions.topic) {
      results = results.filter((q) => q.topic === filterOptions.topic);
    }
    
    if (filterOptions.search) {
      const searchLower = filterOptions.search.toLowerCase();
      results = results.filter(
        (q) =>
          q.topic.toLowerCase().includes(searchLower) ||
          q.platformLink.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (sortOptions.field) {
      results.sort((a, b) => {
        const aVal = a[sortOptions.field as keyof Question];
        const bVal = b[sortOptions.field as keyof Question];
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOptions.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOptions.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
          return sortOptions.direction === 'asc'
            ? (aVal ? 1 : 0) - (bVal ? 1 : 0)
            : (bVal ? 1 : 0) - (aVal ? 1 : 0);
        }
        
        return 0;
      });
    }
    
    return results;
  }, [questions, filterOptions, sortOptions]);

  // Calculate stats
  const stats: Stats = useMemo(() => {
    const result: Stats = {
      total: questions.length,
      completedByPuneet: questions.filter((q) => q.completedByPuneet).length,
      completedByKomal: questions.filter((q) => q.completedByKomal).length,
      easy: questions.filter((q) => q.level === 'Easy').length,
      medium: questions.filter((q) => q.level === 'Medium').length,
      hard: questions.filter((q) => q.level === 'Hard').length,
      topics: {},
    };

    // Count questions by topic
    questions.forEach((q) => {
      if (!result.topics[q.topic]) {
        result.topics[q.topic] = 0;
      }
      result.topics[q.topic]++;
    });

    return result;
  }, [questions]);

  const value = {
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    toggleCompletion,
    filterOptions,
    setFilterOptions,
    sortOptions,
    setSortOptions,
    filteredQuestions,
    stats,
    topics,
  };

  return <QuestionContext.Provider value={value}>{children}</QuestionContext.Provider>;
};