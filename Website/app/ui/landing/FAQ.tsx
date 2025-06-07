"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { firaSansFont } from "@/app/lib/fonts";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<null | number>(null);

  const faqData: FAQItem[] = [
    {
      question: "Are there any terms for use?",
      answer:
        "Yes, PayFade is intended for ethical use only. It should not be used to harm or disrupt websites without consent. Always ensure you have permission from the website owner before applying any opacity changes.",
    },
    {
      question: "Is it open source?",
      answer:
        "Yes, PayFade is an open-source project. You can find the source code on our GitHub repository. Contributions are welcome!",
    },
    {
      question: "How do I use PayFade?",
      answer:
        "You can refer to the demo video in the landing page. If you need further assistance, please check the documentation on our GitHub repository or contact us (email mention just above the Footer).",
    },
    {
      question: "Are you backed by any organization?",
      answer:
        "No, PayFade is an independent open-source project. Currently we are not backed by any organization or company, but we are seeking for donations to support the project.",
    },
    {
      question: "Can I contribute to PayFade?",
      answer:
        "Absolutely! We welcome contributions from the community. You can contribute by reporting issues, suggesting features, or submitting pull requests on our GitHub repository.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can mail at iamscientistmanas@gmail.com. For urgent issues, please open an issue on our GitHub repository, and we will get back to you as soon as possible.",
    },
  ];

  return (
    <section
      className={`FAQ w-full h-fit p-4 flex flex-col items-center justify-center gap-14 font-sans ${firaSansFont.className}`}
    >
      <div className="flex w-fit h-fit flex-col items-center justify-center gap-2">
        <h1 className="text-center w-fit h-fit text-lg sm:text-2xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-center w-fit h-full text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about our products and services.
          Can't find what you're looking for? Contact our support team.
        </p>
      </div>

      <div className="bg-white w-full flex flex-col gap-0 overflow-hidden">
        {faqData.map((faq, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-4 py-4 text-left flex items-center justify-between duration-200"
            >
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                {faq.question}
              </h3>
              <div
                className={`transition-transform duration-200 ease-in-out ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                <FaChevronDown className="w-3 h-3 text-gray-600" />
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 pb-4">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>

            {/* Divider between FAQ items */}
            {index < faqData.length - 1 && (
              <div className="px-4">
                <div className="border-t border-dashed border-gray-300"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
