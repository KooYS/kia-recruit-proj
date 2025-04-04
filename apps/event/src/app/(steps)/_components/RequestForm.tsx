'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@repo/ui/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription as OriginalFormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';

import { Input as OriginalInput } from '@repo/ui/components/ui/input';
import { useRouter } from 'next/navigation';
import { parseAsString, useQueryStates } from 'nuqs';
import { useQueryState } from 'nuqs';
import React, { Suspense } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { _Response, Fetch } from '@/app/_utils/api';

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
  phone: z
    .string()
    .length(11, {
      message: '연락처를 010 을 포함하여 11자리로 입력해주세요.',
    })
    .regex(/^\d+$/, {
      message: '연락처는 하이픈(-) 제외하고 입력해주세요',
    }),
});

const FormDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <OriginalFormDescription className="text-xs md:text-base">
      {children}
    </OriginalFormDescription>
  );
};

const Input = (props: React.ComponentProps<typeof OriginalInput>) => {
  return (
    <OriginalInput className="text-xs px-2 md:px-3 md:text-base" {...props} />
  );
};

type FormType = z.infer<typeof FormSchema>;

export function RequestForm() {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const [university] = useQueryState('u');
  const defaultValues = {
    university: '',
    major: '',
    username: '',
    phone: '',
  };

  const [isIn, setIsIn, rmIsIn] = useLocalStorage('isIn', false);
  const [_, setUniversity, rmUniversity] = useLocalStorage('u', university);
  const [user, setUser, rmUser] = useLocalStorage('user', defaultValues);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [isLocalStorageRm, setIsLocalStorageRm] = React.useState(0);
  const { push } = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  async function onSubmit(data: FormType) {
    const isAvail = await Fetch<_Response<{ message: string }>>(
      `/api/user?university=${data.university}&major=${data.major}&username=${data.username}&phone=${data.phone}`,
      {}
    );
    if (isAvail.success) {
      console.log(form.getValues());
      setPopupOpen(true);
      setTimeout(() => {
        document.body.removeAttribute('data-scroll-locked');
        document.body.style['pointerEvents'] = 'auto';
      }, 10);
    } else {
      alert(isAvail.body.message);
    }
  }

  const onNext = () => {
    const data = form.getValues();
    setIsIn(true);
    setUser(data);
    push(
      `1/submit?university=${data.university}&major=${data.major}&username=${data.username}&phone=${data.phone}`
    );
  };

  React.useEffect(() => {
    if (isLocalStorageRm > 12) {
      rmIsIn();
      rmUniversity();
      rmUser();
    }
  }, [isLocalStorageRm]);
  React.useEffect(() => {
    console.log(university);
    form.setValue('university', university || '');
    setUniversity(university || '');
  }, [university]);
  return (
    <>
      {hasMounted && (
        <Suspense>
          <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
            <DialogContent
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader className="!text-center">
                <DialogTitle className="text-black">안내</DialogTitle>
                <DialogDescription asChild>
                  <div className="my-5">
                    <p>안녕하세요! {form.getValues()?.username}님</p>
                    <div className="my-3 font-bold space-y-1">
                      <p>학교 - {form.getValues()?.university}</p>
                      <p>학과 - {form.getValues()?.major}</p>
                      <p>연락처 - {form.getValues()?.phone}</p>
                    </div>
                    <p>
                      입력하신 정보가 맞는지
                      <br />
                      다시 한 번 확인해주시기 바랍니다.
                    </p>
                    <p className="text-[#C80000] font-semibold text-[15px] mt-3">
                      진행중 화면을 나가거나 중단하시면
                      <br />
                      재참여가 어려울 수 있습니다!
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  variant={'secondary'}
                  onClick={() => setPopupOpen(false)}
                >
                  취소
                </Button>
                <Button className="flex-1" onClick={onNext}>
                  다음
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {isIn ? (
            <div
              className="text-center font-semibold "
              onClick={() => setIsLocalStorageRm(isLocalStorageRm + 1)}
            >
              {user.username}님 이미 참여하였습니다.
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>학교</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="OO대학교"
                          disabled={!!university}
                          {...field}
                        />
                      </FormControl>
                      {!university && (
                        <FormDescription>
                          학교명을 입력해주세요.
                        </FormDescription>
                      )}
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
                      {form.formState.errors.major?.message ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>학과를 입력해주세요.</FormDescription>
                      )}
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
                      {form.formState.errors.username?.message ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>이름을 입력해주세요.</FormDescription>
                      )}
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

                      {form.formState.errors.phone?.message ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>
                          연락처는 하이픈(-) 제외하고 입력해주세요.
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  선물받기
                </Button>
              </form>
            </Form>
          )}
        </Suspense>
      )}
    </>
  );
}
