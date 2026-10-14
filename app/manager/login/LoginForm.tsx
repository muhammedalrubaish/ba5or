"use client";

import { useFormAction } from "@/lib/use-form-action";
import { login } from "../actions";

export function LoginForm() {
  const [state, onSubmit, pending] = useFormAction(login, undefined);
  return (
    <form onSubmit={onSubmit} className="mgr-form">
      <label className="field">
        <span>البريد الإلكتروني</span>
        <input name="email" type="email" autoComplete="username" dir="ltr" required />
      </label>
      <label className="field">
        <span>كلمة السر</span>
        <input name="password" type="password" autoComplete="current-password" dir="ltr" required />
      </label>
      {state?.error && <p className="alert">{state.error}</p>}
      <button className="btn btn-gold btn-block" disabled={pending}>
        {pending ? "جارٍ الدخول…" : "تسجيل الدخول"}
      </button>
    </form>
  );
}
