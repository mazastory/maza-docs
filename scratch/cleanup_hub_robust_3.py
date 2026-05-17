def main():
    file_path = "/Users/m/Desktop/mazastudio/src/pages/KnowledgeHub.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Normalize line endings to LF
    content_lf = content.replace("\r\n", "\n")
    print(f"Original content size: {len(content_lf)}")

    # Step 1: Remove Chapter 2, 3, 4 blocks
    # We find the unique header strings
    ch2_str = "CHAPTER 2: 익스텐션 1초 설치 (extension_install)"
    ch5_str = "CHAPTER 5: 제로 IT 혁신 & ROI (zero_it_value)"
    
    ch2_idx = content_lf.find(ch2_str)
    ch5_idx = content_lf.find(ch5_str)
    
    if ch2_idx == -1 or ch5_idx == -1:
        print(f"ERROR: Unique headers not found! ch2_idx={ch2_idx}, ch5_idx={ch5_idx}")
        return
        
    # Search backwards from ch2_idx to find the start of the divider {/* ───...
    divider_ch2 = content_lf.rfind("{/* ───", 0, ch2_idx)
    # Search backwards from ch5_idx to find the start of its divider {/* ───...
    divider_ch5 = content_lf.rfind("{/* ───", 0, ch5_idx)
    
    if divider_ch2 == -1 or divider_ch5 == -1:
        print(f"ERROR: Dividers not found! divider_ch2={divider_ch2}, divider_ch5={divider_ch5}")
        return
        
    print(f"Deleting Chapter 2 to 4 block (indices {divider_ch2} to {divider_ch5})...")
    content_deleted = content_lf[:divider_ch2] + content_lf[divider_ch5:]

    # Step 2: Keep container div open at the end of Chapter 1 setup_guide
    # Search for setup_guide end transition
    # We look for the closing tags )} immediately before the Visual Carousel
    carousel_comment = "{/* Visual Setup Walkthrough Carousel */}"
    carousel_idx = content_deleted.find(carousel_comment)
    if carousel_idx == -1:
        print("ERROR: Carousel comment not found!")
        return
        
    # Search backwards from carousel_idx to find the closing tags "</div>\n      )}"
    # Let's search for ")}" backwards from carousel_idx
    close_tags_idx = content_deleted.rfind(")}", 0, carousel_idx)
    if close_tags_idx == -1:
        print("ERROR: Closing tags not found backwards from carousel!")
        return
        
    # Search backwards from close_tags_idx to find the preceding "</div>"
    div_close_idx = content_deleted.rfind("</div>", 0, close_tags_idx)
    if div_close_idx == -1:
        print("ERROR: Preceding </div> not found!")
        return
        
    # We want to remove the "</div>" and ")}" and any whitespace between them
    # Let's do this by taking content up to div_close_idx and content from close_tags_idx + 2
    # But wait! We need to make sure we don't accidentally delete unrelated elements.
    # The block we want to delete is:
    # "</div>\n      )}" or "</div>\r\n      )}"
    # Let's inspect the exact substring from div_close_idx to close_tags_idx + 2
    sub = content_deleted[div_close_idx:close_tags_idx+2]
    print(f"Removing transition tags: {repr(sub)}")
    content_deleted = content_deleted[:div_close_idx] + content_deleted[close_tags_idx+2:]

    # Step 3: Close container div and conditional block after the carousel
    # Now, Chapter 5 immediately follows the carousel.
    # We find the divider before Chapter 5
    ch5_idx_new = content_deleted.find(ch5_str)
    divider_ch5_new = content_deleted.rfind("{/* ───", 0, ch5_idx_new)
    
    if divider_ch5_new == -1:
        print("ERROR: Chapter 5 divider not found after deletion!")
        return
        
    # We want to insert the closing tags "        </div>\n      )}\n\n" right before the Chapter 5 divider
    print(f"Inserting closing tags before Chapter 5 divider (idx {divider_ch5_new})...")
    content_deleted = content_deleted[:divider_ch5_new] + "        </div>\n      )}\n\n" + content_deleted[divider_ch5_new:]

    # Step 4: Apply slate-900 style to the carousel container
    carousel_style = '            <div className="mt-12 bg-white/5 border border-white/10 rounded-[48px]'
    carousel_style_replacement = '            <div className="mt-12 bg-slate-900 border border-slate-800 rounded-[48px]'
    
    style_idx = content_deleted.find(carousel_style)
    if style_idx != -1:
        print("Found style marker!")
        content_deleted = content_deleted.replace(carousel_style, carousel_style_replacement)
    else:
        print("Already modified or style marker not found.")

    # Save the updated file
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content_deleted)
        
    print("Robust cleanup 3 completed successfully!")

if __name__ == "__main__":
    main()
