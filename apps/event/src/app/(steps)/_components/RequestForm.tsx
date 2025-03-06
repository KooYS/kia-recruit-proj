'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@repo/ui/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  university: z.string().min(2, {
    message: '학교명을 입력해주세요.',
  }),
  major: z.string().min(2, {
    message: '학과를 입력해주세요.',
  }),
  username: z.string().min(2, {
    message: '이름을 입력해주세요.',
  }),
  phone: z.string().min(2, {
    message: '연락처를 입력해주세요.',
  }),
});

type FormType = z.infer<typeof FormSchema>;

export function RequestForm() {
  const { push } = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      university: '',
      major: '',
      username: '',
      phone: '',
    },
  });

  function onSubmit(data: FormType) {
    console.log(data);
    push(
      `2?u=${data.university}&m=${data.major}&n=${data.username}&p=${data.phone}`
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>학교</FormLabel>
              <FormControl>
                <Input placeholder="OO대학교" {...field} />
              </FormControl>
              <FormDescription>학교명을 입력해주세요.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="major"
          render={({ field }) => (
            <FormItem>
              <FormLabel>학과</FormLabel>
              <FormControl>
                <Input placeholder="OO과" {...field} />
              </FormControl>
              <FormDescription>학과를 입력해주세요.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input placeholder="홍길동" {...field} />
              </FormControl>
              <FormDescription>이름을 입력해주세요.</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>연락처</FormLabel>
              <FormControl>
                <Input placeholder="01012345678" {...field} />
              </FormControl>
              <FormDescription>
                연락처를 -를 제외하고 입력해주세요.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          선물받기
        </Button>
      </form>
    </Form>
  );
}
