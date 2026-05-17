def main():
    file_path = "/Users/m/Desktop/mazastudio/src/pages/KnowledgeHub.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Normalize line endings to LF to avoid matching issues
    content_lf = content.replace("\r\n", "\n")
    print(f"Original content size: {len(content_lf)}")

    # Step 1: Remove Chapter 2, 3, 4 blocks
    # Deleting everything from Chapter 2 start up to Chapter 5 start (exclusive)
    start_ch2 = "      {/* ──────────────────────────────────────────────────────────── */}\n      {/* CHAPTER 2: 익스텐션 1초 설치 (extension_install) */}"
    # The end of Chapter 4 analytics_sync block before Chapter 5
    end_ch4_part = "            </p>\n          </div>\n        </div>\n      )}\n\n\n      {/* ──────────────────────────────────────────────────────────── */}\n      {/* CHAPTER 5: 제로 IT 혁신 & ROI (zero_it_value) */}"
    
    start_idx = content_lf.find(start_ch2)
    end_idx = content_lf.find(end_ch4_part)
    
    if start_idx != -1 and end_idx != -1:
        print("Found Chapter 2-4 deletion markers!")
        # Delete from start_ch2 to just before the Chapter 5 header in end_ch4_part
        target_ch5_header = "\n\n\n      {/* ──────────────────────────────────────────────────────────── */}\n      {/* CHAPTER 5: 제로 IT 혁신 & ROI (zero_it_value) */}"
        delete_end_idx = end_idx + content_lf[end_idx:].find(target_ch5_header)
        content_lf = content_lf[:start_idx] + content_lf[delete_end_idx:]
    else:
        print(f"ERROR: Deletion markers not found! start_idx={start_idx}, end_idx={end_idx}")
        return

    # Step 2: Keep container div open at line 599 by removing </div> and )}
    open_transition = "         </div>\n      )}\n\n\n            {/* Visual Setup Walkthrough Carousel */}"
    open_replacement = "         \n\n\n            {/* Visual Setup Walkthrough Carousel */}"
    
    trans_idx = content_lf.find(open_transition)
    if trans_idx != -1:
        print("Found open transition marker!")
        content_lf = content_lf.replace(open_transition, open_replacement)
    else:
        print("ERROR: Open transition marker not found!")
        return

    # Step 3: Close container div and conditional block after the carousel
    # Now, Chapter 5 immediately follows the carousel.
    # The carousel end in content_lf is:
    #                  </div>\n              </div>\n            </div>\n\n\n      {/* ──────────────────────────────────────────────────────────── */}\n      {/* CHAPTER 5: 제로 IT 혁신 & ROI (zero_it_value) */}"
    close_transition = "                 </div>\n              </div>\n            </div>\n\n\n      {/* ──────────────────────────────────────────────────────────── */}\n      {/* CHAPTER 5: 제로 IT 혁신 & ROI (zero_it_value) */}"
    close_replacement = "                 </div>\n              </div>\n            </div>\n        </div>\n      )}\n\n\n      {/* ──────────────────────────────────────────────────────────── */}\n      {/* CHAPTER 5: 제로 IT 혁신 & ROI (zero_it_value) */}"
    
    close_idx = content_lf.find(close_transition)
    if close_idx != -1:
        print("Found close transition marker!")
        content_lf = content_lf.replace(close_transition, close_replacement)
    else:
        print("ERROR: Close transition marker not found!")
        return

    # Step 4: Apply slate-900 style to the carousel container
    carousel_style = '            <div className="mt-12 bg-white/5 border border-white/10 rounded-[48px]'
    carousel_style_replacement = '            <div className="mt-12 bg-slate-900 border border-slate-800 rounded-[48px]'
    
    style_idx = content_lf.find(carousel_style)
    if style_idx != -1:
        print("Found style marker!")
        content_lf = content_lf.replace(carousel_style, carousel_style_replacement)
    else:
        print("ERROR: Carousel style marker not found!")

    # Write back the cleaned file
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content_lf)
        
    print("Robust cleanup 2 completed successfully!")

if __name__ == "__main__":
    main()
