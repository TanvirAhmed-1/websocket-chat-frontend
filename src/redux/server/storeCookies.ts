"use server";

import { cookies } from "next/headers";

export async function setTokenCookie(token: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: false,
      path: "/",
      sameSite: "lax",
    });
  } catch (err) {
    console.warn("setTokenCookie server action non-fatal warning:", err);
  }
}

export async function removeTokenCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");
  } catch (err) {
    console.warn("removeTokenCookie server action non-fatal warning:", err);
  }
}

export async function getTokenCookie(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("token")?.value;
  } catch {
    return undefined;
  }
}
