// Features Component
export function Features() {
  const features = [
    {
      title: "Lightning Fast",
      description: "Process payments in milliseconds with our optimized infrastructure",
      icon: "⚡"
    },
    {
      title: "Bank-Grade Security", 
      description: "End-to-end encryption and fraud protection keep your money safe",
      icon: "🔒"
    },
    {
      title: "Global Reach",
      description: "Send and receive payments worldwide with minimal fees",
      icon: "🌍"
    },
    {
      title: "Smart Analytics",
      description: "Track spending patterns and optimize your financial decisions",
      icon: "📊"
    },
    {
      title: "24/7 Support",
      description: "Our dedicated team is always here to help you succeed",
      icon: "🎧"
    },
    {
      title: "Easy Integration",
      description: "Simple APIs and SDKs for seamless platform integration",
      icon: "🔧"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose PayFade?
          </h2>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto">
            Built for modern businesses that demand speed, security, and reliability
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-[#171717] p-8 rounded-xl border border-slate-700 hover:border-slate-500 transition-all duration-300 hover:transform hover:scale-105 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

