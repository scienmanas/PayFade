import { firaSansFont } from "@/app/lib/fonts";
import Link from "next/link";

export function Contact() {
  return (
    <section className={`text-center p-6 bg-white ${firaSansFont.className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Still have questions?
      </h3>
      <p className="text-gray-600 mb-4">
        Ask us any additional questions. We are currently two developers, so
        might take time to respond, but we will do our best to help you out!
      </p>
      <Link
        href={"mailto:iamscientistmanas@gmail.com"}
        className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 transform hover:scale-105"
      >
        Contact Us
      </Link>
    </section>
  );
}
