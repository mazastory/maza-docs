import { 
  Globe, LayoutTemplate, Puzzle, Server, Box, BookOpen, HelpCircle, Trophy
} from "lucide-react";

// Docs site: document pillars only
// Main app pillars (challenge, autopilot, mysite, mypage) live at mazastudio.kr
export const CORE_PILLARS = [
  { path: "/knowledge?category=extension", label: "익스텐션 설치", icon: Puzzle },
  { path: "/knowledge?category=tistory", label: "티스토리 세팅", icon: LayoutTemplate },
  { path: "/knowledge?category=wordpress", label: "워드프레스 세팅", icon: Globe },
  { path: "/knowledge?category=blogspot", label: "블로그스팟 세팅", icon: Server },
  { path: "/knowledge?category=subdomain", label: "서브도메인 개설", icon: Box },
  { path: "/knowledge?category=adsense_challenge", label: "AdSense 챌린지", icon: Trophy },
  { path: "/guide", label: "노하우", icon: BookOpen },
  { path: "/faq", label: "FAQ", icon: HelpCircle },
];

export const ATOMIC_TOOLS: never[] = [];
