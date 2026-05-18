import { 
  Globe, Settings, Monitor, BookOpen
} from "lucide-react";

// Docs site: document pillars only
// Main app pillars (challenge, autopilot, mysite, mypage) live at mazastudio.kr
export const CORE_PILLARS = [
  { path: "/installation-guide", label: "블로그 세팅 가이드", icon: Settings },
  { path: "/usage-guide", label: "프로그램 사용 가이드", icon: Monitor },
  { path: "/knowledge", label: "일반 지식 가이드", icon: BookOpen },
  { path: "/knowledge?tab=faq_page", label: "공지 및 FAQ", icon: Globe },
];

export const ATOMIC_TOOLS: never[] = [];
