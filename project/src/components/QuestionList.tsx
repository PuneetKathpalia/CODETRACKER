import React, { useState } from 'react';
import { Edit, Trash2, ExternalLink, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuestions } from '@/context/QuestionContext';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import EditQuestionDialog from './EditQuestionDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Easy':
      return 'bg-green-950 text-green-400 border-green-800';
    case 'Medium':
      return 'bg-amber-950 text-amber-400 border-amber-800';
    case 'Hard':
      return 'bg-red-950 text-red-400 border-red-800';
    default:
      return 'bg-slate-800 text-slate-400 border-slate-700';
  }
};

const QuestionList: React.FC = () => {
  const { filteredQuestions, toggleCompletion, deleteQuestion } = useQuestions();
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleEdit = (question: Question) => {
    setQuestionToEdit(question);
    setIsEditDialogOpen(true);
  };
  
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setQuestionToEdit(null);
  };
  
  if (filteredQuestions.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-[#333] rounded-lg">
        <p className="text-gray-400">No questions found.</p>
        <p className="text-gray-500 text-sm mt-2">Add a new question or change your filters.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div 
            key={question.id}
            className="bg-[#121212] border border-[#333] rounded-lg p-4 transition-all hover:border-[#555] hover:shadow-md hover:shadow-black/20"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={cn("px-2 py-0.5 text-xs rounded-full border", getLevelColor(question.level))}>
                    {question.level}
                  </span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[#1E1E1E] border border-[#333] text-gray-300">
                    {question.topic}
                  </span>
                </div>
                
                <a 
                  href={question.platformLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-base font-medium truncate block hover:text-[#00EEFF] transition-colors group"
                >
                  {question.platformLink}
                  <ExternalLink className="inline h-3 w-3 ml-1 opacity-60 group-hover:opacity-100" />
                </a>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Puneet</span>
                  <Checkbox 
                    checked={question.completedByPuneet}
                    onCheckedChange={() => toggleCompletion(question.id, 'Puneet')}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-6 h-6 border-2 border-gray-500 rounded transition-all duration-150"
                    title="Mark as done by Puneet"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Komal</span>
                  <Checkbox 
                    checked={question.completedByKomal}
                    onCheckedChange={() => toggleCompletion(question.id, 'Komal')}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 w-6 h-6 border-2 border-gray-500 rounded transition-all duration-150"
                    title="Mark as done by Komal"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(question)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this question from your list. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteQuestion(question.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {questionToEdit && (
        <EditQuestionDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          question={questionToEdit}
          onClose={handleEditDialogClose}
        />
      )}
    </>
  );
};

export default QuestionList;