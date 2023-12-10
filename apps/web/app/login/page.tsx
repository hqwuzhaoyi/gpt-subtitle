import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { UserAuthForm } from "./components/user-auth-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage(props: {
  searchParams: { error: string | undefined };
}) {
  const { GITHUB_CLIENT_ID: id, GITHUB_CLIENT_SECRET: secret } = process.env;
  const supportGithub = !!id && !!secret;
  return (
    <>
      <div className="container relative hidden h-[600px] flex-col items-center justify-center md:grid lg:max-w-none  lg:px-0">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to your account
              </h1>
              {/* <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p> */}
            </div>
            <UserAuthForm
              supportGithub={supportGithub}
              type="signIn"
              error={props.searchParams?.error}
            />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
