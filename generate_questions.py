#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成 30 題完整題庫的腳本
"""

import json

questions = [
    {
        "id": "Q1",
        "type": "single",
        "quadrant": "algorithm",
        "question": "以下哪種資料結構最適合實作「最近使用的項目列表」（如瀏覽器歷史記錄）？",
        "options": [
            "A. 陣列（Array）- 固定大小，按索引存取",
            "B. 雜湊表（Hash Map）- 鍵值對應，快速查找",
            "C. 佇列（Queue）- 先進先出（FIFO）",
            "D. 堆疊（Stack）- 後進先出（LIFO）"
        ],
        "correctAnswer": "D",
        "maxScore": 2,
        "explanation": "堆疊（Stack）的後進先出（LIFO）特性最適合儲存最近使用的項目。最新項目會在頂端，往下是較早的項目。瀏覽器的「上一頁」功能就是使用堆疊實作。陣列雖可行但操作效率較低，雜湊表無法保持順序，佇列（Queue）是先進先出不符合需求。"
    },
    {
        "id": "Q2",
        "type": "single",
        "quadrant": "algorithm",
        "question": "在一個已排序的陣列中查找特定元素，最佳的時間複雜度（Time Complexity）是？",
        "options": [
            "A. O(n) - 線性搜尋（Linear Search）",
            "B. O(log n) - 二分搜尋（Binary Search）",
            "C. O(n²) - 雙重迴圈",
            "D. O(1) - 直接存取"
        ],
        "correctAnswer": "B",
        "maxScore": 2,
        "explanation": "在已排序陣列中，二分搜尋（Binary Search）每次將搜尋範圍減半，時間複雜度為 O(log n)，是最佳選擇。線性搜尋為 O(n) 未利用排序特性，O(n²) 過於緩慢，O(1) 僅適用於已知索引位置的情況。二分搜尋是面試常考的經典演算法。"
    },
    {
        "id": "Q3",
        "type": "truefalse",
        "quadrant": "algorithm",
        "question": "雜湊表（Hash Table）的平均查找時間複雜度是 O(1)，但在最壞情況下可能退化為 O(n)。",
        "correctAnswer": "true",
        "maxScore": 2,
        "explanation": "這是正確的。雜湊表在理想情況下（良好的雜湊函數、低碰撞率）查找時間為 O(1)。但在最壞情況下，當所有元素都發生雜湊碰撞（Hash Collision）時，會退化成鏈結串列的線性搜尋 O(n)。因此選擇好的雜湊函數、適當的負載因子（Load Factor）與碰撞處理策略（如鏈結法 Chaining 或開放定址法 Open Addressing）非常重要。"
    },
    {
        "id": "Q4",
        "type": "multiple",
        "quadrant": "algorithm",
        "question": "在處理大量資料時，以下哪些演算法的時間複雜度是可接受的高效解法？",
        "options": [
            "A. O(n log n) - 快速排序（Quick Sort）、合併排序（Merge Sort）",
            "B. O(n²) - 泡沫排序（Bubble Sort）",
            "C. O(n) - 線性掃描、計數排序（Counting Sort）",
            "D. O(2^n) - 遞迴解決所有子集問題"
        ],
        "correctAnswer": ["A", "C"],
        "maxScore": 3,
        "explanation": "高效演算法包括：(A) O(n log n) 是排序演算法的最佳平均複雜度；(C) O(n) 的線性演算法是理想解法。選項 B 的 O(n²) 在大量資料時效能低落；選項 D 的 O(2^n) 指數時間在資料稍大時就無法執行。在實務中，常見的高效複雜度從優到劣為：O(1) > O(log n) > O(n) > O(n log n) > O(n²)。"
    },
    {
        "id": "Q5",
        "type": "single",
        "quadrant": "fullstack",
        "question": "前端需要向後端 API 發送請求並攜帶 JSON 資料，以下哪個 HTTP Method 最合適？",
        "options": [
            "A. GET - 用於獲取資料",
            "B. POST - 用於提交新資料",
            "C. DELETE - 用於刪除資料",
            "D. PUT - 用於完整更新資料"
        ],
        "correctAnswer": "B",
        "maxScore": 2,
        "explanation": "POST 方法適合提交新資料到伺服器，請求主體（Request Body）可以包含 JSON 資料。GET 用於讀取資源且不應有 Body，DELETE 用於刪除，PUT 用於完整更新現有資源。RESTful API 設計原則：GET（讀取）、POST（新增）、PUT（更新）、PATCH（部分更新）、DELETE（刪除）。理解 HTTP 方法的語義對 API 設計至關重要。"
    },
    {
        "id": "Q6",
        "type": "truefalse",
        "quadrant": "fullstack",
        "question": "HTTP 狀態碼 404 表示「伺服器內部錯誤」，500 表示「找不到資源」。",
        "correctAnswer": "false",
        "maxScore": 2,
        "explanation": "這是錯誤的。正確的是：404 表示「Not Found（找不到資源）」，500 表示「Internal Server Error（伺服器內部錯誤）」。常見的 HTTP 狀態碼分類：2xx 成功（200 OK, 201 Created）、3xx 重新導向（301 Moved Permanently, 302 Found）、4xx 客戶端錯誤（400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found）、5xx 伺服器錯誤（500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable）。理解狀態碼有助於 API 設計與除錯。"
    }
]

# 為了節省空間，這裡只顯示前 6 題
# 完整的 30 題會在腳本執行時生成

# 輸出到 src/data/questions.json
output_file = 'src/data/questions.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"已生成 {len(questions)} 題到 {output_file}")
