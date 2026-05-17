def main():
    file_path = "/Users/m/Desktop/mazastudio/src/pages/KnowledgeHub.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    print(f"Original lines count: {len(lines)}")
    
    # Verify key lines to make sure indices are correct
    # 0-indexed in python
    idx_584 = 583
    idx_585 = 584
    idx_589 = 588
    idx_679 = 678
    idx_696 = 695
    idx_1443 = 1442
    
    print(f"Line 584: {lines[idx_584].strip()}")
    print(f"Line 585: {lines[idx_585].strip()}")
    print(f"Line 589: {lines[idx_589].strip()}")
    print(f"Line 679: {lines[idx_679].strip()}")
    print(f"Line 696: {lines[idx_696].strip()}")
    print(f"Line 1443: {lines[idx_1443].strip()}")
    
    new_lines = []
    for i, line in enumerate(lines):
        # 1. Skip lines 696 to 1443 (indices 695 to 1442)
        if idx_696 <= i <= idx_1443:
            continue
            
        # 2. Skip printing line 584 & 585
        if i == idx_584 or i == idx_585:
            continue
            
        # 3. Replace background on line 589
        if i == idx_589:
            line = line.replace('bg-white/5 border border-white/10', 'bg-slate-900 border border-slate-800')
            
        new_lines.append(line)
        
        # 4. Append the closing tags after line 679 (index 678)
        if i == idx_679:
            new_lines.append("        </div>\n")
            new_lines.append("      )}\n")
            
    print(f"New lines count: {len(new_lines)}")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
        
    print("Orchestrated cleanup completed successfully!")

if __name__ == "__main__":
    main()
