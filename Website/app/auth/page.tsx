"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/public/assets/logo/logo.png";
import { AuthPageLoader } from "../ui/loaders";
import { firaSansFont } from "@/app/lib/fonts";

export default function Auth() {
  // Routers and state management
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);

  // Handle authentication
  async function handleGoogleAuthentication() {
    const googleAuthUrl = new URL(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );

    googleAuthUrl.searchParams.set(
      "client_id",
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
    );
    googleAuthUrl.searchParams.set(
      "redirect_uri",
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
    );
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");

    router.push(googleAuthUrl.toString());
  }
  async function handleGitHubAuthentication() {
    const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
    githubAuthUrl.searchParams.set(
      "client_id",
      process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!
    );
    githubAuthUrl.searchParams.set(
      "redirect_uri",
      process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI!
    );

    githubAuthUrl.searchParams.set("response_type", "code");
    githubAuthUrl.searchParams.set("scope", "read:user user:email");

    router.push(githubAuthUrl.toString());
  }

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/auth/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.status === 200) router.push("/dashboard");
      else setMounted(true);
    };

    checkAuth();
  }, [router]);

  if (!mounted) return <AuthPageLoader />;
  else
    return (
      <div
        className={`min-h-screen bg-white flex items-center justify-center px-4 ${firaSansFont.className}`}
      >
        <div className="max-w-md w-full space-y-8">
          {/* Sign-in Card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <div className="space-y-4">
              {/* Logo/Brand Section */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Link href={"/"} className="w-fit h-fit">
                    <Image
                      src={logoImg}
                      alt="logoImg"
                      height={50}
                      className="rounded-lg"
                    />
                  </Link>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Login/Sign up
                </h2>
                <p className="text-gray-600 mt-2">
                  Glad to have you here — many developers are already building
                  with us.
                </p>
              </div>

              {/* Google Sign-in Button */}
              <button
                onClick={handleGoogleAuthentication}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 hover:border-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 font-medium"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Github Sign-in Button */}
              <button
                onClick={handleGitHubAuthentication}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 hover:border-black focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 font-medium"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.997.108-.776.42-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.932 0-1.31.468-2.38 1.235-3.22-.125-.303-.535-1.522.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.403c1.02.005 2.047.137 3.003.403 2.29-1.552 3.297-1.23 3.297-1.23.653 1.654.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.63-5.48 5.922.432.372.816 1.103.816 2.222 0 1.606-.015 2.9-.015 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.296 24 12c0-6.63-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Secure sign-in
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No password required
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure authentication
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Quick setup in seconds
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>
              By signing up, you agree to our{" "}
              <button
                onClick={() =>
                  (window.location.href = "/legal/terms-and-conditions")
                }
                className="text-black underline font-medium"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                onClick={() => (window.location.href = "/legal/privacy-policy")}
                className="text-black underline font-medium"
              >
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    );
}
