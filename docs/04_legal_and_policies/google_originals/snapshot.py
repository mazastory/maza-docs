#!/usr/bin/env python3
"""
구글 정책 문서의 **원문 스냅샷**을 만든다 (2026-10-08).

─── 왜 만들었나 ────────────────────────────────────────────────────────────
`maza-docs` 와 바탕화면 백업에 "구글 공식 가이드"라는 이름의 파일이 있었다. 열어 보니 **구글 원문이 아니라 AI 가 쓴 한국어 요약**이었고
구글이 하지 않은 말("반드시 사람이 확인", "경험담 1문단" 등)이 섞여 있었다. 그 파일을 원문이라 믿고 보관했다.
그래서 **요약이 아니라 원문 그대로**를 직접 내려받아 두고, **언제 받았고 지문이 무엇인지** 남긴다.

─── 무엇을 어떻게 저장하나 ────────────────────────────────────────────────
· developers.google.com (검색 센터): 페이지 푸터에 **Creative Commons Attribution 4.0** 이 적혀 있어 **출처를 밝히면 원문 그대로 보관할 수 있다.**
  본문(`<article>`)만 뽑아 마크다운으로 저장한다. 요약·번역·수정을 하지 않는다. (HTML→글자 변환만 한다)
· support.google.com (애드센스 도움말·게시자 정책): 저작권이 구글에 있고 CC 라이선스 표시가 없다. **본문을 복제하지 않는다.**
  주소·받은 시각·**본문 지문(sha256)** 만 남긴다. 구글이 문서를 바꾸면 지문이 달라져서 알 수 있다. 읽으려면 링크를 연다.

쓰는 법
  python3 snapshot.py            # 스냅샷을 만들고, 이전과 달라진 문서를 알려준다
  python3 snapshot.py --check    # 저장하지 않고 달라졌는지만 본다
"""
import hashlib, html, json, os, re, sys, urllib.request, datetime
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
UA = {'User-Agent': 'Mozilla/5.0 (snapshot for internal policy reference)'}

