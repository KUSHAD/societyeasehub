import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto mt-20 max-w-6xl border-t py-8">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          © {new Date().getFullYear()} SocietyEaseHub. All rights reserved.
        </span>
        <div className="flex space-x-4">
          <Link className="text-sm text-gray-600 hover:text-gray-800" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="text-sm text-gray-600 hover:text-gray-800" href="/tos">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
