interface CheckoutStepsProps {
  currentStep: number;
}

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { number: 1, title: 'Shipping', icon: 'ri-map-pin-line' },
    { number: 2, title: 'Payment & Delivery', icon: 'ri-secure-payment-line' }
  ];

  return (
    <div className="flex items-center justify-between max-w-xl mx-auto mt-8 mb-12 relative px-4">
      {/* Background Line */}
      <div className="absolute left-[15%] right-[15%] top-6 h-0.5 bg-gray-200 -z-10"></div>
      
      {/* Active Line (Progress) */}
      <div 
        className="absolute left-[15%] top-6 h-0.5 bg-brand-violet transition-all duration-500 ease-in-out -z-10"
        style={{ width: currentStep === 1 ? '0%' : '70%' }}
      ></div>

      {steps.map((step) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <div key={step.number} className="flex flex-col items-center relative z-0">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm border-4 ${
              isActive
                ? 'bg-brand-violet text-white border-white scale-110'
                : isCompleted
                  ? 'bg-brand-violet text-white border-white'
                  : 'bg-white text-gray-400 border-gray-100'
            }`}>
              {isCompleted ? (
                <i className="ri-check-line text-xl font-bold"></i>
              ) : (
                <i className={`${step.icon} text-lg`}></i>
              )}
            </div>
            <div className="mt-4 text-center">
              <p className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${
                isActive ? 'text-gray-900' : isCompleted ? 'text-gray-900' : 'text-gray-400'
              }`}>
                Step {step.number}
              </p>
              <p className={`text-sm mt-1 transition-colors ${
                isActive ? 'text-gray-900 font-bold' : isCompleted ? 'text-gray-700 font-medium' : 'text-gray-500 font-medium'
              }`}>
                {step.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
