"use client";

import Sidebar from "./Sidebar";
import ChatPanel from "./ChatPanel";

interface AppLayoutProps {
  children: React.ReactNode;
  pageContext: string;
  completedLessons?: Record<string, { completed: boolean }>;
}

export default function AppLayout({ children, pageContext, completedLessons }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-bg-primary">
      <Sidebar completedLessons={completedLessons} />
      <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
      <ChatPanel pageContext={pageContext} />
    </div>
  );
}
