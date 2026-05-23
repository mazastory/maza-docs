import { 
  Globe, LayoutTemplate, Puzzle, Server, Box
} from "lucide-react";

// Docs site: document pillars only
// Main app pillars (challenge, autopilot, mysite, mypage) live at mazastudio.kr
export const CORE_PILLARS = [
  { path: "/knowledge?category=tistory", label: "티스토리 세팅", icon: LayoutTemplate },
  { path: "/knowledge?category=extension", label: "익스텐션 연동", icon: Puzzle },
  { path: "/knowledge?category=wordpress", label: "워드프레스 세팅", icon: Globe },
  { path: "/knowledge?category=blogspot", label: "블로그스팟 세팅", icon: Server },
  { path: "/knowledge?category=subdomain", label: "서브도메인 개설", icon: Box },
];

export const ATOMIC_TOOLS: never[] = [];
