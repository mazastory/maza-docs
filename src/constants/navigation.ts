import { 
  Globe, Puzzle, Monitor, BookOpen
} from "lucide-react";

// Docs site: document pillars only
// Main app pillars (challenge, autopilot, mysite, mypage) live at mazastudio.kr
export const CORE_PILLARS = [
  { path: "/knowledge", label: "지식 센터 (매뉴얼)", icon: Globe },
  { path: "/installation-guide", label: "익스텐션 설치 가이드", icon: Puzzle },
  { path: "/usage-guide", label: "익스텐션 사용 가이드", icon: Monitor },
  { path: "/guide", label: "블루프린트 가이드", icon: BookOpen },
];

export const ATOMIC_TOOLS: never[] = [];
