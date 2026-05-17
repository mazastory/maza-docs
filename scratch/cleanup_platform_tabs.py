def main():
    file_path = "/Users/m/Desktop/mazastudio/src/pages/KnowledgeHub.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    content_lf = content.replace("\r\n", "\n")
    print(f"Current file size: {len(content_lf)}")

    # 1. Prune redundant parts from Tistory Quick Panel tab
    # We want to remove everything from:
    #                     <div className="space-y-4">
    #                       <div className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] px-4">⚡️ ZERO-IT QUICK ACTIONS (Don't Read, Just Click)</div>
    # up to the end of Tistory secrets block, just before the closing </div> of the Tistory tab block (which corresponds to line 484).
    # Let's locate the Tistory secrets block start:
    tistory_secrets_marker = "                    {/* Tistory Secrets */}"
    # Wait, in the code it is:
    #                     {/* Tistory Secrets */}
    # Let's search for "ZERO-IT QUICK ACTIONS"
    start_tistory_prune = content_lf.find('                      <div className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] px-4">⚡️ ZERO-IT QUICK ACTIONS')
    # If not found, look for "ZERO-IT QUICK ACTIONS"
    if start_tistory_prune == -1:
        start_tistory_prune = content_lf.find('⚡️ ZERO-IT QUICK ACTIONS')
        
    # We want to find the outer <div className="space-y-4"> preceding it
    tistory_div_start = content_lf.rfind('<div className="space-y-4">', 0, start_tistory_prune)
    
    # We want to prune up to the end of Tistory secrets div block.
    # The secrets block ends with:
    #                     </div>\n                  </div>\n                )}
    # Let's search for this from tistory_div_start:
    tistory_secrets_end = content_lf.find('                    </div>\n                  </div>\n                )}', tistory_div_start)
    if tistory_secrets_end == -1:
        tistory_secrets_end = content_lf.find('                    </div>\n                  </div>\n                )}'.replace('\n', '\r\n'), tistory_div_start)
        
    if tistory_div_start != -1 and tistory_secrets_end != -1:
        print("Found Tistory tab redundant text to prune!")
        # We delete from tistory_div_start to tistory_secrets_end
        content_lf = content_lf[:tistory_div_start] + "                  " + content_lf[tistory_secrets_end:]
    else:
        print(f"ERROR: Tistory prune markers not found! div_start={tistory_div_start}, secrets_end={tistory_secrets_end}")
        return

    # 2. Prune redundant part from Blogger tab
    # We want to remove the description block:
    #                     <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-4">
    #                       <h5 className="text-lg font-black text-white italic tracking-tighter">🍊 구글 블로거(Blogger): 애드센스 초고속 통과 가이드</h5>
    #                       ...
    #                     </div>
    # Let's find "구글 블로거(Blogger): 애드센스 초고속 통과 가이드"
    blogger_text = "🍊 구글 블로거(Blogger): 애드센스 초고속 통과 가이드"
    blogger_idx = content_lf.find(blogger_text)
    if blogger_idx != -1:
        print("Found Blogger tab redundant text to prune!")
        blogger_div_start = content_lf.rfind('<div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-4">', 0, blogger_idx)
        # Find the next closing </div> following blogger_idx
        blogger_div_end = content_lf.find('</div>', blogger_idx)
        if blogger_div_start != -1 and blogger_div_end != -1:
            # Delete the div block (up to </div> + 6 spaces)
            content_lf = content_lf[:blogger_div_start] + content_lf[blogger_div_end + len('</div>'):]
            
    # 3. Prune redundant part from WordPress tab
    # We want to remove the description block:
    #                     <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-4">
    #                       <h5 className="text-lg font-black text-white italic tracking-tighter">🌐 워드프레스(WordPress): 글로벌 상위 1% SEO 구성</h5>
    #                       ...
    #                     </div>
    wp_text = "🌐 워드프레스(WordPress): 글로벌 상위 1% SEO 구성"
    wp_idx = content_lf.find(wp_text)
    if wp_idx != -1:
        print("Found WordPress tab redundant text to prune!")
        wp_div_start = content_lf.rfind('<div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-4">', 0, wp_idx)
        # Find the end of this div block. It contains sub-divs, so let's find the closing tag just before the closing Tab tag:
        #                     </div>\n                  </div>\n                )}
        # Let's find "                  </div>\n                )}" from wp_idx:
        wp_div_end_marker = "                  </div>\n                )}"
        wp_div_end = content_lf.find(wp_div_end_marker, wp_idx)
        if wp_div_end == -1:
            wp_div_end = content_lf.find(wp_div_end_marker.replace('\n', '\r\n'), wp_idx)
            
        if wp_div_start != -1 and wp_div_end != -1:
            content_lf = content_lf[:wp_div_start] + content_lf[wp_div_end:]

    # Save the updated file
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content_lf)
        
    print("Platform tab text pruning completed successfully!")

if __name__ == "__main__":
    main()
