"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mgr-form">
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
