"use client";

import { startTransition, useActionState } from "react";

// مثل useActionState لكن دون مسح الحقول بعد الإرسال،
// حتى لا يفقد المستخدم ما كتبه إذا ظهر خطأ في التحقق.
export function useFormAction<S>(action: (state: Awaited<S>, form: FormData) => Promise<S>, initial: Awaited<S>) {
  const [state, dispatch, pending] = useActionState<S, FormData>(action, initial);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    startTransition(() => dispatch(form));
  };
  return [state, onSubmit, pending] as const;
}
