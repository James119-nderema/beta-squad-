'use client'

import Navbar, { SidebarProvider, useSidebar } from "@/Components/Navbar";
import AttendanceDisplay from "@/Components/AttendanceView/AttendanceDisplay";

function DataAnalysisContent() {
  const { isSidebarVisible } = useSidebar();
  
  return (
    <div className="min-h-screen flex bg-white">
      <Navbar />
      <div className={`flex-1 transition-all duration-300 ${isSidebarVisible ? 'lg:ml-64' : 'lg:ml-0'}`}>
        <div className="p-6 pt-20 lg:pt-6">
          <AttendanceDisplay/>
        </div>
      </div>
    </div>
  );
}

export default function DataAnalysis() {
  return (
    <SidebarProvider>
      <DataAnalysisContent />
    </SidebarProvider>
  );
}
