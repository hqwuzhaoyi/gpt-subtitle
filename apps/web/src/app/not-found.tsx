export const dynamic = "force-dynamic";

import { Link } from "lib/navigation";

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md">
            <h1 className="text-6xl font-extrabold text-gray-900 dark:text-gray-100">
              404
            </h1>

            <div className="mt-6">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="/"
              >
                Return to homepage
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
