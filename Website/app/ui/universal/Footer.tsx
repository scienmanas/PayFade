import Link from "next/link";
import logoImg from "@/public/assets/logo/logo.png";

//TODO: Insert a google form lnik in the 

interface Author {
  name: string;
  url: string;
}

export function Footer() {
  const authors: Author[] = [
    {
      name: "Manas",
      url: "https://scienmanas.xyz",
    },
    {
      name: "Nikhil Srivastava",
      url: "https://nikhilsrv.page",
    },
  ];

  return (
    <footer className="w-full bg-[#2b2b55] text-white mt-20">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand/Logo Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold">PayFade</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Crafted with passion and precision by two dedicated developers.
            </p>
            <Link
              href="/"
              className="text-sm decoration-dashed underline decoration-slate-500 hover:decoration-slate-200 duration-200 mt-3"
            >
              Report an Issue
            </Link>
          </div>

          {/* Creators Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Created By</h3>
            <div className="space-y-1">
              {authors.map((author, index) => (
                <div key={index} className="flex items-center space-x-2 w-fit">
                  <Link
                    href={author.url}
                    className="text-gray-300 hover:text-white transition-colors duration-200 underline decoration-gray-500 hover:decoration-white"
                  >
                    {author.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Support Us</h3>
            <p className="text-gray-300 text-sm">
              Consider supporting our work through donations to help us continue
              building amazing projects.
            </p>
            <button className="bg-white text-black px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors duration-200 rounded">
              Donate Now
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-800 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © 2025 All rights reserved.
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="/legal/terms-and-conditions"
              className="text-gray-400 hover:text-white transition-colors duration-200 underline decoration-gray-600 hover:decoration-white"
            >
              Terms & Conditions
            </Link>
            <div className="w-px h-4 bg-gray-600"></div>
            <Link
              href="/legal/privacy-policy"
              className="text-gray-400 hover:text-white transition-colors duration-200 underline decoration-gray-600 hover:decoration-white"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
