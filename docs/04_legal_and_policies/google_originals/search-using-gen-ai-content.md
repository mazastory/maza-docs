<!-- 구글 원문 스냅샷 (수정·요약·번역 없음 — HTML 을 글자로 바꾼 것뿐) -->
<!-- 출처: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content -->
<!-- 받은 날: 2026-10-08 · 본문 sha256: b54c977bb0b3fb58772f804ab2f45192531c060c432370af737ed7c6745fbbd6 -->
<!-- 라이선스: 페이지 푸터에 Creative Commons Attribution 4.0 License 가 적혀 있어 출처를 밝히고 보관한다. 원본이 정본이다 -->

# Google Search's guidance on using generative AI content on your website

  Generative AI can be particularly useful when researching a topic, and to add structure to
  original content. However, using generative AI tools or other similar tools to generate many pages
  without adding value for users may violate [Google's spam policy on scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content).
  If you're using generative AI content on your website, **make sure your work meets the
  standards of the [Search Essentials](https://developers.google.com/search/docs/essentials) and our
  [spam policies](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content).**

  You might find value in looking at the [Search Quality Raters guidelines](https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf)
  on how to evaluate both scaled content abuse (section 4.6.5) and main content created with little
  to no effort, little to no originality, and little to no added value (section 4.6.6). These
  guidelines are not a guide to ranking first in Google; they're used by our
  [search raters](https://support.google.com/websearch/answer/9281931)
  to help evaluate the performance of our [various search ranking systems](https://developers.google.com/search/docs/appearance/ranking-systems-guide),
  and their ratings don't directly influence ranking.

### Focus on accuracy, quality, and relevance

  When creating content for the web, focus on accuracy, quality, and relevance, especially when
  automatically generating the content. Keep in mind that generative models don't retrieve facts,
  but predict a likely sequence of words based on their training data. Because of this, generative
  AI outputs may contain inaccuracies (also known as hallucinations). It is critical to manually
  factcheck and review all AI-generated content for accuracy and trustworthiness before publishing.

  This review also applies to metadata like
  [`<title>` elements](https://developers.google.com/search/docs/appearance/title-link),
  [meta description elements](https://developers.google.com/search/docs/appearance/snippet),
  [structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data), and
  [alternate texts for images](https://developers.google.com/tech-writing/accessibility/self-study/write-alt-text),
  which can appear in Search results.

  For structured data, also ensure compliance with the [general guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies),
  the specific policies for the individual search features, and [validate the markup](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
  to ensure eligibility for [Search features](https://developers.google.com/search/docs/appearance/structured-data/search-gallery).

### Give users context

  Sharing [information about how a piece of content was created](https://developers.google.com/search/docs/fundamentals/creating-helpful-content#how-the-content-was-created)
  can help give your readers more context. If you're automatically generating content, consider
  adding information on how your content was created in a way that makes sense for your audience,
  such as by providing more background information on how automation was used and adding
  [image metadata](https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata#add-metadata).

  For ecommerce sites, Google Merchant Center has [policies for AI-generated content](https://support.google.com/merchants/answer/14743464).
  In particular, AI-generated images must contain metadata using the IPTC `DigitalSourceType`
  [`TrainedAlgorithmicMedia`](https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia)
  metadata. AI-generated product data such as title and description attributes must be specified
  separately and labeled as AI-generated.

  For more, see our [FAQs in our blog post on AI-generated content](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content).
