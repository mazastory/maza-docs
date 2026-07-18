import React from 'react';

export default function PageDemoCrowdFunding() {
  return (
    <div className="w-full h-[calc(100vh-140px)] relative overflow-hidden bg-[#0e0e14]">
      <iframe 
        src="/html_demos/crowdfunding-demo.html" 
        className="w-full h-full border-0 absolute top-0 left-0"
        title="Crowdfunding Demo"
      />
    </div>
  );
}
