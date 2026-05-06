import json
import os

log_file = "/Users/rudrakashi/.gemini/antigravity/brain/8d357213-6af9-48fa-9bf3-9d54059f5e09/.system_generated/logs/overview.txt"

with open(log_file, "r") as f:
    for line in f:
        data = json.loads(line)
        if "tool_calls" in data.get("content", "") or data.get("type") == "PLANNER_RESPONSE":
            if "tool_calls" in data:
                for tc in data["tool_calls"]:
                    if tc["name"] == "multi_replace_file_content":
                        print("FOUND MULTI REPLACE!")
                        print("File:", tc["args"].get("TargetFile"))
                        print("Instruction:", tc["args"].get("Instruction"))
                        try:
                            chunks = json.loads(tc["args"].get("ReplacementChunks", "[]"))
                            for i, chunk in enumerate(chunks):
                                print(f"--- Chunk {i} ---")
                                print("ReplacementContent:")
                                print(chunk["ReplacementContent"])
                        except Exception as e:
                            print("Error parsing chunks:", e)
                        print("="*50)