SOURCES = [
    # (파일 이름, 주소, 저장 방식)  full = CC BY 4.0 라 원문 전문 보관 / fingerprint = 지문만
    ('search-spam-policies',        'https://developers.google.com/search/docs/essentials/spam-policies',            'full'),
    ('search-using-gen-ai-content', 'https://developers.google.com/search/docs/fundamentals/using-gen-ai-content',   'full'),
    ('search-creating-helpful-content', 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content', 'full'),
    ('search-blog-2023-ai-content', 'https://developers.google.com/search/blog/2023/02/google-search-and-ai-content', 'full'),
    ('adsense-eligibility',         'https://support.google.com/adsense/answer/9724',                                'fingerprint'),
    ('adsense-program-policies',    'https://support.google.com/adsense/answer/48182',                               'fingerprint'),
    ('publisher-replicated-content','https://support.google.com/publisherpolicies/answer/11190248',                  'fingerprint'),
    ('publisher-low-value-content', 'https://support.google.com/publisherpolicies/answer/11112688',                  'fingerprint'),
]

SKIP_TAGS = {'script', 'style', 'noscript', 'svg', 'nav', 'button', 'form', 'select', 'option', 'iframe', 'template'}
UI_JUNK = re.compile(r'^(Send feedback|Was this helpful\?|Thank you for your feedback|Yes|No|Table of contents|On this page|Share|Copy|link)$', re.I)


class Md(HTMLParser):
    """<article> 안의 글자만 마크다운으로. 요약하지 않는다."""
    def __init__(self, base):
        super().__init__(convert_charrefs=True)
        self.base, self.out, self.depth, self.skip, self.in_art = base, [], 0, 0, False
        self.href = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'article' and not self.in_art:
            self.in_art = True; self.depth = 1; return
        if not self.in_art: return
        if tag == 'article': self.depth += 1
        if tag in SKIP_TAGS or tag.startswith('devsite-feedback') or tag == 'devsite-toc': self.skip += 1; return
        if self.skip: return
        if tag in ('h1', 'h2', 'h3', 'h4'): self.out.append('\n\n' + '#' * int(tag[1]) + ' ')
        elif tag in ('p', 'div', 'section', 'ul', 'ol', 'blockquote', 'table', 'dl'): self.out.append('\n\n' if tag in ('p', 'ul', 'ol', 'table', 'blockquote') else '\n')
        elif tag == 'li': self.out.append('\n- ')
        elif tag == 'tr': self.out.append('\n| ')
        elif tag in ('td', 'th'): self.out.append('')
        elif tag == 'br': self.out.append('\n')
        elif tag in ('code', 'tt'): self.out.append('`')
        elif tag in ('strong', 'b'): self.out.append('**')
        elif tag in ('em', 'i'): self.out.append('*')
        elif tag == 'a':
            h = a.get('href') or ''
            self.href.append(h)
            self.out.append('[')

    def handle_endtag(self, tag):
        if not self.in_art: return
        if tag == 'article':
            self.depth -= 1
            if self.depth == 0: self.in_art = False
            return
        if tag in SKIP_TAGS or tag.startswith('devsite-feedback') or tag == 'devsite-toc':
            self.skip = max(0, self.skip - 1); return
        if self.skip: return
        if tag in ('td', 'th'): self.out.append(' | ')
        elif tag in ('code', 'tt'): self.out.append('`')
        elif tag in ('strong', 'b'): self.out.append('**')
        elif tag in ('em', 'i'): self.out.append('*')
        elif tag == 'a':
            h = self.href.pop() if self.href else ''
            if h and not h.startswith('#') and not h.startswith('javascript'):
                if h.startswith('/'): h = self.base + h
                self.out.append(f']({h})')
            else:
                # 링크가 아닌 앵커: 대괄호를 되돌린다
                for k in range(len(self.out) - 1, -1, -1):
                    if self.out[k] == '[': self.out[k] = ''; break
                    if k < len(self.out) - 40: break
                self.out.append('')

    def handle_data(self, data):
        if self.in_art and not self.skip: self.out.append(data)

    def text(self):
        t = ''.join(self.out)
        t = re.sub(r'[ \t]+\n', '\n', t)
        t = re.sub(r'\n{3,}', '\n\n', t)
        lines = [l for l in t.split('\n') if not UI_JUNK.match(l.strip())]
        t = '\n'.join(lines)
        i = re.search(r'^# ', t, re.M)          # 맨 앞의 탐색 경로(Home > Search Central > …)는 본문이 아니다
        if i: t = t[i.start():]
        return t.strip() + '\n'


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode('utf-8', errors='replace'), r.status


def main():
    check = '--check' in sys.argv
    idx_path = os.path.join(HERE, 'INDEX.json')
    prev = json.load(open(idx_path, encoding='utf-8')) if os.path.exists(idx_path) else {}
    now = datetime.date.today().isoformat()
    index, changed = {}, []
    for name, url, mode in SOURCES:
        try:
            raw, status = fetch(url)
        except Exception as e:
            print(f'✗ {name}: 받지 못함 — {e}'); index[name] = prev.get(name, {'url': url, 'error': str(e)}); continue
        raw_sha = hashlib.sha256(raw.encode('utf-8')).hexdigest()
        base = re.match(r'https://[^/]+', url).group(0)
        if mode == 'full':
            p = Md(base); p.feed(raw); body = p.text()
            lic = bool(re.search(r'Creative Commons Attribution 4\.0', raw))
            if not lic: print(f'⚠️ {name}: CC BY 4.0 문구가 없다 — 전문 보관하지 않는다'); mode = 'fingerprint'
        if mode == 'full':
            body_sha = hashlib.sha256(body.encode('utf-8')).hexdigest()
            head = (f'<!-- 구글 원문 스냅샷 (수정·요약·번역 없음 — HTML 을 글자로 바꾼 것뿐) -->\n'
                    f'<!-- 출처: {url} -->\n<!-- 받은 날: {now} · 본문 sha256: {body_sha} -->\n'
                    f'<!-- 라이선스: 페이지 푸터에 Creative Commons Attribution 4.0 License 가 적혀 있어 출처를 밝히고 보관한다. 원본이 정본이다 -->\n\n')
            if not check: open(os.path.join(HERE, name + '.md'), 'w', encoding='utf-8').write(head + body)
            fp = body_sha; chars = len(body)
        else:
            # 도움말은 본문을 복제하지 않는다 — 지문만. (<main> 또는 article 의 글자를 지문으로)
            p = Md(base); p.feed(raw); body = p.text()
            if len(body) < 300:   # article 이 없는 페이지 — 전체 가시 텍스트로
                body = html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', re.sub(r'<(script|style|noscript)[\s\S]*?</\1>', ' ', raw))))
            fp = hashlib.sha256(body.encode('utf-8')).hexdigest(); chars = len(body)
        old = prev.get(name, {}).get('fingerprint')
        if old and old != fp: changed.append(name)
        index[name] = {'url': url, 'mode': mode, 'retrieved': now, 'http': status, 'fingerprint': fp, 'chars': chars}
        print(f"{'✔' if mode=='full' else '·'} {name:<32} {mode:<11} {chars:>7}자  {fp[:12]}…" + ('   ⚠️ 이전과 달라졌다' if old and old != fp else ''))
    if not check:
        json.dump(index, open(idx_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print('\n달라진 문서:', changed if changed else '없음(처음이거나 그대로)')


if __name__ == '__main__':
    main()
