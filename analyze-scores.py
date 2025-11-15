import json

with open('src/data/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# 計算各維度的總分與題目數
dimensions = {}
for q in questions:
    dim = q['quadrant']
    if dim not in dimensions:
        dimensions[dim] = {'total': 0, 'count': 0, 'questions': []}
    dimensions[dim]['total'] += q['maxScore']
    dimensions[dim]['count'] += 1
    dimensions[dim]['questions'].append({'id': q['id'], 'score': q['maxScore'], 'type': q['type']})

# 計算總分
total_score = sum(d['total'] for d in dimensions.values())

print('=== 各維度分數分布 ===\n')
for dim, data in sorted(dimensions.items()):
    percentage = (data['total'] / total_score) * 100
    print(f"{dim}: {data['total']}分 ({percentage:.1f}%) - {data['count']}題")
    print(f"  每題平均: {data['total'] / data['count']:.1f}分")
    q_list = ', '.join([f"{q['id']}({q['score']}分)" for q in data['questions']])
    print(f"  題目: {q_list}")
    print()

print(f"總分: {total_score}分")
print()

# 檢查是否有單一題目佔比過高
print('=== 單題佔比檢查 ===\n')
high_score_questions = [q for q in questions if (q['maxScore'] / total_score) * 100 > 5]
if high_score_questions:
    print('⚠️ 以下題目單題佔總分超過 5%：')
    for q in high_score_questions:
        percentage = (q['maxScore'] / total_score) * 100
        print(f"  {q['id']} ({q['quadrant']}, {q['type']}): {q['maxScore']}分 ({percentage:.1f}%)")
else:
    print('✅ 沒有單題佔比過高的問題')
print()

# 檢查最高分題目
max_score = max(q['maxScore'] for q in questions)
max_questions = [q for q in questions if q['maxScore'] == max_score]
print(f"最高分題目: {max_score}分")
for q in max_questions:
    print(f"  {q['id']} ({q['quadrant']}, {q['type']})")
print()

# 情境題統計
scenario_questions = [q for q in questions if q['type'] == 'scenario']
scenario_total = sum(q['maxScore'] for q in scenario_questions)
scenario_percentage = (scenario_total / total_score) * 100
print('=== 情境題統計 ===\n')
print(f"情境題數量: {len(scenario_questions)}題 ({len(scenario_questions)/len(questions)*100:.1f}%)")
print(f"情境題總分: {scenario_total}分 ({scenario_percentage:.1f}%)")
print()

# 檢查情境題的分數分布
print('=== 情境題分數考慮 distribution 後的維度分布 ===\n')
dimension_scenario_scores = {}
for q in scenario_questions:
    if 'distribution' in q and q['distribution']:
        for dim, ratio in q['distribution'].items():
            score = q['maxScore'] * ratio
            if dim not in dimension_scenario_scores:
                dimension_scenario_scores[dim] = 0
            dimension_scenario_scores[dim] += score
    else:
        dim = q['quadrant']
        if dim not in dimension_scenario_scores:
            dimension_scenario_scores[dim] = 0
        dimension_scenario_scores[dim] += q['maxScore']

for dim, score in sorted(dimension_scenario_scores.items()):
    print(f"{dim}: {score:.1f}分 (來自情境題)")
print()

# 計算包含 distribution 後的真實維度分數
print('=== 真實維度分數 (考慮 distribution) ===\n')
real_dimensions = {}
for q in questions:
    if q['type'] == 'scenario' and 'distribution' in q and q['distribution']:
        for dim, ratio in q['distribution'].items():
            score = q['maxScore'] * ratio
            if dim not in real_dimensions:
                real_dimensions[dim] = 0
            real_dimensions[dim] += score
    else:
        dim = q['quadrant']
        if dim not in real_dimensions:
            real_dimensions[dim] = 0
        real_dimensions[dim] += q['maxScore']

real_total = sum(real_dimensions.values())
for dim, score in sorted(real_dimensions.items()):
    percentage = (score / real_total) * 100
    print(f"{dim}: {score:.1f}分 ({percentage:.1f}%)")
print(f"\n真實總分: {real_total:.1f}分")
