import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useQuestions } from '@/context/QuestionContext';
import { QuestionLevel } from '@/types';

const formSchema = z.object({
  platformLink: z
    .string()
    .url('Please enter a valid URL')
    .min(1, 'Platform link is required'),
  level: z.enum(['Easy', 'Medium', 'Hard'] as const),
  topic: z.string().min(1, 'Topic name is required'),
});

type FormValues = z.infer<typeof formSchema>;

const AddQuestionForm: React.FC = () => {
  const { addQuestion, topics } = useQuestions();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platformLink: '',
      level: 'Medium',
      topic: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    addQuestion({
      platformLink: data.platformLink,
      level: data.level as QuestionLevel,
      topic: data.topic,
      completedByPuneet: false,
      completedByKomal: false,
    });
    
    form.reset({
      platformLink: '',
      level: 'Medium',
      topic: data.topic, // Keep the same topic for adding multiple related questions
    });
  };

  return (
    <div className="bg-[#121212] border border-[#333] rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <PlusCircle className="h-5 w-5 text-[#00EEFF]" />
        <h2 className="text-lg font-semibold">Add New Question</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="platformLink"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
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
          </div>
          
          <div className="grid items-end grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Topic Name</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        list="topics" 
                        placeholder="Arrays, Linked Lists, Dynamic Programming..."
                        {...field}
                        className="bg-[#1E1E1E] border-[#333]"
                      />
                    </FormControl>
                    <datalist id="topics">
                      {topics.map(topic => (
                        <option key={topic} value={topic} />
                      ))}
                    </datalist>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#00EEFF] to-[#FF00AA] text-black font-medium hover:opacity-90 transition-opacity"
            >
              Add Question
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddQuestionForm;