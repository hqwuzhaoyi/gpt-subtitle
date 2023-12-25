"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { signUp } from "../api/auth";
import { useProxyUrlAtom } from "@/atoms/proxyUrl";
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "signIn" | "signUp";
  error?: string;
  supportGithub?: boolean;
}

export function UserAuthForm({
  className,
  type,
  supportGithub,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [username, setUserName] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const proxyUrl = useProxyUrlAtom();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (type === "signUp") {
        await signUp(username, password);
      }
      await signIn("credentials", {
        username,
        password,
        redirect: true,
        callbackUrl: "/",
        proxyUrl,
      });
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label htmlFor="email">Username</Label>
            <Input
              id="username"
              type="username"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              onChange={(e) => setUserName(e.target.value)}
              value={username}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email">Password</Label>
            <Input
              id="password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          {!!props.error && (
            <p className="text-[0.8rem] text-red-600">Authentication Failed</p>
          )}
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {
              {
                signIn: "Sign In",
                signUp: "Sign Up",
              }[type]
            }
          </Button>
          {/* <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button> */}
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      {supportGithub && (
        <Button
          variant="outline"
          type="button"
          // disabled={!process.env.NEXT_PUBLIC_API_URL && isLoading}
          onClick={() => {
            signIn("github", {
              redirect: true,
              callbackUrl: "/",
            });
          }}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}{" "}
          Github
        </Button>
      )}
    </div>
  );
}
