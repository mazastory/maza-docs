import React from 'react';

export default function PageDemoQCClinic() {
  return (
    <div className="w-full h-[calc(100vh-140px)] relative overflow-hidden bg-[#0e0e14]">
      <iframe 
        src="/html_demos/qc-13-demo.html" 
        className="w-full h-full border-0 absolute top-0 left-0"
        title="QC Clinic Demo"
      />
    </div>
  );
}
