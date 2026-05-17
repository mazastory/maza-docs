def main():
    file_path = "/Users/m/Desktop/mazastudio/src/pages/KnowledgeHub.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Step 1: Remove Chapter 2, 3, 4 blocks
    # We locate the start block:
    start_marker = "      {/* ──────────────────────────────────────────────────────────── */}\n      {/* CHAPTER 2: 익스텐션 1초 설치 (extension_install) */}"
    # And the end marker (just after the closing tag of Chapter 4 analytics_sync)
    # The end of Chapter 4 is:
    #             </p>\n          </div>\n        </div>\n      )}"
    # Let's find a very unique end block:
    end_marker = "            </p>\n          </div>\n        </div>\n      )}"
    
    start_idx = content.find(start_marker)
    if start_idx == -1:
        # Try with slightly different line endings (just in case of Windows vs Mac \r\n)
        start_marker = start_marker.replace("\n", "\r\n")
        start_idx = content.find(start_marker)
        
    end_idx = content.find(end_marker, start_idx)
    if end_idx == -1:
        end_marker = end_marker.replace("\n", "\r\n")
        end_idx = content.find(end_marker, start_idx)
        
    if start_idx != -1 and end_idx != -1:
        print("Found Chapter 2 to 4 block to delete!")
        # Delete from start_marker to the end of end_marker
        delete_end = end_idx + len(end_marker)
        content_deleted = content[:start_idx] + content[delete_end:]
    else:
        print(f"ERROR: Could not locate Chapter 2 to 4 block! start_idx={start_idx}, end_idx={end_idx}")
        return

    # Step 2: Encapsulate the Visual Carousel inside setup_guide
    # Find the transition block before the carousel:
    # In original KnowledgeHub:
    #                    </div>\n                 )}\n              </div>\n           </div>\n        </div>\n      )}"
    # Let's look for a unique transition string:
    transition_marker = "                 )}\n              </div>\n           </div>\n        </div>\n      )}"
    transition_marker_alt = transition_marker.replace("\n", "\r\n")
    
    trans_idx = content_deleted.find(transition_marker)
    if trans_idx == -1:
        trans_idx = content_deleted.find(transition_marker_alt)
        transition_marker = transition_marker_alt

    if trans_idx != -1:
        print("Found setup_guide closing tag marker!")
        # We replace the closing tags (remove </div> and )})
        # Replacement removes </div> and )} and keeps the container div open!
        replacement = "                 )}\n              </div>\n           </div>"
        if "\r\n" in transition_marker:
            replacement = replacement.replace("\n", "\r\n")
        content_deleted = content_deleted[:trans_idx] + replacement + content_deleted[trans_idx + len(transition_marker):]
    else:
        print("ERROR: Could not find setup_guide closing tag marker!")
        return

    # Step 3: Add the closing tags after the carousel
    # The carousel ends right before Chapter 5 (which is zero_it_value).
    # Since we deleted chapters 2, 3, 4, the text immediately following the carousel is:
    #       {/* ──────────────────────────────────────────────────────────── */}\n      {/* CHAPTER 5: 제로 IT 혁신 & ROI (zero_it_value) */}
    carousel_end_marker = "            </div>\n\n\n      {/* ──────────────────────────────────────────────────────────── */}\n      {/* CHAPTER 5: 제로 IT 혁신 & ROI (zero_it_value) */}"
    carousel_end_marker_alt = carousel_end_marker.replace("\n", "\r\n")
    
    end_carousel_idx = content_deleted.find(carousel_end_marker)
    if end_carousel_idx == -1:
        end_carousel_idx = content_deleted.find(carousel_end_marker_alt)
        carousel_end_marker = carousel_end_marker_alt
        
    if end_carousel_idx != -1:
        print("Found carousel end marker!")
        # We close the inner div and activeTab setup_guide block here!
        replacement_end = "            </div>\n        </div>\n      )}\n\n\n      {/* ──────────────────────────────────────────────────────────── */}\n      {/* CHAPTER 5: 제로 IT 혁신 & ROI (zero_it_value) */}"
        if "\r\n" in carousel_end_marker:
            replacement_end = replacement_end.replace("\n", "\r\n")
        content_deleted = content_deleted[:end_carousel_idx] + replacement_end + content_deleted[end_carousel_idx + len(carousel_end_marker):]
    else:
        print("ERROR: Could not find carousel end marker!")
        return

    # Step 4: Apply contrast styling to Visual Setup Walkthrough Carousel container
    carousel_style_marker = '            {/* Visual Setup Walkthrough Carousel */}\n            <div className="mt-12 bg-white/5 border border-white/10'
    carousel_style_marker_alt = carousel_style_marker.replace("\n", "\r\n")
    
    style_idx = content_deleted.find(carousel_style_marker)
    if style_idx == -1:
        style_idx = content_deleted.find(carousel_style_marker_alt)
        carousel_style_marker = carousel_style_marker_alt
        
    if style_idx != -1:
        print("Found carousel style marker!")
        replacement_style = '            {/* Visual Setup Walkthrough Carousel */}\n            <div className="mt-12 bg-slate-900 border border-slate-800'
        if "\r\n" in carousel_style_marker:
            replacement_style = replacement_style.replace("\n", "\r\n")
        content_deleted = content_deleted[:style_idx] + replacement_style + content_deleted[style_idx + len(carousel_style_marker):]
    else:
        print("Found (already modified) carousel style marker or could not find it.")

    # Save the updated file
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content_deleted)
        
    print("Robust cleanup completed successfully!")

if __name__ == "__main__":
    main()
