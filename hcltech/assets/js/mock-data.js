/* 3 HCLTech GET-Oriented Mock Assessments (NOT official). Indices into combined bank: A=0..64 (Python 0-24, SQL 25-44, Pseudo 45-54, CS 55-64), B offset +65 (Quant 65-84, Logic 85-104, Verbal 105-119, Cloud 120-129). Coding indices into CODING[]. */
window.MOCKS = [
{title:"Mock 1 — Baseline Filter",time:90,desc:"Mirrors the most-reported filter: cognitive speed + Python/SQL basics + 1 must-solve coding. Target: 70%+ MCQ and 1 coding solved.",
 mcq:[65,66,67,68,69, 85,86,87,88,89, 105,106,107,108,109, 0,3,6,11, 25,27,30,37, 47,48, 62,63],
 coding:[5,8], codingNote:"Q6 Armstrong + Q9 Largest — both actually reported in HCL paper-pen rounds."},
{title:"Mock 2 — Balanced Standard",time:90,desc:"Slightly heavier SQL + strings. Target: 75%+ MCQ and both coding solved (at least brute force).",
 mcq:[70,71,72,73,74, 90,91,92,93,94, 110,111,112,113,114, 4,8,13,20, 26,28,31,38, 49,50, 55,64],
 coding:[16,19], codingNote:"Q17 Reverse string + Q20 Anagram — string fluency check."},
{title:"Mock 3 — Final Boss (Medium tilt)",time:90,desc:"Includes the harder end (Two Sum, Valid Parentheses, subquery, recursion traces). Target: 65%+ MCQ and 1 coding fully + 1 attempted. If you clear this, the real filter should feel easier.",
 mcq:[75,76,77,78,79, 95,96,97,98,99, 115,116,117,118,119, 5,15,21,23, 29,32,36,43, 51,53, 57,58],
 coding:[26,32], codingNote:"Q27 Two Sum + Q33 Valid Parentheses — stretch goals; brute force earns partial credit thinking."}
];
