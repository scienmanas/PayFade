import { useState } from "react";

// FAQ Component
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How secure is PayFade?",
      answer: "PayFade uses bank-grade encryption and follows industry best practices for security. All transactions are protected with end-to-end encryption, and we're compliant with PCI DSS standards."
    },
    {
      question: "What are the transaction fees?",
      answer: "We offer competitive rates starting at 1.4% + $0.30 per transaction for domestic payments, with lower rates for high-volume merchants. International transactions start at 2.9% + $0.30."
    },
    {
      question: "How long do transfers take?",
      answer: "Most transfers are processed instantly. Bank transfers typically take 1-3 business days, while crypto transactions are confirmed within minutes."
    },
    {
      question: "Which countries do you support?",
      answer: "PayFade supports over 180 countries worldwide. We're constantly expanding our reach to serve more regions and currencies."
    },
    {
      question: "Is there an API available?",
      answer: "Yes, we provide comprehensive REST APIs and SDKs for popular programming languages. Our documentation includes code examples and testing environments."
    },
    {
      question: "What support options are available?",
      answer: "We offer 24/7 customer support through live chat, email, and phone. Premium customers get dedicated account managers and priority support."
    }
  ];

  return (
    <section className="py-20 px-4 ">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-300 text-xl">
            Everything you need to know about PayFade
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-slate-700 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-800 transition-colors duration-200"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-white text-lg">
                  {faq.question}
                </span>
                <span className={`text-slate-400 transform transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 py-4 bg-slate-800 border-t border-slate-700">
                  <p className="text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

