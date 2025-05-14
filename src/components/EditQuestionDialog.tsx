import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useQuestions } from '@/context/QuestionContext';
import { Question, QuestionLevel } from '@/types';

interface EditQuestionDialogProps {
  question: Question;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const formSchema = z.object({
  platformLink: z
    .string()
    .url('Please enter a valid URL')
    .min(1, 'Platform link is required'),
  level: z.enum(['Easy', 'Medium', 'Hard'] as const),
  topic: z.string().min(1, 'Topic name is required'),
});

type FormValues = z.infer<typeof formSchema>;

const EditQuestionDialog: React.FC<EditQuestionDialogProps> = ({
  question,
  open,
  onOpenChange,
  onClose,
}) => {
  const { updateQuestion, topics } = useQuestions();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platformLink: question.platformLink,
      level: question.level,
      topic: question.topic,
    },
  });

  const onSubmit = (data: FormValues) => {
    updateQuestion(question.id, {
      platformLink: data.platformLink,
      level: data.level as QuestionLevel,
      topic: data.topic,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#121212] border-[#333] text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platformLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Link</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://leetcode.com/problems/two-sum/" 
                      {...field} 
                      className="bg-[#1E1E1E] border-[#333]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#1E1E1E] border-[#333]">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic Name</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          list="edit-topics" 
                          placeholder="e.g., Arrays"
                          {...field}
                          className="bg-[#1E1E1E] border-[#333]"
                        />
                      </FormControl>
                      <datalist id="edit-topics">
                        {topics.map(topic => (
                          <option key={topic} value={topic} />
                        ))}
                      </datalist>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-[#00EEFF] to-[#FF00AA] text-black font-medium hover:opacity-90 transition-opacity"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestionDialog;