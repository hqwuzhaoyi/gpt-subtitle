import { getToken } from "@/lib/getToken";
import { originProxy } from "@/lib/origin";
import { getCookies } from "cookies-next";
import { TmpCookiesObj } from "cookies-next/lib/types";
import { NextRequest, NextResponse } from "next/server";

const getCookiesString = (
  req: any,
  res: any,
  actionCookies?: TmpCookiesObj
) => {
  const cookies = actionCookies ?? getCookies({ req, res });
  const cookiesString = Object.entries(cookies)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value ?? "")}`
    )
    .join("; ");
  return cookiesString;
};

type FetchOptions = {
  req?: NextRequest;
  res?: NextResponse<unknown>;
  cookies?: TmpCookiesObj;
  headerCookies?: string;
};

export const getFetch = async (
  url: string,
  { req, res, cookies, headerCookies }: FetchOptions = {}
) => {
  const token = await getToken();
  return fetch(originProxy() + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token && `Bearer ${token.accessToken}`,
      Cookie:
        (req && res && getCookiesString(req, res, cookies)) ??
        headerCookies ??
        "",
    },
  });
};
export const postFetch = async (
  url: string,
  body: any,
  { req, res, cookies, headerCookies }: FetchOptions
) => {
  const token = await getToken();
  return fetch(originProxy() + url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token && `Bearer ${token.accessToken}`,
      Cookie:
        (req && res && getCookiesString(req, res, cookies)) ??
        headerCookies ??
        "",
    },
    body,
  });
};
