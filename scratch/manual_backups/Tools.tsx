import { Search, Image, LineChart } from "lucide-react";

export default function Tools() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">도구 모음</h1>
        <p className="text-gray-600">블로그 운영을 돕는 유용한 도구들입니다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
            <LineChart size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">SEO 점검</h3>
          <p className="text-gray-500 text-sm">발행한 포스팅의 URL을 입력하면 구글 SEO 기준에 얼마나 부합하는지 점수를 매기고 개선점을 알려줍니다.</p>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:border-green-300 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition-transform">
            <Search size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">키워드 분석 (고급)</h3>
          <p className="text-gray-500 text-sm">특정 키워드의 월간 검색량, 문서 수, 경쟁 강도를 분석하여 수익성 있는 키워드인지 판별합니다.</p>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm hover:border-purple-300 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
            <Image size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">이미지 최적화</h3>
          <p className="text-gray-500 text-sm">블로그 업로드용 이미지를 WebP 포맷으로 자동 변환하고 용량을 압축하여 페이지 로딩 속도를 개선합니다.</p>
        </div>
      </div>
    </div>
  );
}
