export interface StepItem {
  line: number;
  code: string;
  vars?: Record<string, string>;
  log: string;
  arrayState?: { val: string; active?: boolean; match?: boolean }[];
}

export interface QuestionSolutionEntry {
  solutionJS: string;
  solutionPY: string;
  solutionCPP: string;
  visualizerSteps: StepItem[];
}

/**
 * Universal Question Solution & Visualizer Registry for CareerOS DSA Hub
 * Authentic, hand-crafted DSA questions with 100% problem-matched solutions and steppers.
 */
export const QUESTION_REGISTRY: Record<string, QuestionSolutionEntry> = {
  // ── 1. N-QUEENS PUZZLE PLACEMENT ──
  "n-queens puzzle placement": {
    solutionJS: `function nqueensPuzzlePlacement(n) {
  let result = [];
  let cols = new Set(), posDiag = new Set(), negDiag = new Set();
  let board = Array.from({ length: n }, () => '.'.repeat(n));

  function backtrack(r) {
    if (r === n) {
      result.push([...board]);
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) continue;
      cols.add(c); posDiag.add(r + c); negDiag.add(r - c);
      let rowChars = board[r].split('');
      rowChars[c] = 'Q';
      board[r] = rowChars.join('');

      backtrack(r + 1);

      cols.delete(c); posDiag.delete(r + c); negDiag.delete(r - c);
      board[r] = '.'.repeat(n);
    }
  }

  backtrack(0);
  return result;
}`,
    solutionPY: `def nqueens_puzzle_placement(n):
    res = []
    cols, pos_diag, neg_diag = set(), set(), set()
    board = [["."] * n for _ in range(n)]

    def backtrack(r):
        if r == n:
            res.append(["".join(row) for row in board])
            return
        for c in range(n):
            if c in cols or (r + c) in pos_diag or (r - c) in neg_diag:
                continue
            cols.add(c); pos_diag.add(r + c); neg_diag.add(r - c)
            board[r][c] = "Q"
            backtrack(r + 1)
            cols.remove(c); pos_diag.remove(r + c); neg_diag.remove(r - c)
            board[r][c] = "."

    backtrack(0)
    return res`,
    solutionCPP: `class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> res;
        vector<string> board(n, string(n, '.'));
        unordered_set<int> cols, posDiag, negDiag;

        auto backtrack = [&](auto& self, int r) -> void {
            if (r == n) { res.push_back(board); return; }
            for (int c = 0; c < n; ++c) {
                if (cols.count(c) || posDiag.count(r + c) || negDiag.count(r - c)) continue;
                cols.insert(c); posDiag.insert(r + c); negDiag.insert(r - c);
                board[r][c] = 'Q';
                self(self, r + 1);
                cols.erase(c); posDiag.erase(r + c); negDiag.erase(r - c);
                board[r][c] = '.';
            }
        };
        backtrack(backtrack, 0);
        return res;
    }
};`,
    visualizerSteps: [
      { line: 1, code: "function nqueensPuzzlePlacement(n) {", vars: { n: "4", boardSize: "4x4" }, log: "Initialize 4x4 N-Queens chessboard and tracking sets for cols, posDiag, negDiag", arrayState: [{ val: ". . . ." }, { val: ". . . ." }, { val: ". . . ." }, { val: ". . . ." }] },
      { line: 2, code: "  let cols = new Set(), posDiag = new Set(), negDiag = new Set();", vars: { cols: "{}", posDiag: "{}", negDiag: "{}" }, log: "Initialize tracking sets to prevent row/column/diagonal Queen attacks", arrayState: [{ val: ". . . ." }, { val: ". . . ." }, { val: ". . . ." }, { val: ". . . ." }] },
      { line: 3, code: "  function backtrack(r) { if (r === n) { result.push([...board]); return; } }", vars: { r: "0", status: "Searching Row 0" }, log: "Start backtracking at Row 0. Try placing Queen at Column 1 (0, 1)", arrayState: [{ val: ". Q . .", active: true }, { val: ". . . ." }, { val: ". . . ." }, { val: ". . . ." }] },
      { line: 4, code: "  if (cols.has(c) || posDiag.has(r+c) || negDiag.has(r-c)) continue;", vars: { r: "1", cols: "{1}", posDiag: "{1}", negDiag: "{-1}" }, log: "Row 0 -> Q at (0,1). Advance to Row 1 -> Place Q at (1, 3)", arrayState: [{ val: ". Q . .", match: true }, { val: ". . . Q", active: true }, { val: ". . . ." }, { val: ". . . ." }] },
      { line: 5, code: "  cols.add(c); posDiag.add(r + c); negDiag.add(r - c); backtrack(r + 1);", vars: { r: "2", cols: "{1, 3}", posDiag: "{1, 4}", negDiag: "{-1, -2}" }, log: "Row 1 -> Q at (1,3). Advance to Row 2 -> Place Q at (2, 0)", arrayState: [{ val: ". Q . .", match: true }, { val: ". . . Q", match: true }, { val: "Q . . .", active: true }, { val: ". . . ." }] },
      { line: 6, code: "  return result; // 4-QUEENS VALID PLACEMENT FOUND!", vars: { solutionCount: "2", validBoard: "[.Q.., ...Q, Q..., ..Q.]" }, log: "Valid N-Queens placement found! All 4 Queens placed with zero diagonal/row attacks.", arrayState: [{ val: ". Q . .", match: true }, { val: ". . . Q", match: true }, { val: "Q . . .", match: true }, { val: ". . Q .", match: true }] },
    ]
  },

  // ── 2. SUBSETS ALL POSSIBLE COMBINATIONS ──
  "subsets all possible combinations": {
    solutionJS: `function subsets(nums) {
  let result = [];
  function backtrack(index, current) {
    result.push([...current]);
    for (let i = index; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}`,
    solutionPY: `def subsets(nums):
    res = []
    def backtrack(start, curr):
        res.append(list(curr))
        for i in range(start, len(nums)):
            curr.append(nums[i])
            backtrack(i + 1, curr)
            curr.pop()
    backtrack(0, [])
    return res`,
    solutionCPP: `class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> curr;
        auto backtrack = [&](auto& self, int start) -> void {
            res.push_back(curr);
            for (int i = start; i < nums.size(); ++i) {
                curr.push_back(nums[i]);
                self(self, i + 1);
                curr.pop_back();
            }
        };
        backtrack(backtrack, 0);
        return res;
    }
};`,
    visualizerSteps: [
      { line: 1, code: "function subsets(nums) {", vars: { nums: "[1, 2, 3]", result: "[]" }, log: "Initialize backtracking algorithm to generate 2^N power set for nums = [1, 2, 3]", arrayState: [{ val: "[]", active: true }] },
      { line: 4, code: "  result.push([...current]); // Root level", vars: { index: "0", current: "[]", result: "[[]]" }, log: "Base step: Push initial empty subset [] to result array", arrayState: [{ val: "[]", match: true }] },
      { line: 6, code: "  current.push(nums[0]); // Pick 1", vars: { i: "0", num: "1", current: "[1]" }, log: "Loop i = 0: Push 1 to current. Recurse backtrack(1, [1]). Push [1] to result.", arrayState: [{ val: "[]", match: true }, { val: "[1]", active: true }] },
      { line: 7, code: "  backtrack(1, [1]); // Recurse with 1", vars: { index: "1", current: "[1, 2]" }, log: "Loop i = 1: Push 2 to current. Recurse backtrack(2, [1, 2]). Push [1, 2] to result.", arrayState: [{ val: "[]", match: true }, { val: "[1]", match: true }, { val: "[1, 2]", active: true }] },
      { line: 7, code: "  backtrack(2, [1, 2]); // Recurse with 2", vars: { index: "2", current: "[1, 2, 3]" }, log: "Loop i = 2: Push 3 to current. Recurse backtrack(3, [1, 2, 3]). Push [1, 2, 3] to result.", arrayState: [{ val: "[]", match: true }, { val: "[1]", match: true }, { val: "[1, 2]", match: true }, { val: "[1, 2, 3]", active: true }] },
      { line: 8, code: "  current.pop(); // Backtrack from 3 to 2, then 2 to 1", vars: { current: "[1, 3]", popped: "2" }, log: "Pop 3 & 2 -> Loop i = 2: Push 3 to current [1]. Recurse -> Push [1, 3] to result.", arrayState: [{ val: "[]", match: true }, { val: "[1]", match: true }, { val: "[1, 2]", match: true }, { val: "[1, 2, 3]", match: true }, { val: "[1, 3]", active: true }] },
      { line: 6, code: "  current.push(nums[1]); // Backtrack to root, pick 2", vars: { i: "1", num: "2", current: "[2]" }, log: "Pop 3 & 1 -> Root loop i = 1: Push 2 to current. Push [2] & [2, 3] to result.", arrayState: [{ val: "[]", match: true }, { val: "[1]", match: true }, { val: "[1, 2]", match: true }, { val: "[1, 2, 3]", match: true }, { val: "[1, 3]", match: true }, { val: "[2]", active: true }, { val: "[2, 3]", active: true }] },
      { line: 12, code: "  return result; // ALL 8 SUBSETS GENERATED!", vars: { totalSubsets: "8 (2^3)", status: "COMPLETE" }, log: "Backtrack to root, pick 3 -> Push [3] to result. All 8 subsets generated cleanly!", arrayState: [{ val: "[]", match: true }, { val: "[1]", match: true }, { val: "[1, 2]", match: true }, { val: "[1, 2, 3]", match: true }, { val: "[1, 3]", match: true }, { val: "[2]", match: true }, { val: "[2, 3]", match: true }, { val: "[3]", match: true }] }
    ]
  },

  // ── 3. REST API STATUS CODES EXPLANATION & HANDLER ──
  "rest api status codes explanation & handler": {
    solutionJS: `function restApiStatusCodesExplanationHandler(statusCode) {
  switch(statusCode) {
    case 200: return { status: 200, label: "OK", payload: "Success" };
    case 400: return { status: 400, label: "Bad Request", error: "Invalid client payload" };
    case 401: return { status: 401, label: "Unauthorized", error: "Invalid Bearer Token" };
    case 404: return { status: 404, label: "Not Found", error: "Resource missing" };
    case 500: return { status: 500, label: "Internal Server Error", error: "Database timeout" };
    default:  return { status: statusCode, label: "Unknown Code" };
  }
}`,
    solutionPY: `def rest_api_status_codes_handler(status_code):
    match status_code:
        case 200: return {"status": 200, "message": "OK"}
        case 400: return {"status": 400, "message": "Bad Request"}
        case 401: return {"status": 401, "message": "Unauthorized"}
        case 404: return {"status": 404, "message": "Not Found"}
        case 500: return {"status": 500, "message": "Server Error"}
        case _: return {"status": status_code, "message": "Unknown"}`,
    solutionCPP: `class Solution {
public:
    string handleStatusCode(int status) {
        switch (status) {
            case 200: return "200 OK";
            case 400: return "400 Bad Request";
            case 401: return "401 Unauthorized";
            case 404: return "404 Not Found";
            case 500: return "500 Server Error";
            default:  return "Unknown";
        }
    }
};`,
    visualizerSteps: [
      { line: 1, code: "function restApiStatusCodesExplanationHandler(statusCode) {", vars: { statusCode: "200" }, log: "Receive HTTP status code response from API Gateway", arrayState: [{ val: "200 OK", match: true }, { val: "400 Bad Request" }, { val: "401 Unauthorized" }, { val: "404 Not Found" }, { val: "500 Server Error" }] },
      { line: 2, code: "  switch(statusCode) { case 200: return { status: 200, label: 'OK' }; }", vars: { label: "'OK'", code: "200" }, log: "HTTP 200 OK -> Payload dispatched cleanly to frontend UI.", arrayState: [{ val: "200 OK", match: true }, { val: "400 Bad Request" }, { val: "401 Unauthorized" }, { val: "404 Not Found" }, { val: "500 Server Error" }] },
    ]
  },

  // ── 4. REVERSE ARRAY IN GROUPS ──
  "reverse array in groups": {
    solutionJS: `function reverseInGroups(arr, k) {
  let n = arr.length;
  for (let i = 0; i < n; i += k) {
    let left = i;
    let right = Math.min(i + k - 1, n - 1);
    while (left < right) {
      let temp = arr[left];
      arr[left] = arr[right];
      arr[right] = temp;
      left++;
      right--;
    }
  }
  return arr;
}`,
    solutionPY: `def reverseInGroups(arr, k):
    n = len(arr)
    for i in range(0, n, k):
        left = i
        right = min(i + k - 1, n - 1)
        while left < right:
            arr[left], arr[right] = arr[right], arr[left]
            left += 1
            right -= 1
    return arr`,
    solutionCPP: `void reverseInGroups(vector<long long>& arr, int k) {
    int n = arr.size();
    for (int i = 0; i < n; i += k) {
        int left = i;
        int right = min(i + k - 1, n - 1);
        while (left < right) {
            swap(arr[left], arr[right]);
            left++;
            right--;
        }
    }
}`,
    visualizerSteps: [
      { line: 1, code: "function reverseInGroups(arr = [1, 2, 3, 4, 5, 6, 7, 8], k = 3) {", vars: { k: "3", n: "8" }, log: "Initialize array [1, 2, 3, 4, 5, 6, 7, 8] with group size k = 3.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8" }] },
      { line: 3, code: "  let left = 0, right = Math.min(0 + 3 - 1, 7) = 2; // Group 1", vars: { i: "0", left: "0 (val 1)", right: "2 (val 3)" }, log: "Group 1 (idx 0 to 2): Swap arr[0] (1) with arr[2] (3).", arrayState: [{ val: "1", active: true }, { val: "2" }, { val: "3", active: true }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8" }] },
      { line: 6, code: "  swap(arr[0], arr[2]); // Subarray 1 reversed -> [3, 2, 1]", vars: { left: "1", right: "1" }, log: "Subarray [1, 2, 3] reversed to [3, 2, 1]. Advance loop i += 3.", arrayState: [{ val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8" }] },
      { line: 3, code: "  let left = 3, right = Math.min(3 + 3 - 1, 7) = 5; // Group 2", vars: { i: "3", left: "3 (val 4)", right: "5 (val 6)" }, log: "Group 2 (idx 3 to 5): Swap arr[3] (4) with arr[5] (6).", arrayState: [{ val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "4", active: true }, { val: "5" }, { val: "6", active: true }, { val: "7" }, { val: "8" }] },
      { line: 6, code: "  swap(arr[3], arr[5]); // Subarray 2 reversed -> [6, 5, 4]", vars: { left: "4", right: "4" }, log: "Subarray [4, 5, 6] reversed to [6, 5, 4]. Advance loop i += 3.", arrayState: [{ val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "6", match: true }, { val: "5", match: true }, { val: "4", match: true }, { val: "7" }, { val: "8" }] },
      { line: 3, code: "  let left = 6, right = Math.min(6 + 3 - 1, 7) = 7; // Group 3", vars: { i: "6", left: "6 (val 7)", right: "7 (val 8)" }, log: "Group 3 (idx 6 to 7): Swap arr[6] (7) with arr[7] (8).", arrayState: [{ val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "6", match: true }, { val: "5", match: true }, { val: "4", match: true }, { val: "7", active: true }, { val: "8", active: true }] },
      { line: 11, code: "  return arr; // FINAL: [3, 2, 1, 6, 5, 4, 8, 7]", vars: { status: "COMPLETE" }, log: "All groups reversed in-place! Final Result: [3, 2, 1, 6, 5, 4, 8, 7].", arrayState: [{ val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "6", match: true }, { val: "5", match: true }, { val: "4", match: true }, { val: "8", match: true }, { val: "7", match: true }] }
    ]
  },

  // ── 5. BEST TIME TO BUY AND SELL STOCK ──
  "best time to buy and sell stock": {
    solutionJS: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (let price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice;
    }
  }
  return maxProfit;
}`,
    solutionPY: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit`,
    solutionCPP: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX;
    int maxProfit = 0;
    for (int price : prices) {
        if (price < minPrice) minPrice = price;
        else if (price - minPrice > maxProfit) maxProfit = price - minPrice;
    }
    return maxProfit;
}`,
    visualizerSteps: [
      { line: 1, code: "function maxProfit(prices = [7, 1, 5, 3, 6, 4]) {", vars: { minPrice: "Infinity", maxProfit: "0" }, log: "Initialize stock prices [7, 1, 5, 3, 6, 4]. minPrice = Infinity, maxProfit = 0.", arrayState: [{ val: "7" }, { val: "1" }, { val: "5" }, { val: "3" }, { val: "6" }, { val: "4" }] },
      { line: 5, code: "  if (price < minPrice) minPrice = 7;", vars: { i: "0", price: "7", minPrice: "7", maxProfit: "0" }, log: "Day 1 (price 7): Set minPrice = 7.", arrayState: [{ val: "7", active: true }, { val: "1" }, { val: "5" }, { val: "3" }, { val: "6" }, { val: "4" }] },
      { line: 5, code: "  if (price < minPrice) minPrice = 1; // NEW LOWEST BUY PRICE!", vars: { i: "1", price: "1", minPrice: "1", maxProfit: "0" }, log: "Day 2 (price 1): New lowest buy price found! Update minPrice = 1.", arrayState: [{ val: "7" }, { val: "1", active: true }, { val: "5" }, { val: "3" }, { val: "6" }, { val: "4" }] },
      { line: 7, code: "  else if (5 - 1 > 0) maxProfit = 4; // PROFIT = 4", vars: { i: "2", price: "5", minPrice: "1", maxProfit: "4" }, log: "Day 3 (price 5): Selling at 5 gives profit 5 - 1 = 4. Update maxProfit = 4.", arrayState: [{ val: "7" }, { val: "1", match: true }, { val: "5", active: true }, { val: "3" }, { val: "6" }, { val: "4" }] },
      { line: 7, code: "  else if (3 - 1 > 4) // False (2 <= 4)", vars: { i: "3", price: "3", minPrice: "1", maxProfit: "4" }, log: "Day 4 (price 3): Profit 3 - 1 = 2 is less than maxProfit (4). Keep maxProfit = 4.", arrayState: [{ val: "7" }, { val: "1", match: true }, { val: "5" }, { val: "3", active: true }, { val: "6" }, { val: "4" }] },
      { line: 7, code: "  else if (6 - 1 > 4) maxProfit = 5; // NEW MAX PROFIT = 5!", vars: { i: "4", price: "6", minPrice: "1", maxProfit: "5" }, log: "Day 5 (price 6): Selling at 6 gives profit 6 - 1 = 5. Update maxProfit = 5!", arrayState: [{ val: "7" }, { val: "1", match: true }, { val: "5" }, { val: "3" }, { val: "6", match: true }, { val: "4" }] },
      { line: 10, code: "  return maxProfit; // FINAL MAX PROFIT = 5", vars: { maxProfit: "5", buyDay: "Day 2 ($1)", sellDay: "Day 5 ($6)" }, log: "Day 6 (price 4): Profit 3 <= 5. Traversal finished! Maximum profit achieved is $5 (Buy at $1, Sell at $6).", arrayState: [{ val: "7" }, { val: "1", match: true }, { val: "5" }, { val: "3" }, { val: "6", match: true }, { val: "4" }] }
    ]
  },

  // ── 6. CONTAINS DUPLICATE ──
  "contains duplicate": {
    solutionJS: `function containsDuplicate(nums) {
  let seen = new Set();
  for (let num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}`,
    solutionPY: `def containsDuplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
    solutionCPP: `bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int num : nums) {
        if (seen.count(num)) return true;
        seen.insert(num);
    }
    return false;
}`,
    visualizerSteps: [
      { line: 1, code: "function containsDuplicate(nums = [1, 2, 3, 1]) {", vars: { seen: "{}" }, log: "Initialize Hash Set 'seen' for O(1) duplicate checking.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "1" }] },
      { line: 4, code: "  seen.add(1); // Set = {1}", vars: { num: "1", seen: "{1}" }, log: "Inspect index 0 (val 1): Not in seen set. Insert 1 into seen.", arrayState: [{ val: "1", active: true }, { val: "2" }, { val: "3" }, { val: "1" }] },
      { line: 4, code: "  seen.add(2); // Set = {1, 2}", vars: { num: "2", seen: "{1, 2}" }, log: "Inspect index 1 (val 2): Not in seen set. Insert 2 into seen.", arrayState: [{ val: "1" }, { val: "2", active: true }, { val: "3" }, { val: "1" }] },
      { line: 4, code: "  seen.add(3); // Set = {1, 2, 3}", vars: { num: "3", seen: "{1, 2, 3}" }, log: "Inspect index 2 (val 3): Not in seen set. Insert 3 into seen.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3", active: true }, { val: "1" }] },
      { line: 3, code: "  if (seen.has(1)) return true; // DUPLICATE DETECTED!", vars: { num: "1", duplicateFound: "true" }, log: "Inspect index 3 (val 1): 1 already exists in 'seen' set! DUPLICATE DETECTED. Return true!", arrayState: [{ val: "1", match: true }, { val: "2" }, { val: "3" }, { val: "1", match: true }] }
    ]
  },

  // ── 7. CONVERT ARRAY INTO ZIG-ZAG FASHION ──
  "convert array into zig-zag fashion": {
    solutionJS: `function zigZag(arr) {
  let flag = true; // true = '<', false = '>'
  for (let i = 0; i < arr.length - 1; i++) {
    if (flag) {
      if (arr[i] > arr[i + 1]) swap(arr, i, i + 1);
    } else {
      if (arr[i] < arr[i + 1]) swap(arr, i, i + 1);
    }
    flag = !flag;
  }
  return arr;
}`,
    solutionPY: `def zigZag(arr):
    flag = True
    for i in range(len(arr) - 1):
        if flag:
            if arr[i] > arr[i + 1]:
                arr[i], arr[i + 1] = arr[i + 1], arr[i]
        else:
            if arr[i] < arr[i + 1]:
                arr[i], arr[i + 1] = arr[i + 1], arr[i]
        flag = not flag
    return arr`,
    solutionCPP: `void zigZag(vector<int>& arr) {
    bool flag = true;
    for (int i = 0; i < arr.size() - 1; i++) {
        if (flag) {
            if (arr[i] > arr[i + 1]) swap(arr[i], arr[i + 1]);
        } else {
            if (arr[i] < arr[i + 1]) swap(arr[i], arr[i + 1]);
        }
        flag = !flag;
    }
}`,
    visualizerSteps: [
      { line: 1, code: "function zigZag(arr = [4, 3, 7, 8, 6, 2, 1]) {", vars: { flag: "true (<)" }, log: "Initialize array [4, 3, 7, 8, 6, 2, 1]. Goal pattern: a < b > c < d > e...", arrayState: [{ val: "4" }, { val: "3" }, { val: "7" }, { val: "8" }, { val: "6" }, { val: "2" }, { val: "1" }] },
      { line: 4, code: "  if (4 > 3) swap(0, 1); // Expected '<', got 4 > 3 -> SWAP!", vars: { i: "0", expected: "<", swapped: "true" }, log: "Index 0 (expected <): arr[0] (4) > arr[1] (3). Violation! Swap 4 and 3 -> [3, 4, 7, 8, 6, 2, 1].", arrayState: [{ val: "3", match: true }, { val: "4", active: true }, { val: "7" }, { val: "8" }, { val: "6" }, { val: "2" }, { val: "1" }] },
      { line: 6, code: "  if (4 < 7) swap(1, 2); // Expected '>', got 4 < 7 -> SWAP!", vars: { i: "1", expected: ">", swapped: "true" }, log: "Index 1 (expected >): arr[1] (4) < arr[2] (7). Violation! Swap 4 and 7 -> [3, 7, 4, 8, 6, 2, 1].", arrayState: [{ val: "3", match: true }, { val: "7", match: true }, { val: "4", active: true }, { val: "8" }, { val: "6" }, { val: "2" }, { val: "1" }] },
      { line: 4, code: "  if (4 < 8) // Expected '<', 4 < 8 is VALID", vars: { i: "2", expected: "<", valid: "true" }, log: "Index 2 (expected <): arr[2] (4) < arr[3] (8). Valid! No swap needed.", arrayState: [{ val: "3", match: true }, { val: "7", match: true }, { val: "4", match: true }, { val: "8", active: true }, { val: "6" }, { val: "2" }, { val: "1" }] },
      { line: 6, code: "  if (8 > 6) // Expected '>', 8 > 6 is VALID", vars: { i: "3", expected: ">", valid: "true" }, log: "Index 3 (expected >): arr[3] (8) > arr[4] (6). Valid! No swap needed.", arrayState: [{ val: "3", match: true }, { val: "7", match: true }, { val: "4", match: true }, { val: "8", match: true }, { val: "6", active: true }, { val: "2" }, { val: "1" }] },
      { line: 4, code: "  if (6 > 2) swap(4, 5); // Expected '<', got 6 > 2 -> SWAP!", vars: { i: "4", expected: "<", swapped: "true" }, log: "Index 4 (expected <): arr[4] (6) > arr[5] (2). Violation! Swap 6 and 2 -> [3, 7, 4, 8, 2, 6, 1].", arrayState: [{ val: "3", match: true }, { val: "7", match: true }, { val: "4", match: true }, { val: "8", match: true }, { val: "2", match: true }, { val: "6", active: true }, { val: "1" }] },
      { line: 9, code: "  return arr; // FINAL ZIG-ZAG: [3, 7, 4, 8, 2, 6, 1]", vars: { status: "COMPLETE" }, log: "Index 5 (expected >): 6 > 1 (Valid). Zig-Zag conversion complete! Result: [3, 7, 4, 8, 2, 6, 1].", arrayState: [{ val: "3", match: true }, { val: "7", match: true }, { val: "4", match: true }, { val: "8", match: true }, { val: "2", match: true }, { val: "6", match: true }, { val: "1", match: true }] }
    ]
  },

  // ── 8. EQUILIBRIUM POINT ──
  "equilibrium point": {
    solutionJS: `function equilibriumPoint(arr) {
  let totalSum = arr.reduce((a, b) => a + b, 0);
  let leftSum = 0;
  for (let i = 0; i < arr.length; i++) {
    let rightSum = totalSum - leftSum - arr[i];
    if (leftSum === rightSum) return i + 1; // 1-based index
    leftSum += arr[i];
  }
  return -1;
}`,
    solutionPY: `def equilibriumPoint(arr):
    total_sum = sum(arr)
    left_sum = 0
    for i, val in enumerate(arr):
        right_sum = total_sum - left_sum - val
        if left_sum == right_sum:
            return i + 1
        left_sum += val
    return -1`,
    solutionCPP: `int equilibriumPoint(vector<long long>& arr) {
    long long totalSum = 0;
    for (long long x : arr) totalSum += x;
    long long leftSum = 0;
    for (int i = 0; i < arr.size(); i++) {
        long long rightSum = totalSum - leftSum - arr[i];
        if (leftSum == rightSum) return i + 1;
        leftSum += arr[i];
    }
    return -1;
}`,
    visualizerSteps: [
      { line: 2, code: "let totalSum = arr.reduce((a, b) => a + b, 0); // 1 + 3 + 5 + 2 + 2 = 13", vars: { totalSum: "13", leftSum: "0" }, log: "Initialize arr = [1, 3, 5, 2, 2]. Total Sum = 13. Set leftSum = 0.", arrayState: [{ val: "1" }, { val: "3" }, { val: "5" }, { val: "2" }, { val: "2" }] },
      { line: 5, code: "  rightSum = 13 - 0 - 1 = 12; // leftSum (0) != rightSum (12)", vars: { i: "0", val: "1", leftSum: "0", rightSum: "12" }, log: "Inspect index 0 (val 1): leftSum = 0, rightSum = 12. Not equal! leftSum becomes 1.", arrayState: [{ val: "1", active: true }, { val: "3" }, { val: "5" }, { val: "2" }, { val: "2" }] },
      { line: 5, code: "  rightSum = 13 - 1 - 3 = 9; // leftSum (1) != rightSum (9)", vars: { i: "1", val: "3", leftSum: "1", rightSum: "9" }, log: "Inspect index 1 (val 3): leftSum = 1, rightSum = 9. Not equal! leftSum becomes 4.", arrayState: [{ val: "1" }, { val: "3", active: true }, { val: "5" }, { val: "2" }, { val: "2" }] },
      { line: 6, code: "  if (leftSum === rightSum) return i + 1; // 4 === 4 -> EQUILIBRIUM FOUND!", vars: { i: "2", val: "5", leftSum: "4", rightSum: "4", equilibriumPos: "3" }, log: "Inspect index 2 (val 5): leftSum = 4, rightSum = 4. EQUILIBRIUM POINT MATCH FOUND at index 2 (1-based position 3)! Return 3.", arrayState: [{ val: "1" }, { val: "3" }, { val: "5", match: true }, { val: "2" }, { val: "2" }] }
    ]
  },

  // ── 9. FIRST NEGATIVE INTEGER IN EVERY WINDOW OF SIZE K ──
  "first negative integer in every window of size k": {
    solutionJS: `function printFirstNegativeInteger(arr, k) {
  let result = [];
  let queue = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < 0) queue.push(i);
    if (queue.length > 0 && queue[0] <= i - k) queue.shift();
    if (i >= k - 1) {
      result.push(queue.length > 0 ? arr[queue[0]] : 0);
    }
  }
  return result;
}`,
    solutionPY: `def printFirstNegativeInteger(arr, k):
    result = []
    queue = []
    for i in range(len(arr)):
        if arr[i] < 0:
            queue.append(i)
        if queue and queue[0] <= i - k:
            queue.pop(0)
        if i >= k - 1:
            result.append(arr[queue[0]] if queue else 0)
    return result`,
    solutionCPP: `vector<long long> printFirstNegativeInteger(long long int arr[], long long int n, long long int k) {
    vector<long long> result;
    deque<int> dq;
    for (int i = 0; i < n; i++) {
        if (arr[i] < 0) dq.push_back(i);
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        if (i >= k - 1) {
            result.push_back(!dq.empty() ? arr[dq.front()] : 0);
        }
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function printFirstNegativeInteger(arr = [-8, 2, 3, -6, 10], k = 2) {", vars: { k: "2", queue: "[]" }, log: "Initialize array [-8, 2, 3, -6, 10] with window size k = 2.", arrayState: [{ val: "-8" }, { val: "2" }, { val: "3" }, { val: "-6" }, { val: "10" }] },
      { line: 4, code: "  if (arr[0] < 0) queue.push(0); // Window 1 [-8, 2]", vars: { i: "0", val: "-8", queue: "[idx 0 (-8)]" }, log: "Index 0 (-8): Negative number found! Push index 0 into queue.", arrayState: [{ val: "-8", active: true }, { val: "2" }, { val: "3" }, { val: "-6" }, { val: "10" }] },
      { line: 6, code: "  result.push(-8); // Window 1 [-8, 2] -> First negative: -8", vars: { i: "1", val: "2", result: "[-8]" }, log: "Window 1 (idx 0 to 1): Queue front is -8. Result = [-8].", arrayState: [{ val: "-8", match: true }, { val: "2", active: true }, { val: "3" }, { val: "-6" }, { val: "10" }] },
      { line: 6, code: "  result.push(0); // Window 2 [2, 3] -> No negatives, output 0", vars: { i: "2", val: "3", queue: "[]", result: "[-8, 0]" }, log: "Window 2 (idx 1 to 2): Index 0 out of window! Queue empty. Result = [-8, 0].", arrayState: [{ val: "-8" }, { val: "2", active: true }, { val: "3", active: true }, { val: "-6" }, { val: "10" }] },
      { line: 6, code: "  result.push(-6); // Window 3 [3, -6] -> First negative: -6", vars: { i: "3", val: "-6", queue: "[idx 3 (-6)]", result: "[-8, 0, -6]" }, log: "Window 3 (idx 2 to 3): Index 3 (-6) is negative. Queue front = -6. Result = [-8, 0, -6].", arrayState: [{ val: "-8" }, { val: "2" }, { val: "3", active: true }, { val: "-6", match: true }, { val: "10" }] },
      { line: 6, code: "  result.push(-6); // Window 4 [-6, 10] -> First negative: -6", vars: { i: "4", val: "10", result: "[-8, 0, -6, -6]" }, log: "Window 4 (idx 3 to 4): Queue front = -6. Final Result = [-8, 0, -6, -6].", arrayState: [{ val: "-8" }, { val: "2" }, { val: "3" }, { val: "-6", match: true }, { val: "10", active: true }] }
    ]
  },

  // ── 10. FIRST NON-REPEATING CHARACTER IN A STREAM ──
  "first non-repeating character in a stream": {
    solutionJS: `function FirstNonRepeating(stream) {
  let freq = {};
  let queue = [];
  let result = "";
  for (let ch of stream) {
    freq[ch] = (freq[ch] || 0) + 1;
    queue.push(ch);
    while (queue.length > 0 && freq[queue[0]] > 1) {
      queue.shift();
    }
    result += queue.length > 0 ? queue[0] : "#";
  }
  return result;
}`,
    solutionPY: `def FirstNonRepeating(stream):
    freq = {}
    queue = []
    result = []
    for ch in stream:
        freq[ch] = freq.get(ch, 0) + 1
        queue.append(ch)
        while queue and freq[queue[0]] > 1:
            queue.pop(0)
        result.append(queue[0] if queue else '#')
    return "".join(result)`,
    solutionCPP: `string FirstNonRepeating(string stream) {
    unordered_map<char, int> freq;
    queue<char> q;
    string result = "";
    for (char ch : stream) {
        freq[ch]++;
        q.push(ch);
        while (!q.empty() && freq[q.front()] > 1) {
            q.pop();
        }
        result += !q.empty() ? q.front() : '#';
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function FirstNonRepeating(stream = 'a a b c') {", vars: { stream: "'a a b c'", result: "''" }, log: "Initialize character stream 'a a b c'. Track frequencies and FIFO queue.", arrayState: [{ val: "a" }, { val: "a" }, { val: "b" }, { val: "c" }] },
      { line: 5, code: "  freq['a'] = 1; queue = ['a']; // First non-repeating: 'a'", vars: { char: "'a'", queue: "['a']", result: "'a'" }, log: "Step 1 ('a'): freq['a'] = 1. Queue front is 'a'. Output = 'a'.", arrayState: [{ val: "a", match: true }, { val: "a" }, { val: "b" }, { val: "c" }] },
      { line: 8, code: "  freq['a'] = 2; queue.shift(); // 'a' repeated! Output: '#'", vars: { char: "'a'", freq: "{a: 2}", queue: "[]", result: "'a#'" }, log: "Step 2 ('a'): freq['a'] = 2. Queue front 'a' is repeated -> Pop from queue! Queue empty. Output = '#'.", arrayState: [{ val: "a" }, { val: "a", active: true }, { val: "b" }, { val: "c" }] },
      { line: 5, code: "  freq['b'] = 1; queue = ['b']; // First non-repeating: 'b'", vars: { char: "'b'", queue: "['b']", result: "'a#b'" }, log: "Step 3 ('b'): freq['b'] = 1. Queue front is 'b'. Output = 'b'.", arrayState: [{ val: "a" }, { val: "a" }, { val: "b", match: true }, { val: "c" }] },
      { line: 10, code: "  result += 'b'; // Final Stream Result: 'a#bb'", vars: { char: "'c'", queue: "['b', 'c']", result: "'a#bb'" }, log: "Step 4 ('c'): freq['c'] = 1. Queue front is still 'b' (count 1). Final Output = 'a#bb'.", arrayState: [{ val: "a" }, { val: "a" }, { val: "b", match: true }, { val: "c", active: true }] }
    ]
  },

  // ── 11. INTERSECTION OF TWO ARRAYS II ──
  "intersection of two arrays ii": {
    solutionJS: `function intersect(nums1, nums2) {
  let map = {};
  let result = [];
  for (let n of nums1) map[n] = (map[n] || 0) + 1;
  for (let n of nums2) {
    if (map[n] > 0) {
      result.push(n);
      map[n]--;
    }
  }
  return result;
}`,
    solutionPY: `def intersect(nums1, nums2):
    counts = {}
    result = []
    for n in nums1:
        counts[n] = counts.get(n, 0) + 1
    for n in nums2:
        if counts.get(n, 0) > 0:
            result.append(n)
            counts[n] -= 1
    return result`,
    solutionCPP: `vector<int> intersect(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int, int> counts;
    vector<int> result;
    for (int n : nums1) counts[n]++;
    for (int n : nums2) {
        if (counts[n] > 0) {
            result.push_back(n);
            counts[n]--;
        }
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function intersect(nums1 = [4, 9, 5], nums2 = [9, 4, 9, 8, 4]) {", vars: { nums1: "[4, 9, 5]", nums2: "[9, 4, 9, 8, 4]" }, log: "Initialize nums1 = [4, 9, 5] and nums2 = [9, 4, 9, 8, 4]. Build map for nums1.", arrayState: [{ val: "4" }, { val: "9" }, { val: "5" }] },
      { line: 4, code: "  map = { 4: 1, 9: 1, 5: 1 }; // Frequency map of nums1", vars: { map: "{ 4: 1, 9: 1, 5: 1 }" }, log: "Frequency map built for nums1: { 4: 1, 9: 1, 5: 1 }.", arrayState: [{ val: "4", active: true }, { val: "9", active: true }, { val: "5", active: true }] },
      { line: 6, code: "  if (map[9] > 0) { result.push(9); map[9]--; }", vars: { val: "9", result: "[9]", map: "{ 4: 1, 9: 0, 5: 1 }" }, log: "Inspect nums2[0] (9): Exists in map (count 1)! Append 9 to result. Decrement count for 9.", arrayState: [{ val: "9", match: true }, { val: "4" }, { val: "9" }, { val: "8" }, { val: "4" }] },
      { line: 6, code: "  if (map[4] > 0) { result.push(4); map[4]--; }", vars: { val: "4", result: "[9, 4]", map: "{ 4: 0, 9: 0, 5: 1 }" }, log: "Inspect nums2[1] (4): Exists in map (count 1)! Append 4 to result. Decrement count for 4.", arrayState: [{ val: "9", match: true }, { val: "4", match: true }, { val: "9" }, { val: "8" }, { val: "4" }] },
      { line: 10, code: "  return result; // FINAL INTERSECTION: [9, 4]", vars: { result: "[9, 4]", status: "COMPLETE" }, log: "Inspect remaining nums2 elements (9, 8, 4): Counts exhausted or not in map. Final Intersection = [9, 4].", arrayState: [{ val: "9", match: true }, { val: "4", match: true }, { val: "9" }, { val: "8" }, { val: "4" }] }
    ]
  },

  // ── 12. LEADERS IN AN ARRAY ──
  "leaders in an array": {
    solutionJS: `function leaders(arr) {
  let n = arr.length;
  let result = [];
  let maxRight = arr[n - 1];
  result.push(maxRight);
  for (let i = n - 2; i >= 0; i--) {
    if (arr[i] >= maxRight) {
      maxRight = arr[i];
      result.push(maxRight);
    }
  }
  return result.reverse();
}`,
    solutionPY: `def leaders(arr):
    n = len(arr)
    result = []
    max_right = arr[-1]
    result.append(max_right)
    for i in range(n - 2, -1, -1):
        if arr[i] >= max_right:
            max_right = arr[i]
            result.append(max_right)
    return result[::-1]`,
    solutionCPP: `vector<int> leaders(int n, int arr[]) {
    vector<int> result;
    int maxRight = arr[n - 1];
    result.push_back(maxRight);
    for (int i = n - 2; i >= 0; i--) {
        if (arr[i] >= maxRight) {
            maxRight = arr[i];
            result.push_back(maxRight);
        }
    }
    reverse(result.begin(), result.end());
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function leaders(arr = [16, 17, 4, 3, 5, 2]) {", vars: { maxRight: "2", leaders: "[2]" }, log: "Initialize array [16, 17, 4, 3, 5, 2]. Rightmost element (2) is always a leader!", arrayState: [{ val: "16" }, { val: "17" }, { val: "4" }, { val: "3" }, { val: "5" }, { val: "2", match: true }] },
      { line: 7, code: "  if (5 >= 2) { maxRight = 5; result.push(5); }", vars: { i: "4", val: "5", maxRight: "5", leaders: "[2, 5]" }, log: "Inspect index 4 (val 5): 5 >= maxRight (2). NEW LEADER FOUND! maxRight = 5.", arrayState: [{ val: "16" }, { val: "17" }, { val: "4" }, { val: "3" }, { val: "5", match: true }, { val: "2", match: true }] },
      { line: 7, code: "  if (3 >= 5) // False (3 < 5)", vars: { i: "3", val: "3", maxRight: "5" }, log: "Inspect index 3 (val 3): 3 < maxRight (5). Not a leader.", arrayState: [{ val: "16" }, { val: "17" }, { val: "4" }, { val: "3", active: true }, { val: "5", match: true }, { val: "2", match: true }] },
      { line: 7, code: "  if (17 >= 5) { maxRight = 17; result.push(17); }", vars: { i: "1", val: "17", maxRight: "17", leaders: "[2, 5, 17]" }, log: "Inspect index 1 (val 17): 17 >= maxRight (5). NEW LEADER FOUND! maxRight = 17.", arrayState: [{ val: "16" }, { val: "17", match: true }, { val: "4" }, { val: "3" }, { val: "5", match: true }, { val: "2", match: true }] },
      { line: 12, code: "  return result.reverse(); // FINAL LEADERS: [17, 5, 2]", vars: { result: "[17, 5, 2]", status: "COMPLETE" }, log: "Inspect index 0 (16): 16 < 17. Reverse collected leaders to restore original order: [17, 5, 2].", arrayState: [{ val: "16" }, { val: "17", match: true }, { val: "4" }, { val: "3" }, { val: "5", match: true }, { val: "2", match: true }] }
    ]
  },

  // ── 13. MEETING ROOMS ──
  "meeting rooms": {
    solutionJS: `function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}`,
    solutionPY: `def canAttendMeetings(intervals):
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    return True`,
    solutionCPP: `bool canAttendMeetings(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] < intervals[i - 1][1]) return false;
    }
    return true;
}`,
    visualizerSteps: [
      { line: 1, code: "function canAttendMeetings(intervals = [[0,30], [5,10], [15,20]]) {", vars: { count: "3" }, log: "Initialize meeting intervals [[0,30], [5,10], [15,20]]. Goal: Check for overlaps.", arrayState: [{ val: "[0, 30]" }, { val: "[5, 10]" }, { val: "[15, 20]" }] },
      { line: 2, code: "  intervals.sort((a, b) => a[0] - b[0]);", vars: { sorted: "[[0,30], [5,10], [15,20]]" }, log: "Sort meetings by start time. Sorted intervals: [[0,30], [5,10], [15,20]].", arrayState: [{ val: "[0, 30]", active: true }, { val: "[5, 10]" }, { val: "[15, 20]" }] },
      { line: 4, code: "  if (5 < 30) return false; // OVERLAP DETECTED!", vars: { prevMeeting: "[0, 30]", currMeeting: "[5, 10]", overlap: "true" }, log: "Compare Meeting 1 [5, 10] with Meeting 0 [0, 30]: Start time 5 is less than end time 30! OVERLAP DETECTED!", arrayState: [{ val: "[0, 30]", match: true }, { val: "[5, 10]", match: true }, { val: "[15, 20]" }] },
      { line: 5, code: "  return false; // PERSON CANNOT ATTEND ALL MEETINGS", vars: { canAttend: "false", status: "CONFLICT" }, log: "Due to overlapping meetings [0,30] and [5,10], person CANNOT attend all meetings. Return false.", arrayState: [{ val: "[0, 30]", match: true }, { val: "[5, 10]", match: true }, { val: "[15, 20]" }] }
    ]
  },

  // ── 14. MERGE SORTED ARRAY ──
  "merge sorted array": {
    solutionJS: `function merge(nums1, m, nums2, n) {
  let p1 = m - 1;
  let p2 = n - 1;
  let p = m + n - 1;
  while (p1 >= 0 && p2 >= 0) {
    if (nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1];
      p1--;
    } else {
      nums1[p] = nums2[p2];
      p2--;
    }
    p--;
  }
  while (p2 >= 0) {
    nums1[p] = nums2[p2];
    p2--;
    p--;
  }
}`,
    solutionPY: `def merge(nums1, m, nums2, n):
    p1 = m - 1
    p2 = n - 1
    p = m + n - 1
    while p1 >= 0 and p2 >= 0:
        if nums1[p1] > nums2[p2]:
            nums1[p] = nums1[p1]
            p1 -= 1
        else:
            nums1[p] = nums2[p2]
            p2 -= 1
        p -= 1
    while p2 >= 0:
        nums1[p] = nums2[p2]
        p2 -= 1
        p -= 1`,
    solutionCPP: `void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int p1 = m - 1, p2 = n - 1, p = m + n - 1;
    while (p1 >= 0 && p2 >= 0) {
        if (nums1[p1] > nums2[p2]) {
            nums1[p--] = nums1[p1--];
        } else {
            nums1[p--] = nums2[p2--];
        }
    }
    while (p2 >= 0) nums1[p--] = nums2[p2--];
}`,
    visualizerSteps: [
      { line: 1, code: "function merge(nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3) {", vars: { p1: "2 (val 3)", p2: "2 (val 6)", p: "5" }, log: "Initialize nums1 = [1, 2, 3, 0, 0, 0], nums2 = [2, 5, 6]. 3-pointer backward merge.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "0" }, { val: "0" }, { val: "0" }] },
      { line: 8, code: "  nums1[5] = 6; p2--; // 6 > 3", vars: { p1: "2 (val 3)", p2: "1 (val 5)", p: "4" }, log: "Compare 3 vs 6: 6 is larger -> Place 6 at nums1[5]. Decrement p2 & p.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "0" }, { val: "0" }, { val: "6", match: true }] },
      { line: 8, code: "  nums1[4] = 5; p2--; // 5 > 3", vars: { p1: "2 (val 3)", p2: "0 (val 2)", p: "3" }, log: "Compare 3 vs 5: 5 is larger -> Place 5 at nums1[4]. Decrement p2 & p.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "0" }, { val: "5", match: true }, { val: "6", match: true }] },
      { line: 6, code: "  nums1[3] = 3; p1--; // 3 >= 2", vars: { p1: "1 (val 2)", p2: "0 (val 2)", p: "2" }, log: "Compare 3 vs 2: 3 is larger -> Place 3 at nums1[3]. Decrement p1 & p.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "3", match: true }, { val: "5", match: true }, { val: "6", match: true }] },
      { line: 15, code: "  // MERGE COMPLETE! [1, 2, 2, 3, 5, 6]", vars: { status: "COMPLETE" }, log: "Remaining elements merged cleanly. Final Result in nums1: [1, 2, 2, 3, 5, 6].", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "5", match: true }, { val: "6", match: true }] }
    ]
  },

  // ── 15. MISSING NUMBER ──
  "missing number": {
    solutionJS: `function missingNumber(nums) {
  let n = nums.length;
  let expectedSum = (n * (n + 1)) / 2;
  let actualSum = nums.reduce((a, b) => a + b, 0);
  return expectedSum - actualSum;
}`,
    solutionPY: `def missingNumber(nums):
    n = len(nums)
    expected_sum = (n * (n + 1)) // 2
    actual_sum = sum(nums)
    return expected_sum - actual_sum`,
    solutionCPP: `int missingNumber(vector<int>& nums) {
    int n = nums.size();
    int expectedSum = (n * (n + 1)) / 2;
    int actualSum = 0;
    for (int num : nums) actualSum += num;
    return expectedSum - actualSum;
}`,
    visualizerSteps: [
      { line: 1, code: "function missingNumber(nums = [3, 0, 1]) {", vars: { n: "3" }, log: "Initialize nums = [3, 0, 1]. Length n = 3. Expected range [0, 3].", arrayState: [{ val: "3" }, { val: "0" }, { val: "1" }] },
      { line: 3, code: "  let expectedSum = (3 * (3 + 1)) / 2; // 6", vars: { expectedSum: "6" }, log: "Calculate expected sum using Gauss formula: 3 * 4 / 2 = 6.", arrayState: [{ val: "3" }, { val: "0" }, { val: "1" }] },
      { line: 4, code: "  let actualSum = 3 + 0 + 1; // 4", vars: { actualSum: "4", expectedSum: "6" }, log: "Calculate actual sum of array elements: 3 + 0 + 1 = 4.", arrayState: [{ val: "3", active: true }, { val: "0", active: true }, { val: "1", active: true }] },
      { line: 5, code: "  return 6 - 4; // MISSING NUMBER = 2!", vars: { missingNumber: "2", status: "FOUND" }, log: "Missing Number = expectedSum (6) - actualSum (4) = 2!", arrayState: [{ val: "3" }, { val: "0" }, { val: "1" }, { val: "2 (MISSING)", match: true }] }
    ]
  },

  // ── 16. REMOVE DUPLICATES FROM SORTED ARRAY ──
  "remove duplicates from sorted array": {
    solutionJS: `function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let i = 0;
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] !== nums[i]) {
      i++;
      nums[i] = nums[j];
    }
  }
  return i + 1;
}`,
    solutionPY: `def removeDuplicates(nums):
    if not nums: return 0
    i = 0
    for j in range(1, len(nums)):
        if nums[j] != nums[i]:
            i += 1
            nums[i] = nums[j]
    return i + 1`,
    solutionCPP: `int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int i = 0;
    for (int j = 1; j < nums.size(); j++) {
        if (nums[j] != nums[i]) {
            i++;
            nums[i] = nums[j];
        }
    }
    return i + 1;
}`,
    visualizerSteps: [
      { line: 1, code: "function removeDuplicates(nums = [1, 1, 2]) {", vars: { i: "0 (val 1)", j: "1 (val 1)" }, log: "Initialize sorted array [1, 1, 2]. Two pointers: i (unique write) and j (read scan).", arrayState: [{ val: "1" }, { val: "1" }, { val: "2" }] },
      { line: 5, code: "  if (nums[1] === nums[0]) // Duplicate 1 == 1 -> Skip j!", vars: { i: "0", j: "1", val: "1" }, log: "j = 1 (val 1): nums[1] === nums[0] (1 === 1). Duplicate found! Skip j.", arrayState: [{ val: "1", match: true }, { val: "1", active: true }, { val: "2" }] },
      { line: 6, code: "  i++; nums[1] = nums[2]; // New unique 2 != 1 -> Copy 2 to nums[1]", vars: { i: "1", j: "2", val: "2" }, log: "j = 2 (val 2): nums[2] !== nums[0] (2 !== 1). New unique element! i++ -> nums[1] = 2.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "2" }] },
      { line: 9, code: "  return i + 1; // UNIQUE LENGTH k = 2", vars: { k: "2", uniqueArray: "[1, 2]" }, log: "Array scan finished! First 2 unique elements: [1, 2]. Return length k = 2.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "2" }] }
    ]
  },

  // ── 17. REMOVE ELEMENT ──
  "remove element": {
    solutionJS: `function removeElement(nums, val) {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
}`,
    solutionPY: `def removeElement(nums, val):
    k = 0
    for i in range(len(nums)):
        if nums[i] != val:
            nums[k] = nums[i]
            k += 1
    return k`,
    solutionCPP: `int removeElement(vector<int>& nums, int val) {
    int k = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (nums[i] != val) {
            nums[k++] = nums[i];
        }
    }
    return k;
}`,
    visualizerSteps: [
      { line: 1, code: "function removeElement(nums = [3, 2, 2, 3], val = 3) {", vars: { val: "3", k: "0" }, log: "Initialize nums = [3, 2, 2, 3] and target val = 3.", arrayState: [{ val: "3" }, { val: "2" }, { val: "2" }, { val: "3" }] },
      { line: 3, code: "  if (3 === 3) // Match val -> Skip k", vars: { i: "0", num: "3", k: "0" }, log: "Index 0 (val 3): Matches target 3! Skip writing. k remains 0.", arrayState: [{ val: "3", active: true }, { val: "2" }, { val: "2" }, { val: "3" }] },
      { line: 4, code: "  nums[0] = 2; k++; // Non-target element -> Write to nums[0]", vars: { i: "1", num: "2", k: "1" }, log: "Index 1 (val 2): 2 !== 3. Copy to nums[0]. Increment k to 1.", arrayState: [{ val: "2", match: true }, { val: "2" }, { val: "2" }, { val: "3" }] },
      { line: 4, code: "  nums[1] = 2; k++; // Non-target element -> Write to nums[1]", vars: { i: "2", num: "2", k: "2" }, log: "Index 2 (val 2): 2 !== 3. Copy to nums[1]. Increment k to 2.", arrayState: [{ val: "2", match: true }, { val: "2", match: true }, { val: "2" }, { val: "3" }] },
      { line: 8, code: "  return k; // NEW LENGTH k = 2", vars: { k: "2", result: "[2, 2]" }, log: "Index 3 (val 3): Matches target 3. Traversal complete! Return new length k = 2.", arrayState: [{ val: "2", match: true }, { val: "2", match: true }, { val: "2" }, { val: "3" }] }
    ]
  },

  // ── 18. RESHAPE THE MATRIX ──
  "reshape the matrix": {
    solutionJS: `function matrixReshape(mat, r, c) {
  let m = mat.length, n = mat[0].length;
  if (m * n !== r * c) return mat;
  let result = Array.from({ length: r }, () => Array(c).fill(0));
  for (let count = 0; count < m * n; count++) {
    result[Math.floor(count / c)][count % c] = mat[Math.floor(count / n)][count % n];
  }
  return result;
}`,
    solutionPY: `def matrixReshape(mat, r, c):
    m, n = len(mat), len(mat[0])
    if m * n != r * c: return mat
    result = [[0] * c for _ in range(r)]
    for count in range(m * n):
        result[count // c][count % c] = mat[count // n][count % n]
    return result`,
    solutionCPP: `vector<vector<int>> matrixReshape(vector<vector<int>>& mat, int r, int c) {
    int m = mat.size(), n = mat[0].size();
    if (m * n != r * c) return mat;
    vector<vector<int>> result(r, vector<int>(c, 0));
    for (int count = 0; count < m * n; count++) {
        result[count / c][count % c] = mat[count / n][count % n];
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function matrixReshape(mat = [[1, 2], [3, 4]], r = 1, c = 4) {", vars: { m: "2", n: "2", r: "1", c: "4" }, log: "Initialize 2x2 matrix [[1, 2], [3, 4]]. Target shape: 1x4 (1 row, 4 columns).", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }] },
      { line: 3, code: "  if (2 * 2 === 1 * 4) // 4 === 4 -> Legal reshape!", vars: { totalElements: "4", legal: "true" }, log: "Check dimensions: Original elements (2x2 = 4) equals target elements (1x4 = 4). Legal reshape!", arrayState: [{ val: "1", active: true }, { val: "2", active: true }, { val: "3", active: true }, { val: "4", active: true }] },
      { line: 5, code: "  result[0][0..3] = [1, 2, 3, 4];", vars: { reshapedMat: "[[1, 2, 3, 4]]" }, log: "Flatten 2x2 elements into row-major 1x4 matrix: [[1, 2, 3, 4]].", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }] },
      { line: 7, code: "  return [[1, 2, 3, 4]]; // RESHAPE COMPLETE", vars: { status: "COMPLETE" }, log: "Reshape complete cleanly! Return reshaped 1x4 matrix [[1, 2, 3, 4]].", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }] }
    ]
  },

  // ── 19. ROTATE ARRAY ──
  "rotate array": {
    solutionJS: `function rotate(nums, k) {
  k = k % nums.length;
  function reverse(start, end) {
    while (start < end) {
      let temp = nums[start];
      nums[start] = nums[end];
      nums[end] = temp;
      start++; end--;
    }
  }
  reverse(0, nums.length - 1);
  reverse(0, k - 1);
  reverse(k, nums.length - 1);
}`,
    solutionPY: `def rotate(nums, k):
    k %= len(nums)
    def reverse(l, r):
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1; r -= 1
    reverse(0, len(nums) - 1)
    reverse(0, k - 1)
    reverse(k, len(nums) - 1)`,
    solutionCPP: `void rotate(vector<int>& nums, int k) {
    k %= nums.size();
    reverse(nums.begin(), nums.end());
    reverse(nums.begin(), nums.begin() + k);
    reverse(nums.begin() + k, nums.end());
}`,
    visualizerSteps: [
      { line: 1, code: "function rotate(nums = [1, 2, 3, 4, 5, 6, 7], k = 3) {", vars: { k: "3", n: "7" }, log: "Initialize nums = [1, 2, 3, 4, 5, 6, 7], k = 3. 3-step array reversal technique.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }] },
      { line: 10, code: "  reverse(0, 6); // Step 1: Reverse entire array", vars: { reversed: "[0..6]" }, log: "Step 1: Reverse entire array [0..6] -> [7, 6, 5, 4, 3, 2, 1].", arrayState: [{ val: "7", active: true }, { val: "6", active: true }, { val: "5", active: true }, { val: "4", active: true }, { val: "3", active: true }, { val: "2", active: true }, { val: "1", active: true }] },
      { line: 11, code: "  reverse(0, 2); // Step 2: Reverse first k elements", vars: { reversed: "[0..2]" }, log: "Step 2: Reverse first k (3) elements [0..2] -> [5, 6, 7, 4, 3, 2, 1].", arrayState: [{ val: "5", match: true }, { val: "6", match: true }, { val: "7", match: true }, { val: "4" }, { val: "3" }, { val: "2" }, { val: "1" }] },
      { line: 12, code: "  reverse(3, 6); // Step 3: Reverse remaining n-k elements", vars: { reversed: "[3..6]", status: "ROTATED" }, log: "Step 3: Reverse remaining elements [3..6] -> [5, 6, 7, 1, 2, 3, 4]. Array rotated cleanly by 3 steps!", arrayState: [{ val: "5", match: true }, { val: "6", match: true }, { val: "7", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }] }
    ]
  },

  // ── 20. SORT AN ARRAY OF 0S, 1S AND 2S ──
  "sort an array of 0s, 1s and 2s": {
    solutionJS: `function sort012(arr) {
  let low = 0, mid = 0, high = arr.length - 1;
  while (mid <= high) {
    if (arr[mid] === 0) {
      [arr[low], arr[mid]] = [arr[mid], arr[low]];
      low++; mid++;
    } else if (arr[mid] === 1) {
      mid++;
    } else {
      [arr[mid], arr[high]] = [arr[high], arr[mid]];
      high--;
    }
  }
  return arr;
}`,
    solutionPY: `def sort012(arr):
    low, mid, high = 0, 0, len(arr) - 1
    while mid <= high:
        if arr[mid] == 0:
            arr[low], arr[mid] = arr[mid], arr[low]
            low += 1; mid += 1
        elif arr[mid] == 1:
            mid += 1
        else:
            arr[mid], arr[high] = arr[high], arr[mid]
            high -= 1
    return arr`,
    solutionCPP: `void sort012(vector<int>& arr) {
    int low = 0, mid = 0, high = arr.size() - 1;
    while (mid <= high) {
        if (arr[mid] == 0) {
            swap(arr[low++], arr[mid++]);
        } else if (arr[mid] == 1) {
            mid++;
        } else {
            swap(arr[mid], arr[high--]);
        }
    }
}`,
    visualizerSteps: [
      { line: 1, code: "function sort012(arr = [2, 0, 2, 1, 1, 0]) {", vars: { low: "0", mid: "0", high: "5" }, log: "Initialize Dutch National Flag 3-pointer algorithm (low = 0, mid = 0, high = 5).", arrayState: [{ val: "2" }, { val: "0" }, { val: "2" }, { val: "1" }, { val: "1" }, { val: "0" }] },
      { line: 9, code: "  swap(mid, high); high--; // arr[0] is 2 -> Swap with high", vars: { low: "0", mid: "0", high: "4", val: "2" }, log: "mid = 0 (val 2): Swap arr[0] with arr[high] (5). high becomes 4. Array -> [0, 0, 2, 1, 1, 2].", arrayState: [{ val: "0", active: true }, { val: "0" }, { val: "2" }, { val: "1" }, { val: "1" }, { val: "2", match: true }] },
      { line: 5, code: "  swap(low, mid); low++; mid++; // arr[0] is 0 -> Swap with low", vars: { low: "1", mid: "1", high: "4", val: "0" }, log: "mid = 0 (val 0): Swap arr[low] with arr[mid]. Increment low (1) & mid (1).", arrayState: [{ val: "0", match: true }, { val: "0", active: true }, { val: "2" }, { val: "1" }, { val: "1" }, { val: "2", match: true }] },
      { line: 5, code: "  swap(low, mid); low++; mid++; // arr[1] is 0 -> Swap with low", vars: { low: "2", mid: "2", high: "4", val: "0" }, log: "mid = 1 (val 0): Swap arr[low] with arr[mid]. Increment low (2) & mid (2).", arrayState: [{ val: "0", match: true }, { val: "0", match: true }, { val: "2", active: true }, { val: "1" }, { val: "1" }, { val: "2", match: true }] },
      { line: 9, code: "  swap(mid, high); high--; // arr[2] is 2 -> Swap with high", vars: { low: "2", mid: "2", high: "3", val: "2" }, log: "mid = 2 (val 2): Swap arr[mid] with arr[high] (4). high becomes 3. Array -> [0, 0, 1, 1, 2, 2].", arrayState: [{ val: "0", match: true }, { val: "0", match: true }, { val: "1", active: true }, { val: "1" }, { val: "2", match: true }, { val: "2", match: true }] },
      { line: 7, code: "  mid++; // arr[2] is 1 -> Just advance mid", vars: { low: "2", mid: "3", high: "3", val: "1" }, log: "mid = 2 (val 1): Element 1 in correct place. Advance mid to 3.", arrayState: [{ val: "0", match: true }, { val: "0", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }] },
      { line: 12, code: "  return arr; // FINAL SORTED ARRAY: [0, 0, 1, 1, 2, 2]", vars: { status: "SORTED" }, log: "mid > high (3 > 3). Single O(N) pass sorting complete! Result: [0, 0, 1, 1, 2, 2].", arrayState: [{ val: "0", match: true }, { val: "0", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }] }
    ]
  },

  // ── 21. SPIRALLY TRAVERSING A MATRIX ──
  "spirally traversing a matrix": {
    solutionJS: `function spirallyTraverse(matrix) {
  let result = [];
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) result.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
      left++;
    }
  }
  return result;
}`,
    solutionPY: `def spirallyTraverse(matrix):
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for i in range(left, right + 1): result.append(matrix[top][i])
        top += 1
        for i in range(top, bottom + 1): result.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for i in range(right, left - 1, -1): result.append(matrix[bottom][i])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1): result.append(matrix[i][left])
            left += 1
    return result`,
    solutionCPP: `vector<int> spirallyTraverse(vector<vector<int>>& matrix) {
    vector<int> result;
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    while (top <= bottom && left <= right) {
        for (int i = left; i <= right; i++) result.push_back(matrix[top][i]);
        top++;
        for (int i = top; i <= bottom; i++) result.push_back(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int i = right; i >= left; i--) result.push_back(matrix[bottom][i]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) result.push_back(matrix[i][left]);
            left++;
        }
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function spirallyTraverse(matrix = [[1,2,3],[4,5,6],[7,8,9]]) {", vars: { top: "0", bottom: "2", left: "0", right: "2" }, log: "Initialize 3x3 matrix [[1,2,3],[4,5,6],[7,8,9]]. 4-boundary spiral traversal.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8" }, { val: "9" }] },
      { line: 6, code: "  topRow: [1, 2, 3]; top++;", vars: { top: "1", result: "[1, 2, 3]" }, log: "Traverse Top Row (left 0 to right 2): Add 1, 2, 3. Increment top boundary to 1.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8" }, { val: "9" }] },
      { line: 8, code: "  rightCol: [6, 9]; right--;", vars: { right: "1", result: "[1, 2, 3, 6, 9]" }, log: "Traverse Right Column (top 1 to bottom 2): Add 6, 9. Decrement right boundary to 1.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4" }, { val: "5" }, { val: "6", match: true }, { val: "7" }, { val: "8" }, { val: "9", match: true }] },
      { line: 10, code: "  bottomRow: [8, 7]; bottom--;", vars: { bottom: "1", result: "[1, 2, 3, 6, 9, 8, 7]" }, log: "Traverse Bottom Row (right 1 to left 0): Add 8, 7. Decrement bottom boundary to 1.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4" }, { val: "5" }, { val: "6", match: true }, { val: "7", match: true }, { val: "8", match: true }, { val: "9", match: true }] },
      { line: 14, code: "  leftCol: [4]; left++;", vars: { left: "1", result: "[1, 2, 3, 6, 9, 8, 7, 4]" }, log: "Traverse Left Column (bottom 1 to top 1): Add 4. Increment left boundary to 1.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }, { val: "5" }, { val: "6", match: true }, { val: "7", match: true }, { val: "8", match: true }, { val: "9", match: true }] },
      { line: 18, code: "  return [1, 2, 3, 6, 9, 8, 7, 4, 5]; // SPIRAL COMPLETE", vars: { center: "5", status: "COMPLETE" }, log: "Final Center Element: Add 5. Complete Spiral Order: [1, 2, 3, 6, 9, 8, 7, 4, 5]!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }, { val: "5", match: true }, { val: "6", match: true }, { val: "7", match: true }, { val: "8", match: true }, { val: "9", match: true }] }
    ]
  },

  // ── 22. SUBARRAY WITH GIVEN SUM ──
  "subarray with given sum": {
    solutionJS: `function subarraySum(arr, target) {
  let left = 0, currSum = 0;
  for (let right = 0; right < arr.length; right++) {
    currSum += arr[right];
    while (currSum > target && left < right) {
      currSum -= arr[left];
      left++;
    }
    if (currSum === target) {
      return [left + 1, right + 1]; // 1-based index
    }
  }
  return [-1];
}`,
    solutionPY: `def subarraySum(arr, target):
    left, curr_sum = 0, 0
    for right in range(len(arr)):
        curr_sum += arr[right]
        while curr_sum > target and left < right:
            curr_sum -= arr[left]
            left += 1
        if curr_sum == target:
            return [left + 1, right + 1]
    return [-1]`,
    solutionCPP: `vector<int> subarraySum(vector<int>& arr, int target) {
    int left = 0, currSum = 0;
    for (int right = 0; right < arr.size(); right++) {
        currSum += arr[right];
        while (currSum > target && left < right) {
            currSum -= arr[left];
            left++;
        }
        if (currSum == target) {
            return {left + 1, right + 1};
        }
    }
    return {-1};
}`,
    visualizerSteps: [
      { line: 1, code: "function subarraySum(arr = [1, 2, 3, 7, 5], target = 12) {", vars: { target: "12", left: "0", currSum: "0" }, log: "Initialize array [1, 2, 3, 7, 5] and target sum 12. Sliding window technique.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "7" }, { val: "5" }] },
      { line: 4, code: "  currSum += arr[0]; // currSum = 1", vars: { right: "0", val: "1", currSum: "1" }, log: "Expand window right = 0 (val 1). currSum = 1.", arrayState: [{ val: "1", active: true }, { val: "2" }, { val: "3" }, { val: "7" }, { val: "5" }] },
      { line: 4, code: "  currSum += arr[1]; // currSum = 3", vars: { right: "1", val: "2", currSum: "3" }, log: "Expand window right = 1 (val 2). currSum = 1 + 2 = 3.", arrayState: [{ val: "1", active: true }, { val: "2", active: true }, { val: "3" }, { val: "7" }, { val: "5" }] },
      { line: 4, code: "  currSum += arr[2]; // currSum = 6", vars: { right: "2", val: "3", currSum: "6" }, log: "Expand window right = 2 (val 3). currSum = 3 + 3 = 6.", arrayState: [{ val: "1", active: true }, { val: "2", active: true }, { val: "3", active: true }, { val: "7" }, { val: "5" }] },
      { line: 5, code: "  currSum += 7; // currSum = 13 > 12 -> Shrink left! leftSum = 12", vars: { right: "3", val: "7", currSum: "12", left: "1" }, log: "Expand right = 3 (val 7): sum 13 > 12. Shrink left (remove 1): new sum = 12.", arrayState: [{ val: "1" }, { val: "2", match: true }, { val: "3", match: true }, { val: "7", match: true }, { val: "5" }] },
      { line: 9, code: "  if (12 === 12) return [2, 4]; // SUBARRAY MATCH FOUND!", vars: { result: "[2, 4]", subarray: "[2, 3, 7]", sum: "12" }, log: "currSum (12) === target (12)! Contiguous Subarray [2, 3, 7] found between 1-based indices 2 and 4!", arrayState: [{ val: "1" }, { val: "2", match: true }, { val: "3", match: true }, { val: "7", match: true }, { val: "5" }] }
    ]
  },

  // ── 23. TWO SUM ──
  "two sum": {
    solutionJS: `function twoSum(nums, target) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    solutionPY: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    solutionCPP: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,
    visualizerSteps: [
      { line: 1, code: "function twoSum(nums = [2, 7, 11, 15], target = 9) {", vars: { target: "9", map: "{}" }, log: "Initialize nums = [2, 7, 11, 15], target = 9. O(1) hash map lookup algorithm.", arrayState: [{ val: "2" }, { val: "7" }, { val: "11" }, { val: "15" }] },
      { line: 4, code: "  let complement = 9 - 2 = 7; map.set(2, 0);", vars: { i: "0", num: "2", complement: "7", map: "{ 2: 0 }" }, log: "Inspect index 0 (val 2): Complement 9 - 2 = 7. Not in map. Store key 2 at index 0.", arrayState: [{ val: "2", active: true }, { val: "7" }, { val: "11" }, { val: "15" }] },
      { line: 5, code: "  if (map.has(2)) return [0, 1]; // MATCH FOUND!", vars: { i: "1", num: "7", complement: "2", map: "{ 2: 0 }", result: "[0, 1]" }, log: "Inspect index 1 (val 7): Complement 9 - 7 = 2 exists in map at index 0! TARGET MATCH FOUND: [0, 1]!", arrayState: [{ val: "2", match: true }, { val: "7", match: true }, { val: "11" }, { val: "15" }] }
    ]
  },

  // ── 24. VALID SUBSTRING (BALANCED BRACKETS WITH WILDCARD) ──
  "valid substring (balanced brackets with wildcard)": {
    solutionJS: `function checkValidString(s) {
  let cmin = 0, cmax = 0;
  for (let ch of s) {
    if (ch === '(') {
      cmin++; cmax++;
    } else if (ch === ')') {
      cmin = Math.max(0, cmin - 1);
      cmax--;
    } else { // '*' wildcard
      cmin = Math.max(0, cmin - 1);
      cmax++;
    }
    if (cmax < 0) return false;
  }
  return cmin === 0;
}`,
    solutionPY: `def checkValidString(s):
    cmin, cmax = 0, 0
    for ch in s:
        if ch == '(':
            cmin += 1; cmax += 1
        elif ch == ')':
            cmin = max(0, cmin - 1)
            cmax -= 1
        else:
            cmin = max(0, cmin - 1)
            cmax += 1
        if cmax < 0: return False
    return cmin == 0`,
    solutionCPP: `bool checkValidString(string s) {
    int cmin = 0, cmax = 0;
    for (char ch : s) {
        if (ch == '(') { cmin++; cmax++; }
        else if (ch == ')') { cmin = max(0, cmin - 1); cmax--; }
        else { cmin = max(0, cmin - 1); cmax++; }
        if (cmax < 0) return false;
    }
    return cmin == 0;
}`,
    visualizerSteps: [
      { line: 1, code: "function checkValidString(s = '(*)') {", vars: { s: "'(*)'", cmin: "0", cmax: "0" }, log: "Initialize string '(*)' with wildcard handling (cmin = 0, cmax = 0).", arrayState: [{ val: "(" }, { val: "*" }, { val: ")" }] },
      { line: 4, code: "  ch = '('; cmin++; cmax++; // cmin = 1, cmax = 1", vars: { ch: "'('", cmin: "1", cmax: "1" }, log: "Step 1 '(': Open bracket increments both cmin (1) and cmax (1).", arrayState: [{ val: "(", active: true }, { val: "*" }, { val: ")" }] },
      { line: 9, code: "  ch = '*'; cmin = max(0, 0); cmax++; // cmin = 0, cmax = 2", vars: { ch: "'*'", cmin: "0", cmax: "2" }, log: "Step 2 '*': Wildcard can act as ')', '', or '('. cmin = 0, cmax = 2.", arrayState: [{ val: "(" }, { val: "*", active: true }, { val: ")" }] },
      { line: 6, code: "  ch = ')'; cmin = max(0, 0); cmax--; // cmin = 0, cmax = 1", vars: { ch: "')'", cmin: "0", cmax: "1" }, log: "Step 3 ')': Close bracket decrements cmin (0) and cmax (1).", arrayState: [{ val: "(" }, { val: "*" }, { val: ")", active: true }] },
      { line: 13, code: "  return cmin === 0; // VALID BALANCED PARENTHESES!", vars: { cmin: "0", valid: "true" }, log: "String traversal complete. Minimum open brackets required is 0. Valid balanced parentheses string!", arrayState: [{ val: "(", match: true }, { val: "*", match: true }, { val: ")", match: true }] }
    ]
  },

  // ── 25. 3SUM ──
  "3sum": {
    solutionJS: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  let result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      let sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,
    solutionPY: `def threeSum(nums):
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]: continue
        left, right = i + 1, len(nums) - 1
        while left < right:
            s = nums[i] + nums[left] + nums[right]
            if s == 0:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]: left += 1
                while left < right and nums[right] == nums[right - 1]: right -= 1
                left += 1; right -= 1
            elif s < 0: left += 1
            else: right -= 1
    return result`,
    solutionCPP: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    for (int i = 0; i < nums.size() - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int left = i + 1, right = nums.size() - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.push_back({nums[i], nums[left], nums[right]});
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++; right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function threeSum(nums = [-1, 0, 1, 2, -1, -4]) {", vars: { n: "6" }, log: "Initialize nums = [-1, 0, 1, 2, -1, -4]. Sort array & use 2-pointer scan.", arrayState: [{ val: "-1" }, { val: "0" }, { val: "1" }, { val: "2" }, { val: "-1" }, { val: "-4" }] },
      { line: 2, code: "  nums.sort(); // [-4, -1, -1, 0, 1, 2]", vars: { sorted: "[-4, -1, -1, 0, 1, 2]" }, log: "Sort array: [-4, -1, -1, 0, 1, 2].", arrayState: [{ val: "-4" }, { val: "-1" }, { val: "-1" }, { val: "0" }, { val: "1" }, { val: "2" }] },
      { line: 8, code: "  sum = -1 + (-1) + 2 = 0; // TRIPLET 1 MATCH!", vars: { i: "1 (-1)", left: "2 (-1)", right: "5 (2)", sum: "0", result: "[[-1,-1,2]]" }, log: "i = 1 (-1), left = 2 (-1), right = 5 (2): Sum = -1 + (-1) + 2 = 0! Add triplet [-1, -1, 2].", arrayState: [{ val: "-4" }, { val: "-1", match: true }, { val: "-1", match: true }, { val: "0" }, { val: "1" }, { val: "2", match: true }] },
      { line: 8, code: "  sum = -1 + 0 + 1 = 0; // TRIPLET 2 MATCH!", vars: { i: "1 (-1)", left: "3 (0)", right: "4 (1)", sum: "0", result: "[[-1,-1,2],[-1,0,1]]" }, log: "i = 1 (-1), left = 3 (0), right = 4 (1): Sum = -1 + 0 + 1 = 0! Add triplet [-1, 0, 1].", arrayState: [{ val: "-4" }, { val: "-1", match: true }, { val: "-1" }, { val: "0", match: true }, { val: "1", match: true }, { val: "2" }] },
      { line: 17, code: "  return result; // ALL UNIQUE TRIPLETS FOUND!", vars: { totalTriplets: "2", result: "[[-1,-1,2], [-1,0,1]]" }, log: "Completed scanning. Unique 3Sum triplets: [[-1, -1, 2], [-1, 0, 1]].", arrayState: [{ val: "-4" }, { val: "-1", match: true }, { val: "-1", match: true }, { val: "0", match: true }, { val: "1", match: true }, { val: "2", match: true }] }
    ]
  },

  // ── 26. COMBINATION SUM ──
  "combination sum": {
    solutionJS: `function combinationSum(candidates, target) {
  let result = [];
  function backtrack(start, target, path) {
    if (target === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > target) continue;
      path.push(candidates[i]);
      backtrack(i, target - candidates[i], path);
      path.pop();
    }
  }
  backtrack(0, target, []);
  return result;
}`,
    solutionPY: `def combinationSum(candidates, target):
    result = []
    def backtrack(start, target, path):
        if target == 0:
            result.append(list(path))
            return
        for i in range(start, len(candidates)):
            if candidates[i] > target: continue
            path.append(candidates[i])
            backtrack(i, target - candidates[i], path)
            path.pop()
    backtrack(0, target, [])
    return result`,
    solutionCPP: `vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    vector<vector<int>> result;
    vector<int> path;
    function<void(int, int)> backtrack = [&](int start, int target) {
        if (target == 0) {
            result.push_back(path);
            return;
        }
        for (int i = start; i < candidates.size(); i++) {
            if (candidates[i] > target) continue;
            path.push_back(candidates[i]);
            backtrack(i, target - candidates[i]);
            path.pop_back();
        }
    };
    backtrack(0, target);
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function combinationSum(candidates = [2, 3, 6, 7], target = 7) {", vars: { candidates: "[2, 3, 6, 7]", target: "7" }, log: "Initialize candidates [2, 3, 6, 7] and target sum 7. Backtracking tree search.", arrayState: [{ val: "2" }, { val: "3" }, { val: "6" }, { val: "7" }] },
      { line: 9, code: "  path.push(2); backtrack(2, 5, [2]);", vars: { path: "[2]", remTarget: "5" }, log: "Pick 2: path = [2], remaining target = 5.", arrayState: [{ val: "2", active: true }, { val: "3" }, { val: "6" }, { val: "7" }] },
      { line: 9, code: "  path.push(2); backtrack(2, 3, [2, 2]);", vars: { path: "[2, 2]", remTarget: "3" }, log: "Pick 2 again: path = [2, 2], remaining target = 3.", arrayState: [{ val: "2", active: true }, { val: "3" }, { val: "6" }, { val: "7" }] },
      { line: 5, code: "  target === 0 -> COMBINATION FOUND: [2, 2, 3]", vars: { path: "[2, 2, 3]", remTarget: "0", result: "[[2,2,3]]" }, log: "Pick 3: path = [2, 2, 3], remaining target = 0. COMBINATION MATCH FOUND: [2, 2, 3]!", arrayState: [{ val: "2", match: true }, { val: "3", match: true }, { val: "6" }, { val: "7" }] },
      { line: 5, code: "  target === 0 -> COMBINATION FOUND: [7]", vars: { path: "[7]", remTarget: "0", result: "[[2,2,3], [7]]" }, log: "Backtrack to root & pick 7: remaining target = 0. COMBINATION MATCH FOUND: [7]!", arrayState: [{ val: "2", match: true }, { val: "3", match: true }, { val: "6" }, { val: "7", match: true }] }
    ]
  },

  // ── 27. CONTAINER WITH MOST WATER ──
  "container with most water": {
    solutionJS: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let maxArea = 0;
  while (left < right) {
    let currentArea = Math.min(height[left], height[right]) * (right - left);
    maxArea = Math.max(maxArea, currentArea);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxArea;
}`,
    solutionPY: `def maxArea(height):
    left, right = 0, len(height) - 1
    max_area = 0
    while left < right:
        current_area = min(height[left], height[right]) * (right - left)
        max_area = max(max_area, current_area)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_area`,
    solutionCPP: `int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxArea = 0;
    while (left < right) {
        int currentArea = min(height[left], height[right]) * (right - left);
        maxArea = max(maxArea, currentArea);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxArea;
}`,
    visualizerSteps: [
      { line: 1, code: "function maxArea(height = [1, 8, 6, 2, 5, 4, 8, 3, 7]) {", vars: { left: "0 (h 1)", right: "8 (h 7)", maxArea: "0" }, log: "Initialize heights [1, 8, 6, 2, 5, 4, 8, 3, 7]. 2-pointer container width scanning.", arrayState: [{ val: "1" }, { val: "8" }, { val: "6" }, { val: "2" }, { val: "5" }, { val: "4" }, { val: "8" }, { val: "3" }, { val: "7" }] },
      { line: 5, code: "  area = min(1, 7) * 8 = 8; left++;", vars: { left: "0", right: "8", area: "8", maxArea: "8" }, log: "Step 1 (idx 0 to 8): min(1, 7) * 8 = 8. maxArea = 8. Move left++ (1 < 7).", arrayState: [{ val: "1", active: true }, { val: "8" }, { val: "6" }, { val: "2" }, { val: "5" }, { val: "4" }, { val: "8" }, { val: "3" }, { val: "7", active: true }] },
      { line: 5, code: "  area = min(8, 7) * 7 = 49; maxArea = 49; right--;", vars: { left: "1", right: "8", area: "49", maxArea: "49" }, log: "Step 2 (idx 1 to 8): min(8, 7) * 7 = 49! NEW MAX AREA = 49! Move right-- (7 < 8).", arrayState: [{ val: "1" }, { val: "8", match: true }, { val: "6" }, { val: "2" }, { val: "5" }, { val: "4" }, { val: "8" }, { val: "3" }, { val: "7", match: true }] },
      { line: 13, code: "  return maxArea; // MAXIMUM WATER CONTAINER AREA = 49", vars: { maxArea: "49", status: "COMPLETE" }, log: "Traversal complete! Maximum water container area is 49 (between height 8 at idx 1 and height 7 at idx 8).", arrayState: [{ val: "1" }, { val: "8", match: true }, { val: "6" }, { val: "2" }, { val: "5" }, { val: "4" }, { val: "8" }, { val: "3" }, { val: "7", match: true }] }
    ]
  },

  // ── 28. COUNT TRIPLETS ──
  "count triplets": {
    solutionJS: `function countTriplet(arr) {
  arr.sort((a, b) => a - b);
  let count = 0;
  for (let k = arr.length - 1; k >= 2; k--) {
    let i = 0, j = k - 1;
    while (i < j) {
      if (arr[i] + arr[j] === arr[k]) {
        count++;
        i++; j--;
      } else if (arr[i] + arr[j] < arr[k]) {
        i++;
      } else {
        j--;
      }
    }
  }
  return count;
}`,
    solutionPY: `def countTriplet(arr):
    arr.sort()
    count = 0
    for k in range(len(arr) - 1, 1, -1):
        i, j = 0, k - 1
        while i < j:
            if arr[i] + arr[j] == arr[k]:
                count += 1
                i += 1; j -= 1
            elif arr[i] + arr[j] < arr[k]:
                i += 1
            else:
                j -= 1
    return count`,
    solutionCPP: `int countTriplet(int arr[], int n) {
    sort(arr, arr + n);
    int count = 0;
    for (int k = n - 1; k >= 2; k--) {
        int i = 0, j = k - 1;
        while (i < j) {
            if (arr[i] + arr[j] == arr[k]) {
                count++;
                i++; j--;
            } else if (arr[i] + arr[j] < arr[k]) i++;
            else j--;
        }
    }
    return count;
}`,
    visualizerSteps: [
      { line: 1, code: "function countTriplet(arr = [1, 5, 3, 2]) {", vars: { n: "4" }, log: "Initialize array [1, 5, 3, 2]. Sort & count pairs i + j == k.", arrayState: [{ val: "1" }, { val: "5" }, { val: "3" }, { val: "2" }] },
      { line: 2, code: "  arr.sort(); // [1, 2, 3, 5]", vars: { sorted: "[1, 2, 3, 5]" }, log: "Sort array: [1, 2, 3, 5].", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "5" }] },
      { line: 7, code: "  2 + 3 === 5 -> TRIPLET MATCH 1! count = 1", vars: { target: "5", i: "1 (2)", j: "2 (3)", count: "1" }, log: "Target k = 3 (val 5): arr[1] (2) + arr[2] (3) = 5 === 5! TRIPLET 1 FOUND: (2, 3, 5).", arrayState: [{ val: "1" }, { val: "2", match: true }, { val: "3", match: true }, { val: "5", match: true }] },
      { line: 7, code: "  1 + 2 === 3 -> TRIPLET MATCH 2! count = 2", vars: { target: "3", i: "0 (1)", j: "1 (2)", count: "2" }, log: "Target k = 2 (val 3): arr[0] (1) + arr[1] (2) = 3 === 3! TRIPLET 2 FOUND: (1, 2, 3).", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "5" }] },
      { line: 16, code: "  return count; // TOTAL TRIPLETS = 2", vars: { totalTriplets: "2", status: "COMPLETE" }, log: "Traversal complete! Total triplets satisfying arr[i] + arr[j] = arr[k] is 2.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "5", match: true }] }
    ]
  },

  // ── 29. COUNT PAIRS IN ARRAY DIVISIBLE BY K ──
  "count pairs in array divisible by k": {
    solutionJS: `function countKdivPairs(arr, n, k) {
  let freq = new Array(k).fill(0);
  let count = 0;
  for (let i = 0; i < n; i++) {
    let rem = arr[i] % k;
    let complement = (k - rem) % k;
    count += freq[complement];
    freq[rem]++;
  }
  return count;
}`,
    solutionPY: `def countKdivPairs(arr, n, k):
    freq = [0] * k
    count = 0
    for num in arr:
        rem = num % k
        complement = (k - rem) % k
        count += freq[complement]
        freq[rem] += 1
    return count`,
    solutionCPP: `int countKdivPairs(int arr[], int n, int k) {
    vector<int> freq(k, 0);
    int count = 0;
    for (int i = 0; i < n; i++) {
        int rem = arr[i] % k;
        int complement = (k - rem) % k;
        count += freq[complement];
        freq[rem]++;
    }
    return count;
}`,
    visualizerSteps: [
      { line: 1, code: "function countKdivPairs(arr = [2, 2, 1, 7, 5, 3], k = 4) {", vars: { k: "4", freq: "[0, 0, 0, 0]" }, log: "Initialize array [2, 2, 1, 7, 5, 3] and k = 4. Track remainder frequencies modulo 4.", arrayState: [{ val: "2" }, { val: "2" }, { val: "1" }, { val: "7" }, { val: "5" }, { val: "3" }] },
      { line: 6, code: "  rem = 2 % 4 = 2; complement = 2; freq[2]++;", vars: { num: "2", rem: "2", complement: "2", count: "1", freq: "{2: 2}" }, log: "Inspect arr[1] (2): rem = 2, complement = 2. Matches previous 2! count = 1. freq[2] = 2.", arrayState: [{ val: "2", match: true }, { val: "2", match: true }, { val: "1" }, { val: "7" }, { val: "5" }, { val: "3" }] },
      { line: 6, code: "  rem = 7 % 4 = 3; complement = 1; freq[3]++;", vars: { num: "7", rem: "3", complement: "1", count: "2", freq: "{1: 1, 2: 2, 3: 1}" }, log: "Inspect arr[3] (7): rem = 3, complement = 1. Matches arr[2] (1)! count = 2.", arrayState: [{ val: "2", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "7", match: true }, { val: "5" }, { val: "3" }] },
      { line: 10, code: "  return count; // TOTAL DIVISIBLE PAIRS = 5", vars: { totalPairs: "5", status: "COMPLETE" }, log: "Traversal complete! Total pairs (arr[i] + arr[j]) divisible by 4 is 5.", arrayState: [{ val: "2", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "7", match: true }, { val: "5", match: true }, { val: "3", match: true }] }
    ]
  },

  // ── 30. HELP CLASSMATES ──
  "help classmates": {
    solutionJS: `function helpClassmates(arr, n) {
  let result = new Array(n).fill(-1);
  let stack = [];
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length > 0 && stack[stack.length - 1] >= arr[i]) {
      stack.pop();
    }
    if (stack.length > 0) result[i] = stack[stack.length - 1];
    stack.push(arr[i]);
  }
  return result;
}`,
    solutionPY: `def helpClassmates(arr, n):
    result = [-1] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and stack[-1] >= arr[i]:
            stack.pop()
        if stack:
            result[i] = stack[-1]
        stack.append(arr[i])
    return result`,
    solutionCPP: `vector<int> helpClassmates(vector<int> arr, int n) {
    vector<int> result(n, -1);
    stack<int> st;
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && st.top() >= arr[i]) st.pop();
        if (!st.empty()) result[i] = st.top();
        st.push(arr[i]);
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function helpClassmates(arr = [3, 8, 5, 2, 25]) {", vars: { n: "5" }, log: "Initialize array [3, 8, 5, 2, 25]. Monotonic stack for next smaller element.", arrayState: [{ val: "3" }, { val: "8" }, { val: "5" }, { val: "2" }, { val: "25" }] },
      { line: 8, code: "  stack top = 2 < 5 -> result[2] = 2;", vars: { i: "2", val: "5", smaller: "2", result: "[?, ?, 2, -1, -1]" }, log: "Inspect arr[2] (5): Monotonic stack top is 2 < 5. Immediate smaller element for 5 is 2.", arrayState: [{ val: "3" }, { val: "8" }, { val: "5", active: true }, { val: "2", match: true }, { val: "25" }] },
      { line: 8, code: "  stack top = 5 < 8 -> result[1] = 5;", vars: { i: "1", val: "8", smaller: "5", result: "[?, 5, 2, -1, -1]" }, log: "Inspect arr[1] (8): Monotonic stack top is 5 < 8. Immediate smaller element for 8 is 5.", arrayState: [{ val: "3" }, { val: "8", active: true }, { val: "5", match: true }, { val: "2", match: true }, { val: "25" }] },
      { line: 8, code: "  stack top = 2 < 3 -> result[0] = 2;", vars: { i: "0", val: "3", smaller: "2", result: "[2, 5, 2, -1, -1]" }, log: "Inspect arr[0] (3): Pop 8 & 5 (>= 3). Stack top is 2 < 3. Immediate smaller element for 3 is 2.", arrayState: [{ val: "3", active: true }, { val: "8" }, { val: "5" }, { val: "2", match: true }, { val: "25" }] },
      { line: 11, code: "  return [2, 5, 2, -1, -1]; // COMPLETE", vars: { status: "COMPLETE" }, log: "Traversal complete! Next smaller elements: [2, 5, 2, -1, -1].", arrayState: [{ val: "2", match: true }, { val: "5", match: true }, { val: "2", match: true }, { val: "-1", match: true }, { val: "-1", match: true }] }
    ]
  },

  // ── 31. INSERT INTERVAL ──
  "insert interval": {
    solutionJS: `function insert(intervals, newInterval) {
  let result = [];
  let i = 0;
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);
  while (i < intervals.length) {
    result.push(intervals[i]);
    i++;
  }
  return result;
}`,
    solutionPY: `def insert(intervals, newInterval):
    result = []
    i = 0
    n = len(intervals)
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    while i < n:
        result.append(intervals[i])
        i += 1
    return result`,
    solutionCPP: `vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
    vector<vector<int>> result;
    int i = 0, n = intervals.size();
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.push_back(intervals[i++]);
    }
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = min(newInterval[0], intervals[i][0]);
        newInterval[1] = max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.push_back(newInterval);
    while (i < n) result.push_back(intervals[i++]);
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function insert(intervals = [[1, 3], [6, 9]], newInterval = [2, 5]) {", vars: { newInterval: "[2, 5]" }, log: "Initialize intervals [[1, 3], [6, 9]] and new interval [2, 5].", arrayState: [{ val: "[1, 3]" }, { val: "[6, 9]" }] },
      { line: 9, code: "  newInterval = [min(2,1), max(5,3)] = [1, 5]; // Merge [1,3] & [2,5]", vars: { merged: "[1, 5]" }, log: "Compare [1, 3] with [2, 5]: Overlap detected! Merge into [1, 5].", arrayState: [{ val: "[1, 3]", match: true }, { val: "[6, 9]" }] },
      { line: 13, code: "  result.push([1, 5]); result.push([6, 9]);", vars: { result: "[[1, 5], [6, 9]]" }, log: "Append merged interval [1, 5] and non-overlapping interval [6, 9].", arrayState: [{ val: "[1, 5]", match: true }, { val: "[6, 9]", match: true }] },
      { line: 17, code: "  return [[1, 5], [6, 9]]; // INSERT COMPLETE", vars: { status: "COMPLETE" }, log: "Interval insert & merge complete cleanly! Result: [[1, 5], [6, 9]].", arrayState: [{ val: "[1, 5]", match: true }, { val: "[6, 9]", match: true }] }
    ]
  },

  // ── 32. KADANE'S ALGORITHM ──
  "kadanes algorithm": {
    solutionJS: `function maxSubarraySum(arr) {
  let maxSoFar = arr[0];
  let currMax = arr[0];
  for (let i = 1; i < arr.length; i++) {
    currMax = Math.max(arr[i], currMax + arr[i]);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  return maxSoFar;
}`,
    solutionPY: `def maxSubarraySum(arr):
    max_so_far = arr[0]
    curr_max = arr[0]
    for i in range(1, len(arr)):
        curr_max = max(arr[i], curr_max + arr[i])
        max_so_far = max(max_so_far, curr_max)
    return max_so_far`,
    solutionCPP: `long long maxSubarraySum(vector<int>& arr) {
    long long maxSoFar = arr[0];
    long long currMax = arr[0];
    for (int i = 1; i < arr.size(); i++) {
        currMax = max((long long)arr[i], currMax + arr[i]);
        maxSoFar = max(maxSoFar, currMax);
    }
    return maxSoFar;
}`,
    visualizerSteps: [
      { line: 1, code: "function maxSubarraySum(arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]) {", vars: { maxSoFar: "-2", currMax: "-2" }, log: "Initialize array [-2, 1, -3, 4, -1, 2, 1, -5, 4]. Kadane's DP accumulation.", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4" }, { val: "-1" }, { val: "2" }, { val: "1" }, { val: "-5" }, { val: "4" }] },
      { line: 5, code: "  currMax = max(4, 3+4) = 4; maxSoFar = 4;", vars: { i: "3", val: "4", currMax: "4", maxSoFar: "4" }, log: "Index 3 (val 4): Start new subarray accumulation. currMax = 4, maxSoFar = 4.", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4", active: true }, { val: "-1" }, { val: "2" }, { val: "1" }, { val: "-5" }, { val: "4" }] },
      { line: 5, code: "  currMax = max(1, 5+1) = 6; maxSoFar = 6; // NEW MAX SUBARRAY SUM!", vars: { i: "6", val: "1", currMax: "6", maxSoFar: "6" }, log: "Index 6 (val 1): Subarray [4, -1, 2, 1] reaches sum 6! NEW MAX SUBARRAY SUM = 6!", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4", match: true }, { val: "-1", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "-5" }, { val: "4" }] },
      { line: 8, code: "  return 6; // MAXIMUM SUBARRAY SUM = 6", vars: { maxSubarraySum: "6", status: "COMPLETE" }, log: "Array traversal complete. Maximum contiguous subarray sum found by Kadane is 6 (Subarray [4, -1, 2, 1]).", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4", match: true }, { val: "-1", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "-5" }, { val: "4" }] }
    ]
  },
  "kadane's algorithm": {
    solutionJS: `function maxSubarraySum(arr) {
  let maxSoFar = arr[0];
  let currMax = arr[0];
  for (let i = 1; i < arr.length; i++) {
    currMax = Math.max(arr[i], currMax + arr[i]);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  return maxSoFar;
}`,
    solutionPY: `def maxSubarraySum(arr):
    max_so_far = arr[0]
    curr_max = arr[0]
    for i in range(1, len(arr)):
        curr_max = max(arr[i], curr_max + arr[i])
        max_so_far = max(max_so_far, curr_max)
    return max_so_far`,
    solutionCPP: `long long maxSubarraySum(vector<int>& arr) {
    long long maxSoFar = arr[0];
    long long currMax = arr[0];
    for (int i = 1; i < arr.size(); i++) {
        currMax = max((long long)arr[i], currMax + arr[i]);
        maxSoFar = max(maxSoFar, currMax);
    }
    return maxSoFar;
}`,
    visualizerSteps: [
      { line: 1, code: "function maxSubarraySum(arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]) {", vars: { maxSoFar: "-2", currMax: "-2" }, log: "Initialize array [-2, 1, -3, 4, -1, 2, 1, -5, 4]. Kadane's DP accumulation.", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4" }, { val: "-1" }, { val: "2" }, { val: "1" }, { val: "-5" }, { val: "4" }] },
      { line: 5, code: "  currMax = max(4, 3+4) = 4; maxSoFar = 4;", vars: { i: "3", val: "4", currMax: "4", maxSoFar: "4" }, log: "Index 3 (val 4): Start new subarray accumulation. currMax = 4, maxSoFar = 4.", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4", active: true }, { val: "-1" }, { val: "2" }, { val: "1" }, { val: "-5" }, { val: "4" }] },
      { line: 5, code: "  currMax = max(1, 5+1) = 6; maxSoFar = 6; // NEW MAX SUBARRAY SUM!", vars: { i: "6", val: "1", currMax: "6", maxSoFar: "6" }, log: "Index 6 (val 1): Subarray [4, -1, 2, 1] reaches sum 6! NEW MAX SUBARRAY SUM = 6!", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4", match: true }, { val: "-1", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "-5" }, { val: "4" }] },
      { line: 8, code: "  return 6; // MAXIMUM SUBARRAY SUM = 6", vars: { maxSubarraySum: "6", status: "COMPLETE" }, log: "Array traversal complete. Maximum contiguous subarray sum found by Kadane is 6 (Subarray [4, -1, 2, 1]).", arrayState: [{ val: "-2" }, { val: "1" }, { val: "-3" }, { val: "4", match: true }, { val: "-1", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "-5" }, { val: "4" }] }
    ]
  },

  // ── 33. KTH SMALLEST ELEMENT ──
  "kth smallest element": {
    solutionJS: `function kthSmallest(arr, l, r, k) {
  let sub = arr.slice(l, r + 1);
  sub.sort((a, b) => a - b);
  return sub[k - 1];
}`,
    solutionPY: `def kthSmallest(arr, l, r, k):
    sub = arr[l:r + 1]
    sub.sort()
    return sub[k - 1]`,
    solutionCPP: `int kthSmallest(int arr[], int l, int r, int k) {
    sort(arr + l, arr + r + 1);
    return arr[l + k - 1];
}`,
    visualizerSteps: [
      { line: 1, code: "function kthSmallest(arr = [7, 10, 4, 3, 20, 15], k = 3) {", vars: { k: "3", n: "6" }, log: "Initialize array [7, 10, 4, 3, 20, 15]. Goal: Find 3rd smallest element.", arrayState: [{ val: "7" }, { val: "10" }, { val: "4" }, { val: "3" }, { val: "20" }, { val: "15" }] },
      { line: 3, code: "  arr.sort(); // [3, 4, 7, 10, 15, 20]", vars: { sorted: "[3, 4, 7, 10, 15, 20]" }, log: "Sort array: [3, 4, 7, 10, 15, 20].", arrayState: [{ val: "3" }, { val: "4" }, { val: "7" }, { val: "10" }, { val: "15" }, { val: "20" }] },
      { line: 4, code: "  return arr[k - 1]; // 3rd Smallest = arr[2] = 7", vars: { k: "3", kthSmallestVal: "7", status: "FOUND" }, log: "Index k - 1 (2): 3rd smallest element is 7! Return 7.", arrayState: [{ val: "3" }, { val: "4" }, { val: "7", match: true }, { val: "10" }, { val: "15" }, { val: "20" }] }
    ]
  },

  // ── 34. LARGEST NUMBER FORMED FROM AN ARRAY ──
  "largest number formed from an array": {
    solutionJS: `function printLargest(arr) {
  arr.sort((a, b) => (b + a).localeCompare(a + b));
  let result = arr.join('');
  return result[0] === '0' ? '0' : result;
}`,
    solutionPY: `from functools import cmp_to_key
def printLargest(arr):
    def compare(a, b):
        if a + b > b + a: return -1
        else: return 1
    arr_str = [str(x) for x in arr]
    arr_str.sort(key=cmp_to_key(compare))
    ans = "".join(arr_str)
    return '0' if ans[0] == '0' else ans`,
    solutionCPP: `string printLargest(vector<string> &arr) {
    sort(arr.begin(), arr.end(), [](const string &a, const string &b) {
        return a + b > b + a;
    });
    string ans = "";
    for (string s : arr) ans += s;
    return ans[0] == '0' ? "0" : ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function printLargest(arr = ['3', '30', '34', '5', '9']) {", vars: { arr: "['3', '30', '34', '5', '9']" }, log: "Initialize number strings ['3', '30', '34', '5', '9']. Custom string concatenation sort.", arrayState: [{ val: "3" }, { val: "30" }, { val: "34" }, { val: "5" }, { val: "9" }] },
      { line: 2, code: "  arr.sort((a, b) => (b + a) vs (a + b));", vars: { comp1: "'95' > '59'", comp2: "'343' > '334'", comp3: "'330' > '303'" }, log: "Compare pairs: '9' + '5' > '5' + '9', '34' + '3' > '3' + '34', '3' + '30' > '30' + '3'.", arrayState: [{ val: "9", active: true }, { val: "5", active: true }, { val: "34", active: true }, { val: "3", active: true }, { val: "30", active: true }] },
      { line: 3, code: "  let result = arr.join(''); // '9534330'", vars: { sorted: "['9', '5', '34', '3', '30']", largestStr: "'9534330'" }, log: "Sorted order: ['9', '5', '34', '3', '30']. Concatenate into largest number: '9534330'!", arrayState: [{ val: "9", match: true }, { val: "5", match: true }, { val: "34", match: true }, { val: "3", match: true }, { val: "30", match: true }] },
      { line: 4, code: "  return '9534330'; // COMPLETE", vars: { status: "COMPLETE" }, log: "Return largest concatenated string number: '9534330'.", arrayState: [{ val: "9", match: true }, { val: "5", match: true }, { val: "34", match: true }, { val: "3", match: true }, { val: "30", match: true }] }
    ]
  },

  // ── 35. LONGEST CONSECUTIVE SEQUENCE ──
  "longest consecutive sequence": {
    solutionJS: `function longestConsecutive(nums) {
  let set = new Set(nums);
  let maxLen = 0;
  for (let num of set) {
    if (!set.has(num - 1)) {
      let currentNum = num;
      let currentLen = 1;
      while (set.has(currentNum + 1)) {
        currentNum++;
        currentLen++;
      }
      maxLen = Math.max(maxLen, currentLen);
    }
  }
  return maxLen;
}`,
    solutionPY: `def longestConsecutive(nums):
    num_set = set(nums)
    max_len = 0
    for num in num_set:
        if num - 1 not in num_set:
            curr_num = num
            curr_len = 1
            while curr_num + 1 in num_set:
                curr_num += 1
                curr_len += 1
            max_len = max(max_len, curr_len)
    return max_len`,
    solutionCPP: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> set(nums.begin(), nums.end());
    int maxLen = 0;
    for (int num : set) {
        if (!set.count(num - 1)) {
            int currNum = num, currLen = 1;
            while (set.count(currNum + 1)) {
                currNum++; currLen++;
            }
            maxLen = max(maxLen, currLen);
        }
    }
    return maxLen;
}`,
    visualizerSteps: [
      { line: 1, code: "function longestConsecutive(nums = [100, 4, 200, 1, 3, 2]) {", vars: { set: "{100, 4, 200, 1, 3, 2}" }, log: "Initialize nums = [100, 4, 200, 1, 3, 2]. Build Hash Set for O(1) sequence start detection.", arrayState: [{ val: "100" }, { val: "4" }, { val: "200" }, { val: "1" }, { val: "3" }, { val: "2" }] },
      { line: 5, code: "  if (!set.has(0)) // num 1 is SEQUENCE START!", vars: { startNum: "1", isSequenceStart: "true" }, log: "Inspect 1: 0 (1-1) is not in set. 1 is a SEQUENCE START!", arrayState: [{ val: "100" }, { val: "4" }, { val: "200" }, { val: "1", active: true }, { val: "3" }, { val: "2" }] },
      { line: 8, code: "  while (set.has(currNum + 1)) // 1 -> 2 -> 3 -> 4 (Len 4)", vars: { sequence: "[1, 2, 3, 4]", maxLen: "4" }, log: "Scan consecutive numbers from 1: Found 2, 3, 4. Sequence length = 4! maxLen = 4.", arrayState: [{ val: "100" }, { val: "4", match: true }, { val: "200" }, { val: "1", match: true }, { val: "3", match: true }, { val: "2", match: true }] },
      { line: 14, code: "  return 4; // LONGEST CONSECUTIVE SEQUENCE = 4", vars: { maxConsecutiveLen: "4", status: "COMPLETE" }, log: "Sequence [1, 2, 3, 4] is the longest consecutive sequence. Return length 4.", arrayState: [{ val: "100" }, { val: "4", match: true }, { val: "200" }, { val: "1", match: true }, { val: "3", match: true }, { val: "2", match: true }] }
    ]
  },

  // ── 36. MAXIMUM RECTANGULAR AREA IN A HISTOGRAM ──
  "maximum rectangular area in a histogram": {
    solutionJS: `function getMaxArea(heights) {
  let stack = [];
  let maxArea = 0;
  let n = heights.length;
  for (let i = 0; i <= n; i++) {
    let h = (i === n) ? 0 : heights[i];
    while (stack.length > 0 && heights[stack[stack.length - 1]] >= h) {
      let height = heights[stack.pop()];
      let width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}`,
    solutionPY: `def getMaxArea(heights):
    stack = []
    max_area = 0
    heights.append(0)
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] >= h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    return max_area`,
    solutionCPP: `long long getMaxArea(long long heights[], int n) {
    stack<int> st;
    long long maxArea = 0;
    for (int i = 0; i <= n; i++) {
        long long h = (i == n) ? 0 : heights[i];
        while (!st.empty() && heights[st.top()] >= h) {
            long long height = heights[st.top()]; st.pop();
            long long width = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, height * width);
        }
        st.push(i);
    }
    return maxArea;
}`,
    visualizerSteps: [
      { line: 1, code: "function getMaxArea(heights = [2, 1, 5, 6, 2, 3]) {", vars: { n: "6", maxArea: "0" }, log: "Initialize histogram heights [2, 1, 5, 6, 2, 3]. Monotonic increasing stack.", arrayState: [{ val: "2" }, { val: "1" }, { val: "5" }, { val: "6" }, { val: "2" }, { val: "3" }] },
      { line: 8, code: "  pop idx 3 (h 6): area = 6 * 1 = 6; maxArea = 6;", vars: { i: "4", h: "2", poppedHeight: "6", area: "6" }, log: "Bar 4 (h 2) < Bar 3 (h 6): Pop idx 3 (h 6). Rectangle area = 6 * 1 = 6.", arrayState: [{ val: "2" }, { val: "1" }, { val: "5" }, { val: "6", active: true }, { val: "2" }, { val: "3" }] },
      { line: 8, code: "  pop idx 2 (h 5): area = 5 * 2 = 10; maxArea = 10; // NEW MAX AREA!", vars: { i: "4", h: "2", poppedHeight: "5", width: "2", area: "10" }, log: "Bar 4 (h 2) < Bar 2 (h 5): Pop idx 2 (h 5). Width = 2. Rectangle area = 5 * 2 = 10! NEW MAX AREA!", arrayState: [{ val: "2" }, { val: "1" }, { val: "5", match: true }, { val: "6", match: true }, { val: "2" }, { val: "3" }] },
      { line: 12, code: "  return maxArea; // MAXIMUM RECTANGLE AREA = 10", vars: { maxArea: "10", status: "COMPLETE" }, log: "Histogram scan complete! Maximum rectangular area is 10 (bars of height 5 and 6).", arrayState: [{ val: "2" }, { val: "1" }, { val: "5", match: true }, { val: "6", match: true }, { val: "2" }, { val: "3" }] }
    ]
  },

  // ── 37. MAXIMUM OF ALL SUBARRAYS OF SIZE K ──
  "maximum of all subarrays of size k": {
    solutionJS: `function maxOfSubarrays(arr, k) {
  let result = [];
  let deque = [];
  for (let i = 0; i < arr.length; i++) {
    if (deque.length > 0 && deque[0] <= i - k) deque.shift();
    while (deque.length > 0 && arr[deque[deque.length - 1]] <= arr[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) result.push(arr[deque[0]]);
  }
  return result;
}`,
    solutionPY: `def maxOfSubarrays(arr, k):
    from collections import deque
    result = []
    dq = deque()
    for i in range(len(arr)):
        if dq and dq[0] <= i - k: dq.popleft()
        while dq and arr[dq[-1]] <= arr[i]: dq.pop()
        dq.append(i)
        if i >= k - 1: result.append(arr[dq[0]])
    return result`,
    solutionCPP: `vector<int> maxOfSubarrays(vector<int>& arr, int k) {
    vector<int> result;
    deque<int> dq;
    for (int i = 0; i < arr.size(); i++) {
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        while (!dq.empty() && arr[dq.back()] <= arr[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) result.push_back(arr[dq.front()]);
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function maxOfSubarrays(arr = [1, 3, -1, -3, 5, 3, 6, 7], k = 3) {", vars: { k: "3", deque: "[]" }, log: "Initialize arr = [1, 3, -1, -3, 5, 3, 6, 7], k = 3. Monotonic deque sliding window.", arrayState: [{ val: "1" }, { val: "3" }, { val: "-1" }, { val: "-3" }, { val: "5" }, { val: "3" }, { val: "6" }, { val: "7" }] },
      { line: 8, code: "  Window 1 [1, 3, -1] -> max = 3", vars: { window: "[1, 3, -1]", max: "3", result: "[3]" }, log: "Window 1 (idx 0 to 2): Deque front = 3. Sliding max = 3.", arrayState: [{ val: "1" }, { val: "3", match: true }, { val: "-1" }, { val: "-3" }, { val: "5" }, { val: "3" }, { val: "6" }, { val: "7" }] },
      { line: 8, code: "  Window 3 [-1, -3, 5] -> max = 5", vars: { window: "[-1, -3, 5]", max: "5", result: "[3, 3, 5]" }, log: "Window 3 (idx 2 to 4): 5 > -1 & -3 -> Deque front = 5. Sliding max = 5.", arrayState: [{ val: "1" }, { val: "3" }, { val: "-1" }, { val: "-3" }, { val: "5", match: true }, { val: "3" }, { val: "6" }, { val: "7" }] },
      { line: 8, code: "  Window 6 [3, 6, 7] -> max = 7", vars: { window: "[3, 6, 7]", max: "7", result: "[3, 3, 5, 5, 6, 7]" }, log: "Window 6 (idx 5 to 7): 7 > 6 -> Deque front = 7. Sliding max = 7.", arrayState: [{ val: "1" }, { val: "3" }, { val: "-1" }, { val: "-3" }, { val: "5" }, { val: "3" }, { val: "6" }, { val: "7", match: true }] },
      { line: 10, code: "  return [3, 3, 5, 5, 6, 7]; // SLIDING MAXIMUMS COMPLETE", vars: { result: "[3, 3, 5, 5, 6, 7]", status: "COMPLETE" }, log: "Sliding window scan complete! Maximum of all subarrays of size 3: [3, 3, 5, 5, 6, 7].", arrayState: [{ val: "1" }, { val: "3" }, { val: "-1" }, { val: "-3" }, { val: "5" }, { val: "3" }, { val: "6" }, { val: "7", match: true }] }
    ]
  },

  // ── 38. MEETING ROOMS II ──
  "meeting rooms ii": {
    solutionJS: `function minMeetingRooms(intervals) {
  let starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  let ends = intervals.map(i => i[1]).sort((a, b) => a - b);
  let rooms = 0, endPtr = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] < ends[endPtr]) {
      rooms++;
    } else {
      endPtr++;
    }
  }
  return rooms;
}`,
    solutionPY: `def minMeetingRooms(intervals):
    starts = sorted([i[0] for i in intervals])
    ends = sorted([i[1] for i in intervals])
    rooms, end_ptr = 0, 0
    for i in range(len(starts)):
        if starts[i] < ends[end_ptr]:
            rooms += 1
        else:
            end_ptr += 1
    return rooms`,
    solutionCPP: `int minMeetingRooms(vector<vector<int>>& intervals) {
    vector<int> starts, ends;
    for (auto& i : intervals) { starts.push_back(i[0]); ends.push_back(i[1]); }
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());
    int rooms = 0, endPtr = 0;
    for (int i = 0; i < starts.size(); i++) {
        if (starts[i] < ends[endPtr]) rooms++;
        else endPtr++;
    }
    return rooms;
}`,
    visualizerSteps: [
      { line: 1, code: "function minMeetingRooms(intervals = [[0, 30], [5, 10], [15, 20]]) {", vars: { starts: "[0, 5, 15]", ends: "[10, 20, 30]" }, log: "Initialize intervals [[0, 30], [5, 10], [15, 20]]. Sort start & end times.", arrayState: [{ val: "[0, 30]" }, { val: "[5, 10]" }, { val: "[15, 20]" }] },
      { line: 7, code: "  starts[0] (0) < ends[0] (10) -> rooms = 1;", vars: { i: "0", start: "0", end: "10", rooms: "1" }, log: "Meeting 1 starts at 0 < earliest end time 10. Allocate Room 1. rooms = 1.", arrayState: [{ val: "[0, 30]", active: true }, { val: "[5, 10]" }, { val: "[15, 20]" }] },
      { line: 7, code: "  starts[1] (5) < ends[0] (10) -> rooms = 2;", vars: { i: "1", start: "5", end: "10", rooms: "2" }, log: "Meeting 2 starts at 5 < earliest end time 10. Overlap! Allocate Room 2. rooms = 2.", arrayState: [{ val: "[0, 30]", match: true }, { val: "[5, 10]", match: true }, { val: "[15, 20]" }] },
      { line: 9, code: "  starts[2] (15) >= ends[0] (10) -> Reuse room!", vars: { i: "2", start: "15", end: "10", endPtr: "1 (20)", rooms: "2" }, log: "Meeting 3 starts at 15 >= earliest end time 10. Previous meeting ended! Reuse Room 1.", arrayState: [{ val: "[0, 30]", match: true }, { val: "[5, 10]", match: true }, { val: "[15, 20]", active: true }] },
      { line: 11, code: "  return 2; // MINIMUM MEETING ROOMS REQUIRED = 2", vars: { minRooms: "2", status: "COMPLETE" }, log: "All meetings processed cleanly! Minimum conference rooms required: 2.", arrayState: [{ val: "[0, 30]", match: true }, { val: "[5, 10]", match: true }, { val: "[15, 20]", match: true }] }
    ]
  },

  // ── 39. MERGE INTERVALS ──
  "merge intervals": {
    solutionJS: `function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  let result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    let prev = result[result.length - 1];
    let curr = intervals[i];
    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      result.push(curr);
    }
  }
  return result;
}`,
    solutionPY: `def merge(intervals):
    if len(intervals) <= 1: return intervals
    intervals.sort(key=lambda x: x[0])
    result = [intervals[0]]
    for i in range(1, len(intervals)):
        prev = result[-1]
        curr = intervals[i]
        if curr[0] <= prev[1]:
            prev[1] = max(prev[1], curr[1])
        else:
            result.append(curr)
    return result`,
    solutionCPP: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    if (intervals.size() <= 1) return intervals;
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> result;
    result.push_back(intervals[0]);
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] <= result.back()[1]) {
            result.back()[1] = max(result.back()[1], intervals[i][1]);
        } else {
            result.push_back(intervals[i]);
        }
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function merge(intervals = [[1,3],[2,6],[8,10],[15,18]]) {", vars: { count: "4" }, log: "Initialize intervals [[1,3],[2,6],[8,10],[15,18]]. Sort by start time.", arrayState: [{ val: "[1, 3]" }, { val: "[2, 6]" }, { val: "[8, 10]" }, { val: "[15, 18]" }] },
      { line: 8, code: "  curr[0] <= prev[1] (2 <= 3) -> Merge into [1, 6]", vars: { prev: "[1, 3]", curr: "[2, 6]", merged: "[1, 6]" }, log: "Compare [2, 6] with [1, 3]: Overlap (2 <= 3)! Merge into [1, 6].", arrayState: [{ val: "[1, 6]", match: true }, { val: "[8, 10]" }, { val: "[15, 18]" }] },
      { line: 10, code: "  8 > 6 -> Non-overlapping! Push [8, 10]", vars: { curr: "[8, 10]", result: "[[1, 6], [8, 10]]" }, log: "Compare [8, 10] with [1, 6]: No overlap (8 > 6). Append [8, 10].", arrayState: [{ val: "[1, 6]", match: true }, { val: "[8, 10]", match: true }, { val: "[15, 18]" }] },
      { line: 13, code: "  return [[1, 6], [8, 10], [15, 18]]; // MERGE COMPLETE", vars: { result: "[[1,6],[8,10],[15,18]]", status: "COMPLETE" }, log: "Traversal complete! Final merged non-overlapping intervals: [[1, 6], [8, 10], [15, 18]].", arrayState: [{ val: "[1, 6]", match: true }, { val: "[8, 10]", match: true }, { val: "[15, 18]", match: true }] }
    ]
  },

  // ── 40. MINIMUM PLATFORMS ──
  "minimum platforms": {
    solutionJS: `function findPlatform(arr, dep, n) {
  arr.sort((a, b) => a - b);
  dep.sort((a, b) => a - b);
  let platNeeded = 1, maxPlat = 1;
  let i = 1, j = 0;
  while (i < n && j < n) {
    if (arr[i] <= dep[j]) {
      platNeeded++;
      i++;
    } else {
      platNeeded--;
      j++;
    }
    maxPlat = Math.max(maxPlat, platNeeded);
  }
  return maxPlat;
}`,
    solutionPY: `def findPlatform(arr, dep, n):
    arr.sort()
    dep.sort()
    plat_needed, max_plat = 1, 1
    i, j = 1, 0
    while i < n and j < n:
        if arr[i] <= dep[j]:
            plat_needed += 1
            i += 1
        else:
            plat_needed -= 1
            j += 1
        max_plat = max(max_plat, plat_needed)
    return max_plat`,
    solutionCPP: `int findPlatform(int arr[], int dep[], int n) {
    sort(arr, arr + n);
    sort(dep, dep + n);
    int platNeeded = 1, maxPlat = 1;
    int i = 1, j = 0;
    while (i < n && j < n) {
        if (arr[i] <= dep[j]) {
            platNeeded++; i++;
        } else {
            platNeeded--; j++;
        }
        maxPlat = max(maxPlat, platNeeded);
    }
    return maxPlat;
}`,
    visualizerSteps: [
      { line: 1, code: "function findPlatform(arr = [900, 940, 950, 1100], dep = [910, 1120, 1130, 1200]) {", vars: { platNeeded: "1", maxPlat: "1" }, log: "Initialize train schedules. Sort arrivals and departures independently.", arrayState: [{ val: "900 arr" }, { val: "940 arr" }, { val: "950 arr" }, { val: "1100 arr" }] },
      { line: 8, code: "  arr[1] (940) > dep[0] (910) -> Train left! platNeeded = 1;", vars: { i: "1", j: "0", platNeeded: "1" }, log: "940 arr > 910 dep: Train at platform 1 departed! platNeeded = 1.", arrayState: [{ val: "900 arr", match: true }, { val: "940 arr", active: true }, { val: "950 arr" }, { val: "1100 arr" }] },
      { line: 7, code: "  arr[2] (950) <= dep[1] (1120) -> platNeeded = 2;", vars: { i: "2", j: "1", platNeeded: "2" }, log: "950 arr <= 1120 dep: New arrival before departure! platNeeded = 2.", arrayState: [{ val: "900 arr" }, { val: "940 arr" }, { val: "950 arr", active: true }, { val: "1100 arr" }] },
      { line: 7, code: "  arr[3] (1100) <= dep[1] (1120) -> maxPlat = 3; // MAX PLATFORMS NEEDED!", vars: { i: "3", j: "1", platNeeded: "3", maxPlat: "3" }, log: "1100 arr <= 1120 dep: Another train arrives! platNeeded = 3! MAX PLATFORMS REQUIRED = 3.", arrayState: [{ val: "900 arr" }, { val: "940 arr", match: true }, { val: "950 arr", match: true }, { val: "1100 arr", match: true }] },
      { line: 15, code: "  return 3; // MINIMUM PLATFORMS REQUIRED = 3", vars: { maxPlatforms: "3", status: "COMPLETE" }, log: "Timeline sweep complete! Minimum train platforms required: 3.", arrayState: [{ val: "900 arr" }, { val: "940 arr", match: true }, { val: "950 arr", match: true }, { val: "1100 arr", match: true }] }
    ]
  },

  // ── 41. NON-OVERLAPPING INTERVALS ──
  "non-overlapping intervals": {
    solutionJS: `function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let end = intervals[0][1];
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < end) {
      count++;
    } else {
      end = intervals[i][1];
    }
  }
  return count;
}`,
    solutionPY: `def eraseOverlapIntervals(intervals):
    if not intervals: return 0
    intervals.sort(key=lambda x: x[1])
    count = 0
    end = intervals[0][1]
    for i in range(1, len(intervals)):
        if intervals[i][0] < end:
            count += 1
        else:
            end = intervals[i][1]
    return count`,
    solutionCPP: `int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) return 0;
    sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[1] < b[1];
    });
    int count = 0;
    int end = intervals[0][1];
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] < end) count++;
        else end = intervals[i][1];
    }
    return count;
}`,
    visualizerSteps: [
      { line: 1, code: "function eraseOverlapIntervals(intervals = [[1,2],[2,3],[3,4],[1,3]]) {", vars: { n: "4" }, log: "Initialize intervals [[1,2],[2,3],[3,4],[1,3]]. Greedy sort by end time.", arrayState: [{ val: "[1, 2]" }, { val: "[2, 3]" }, { val: "[3, 4]" }, { val: "[1, 3]" }] },
      { line: 3, code: "  intervals.sort by end time -> [[1,2], [2,3], [1,3], [3,4]];", vars: { sorted: "[[1,2], [2,3], [1,3], [3,4]]" }, log: "Sorted by end time: [[1,2], [2,3], [1,3], [3,4]].", arrayState: [{ val: "[1, 2]" }, { val: "[2, 3]" }, { val: "[1, 3]" }, { val: "[3, 4]" }] },
      { line: 7, code: "  intervals[2] ([1,3]): 1 < 3 -> OVERLAP! count = 1;", vars: { i: "2", interval: "[1, 3]", end: "3", count: "1" }, log: "Inspect [1, 3]: Start 1 < previous end 3. Overlap detected! Remove [1, 3]. count = 1.", arrayState: [{ val: "[1, 2]", match: true }, { val: "[2, 3]", match: true }, { val: "[1, 3]", active: true }, { val: "[3, 4]" }] },
      { line: 12, code: "  return 1; // MINIMUM REMOVALS REQUIRED = 1", vars: { removals: "1", status: "COMPLETE" }, log: "Traversal complete! Minimum interval removals to make remaining non-overlapping: 1.", arrayState: [{ val: "[1, 2]", match: true }, { val: "[2, 3]", match: true }, { val: "[1, 3]" }, { val: "[3, 4]", match: true }] }
    ]
  },

  // ── 42. PRODUCT OF ARRAY EXCEPT SELF ──
  "product of array except self": {
    solutionJS: `function productExceptSelf(nums) {
  let n = nums.length;
  let res = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= suffix;
    suffix *= nums[i];
  }
  return res;
}`,
    solutionPY: `def productExceptSelf(nums):
    n = len(nums)
    res = [1] * n
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= suffix
        suffix *= nums[i]
    return res`,
    solutionCPP: `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, 1);
    int prefix = 1;
    for (int i = 0; i < n; i++) {
        res[i] = prefix;
        prefix *= nums[i];
    }
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        res[i] *= suffix;
        suffix *= nums[i];
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function productExceptSelf(nums = [1, 2, 3, 4]) {", vars: { n: "4" }, log: "Initialize nums = [1, 2, 3, 4]. Prefix & Suffix product passes without division.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }] },
      { line: 5, code: "  prefixPass -> res = [1, 1, 2, 6];", vars: { prefixProducts: "[1, 1, 2, 6]" }, log: "Prefix Product Pass (left to right): res = [1, 1, 2, 6].", arrayState: [{ val: "1" }, { val: "1" }, { val: "2" }, { val: "6" }] },
      { line: 10, code: "  suffixPass -> res = [24, 12, 8, 6];", vars: { finalProductArray: "[24, 12, 8, 6]" }, log: "Suffix Product Pass (right to left): Combine prefix & suffix products -> res = [24, 12, 8, 6].", arrayState: [{ val: "24", match: true }, { val: "12", match: true }, { val: "8", match: true }, { val: "6", match: true }] },
      { line: 14, code: "  return [24, 12, 8, 6]; // PRODUCT EXCEPT SELF COMPLETE", vars: { status: "COMPLETE" }, log: "Product Except Self completed cleanly! Result: [24, 12, 8, 6].", arrayState: [{ val: "24", match: true }, { val: "12", match: true }, { val: "8", match: true }, { val: "6", match: true }] }
    ]
  },

  // ── 43. REARRANGE ARRAY ALTERNATELY ──
  "rearrange array alternately": {
    solutionJS: `function rearrange(arr, n) {
  let maxIdx = n - 1, minIdx = 0;
  let maxElem = arr[n - 1] + 1;
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      arr[i] += (arr[maxIdx] % maxElem) * maxElem;
      maxIdx--;
    } else {
      arr[i] += (arr[minIdx] % maxElem) * maxElem;
      minIdx++;
    }
  }
  for (let i = 0; i < n; i++) {
    arr[i] = Math.floor(arr[i] / maxElem);
  }
  return arr;
}`,
    solutionPY: `def rearrange(arr, n):
    max_idx = n - 1
    min_idx = 0
    max_elem = arr[n - 1] + 1
    for i in range(n):
        if i % 2 == 0:
            arr[i] += (arr[max_idx] % max_elem) * max_elem
            max_idx -= 1
        else:
            arr[i] += (arr[min_idx] % max_elem) * max_elem
            min_idx += 1
    for i in range(n):
        arr[i] //= max_elem
    return arr`,
    solutionCPP: `void rearrange(long long *arr, int n) {
    int maxIdx = n - 1, minIdx = 0;
    long long maxElem = arr[n - 1] + 1;
    for (int i = 0; i < n; i++) {
        if (i % 2 == 0) {
            arr[i] += (arr[maxIdx] % maxElem) * maxElem;
            maxIdx--;
        } else {
            arr[i] += (arr[minIdx] % maxElem) * maxElem;
            minIdx++;
        }
    }
    for (int i = 0; i < n; i++) arr[i] /= maxElem;
}`,
    visualizerSteps: [
      { line: 1, code: "function rearrange(arr = [1, 2, 3, 4, 5, 6]) {", vars: { maxIdx: "5 (val 6)", minIdx: "0 (val 1)" }, log: "Initialize sorted array [1, 2, 3, 4, 5, 6]. Target: Max, Min, 2nd Max, 2nd Min...", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }] },
      { line: 5, code: "  i = 0 (even) -> Pick max (6); maxIdx = 4;", vars: { i: "0", picked: "6 (max)", maxIdx: "4" }, log: "Index 0 (even): Pick max element 6. Result starts [6]. maxIdx becomes 4.", arrayState: [{ val: "6", match: true }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }] },
      { line: 8, code: "  i = 1 (odd) -> Pick min (1); minIdx = 1;", vars: { i: "1", picked: "1 (min)", minIdx: "1" }, log: "Index 1 (odd): Pick min element 1. Result becomes [6, 1]. minIdx becomes 1.", arrayState: [{ val: "6", match: true }, { val: "1", match: true }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }] },
      { line: 5, code: "  i = 2 (even) -> Pick max (5); maxIdx = 3;", vars: { i: "2", picked: "5 (max)", maxIdx: "3" }, log: "Index 2 (even): Pick max element 5. Result becomes [6, 1, 5]. maxIdx becomes 3.", arrayState: [{ val: "6", match: true }, { val: "1", match: true }, { val: "5", match: true }, { val: "4" }, { val: "5" }, { val: "6" }] },
      { line: 14, code: "  return [6, 1, 5, 2, 4, 3]; // ALTERNATING REARRANGE COMPLETE", vars: { result: "[6, 1, 5, 2, 4, 3]", status: "COMPLETE" }, log: "Alternating rearrangement complete in-place! Final result: [6, 1, 5, 2, 4, 3].", arrayState: [{ val: "6", match: true }, { val: "1", match: true }, { val: "5", match: true }, { val: "2", match: true }, { val: "4", match: true }, { val: "3", match: true }] }
    ]
  },

  // ── 44. REMOVE DUPLICATES FROM SORTED ARRAY II ──
  "remove duplicates from sorted array ii": {
    solutionJS: `function removeDuplicates(nums) {
  if (nums.length <= 2) return nums.length;
  let k = 2;
  for (let i = 2; i < nums.length; i++) {
    if (nums[i] !== nums[k - 2]) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
}`,
    solutionPY: `def removeDuplicates(nums):
    if len(nums) <= 2: return len(nums)
    k = 2
    for i in range(2, len(nums)):
        if nums[i] != nums[k - 2]:
            nums[k] = nums[i]
            k += 1
    return k`,
    solutionCPP: `int removeDuplicates(vector<int>& nums) {
    if (nums.size() <= 2) return nums.size();
    int k = 2;
    for (int i = 2; i < nums.size(); i++) {
        if (nums[i] != nums[k - 2]) {
            nums[k++] = nums[i];
        }
    }
    return k;
}`,
    visualizerSteps: [
      { line: 1, code: "function removeDuplicates(nums = [1, 1, 1, 2, 2, 3]) {", vars: { k: "2", n: "6" }, log: "Initialize nums = [1, 1, 1, 2, 2, 3]. Allow at most 2 occurrences per element.", arrayState: [{ val: "1" }, { val: "1" }, { val: "1" }, { val: "2" }, { val: "2" }, { val: "3" }] },
      { line: 5, code: "  nums[2] === nums[0] (1 === 1) -> Skip 3rd 1;", vars: { i: "2", val: "1", k: "2", skipped: "true" }, log: "Inspect index 2 (val 1): 1 === nums[k-2] (1). Duplicate count > 2! Skip element.", arrayState: [{ val: "1", match: true }, { val: "1", match: true }, { val: "1", active: true }, { val: "2" }, { val: "2" }, { val: "3" }] },
      { line: 6, code: "  nums[3] !== nums[0] (2 !== 1) -> nums[2] = 2; k = 3;", vars: { i: "3", val: "2", k: "3", placedAt: "2" }, log: "Inspect index 3 (val 2): 2 !== nums[0] (1). Valid! Place 2 at index 2. Increment k to 3.", arrayState: [{ val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "2" }, { val: "2" }, { val: "3" }] },
      { line: 6, code: "  nums[5] !== nums[3] (3 !== 2) -> nums[4] = 3; k = 5;", vars: { i: "5", val: "3", k: "5", placedAt: "4" }, log: "Inspect index 5 (val 3): Place 3 at index 4. Final valid array length k = 5.", arrayState: [{ val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "3" }] },
      { line: 10, code: "  return 5; // REMOVE DUPLICATES II COMPLETE", vars: { newLength: "5", result: "[1, 1, 2, 2, 3]", status: "COMPLETE" }, log: "Duplicates trimmed to max 2 occurrences! New array length: 5 ([1, 1, 2, 2, 3]).", arrayState: [{ val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "3" }] }
    ]
  },

  // ── 45. SUBARRAYS WITH EQUAL 1S AND 0S ──
  "subarrays with equal 1s and 0s": {
    solutionJS: `function countSubarrWithEqualZeroAndOne(arr, n) {
  let map = new Map();
  map.set(0, 1);
  let count = 0, sum = 0;
  for (let i = 0; i < n; i++) {
    sum += (arr[i] === 0) ? -1 : 1;
    if (map.has(sum)) {
      count += map.get(sum);
    }
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  return count;
}`,
    solutionPY: `def countSubarrWithEqualZeroAndOne(arr, n):
    map = {0: 1}
    count = 0
    curr_sum = 0
    for val in arr:
        curr_sum += -1 if val == 0 else 1
        if curr_sum in map:
            count += map[curr_sum]
        map[curr_sum] = map.get(curr_sum, 0) + 1
    return count`,
    solutionCPP: `int countSubarrWithEqualZeroAndOne(int arr[], int n) {
    unordered_map<int, int> map;
    map[0] = 1;
    int count = 0, sum = 0;
    for (int i = 0; i < n; i++) {
        sum += (arr[i] == 0) ? -1 : 1;
        if (map.count(sum)) {
            count += map[sum];
        }
        map[sum]++;
    }
    return count;
}`,
    visualizerSteps: [
      { line: 1, code: "function countSubarrWithEqualZeroAndOne(arr = [1, 0, 0, 1, 0, 1, 1]) {", vars: { map: "{ 0: 1 }", count: "0", sum: "0" }, log: "Initialize arr = [1, 0, 0, 1, 0, 1, 1]. Transform 0 -> -1 and track prefix sums.", arrayState: [{ val: "1" }, { val: "0" }, { val: "0" }, { val: "1" }, { val: "0" }, { val: "1" }, { val: "1" }] },
      { line: 6, code: "  sum = 0; count += map.get(0) (1) -> count = 1;", vars: { i: "1", val: "0 (-1)", sum: "0", count: "1" }, log: "Index 1 (val 0 -> -1): Prefix sum = 0. Matches map[0]! Subarray [1, 0] has equal 0s & 1s. count = 1.", arrayState: [{ val: "1", match: true }, { val: "0", match: true }, { val: "0" }, { val: "1" }, { val: "0" }, { val: "1" }, { val: "1" }] },
      { line: 6, code: "  sum = 0; count += map.get(0) (2) -> count = 3;", vars: { i: "3", val: "1", sum: "0", count: "3" }, log: "Index 3 (val 1): Prefix sum = 0. Matches map[0] twice! Subarrays [1,0,0,1] & [0,1] matched. count = 3.", arrayState: [{ val: "1", match: true }, { val: "0", match: true }, { val: "0", match: true }, { val: "1", match: true }, { val: "0" }, { val: "1" }, { val: "1" }] },
      { line: 6, code: "  sum = 0; count += map.get(0) (3) -> count = 7;", vars: { i: "5", val: "1", sum: "0", count: "7" }, log: "Index 5 (val 1): Prefix sum = 0. Matches map[0] 3 times! Subarrays [0,1,0,1], [0,1] matched. count = 7.", arrayState: [{ val: "1" }, { val: "0", match: true }, { val: "0", match: true }, { val: "1", match: true }, { val: "0", match: true }, { val: "1", match: true }, { val: "1" }] },
      { line: 11, code: "  return 8; // EQUAL 0S AND 1S SUBARRAYS COMPLETE", vars: { totalSubarrays: "8", status: "COMPLETE" }, log: "Prefix sum hash map sweep complete! Total subarrays with equal 0s and 1s: 8.", arrayState: [{ val: "1", match: true }, { val: "0", match: true }, { val: "0", match: true }, { val: "1", match: true }, { val: "0", match: true }, { val: "1", match: true }, { val: "1", match: true }] }
    ]
  },

  // ── 46. THE CELEBRITY PROBLEM ──
  "the celebrity problem": {
    solutionJS: `function celebrity(M, n) {
  let i = 0, j = n - 1;
  while (i < j) {
    if (M[i][j] === 1) i++;
    else j--;
  }
  let c = i;
  for (let k = 0; k < n; k++) {
    if (k !== c && (M[c][k] === 1 || M[k][c] === 0)) return -1;
  }
  return c;
}`,
    solutionPY: `def celebrity(M, n):
    i, j = 0, n - 1
    while i < j:
        if M[i][j] == 1:
            i += 1
        else:
            j -= 1
    c = i
    for k in range(n):
        if k != c and (M[c][k] == 1 or M[k][c] == 0):
            return -1
    return c`,
    solutionCPP: `int celebrity(vector<vector<int> >& M, int n) {
    int i = 0, j = n - 1;
    while (i < j) {
        if (M[i][j] == 1) i++;
        else j--;
    }
    int c = i;
    for (int k = 0; k < n; k++) {
        if (k != c && (M[c][k] == 1 || M[k][c] == 0)) return -1;
    }
    return c;
}`,
    visualizerSteps: [
      { line: 1, code: "function celebrity(M = [[0,1,0],[0,0,0],[0,1,0]], n = 3) {", vars: { i: "0", j: "2" }, log: "Initialize 3x3 acquaintance matrix M. Eliminate non-celebrity candidates.", arrayState: [{ val: "Person 0" }, { val: "Person 1" }, { val: "Person 2" }] },
      { line: 4, code: "  M[0][2] === 0 -> 0 doesn't know 2 -> 2 is NOT celebrity; j = 1;", vars: { i: "0", j: "1", test: "M[0][2] == 0" }, log: "M[0][2] === 0: Person 0 doesn't know Person 2. Person 2 cannot be celebrity. Decrement j to 1.", arrayState: [{ val: "Person 0" }, { val: "Person 1" }, { val: "Person 2" }] },
      { line: 3, code: "  M[0][1] === 1 -> 0 knows 1 -> 0 is NOT celebrity; i = 1;", vars: { i: "1", j: "1", candidate: "Person 1" }, log: "M[0][1] === 1: Person 0 knows Person 1. Person 0 cannot be celebrity. Increment i to 1.", arrayState: [{ val: "Person 0" }, { val: "Person 1", active: true }, { val: "Person 2" }] },
      { line: 8, code: "  Verify candidate 1: row 1 is all 0s & col 1 is all 1s -> CELEBRITY FOUND!", vars: { candidate: "Person 1", knowsAnyone: "false", knownByEveryone: "true" }, log: "Verification: Candidate Person 1 knows nobody (row 1 = [0,0,0]) and everyone knows Person 1! Celebrity = 1!", arrayState: [{ val: "Person 0" }, { val: "Celebrity 1", match: true }, { val: "Person 2" }] },
      { line: 11, code: "  return 1; // CELEBRITY PROBLEM COMPLETE", vars: { celebrityIndex: "1", status: "COMPLETE" }, log: "Celebrity elimination & verification complete! Celebrity index is 1.", arrayState: [{ val: "Person 0" }, { val: "Celebrity 1", match: true }, { val: "Person 2" }] }
    ]
  },

  // ── 47. TOP K FREQUENT ELEMENTS ──
  "top k frequent elements": {
    solutionJS: `function topKFrequent(nums, k) {
  let map = new Map();
  for (let num of nums) {
    map.set(num, (map.get(num) || 0) + 1);
  }
  let bucket = Array.from({ length: nums.length + 1 }, () => []);
  for (let [num, freq] of map) {
    bucket[freq].push(num);
  }
  let result = [];
  for (let i = bucket.length - 1; i >= 0 && result.length < k; i--) {
    if (bucket[i].length > 0) {
      result.push(...bucket[i]);
    }
  }
  return result.slice(0, k);
}`,
    solutionPY: `import collections
def topKFrequent(nums, k):
    count = collections.Counter(nums)
    return [item for item, freq in count.most_common(k)]`,
    solutionCPP: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> map;
    for (int num : nums) map[num]++;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    for (auto& p : map) {
        pq.push({p.second, p.first});
        if (pq.size() > k) pq.pop();
    }
    vector<int> result;
    while (!pq.empty()) {
        result.push_back(pq.top().second); pq.pop();
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function topKFrequent(nums = [1, 1, 1, 2, 2, 3], k = 2) {", vars: { k: "2", map: "{}" }, log: "Initialize nums = [1, 1, 1, 2, 2, 3], k = 2. O(N) Bucket Sort frequency counting.", arrayState: [{ val: "1" }, { val: "1" }, { val: "1" }, { val: "2" }, { val: "2" }, { val: "3" }] },
      { line: 4, code: "  map -> { 1: 3, 2: 2, 3: 1 };", vars: { frequencies: "{ 1: 3, 2: 2, 3: 1 }" }, log: "Count frequency: Element 1 appears 3x, Element 2 appears 2x, Element 3 appears 1x.", arrayState: [{ val: "1", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "3" }] },
      { line: 12, code: "  pick top 2 frequencies -> [1, 2]", vars: { k: "2", topElements: "[1, 2]" }, log: "Bucket Sort selection: Pick top 2 most frequent elements: [1, 2].", arrayState: [{ val: "1", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "3" }] },
      { line: 16, code: "  return [1, 2]; // TOP K FREQUENT COMPLETE", vars: { result: "[1, 2]", status: "COMPLETE" }, log: "Top K Frequent Elements selection complete! Result: [1, 2].", arrayState: [{ val: "1", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "3" }] }
    ]
  },

  // ── 48. VALID SUDOKU ──
  "valid sudoku": {
    solutionJS: `function isValidSudoku(board) {
  let rows = Array.from({ length: 9 }, () => new Set());
  let cols = Array.from({ length: 9 }, () => new Set());
  let boxes = Array.from({ length: 9 }, () => new Set());
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let val = board[r][c];
      if (val === '.') continue;
      let b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if (rows[r].has(val) || cols[c].has(val) || boxes[b].has(val)) return false;
      rows[r].add(val);
      cols[c].add(val);
      boxes[b].add(val);
    }
  }
  return true;
}`,
    solutionPY: `def isValidSudoku(board):
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    for r in range(9):
        for c in range(9):
            val = board[r][c]
            if val == '.': continue
            b = (r // 3) * 3 + (c // 3)
            if val in rows[r] or val in cols[c] or val in boxes[b]:
                return False
            rows[r].add(val)
            cols[c].add(val)
            boxes[b].add(val)
    return True`,
    solutionCPP: `bool isValidSudoku(vector<vector<char>>& board) {
    vector<unordered_set<char>> rows(9), cols(9), boxes(9);
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            char val = board[r][c];
            if (val == '.') continue;
            int b = (r / 3) * 3 + (c / 3);
            if (rows[r].count(val) || cols[c].count(val) || boxes[b].count(val)) return false;
            rows[r].insert(val);
            cols[c].insert(val);
            boxes[b].insert(val);
        }
    }
    return true;
}`,
    visualizerSteps: [
      { line: 1, code: "function isValidSudoku(board = 9x9 matrix) {", vars: { rows: "9 sets", cols: "9 sets", boxes: "9 sets" }, log: "Initialize 9x9 Sudoku board. Validate Row, Column, and 3x3 Sub-box constraints.", arrayState: [{ val: "Row 0: 5, 3, 7" }, { val: "Col 0: 5, 6, 8" }, { val: "Box 0: 5, 3, 6, 9, 8" }] },
      { line: 10, code: "  validate Cell (0, 0) = '5': row 0, col 0, box 0 valid!", vars: { r: "0", c: "0", val: "'5'", valid: "true" }, log: "Inspect (0,0) val '5': No duplicate in Row 0, Col 0, or Box 0. Add to sets.", arrayState: [{ val: "5", match: true }, { val: "3" }, { val: "7" }] },
      { line: 10, code: "  validate Cell (0, 1) = '3': row 0, col 1, box 0 valid!", vars: { r: "0", c: "1", val: "'3'", valid: "true" }, log: "Inspect (0,1) val '3': No duplicate in Row 0, Col 1, or Box 0. Add to sets.", arrayState: [{ val: "5", match: true }, { val: "3", match: true }, { val: "7" }] },
      { line: 16, code: "  return true; // VALID SUDOKU BOARD", vars: { isValid: "true", status: "VALID" }, log: "Sudoku validation complete! All 81 cells satisfy row, col, and box constraints. Board is valid!", arrayState: [{ val: "5", match: true }, { val: "3", match: true }, { val: "7", match: true }] }
    ]
  },

  // ── 49. PERMUTATIONS OF A GIVEN STRING ──
  "permutations of a given string": {
    solutionJS: `function findPermutation(s) {
  let result = new Set();
  function backtrack(curr, remaining) {
    if (remaining.length === 0) {
      result.add(curr);
      return;
    }
    for (let i = 0; i < remaining.length; i++) {
      backtrack(curr + remaining[i], remaining.slice(0, i) + remaining.slice(i + 1));
    }
  }
  backtrack('', s);
  return Array.from(result).sort();
}`,
    solutionPY: `def find_permutation(s):
    from itertools import permutations
    perm = sorted(list(set(["".join(p) for p in permutations(s)])))
    return perm`,
    solutionCPP: `vector<string> find_permutation(string S) {
    vector<string> ans;
    sort(S.begin(), S.end());
    do {
        ans.push_back(S);
    } while (next_permutation(S.begin(), S.end()));
    return ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function findPermutation(s = 'ABC') {", vars: { s: "'ABC'", count: "0" }, log: "Initialize string 'ABC'. Backtracking state tree search for unique permutations.", arrayState: [{ val: "A" }, { val: "B" }, { val: "C" }] },
      { line: 6, code: "  backtrack('A', 'BC') -> 'AB' -> 'ABC'", vars: { path: "'ABC'", len: "3" }, log: "Branch 1: Pick 'A' -> Pick 'B' -> Pick 'C'. Generated permutation 'ABC'.", arrayState: [{ val: "A", match: true }, { val: "B", match: true }, { val: "C", match: true }] },
      { line: 6, code: "  backtrack('A', 'CB') -> 'AC' -> 'ACB'", vars: { path: "'ACB'", len: "3" }, log: "Branch 2: Backtrack to 'A' -> Pick 'C' -> Pick 'B'. Generated permutation 'ACB'.", arrayState: [{ val: "A", match: true }, { val: "C", match: true }, { val: "B", match: true }] },
      { line: 11, code: "  return ['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA'];", vars: { totalPermutations: "6", status: "COMPLETE" }, log: "Backtracking tree traversal complete! 6 unique sorted permutations: ['ABC', 'ACB', 'BAC', 'BCA', 'CAB', 'CBA'].", arrayState: [{ val: "ABC", match: true }, { val: "ACB", match: true }, { val: "BAC", match: true }, { val: "BCA", match: true }, { val: "CAB", match: true }, { val: "CBA", match: true }] }
    ]
  },

  // ── 50. ANAGRAM ──
  "anagram": {
    solutionJS: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  let freq = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    freq[s.charCodeAt(i) - 97]++;
    freq[t.charCodeAt(i) - 97]--;
  }
  return freq.every(count => count === 0);
}`,
    solutionPY: `def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t): return False
    count = {}
    for ch in s: count[ch] = count.get(ch, 0) + 1
    for ch in t:
        if ch not in count or count[ch] == 0: return False
        count[ch] -= 1
    return True`,
    solutionCPP: `bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;
    vector<int> freq(26, 0);
    for (int i = 0; i < s.length(); i++) {
        freq[s[i] - 'a']++;
        freq[t[i] - 'a']--;
    }
    for (int c : freq) if (c != 0) return false;
    return true;
}`,
    visualizerSteps: [
      { line: 1, code: "function isAnagram(s = 'listen', t = 'silent') {", vars: { lenS: "6", lenT: "6" }, log: "Initialize s = 'listen', t = 'silent'. O(N) frequency array comparison.", arrayState: [{ val: "l" }, { val: "i" }, { val: "s" }, { val: "t" }, { val: "e" }, { val: "n" }] },
      { line: 5, code: "  freq pass s -> l:1, i:1, s:1, t:1, e:1, n:1;", vars: { freqS: "l:1, i:1, s:1, t:1, e:1, n:1" }, log: "Count frequency of 'listen': All 6 characters have count 1.", arrayState: [{ val: "l", active: true }, { val: "i", active: true }, { val: "s", active: true }, { val: "t", active: true }, { val: "e", active: true }, { val: "n", active: true }] },
      { line: 6, code: "  freq pass t -> s:0, i:0, l:0, e:0, n:0, t:0;", vars: { freqT: "All counts 0" }, log: "Decrement frequency with 'silent': All character counts match perfectly to 0!", arrayState: [{ val: "l", match: true }, { val: "i", match: true }, { val: "s", match: true }, { val: "t", match: true }, { val: "e", match: true }, { val: "n", match: true }] },
      { line: 8, code: "  return true; // VALID ANAGRAM!", vars: { isAnagram: "true", status: "COMPLETE" }, log: "All character frequencies are 0! 'silent' is an authentic valid anagram of 'listen'.", arrayState: [{ val: "l", match: true }, { val: "i", match: true }, { val: "s", match: true }, { val: "t", match: true }, { val: "e", match: true }, { val: "n", match: true }] }
    ]
  },

  // ── 51. CONVERT TO ROMAN NO ──
  "convert to roman no": {
    solutionJS: `function convertToRoman(n) {
  const map = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
  ];
  let res = "";
  for (let [val, sym] of map) {
    while (n >= val) {
      res += sym;
      n -= val;
    }
  }
  return res;
}`,
    solutionPY: `def convertToRoman(n):
    val_map = [
        (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
        (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
        (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")
    ]
    res = ""
    for val, sym in val_map:
        while n >= val:
            res += sym
            n -= val
    return res`,
    solutionCPP: `string convertToRoman(int n) {
    pair<int, string> map[] = {
        {1000, "M"}, {900, "CM"}, {500, "D"}, {400, "CD"},
        {100, "C"}, {90, "XC"}, {50, "L"}, {40, "XL"},
        {10, "X"}, {9, "IX"}, {5, "V"}, {4, "IV"}, {1, "I"}
    };
    string res = "";
    for (auto& p : map) {
        while (n >= p.first) {
            res += p.second;
            n -= p.first;
        }
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function convertToRoman(n = 3549) {", vars: { n: "3549", roman: "''" }, log: "Initialize number 3549. Greedy subtraction using Roman numeral symbols.", arrayState: [{ val: "3000" }, { val: "500" }, { val: "40" }, { val: "9" }] },
      { line: 9, code: "  n -= 3000 -> 'MMM' (rem 549)", vars: { n: "549", roman: "'MMM'" }, log: "Subtract 3000 (3x 1000 'M'): roman = 'MMM', remaining = 549.", arrayState: [{ val: "MMM", match: true }, { val: "500" }, { val: "40" }, { val: "9" }] },
      { line: 9, code: "  n -= 500 -> 'MMMD' (rem 49)", vars: { n: "49", roman: "'MMMD'" }, log: "Subtract 500 (1x 500 'D'): roman = 'MMMD', remaining = 49.", arrayState: [{ val: "MMM", match: true }, { val: "D", match: true }, { val: "40" }, { val: "9" }] },
      { line: 9, code: "  n -= 40 -> 'MMMDXL' (rem 9)", vars: { n: "9", roman: "'MMMDXL'" }, log: "Subtract 40 (1x 40 'XL'): roman = 'MMMDXL', remaining = 9.", arrayState: [{ val: "MMM", match: true }, { val: "D", match: true }, { val: "XL", match: true }, { val: "9" }] },
      { line: 13, code: "  return 'MMMDCCCXLIX'; // CONVERT TO ROMAN COMPLETE", vars: { romanNumeral: "'MMMDCCCXLIX'", status: "COMPLETE" }, log: "Subtract 9 ('IX'): Final Roman numeral string: 'MMMDCCCXLIX'!", arrayState: [{ val: "MMM", match: true }, { val: "D", match: true }, { val: "XL", match: true }, { val: "IX", match: true }] }
    ]
  },

  // ── 52. FIND THE INDEX OF THE FIRST OCCURRENCE IN A STRING ──
  "find the index of the first occurrence in a string": {
    solutionJS: `function strStr(haystack, needle) {
  if (needle.length === 0) return 0;
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    if (haystack.substring(i, i + needle.length) === needle) {
      return i;
    }
  }
  return -1;
}`,
    solutionPY: `def strStr(haystack: str, needle: str) -> int:
    return haystack.find(needle)`,
    solutionCPP: `int strStr(string haystack, string needle) {
    if (needle.empty()) return 0;
    int n = haystack.length(), m = needle.length();
    for (int i = 0; i <= n - m; i++) {
        if (haystack.substr(i, m) == needle) return i;
    }
    return -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function strStr(haystack = 'sadbutsad', needle = 'sad') {", vars: { haystack: "'sadbutsad'", needle: "'sad'" }, log: "Initialize haystack = 'sadbutsad', needle = 'sad'. Sliding window substring matching.", arrayState: [{ val: "s" }, { val: "a" }, { val: "d" }, { val: "b" }, { val: "u" }, { val: "t" }, { val: "s" }, { val: "a" }, { val: "d" }] },
      { line: 4, code: "  haystack.substr(0, 3) === 'sad' -> MATCH AT INDEX 0!", vars: { i: "0", sub: "'sad'", needle: "'sad'" }, log: "Index 0: Substring haystack[0..2] is 'sad'. Exact match with needle 'sad'!", arrayState: [{ val: "s", match: true }, { val: "a", match: true }, { val: "d", match: true }, { val: "b" }, { val: "u" }, { val: "t" }, { val: "s" }, { val: "a" }, { val: "d" }] },
      { line: 5, code: "  return 0; // FIRST OCCURRENCE INDEX = 0", vars: { matchIndex: "0", status: "COMPLETE" }, log: "First occurrence of 'sad' found at index 0. Return 0.", arrayState: [{ val: "s", match: true }, { val: "a", match: true }, { val: "d", match: true }, { val: "b" }, { val: "u" }, { val: "t" }, { val: "s" }, { val: "a" }, { val: "d" }] }
    ]
  },

  // ── 53. LENGTH OF LAST WORD ──
  "length of last word": {
    solutionJS: `function lengthOfLastWord(s) {
  let len = 0;
  let i = s.length - 1;
  while (i >= 0 && s[i] === ' ') i--;
  while (i >= 0 && s[i] !== ' ') {
    len++;
    i--;
  }
  return len;
}`,
    solutionPY: `def lengthOfLastWord(s: str) -> int:
    words = s.strip().split()
    return len(words[-1]) if words else 0`,
    solutionCPP: `int lengthOfLastWord(string s) {
    int len = 0, i = s.length() - 1;
    while (i >= 0 && s[i] == ' ') i--;
    while (i >= 0 && s[i] != ' ') {
        len++; i--;
    }
    return len;
}`,
    visualizerSteps: [
      { line: 1, code: "function lengthOfLastWord(s = '   fly me   to   the moon  ') {", vars: { s: "'   fly me   to   the moon  '" }, log: "Initialize string '   fly me   to   the moon  '. Backwards pointer scanning.", arrayState: [{ val: "t" }, { val: "h" }, { val: "e" }, { val: " " }, { val: "m" }, { val: "o" }, { val: "o" }, { val: "n" }, { val: " " }, { val: " " }] },
      { line: 4, code: "  skip trailing spaces -> idx = 7 ('n');", vars: { i: "7", char: "'n'" }, log: "Skip 2 trailing spaces. Pointer lands at index 7 ('n').", arrayState: [{ val: "t" }, { val: "h" }, { val: "e" }, { val: " " }, { val: "m" }, { val: "o" }, { val: "o" }, { val: "n", active: true }, { val: " " }, { val: " " }] },
      { line: 5, code: "  count word 'moon' -> len = 4;", vars: { word: "'moon'", len: "4" }, log: "Count characters in last word 'moon' backwards until space: 'n', 'o', 'o', 'm'. Length = 4.", arrayState: [{ val: "t" }, { val: "h" }, { val: "e" }, { val: " " }, { val: "m", match: true }, { val: "o", match: true }, { val: "o", match: true }, { val: "n", match: true }, { val: " " }, { val: " " }] },
      { line: 9, code: "  return 4; // LENGTH OF LAST WORD = 4", vars: { lastWordLength: "4", status: "COMPLETE" }, log: "Last word is 'moon' with length 4. Return 4.", arrayState: [{ val: "t" }, { val: "h" }, { val: "e" }, { val: " " }, { val: "m", match: true }, { val: "o", match: true }, { val: "o", match: true }, { val: "n", match: true }, { val: " " }, { val: " " }] }
    ]
  },

  // ── 54. LONGEST COMMON PREFIX ──
  "longest common prefix": {
    solutionJS: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (!prefix) return "";
    }
  }
  return prefix;
}`,
    solutionPY: `def longestCommonPrefix(strs: List[str]) -> str:
    if not strs: return ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix: return ""
    return prefix`,
    solutionCPP: `string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    string prefix = strs[0];
    for (int i = 1; i < strs.size(); i++) {
        while (strs[i].find(prefix) != 0) {
            prefix = prefix.substr(0, prefix.length() - 1);
            if (prefix.empty()) return "";
        }
    }
    return prefix;
}`,
    visualizerSteps: [
      { line: 1, code: "function longestCommonPrefix(strs = ['flower', 'flow', 'flight']) {", vars: { strs: "['flower', 'flow', 'flight']", prefix: "'flower'" }, log: "Initialize strings ['flower', 'flow', 'flight']. Start with prefix = 'flower'.", arrayState: [{ val: "flower" }, { val: "flow" }, { val: "flight" }] },
      { line: 5, code: "  prefix = 'flower' -> trim with 'flow' -> 'flow';", vars: { compare: "'flow'", prefix: "'flow'" }, log: "Compare with 'flow': Shorten prefix from 'flower' -> 'flow'. 'flow' starts 'flow'.", arrayState: [{ val: "flower" }, { val: "flow", active: true }, { val: "flight" }] },
      { line: 5, code: "  prefix = 'flow' -> trim with 'flight' -> 'fl';", vars: { compare: "'flight'", prefix: "'fl'" }, log: "Compare with 'flight': Shorten prefix 'flow' -> 'flo' -> 'fl'. 'flight' starts with 'fl'.", arrayState: [{ val: "flower" }, { val: "flow" }, { val: "flight", active: true }] },
      { line: 9, code: "  return 'fl'; // LONGEST COMMON PREFIX = 'fl'", vars: { longestPrefix: "'fl'", status: "COMPLETE" }, log: "Horizontal character comparison complete! Longest common prefix: 'fl'.", arrayState: [{ val: "fl", match: true }, { val: "fl", match: true }, { val: "fl", match: true }] }
    ]
  },

  // ── 55. REVERSE WORDS IN A GIVEN STRING ──
  "reverse words in a given string": {
    solutionJS: `function reverseWords(s) {
  let parts = s.includes('.') ? s.split('.') : s.trim().split(/\s+/);
  return parts.reverse().join(s.includes('.') ? '.' : ' ');
}`,
    solutionPY: `def reverseWords(s: str) -> str:
    if '.' in s:
        parts = s.split('.')
        return '.'.join(parts[::-1])
    else:
        return ' '.join(s.split()[::-1])`,
    solutionCPP: `string reverseWords(string s) {
    bool dot = (s.find('.') != string::npos);
    char delim = dot ? '.' : ' ';
    stringstream ss(s);
    string word, ans = "";
    vector<string> words;
    while (getline(ss, word, delim)) {
        if (!word.empty()) words.push_back(word);
    }
    for (int i = words.size() - 1; i >= 0; i--) {
        ans += words[i] + (i > 0 ? string(1, delim) : "");
    }
    return ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function reverseWords(s = 'i.like.this.program.very.much') {", vars: { s: "'i.like.this.program.very.much'" }, log: "Initialize string 'i.like.this.program.very.much'. Tokenize by delimiter '.' and reverse.", arrayState: [{ val: "i" }, { val: "like" }, { val: "this" }, { val: "program" }, { val: "very" }, { val: "much" }] },
      { line: 2, code: "  split('.') -> ['i', 'like', 'this', 'program', 'very', 'much'];", vars: { tokens: "['i', 'like', 'this', 'program', 'very', 'much']" }, log: "Split string by '.': 6 word tokens extracted.", arrayState: [{ val: "i" }, { val: "like" }, { val: "this" }, { val: "program" }, { val: "very" }, { val: "much" }] },
      { line: 3, code: "  reverse() -> ['much', 'very', 'program', 'this', 'like', 'i'];", vars: { reversedTokens: "['much', 'very', 'program', 'this', 'like', 'i']" }, log: "Reverse token array: ['much', 'very', 'program', 'this', 'like', 'i'].", arrayState: [{ val: "much", match: true }, { val: "very", match: true }, { val: "program", match: true }, { val: "this", match: true }, { val: "like", match: true }, { val: "i", match: true }] },
      { line: 4, code: "  return 'much.very.program.this.like.i'; // REVERSE WORDS COMPLETE", vars: { reversedString: "'much.very.program.this.like.i'", status: "COMPLETE" }, log: "Join reversed tokens with '.': Result 'much.very.program.this.like.i'!", arrayState: [{ val: "much", match: true }, { val: "very", match: true }, { val: "program", match: true }, { val: "this", match: true }, { val: "like", match: true }, { val: "i", match: true }] }
    ]
  },

  // ── 56. ROMAN NUMBER TO INTEGER (GFG) ──
  "roman number to integer (gfg)": {
    solutionJS: `function romanToDecimal(s) {
  const map = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    let curr = map[s[i]];
    let next = map[s[i + 1]];
    if (next && curr < next) {
      total -= curr;
    } else {
      total += curr;
    }
  }
  return total;
}`,
    solutionPY: `def romanToDecimal(s):
    roman = {'I':1, 'V':5, 'X':10, 'L':50, 'C':100, 'D':500, 'M':1000}
    ans = 0
    for i in range(len(s)):
        if i + 1 < len(s) and roman[s[i]] < roman[s[i+1]]:
            ans -= roman[s[i]]
        else:
            ans += roman[s[i]]
    return ans`,
    solutionCPP: `int romanToDecimal(string &s) {
    unordered_map<char, int> map = {{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};
    int ans = 0;
    for (int i = 0; i < s.length(); i++) {
        if (i + 1 < s.length() && map[s[i]] < map[s[i+1]]) ans -= map[s[i]];
        else ans += map[s[i]];
    }
    return ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function romanToDecimal(s = 'MCMXCIV') {", vars: { s: "'MCMXCIV'", total: "0" }, log: "Initialize Roman string 'MCMXCIV' (1994). Value map & subtractive pair check.", arrayState: [{ val: "M" }, { val: "C" }, { val: "M" }, { val: "X" }, { val: "C" }, { val: "I" }, { val: "V" }] },
      { line: 7, code: "  C (100) < M (1000) -> total -= 100;", vars: { i: "1", char: "'C'", next: "'M'", total: "900" }, log: "Index 1 ('C' val 100) < next ('M' val 1000): Subtractive pair! total = 1000 - 100 = 900.", arrayState: [{ val: "M", match: true }, { val: "C", active: true }, { val: "M", active: true }, { val: "X" }, { val: "C" }, { val: "I" }, { val: "V" }] },
      { line: 7, code: "  X (10) < C (100) -> total -= 10;", vars: { i: "3", char: "'X'", next: "'C'", total: "1890" }, log: "Index 3 ('X' val 10) < next ('C' val 100): Subtractive pair! total = 1900 - 10 = 1890.", arrayState: [{ val: "M", match: true }, { val: "C", match: true }, { val: "M", match: true }, { val: "X", active: true }, { val: "C", active: true }, { val: "I" }, { val: "V" }] },
      { line: 13, code: "  return 1994; // ROMAN TO DECIMAL COMPLETE", vars: { decimalValue: "1994", status: "COMPLETE" }, log: "Conversion complete! Roman numeral 'MCMXCIV' equals integer 1994.", arrayState: [{ val: "M", match: true }, { val: "C", match: true }, { val: "M", match: true }, { val: "X", match: true }, { val: "C", match: true }, { val: "I", match: true }, { val: "V", match: true }] }
    ]
  },
  "roman number to integer": {
    solutionJS: `function romanToDecimal(s) {
  const map = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    let curr = map[s[i]];
    let next = map[s[i + 1]];
    if (next && curr < next) total -= curr;
    else total += curr;
  }
  return total;
}`,
    solutionPY: `def romanToDecimal(s):
    roman = {'I':1, 'V':5, 'X':10, 'L':50, 'C':100, 'D':500, 'M':1000}
    ans = 0
    for i in range(len(s)):
        if i + 1 < len(s) and roman[s[i]] < roman[s[i+1]]: ans -= roman[s[i]]
        else: ans += roman[s[i]]
    return ans`,
    solutionCPP: `int romanToDecimal(string &s) {
    unordered_map<char, int> map = {{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};
    int ans = 0;
    for (int i = 0; i < s.length(); i++) {
        if (i + 1 < s.length() && map[s[i]] < map[s[i+1]]) ans -= map[s[i]];
        else ans += map[s[i]];
    }
    return ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function romanToDecimal(s = 'IX') {", vars: { s: "'IX'", total: "0" }, log: "Initialize Roman string 'IX' (9). Value map & subtractive pair check.", arrayState: [{ val: "I" }, { val: "X" }] },
      { line: 6, code: "  I (1) < X (10) -> total -= 1;", vars: { i: "0", char: "'I'", next: "'X'", total: "-1" }, log: "'I' (1) < 'X' (10): Subtractive pair! total = -1.", arrayState: [{ val: "I", active: true }, { val: "X", active: true }] },
      { line: 7, code: "  total += 10 -> total = 9;", vars: { total: "9" }, log: "'X' (10): total = -1 + 10 = 9.", arrayState: [{ val: "I", match: true }, { val: "X", match: true }] },
      { line: 9, code: "  return 9; // COMPLETE", vars: { decimalValue: "9", status: "COMPLETE" }, log: "Conversion complete! Roman numeral 'IX' equals integer 9.", arrayState: [{ val: "I", match: true }, { val: "X", match: true }] }
    ]
  },

  // ── 57. VALID ANAGRAM ──
  "valid anagram": {
    solutionJS: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  let freq = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    freq[s.charCodeAt(i) - 97]++;
    freq[t.charCodeAt(i) - 97]--;
  }
  return freq.every(count => count === 0);
}`,
    solutionPY: `def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t): return False
    count = {}
    for ch in s: count[ch] = count.get(ch, 0) + 1
    for ch in t:
        if ch not in count or count[ch] == 0: return False
        count[ch] -= 1
    return True`,
    solutionCPP: `bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;
    vector<int> freq(26, 0);
    for (int i = 0; i < s.length(); i++) {
        freq[s[i] - 'a']++;
        freq[t[i] - 'a']--;
    }
    for (int c : freq) if (c != 0) return false;
    return true;
}`,
    visualizerSteps: [
      { line: 1, code: "function isAnagram(s = 'anagram', t = 'nagaram') {", vars: { lenS: "7", lenT: "7" }, log: "Initialize s = 'anagram', t = 'nagaram'. O(N) character frequency tracking.", arrayState: [{ val: "a" }, { val: "n" }, { val: "a" }, { val: "g" }, { val: "r" }, { val: "a" }, { val: "m" }] },
      { line: 5, code: "  freq pass s -> a:3, n:1, g:1, r:1, m:1;", vars: { freqS: "a:3, n:1, g:1, r:1, m:1" }, log: "Count frequency of 'anagram': 3 'a's, 1 'n', 1 'g', 1 'r', 1 'm'.", arrayState: [{ val: "a", active: true }, { val: "n", active: true }, { val: "a", active: true }, { val: "g", active: true }, { val: "r", active: true }, { val: "a", active: true }, { val: "m", active: true }] },
      { line: 6, code: "  freq pass t -> all counts 0;", vars: { freqT: "All counts 0" }, log: "Decrement frequency with 'nagaram': All character counts match to 0!", arrayState: [{ val: "a", match: true }, { val: "n", match: true }, { val: "a", match: true }, { val: "g", match: true }, { val: "r", match: true }, { val: "a", match: true }, { val: "m", match: true }] },
      { line: 8, code: "  return true; // VALID ANAGRAM!", vars: { isAnagram: "true", status: "COMPLETE" }, log: "All character frequencies are 0! 'nagaram' is a valid anagram of 'anagram'.", arrayState: [{ val: "a", match: true }, { val: "n", match: true }, { val: "a", match: true }, { val: "g", match: true }, { val: "r", match: true }, { val: "a", match: true }, { val: "m", match: true }] }
    ]
  },

  // ── 58. VALID PALINDROME ──
  "valid palindrome": {
    solutionJS: `function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++; right--;
  }
  return true;
}`,
    solutionPY: `def isPalindrome(s: str) -> bool:
    clean = [ch.lower() for ch in s if ch.isalnum()]
    return clean == clean[::-1]`,
    solutionCPP: `bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;
        if (tolower(s[left]) != tolower(s[right])) return false;
        left++; right--;
    }
    return true;
}`,
    visualizerSteps: [
      { line: 1, code: "function isPalindrome(s = 'A man, a plan, a canal: Panama') {", vars: { original: "'A man, a plan, a canal: Panama'" }, log: "Initialize string. Clean non-alphanumeric characters and convert to lowercase.", arrayState: [{ val: "A" }, { val: "m" }, { val: "a" }, { val: "n" }, { val: "," }, { val: "a" }, { val: "p" }, { val: "l" }, { val: "a" }, { val: "n" }] },
      { line: 2, code: "  clean -> 'amanaplanacanalpanama';", vars: { cleanStr: "'amanaplanacanalpanama'", len: "21" }, log: "Cleaned alphanumeric string: 'amanaplanacanalpanama'. 2-pointer outer check.", arrayState: [{ val: "a" }, { val: "m" }, { val: "a" }, { val: "n" }, { val: "a" }, { val: "p" }, { val: "l" }, { val: "a" }, { val: "n" }, { val: "a" }] },
      { line: 5, code: "  s[0] ('a') === s[20] ('a') -> left++, right--;", vars: { left: "0 ('a')", right: "20 ('a')" }, log: "Pointer check: Left 'a' (idx 0) === Right 'a' (idx 20). Match! Advance pointers.", arrayState: [{ val: "a", match: true }, { val: "m" }, { val: "a" }, { val: "n" }, { val: "a" }, { val: "p" }, { val: "l" }, { val: "a" }, { val: "n" }, { val: "a", match: true }] },
      { line: 8, code: "  return true; // VALID PALINDROME!", vars: { isPalindrome: "true", status: "COMPLETE" }, log: "All character pairs match symmetrically! 'A man, a plan, a canal: Panama' is a valid palindrome!", arrayState: [{ val: "a", match: true }, { val: "m", match: true }, { val: "a", match: true }, { val: "n", match: true }, { val: "a", match: true }, { val: "p", match: true }, { val: "l", match: true }, { val: "a", match: true }, { val: "n", match: true }, { val: "a", match: true }] }
    ]
  },

  // ── 59. ENCODE AND DECODE STRINGS ──
  "encode and decode strings": {
    solutionJS: `function encode(strs) {
  return strs.map(s => s.length + '#' + s).join('');
}
function decode(s) {
  let result = [], i = 0;
  while (i < s.length) {
    let j = i;
    while (s[j] !== '#') j++;
    let len = parseInt(s.substring(i, j));
    result.push(s.substring(j + 1, j + 1 + len));
    i = j + 1 + len;
  }
  return result;
}`,
    solutionPY: `def encode(strs: List[str]) -> str:
    return "".join(f"{len(s)}#{s}" for s in strs)

def decode(s: str) -> List[str]:
    res, i = [], 0
    while i < len(s):
        j = s.find("#", i)
        length = int(s[i:j])
        res.append(s[j + 1 : j + 1 + length])
        i = j + 1 + length
    return res`,
    solutionCPP: `string encode(vector<string>& strs) {
    string encoded = "";
    for (string s : strs) encoded += to_string(s.length()) + "#" + s;
    return encoded;
}
vector<string> decode(string s) {
    vector<string> result;
    int i = 0;
    while (i < s.length()) {
        int j = s.find('#', i);
        int len = stoi(s.substr(i, j - i));
        result.push_back(s.substr(j + 1, len));
        i = j + 1 + len;
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function encode(strs = ['neet', 'code']) {", vars: { strs: "['neet', 'code']" }, log: "Initialize string list ['neet', 'code']. Format length + '#' + string.", arrayState: [{ val: "neet" }, { val: "code" }] },
      { line: 2, code: "  encode -> '4#neet4#code';", vars: { encodedString: "'4#neet4#code'" }, log: "Encoded result: '4#neet4#code'.", arrayState: [{ val: "4#neet", match: true }, { val: "4#code", match: true }] },
      { line: 9, code: "  decode('4#neet4#code') -> extract 'neet', then 'code';", vars: { len1: "4", val1: "'neet'", len2: "4", val2: "'code'" }, log: "Decode pass: Read 4 before '#' -> extract 'neet'. Read 4 before '#' -> extract 'code'.", arrayState: [{ val: "neet", match: true }, { val: "code", match: true }] },
      { line: 13, code: "  return ['neet', 'code']; // ENCODE & DECODE COMPLETE", vars: { decodedList: "['neet', 'code']", status: "COMPLETE" }, log: "Stateless string encoding & decoding complete cleanly! Result: ['neet', 'code'].", arrayState: [{ val: "neet", match: true }, { val: "code", match: true }] }
    ]
  },

  // ── 60. FIRST UNIQUE CHARACTER IN A STRING ──
  "first unique character in a string": {
    solutionJS: `function firstUniqChar(s) {
  let freq = {};
  for (let ch of s) freq[ch] = (freq[ch] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (freq[s[i]] === 1) return i;
  }
  return -1;
}`,
    solutionPY: `def firstUniqChar(s: str) -> int:
    count = collections.Counter(s)
    for i, ch in enumerate(s):
        if count[ch] == 1:
            return i
    return -1`,
    solutionCPP: `int firstUniqChar(string s) {
    vector<int> freq(26, 0);
    for (char c : s) freq[c - 'a']++;
    for (int i = 0; i < s.length(); i++) {
        if (freq[s[i] - 'a'] == 1) return i;
    }
    return -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function firstUniqChar(s = 'leetcode') {", vars: { s: "'leetcode'" }, log: "Initialize string 'leetcode'. Two-pass frequency counting algorithm.", arrayState: [{ val: "l" }, { val: "e" }, { val: "e" }, { val: "t" }, { val: "c" }, { val: "o" }, { val: "d" }, { val: "e" }] },
      { line: 2, code: "  freq pass -> l:1, e:3, t:1, c:1, o:1, d:1;", vars: { frequencies: "l:1, e:3, t:1, c:1, o:1, d:1" }, log: "Character frequency map: 'l':1, 'e':3, 't':1, 'c':1, 'o':1, 'd':1.", arrayState: [{ val: "l", active: true }, { val: "e" }, { val: "e" }, { val: "t" }, { val: "c" }, { val: "o" }, { val: "d" }, { val: "e" }] },
      { line: 4, code: "  freq['l'] === 1 -> FIRST UNIQUE CHAR AT INDEX 0!", vars: { i: "0", char: "'l'", count: "1" }, log: "Index 0 ('l'): Frequency count === 1. FIRST UNIQUE CHARACTER FOUND AT INDEX 0!", arrayState: [{ val: "l", match: true }, { val: "e" }, { val: "e" }, { val: "t" }, { val: "c" }, { val: "o" }, { val: "d" }, { val: "e" }] },
      { line: 6, code: "  return 0; // FIRST UNIQUE CHAR COMPLETE", vars: { firstUniqIdx: "0", status: "COMPLETE" }, log: "Return index 0 for first non-repeating character 'l'.", arrayState: [{ val: "l", match: true }, { val: "e" }, { val: "e" }, { val: "t" }, { val: "c" }, { val: "o" }, { val: "d" }, { val: "e" }] }
    ]
  },

  // ── 61. GROUP ANAGRAMS ──
  "group anagrams": {
    solutionJS: `function groupAnagrams(strs) {
  let map = new Map();
  for (let str of strs) {
    let sorted = str.split('').sort().join('');
    if (!map.has(sorted)) map.set(sorted, []);
    map.get(sorted).push(str);
  }
  return Array.from(map.values());
}`,
    solutionPY: `def groupAnagrams(strs: List[str]) -> List[List[str]]:
    ans = collections.defaultdict(list)
    for s in strs:
        ans[tuple(sorted(s))].append(s)
    return list(ans.values())`,
    solutionCPP: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> map;
    for (string s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        map[key].push_back(s);
    }
    vector<vector<string>> result;
    for (auto& p : map) result.push_back(p.second);
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function groupAnagrams(strs = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']) {", vars: { n: "6" }, log: "Initialize strs = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']. Sorted key Hash Map.", arrayState: [{ val: "eat" }, { val: "tea" }, { val: "tan" }, { val: "ate" }, { val: "nat" }, { val: "bat" }] },
      { line: 4, code: "  'eat', 'tea', 'ate' -> key 'aet';", vars: { key: "'aet'", group: "['eat', 'tea', 'ate']" }, log: "Group 1: 'eat', 'tea', 'ate' all sort to key 'aet'. Grouped together!", arrayState: [{ val: "eat", match: true }, { val: "tea", match: true }, { val: "tan" }, { val: "ate", match: true }, { val: "nat" }, { val: "bat" }] },
      { line: 4, code: "  'tan', 'nat' -> key 'ant';", vars: { key: "'ant'", group: "['tan', 'nat']" }, log: "Group 2: 'tan', 'nat' sort to key 'ant'. Grouped together!", arrayState: [{ val: "eat", match: true }, { val: "tea", match: true }, { val: "tan", match: true }, { val: "ate", match: true }, { val: "nat", match: true }, { val: "bat" }] },
      { line: 7, code: "  return [['eat','tea','ate'], ['tan','nat'], ['bat']]; // GROUP ANAGRAMS COMPLETE", vars: { groupsCount: "3", status: "COMPLETE" }, log: "Anagram grouping complete! Total 3 unique anagram buckets returned.", arrayState: [{ val: "eat", match: true }, { val: "tea", match: true }, { val: "tan", match: true }, { val: "ate", match: true }, { val: "nat", match: true }, { val: "bat", match: true }] }
    ]
  },

  // ── 62. LONGEST COMMON PREFIX IN AN ARRAY ──
  "longest common prefix in an array": {
    solutionJS: `function longestCommonPrefix(arr, n) {
  if (!n) return "-1";
  let prefix = arr[0];
  for (let i = 1; i < n; i++) {
    while (arr[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (!prefix) return "-1";
    }
  }
  return prefix || "-1";
}`,
    solutionPY: `def longestCommonPrefix(arr, n):
    if not arr: return "-1"
    prefix = arr[0]
    for s in arr[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix: return "-1"
    return prefix if prefix else "-1"`,
    solutionCPP: `string longestCommonPrefix(string arr[], int n) {
    if (n == 0) return "-1";
    string prefix = arr[0];
    for (int i = 1; i < n; i++) {
        while (arr[i].find(prefix) != 0) {
            prefix = prefix.substr(0, prefix.length() - 1);
            if (prefix.empty()) return "-1";
        }
    }
    return prefix.empty() ? "-1" : prefix;
}`,
    visualizerSteps: [
      { line: 1, code: "function longestCommonPrefix(arr = ['geeksforgeeks', 'geeks', 'geek', 'geezer']) {", vars: { prefix: "'geeksforgeeks'" }, log: "Initialize string array ['geeksforgeeks', 'geeks', 'geek', 'geezer'].", arrayState: [{ val: "geeksforgeeks" }, { val: "geeks" }, { val: "geek" }, { val: "geezer" }] },
      { line: 5, code: "  prefix = 'geeks' -> trim with 'geezer' -> 'gee';", vars: { compare: "'geezer'", prefix: "'gee'" }, log: "Compare with 'geezer': Shorten prefix from 'geeks' -> 'geek' -> 'gee'. 'geezer' starts with 'gee'.", arrayState: [{ val: "geeksforgeeks" }, { val: "geeks" }, { val: "geek" }, { val: "geezer", active: true }] },
      { line: 9, code: "  return 'gee'; // LONGEST COMMON PREFIX = 'gee'", vars: { longestPrefix: "'gee'", status: "COMPLETE" }, log: "Prefix scan complete! Longest common prefix across all 4 words: 'gee'.", arrayState: [{ val: "gee", match: true }, { val: "gee", match: true }, { val: "gee", match: true }, { val: "gee", match: true }] }
    ]
  },

  // ── 63. LONGEST PALINDROME IN A STRING ──
  "longest palindrome in a string": {
    solutionJS: `function longestPalindrome(s) {
  if (s.length <= 1) return s;
  let start = 0, maxLen = 0;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--; right++;
    }
    if (right - left - 1 > maxLen) {
      start = left + 1;
      maxLen = right - left - 1;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.substring(start, start + maxLen);
}`,
    solutionPY: `def longestPalindrome(s: str) -> str:
    if len(s) <= 1: return s
    start, max_len = 0, 0
    def expand(l, r):
        nonlocal start, max_len
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1; r += 1
        if r - l - 1 > max_len:
            start = l + 1
            max_len = r - l - 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return s[start:start + max_len]`,
    solutionCPP: `string longestPalindrome(string s) {
    if (s.length() <= 1) return s;
    int start = 0, maxLen = 0;
    auto expand = [&](int l, int r) {
        while (l >= 0 && r < s.length() && s[l] == s[r]) { l--; r++; }
        if (r - l - 1 > maxLen) { start = l + 1; maxLen = r - l - 1; }
    };
    for (int i = 0; i < s.length(); i++) {
        expand(i, i);
        expand(i, i + 1);
    }
    return s.substr(start, maxLen);
}`,
    visualizerSteps: [
      { line: 1, code: "function longestPalindrome(s = 'babad') {", vars: { s: "'babad'", maxLen: "0" }, log: "Initialize s = 'babad'. Expand around center algorithm for odd & even palindromes.", arrayState: [{ val: "b" }, { val: "a" }, { val: "b" }, { val: "a" }, { val: "d" }] },
      { line: 5, code: "  expand center idx 1 ('a') -> 'bab' (len 3);", vars: { center: "1 ('a')", palindrome: "'bab'", maxLen: "3" }, log: "Expand around center idx 1 ('a'): Matches 'b' (idx 0) and 'b' (idx 2). Palindrome 'bab' of length 3!", arrayState: [{ val: "b", match: true }, { val: "a", match: true }, { val: "b", match: true }, { val: "a" }, { val: "d" }] },
      { line: 5, code: "  expand center idx 2 ('b') -> 'aba' (len 3);", vars: { center: "2 ('b')", palindrome: "'aba'", maxLen: "3" }, log: "Expand around center idx 2 ('b'): Matches 'a' (idx 1) and 'a' (idx 3). Palindrome 'aba' of length 3!", arrayState: [{ val: "b" }, { val: "a", match: true }, { val: "b", match: true }, { val: "a", match: true }, { val: "d" }] },
      { line: 16, code: "  return 'bab'; // LONGEST PALINDROMIC SUBSTRING = 'bab'", vars: { longestPalindromicSubstring: "'bab'", status: "COMPLETE" }, log: "Expansion complete! Longest palindromic substring is 'bab' (length 3).", arrayState: [{ val: "b", match: true }, { val: "a", match: true }, { val: "b", match: true }, { val: "a" }, { val: "d" }] }
    ]
  },

  // ── 64. LONGEST PALINDROMIC SUBSTRING ──
  "longest palindromic substring": {
    solutionJS: `function longestPalindrome(s) {
  if (s.length <= 1) return s;
  let start = 0, maxLen = 0;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--; right++;
    }
    if (right - left - 1 > maxLen) {
      start = left + 1;
      maxLen = right - left - 1;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.substring(start, start + maxLen);
}`,
    solutionPY: `def longestPalindrome(s: str) -> str:
    if len(s) <= 1: return s
    start, max_len = 0, 0
    def expand(l, r):
        nonlocal start, max_len
        while l >= 0 and r < len(s) and s[l] == s[r]: l -= 1; r += 1
        if r - l - 1 > max_len:
            start = l + 1
            max_len = r - l - 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return s[start:start + max_len]`,
    solutionCPP: `string longestPalindrome(string s) {
    if (s.length() <= 1) return s;
    int start = 0, maxLen = 0;
    auto expand = [&](int l, int r) {
        while (l >= 0 && r < s.length() && s[l] == s[r]) { l--; r++; }
        if (r - l - 1 > maxLen) { start = l + 1; maxLen = r - l - 1; }
    };
    for (int i = 0; i < s.length(); i++) {
        expand(i, i); expand(i, i + 1);
    }
    return s.substr(start, maxLen);
}`,
    visualizerSteps: [
      { line: 1, code: "function longestPalindrome(s = 'babad') {", vars: { s: "'babad'", maxLen: "0" }, log: "Initialize s = 'babad'. Expand around center algorithm for odd & even palindromes.", arrayState: [{ val: "b" }, { val: "a" }, { val: "b" }, { val: "a" }, { val: "d" }] },
      { line: 5, code: "  expand center idx 1 ('a') -> 'bab' (len 3);", vars: { center: "1 ('a')", palindrome: "'bab'", maxLen: "3" }, log: "Expand around center idx 1 ('a'): Matches 'b' (idx 0) and 'b' (idx 2). Palindrome 'bab' of length 3!", arrayState: [{ val: "b", match: true }, { val: "a", match: true }, { val: "b", match: true }, { val: "a" }, { val: "d" }] },
      { line: 5, code: "  expand center idx 2 ('b') -> 'aba' (len 3);", vars: { center: "2 ('b')", palindrome: "'aba'", maxLen: "3" }, log: "Expand around center idx 2 ('b'): Matches 'a' (idx 1) and 'a' (idx 3). Palindrome 'aba' of length 3!", arrayState: [{ val: "b" }, { val: "a", match: true }, { val: "b", match: true }, { val: "a", match: true }, { val: "d" }] },
      { line: 16, code: "  return 'bab'; // LONGEST PALINDROMIC SUBSTRING = 'bab'", vars: { longestPalindromicSubstring: "'bab'", status: "COMPLETE" }, log: "Expansion complete! Longest palindromic substring is 'bab' (length 3).", arrayState: [{ val: "b", match: true }, { val: "a", match: true }, { val: "b", match: true }, { val: "a" }, { val: "d" }] }
    ]
  },

  // ── 65. LONGEST REPEATING CHARACTER REPLACEMENT ──
  "longest repeating character replacement": {
    solutionJS: `function characterReplacement(s, k) {
  let count = {};
  let maxFreq = 0, left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    let char = s[right];
    count[char] = (count[char] || 0) + 1;
    maxFreq = Math.max(maxFreq, count[char]);
    while ((right - left + 1) - maxFreq > k) {
      count[s[left]]--;
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    solutionPY: `def characterReplacement(s: str, k: int) -> int:
    count = {}
    max_freq, left, max_len = 0, 0, 0
    for right, char in enumerate(s):
        count[char] = count.get(char, 0) + 1
        max_freq = max(max_freq, count[char])
        while (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len`,
    solutionCPP: `int characterReplacement(string s, int k) {
    vector<int> count(26, 0);
    int maxFreq = 0, left = 0, maxLen = 0;
    for (int right = 0; right < s.length(); right++) {
        count[s[right] - 'A']++;
        maxFreq = max(maxFreq, count[s[right] - 'A']);
        while ((right - left + 1) - maxFreq > k) {
            count[s[left] - 'A']--;
            left++;
        }
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    visualizerSteps: [
      { line: 1, code: "function characterReplacement(s = 'AABABBA', k = 1) {", vars: { s: "'AABABBA'", k: "1" }, log: "Initialize s = 'AABABBA', k = 1. Dynamic sliding window frequency constraint.", arrayState: [{ val: "A" }, { val: "A" }, { val: "B" }, { val: "A" }, { val: "B" }, { val: "B" }, { val: "A" }] },
      { line: 4, code: "  right = 3 ('A'): window 'AABA' -> len 4, maxFreq 3; (4-3 = 1 <= 1) Valid!", vars: { window: "'AABA'", maxFreq: "3", maxLen: "4" }, log: "Window 'AABA' (idx 0 to 3): maxFreq = 3 ('A'). 4 - 3 = 1 replacement <= k (1). Valid length = 4!", arrayState: [{ val: "A", match: true }, { val: "A", match: true }, { val: "B", active: true }, { val: "A", match: true }, { val: "B" }, { val: "B" }, { val: "A" }] },
      { line: 11, code: "  return 4; // CHARACTER REPLACEMENT COMPLETE", vars: { maxSubstrLength: "4", status: "COMPLETE" }, log: "Sliding window complete! Longest repeating character replacement length: 4.", arrayState: [{ val: "A", match: true }, { val: "A", match: true }, { val: "B", match: true }, { val: "A", match: true }, { val: "B" }, { val: "B" }, { val: "A" }] }
    ]
  },

  // ── 66. LONGEST SUBSTRING WITHOUT REPEATING CHARACTERS ──
  "longest substring without repeating characters": {
    solutionJS: `function lengthOfLongestSubstring(s) {
  let set = new Set();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    solutionPY: `def lengthOfLongestSubstring(s: str) -> int:
    char_set = set()
    left, max_len = 0, 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len`,
    solutionCPP: `int lengthOfLongestSubstring(string s) {
    unordered_set<char> set;
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.length(); right++) {
        while (set.count(s[right])) {
            set.erase(s[left++]);
        }
        set.insert(s[right]);
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    visualizerSteps: [
      { line: 1, code: "function lengthOfLongestSubstring(s = 'abcabcbb') {", vars: { s: "'abcabcbb'", maxLen: "0" }, log: "Initialize s = 'abcabcbb'. Sliding window with Hash Set unique char constraint.", arrayState: [{ val: "a" }, { val: "b" }, { val: "c" }, { val: "a" }, { val: "b" }, { val: "c" }, { val: "b" }, { val: "b" }] },
      { line: 4, code: "  right = 2 ('c'): window 'abc' -> maxLen = 3;", vars: { window: "'abc'", maxLen: "3" }, log: "Index 2 ('c'): Set {'a', 'b', 'c'}. All unique! Current window length = 3.", arrayState: [{ val: "a", match: true }, { val: "b", match: true }, { val: "c", match: true }, { val: "a" }, { val: "b" }, { val: "c" }, { val: "b" }, { val: "b" }] },
      { line: 5, code: "  right = 3 ('a'): duplicate 'a'! Shrink left -> window 'bca';", vars: { window: "'bca'", duplicate: "'a'", maxLen: "3" }, log: "Index 3 ('a'): Duplicate 'a'! Delete left 'a'. New unique window 'bca' of length 3.", arrayState: [{ val: "a" }, { val: "b", match: true }, { val: "c", match: true }, { val: "a", match: true }, { val: "b" }, { val: "c" }, { val: "b" }, { val: "b" }] },
      { line: 11, code: "  return 3; // LONGEST UNIQUE SUBSTRING = 3", vars: { maxSubstrLength: "3", status: "COMPLETE" }, log: "Window scan complete! Length of longest substring without repeating characters is 3 ('abc').", arrayState: [{ val: "a", match: true }, { val: "b", match: true }, { val: "c", match: true }, { val: "a" }, { val: "b" }, { val: "c" }, { val: "b" }, { val: "b" }] }
    ]
  },

  // ── 67. PALINDROMIC SUBSTRINGS ──
  "palindromic substrings": {
    solutionJS: `function countSubstrings(s) {
  let count = 0;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      count++;
      left--; right++;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return count;
}`,
    solutionPY: `def countSubstrings(s: str) -> int:
    count = 0
    def expand(l, r):
        nonlocal count
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1
            l -= 1; r += 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return count`,
    solutionCPP: `int countSubstrings(string s) {
    int count = 0;
    auto expand = [&](int l, int r) {
        while (l >= 0 && r < s.length() && s[l] == s[r]) {
            count++; l--; r++;
        }
    };
    for (int i = 0; i < s.length(); i++) {
        expand(i, i); expand(i, i + 1);
    }
    return count;
}`,
    visualizerSteps: [
      { line: 1, code: "function countSubstrings(s = 'aaa') {", vars: { s: "'aaa'", count: "0" }, log: "Initialize s = 'aaa'. Expand around odd & even centers to count all palindromic substrings.", arrayState: [{ val: "a" }, { val: "a" }, { val: "a" }] },
      { line: 4, code: "  odd centers: 'a' (idx 0), 'a' & 'aaa' (idx 1), 'a' (idx 2) -> 4 palindromes;", vars: { oddPalindromesCount: "4" }, log: "Expand odd centers: Single chars 'a', 'a', 'a' and 3-char string 'aaa' (4 total).", arrayState: [{ val: "a", match: true }, { val: "a", match: true }, { val: "a", match: true }] },
      { line: 4, code: "  even centers: 'aa' (idx 0-1), 'aa' (idx 1-2) -> 2 palindromes;", vars: { evenPalindromesCount: "2", totalCount: "6" }, log: "Expand even centers: Double chars 'aa' (0-1) and 'aa' (1-2) (2 total).", arrayState: [{ val: "a", match: true }, { val: "a", match: true }, { val: "a", match: true }] },
      { line: 12, code: "  return 6; // TOTAL PALINDROMIC SUBSTRINGS = 6", vars: { totalPalindromicSubstrings: "6", status: "COMPLETE" }, log: "Center expansion complete! Total palindromic substrings count: 6.", arrayState: [{ val: "a", match: true }, { val: "a", match: true }, { val: "a", match: true }] }
    ]
  },

  // ── 68. REVERSE WORDS IN A STRING ──
  "reverse words in a string": {
    solutionJS: `function reverseWords(s) {
  return s.trim().split(/\s+/).reverse().join(' ');
}`,
    solutionPY: `def reverseWords(s: str) -> str:
    return " ".join(s.split()[::-1])`,
    solutionCPP: `string reverseWords(string s) {
    stringstream ss(s);
    string word, ans = "";
    vector<string> words;
    while (ss >> word) words.push_back(word);
    for (int i = words.size() - 1; i >= 0; i--) {
        ans += words[i] + (i > 0 ? " " : "");
    }
    return ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function reverseWords(s = 'the sky is blue') {", vars: { s: "'the sky is blue'" }, log: "Initialize string 'the sky is blue'. Tokenize words and reverse order.", arrayState: [{ val: "the" }, { val: "sky" }, { val: "is" }, { val: "blue" }] },
      { line: 2, code: "  split(/\s+/) -> ['the', 'sky', 'is', 'blue'];", vars: { words: "['the', 'sky', 'is', 'blue']" }, log: "Split by whitespace: Extract 4 word tokens.", arrayState: [{ val: "the" }, { val: "sky" }, { val: "is" }, { val: "blue" }] },
      { line: 3, code: "  reverse().join(' ') -> 'blue is sky the';", vars: { reversed: "'blue is sky the'" }, log: "Reverse word array: ['blue', 'is', 'sky', 'the'] and join with ' '.", arrayState: [{ val: "blue", match: true }, { val: "is", match: true }, { val: "sky", match: true }, { val: "the", match: true }] },
      { line: 4, code: "  return 'blue is sky the'; // REVERSE WORDS COMPLETE", vars: { reversedString: "'blue is sky the'", status: "COMPLETE" }, log: "Word reversal complete! Final string: 'blue is sky the'.", arrayState: [{ val: "blue", match: true }, { val: "is", match: true }, { val: "sky", match: true }, { val: "the", match: true }] }
    ]
  },

  // ── 69. SEARCH PATTERN (NAIVE PATTERN SEARCHING) ──
  "search pattern (naive pattern searching)": {
    solutionJS: `function search(pat, txt) {
  let res = [];
  let n = txt.length, m = pat.length;
  for (let i = 0; i <= n - m; i++) {
    if (txt.substring(i, i + m) === pat) {
      res.push(i + 1); // 1-based index
    }
  }
  return res;
}`,
    solutionPY: `def search(pat, txt):
    res = []
    n, m = len(txt), len(pat)
    for i in range(n - m + 1):
        if txt[i:i + m] == pat:
            res.append(i + 1)
    return res`,
    solutionCPP: `vector<int> search(string pat, string txt) {
    vector<int> res;
    int n = txt.length(), m = pat.length();
    for (int i = 0; i <= n - m; i++) {
        if (txt.substr(i, m) == pat) res.push_back(i + 1);
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function search(txt = 'AABAACAADAABAABA', pat = 'AABA') {", vars: { txt: "'AABAACAADAABAABA'", pat: "'AABA'" }, log: "Initialize text 'AABAACAADAABAABA' and pattern 'AABA'. Naive sliding window search.", arrayState: [{ val: "A" }, { val: "A" }, { val: "B" }, { val: "A" }, { val: "A" }, { val: "C" }, { val: "A" }, { val: "A" }, { val: "D" }, { val: "A" }, { val: "A" }, { val: "B" }, { val: "A" }, { val: "A" }, { val: "B" }, { val: "A" }] },
      { line: 5, code: "  txt[0..3] === 'AABA' -> Match at 1-based index 1!", vars: { i: "0", matchIndex: "1", matches: "[1]" }, log: "Index 0: Substring 'AABA' matches pattern 'AABA'! Found match at 1-based index 1.", arrayState: [{ val: "A", match: true }, { val: "A", match: true }, { val: "B", match: true }, { val: "A", match: true }, { val: "A" }, { val: "C" }, { val: "A" }, { val: "A" }, { val: "D" }, { val: "A" }, { val: "A" }, { val: "B" }, { val: "A" }, { val: "A" }, { val: "B" }, { val: "A" }] },
      { line: 5, code: "  txt[9..12] === 'AABA' -> Match at 1-based index 10!", vars: { i: "9", matchIndex: "10", matches: "[1, 10]" }, log: "Index 9: Substring 'AABA' matches pattern 'AABA'! Found match at 1-based index 10.", arrayState: [{ val: "A" }, { val: "A" }, { val: "B" }, { val: "A" }, { val: "A" }, { val: "C" }, { val: "A" }, { val: "A" }, { val: "D" }, { val: "A", match: true }, { val: "A", match: true }, { val: "B", match: true }, { val: "A", match: true }, { val: "A" }, { val: "B" }, { val: "A" }] },
      { line: 9, code: "  return [1, 10, 13]; // NAIVE PATTERN SEARCH COMPLETE", vars: { indices: "[1, 10, 13]", status: "COMPLETE" }, log: "Pattern search complete! Matches found at 1-based indices: [1, 10, 13].", arrayState: [{ val: "A", match: true }, { val: "A", match: true }, { val: "B", match: true }, { val: "A", match: true }, { val: "A" }, { val: "C" }, { val: "A" }, { val: "A" }, { val: "D" }, { val: "A", match: true }, { val: "A", match: true }, { val: "B", match: true }, { val: "A", match: true }, { val: "A", match: true }, { val: "B", match: true }, { val: "A", match: true }] }
    ]
  },

  // ── 70. ZIGZAG CONVERSION ──
  "zigzag conversion": {
    solutionJS: `function convert(s, numRows) {
  if (numRows === 1 || s.length <= numRows) return s;
  let rows = Array.from({ length: numRows }, () => "");
  let currRow = 0, goingDown = false;
  for (let ch of s) {
    rows[currRow] += ch;
    if (currRow === 0 || currRow === numRows - 1) goingDown = !goingDown;
    currRow += goingDown ? 1 : -1;
  }
  return rows.join('');
}`,
    solutionPY: `def convert(s: str, numRows: int) -> str:
    if numRows == 1 or len(s) <= numRows: return s
    rows = [""] * numRows
    curr_row, going_down = 0, False
    for ch in s:
        rows[curr_row] += ch
        if curr_row == 0 or curr_row == numRows - 1: going_down = not going_down
        curr_row += 1 if going_down else -1
    return "".join(rows)`,
    solutionCPP: `string convert(string s, int numRows) {
    if (numRows == 1 || s.length() <= numRows) return s;
    vector<string> rows(min(numRows, (int)s.length()));
    int currRow = 0; bool goingDown = false;
    for (char c : s) {
        rows[currRow] += c;
        if (currRow == 0 || currRow == numRows - 1) goingDown = !goingDown;
        currRow += goingDown ? 1 : -1;
    }
    string ans = "";
    for (string row : rows) ans += row;
    return ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function convert(s = 'PAYPALISHIRING', numRows = 3) {", vars: { s: "'PAYPALISHIRING'", numRows: "3" }, log: "Initialize string 'PAYPALISHIRING' and numRows = 3. Oscillating row traversal.", arrayState: [{ val: "P" }, { val: "A" }, { val: "Y" }, { val: "P" }, { val: "A" }, { val: "L" }, { val: "I" }, { val: "S" }, { val: "H" }, { val: "I" }, { val: "R" }, { val: "I" }, { val: "N" }, { val: "G" }] },
      { line: 5, code: "  Row 0: 'PAHN'; Row 1: 'APLSIIG'; Row 2: 'YIR';", vars: { row0: "'PAHN'", row1: "'APLSIIG'", row2: "'YIR'" }, log: "Distribute characters into 3 rows in zigzag direction. Row 0: 'PAHN', Row 1: 'APLSIIG', Row 2: 'YIR'.", arrayState: [{ val: "P", match: true }, { val: "A", active: true }, { val: "Y" }, { val: "P" }, { val: "A" }, { val: "L" }, { val: "I" }, { val: "S" }, { val: "H" }, { val: "I" }, { val: "R" }, { val: "I" }, { val: "N" }, { val: "G" }] },
      { line: 9, code: "  return 'PAHNAPLSIIGYIR'; // ZIGZAG CONVERSION COMPLETE", vars: { result: "'PAHNAPLSIIGYIR'", status: "COMPLETE" }, log: "Concatenate 3 rows line-by-line: Result 'PAHNAPLSIIGYIR'!", arrayState: [{ val: "P", match: true }, { val: "A", match: true }, { val: "Y", match: true }, { val: "P", match: true }, { val: "A", match: true }, { val: "L", match: true }, { val: "I", match: true }, { val: "S", match: true }, { val: "H", match: true }, { val: "I", match: true }, { val: "R", match: true }, { val: "I", match: true }, { val: "N", match: true }, { val: "G", match: true }] }
    ]
  },

  // ── 71. SORTED MATRIX (PRINT IN SORTED ORDER) ──
  "sorted matrix (print in sorted order)": {
    solutionJS: `function sortedMatrix(N, Mat) {
  let flat = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) flat.push(Mat[r][c]);
  }
  flat.sort((a, b) => a - b);
  let k = 0;
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) Mat[r][c] = flat[k++];
  }
  return Mat;
}`,
    solutionPY: `def sortedMatrix(N, Mat):
    flat = []
    for r in range(N):
        for c in range(N): flat.append(Mat[r][c])
    flat.sort()
    k = 0
    for r in range(N):
        for c in range(N):
            Mat[r][c] = flat[k]
            k += 1
    return Mat`,
    solutionCPP: `vector<vector<int>> sortedMatrix(int N, vector<vector<int>> Mat) {
    vector<int> flat;
    for (int r = 0; r < N; r++) {
        for (int c = 0; c < N; c++) flat.push_back(Mat[r][c]);
    }
    sort(flat.begin(), flat.end());
    int k = 0;
    for (int r = 0; r < N; r++) {
        for (int c = 0; c < N; c++) Mat[r][c] = flat[k++];
    }
    return Mat;
}`,
    visualizerSteps: [
      { line: 1, code: "function sortedMatrix(N = 2, Mat = [[10,20],[15,25]]) {", vars: { N: "2" }, log: "Initialize 2x2 matrix [[10,20],[15,25]]. Flatten elements and sort.", arrayState: [{ val: "10" }, { val: "20" }, { val: "15" }, { val: "25" }] },
      { line: 5, code: "  flat.sort() -> [10, 15, 20, 25];", vars: { sorted: "[10, 15, 20, 25]" }, log: "Flatten & sort elements: [10, 15, 20, 25].", arrayState: [{ val: "10", match: true }, { val: "15", match: true }, { val: "20", match: true }, { val: "25", match: true }] },
      { line: 10, code: "  return [[10, 15], [20, 25]]; // SORTED MATRIX COMPLETE", vars: { matrix: "[[10, 15], [20, 25]]", status: "COMPLETE" }, log: "Repopulate N x N matrix in sorted order: [[10, 15], [20, 25]]!", arrayState: [{ val: "10", match: true }, { val: "15", match: true }, { val: "20", match: true }, { val: "25", match: true }] }
    ]
  },

  // ── 72. COMMON ELEMENTS PRESENT IN ALL ROWS OF MATRIX ──
  "common elements present in all rows of matrix": {
    solutionJS: `function findCommon(mat) {
  let m = mat.length, n = mat[0].length;
  let map = new Map();
  for (let j = 0; j < n; j++) map.set(mat[0][j], 1);
  for (let i = 1; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let val = mat[i][j];
      if (map.get(val) === i) {
        map.set(val, i + 1);
      }
    }
  }
  let res = [];
  for (let [val, count] of map) {
    if (count === m) res.push(val);
  }
  return res;
}`,
    solutionPY: `def findCommon(mat):
    m, n = len(mat), len(mat[0])
    cnt = {mat[0][j]: 1 for j in range(n)}
    for i in range(1, m):
        for j in range(n):
            val = mat[i][j]
            if cnt.get(val, 0) == i:
                cnt[val] = i + 1
    return [val for val, c in cnt.items() if c == m]`,
    solutionCPP: `vector<int> findCommon(vector<vector<int>>& mat) {
    int m = mat.size(), n = mat[0].size();
    unordered_map<int, int> map;
    for (int j = 0; j < n; j++) map[mat[0][j]] = 1;
    for (int i = 1; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (map[mat[i][j]] == i) map[mat[i][j]] = i + 1;
        }
    }
    vector<int> ans;
    for (auto& p : map) if (p.second == m) ans.push_back(p.first);
    return ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function findCommon(mat = [[1, 2, 8], [3, 8, 1], [8, 1, 7]]) {", vars: { m: "3", n: "3" }, log: "Initialize 3x3 matrix. Hash map tracking element presence per row.", arrayState: [{ val: "Row 0: 1, 2, 8" }, { val: "Row 1: 3, 8, 1" }, { val: "Row 2: 8, 1, 7" }] },
      { line: 4, code: "  Row 0 -> map: {1:1, 2:1, 8:1};", vars: { row0Map: "{1:1, 2:1, 8:1}" }, log: "Row 0 elements logged: 1, 2, 8.", arrayState: [{ val: "1", match: true }, { val: "2" }, { val: "8", match: true }] },
      { line: 7, code: "  Row 1 & 2 -> 1 and 8 match all 3 rows!", vars: { commonElements: "[1, 8]" }, log: "Row 1 & Row 2 sweep: Elements 1 and 8 are present in all 3 rows!", arrayState: [{ val: "1", match: true }, { val: "8", match: true }] },
      { line: 14, code: "  return [1, 8]; // COMMON MATRIX ELEMENTS COMPLETE", vars: { common: "[1, 8]", status: "COMPLETE" }, log: "Search complete! Elements present in all rows of matrix: [1, 8].", arrayState: [{ val: "1", match: true }, { val: "8", match: true }] }
    ]
  },

  // ── 73. MAXIMAL SQUARE ──
  "maximal square": {
    solutionJS: `function maximalSquare(matrix) {
  if (!matrix.length) return 0;
  let rows = matrix.length, cols = matrix[0].length;
  let dp = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));
  let maxSide = 0;
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      if (matrix[r - 1][c - 1] === '1') {
        dp[r][c] = Math.min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]) + 1;
        maxSide = Math.max(maxSide, dp[r][c]);
      }
    }
  }
  return maxSide * maxSide;
}`,
    solutionPY: `def maximalSquare(matrix: List[List[str]]) -> int:
    if not matrix: return 0
    rows, cols = len(matrix), len(matrix[0])
    dp = [[0] * (cols + 1) for _ in range(rows + 1)]
    max_side = 0
    for r in range(1, rows + 1):
        for c in range(1, cols + 1):
            if matrix[r - 1][c - 1] == '1':
                dp[r][c] = min(dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]) + 1
                max_side = max(max_side, dp[r][c])
    return max_side * max_side`,
    solutionCPP: `int maximalSquare(vector<vector<char>>& matrix) {
    if (matrix.empty()) return 0;
    int rows = matrix.size(), cols = matrix[0].size();
    vector<vector<int>> dp(rows + 1, vector<int>(cols + 1, 0));
    int maxSide = 0;
    for (int r = 1; r <= rows; r++) {
        for (int c = 1; c <= cols; c++) {
            if (matrix[r - 1][c - 1] == '1') {
                dp[r][c] = min({dp[r - 1][c], dp[r][c - 1], dp[r - 1][c - 1]}) + 1;
                maxSide = max(maxSide, dp[r][c]);
            }
        }
    }
    return maxSide * maxSide;
}`,
    visualizerSteps: [
      { line: 1, code: "function maximalSquare(matrix = 4x5 binary matrix) {", vars: { rows: "4", cols: "5", maxSide: "0" }, log: "Initialize 4x5 binary matrix. 2D DP min(top, left, top-left) + 1.", arrayState: [{ val: "1" }, { val: "0" }, { val: "1" }, { val: "0" }, { val: "0" }] },
      { line: 8, code: "  dp[2][3] = min(dp[1][3], dp[2][2], dp[1][2]) + 1 = 2;", vars: { r: "2", c: "3", maxSide: "2" }, log: "DP cell (2, 3): min(1, 1, 1) + 1 = 2. Sub-square of side length 2 formed!", arrayState: [{ val: "1", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "1", match: true }] },
      { line: 13, code: "  return 4; // MAXIMAL SQUARE AREA = 4", vars: { maxSide: "2", maxSquareArea: "4", status: "COMPLETE" }, log: "DP matrix evaluation complete! Max square side length is 2. Maximal Square Area: 4.", arrayState: [{ val: "1", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "1", match: true }] }
    ]
  },

  // ── 74. ROTATE IMAGE ──
  "rotate image": {
    solutionJS: `function rotate(matrix) {
  let n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}`,
    solutionPY: `def rotate(matrix: List[List[int]]) -> None:
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for i in range(n):
        matrix[i].reverse()`,
    solutionCPP: `void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) swap(matrix[i][j], matrix[j][i]);
    }
    for (int i = 0; i < n; i++) reverse(matrix[i].begin(), matrix[i].end());
}`,
    visualizerSteps: [
      { line: 1, code: "function rotate(matrix = [[1,2,3],[4,5,6],[7,8,9]]) {", vars: { n: "3" }, log: "Initialize 3x3 matrix [[1,2,3],[4,5,6],[7,8,9]]. Transpose + Reverse Row strategy.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8" }, { val: "9" }] },
      { line: 4, code: "  transpose -> [[1,4,7],[2,5,8],[3,6,9]];", vars: { transposed: "[[1,4,7],[2,5,8],[3,6,9]]" }, log: "Step 1 (Transpose): Swap matrix[i][j] with matrix[j][i]. Matrix becomes [[1,4,7],[2,5,8],[3,6,9]].", arrayState: [{ val: "1", active: true }, { val: "4", active: true }, { val: "7", active: true }, { val: "2", active: true }, { val: "5", active: true }, { val: "8", active: true }, { val: "3", active: true }, { val: "6", active: true }, { val: "9", active: true }] },
      { line: 8, code: "  reverseRows -> [[7,4,1],[8,5,2],[9,6,3]];", vars: { rotated: "[[7,4,1],[8,5,2],[9,6,3]]" }, log: "Step 2 (Reverse Rows): Reverse each row -> [[7,4,1],[8,5,2],[9,6,3]]. 90-deg clockwise rotation complete!", arrayState: [{ val: "7", match: true }, { val: "4", match: true }, { val: "1", match: true }, { val: "8", match: true }, { val: "5", match: true }, { val: "2", match: true }, { val: "9", match: true }, { val: "6", match: true }, { val: "3", match: true }] },
      { line: 10, code: "  return matrix; // ROTATE IMAGE COMPLETE", vars: { status: "COMPLETE" }, log: "Matrix rotated 90 degrees clockwise in-place!", arrayState: [{ val: "7", match: true }, { val: "4", match: true }, { val: "1", match: true }, { val: "8", match: true }, { val: "5", match: true }, { val: "2", match: true }, { val: "9", match: true }, { val: "6", match: true }, { val: "3", match: true }] }
    ]
  },

  // ── 75. ROW WITH MAX 1S ──
  "row with max 1s": {
    solutionJS: `function rowWithMax1s(arr, n, m) {
  let r = 0, c = m - 1;
  let maxRow = -1;
  while (r < n && c >= 0) {
    if (arr[r][c] === 1) {
      maxRow = r;
      c--;
    } else {
      r++;
    }
  }
  return maxRow;
}`,
    solutionPY: `def rowWithMax1s(arr, n, m):
    r, c = 0, m - 1
    max_row = -1
    while r < n and c >= 0:
        if arr[r][c] == 1:
            max_row = r
            c -= 1
        else:
            r += 1
    return max_row`,
    solutionCPP: `int rowWithMax1s(vector<vector<int> > arr, int n, int m) {
    int r = 0, c = m - 1;
    int maxRow = -1;
    while (r < n && c >= 0) {
        if (arr[r][c] == 1) {
            maxRow = r;
            c--;
        } else {
            r++;
        }
    }
    return maxRow;
}`,
    visualizerSteps: [
      { line: 1, code: "function rowWithMax1s(arr = [[0, 1, 1, 1], [0, 0, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0]]) {", vars: { n: "4", m: "4", r: "0", c: "3" }, log: "Initialize 4x4 sorted binary matrix. Top-right corner (0, 3) elimination.", arrayState: [{ val: "Row 0: 3 ones" }, { val: "Row 1: 2 ones" }, { val: "Row 2: 4 ones" }, { val: "Row 3: 0 ones" }] },
      { line: 5, code: "  arr[0][3] === 1 -> maxRow = 0; c--;", vars: { r: "0", c: "0", maxRow: "0" }, log: "Row 0 has 1s! Move left to c = 0. Record maxRow = 0.", arrayState: [{ val: "Row 0", active: true }, { val: "Row 1" }, { val: "Row 2" }, { val: "Row 3" }] },
      { line: 5, code: "  arr[2][0] === 1 -> maxRow = 2; c = -1;", vars: { r: "2", c: "-1", maxRow: "2" }, log: "Row 2 has 1 at c = 0! Move left to c = -1. Record new maxRow = 2 (all 4 ones).", arrayState: [{ val: "Row 0" }, { val: "Row 1" }, { val: "Row 2", match: true }, { val: "Row 3" }] },
      { line: 11, code: "  return 2; // ROW WITH MAX 1S = 2", vars: { rowWithMaxOnes: "2", status: "COMPLETE" }, log: "Top-right traversal complete! Row 2 has the maximum number of 1s (4 ones).", arrayState: [{ val: "Row 0" }, { val: "Row 1" }, { val: "Row 2 (Max 1s)", match: true }, { val: "Row 3" }] }
    ]
  },

  // ── 76. SET MATRIX ZEROES ──
  "set matrix zeroes": {
    solutionJS: `function setZeroes(matrix) {
  let m = matrix.length, n = matrix[0].length;
  let firstRowZero = false, firstColZero = false;
  for (let r = 0; r < m; r++) if (matrix[r][0] === 0) firstColZero = true;
  for (let c = 0; c < n; c++) if (matrix[0][c] === 0) firstRowZero = true;
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0;
        matrix[0][c] = 0;
      }
    }
  }
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
    }
  }
  if (firstColZero) for (let r = 0; r < m; r++) matrix[r][0] = 0;
  if (firstRowZero) for (let c = 0; c < n; c++) matrix[0][c] = 0;
}`,
    solutionPY: `def setZeroes(matrix: List[List[int]]) -> None:
    m, n = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][c] == 0 for c in range(n))
    first_col_zero = any(matrix[r][0] == 0 for r in range(m))
    for r in range(1, m):
        for c in range(1, n):
            if matrix[r][c] == 0:
                matrix[r][0] = 0
                matrix[0][c] = 0
    for r in range(1, m):
        for c in range(1, n):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0
    if first_col_zero:
        for r in range(m): matrix[r][0] = 0
    if first_row_zero:
        for c in range(n): matrix[0][c] = 0`,
    solutionCPP: `void setZeroes(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    bool firstRowZero = false, firstColZero = false;
    for (int r = 0; r < m; r++) if (matrix[r][0] == 0) firstColZero = true;
    for (int c = 0; c < n; c++) if (matrix[0][c] == 0) firstRowZero = true;
    for (int r = 1; r < m; r++) {
        for (int c = 1; c < n; c++) {
            if (matrix[r][c] == 0) { matrix[r][0] = 0; matrix[0][c] = 0; }
        }
    }
    for (int r = 1; r < m; r++) {
        for (int c = 1; c < n; c++) {
            if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;
        }
    }
    if (firstColZero) for (int r = 0; r < m; r++) matrix[r][0] = 0;
    if (firstRowZero) for (int c = 0; c < n; c++) matrix[0][c] = 0;
}`,
    visualizerSteps: [
      { line: 1, code: "function setZeroes(matrix = [[1,1,1],[1,0,1],[1,1,1]]) {", vars: { m: "3", n: "3" }, log: "Initialize 3x3 matrix [[1,1,1],[1,0,1],[1,1,1]]. In-place first row/col markers.", arrayState: [{ val: "1" }, { val: "1" }, { val: "1" }, { val: "1" }, { val: "0" }, { val: "1" }, { val: "1" }, { val: "1" }, { val: "1" }] },
      { line: 7, code: "  matrix[1][1] === 0 -> mark matrix[1][0] = 0, matrix[0][1] = 0;", vars: { cell: "(1,1)", markRow: "1", markCol: "1" }, log: "Cell (1,1) is 0: Mark row 1 indicator (1,0) = 0 and column 1 indicator (0,1) = 0.", arrayState: [{ val: "1" }, { val: "0", active: true }, { val: "1" }, { val: "0", active: true }, { val: "0", match: true }, { val: "1" }, { val: "1" }, { val: "1" }, { val: "1" }] },
      { line: 14, code: "  zero out marked rows & cols -> [[1,0,1],[0,0,0],[1,0,1]];", vars: { matrix: "[[1,0,1],[0,0,0],[1,0,1]]" }, log: "Zero out row 1 and column 1: Matrix becomes [[1,0,1],[0,0,0],[1,0,1]].", arrayState: [{ val: "1" }, { val: "0", match: true }, { val: "1" }, { val: "0", match: true }, { val: "0", match: true }, { val: "0", match: true }, { val: "1" }, { val: "0", match: true }, { val: "1" }] },
      { line: 18, code: "  return matrix; // SET MATRIX ZEROES COMPLETE", vars: { status: "COMPLETE" }, log: "In-place matrix zeroing complete cleanly!", arrayState: [{ val: "1" }, { val: "0", match: true }, { val: "1" }, { val: "0", match: true }, { val: "0", match: true }, { val: "0", match: true }, { val: "1" }, { val: "0", match: true }, { val: "1" }] }
    ]
  },

  // ── 77. SOLVE THE SUDOKU ──
  "solve the sudoku": {
    solutionJS: `function solveSudoku(board) {
  function isValid(r, c, val) {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === val || board[i][c] === val) return false;
      let boxR = 3 * Math.floor(r / 3) + Math.floor(i / 3);
      let boxC = 3 * Math.floor(c / 3) + i % 3;
      if (board[boxR][boxC] === val) return false;
    }
    return true;
  }
  function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === '.') {
          for (let ch = 1; ch <= 9; ch++) {
            let strCh = String(ch);
            if (isValid(r, c, strCh)) {
              board[r][c] = strCh;
              if (solve()) return true;
              board[r][c] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  solve();
}`,
    solutionPY: `def solveSudoku(board: List[List[str]]) -> None:
    def isValid(r, c, ch):
        for i in range(9):
            if board[r][i] == ch or board[i][c] == ch: return False
            if board[3*(r//3) + i//3][3*(c//3) + i%3] == ch: return False
        return True
    def solve():
        for r in range(9):
            for c in range(9):
                if board[r][c] == '.':
                    for ch in map(str, range(1, 10)):
                        if isValid(r, c, ch):
                            board[r][c] = ch
                            if solve(): return True
                            board[r][c] = '.'
                    return False
        return True
    solve()`,
    solutionCPP: `void solveSudoku(vector<vector<char>>& board) {
    auto isValid = [&](int r, int c, char ch) {
        for (int i = 0; i < 9; i++) {
            if (board[r][i] == ch || board[i][c] == ch) return false;
            if (board[3*(r/3) + i/3][3*(c/3) + i%3] == ch) return false;
        }
        return true;
    };
    function<bool()> solve = [&]() {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') {
                    for (char ch = '1'; ch <= '9'; ch++) {
                        if (isValid(r, c, ch)) {
                            board[r][c] = ch;
                            if (solve()) return true;
                            board[r][c] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };
    solve();
}`,
    visualizerSteps: [
      { line: 1, code: "function solveSudoku(board = 9x9 matrix) {", vars: { emptyCells: "count" }, log: "Initialize 9x9 Sudoku board. Recursive backtracking solver.", arrayState: [{ val: "Cell (0,2): '.'" }, { val: "Cell (0,3): '.'" }] },
      { line: 16, code: "  empty (0, 2) -> try '7': valid! backtrack next cell;", vars: { cell: "(0,2)", val: "'7'", valid: "true" }, log: "Cell (0,2) is empty: Try '7'. Validation passed! Recurse to solve next cell.", arrayState: [{ val: "7", match: true }, { val: "Cell (0,3): '.'" }] },
      { line: 26, code: "  return true; // SUDOKU SOLVED!", vars: { status: "SOLVED" }, log: "Backtracking complete! All 81 cells filled with valid digits 1-9 satisfying Sudoku rules.", arrayState: [{ val: "7", match: true }, { val: "6", match: true }] }
    ]
  },

  // ── 78. SPIRAL MATRIX ──
  "spiral matrix": {
    solutionJS: `function spiralOrder(matrix) {
  let result = [];
  if (!matrix.length) return result;
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) result.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
      left++;
    }
  }
  return result;
}`,
    solutionPY: `def spiralOrder(matrix: List[List[int]]) -> List[int]:
    result = []
    if not matrix: return result
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for i in range(left, right + 1): result.append(matrix[top][i])
        top += 1
        for i in range(top, bottom + 1): result.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for i in range(right, left - 1, -1): result.append(matrix[bottom][i])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1): result.append(matrix[i][left])
            left += 1
    return result`,
    solutionCPP: `vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> result;
    if (matrix.empty()) return result;
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    while (top <= bottom && left <= right) {
        for (int i = left; i <= right; i++) result.push_back(matrix[top][i]);
        top++;
        for (int i = top; i <= bottom; i++) result.push_back(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int i = right; i >= left; i--) result.push_back(matrix[bottom][i]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) result.push_back(matrix[i][left]);
            left++;
        }
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function spiralOrder(matrix = [[1,2,3],[4,5,6],[7,8,9]]) {", vars: { top: "0", bottom: "2", left: "0", right: "2" }, log: "Initialize 3x3 matrix [[1,2,3],[4,5,6],[7,8,9]]. 4-boundary spiral traversal.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8" }, { val: "9" }] },
      { line: 6, code: "  topRow: [1, 2, 3]; top++;", vars: { top: "1", result: "[1, 2, 3]" }, log: "Traverse Top Row (left 0 to right 2): Add 1, 2, 3. Increment top boundary to 1.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8" }, { val: "9" }] },
      { line: 8, code: "  rightCol: [6, 9]; right--;", vars: { right: "1", result: "[1, 2, 3, 6, 9]" }, log: "Traverse Right Column (top 1 to bottom 2): Add 6, 9. Decrement right boundary to 1.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4" }, { val: "5" }, { val: "6", match: true }, { val: "7" }, { val: "8" }, { val: "9", match: true }] },
      { line: 18, code: "  return [1, 2, 3, 6, 9, 8, 7, 4, 5]; // SPIRAL ORDER COMPLETE", vars: { result: "[1, 2, 3, 6, 9, 8, 7, 4, 5]", status: "COMPLETE" }, log: "Spiral traversal complete! Result: [1, 2, 3, 6, 9, 8, 7, 4, 5].", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }, { val: "5", match: true }, { val: "6", match: true }, { val: "7", match: true }, { val: "8", match: true }, { val: "9", match: true }] }
    ]
  },

  // ── 79. LINEAR SEARCH ──
  "linear search": {
    solutionJS: `function search(arr, x) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === x) return i;
  }
  return -1;
}`,
    solutionPY: `def search(arr, x):
    for i, val in enumerate(arr):
        if val == x: return i
    return -1`,
    solutionCPP: `int search(vector<int>& arr, int x) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == x) return i;
    }
    return -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function search(arr = [10, 20, 30, 40, 50], x = 30) {", vars: { x: "30" }, log: "Initialize arr = [10, 20, 30, 40, 50], x = 30. O(N) sequential linear search.", arrayState: [{ val: "10" }, { val: "20" }, { val: "30" }, { val: "40" }, { val: "50" }] },
      { line: 3, code: "  inspect idx 0 (val 10): 10 !== 30", vars: { i: "0", val: "10" }, log: "Index 0: 10 !== 30. Advance to next element.", arrayState: [{ val: "10", active: true }, { val: "20" }, { val: "30" }, { val: "40" }, { val: "50" }] },
      { line: 3, code: "  inspect idx 1 (val 20): 20 !== 30", vars: { i: "1", val: "20" }, log: "Index 1: 20 !== 30. Advance to next element.", arrayState: [{ val: "10" }, { val: "20", active: true }, { val: "30" }, { val: "40" }, { val: "50" }] },
      { line: 3, code: "  inspect idx 2 (val 30): 30 === 30 -> MATCH FOUND!", vars: { i: "2", val: "30", targetIndex: "2" }, log: "Index 2: 30 === 30! Target element match found at index 2!", arrayState: [{ val: "10" }, { val: "20" }, { val: "30", match: true }, { val: "40" }, { val: "50" }] },
      { line: 4, code: "  return 2; // LINEAR SEARCH COMPLETE", vars: { foundIndex: "2", status: "COMPLETE" }, log: "Linear search complete! Target 30 found at index 2.", arrayState: [{ val: "10" }, { val: "20" }, { val: "30", match: true }, { val: "40" }, { val: "50" }] }
    ]
  },

  // ── 80. FIND PAIR GIVEN DIFFERENCE ──
  "find pair given difference": {
    solutionJS: `function findPair(arr, x) {
  arr.sort((a, b) => a - b);
  let i = 0, j = 1;
  while (i < arr.length && j < arr.length) {
    let diff = arr[j] - arr[i];
    if (i !== j && diff === x) return true;
    else if (diff < x) j++;
    else i++;
  }
  return false;
}`,
    solutionPY: `def findPair(arr, x):
    arr.sort()
    i, j = 0, 1
    n = len(arr)
    while i < n and j < n:
        diff = arr[j] - arr[i]
        if i != j and diff == x: return True
        elif diff < x: j += 1
        else: i += 1
    return False`,
    solutionCPP: `bool findPair(vector<int>& arr, int x) {
    sort(arr.begin(), arr.end());
    int i = 0, j = 1, n = arr.size();
    while (i < n && j < n) {
        int diff = arr[j] - arr[i];
        if (i != j && diff == x) return true;
        else if (diff < x) j++;
        else i++;
    }
    return false;
}`,
    visualizerSteps: [
      { line: 1, code: "function findPair(arr = [5, 20, 3, 2, 50, 80], x = 78) {", vars: { x: "78" }, log: "Initialize arr = [5, 20, 3, 2, 50, 80], target diff x = 78. Sort + 2 pointers.", arrayState: [{ val: "5" }, { val: "20" }, { val: "3" }, { val: "2" }, { val: "50" }, { val: "80" }] },
      { line: 2, code: "  arr.sort(); // [2, 3, 5, 20, 50, 80]", vars: { sorted: "[2, 3, 5, 20, 50, 80]" }, log: "Sort array: [2, 3, 5, 20, 50, 80].", arrayState: [{ val: "2" }, { val: "3" }, { val: "5" }, { val: "20" }, { val: "50" }, { val: "80" }] },
      { line: 6, code: "  i = 0 (2), j = 5 (80): 80 - 2 = 78 === 78 -> TARGET PAIR MATCH!", vars: { i: "0 (2)", j: "5 (80)", diff: "78" }, log: "Inspect arr[0] (2) & arr[5] (80): Difference 80 - 2 = 78 === target 78! PAIR MATCH FOUND: (2, 80)!", arrayState: [{ val: "2", match: true }, { val: "3" }, { val: "5" }, { val: "20" }, { val: "50" }, { val: "80", match: true }] },
      { line: 10, code: "  return true; // PAIR DIFFERENCE MATCH COMPLETE", vars: { pairFound: "true", status: "COMPLETE" }, log: "Target difference pair (2, 80) confirmed! Return true.", arrayState: [{ val: "2", match: true }, { val: "3" }, { val: "5" }, { val: "20" }, { val: "50" }, { val: "80", match: true }] }
    ]
  },

  // ── 81. FIRST BAD VERSION ──
  "first bad version": {
    solutionJS: `function solution(isBadVersion) {
  return function(n) {
    let low = 1, high = n;
    while (low < high) {
      let mid = Math.floor(low + (high - low) / 2);
      if (isBadVersion(mid)) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    return low;
  };
}`,
    solutionPY: `def firstBadVersion(n: int) -> int:
    low, high = 1, n
    while low < high:
        mid = low + (high - low) // 2
        if isBadVersion(mid):
            high = mid
        else:
            low = mid + 1
    return low`,
    solutionCPP: `int firstBadVersion(int n) {
    int low = 1, high = n;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (isBadVersion(mid)) high = mid;
        else low = mid + 1;
    }
    return low;
}`,
    visualizerSteps: [
      { line: 1, code: "function firstBadVersion(n = 5, isBadVersion = (v) => v >= 4) {", vars: { n: "5", low: "1", high: "5" }, log: "Initialize n = 5 versions [1, 2, 3, 4, 5]. Binary search for first bad version.", arrayState: [{ val: "v1 (Good)" }, { val: "v2 (Good)" }, { val: "v3 (Good)" }, { val: "v4 (Bad)" }, { val: "v5 (Bad)" }] },
      { line: 6, code: "  mid = 3: isBadVersion(3) == false -> low = 4;", vars: { mid: "3", isBad: "false", low: "4", high: "5" }, log: "Mid = 3: v3 is Good. Search right half: low = 4, high = 5.", arrayState: [{ val: "v1" }, { val: "v2" }, { val: "v3", active: true }, { val: "v4 (Bad)" }, { val: "v5 (Bad)" }] },
      { line: 5, code: "  mid = 4: isBadVersion(4) == true -> high = 4;", vars: { mid: "4", isBad: "true", low: "4", high: "4" }, log: "Mid = 4: v4 is Bad! Candidate first bad version. Search left half: high = 4.", arrayState: [{ val: "v1" }, { val: "v2" }, { val: "v3" }, { val: "v4 (Bad)", match: true }, { val: "v5 (Bad)" }] },
      { line: 11, code: "  low === high === 4 -> FIRST BAD VERSION IS 4!", vars: { firstBadVersion: "4", status: "COMPLETE" }, log: "Binary search converged! Version 4 is the First Bad Version.", arrayState: [{ val: "v1" }, { val: "v2" }, { val: "v3" }, { val: "v4 (Bad)", match: true }, { val: "v5 (Bad)" }] }
    ]
  },

  // ── 82. FIND MISSING AND REPEATING ──
  "find missing and repeating": {
    solutionJS: `function findTwoElement(arr, n) {
  let repeating = -1, missing = -1;
  for (let i = 0; i < n; i++) {
    let absVal = Math.abs(arr[i]);
    if (arr[absVal - 1] < 0) {
      repeating = absVal;
    } else {
      arr[absVal - 1] = -arr[absVal - 1];
    }
  }
  for (let i = 0; i < n; i++) {
    if (arr[i] > 0) {
      missing = i + 1;
    }
  }
  return [repeating, missing];
}`,
    solutionPY: `def findTwoElement(arr, n):
    repeating = -1
    missing = -1
    for i in range(n):
        abs_val = abs(arr[i])
        if arr[abs_val - 1] < 0:
            repeating = abs_val
        else:
            arr[abs_val - 1] = -arr[abs_val - 1]
    for i in range(n):
        if arr[i] > 0:
            missing = i + 1
    return [repeating, missing]`,
    solutionCPP: `vector<int> findTwoElement(vector<int> arr, int n) {
    int repeating = -1, missing = -1;
    for (int i = 0; i < n; i++) {
        int absVal = abs(arr[i]);
        if (arr[absVal - 1] < 0) repeating = absVal;
        else arr[absVal - 1] = -arr[absVal - 1];
    }
    for (int i = 0; i < n; i++) {
        if (arr[i] > 0) missing = i + 1;
    }
    return {repeating, missing};
}`,
    visualizerSteps: [
      { line: 1, code: "function findTwoElement(arr = [3, 1, 3], n = 3) {", vars: { n: "3" }, log: "Initialize arr = [3, 1, 3] from range 1..3. In-place index negation marking.", arrayState: [{ val: "3" }, { val: "1" }, { val: "3" }] },
      { line: 6, code: "  inspect arr[2] (val 3): arr[2] is already -3 -> REPEATING = 3;", vars: { val: "3", indexMarked: "2", repeating: "3" }, log: "Element 3 at idx 2: Index 2 is already negative! REPEATING NUMBER = 3.", arrayState: [{ val: "-3", match: true }, { val: "-1", match: true }, { val: "-3", match: true }] },
      { line: 11, code: "  inspect positive values -> arr[1] is +1 -> MISSING = 2;", vars: { positiveIndex: "1", missing: "2" }, log: "Post-scan: arr[1] remained positive! MISSING NUMBER = 2.", arrayState: [{ val: "-3" }, { val: "+1 (Missing 2)", match: true }, { val: "-3" }] },
      { line: 15, code: "  return [3, 2]; // MISSING AND REPEATING COMPLETE", vars: { repeating: "3", missing: "2", status: "COMPLETE" }, log: "In-place marking complete! Repeating: 3, Missing: 2.", arrayState: [{ val: "Repeating: 3", match: true }, { val: "Missing: 2", match: true }] }
    ]
  },

  // ── 83. MAJORITY ELEMENT ──
  "majority element": {
    solutionJS: `function majorityElement(nums) {
  let count = 0, candidate = null;
  for (let num of nums) {
    if (count === 0) candidate = num;
    count += (num === candidate) ? 1 : -1;
  }
  return candidate;
}`,
    solutionPY: `def majorityElement(nums: List[int]) -> int:
    count = 0
    candidate = None
    for num in nums:
        if count == 0: candidate = num
        count += 1 if num == candidate else -1
    return candidate`,
    solutionCPP: `int majorityElement(vector<int>& nums) {
    int count = 0, candidate = 0;
    for (int num : nums) {
        if (count == 0) candidate = num;
        count += (num == candidate) ? 1 : -1;
    }
    return candidate;
}`,
    visualizerSteps: [
      { line: 1, code: "function majorityElement(nums = [2, 2, 1, 1, 1, 2, 2]) {", vars: { n: "7" }, log: "Initialize nums = [2, 2, 1, 1, 1, 2, 2]. O(N) Boyer-Moore Voting Algorithm.", arrayState: [{ val: "2" }, { val: "2" }, { val: "1" }, { val: "1" }, { val: "1" }, { val: "2" }, { val: "2" }] },
      { line: 4, code: "  pass 1 (val 2) -> candidate = 2, count = 2;", vars: { candidate: "2", count: "2" }, log: "Process 2s: candidate = 2, count = 2.", arrayState: [{ val: "2", match: true }, { val: "2", match: true }, { val: "1" }, { val: "1" }, { val: "1" }, { val: "2" }, { val: "2" }] },
      { line: 4, code: "  pass 2 (val 1s) -> count cancels out -> candidate = 2, count = 3;", vars: { candidate: "2", finalCount: "3" }, log: "Boyer-Moore cancellation: 2s outnumber 1s. Final candidate = 2 with net count = 3.", arrayState: [{ val: "2", match: true }, { val: "2", match: true }, { val: "1" }, { val: "1" }, { val: "1" }, { val: "2", match: true }, { val: "2", match: true }] },
      { line: 7, code: "  return 2; // MAJORITY ELEMENT = 2", vars: { majorityElement: "2", status: "COMPLETE" }, log: "Boyer-Moore voting complete! Majority element (appearing > n/2 times) is 2.", arrayState: [{ val: "2", match: true }, { val: "2", match: true }, { val: "1" }, { val: "1" }, { val: "1" }, { val: "2", match: true }, { val: "2", match: true }] }
    ]
  },

  // ── 84. SEARCHING IN AN ARRAY WHERE ADJACENT DIFFER BY AT MOST K ──
  "searching in an array where adjacent differ by at most k": {
    solutionJS: `function search(arr, n, x, k) {
  let i = 0;
  while (i < n) {
    if (arr[i] === x) return i;
    i = i + Math.max(1, Math.floor(Math.abs(arr[i] - x) / k));
  }
  return -1;
}`,
    solutionPY: `def search(arr, n, x, k):
    i = 0
    while i < n:
        if arr[i] == x: return i
        i += max(1, abs(arr[i] - x) // k)
    return -1`,
    solutionCPP: `int search(int arr[], int n, int x, int k) {
    int i = 0;
    while (i < n) {
        if (arr[i] == x) return i;
        i = i + max(1, abs(arr[i] - x) / k);
    }
    return -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function search(arr = [4, 5, 6, 7, 6], x = 6, k = 1) {", vars: { x: "6", k: "1" }, log: "Initialize arr = [4, 5, 6, 7, 6], x = 6, k = 1. Dynamic jump step formula i += max(1, |arr[i]-x|/k).", arrayState: [{ val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "6" }] },
      { line: 4, code: "  i = 0 (val 4): |4 - 6| / 1 = 2 -> jump 2 steps -> i = 2;", vars: { i: "0", val: "4", jump: "2", nextI: "2" }, log: "Index 0 (4): Difference |4 - 6| = 2. Jump 2 steps to index 2!", arrayState: [{ val: "4", active: true }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "6" }] },
      { line: 3, code: "  i = 2 (val 6): 6 === 6 -> TARGET MATCH FOUND AT INDEX 2!", vars: { i: "2", val: "6", matchIndex: "2" }, log: "Index 2 (6): arr[2] === 6! Match found at index 2!", arrayState: [{ val: "4" }, { val: "5" }, { val: "6", match: true }, { val: "7" }, { val: "6" }] },
      { line: 5, code: "  return 2; // SEARCH ADJACENT DIFFER BY K COMPLETE", vars: { foundIdx: "2", status: "COMPLETE" }, log: "Optimized jump search complete! Target 6 found at index 2.", arrayState: [{ val: "4" }, { val: "5" }, { val: "6", match: true }, { val: "7" }, { val: "6" }] }
    ]
  },

  // ── 85. ZERO SUM SUBARRAYS ──
  "zero sum subarrays": {
    solutionJS: `function findSubarray(arr, n) {
  let map = new Map();
  let prefixSum = 0, count = 0;
  map.set(0, 1);
  for (let i = 0; i < n; i++) {
    prefixSum += arr[i];
    if (map.has(prefixSum)) {
      count += map.get(prefixSum);
    }
    map.set(prefixSum, (map.get(prefixSum) || 0) + 1);
  }
  return count;
}`,
    solutionPY: `def findSubarray(arr, n):
    prefix_map = {0: 1}
    prefix_sum, count = 0, 0
    for num in arr:
        prefix_sum += num
        if prefix_sum in prefix_map:
            count += prefix_map[prefix_sum]
        prefix_map[prefix_sum] = prefix_map.get(prefix_sum, 0) + 1
    return count`,
    solutionCPP: `long long int findSubarray(vector<long long int>& arr, int n) {
    unordered_map<long long int, int> map;
    long long int prefixSum = 0, count = 0;
    map[0] = 1;
    for (int i = 0; i < n; i++) {
        prefixSum += arr[i];
        if (map.count(prefixSum)) count += map[prefixSum];
        map[prefixSum]++;
    }
    return count;
}`,
    visualizerSteps: [
      { line: 1, code: "function findSubarray(arr = [0, 0, 5, 5, 0, 0]) {", vars: { n: "6" }, log: "Initialize arr = [0, 0, 5, 5, 0, 0]. Prefix Sum Hash Map tracking frequency.", arrayState: [{ val: "0" }, { val: "0" }, { val: "5" }, { val: "5" }, { val: "0" }, { val: "0" }] },
      { line: 5, code: "  prefixSum = 0 -> count += 1 (subarrays = 1);", vars: { prefixSum: "0", count: "1" }, log: "Index 0 (0): prefixSum = 0. Map[0] = 1. Subarrays count = 1.", arrayState: [{ val: "0", match: true }, { val: "0" }, { val: "5" }, { val: "5" }, { val: "0" }, { val: "0" }] },
      { line: 5, code: "  accumulate zero sum subarrays -> total count = 6;", vars: { totalZeroSumSubarrays: "6" }, log: "Prefix sum evaluation complete! Total zero-sum subarrays = 6.", arrayState: [{ val: "0", match: true }, { val: "0", match: true }, { val: "5" }, { val: "5" }, { val: "0", match: true }, { val: "0", match: true }] },
      { line: 11, code: "  return 6; // ZERO SUM SUBARRAYS COMPLETE", vars: { count: "6", status: "COMPLETE" }, log: "Zero sum subarrays count returned: 6.", arrayState: [{ val: "0", match: true }, { val: "0", match: true }, { val: "5" }, { val: "5" }, { val: "0", match: true }, { val: "0", match: true }] }
    ]
  },

  // ── 86. BUBBLE SORT ──
  "bubble sort": {
    solutionJS: `function bubbleSort(arr, n) {
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    solutionPY: `def bubbleSort(arr, n):
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped: break
    return arr`,
    solutionCPP: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    visualizerSteps: [
      { line: 1, code: "function bubbleSort(arr = [5, 1, 4, 2, 8]) {", vars: { n: "5" }, log: "Initialize arr = [5, 1, 4, 2, 8]. O(N^2) Bubble Sort algorithm.", arrayState: [{ val: "5" }, { val: "1" }, { val: "4" }, { val: "2" }, { val: "8" }] },
      { line: 5, code: "  swap(5, 1) -> [1, 5, 4, 2, 8];", vars: { arr: "[1, 5, 4, 2, 8]" }, log: "Pass 1: Compare 5 > 1 -> Swap! Array becomes [1, 5, 4, 2, 8].", arrayState: [{ val: "1", match: true }, { val: "5", active: true }, { val: "4" }, { val: "2" }, { val: "8" }] },
      { line: 5, code: "  bubble 8 to end -> subsequent passes sort array to [1, 2, 4, 5, 8];", vars: { sorted: "[1, 2, 4, 5, 8]" }, log: "Bubbling complete across all passes! Final sorted array: [1, 2, 4, 5, 8].", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "4", match: true }, { val: "5", match: true }, { val: "8", match: true }] },
      { line: 11, code: "  return [1, 2, 4, 5, 8]; // BUBBLE SORT COMPLETE", vars: { status: "COMPLETE" }, log: "Bubble Sort execution complete cleanly!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "4", match: true }, { val: "5", match: true }, { val: "8", match: true }] }
    ]
  },

  // ── 87. SELECTION SORT ──
  "selection sort": {
    solutionJS: `function selectionSort(arr, n) {
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
    solutionPY: `def selectionSort(arr, n):
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]: min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    solutionCPP: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
    visualizerSteps: [
      { line: 1, code: "function selectionSort(arr = [64, 25, 12, 22, 11]) {", vars: { n: "5" }, log: "Initialize arr = [64, 25, 12, 22, 11]. Repeatedly select minimum element.", arrayState: [{ val: "64" }, { val: "25" }, { val: "12" }, { val: "22" }, { val: "11" }] },
      { line: 7, code: "  min in [64, 25, 12, 22, 11] is 11 -> swap with 64 -> [11, 25, 12, 22, 64];", vars: { minVal: "11", swapIdx: "0", arr: "[11, 25, 12, 22, 64]" }, log: "Pass 1: Minimum element is 11 at index 4. Swap with index 0 (64) -> [11, 25, 12, 22, 64].", arrayState: [{ val: "11", match: true }, { val: "25" }, { val: "12" }, { val: "22" }, { val: "64" }] },
      { line: 7, code: "  sort remaining elements -> [11, 12, 22, 25, 64];", vars: { sorted: "[11, 12, 22, 25, 64]" }, log: "Subsequent passes select min elements 12, 22, 25 -> Sorted array: [11, 12, 22, 25, 64].", arrayState: [{ val: "11", match: true }, { val: "12", match: true }, { val: "22", match: true }, { val: "25", match: true }, { val: "64", match: true }] },
      { line: 10, code: "  return [11, 12, 22, 25, 64]; // SELECTION SORT COMPLETE", vars: { status: "COMPLETE" }, log: "Selection Sort complete!", arrayState: [{ val: "11", match: true }, { val: "12", match: true }, { val: "22", match: true }, { val: "25", match: true }, { val: "64", match: true }] }
    ]
  },

  // ── 88. INSERTION SORT ──
  "insertion sort": {
    solutionJS: `function insertionSort(arr, n) {
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    solutionPY: `def insertionSort(arr, n):
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    solutionCPP: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    visualizerSteps: [
      { line: 1, code: "function insertionSort(arr = [12, 11, 13, 5, 6]) {", vars: { n: "5" }, log: "Initialize arr = [12, 11, 13, 5, 6]. Left-to-right sorted boundary insertion.", arrayState: [{ val: "12" }, { val: "11" }, { val: "13" }, { val: "5" }, { val: "6" }] },
      { line: 3, code: "  key = 11: shift 12 right -> [11, 12, 13, 5, 6];", vars: { key: "11", arr: "[11, 12, 13, 5, 6]" }, log: "Index 1 (key 11): 12 > 11. Shift 12 right. Insert 11 at index 0.", arrayState: [{ val: "11", match: true }, { val: "12", match: true }, { val: "13" }, { val: "5" }, { val: "6" }] },
      { line: 3, code: "  key = 5: shift 13, 12, 11 right -> [5, 11, 12, 13, 6];", vars: { key: "5", arr: "[5, 11, 12, 13, 6]" }, log: "Index 3 (key 5): 13, 12, 11 > 5. Shift elements right. Insert 5 at index 0.", arrayState: [{ val: "5", match: true }, { val: "11", match: true }, { val: "12", match: true }, { val: "13", match: true }, { val: "6" }] },
      { line: 10, code: "  return [5, 6, 11, 12, 13]; // INSERTION SORT COMPLETE", vars: { sorted: "[5, 6, 11, 12, 13]", status: "COMPLETE" }, log: "Insertion Sort complete! Final sorted array: [5, 6, 11, 12, 13].", arrayState: [{ val: "5", match: true }, { val: "6", match: true }, { val: "11", match: true }, { val: "12", match: true }, { val: "13", match: true }] }
    ]
  },

  // ── 89. MERGE SORT ──
  "merge sort": {
    solutionJS: `function mergeSort(arr, l = 0, r = arr.length - 1) {
  if (l >= r) return;
  let m = Math.floor(l + (r - l) / 2);
  mergeSort(arr, l, m);
  mergeSort(arr, m + 1, r);
  merge(arr, l, m, r);
  return arr;
}
function merge(arr, l, m, r) {
  let left = arr.slice(l, m + 1);
  let right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) arr[k++] = left[i++];
    else arr[k++] = right[j++];
  }
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}`,
    solutionPY: `def mergeSort(arr, l=0, r=None):
    if r is None: r = len(arr) - 1
    if l >= r: return
    m = l + (r - l) // 2
    mergeSort(arr, l, m)
    mergeSort(arr, m + 1, r)
    left = arr[l:m+1]
    right = arr[m+1:r+1]
    i = j = 0
    k = l
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            arr[k] = left[i]; i += 1
        else:
            arr[k] = right[j]; j += 1
        k += 1
    while i < len(left): arr[k] = left[i]; i += 1; k += 1
    while j < len(right): arr[k] = right[j]; j += 1; k += 1`,
    solutionCPP: `void mergeSort(int arr[], int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`,
    visualizerSteps: [
      { line: 1, code: "function mergeSort(arr = [4, 1, 3, 9, 7]) {", vars: { n: "5" }, log: "Initialize arr = [4, 1, 3, 9, 7]. O(N log N) Divide and Conquer Merge Sort.", arrayState: [{ val: "4" }, { val: "1" }, { val: "3" }, { val: "9" }, { val: "7" }] },
      { line: 3, code: "  divide -> left [4, 1, 3], right [9, 7];", vars: { left: "[4, 1, 3]", right: "[9, 7]" }, log: "Divide phase: Sub-array left [4, 1, 3], sub-array right [9, 7].", arrayState: [{ val: "4" }, { val: "1" }, { val: "3" }, { val: "9" }, { val: "7" }] },
      { line: 5, code: "  merge left [1, 3, 4] with right [7, 9] -> [1, 3, 4, 7, 9];", vars: { merged: "[1, 3, 4, 7, 9]" }, log: "Conquer phase: 2-pointer merge left [1, 3, 4] & right [7, 9] -> Sorted [1, 3, 4, 7, 9].", arrayState: [{ val: "1", match: true }, { val: "3", match: true }, { val: "4", match: true }, { val: "7", match: true }, { val: "9", match: true }] },
      { line: 7, code: "  return [1, 3, 4, 7, 9]; // MERGE SORT COMPLETE", vars: { status: "COMPLETE" }, log: "Merge Sort execution complete!", arrayState: [{ val: "1", match: true }, { val: "3", match: true }, { val: "4", match: true }, { val: "7", match: true }, { val: "9", match: true }] }
    ]
  },

  // ── 90. TWO SUM II - INPUT ARRAY IS SORTED ──
  "two sum ii - input array is sorted": {
    solutionJS: `function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    let sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    else if (sum < target) left++;
    else right--;
  }
  return [];
}`,
    solutionPY: `def twoSum(numbers: List[int], target: int) -> List[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        curr = numbers[left] + numbers[right]
        if curr == target: return [left + 1, right + 1]
        elif curr < target: left += 1
        else: right -= 1
    return []`,
    solutionCPP: `vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0, right = numbers.size() - 1;
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) return {left + 1, right + 1};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}`,
    visualizerSteps: [
      { line: 1, code: "function twoSum(numbers = [2, 7, 11, 15], target = 9) {", vars: { target: "9", left: "0 (2)", right: "3 (15)" }, log: "Initialize numbers = [2, 7, 11, 15], target = 9. 2-pointer scan on 1-indexed sorted array.", arrayState: [{ val: "2" }, { val: "7" }, { val: "11" }, { val: "15" }] },
      { line: 4, code: "  left = 0 (2), right = 3 (15): 2 + 15 = 17 > 9 -> right--;", vars: { sum: "17", right: "2 (11)" }, log: "Sum 2 + 15 = 17 > 9: Exceeds target! Decrement right pointer.", arrayState: [{ val: "2", active: true }, { val: "7" }, { val: "11" }, { val: "15", active: true }] },
      { line: 5, code: "  left = 0 (2), right = 1 (7): 2 + 7 = 9 === 9 -> TARGET MATCH FOUND!", vars: { sum: "9", ans: "[1, 2]" }, log: "Sum 2 + 7 = 9 === target 9! Match found at 1-based indices [1, 2]!", arrayState: [{ val: "2", match: true }, { val: "7", match: true }, { val: "11" }, { val: "15" }] },
      { line: 6, code: "  return [1, 2]; // TWO SUM II COMPLETE", vars: { indices: "[1, 2]", status: "COMPLETE" }, log: "Two Sum II search complete!", arrayState: [{ val: "2", match: true }, { val: "7", match: true }, { val: "11" }, { val: "15" }] }
    ]
  },

  // ── 91. PERMUTATION IN STRING ──
  "permutation in string": {
    solutionJS: `function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  let count1 = new Array(26).fill(0);
  let count2 = new Array(26).fill(0);
  for (let i = 0; i < s1.length; i++) {
    count1[s1.charCodeAt(i) - 97]++;
    count2[s2.charCodeAt(i) - 97]++;
  }
  for (let i = 0; i < s2.length - s1.length; i++) {
    if (count1.every((val, idx) => val === count2[idx])) return true;
    count2[s2.charCodeAt(i + s1.length) - 97]++;
    count2[s2.charCodeAt(i) - 97]--;
  }
  return count1.every((val, idx) => val === count2[idx]);
}`,
    solutionPY: `def checkInclusion(s1: str, s2: str) -> bool:
    if len(s1) > len(s2): return False
    c1, c2 = collections.Counter(s1), collections.Counter(s2[:len(s1)])
    if c1 == c2: return True
    for i in range(len(s1), len(s2)):
        c2[s2[i]] += 1
        c2[s2[i - len(s1)]] -= 1
        if c2[s2[i - len(s1)]] == 0: del c2[s2[i - len(s1)]]
        if c1 == c2: return True
    return False`,
    solutionCPP: `bool checkInclusion(string s1, string s2) {
    if (s1.length() > s2.length()) return false;
    vector<int> c1(26, 0), c2(26, 0);
    for (int i = 0; i < s1.length(); i++) {
        c1[s1[i] - 'a']++; c2[s2[i] - 'a']++;
    }
    for (int i = 0; i < s2.length() - s1.length(); i++) {
        if (c1 == c2) return true;
        c2[s2[i + s1.length()] - 'a']++;
        c2[s2[i] - 'a']--;
    }
    return c1 == c2;
}`,
    visualizerSteps: [
      { line: 1, code: "function checkInclusion(s1 = 'ab', s2 = 'eidbaooo') {", vars: { s1: "'ab'", s2: "'eidbaooo'", windowSize: "2" }, log: "Initialize s1 = 'ab', s2 = 'eidbaooo'. Fixed size 2 sliding window.", arrayState: [{ val: "e" }, { val: "i" }, { val: "d" }, { val: "b" }, { val: "a" }, { val: "o" }, { val: "o" }, { val: "o" }] },
      { line: 10, code: "  window 'ba' (idx 3..4): matches frequency of 'ab' -> MATCH FOUND!", vars: { window: "'ba'", match: "true" }, log: "Window 'ba' at index 3..4: Frequency matches 'ab'! Permutation in string confirmed!", arrayState: [{ val: "e" }, { val: "i" }, { val: "d" }, { val: "b", match: true }, { val: "a", match: true }, { val: "o" }, { val: "o" }, { val: "o" }] },
      { line: 14, code: "  return true; // PERMUTATION IN STRING COMPLETE", vars: { result: "true", status: "COMPLETE" }, log: "Permutation match found! Return true.", arrayState: [{ val: "e" }, { val: "i" }, { val: "d" }, { val: "b", match: true }, { val: "a", match: true }, { val: "o" }, { val: "o" }, { val: "o" }] }
    ]
  },

  // ── 92. IMPLEMENT TWO STACKS IN AN ARRAY ──
  "implement two stacks in an array": {
    solutionJS: `class TwoStacks {
  constructor(n = 100) {
    this.arr = new Array(n);
    this.top1 = -1;
    this.top2 = n;
  }
  push1(x) {
    if (this.top1 < this.top2 - 1) this.arr[++this.top1] = x;
  }
  push2(x) {
    if (this.top1 < this.top2 - 1) this.arr[--this.top2] = x;
  }
  pop1() {
    return this.top1 >= 0 ? this.arr[this.top1--] : -1;
  }
  pop2() {
    return this.top2 < this.arr.length ? this.arr[this.top2++] : -1;
  }
}`,
    solutionPY: `class TwoStacks:
    def __init__(self, n=100):
        self.size = n
        self.arr = [None] * n
        self.top1 = -1
        self.top2 = n
    def push1(self, x):
        if self.top1 < self.top2 - 1:
            self.top1 += 1; self.arr[self.top1] = x
    def push2(self, x):
        if self.top1 < self.top2 - 1:
            self.top2 -= 1; self.arr[self.top2] = x
    def pop1(self):
        if self.top1 >= 0:
            val = self.arr[self.top1]; self.top1 -= 1; return val
        return -1
    def pop2(self):
        if self.top2 < self.size:
            val = self.arr[self.top2]; self.top2 += 1; return val
        return -1`,
    solutionCPP: `class twoStacks {
    int *arr; int size; int top1, top2;
public:
    twoStacks(int n=100) {
        size = n; arr = new int[n]; top1 = -1; top2 = n;
    }
    void push1(int x) { if (top1 < top2 - 1) arr[++top1] = x; }
    void push2(int x) { if (top1 < top2 - 1) arr[--top2] = x; }
    int pop1() { return top1 >= 0 ? arr[top1--] : -1; }
    int pop2() { return top2 < size ? arr[top2++] : -1; }
};`,
    visualizerSteps: [
      { line: 1, code: "class TwoStacks(n = 6) { top1 = -1, top2 = 6;", vars: { top1: "-1", top2: "6", capacity: "6" }, log: "Initialize array of size 6. top1 grows rightward from -1, top2 grows leftward from 6.", arrayState: [{ val: "arr[0]" }, { val: "arr[1]" }, { val: "arr[2]" }, { val: "arr[3]" }, { val: "arr[4]" }, { val: "arr[5]" }] },
      { line: 7, code: "  push1(2) -> top1 = 0; push2(3) -> top2 = 5;", vars: { top1: "0 (val 2)", top2: "5 (val 3)" }, log: "push1(2): arr[0] = 2. push2(3): arr[5] = 3.", arrayState: [{ val: "2 (S1)", match: true }, { val: "arr[1]" }, { val: "arr[2]" }, { val: "arr[3]" }, { val: "arr[4]" }, { val: "3 (S2)", match: true }] },
      { line: 13, code: "  pop1() -> 2; pop2() -> 3;", vars: { popped1: "2", popped2: "3", top1: "-1", top2: "6" }, log: "pop1() returns 2. pop2() returns 3. Two stacks operation complete cleanly!", arrayState: [{ val: "arr[0]" }, { val: "arr[1]" }, { val: "arr[2]" }, { val: "arr[3]" }, { val: "arr[4]" }, { val: "arr[5]" }] }
    ]
  },

  // ── 93. QUEUE REVERSAL ──
  "queue reversal": {
    solutionJS: `function rev(q) {
  let stack = [];
  while (!q.isEmpty()) {
    stack.push(q.pop());
  }
  while (stack.length > 0) {
    q.push(stack.pop());
  }
  return q;
}`,
    solutionPY: `def rev(q):
    stack = []
    while not q.empty():
        stack.append(q.get())
    while stack:
        q.put(stack.pop())
    return q`,
    solutionCPP: `queue<int> rev(queue<int> q) {
    stack<int> s;
    while (!q.empty()) {
        s.push(q.front()); q.pop();
    }
    while (!s.empty()) {
        q.push(s.top()); s.pop();
    }
    return q;
}`,
    visualizerSteps: [
      { line: 1, code: "function rev(q = [4, 3, 1, 10, 26]) {", vars: { q: "[4, 3, 1, 10, 26]" }, log: "Initialize Queue = [4, 3, 1, 10, 26]. Auxiliary Stack push/pop reversal.", arrayState: [{ val: "4" }, { val: "3" }, { val: "1" }, { val: "10" }, { val: "26" }] },
      { line: 4, code: "  stack.push() -> Stack: [4, 3, 1, 10, 26] (top is 26);", vars: { stack: "[4, 3, 1, 10, 26]", top: "26" }, log: "Dequeue all elements into Stack: Stack top is 26, bottom is 4.", arrayState: [{ val: "4" }, { val: "3" }, { val: "1" }, { val: "10" }, { val: "26" }] },
      { line: 7, code: "  q.push(stack.pop()) -> Reversed Queue: [26, 10, 1, 3, 4];", vars: { reversedQueue: "[26, 10, 1, 3, 4]" }, log: "Pop Stack back into Queue: Resulting Queue is [26, 10, 1, 3, 4]!", arrayState: [{ val: "26", match: true }, { val: "10", match: true }, { val: "1", match: true }, { val: "3", match: true }, { val: "4", match: true }] },
      { line: 9, code: "  return q; // QUEUE REVERSAL COMPLETE", vars: { status: "COMPLETE" }, log: "Queue reversal complete cleanly!", arrayState: [{ val: "26", match: true }, { val: "10", match: true }, { val: "1", match: true }, { val: "3", match: true }, { val: "4", match: true }] }
    ]
  },

  // ── 94. QUEUE USING TWO STACKS ──
  "queue using two stacks": {
    solutionJS: `class StackQueue {
  constructor() {
    this.s1 = [];
    this.s2 = [];
  }
  push(x) {
    this.s1.push(x);
  }
  pop() {
    if (!this.s2.length) {
      while (this.s1.length) this.s2.push(this.s1.pop());
    }
    return this.s2.length ? this.s2.pop() : -1;
  }
}`,
    solutionPY: `class StackQueue:
    def __init__(self):
        self.s1 = []
        self.s2 = []
    def push(self, x):
        self.s1.append(x)
    def pop(self):
        if not self.s2:
            while self.s1:
                self.s2.append(self.s1.pop())
        return self.s2.pop() if self.s2 else -1`,
    solutionCPP: `class StackQueue {
    stack<int> s1, s2;
public:
    void push(int x) { s1.push(x); }
    int pop() {
        if (s2.empty()) {
            while (!s1.empty()) { s2.push(s1.top()); s1.pop(); }
        }
        if (s2.empty()) return -1;
        int val = s2.top(); s2.pop(); return val;
    }
};`,
    visualizerSteps: [
      { line: 1, code: "class StackQueue { s1 = [], s2 = [];", vars: { s1: "[]", s2: "[]" }, log: "Initialize FIFO Queue using 2 LIFO Stacks (s1 & s2).", arrayState: [{ val: "s1: []" }, { val: "s2: []" }] },
      { line: 5, code: "  push(1), push(2) -> s1 = [1, 2];", vars: { s1: "[1, 2]", s2: "[]" }, log: "Enqueue 1 and 2: s1 = [1, 2].", arrayState: [{ val: "s1: [1, 2]", match: true }, { val: "s2: []" }] },
      { line: 8, code: "  pop() -> transfer s1 -> s2 = [2, 1]; pop s2 -> returns 1;", vars: { s1: "[]", s2: "[2]", popped: "1" }, log: "Dequeue: s2 is empty. Transfer s1 -> s2 = [2, 1]. Pop s2 top -> returns 1!", arrayState: [{ val: "s1: []" }, { val: "s2: [2]", match: true }] },
      { line: 11, code: "  pop() -> pop s2 -> returns 2; // QUEUE USING STACKS COMPLETE", vars: { s1: "[]", s2: "[]", popped: "2", status: "COMPLETE" }, log: "Dequeue: Pop s2 top -> returns 2. Queue using two stacks complete cleanly!", arrayState: [{ val: "s1: []" }, { val: "s2: []" }] }
    ]
  },

  // ── 95. REVERSE FIRST K ELEMENTS OF QUEUE ──
  "reverse first k elements of queue": {
    solutionJS: `function modifyQueue(q, k) {
  let stack = [];
  for (let i = 0; i < k; i++) {
    stack.push(q.shift());
  }
  while (stack.length > 0) {
    q.push(stack.pop());
  }
  let rem = q.length - k;
  for (let i = 0; i < rem; i++) {
    q.push(q.shift());
  }
  return q;
}`,
    solutionPY: `def modifyQueue(q, k):
    stack = []
    for _ in range(k):
        stack.append(q.pop(0))
    while stack:
        q.append(stack.pop())
    for _ in range(len(q) - k):
        q.append(q.pop(0))
    return q`,
    solutionCPP: `queue<int> modifyQueue(queue<int> q, int k) {
    stack<int> s;
    for (int i = 0; i < k; i++) { s.push(q.front()); q.pop(); }
    while (!s.empty()) { q.push(s.top()); s.pop(); }
    int rem = q.size() - k;
    for (int i = 0; i < rem; i++) { q.push(q.front()); q.pop(); }
    return q;
}`,
    visualizerSteps: [
      { line: 1, code: "function modifyQueue(q = [1, 2, 3, 4, 5], k = 3) {", vars: { q: "[1, 2, 3, 4, 5]", k: "3" }, log: "Initialize Queue = [1, 2, 3, 4, 5], k = 3. Reverse first k elements using stack.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }] },
      { line: 3, code: "  dequeue 3 to stack -> Stack: [3, 2, 1]; Queue: [4, 5];", vars: { stack: "[3, 2, 1]", q: "[4, 5]" }, log: "Dequeue first 3 elements into Stack: Stack = [3, 2, 1], Queue = [4, 5].", arrayState: [{ val: "1", active: true }, { val: "2", active: true }, { val: "3", active: true }, { val: "4" }, { val: "5" }] },
      { line: 10, code: "  pop stack & rotate remaining -> Queue: [3, 2, 1, 4, 5];", vars: { modifiedQueue: "[3, 2, 1, 4, 5]" }, log: "Pop Stack back to Queue & rotate remaining elements: Result = [3, 2, 1, 4, 5].", arrayState: [{ val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "4", match: true }, { val: "5", match: true }] },
      { line: 12, code: "  return [3, 2, 1, 4, 5]; // REVERSE FIRST K ELEMENTS COMPLETE", vars: { status: "COMPLETE" }, log: "Reversal of first 3 elements complete!", arrayState: [{ val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "4", match: true }, { val: "5", match: true }] }
    ]
  },

  // ── 96. REVERSE STACK USING RECURSION ──
  "reverse stack using recursion": {
    solutionJS: `function reverseStack(st) {
  if (!st.length) return;
  let top = st.pop();
  reverseStack(st);
  insertAtBottom(st, top);
}
function insertAtBottom(st, x) {
  if (!st.length) {
    st.push(x);
    return;
  }
  let temp = st.pop();
  insertAtBottom(st, x);
  st.push(temp);
}`,
    solutionPY: `def reverseStack(st):
    if not st: return
    top = st.pop()
    reverseStack(st)
    def insertAtBottom(x):
        if not st:
            st.append(x); return
        temp = st.pop()
        insertAtBottom(x)
        st.append(temp)
    insertAtBottom(top)`,
    solutionCPP: `void reverseStack(stack<int> &st) {
    if (st.empty()) return;
    int top = st.top(); st.pop();
    reverseStack(st);
    insertAtBottom(st, top);
}
void insertAtBottom(stack<int> &st, int x) {
    if (st.empty()) { st.push(x); return; }
    int temp = st.top(); st.pop();
    insertAtBottom(st, x);
    st.push(temp);
}`,
    visualizerSteps: [
      { line: 1, code: "function reverseStack(st = [1, 2, 3, 4, 5]) {", vars: { top: "5" }, log: "Initialize Stack Top [5, 4, 3, 2, 1] Bottom. Recursive stack unwinding & bottom insertion.", arrayState: [{ val: "5 (Top)" }, { val: "4" }, { val: "3" }, { val: "2" }, { val: "1 (Bottom)" }] },
      { line: 3, code: "  pop 5 -> reverseStack([4, 3, 2, 1]) -> insertAtBottom(5);", vars: { poppedTop: "5" }, log: "Pop 5: Recursively reverse remaining stack [4, 3, 2, 1] then insert 5 at bottom.", arrayState: [{ val: "4" }, { val: "3" }, { val: "2" }, { val: "1" }] },
      { line: 5, code: "  reversed stack -> Top [1, 2, 3, 4, 5] Bottom;", vars: { reversedStack: "Top [1, 2, 3, 4, 5] Bottom" }, log: "Stack fully reversed! Top is now 1 and Bottom is 5.", arrayState: [{ val: "1 (Top)", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }, { val: "5 (Bottom)", match: true }] },
      { line: 6, code: "  return st; // REVERSE STACK RECURSION COMPLETE", vars: { status: "COMPLETE" }, log: "In-place recursive stack reversal complete!", arrayState: [{ val: "1 (Top)", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }, { val: "5 (Bottom)", match: true }] }
    ]
  },

  // ── 97. SORT A STACK (USING RECURSION) ──
  "sort a stack (using recursion)": {
    solutionJS: `function sortStack(st) {
  if (!st.length) return;
  let temp = st.pop();
  sortStack(st);
  sortedInsert(st, temp);
}
function sortedInsert(st, element) {
  if (!st.length || element > st[st.length - 1]) {
    st.push(element);
    return;
  }
  let temp = st.pop();
  sortedInsert(st, element);
  st.push(temp);
}`,
    solutionPY: `def sortStack(st):
    if not st: return
    temp = st.pop()
    sortStack(st)
    def sortedInsert(x):
        if not st or x > st[-1]:
            st.append(x); return
        top_val = st.pop()
        sortedInsert(x)
        st.append(top_val)
    sortedInsert(temp)`,
    solutionCPP: `void sortStack(stack<int> &st) {
    if (st.empty()) return;
    int temp = st.top(); st.pop();
    sortStack(st);
    sortedInsert(st, temp);
}
void sortedInsert(stack<int> &st, int element) {
    if (st.empty() || element > st.top()) { st.push(element); return; }
    int temp = st.top(); st.pop();
    sortedInsert(st, element);
    st.push(temp);
}`,
    visualizerSteps: [
      { line: 1, code: "function sortStack(st = [3, 2, 1, 4]) {", vars: { top: "4" }, log: "Initialize Stack Top [4, 1, 2, 3] Bottom. Recursive sorted insertion.", arrayState: [{ val: "4 (Top)" }, { val: "1" }, { val: "2" }, { val: "3 (Bottom)" }] },
      { line: 3, code: "  pop 4 -> sort remaining -> sortedInsert(4);", vars: { popped: "4" }, log: "Pop 4: Sort remaining stack [1, 2, 3], then insert 4 into sorted position (top).", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }] },
      { line: 5, code: "  sorted stack -> Top [4, 3, 2, 1] Bottom;", vars: { sortedStack: "Top [4, 3, 2, 1] Bottom" }, log: "Stack sorted! Largest element (4) is on top, smallest (1) at bottom.", arrayState: [{ val: "4 (Top)", match: true }, { val: "3", match: true }, { val: "2", match: true }, { val: "1 (Bottom)", match: true }] },
      { line: 6, code: "  return st; // SORT STACK RECURSION COMPLETE", vars: { status: "COMPLETE" }, log: "Recursive stack sorting complete!", arrayState: [{ val: "4 (Top)", match: true }, { val: "3", match: true }, { val: "2", match: true }, { val: "1 (Bottom)", match: true }] }
    ]
  },

  // ── 98. VALID PARENTHESES ──
  "valid parentheses": {
    solutionJS: `function isValid(s) {
  let stack = [];
  let map = { ')': '(', ']': '[', '}': '{' };
  for (let ch of s) {
    if (ch in map) {
      if (!stack.length || stack.pop() !== map[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
    solutionPY: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "]": "[", "}": "{"}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top: return False
        else:
            stack.append(char)
    return not stack`,
    solutionCPP: `bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') st.push(c);
        else {
            if (st.empty()) return false;
            if (c == ')' && st.top() != '(') return false;
            if (c == ']' && st.top() != '[') return false;
            if (c == '}' && st.top() != '{') return false;
            st.pop();
        }
    }
    return st.empty();
}`,
    visualizerSteps: [
      { line: 1, code: "function isValid(s = '([{}])') {", vars: { s: "'([{}])'" }, log: "Initialize string '([{}])'. Stack tracking open brackets.", arrayState: [{ val: "(" }, { val: "[" }, { val: "{" }, { val: "}" }, { val: "]" }, { val: ")" }] },
      { line: 7, code: "  push '(', '[', '{' -> stack: ['(', '[', '{'];", vars: { stack: "['(', '[', '{']" }, log: "Push open brackets '(', '[', '{' onto stack.", arrayState: [{ val: "(", match: true }, { val: "[", match: true }, { val: "{", match: true }, { val: "}" }, { val: "]" }, { val: ")" }] },
      { line: 4, code: "  pop '}', ']', ')' -> stack pops cleanly matching all pairs!", vars: { stack: "[]" }, log: "Match closing brackets: '}' matches '{', ']' matches '[', ')' matches '('. Stack is empty!", arrayState: [{ val: "(", match: true }, { val: "[", match: true }, { val: "{", match: true }, { val: "}", match: true }, { val: "]", match: true }, { val: ")", match: true }] },
      { line: 10, code: "  return true; // VALID PARENTHESES COMPLETE", vars: { isValid: "true", status: "COMPLETE" }, log: "All bracket pairs matched! Return true.", arrayState: [{ val: "(", match: true }, { val: "[", match: true }, { val: "{", match: true }, { val: "}", match: true }, { val: "]", match: true }, { val: ")", match: true }] }
    ]
  },

  // ── 99. CAR FLEET ──
  "car fleet": {
    solutionJS: `function carFleet(target, position, speed) {
  let cars = position.map((p, i) => ({ pos: p, time: (target - p) / speed[i] }));
  cars.sort((a, b) => b.pos - a.pos);
  let fleets = 0, maxTime = 0;
  for (let car of cars) {
    if (car.time > maxTime) {
      fleets++;
      maxTime = car.time;
    }
  }
  return fleets;
}`,
    solutionPY: `def carFleet(target: int, position: List[int], speed: List[int]) -> int:
    cars = sorted(zip(position, speed), reverse=True)
    times = [(target - p) / s for p, s in cars]
    ans = 0
    max_time = 0
    for t in times:
        if t > max_time:
            ans += 1
            max_time = t
    return ans`,
    solutionCPP: `int carFleet(int target, vector<int>& position, vector<int>& speed) {
    int n = position.size();
    vector<pair<int, double>> cars(n);
    for (int i = 0; i < n; i++) {
        cars[i] = {position[i], (double)(target - position[i]) / speed[i]};
    }
    sort(cars.rbegin(), cars.rend());
    int fleets = 0; double maxTime = 0;
    for (int i = 0; i < n; i++) {
        if (cars[i].second > maxTime) {
            fleets++;
            maxTime = cars[i].second;
        }
    }
    return fleets;
}`,
    visualizerSteps: [
      { line: 1, code: "function carFleet(target = 12, pos = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]) {", vars: { target: "12" }, log: "Initialize target 12. Compute travel times and sort by position descending.", arrayState: [{ val: "pos 10 (t: 1.0)" }, { val: "pos 8 (t: 1.0)" }, { val: "pos 5 (t: 7.0)" }, { val: "pos 3 (t: 3.0)" }, { val: "pos 0 (t: 12.0)" }] },
      { line: 4, code: "  pos 8 car (t=1.0) catches pos 10 car (t=1.0) -> Fleet 1;", vars: { fleet1: "pos 10 & 8", maxTime: "1.0", fleets: "1" }, log: "Pos 8 car catches up to pos 10 car: Merges into Fleet 1 (max time = 1.0).", arrayState: [{ val: "Fleet 1 (pos 10 & 8)", match: true }, { val: "pos 5 (t: 7.0)" }, { val: "pos 3 (t: 3.0)" }, { val: "pos 0 (t: 12.0)" }] },
      { line: 4, code: "  pos 3 car (t=3.0) catches pos 5 car (t=7.0) -> Fleet 2;", vars: { fleet2: "pos 5 & 3", maxTime: "7.0", fleets: "2" }, log: "Pos 3 car catches up to pos 5 car: Merges into Fleet 2 (max time = 7.0).", arrayState: [{ val: "Fleet 1 (pos 10 & 8)", match: true }, { val: "Fleet 2 (pos 5 & 3)", match: true }, { val: "pos 0 (t: 12.0)" }] },
      { line: 9, code: "  return 3; // CAR FLEET COMPLETE", vars: { totalFleets: "3", status: "COMPLETE" }, log: "Car fleet evaluation complete! Total 3 distinct car fleets reach target.", arrayState: [{ val: "Fleet 1", match: true }, { val: "Fleet 2", match: true }, { val: "Fleet 3 (pos 0)", match: true }] }
    ]
  },

  // ── 100. CIRCULAR TOUR (PETROL PUMP PROBLEM) ──
  "circular tour (petrol pump problem)": {
    solutionJS: `function tour(p, n) {
  let start = 0, deficit = 0, capacity = 0;
  for (let i = 0; i < n; i++) {
    capacity += p[i].petrol - p[i].distance;
    if (capacity < 0) {
      start = i + 1;
      deficit += capacity;
      capacity = 0;
    }
  }
  return (capacity + deficit >= 0) ? start : -1;
}`,
    solutionPY: `def tour(p, n):
    start = deficit = capacity = 0
    for i in range(n):
        capacity += p[i][0] - p[i][1]
        if capacity < 0:
            start = i + 1
            deficit += capacity
            capacity = 0
    return start if (capacity + deficit >= 0) else -1`,
    solutionCPP: `int tour(petrolPump p[], int n) {
    int start = 0, deficit = 0, capacity = 0;
    for (int i = 0; i < n; i++) {
        capacity += p[i].petrol - p[i].distance;
        if (capacity < 0) {
            start = i + 1;
            deficit += capacity;
            capacity = 0;
        }
    }
    return (capacity + deficit >= 0) ? start : -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function tour(p = [P0:[4,6], P1:[6,5], P2:[7,3], P3:[4,5]], n = 4) {", vars: { n: "4" }, log: "Initialize 4 petrol pumps. Single-pass balance & deficit tracking.", arrayState: [{ val: "P0: 4, 6" }, { val: "P1: 6, 5" }, { val: "P2: 7, 3" }, { val: "P3: 4, 5" }] },
      { line: 5, code: "  P0 (4-6 = -2 < 0) -> deficit += -2; reset start = 1;", vars: { start: "1", deficit: "-2", capacity: "0" }, log: "P0 petrol insufficient (-2): Deficit accumulated. Reset starting pump to P1 (idx 1).", arrayState: [{ val: "P0 (Deficit -2)" }, { val: "P1: 6, 5", active: true }, { val: "P2: 7, 3" }, { val: "P3: 4, 5" }] },
      { line: 4, code: "  P1 (6-5=1), P2 (7-3=4), P3 (4-5=-1) -> net balance = 4 >= deficit 2!", vars: { netCapacity: "4", deficit: "-2", start: "1" }, log: "P1 to P3 circuit: Surplus capacity 4 satisfies deficit -2! Circular tour possible starting at P1.", arrayState: [{ val: "P0" }, { val: "P1 (Start)", match: true }, { val: "P2", match: true }, { val: "P3", match: true }] },
      { line: 10, code: "  return 1; // CIRCULAR TOUR START INDEX = 1", vars: { startingPump: "1", status: "COMPLETE" }, log: "Circular tour start index confirmed: 1 (P1).", arrayState: [{ val: "P0" }, { val: "P1 (Start)", match: true }, { val: "P2", match: true }, { val: "P3", match: true }] }
    ]
  },

  // ── 101. DAILY TEMPERATURES ──
  "daily temperatures": {
    solutionJS: `function dailyTemperatures(temperatures) {
  let n = temperatures.length;
  let ans = new Array(n).fill(0);
  let stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      let prev = stack.pop();
      ans[prev] = i - prev;
    }
    stack.push(i);
  }
  return ans;
}`,
    solutionPY: `def dailyTemperatures(temperatures: List[int]) -> List[int]:
    n = len(temperatures)
    ans = [0] * n
    stack = []
    for i, t in enumerate(temperatures):
        while stack and t > temperatures[stack[-1]]:
            prev = stack.pop()
            ans[prev] = i - prev
        stack.append(i)
    return ans`,
    solutionCPP: `vector<int> dailyTemperatures(vector<int>& temperatures) {
    int n = temperatures.size();
    vector<int> ans(n, 0);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {
            int prev = st.top(); st.pop();
            ans[prev] = i - prev;
        }
        st.push(i);
    }
    return ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function dailyTemperatures(temperatures = [73, 74, 75, 71, 69, 72, 76, 73]) {", vars: { n: "8" }, log: "Initialize temperatures = [73, 74, 75, 71, 69, 72, 76, 73]. Monotonic decreasing stack.", arrayState: [{ val: "73" }, { val: "74" }, { val: "75" }, { val: "71" }, { val: "69" }, { val: "72" }, { val: "76" }, { val: "73" }] },
      { line: 6, code: "  idx 1 (74) > 73 (idx 0) -> ans[0] = 1 - 0 = 1;", vars: { poppedIdx: "0", warmerDays: "1" }, log: "Index 1 (74°): Warmer than 73° at index 0. ans[0] = 1 day wait.", arrayState: [{ val: "73 (ans: 1)", match: true }, { val: "74", active: true }, { val: "75" }, { val: "71" }, { val: "69" }, { val: "72" }, { val: "76" }, { val: "73" }] },
      { line: 11, code: "  return [1, 1, 4, 2, 1, 1, 0, 0]; // DAILY TEMPERATURES COMPLETE", vars: { ans: "[1, 1, 4, 2, 1, 1, 0, 0]", status: "COMPLETE" }, log: "Daily temperatures evaluation complete! Resulting wait days array: [1, 1, 4, 2, 1, 1, 0, 0].", arrayState: [{ val: "1", match: true }, { val: "1", match: true }, { val: "4", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "0", match: true }, { val: "0", match: true }] }
    ]
  },

  // ── 102. DISTANCE OF NEAREST CELL HAVING 1 ──
  "distance of nearest cell having 1": {
    solutionJS: `function nearest(grid) {
  let m = grid.length, n = grid[0].length;
  let dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  let queue = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) {
        dist[r][c] = 0;
        queue.push([r, c]);
      }
    }
  }
  let dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  while (queue.length) {
    let [r, c] = queue.shift();
    for (let [dr, dc] of dirs) {
      let nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        if (dist[nr][nc] > dist[r][c] + 1) {
          dist[nr][nc] = dist[r][c] + 1;
          queue.push([nr, nc]);
        }
      }
    }
  }
  return dist;
}`,
    solutionPY: `def nearest(grid):
    m, n = len(grid), len(grid[0])
    dist = [[float('inf')] * n for _ in range(m)]
    queue = collections.deque()
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 1:
                dist[r][c] = 0
                queue.append((r, c))
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    while queue:
        r, c = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                if dist[nr][nc] > dist[r][c] + 1:
                    dist[nr][nc] = dist[r][c] + 1
                    queue.append((nr, nc))
    return dist`,
    solutionCPP: `vector<vector<int>> nearest(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dist(m, vector<int>(n, 1e9));
    queue<pair<int, int>> q;
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 1) {
                dist[r][c] = 0;
                q.push({r, c});
            }
        }
    }
    int dirs[4][2] = {{-1,0}, {1,0}, {0,-1}, {0,1}};
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (auto& d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                if (dist[nr][nc] > dist[r][c] + 1) {
                    dist[nr][nc] = dist[r][c] + 1;
                    q.push({nr, nc});
                }
            }
        }
    }
    return dist;
}`,
    visualizerSteps: [
      { line: 1, code: "function nearest(grid = [[0, 1, 0], [0, 0, 0], [0, 0, 0]]) {", vars: { m: "3", n: "3" }, log: "Initialize 3x3 binary grid with single '1' at (0, 1). Multi-source BFS.", arrayState: [{ val: "(0,1) dist: 0" }] },
      { line: 8, code: "  BFS level 1 -> (0,0)=1, (0,2)=1, (1,1)=1;", vars: { level: "1", queue: "[(0,0), (0,2), (1,1)]" }, log: "Level 1 BFS expansion: Adjacent cells (0,0), (0,2), (1,1) updated to distance 1.", arrayState: [{ val: "0" }, { val: "0 (d:0)", match: true }, { val: "0" }, { val: "1 (d:1)" }, { val: "1 (d:1)" }, { val: "1 (d:1)" }] },
      { line: 24, code: "  return [[1,0,1],[2,1,2],[3,2,3]]; // NEAREST CELL 1 DISTANCE COMPLETE", vars: { status: "COMPLETE" }, log: "Multi-source BFS complete! Nearest 1 cell distance matrix calculated cleanly.", arrayState: [{ val: "1", match: true }, { val: "0", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "2", match: true }, { val: "3", match: true }] }
    ]
  },

  // ── 103. EVALUATE REVERSE POLISH NOTATION ──
  "evaluate reverse polish notation": {
    solutionJS: `function evalRPN(tokens) {
  let stack = [];
  for (let token of tokens) {
    if (token === '+' || token === '-' || token === '*' || token === '/') {
      let b = stack.pop(), a = stack.pop();
      if (token === '+') stack.push(a + b);
      else if (token === '-') stack.push(a - b);
      else if (token === '*') stack.push(a * b);
      else if (token === '/') stack.push(Math.trunc(a / b));
    } else {
      stack.push(parseInt(token));
    }
  }
  return stack[0];
}`,
    solutionPY: `def evalRPN(tokens: List[str]) -> int:
    stack = []
    for token in tokens:
        if token in "+-*/":
            b, a = stack.pop(), stack.pop()
            if token == "+": stack.append(a + b)
            elif token == "-": stack.append(a - b)
            elif token == "*": stack.append(a * b)
            elif token == "/": stack.append(int(a / b))
        else:
            stack.append(int(token))
    return stack[0]`,
    solutionCPP: `int evalRPN(vector<string>& tokens) {
    stack<long long> st;
    for (string token : tokens) {
        if (token == "+" || token == "-" || token == "*" || token == "/") {
            long long b = st.top(); st.pop();
            long long a = st.top(); st.pop();
            if (token == "+") st.push(a + b);
            else if (token == "-") st.push(a - b);
            else if (token == "*") st.push(a * b);
            else if (token == "/") st.push(a / b);
        } else {
            st.push(stoll(token));
        }
    }
    return st.top();
}`,
    visualizerSteps: [
      { line: 1, code: "function evalRPN(tokens = ['2', '1', '+', '3', '*']) {", vars: { tokens: "['2', '1', '+', '3', '*']" }, log: "Initialize RPN expression tokens = ['2', '1', '+', '3', '*']. Stack operand evaluation.", arrayState: [{ val: "2" }, { val: "1" }, { val: "+" }, { val: "3" }, { val: "*" }] },
      { line: 4, code: "  eval '+' on (2, 1) -> stack: [3];", vars: { op: "'+'", a: "2", b: "1", result: "3", stack: "[3]" }, log: "Operator '+': Pop 1 and 2. 2 + 1 = 3. Push 3 onto stack.", arrayState: [{ val: "3", match: true }, { val: "3" }, { val: "*" }] },
      { line: 4, code: "  eval '*' on (3, 3) -> stack: [9];", vars: { op: "'*'", a: "3", b: "3", result: "9", stack: "[9]" }, log: "Operator '*': Pop 3 and 3. 3 * 3 = 9. Push 9 onto stack.", arrayState: [{ val: "9", match: true }] },
      { line: 12, code: "  return 9; // EVALUATE RPN COMPLETE", vars: { result: "9", status: "COMPLETE" }, log: "RPN expression evaluation complete! Final result = 9.", arrayState: [{ val: "9", match: true }] }
    ]
  },

  // ── 104. FLOOD FILL ALGORITHM ──
  "flood fill algorithm": {
    solutionJS: `function floodFill(image, sr, sc, newColor) {
  let origColor = image[sr][sc];
  if (origColor === newColor) return image;
  let rows = image.length, cols = image[0].length;
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || image[r][c] !== origColor) return;
    image[r][c] = newColor;
    dfs(r - 1, c); dfs(r + 1, c);
    dfs(r, c - 1); dfs(r, c + 1);
  }
  dfs(sr, sc);
  return image;
}`,
    solutionPY: `def floodFill(image: List[List[int]], sr: int, sc: int, newColor: int) -> List[List[int]]:
    orig_color = image[sr][sc]
    if orig_color == newColor: return image
    rows, cols = len(image), len(image[0])
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or image[r][c] != orig_color: return
        image[r][c] = newColor
        dfs(r - 1, c); dfs(r + 1, c)
        dfs(r, c - 1); dfs(r, c + 1)
    dfs(sr, sc)
    return image`,
    solutionCPP: `vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int newColor) {
    int origColor = image[sr][sc];
    if (origColor == newColor) return image;
    int rows = image.size(), cols = image[0].size();
    function<void(int, int)> dfs = [&](int r, int c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || image[r][c] != origColor) return;
        image[r][c] = newColor;
        dfs(r - 1, c); dfs(r + 1, c);
        dfs(r, c - 1); dfs(r, c + 1);
    };
    dfs(sr, sc);
    return image;
}`,
    visualizerSteps: [
      { line: 1, code: "function floodFill(image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, newColor = 2) {", vars: { sr: "1", sc: "1", origColor: "1", newColor: "2" }, log: "Initialize 3x3 image. Start (1,1), replace connected color 1 with newColor 2.", arrayState: [{ val: "image[1][1] = 1" }] },
      { line: 5, code: "  dfs(1,1) -> fill (1,1)=2, then fill connected 4-directional neighbors;", vars: { filledCount: "6", newColor: "2" }, log: "DFS fill: Replace connected pixels (1,1), (0,1), (1,0), (0,0), (0,2), (2,0) with color 2.", arrayState: [{ val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "0" }, { val: "2", match: true }, { val: "0" }, { val: "1" }] },
      { line: 11, code: "  return [[2,2,2],[2,2,0],[2,0,1]]; // FLOOD FILL COMPLETE", vars: { status: "COMPLETE" }, log: "Flood Fill complete! Image grid updated cleanly.", arrayState: [{ val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "0" }, { val: "2", match: true }, { val: "0" }, { val: "1" }] }
    ]
  },

  // ── 105. GAME WITH STRING ──
  "game with string": {
    solutionJS: `function minValue(s, k) {
  let map = {};
  for (let ch of s) map[ch] = (map[ch] || 0) + 1;
  let freqs = Object.values(map).sort((a, b) => b - a);
  while (k > 0 && freqs.length) {
    freqs[0]--;
    k--;
    freqs.sort((a, b) => b - a);
  }
  return freqs.reduce((acc, f) => acc + f * f, 0);
}`,
    solutionPY: `def minValue(s: str, k: int) -> int:
    cnt = collections.Counter(s)
    freqs = sorted(list(cnt.values()), reverse=True)
    while k > 0 and freqs:
        freqs[0] -= 1
        k -= 1
        freqs.sort(reverse=True)
    return sum(f * f for f in freqs)`,
    solutionCPP: `int minValue(string s, int k) {
    unordered_map<char, int> map;
    for (char c : s) map[c]++;
    priority_queue<int> pq;
    for (auto& p : map) pq.push(p.second);
    while (k > 0 && !pq.empty()) {
        int top = pq.top(); pq.pop();
        top--;
        if (top > 0) pq.push(top);
        k--;
    }
    int sum = 0;
    while (!pq.empty()) { sum += pq.top() * pq.top(); pq.pop(); }
    return sum;
}`,
    visualizerSteps: [
      { line: 1, code: "function minValue(s = 'abccc', k = 1) {", vars: { s: "'abccc'", k: "1" }, log: "Initialize s = 'abccc', k = 1. Frequencies: c:3, a:1, b:1.", arrayState: [{ val: "c: 3" }, { val: "a: 1" }, { val: "b: 1" }] },
      { line: 6, code: "  k = 1: decrement max freq 'c' from 3 to 2 -> freqs [2, 1, 1];", vars: { k: "0", freqs: "[2, 1, 1]" }, log: "k = 1: Decrement highest frequency ('c': 3 -> 2). Remaining freqs: [2, 1, 1].", arrayState: [{ val: "c: 2", match: true }, { val: "a: 1" }, { val: "b: 1" }] },
      { line: 10, code: "  sum of squares: 2^2 + 1^2 + 1^2 = 4 + 1 + 1 = 6;", vars: { minVal: "6", status: "COMPLETE" }, log: "Calculate sum of squared frequencies: 4 + 1 + 1 = 6.", arrayState: [{ val: "2^2 = 4", match: true }, { val: "1^2 = 1", match: true }, { val: "1^2 = 1", match: true }] }
    ]
  },

  // ── 106. GENERATE PARENTHESES ──
  "generate parentheses": {
    solutionJS: `function generateParenthesis(n) {
  let res = [];
  function backtrack(curr, open, close) {
    if (curr.length === 2 * n) {
      res.push(curr);
      return;
    }
    if (open < n) backtrack(curr + '(', open + 1, close);
    if (close < open) backtrack(curr + ')', open, close + 1);
  }
  backtrack('', 0, 0);
  return res;
}`,
    solutionPY: `def generateParenthesis(n: int) -> List[str]:
    res = []
    def backtrack(curr, open_cnt, close_cnt):
        if len(curr) == 2 * n:
            res.append(curr)
            return
        if open_cnt < n: backtrack(curr + '(', open_cnt + 1, close_cnt)
        if close_cnt < open_cnt: backtrack(curr + ')', open_cnt, close_cnt + 1)
    backtrack('', 0, 0)
    return res`,
    solutionCPP: `vector<string> generateParenthesis(int n) {
    vector<string> res;
    function<void(string, int, int)> backtrack = [&](string curr, int openCnt, int closeCnt) {
        if (curr.length() == 2 * n) {
            res.push_back(curr); return;
        }
        if (openCnt < n) backtrack(curr + "(", openCnt + 1, closeCnt);
        if (closeCnt < openCnt) backtrack(curr + ")", openCnt, closeCnt + 1);
    };
    backtrack("", 0, 0);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function generateParenthesis(n = 3) {", vars: { n: "3" }, log: "Initialize n = 3. Backtracking tree for valid parentheses combinations.", arrayState: [{ val: "n = 3" }] },
      { line: 7, code: "  backtrack -> '((()))', '(()())', '(())()', '()(())', '()()()';", vars: { count: "5" }, log: "Backtrack branches complete! Generated 5 unique valid parentheses combinations.", arrayState: [{ val: "((()))", match: true }, { val: "(()())", match: true }, { val: "(())()", match: true }, { val: "()(())", match: true }, { val: "()()()", match: true }] },
      { line: 11, code: "  return 5 combinations; // GENERATE PARENTHESES COMPLETE", vars: { totalCombinations: "5", status: "COMPLETE" }, log: "Valid parentheses generation complete!", arrayState: [{ val: "((()))", match: true }, { val: "(()())", match: true }, { val: "(())()", match: true }, { val: "()(())", match: true }, { val: "()()()", match: true }] }
    ]
  },

  // ── 107. MIN STACK ──
  "min stack": {
    solutionJS: `class MinStack {
  constructor() {
    this.stack = [];
  }
  push(val) {
    let min = this.stack.length ? Math.min(val, this.getMin()) : val;
    this.stack.push({ val, min });
  }
  pop() {
    this.stack.pop();
  }
  top() {
    return this.stack[this.stack.length - 1].val;
  }
  getMin() {
    return this.stack[this.stack.length - 1].min;
  }
}`,
    solutionPY: `class MinStack:
    def __init__(self):
        self.stack = []
    def push(self, val: int) -> None:
        min_val = min(val, self.getMin()) if self.stack else val
        self.stack.append((val, min_val))
    def pop(self) -> None:
        self.stack.pop()
    def top(self) -> int:
        return self.stack[-1][0]
    def getMin(self) -> int:
        return self.stack[-1][1]`,
    solutionCPP: `class MinStack {
    stack<pair<int, int>> st;
public:
    void push(int val) {
        int minVal = st.empty() ? val : min(val, st.top().second);
        st.push({val, minVal});
    }
    void pop() { st.pop(); }
    int top() { return st.top().first; }
    int getMin() { return st.top().second; }
};`,
    visualizerSteps: [
      { line: 1, code: "class MinStack { stack = [];", vars: { stack: "[]" }, log: "Initialize MinStack. Stores pairs of (val, minVal) for O(1) minimum retrieval.", arrayState: [{ val: "Stack: []" }] },
      { line: 5, code: "  push(-2) -> (-2, min:-2); push(0) -> (0, min:-2); push(-3) -> (-3, min:-3);", vars: { top: "-3", getMin: "-3" }, log: "push(-2), push(0), push(-3): Current top is -3, getMin() returns -3.", arrayState: [{ val: "val: -2, min: -2" }, { val: "val: 0, min: -2" }, { val: "val: -3, min: -3", match: true }] },
      { line: 9, code: "  pop() -> removes -3; top() -> 0; getMin() -> -2;", vars: { top: "0", getMin: "-2" }, log: "pop() removes -3. New top is 0, getMin() returns -2 cleanly!", arrayState: [{ val: "val: -2, min: -2" }, { val: "val: 0, min: -2", match: true }] }
    ]
  },

  // ── 108. NEXT SMALLER ELEMENT ──
  "next smaller element": {
    solutionJS: `function nextSmallerElement(arr, n) {
  let ans = new Array(n).fill(-1);
  let stack = [];
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length && stack[stack.length - 1] >= arr[i]) {
      stack.pop();
    }
    if (stack.length) ans[i] = stack[stack.length - 1];
    stack.push(arr[i]);
  }
  return ans;
}`,
    solutionPY: `def nextSmallerElement(arr, n):
    ans = [-1] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and stack[-1] >= arr[i]:
            stack.pop()
        if stack:
            ans[i] = stack[-1]
        stack.append(arr[i])
    return ans`,
    solutionCPP: `vector<int> nextSmallerElement(vector<int> &arr, int n) {
    vector<int> ans(n, -1);
    stack<int> st;
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && st.top() >= arr[i]) st.pop();
        if (!st.empty()) ans[i] = st.top();
        st.push(arr[i]);
    }
    return ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function nextSmallerElement(arr = [4, 8, 5, 2, 25], n = 5) {", vars: { n: "5" }, log: "Initialize arr = [4, 8, 5, 2, 25]. Monotonic stack right-to-left scan.", arrayState: [{ val: "4" }, { val: "8" }, { val: "5" }, { val: "2" }, { val: "25" }] },
      { line: 4, code: "  idx 1 (8): stack top is 5 -> ans[1] = 5;", vars: { i: "1 (8)", nextSmaller: "5" }, log: "Index 1 (8): Next smaller element to right is 5 (ans[1] = 5).", arrayState: [{ val: "4" }, { val: "8 (nse: 5)", match: true }, { val: "5" }, { val: "2" }, { val: "25" }] },
      { line: 4, code: "  idx 0 (4): stack top is 2 -> ans[0] = 2;", vars: { i: "0 (4)", nextSmaller: "2" }, log: "Index 0 (4): Next smaller element to right is 2 (ans[0] = 2).", arrayState: [{ val: "4 (nse: 2)", match: true }, { val: "8 (nse: 5)", match: true }, { val: "5" }, { val: "2" }, { val: "25" }] },
      { line: 11, code: "  return [2, 5, 2, -1, -1]; // NEXT SMALLER ELEMENT COMPLETE", vars: { ans: "[2, 5, 2, -1, -1]", status: "COMPLETE" }, log: "Next smaller element scan complete! Result array: [2, 5, 2, -1, -1].", arrayState: [{ val: "2", match: true }, { val: "5", match: true }, { val: "2", match: true }, { val: "-1", match: true }, { val: "-1", match: true }] }
    ]
  },

  // ── 109. ROTTEN ORANGES (MULTI-SOURCE BFS) ──
  "rotten oranges (multi-source bfs)": {
    solutionJS: `function orangesRotting(grid) {
  let rows = grid.length, cols = grid[0].length;
  let queue = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c, 0]);
      else if (grid[r][c] === 1) fresh++;
    }
  }
  let minutes = 0;
  let dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  while (queue.length) {
    let [r, c, time] = queue.shift();
    minutes = time;
    for (let [dr, dc] of dirs) {
      let nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
        grid[nr][nc] = 2;
        fresh--;
        queue.push([nr, nc, time + 1]);
      }
    }
  }
  return fresh === 0 ? minutes : -1;
}`,
    solutionPY: `def orangesRotting(grid: List[List[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    queue = collections.deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2: queue.append((r, c, 0))
            elif grid[r][c] == 1: fresh += 1
    minutes = 0
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    while queue:
        r, c, time = queue.popleft()
        minutes = time
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                queue.append((nr, nc, time + 1))
    return minutes if fresh == 0 else -1`,
    solutionCPP: `int orangesRotting(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    queue<vector<int>> q;
    int fresh = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) q.push({r, c, 0});
            else if (grid[r][c] == 1) fresh++;
        }
    }
    int minutes = 0;
    int dirs[4][2] = {{-1,0}, {1,0}, {0,-1}, {0,1}};
    while (!q.empty()) {
        auto curr = q.front(); q.pop();
        int r = curr[0], c = curr[1], time = curr[2];
        minutes = time;
        for (auto& d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                grid[nr][nc] = 2;
                fresh--;
                q.push({nr, nc, time + 1});
            }
        }
    }
    return fresh == 0 ? minutes : -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function orangesRotting(grid = [[2,1,1],[1,1,0],[0,1,1]]) {", vars: { rows: "3", cols: "3", fresh: "6" }, log: "Initialize 3x3 grid. Multi-source BFS starting with 2s (rotten oranges).", arrayState: [{ val: "Rotten (0,0)" }, { val: "Fresh (0,1)" }, { val: "Fresh (0,2)" }, { val: "Fresh (1,0)" }, { val: "Fresh (1,1)" }, { val: "Fresh (2,1)" }, { val: "Fresh (2,2)" }] },
      { line: 12, code: "  min 1 -> rot (0,1) & (1,0); min 2 -> rot (0,2) & (1,1);", vars: { time: "2", freshRemaining: "2" }, log: "Minutes 1-2: Rot spreads to adjacent fresh oranges.", arrayState: [{ val: "Rotten (0,0)", match: true }, { val: "Rotten (0,1)", match: true }, { val: "Rotten (0,2)", match: true }, { val: "Rotten (1,0)", match: true }, { val: "Rotten (1,1)", match: true }, { val: "Fresh (2,1)" }, { val: "Fresh (2,2)" }] },
      { line: 12, code: "  min 4 -> all 6 fresh oranges rotten -> return 4;", vars: { minutes: "4", freshRemaining: "0" }, log: "Minute 4: All fresh oranges rotted cleanly!", arrayState: [{ val: "Rotten", match: true }, { val: "Rotten", match: true }, { val: "Rotten", match: true }, { val: "Rotten", match: true }, { val: "Rotten", match: true }, { val: "Rotten", match: true }, { val: "Rotten", match: true }] },
      { line: 21, code: "  return 4; // ROTTEN ORANGES COMPLETE", vars: { minMinutes: "4", status: "COMPLETE" }, log: "Rotten Oranges multi-source BFS complete!", arrayState: [{ val: "Rotten", match: true }, { val: "Rotten", match: true }, { val: "Rotten", match: true }, { val: "Rotten", match: true }, { val: "Rotten", match: true }, { val: "Rotten", match: true }, { val: "Rotten", match: true }] }
    ]
  },

  // ── 110. SIMPLIFY PATH ──
  "simplify path": {
    solutionJS: `function simplifyPath(path) {
  let stack = [];
  let parts = path.split('/');
  for (let part of parts) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (stack.length) stack.pop();
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
}`,
    solutionPY: `def simplifyPath(path: str) -> str:
    stack = []
    parts = path.split("/")
    for part in parts:
        if part == "" or part == ".": continue
        if part == "..":
            if stack: stack.pop()
        else:
            stack.append(part)
    return "/" + "/".join(stack)`,
    solutionCPP: `string simplifyPath(string path) {
    vector<string> stack;
    stringstream ss(path);
    string part;
    while (getline(ss, part, '/')) {
        if (part == "" || part == ".") continue;
        if (part == "..") {
            if (!stack.empty()) stack.pop_back();
        } else {
            stack.push_back(part);
        }
    }
    string res = "";
    for (string s : stack) res += "/" + s;
    return res.empty() ? "/" : res;
}`,
    visualizerSteps: [
      { line: 1, code: "function simplifyPath(path = '/home//foo/../bar/') {", vars: { path: "'/home//foo/../bar/'" }, log: "Initialize Unix filepath '/home//foo/../bar/'. Tokenize and process stack.", arrayState: [{ val: "home" }, { val: "foo" }, { val: ".." }, { val: "bar" }] },
      { line: 4, code: "  push 'home', 'foo' -> stack ['home', 'foo']; '..' pops 'foo';", vars: { stack: "['home']" }, log: "Tokens 'home', 'foo' pushed. Token '..' pops 'foo' back to home.", arrayState: [{ val: "home", match: true }, { val: "bar" }] },
      { line: 8, code: "  push 'bar' -> stack ['home', 'bar'];", vars: { canonicalPath: "'/home/bar'" }, log: "Push 'bar': Stack contains ['home', 'bar']. Canonical path '/home/bar'.", arrayState: [{ val: "home", match: true }, { val: "bar", match: true }] },
      { line: 10, code: "  return '/home/bar'; // SIMPLIFY PATH COMPLETE", vars: { canonicalPath: "'/home/bar'", status: "COMPLETE" }, log: "Path simplification complete cleanly!", arrayState: [{ val: "home", match: true }, { val: "bar", match: true }] }
    ]
  },

  // ── 111. SPECIAL STACK (GETMIN IN O(1)) ──
  "special stack (getmin in o(1))": {
    solutionJS: `class SpecialStack {
  constructor() {
    this.st = [];
    this.minEle = null;
  }
  push(x) {
    if (!this.st.length) {
      this.minEle = x;
      this.st.push(x);
    } else if (x < this.minEle) {
      this.st.push(2 * x - this.minEle);
      this.minEle = x;
    } else {
      this.st.push(x);
    }
  }
  pop() {
    if (!this.st.length) return -1;
    let top = this.st.pop();
    if (top < this.minEle) {
      let res = this.minEle;
      this.minEle = 2 * this.minEle - top;
      return res;
    }
    return top;
  }
  getMin() {
    return this.st.length ? this.minEle : -1;
  }
}`,
    solutionPY: `class SpecialStack:
    def __init__(self):
        self.st = []
        self.min_ele = None
    def push(self, x):
        if not self.st:
            self.min_ele = x
            self.st.append(x)
        elif x < self.min_ele:
            self.st.append(2 * x - self.min_ele)
            self.min_ele = x
        else:
            self.st.append(x)
    def pop(self):
        if not self.st: return -1
        top = self.st.pop()
        if top < self.min_ele:
            res = self.min_ele
            self.min_ele = 2 * self.min_ele - top
            return res
        return top
    def getMin(self):
        return self.min_ele if self.st else -1`,
    solutionCPP: `class SpecialStack {
    stack<int> st; int minEle;
public:
    void push(int x) {
        if (st.empty()) { minEle = x; st.push(x); }
        else if (x < minEle) { st.push(2*x - minEle); minEle = x; }
        else st.push(x);
    }
    int pop() {
        if (st.empty()) return -1;
        int top = st.top(); st.pop();
        if (top < minEle) { int res = minEle; minEle = 2*minEle - top; return res; }
        return top;
    }
    int getMin() { return st.empty() ? -1 : minEle; }
};`,
    visualizerSteps: [
      { line: 1, code: "class SpecialStack { st = [], minEle = null;", vars: { minEle: "null" }, log: "Initialize SpecialStack. O(1) time & O(1) extra space min element equation.", arrayState: [{ val: "Stack: []" }] },
      { line: 5, code: "  push(18), push(19), push(29) -> minEle = 18;", vars: { minEle: "18", top: "29" }, log: "Push 18, 19, 29: minEle = 18.", arrayState: [{ val: "18" }, { val: "19" }, { val: "29" }] },
      { line: 9, code: "  push(15) -> minEle = 15; getMin() -> 15;", vars: { minEle: "15", top: "15" }, log: "push(15): 15 < 18 -> Encoded push (2*15 - 18 = 12). minEle = 15. getMin() returns 15!", arrayState: [{ val: "18" }, { val: "19" }, { val: "29" }, { val: "15 (min)", match: true }] },
      { line: 15, code: "  pop() -> returns 15; minEle restores to 18;", vars: { popped: "15", minEle: "18", status: "COMPLETE" }, log: "pop(): Decode encoded value -> returns 15 and restores minEle to 18!", arrayState: [{ val: "18", match: true }, { val: "19" }, { val: "29" }] }
    ]
  },

  // ── 112. DELETE NODE IN A DOUBLY LINKED LIST ──
  "delete node in a doubly linked list": {
    solutionJS: `function deleteNode(head, x) {
  if (!head) return null;
  let curr = head;
  if (x === 1) {
    head = head.next;
    if (head) head.prev = null;
    return head;
  }
  for (let i = 1; i < x && curr; i++) {
    curr = curr.next;
  }
  if (!curr) return head;
  if (curr.prev) curr.prev.next = curr.next;
  if (curr.next) curr.next.prev = curr.prev;
  return head;
}`,
    solutionPY: `def deleteNode(head, x):
    if not head: return None
    curr = head
    if x == 1:
        head = head.next
        if head: head.prev = None
        return head
    for i in range(1, x):
        if curr: curr = curr.next
    if not curr: return head
    if curr.prev: curr.prev.next = curr.next
    if curr.next: curr.next.prev = curr.prev
    return head`,
    solutionCPP: `Node* deleteNode(Node* head, int x) {
    if (!head) return NULL;
    Node* curr = head;
    if (x == 1) {
        head = head->next;
        if (head) head->prev = NULL;
        delete curr;
        return head;
    }
    for (int i = 1; i < x && curr; i++) curr = curr->next;
    if (!curr) return head;
    if (curr->prev) curr->prev->next = curr->next;
    if (curr->next) curr->next->prev = curr->prev;
    delete curr;
    return head;
}`,
    visualizerSteps: [
      { line: 1, code: "function deleteNode(head = 1 <-> 3 <-> 4, x = 3) {", vars: { x: "3" }, log: "Initialize DLL 1 <-> 3 <-> 4. Delete node at position 3 (node 4).", arrayState: [{ val: "1" }, { val: "3" }, { val: "4" }] },
      { line: 10, code: "  traverse to pos 3 -> curr = node 4 (prev = node 3);", vars: { curr: "node 4", prev: "node 3" }, log: "Traverse to 3rd node (node 4). prev is node 3, next is null.", arrayState: [{ val: "1" }, { val: "3", active: true }, { val: "4", active: true }] },
      { line: 13, code: "  node3.next = null -> DLL becomes 1 <-> 3;", vars: { head: "1 <-> 3" }, log: "Update node3.next = null. Unlink and delete node 4.", arrayState: [{ val: "1", match: true }, { val: "3", match: true }] },
      { line: 15, code: "  return head; // DELETE DLL NODE COMPLETE", vars: { status: "COMPLETE" }, log: "Doubly Linked List node deletion complete!", arrayState: [{ val: "1", match: true }, { val: "3", match: true }] }
    ]
  },

  // ── 113. FINDING MIDDLE ELEMENT IN A LINKED LIST ──
  "finding middle element in a linked list": {
    solutionJS: `function getMiddle(head) {
  if (!head) return -1;
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow.data;
}`,
    solutionPY: `def getMiddle(head):
    if not head: return -1
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow.data`,
    solutionCPP: `int getMiddle(Node* head) {
    if (!head) return -1;
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow->data;
}`,
    visualizerSteps: [
      { line: 1, code: "function getMiddle(head = 1 -> 2 -> 3 -> 4 -> 5) {", vars: { head: "1 -> 2 -> 3 -> 4 -> 5" }, log: "Initialize singly linked list 1 -> 2 -> 3 -> 4 -> 5. Tortoise and Hare 2-pointer.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }] },
      { line: 4, code: "  step 1: slow = 2, fast = 3; step 2: slow = 3, fast = 5;", vars: { slow: "3", fast: "5" }, log: "Step 1: slow = 2, fast = 3. Step 2: slow = 3, fast = 5 (tail reached).", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (Middle)", match: true }, { val: "4" }, { val: "5 (Fast)" }] },
      { line: 8, code: "  fast.next === null -> slow is at middle element (3);", vars: { middleVal: "3" }, log: "Fast pointer reached end! Slow pointer rests precisely on middle node 3.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (Middle)", match: true }, { val: "4" }, { val: "5" }] },
      { line: 9, code: "  return 3; // FIND MIDDLE ELEMENT COMPLETE", vars: { middle: "3", status: "COMPLETE" }, log: "Middle element finding complete!", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (Middle)", match: true }, { val: "4" }, { val: "5" }] }
    ]
  },

  // ── 114. ADD 1 TO A NUMBER REPRESENTED AS LINKED LIST ──
  "add 1 to a number represented as linked list": {
    solutionJS: `function addOne(head) {
  function reverse(node) {
    let prev = null, curr = node;
    while (curr) {
      let next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
    return prev;
  }
  head = reverse(head);
  let curr = head, carry = 1;
  while (curr) {
    let sum = curr.data + carry;
    curr.data = sum % 10;
    carry = Math.floor(sum / 10);
    if (!curr.next && carry) {
      curr.next = new Node(carry);
      carry = 0;
    }
    curr = curr.next;
  }
  return reverse(head);
}`,
    solutionPY: `def addOne(head):
    def reverse(node):
        prev, curr = None, node
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev
    head = reverse(head)
    curr, carry = head, 1
    while curr:
        s = curr.data + carry
        curr.data = s % 10
        carry = s // 10
        if not curr.next and carry:
            curr.next = Node(carry)
            carry = 0
        curr = curr.next
    return reverse(head)`,
    solutionCPP: `Node* addOne(Node* head) {
    auto reverse = [](Node* node) {
        Node *prev = NULL, *curr = node;
        while (curr) {
            Node* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    };
    head = reverse(head);
    Node *curr = head; int carry = 1;
    while (curr) {
        int sum = curr->data + carry;
        curr->data = sum % 10;
        carry = sum / 10;
        if (!curr->next && carry) {
            curr->next = new Node(carry);
            carry = 0;
        }
        curr = curr->next;
    }
    return reverse(head);
}`,
    visualizerSteps: [
      { line: 1, code: "function addOne(head = 4 -> 5 -> 6) {", vars: { head: "4 -> 5 -> 6" }, log: "Initialize number 456 as linked list 4 -> 5 -> 6. Reverse list and add carry.", arrayState: [{ val: "4" }, { val: "5" }, { val: "6" }] },
      { line: 11, code: "  reverse -> 6 -> 5 -> 4; add 1 to head 6 -> 7 (carry 0);", vars: { reversed: "6 -> 5 -> 4", newHeadVal: "7" }, log: "Reverse list to 6 -> 5 -> 4. Add 1 to head (6 + 1 = 7, carry = 0).", arrayState: [{ val: "7", match: true }, { val: "5" }, { val: "4" }] },
      { line: 20, code: "  reverse back -> 4 -> 5 -> 7; // ADD 1 TO LINKED LIST COMPLETE", vars: { result: "4 -> 5 -> 7", status: "COMPLETE" }, log: "Reverse list back: 4 -> 5 -> 7 (457). Operation complete cleanly!", arrayState: [{ val: "4", match: true }, { val: "5", match: true }, { val: "7", match: true }] }
    ]
  },

  // ── 115. ADD TWO NUMBERS REPRESENTED BY LINKED LISTS ──
  "add two numbers represented by linked lists": {
    solutionJS: `function addTwoLists(num1, num2) {
  function reverse(node) {
    let prev = null, curr = node;
    while (curr) {
      let next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
    return prev;
  }
  l1 = reverse(num1); l2 = reverse(num2);
  let dummy = new Node(0), curr = dummy, carry = 0;
  while (l1 || l2 || carry) {
    let sum = (l1 ? l1.data : 0) + (l2 ? l2.data : 0) + carry;
    carry = Math.floor(sum / 10);
    curr.next = new Node(sum % 10);
    curr = curr.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return reverse(dummy.next);
}`,
    solutionPY: `def addTwoLists(num1, num2):
    def reverse(node):
        prev, curr = None, node
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev
    l1, l2 = reverse(num1), reverse(num2)
    dummy = Node(0); curr, carry = dummy, 0
    while l1 or l2 or carry:
        s = (l1.data if l1 else 0) + (l2.data if l2 else 0) + carry
        carry = s // 10
        curr.next = Node(s % 10)
        curr = curr.next
        if l1: l1 = l1.next
        if l2: l2 = l2.next
    return reverse(dummy.next)`,
    solutionCPP: `Node* addTwoLists(Node* num1, Node* num2) {
    auto reverse = [](Node* node) {
        Node *prev = NULL, *curr = node;
        while (curr) { Node* next = curr->next; curr->next = prev; prev = curr; curr = next; }
        return prev;
    };
    Node *l1 = reverse(num1), *l2 = reverse(num2);
    Node* dummy = new Node(0); Node* curr = dummy; int carry = 0;
    while (l1 || l2 || carry) {
        int sum = (l1 ? l1->data : 0) + (l2 ? l2->data : 0) + carry;
        carry = sum / 10;
        curr->next = new Node(sum % 10);
        curr = curr->next;
        if (l1) l1 = l1->next;
        if (l2) l2 = l2->next;
    }
    return reverse(dummy->next);
}`,
    visualizerSteps: [
      { line: 1, code: "function addTwoLists(num1 = 4 -> 5, num2 = 3 -> 4 -> 5) {", vars: { num1: "45", num2: "345" }, log: "Initialize num1 = 4 -> 5 (45) and num2 = 3 -> 4 -> 5 (345). Reverse & node-by-node carry addition.", arrayState: [{ val: "num1: 4 -> 5" }, { val: "num2: 3 -> 4 -> 5" }] },
      { line: 12, code: "  add digits -> 5+5=10 (c:1); 4+4+1=9 (c:0); 0+3+0=3 (c:0);", vars: { sum: "390", carry: "0" }, log: "Digit additions: 5+5=10 (digit 0, carry 1); 4+4+1=9; 3+0=3. Reversal gives 3 -> 9 -> 0.", arrayState: [{ val: "3", match: true }, { val: "9", match: true }, { val: "0", match: true }] },
      { line: 20, code: "  return 3 -> 9 -> 0; // ADD TWO LINKED LISTS COMPLETE", vars: { sumList: "3 -> 9 -> 0", status: "COMPLETE" }, log: "Addition complete! Result list: 3 -> 9 -> 0 (390).", arrayState: [{ val: "3", match: true }, { val: "9", match: true }, { val: "0", match: true }] }
    ]
  },

  // ── 116. CHECK IF LINKED LIST IS PALINDROME ──
  "check if linked list is palindrome": {
    solutionJS: `function isPalindrome(head) {
  if (!head || !head.next) return true;
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let prev = null, curr = slow;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  let left = head, right = prev;
  while (right) {
    if (left.data !== right.data) return false;
    left = left.next;
    right = right.next;
  }
  return true;
}`,
    solutionPY: `def isPalindrome(head):
    if not head or not head.next: return True
    slow = fast = head
    while fast and fast.next:
        slow = slow.next; fast = fast.next.next
    prev, curr = None, slow
    while curr:
        nxt = curr.next; curr.next = prev; prev = curr; curr = nxt
    left, right = head, prev
    while right:
        if left.data != right.data: return False
        left = left.next; right = right.next
    return True`,
    solutionCPP: `bool isPalindrome(Node *head) {
    if (!head || !head->next) return true;
    Node *slow = head, *fast = head;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    Node *prev = NULL, *curr = slow;
    while (curr) { Node* next = curr->next; curr->next = prev; prev = curr; curr = next; }
    Node *left = head, *right = prev;
    while (right) {
        if (left->data != right->data) return false;
        left = left->next; right = right->next;
    }
    return true;
}`,
    visualizerSteps: [
      { line: 1, code: "function isPalindrome(head = 1 -> 2 -> 2 -> 1) {", vars: { head: "1 -> 2 -> 2 -> 1" }, log: "Initialize linked list 1 -> 2 -> 2 -> 1. Find middle and reverse second half.", arrayState: [{ val: "1" }, { val: "2" }, { val: "2" }, { val: "1" }] },
      { line: 8, code: "  reverse second half -> left [1, 2] vs right [1, 2];", vars: { leftHalf: "[1, 2]", rightHalf: "[1, 2]" }, log: "Second half reversed. Left half [1, 2] compared with reversed right half [1, 2].", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "1", match: true }] },
      { line: 15, code: "  1 === 1 and 2 === 2 -> LINKED LIST IS PALINDROME!", vars: { isPalindrome: "true", status: "COMPLETE" }, log: "Symmetric node values match! Linked List is a valid Palindrome.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "1", match: true }] },
      { line: 18, code: "  return true; // PALINDROME CHECK COMPLETE", vars: { isPalindrome: "true", status: "COMPLETE" }, log: "Return true.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "1", match: true }] }
    ]
  },

  // ── 117. DETECT LOOP IN LINKED LIST ──
  "detect loop in linked list": {
    solutionJS: `function detectLoop(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    solutionPY: `def detectLoop(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast: return True
    return False`,
    solutionCPP: `bool detectLoop(Node* head) {
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
    visualizerSteps: [
      { line: 1, code: "function detectLoop(head = 1 -> 3 -> 4 -> 3 (loop)) {", vars: { head: "1 -> 3 -> 4 -> (loop back to 3)" }, log: "Initialize linked list with loop. Floyd's Cycle Detection Algorithm.", arrayState: [{ val: "1" }, { val: "3" }, { val: "4" }] },
      { line: 5, code: "  step 1: slow = 3, fast = 4; step 2: slow = 4, fast = 4 (MATCH!);", vars: { slow: "node 4", fast: "node 4" }, log: "Fast pointer moves 2 steps, Slow pointer moves 1 step. Pointers collide at node 4!", arrayState: [{ val: "1" }, { val: "3" }, { val: "4 (Collision)", match: true }] },
      { line: 6, code: "  slow === fast -> LOOP DETECTED IN LINKED LIST!", vars: { loopDetected: "true", status: "COMPLETE" }, log: "Floyd's cycle detection confirmed! Loop exists in linked list.", arrayState: [{ val: "1" }, { val: "3" }, { val: "4 (Loop Node)", match: true }] },
      { line: 8, code: "  return true; // DETECT LOOP COMPLETE", vars: { hasLoop: "true", status: "COMPLETE" }, log: "Return true.", arrayState: [{ val: "1" }, { val: "3" }, { val: "4 (Loop Node)", match: true }] }
    ]
  },

  // ── 118. FIND LENGTH OF LOOP ──
  "find length of loop": {
    solutionJS: `function countNodesinLoop(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let count = 1;
      let curr = slow.next;
      while (curr !== slow) {
        count++;
        curr = curr.next;
      }
      return count;
    }
  }
  return 0;
}`,
    solutionPY: `def countNodesinLoop(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next; fast = fast.next.next
        if slow == fast:
            count = 1
            curr = slow.next
            while curr != slow:
                count += 1
                curr = curr.next
            return count
    return 0`,
    solutionCPP: `int countNodesinLoop(struct Node *head) {
    Node *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next; fast = fast->next->next;
        if (slow == fast) {
            int count = 1;
            Node *curr = slow->next;
            while (curr != slow) { count++; curr = curr->next; }
            return count;
        }
    }
    return 0;
}`,
    visualizerSteps: [
      { line: 1, code: "function countNodesinLoop(head = 1 -> 2 -> 3 -> 4 -> 5 -> 3 (loop)) {", vars: { loopNodes: "3, 4, 5" }, log: "Initialize linked list with loop at node 3 (nodes 3, 4, 5). Floyd's meeting point search.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (Loop)" }, { val: "4 (Loop)" }, { val: "5 (Loop)" }] },
      { line: 6, code: "  Floyd collision at node 5 -> fix slow = node 5, advance curr around loop;", vars: { meetingPoint: "node 5" }, log: "Pointers meet at node 5! Hold slow at node 5 and count nodes around loop cycle.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (Count 1)" }, { val: "4 (Count 2)" }, { val: "5 (Count 3)", match: true }] },
      { line: 9, code: "  curr traversal: 3 (cnt 1) -> 4 (cnt 2) -> 5 (cnt 3) === slow -> LENGTH = 3!", vars: { loopLength: "3" }, log: "Traversed 3 nodes in cycle before returning to node 5. Loop length = 3!", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (Loop Node 1)", match: true }, { val: "4 (Loop Node 2)", match: true }, { val: "5 (Loop Node 3)", match: true }] },
      { line: 14, code: "  return 3; // FIND LENGTH OF LOOP COMPLETE", vars: { length: "3", status: "COMPLETE" }, log: "Loop length finding complete!", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (Loop Node 1)", match: true }, { val: "4 (Loop Node 2)", match: true }, { val: "5 (Loop Node 3)", match: true }] }
    ]
  },

  // ── 119. GIVEN A LINKED LIST OF 0S, 1S AND 2S, SORT IT ──
  "given a linked list of 0s, 1s and 2s, sort it": {
    solutionJS: `function segregate(head) {
  if (!head || !head.next) return head;
  let zeroHead = new Node(0), oneHead = new Node(0), twoHead = new Node(0);
  let zero = zeroHead, one = oneHead, two = twoHead;
  let curr = head;
  while (curr) {
    if (curr.data === 0) { zero.next = curr; zero = zero.next; }
    else if (curr.data === 1) { one.next = curr; one = one.next; }
    else { two.next = curr; two = two.next; }
    curr = curr.next;
  }
  zero.next = oneHead.next ? oneHead.next : twoHead.next;
  one.next = twoHead.next;
  two.next = null;
  return zeroHead.next;
}`,
    solutionPY: `def segregate(head):
    if not head or not head.next: return head
    zero_head, one_head, two_head = Node(0), Node(0), Node(0)
    zero, one, two = zero_head, one_head, two_head
    curr = head
    while curr:
        if curr.data == 0: zero.next = curr; zero = zero.next
        elif curr.data == 1: one.next = curr; one = one.next
        else: two.next = curr; two = two.next
        curr = curr.next
    zero.next = one_head.next if one_head.next else two_head.next
    one.next = two_head.next
    two.next = None
    return zero_head.next`,
    solutionCPP: `Node* segregate(Node *head) {
    if (!head || !head->next) return head;
    Node *zeroHead = new Node(0), *oneHead = new Node(0), *twoHead = new Node(0);
    Node *zero = zeroHead, *one = oneHead, *two = twoHead;
    Node *curr = head;
    while (curr) {
        if (curr->data == 0) { zero->next = curr; zero = zero->next; }
        else if (curr->data == 1) { one->next = curr; one = one->next; }
        else { two->next = curr; two = two->next; }
        curr = curr->next;
    }
    zero->next = oneHead->next ? oneHead->next : twoHead->next;
    one->next = twoHead->next;
    two->next = NULL;
    return zeroHead->next;
}`,
    visualizerSteps: [
      { line: 1, code: "function segregate(head = 1 -> 2 -> 2 -> 1 -> 2 -> 0 -> 2 -> 2) {", vars: { head: "1 -> 2 -> 2 -> 1 -> 2 -> 0 -> 2 -> 2" }, log: "Initialize 0s, 1s, 2s linked list. 3-dummy pointer partition pass.", arrayState: [{ val: "1" }, { val: "2" }, { val: "2" }, { val: "1" }, { val: "2" }, { val: "0" }, { val: "2" }, { val: "2" }] },
      { line: 6, code: "  partition -> 0s: [0], 1s: [1, 1], 2s: [2, 2, 2, 2, 2];", vars: { zeros: "[0]", ones: "[1, 1]", twos: "[2, 2, 2, 2, 2]" }, log: "Single pass segregation: 0s dummy list: [0], 1s dummy list: [1, 1], 2s dummy list: [2, 2, 2, 2, 2].", arrayState: [{ val: "0", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }] },
      { line: 14, code: "  link 0s -> 1s -> 2s -> 0 -> 1 -> 1 -> 2 -> 2 -> 2 -> 2 -> 2;", vars: { sorted: "0 -> 1 -> 1 -> 2 -> 2 -> 2 -> 2 -> 2" }, log: "Stitch 3 dummy lists together cleanly! Return sorted linked list.", arrayState: [{ val: "0", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }] },
      { line: 17, code: "  return sortedHead; // SEGREGATE 0S 1S 2S COMPLETE", vars: { status: "COMPLETE" }, log: "0s, 1s, 2s sorting complete!", arrayState: [{ val: "0", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "2", match: true }] }
    ]
  },

  // ── 120. LINKED LIST CYCLE ──
  "linked list cycle": {
    solutionJS: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    solutionPY: `def hasCycle(head: Optional[ListNode]) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast: return True
    return False`,
    solutionCPP: `bool hasCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
    visualizerSteps: [
      { line: 1, code: "function hasCycle(head = 3 -> 2 -> 0 -> -4 (cycle to 2)) {", vars: { head: "3 -> 2 -> 0 -> -4 (pos 1)" }, log: "Initialize 3 -> 2 -> 0 -> -4 with cycle at 2. Fast/Slow pointers.", arrayState: [{ val: "3" }, { val: "2 (Cycle)" }, { val: "0" }, { val: "-4" }] },
      { line: 6, code: "  slow = -4, fast = -4 -> POINTER COLLISION!", vars: { slow: "-4", fast: "-4" }, log: "Pointers move: Slow 1 step, Fast 2 steps. Collision at node -4!", arrayState: [{ val: "3" }, { val: "2" }, { val: "0" }, { val: "-4 (Collision)", match: true }] },
      { line: 7, code: "  return true; // LINKED LIST CYCLE COMPLETE", vars: { hasCycle: "true", status: "COMPLETE" }, log: "Cycle detection confirmed! Return true.", arrayState: [{ val: "3" }, { val: "2" }, { val: "0" }, { val: "-4 (Collision)", match: true }] }
    ]
  },

  // ── 121. MERGE SORT FOR LINKED LIST ──
  "merge sort for linked list": {
    solutionJS: `function mergeSort(head) {
  if (!head || !head.next) return head;
  let slow = head, fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let mid = slow.next;
  slow.next = null;
  let left = mergeSort(head);
  let right = mergeSort(mid);
  return merge(left, right);
}
function merge(l1, l2) {
  let dummy = new Node(0), curr = dummy;
  while (l1 && l2) {
    if (l1.data <= l2.data) { curr.next = l1; l1 = l1.next; }
    else { curr.next = l2; l2 = l2.next; }
    curr = curr.next;
  }
  curr.next = l1 ? l1 : l2;
  return dummy.next;
}`,
    solutionPY: `def mergeSort(head):
    if not head or not head.next: return head
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next; fast = fast.next.next
    mid = slow.next; slow.next = None
    left = mergeSort(head); right = mergeSort(mid)
    return merge(left, right)
def merge(l1, l2):
    dummy = Node(0); curr = dummy
    while l1 and l2:
        if l1.data <= l2.data: curr.next = l1; l1 = l1.next
        else: curr.next = l2; l2 = l2.next
        curr = curr.next
    curr.next = l1 if l1 else l2
    return dummy.next`,
    solutionCPP: `Node* mergeSort(Node* head) {
    if (!head || !head->next) return head;
    Node *slow = head, *fast = head->next;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    Node *mid = slow->next; slow->next = NULL;
    Node *left = mergeSort(head), *right = mergeSort(mid);
    return merge(left, right);
}`,
    visualizerSteps: [
      { line: 1, code: "function mergeSort(head = 4 -> 2 -> 1 -> 3) {", vars: { head: "4 -> 2 -> 1 -> 3" }, log: "Initialize unsorted list 4 -> 2 -> 1 -> 3. Divide & Conquer Merge Sort.", arrayState: [{ val: "4" }, { val: "2" }, { val: "1" }, { val: "3" }] },
      { line: 8, code: "  split mid -> left [4, 2], right [1, 3]; sort & merge -> 1 -> 2 -> 3 -> 4;", vars: { sorted: "1 -> 2 -> 3 -> 4" }, log: "Split at mid: Left [4, 2] sorts to [2, 4], Right [1, 3] sorts to [1, 3]. Merge yields 1 -> 2 -> 3 -> 4.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }] },
      { line: 10, code: "  return 1 -> 2 -> 3 -> 4; // MERGE SORT LINKED LIST COMPLETE", vars: { status: "COMPLETE" }, log: "Merge Sort for Linked List complete!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }] }
    ]
  },

  // ── 122. MERGE TWO SORTED LISTS ──
  "merge two sorted lists": {
    solutionJS: `function mergeTwoLists(list1, list2) {
  let dummy = new ListNode(0);
  let curr = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) {
      curr.next = list1;
      list1 = list1.next;
    } else {
      curr.next = list2;
      list2 = list2.next;
    }
    curr = curr.next;
  }
  curr.next = list1 ? list1 : list2;
  return dummy.next;
}`,
    solutionPY: `def mergeTwoLists(list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
    dummy = ListNode(0)
    curr = dummy
    while list1 and list2:
        if list1.val <= list2.val:
            curr.next = list1; list1 = list1.next
        else:
            curr.next = list2; list2 = list2.next
        curr = curr.next
    curr.next = list1 if list1 else list2
    return dummy.next`,
    solutionCPP: `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    ListNode dummy(0);
    ListNode* curr = &dummy;
    while (list1 && list2) {
        if (list1->val <= list2->val) { curr->next = list1; list1 = list1->next; }
        else { curr->next = list2; list2 = list2->next; }
        curr = curr->next;
    }
    curr->next = list1 ? list1 : list2;
    return dummy.next;
}`,
    visualizerSteps: [
      { line: 1, code: "function mergeTwoLists(list1 = 1 -> 2 -> 4, list2 = 1 -> 3 -> 4) {", vars: { l1: "1 -> 2 -> 4", l2: "1 -> 3 -> 4" }, log: "Initialize list1 = 1 -> 2 -> 4 and list2 = 1 -> 3 -> 4. 2-pointer merge.", arrayState: [{ val: "1 (L1)" }, { val: "2 (L1)" }, { val: "4 (L1)" }, { val: "1 (L2)" }, { val: "3 (L2)" }, { val: "4 (L2)" }] },
      { line: 5, code: "  pick 1 (l1), then 1 (l2), 2 (l1), 3 (l2), 4 (l1), 4 (l2);", vars: { merged: "1 -> 1 -> 2 -> 3 -> 4 -> 4" }, log: "Splice nodes in sorted order: 1 -> 1 -> 2 -> 3 -> 4 -> 4.", arrayState: [{ val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }, { val: "4", match: true }] },
      { line: 14, code: "  return 1 -> 1 -> 2 -> 3 -> 4 -> 4; // MERGE TWO SORTED LISTS COMPLETE", vars: { status: "COMPLETE" }, log: "Merge Two Sorted Lists complete!", arrayState: [{ val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }, { val: "4", match: true }] }
    ]
  },

  // ── 123. MERGE TWO SORTED LINKED LISTS ──
  "merge two sorted linked lists": {
    solutionJS: `function sortedMerge(head1, head2) {
  let dummy = new Node(0), curr = dummy;
  while (head1 && head2) {
    if (head1.data <= head2.data) {
      curr.next = head1; head1 = head1.next;
    } else {
      curr.next = head2; head2 = head2.next;
    }
    curr = curr.next;
  }
  curr.next = head1 ? head1 : head2;
  return dummy.next;
}`,
    solutionPY: `def sortedMerge(head1, head2):
    dummy = Node(0); curr = dummy
    while head1 and head2:
        if head1.data <= head2.data:
            curr.next = head1; head1 = head1.next
        else:
            curr.next = head2; head2 = head2.next
        curr = curr.next
    curr.next = head1 if head1 else head2
    return dummy.next`,
    solutionCPP: `Node* sortedMerge(Node* head1, Node* head2) {
    Node dummy(0); Node* curr = &dummy;
    while (head1 && head2) {
        if (head1->data <= head2->data) { curr->next = head1; head1 = head1->next; }
        else { curr->next = head2; head2 = head2->next; }
        curr = curr->next;
    }
    curr->next = head1 ? head1 : head2;
    return dummy.next;
}`,
    visualizerSteps: [
      { line: 1, code: "function sortedMerge(head1 = 5 -> 10 -> 15, head2 = 2 -> 3 -> 20) {", vars: { h1: "5 -> 10 -> 15", h2: "2 -> 3 -> 20" }, log: "Initialize head1 = 5 -> 10 -> 15, head2 = 2 -> 3 -> 20.", arrayState: [{ val: "5" }, { val: "10" }, { val: "15" }, { val: "2" }, { val: "3" }, { val: "20" }] },
      { line: 5, code: "  pick 2, 3, 5, 10, 15, 20 -> merged list: 2 -> 3 -> 5 -> 10 -> 15 -> 20;", vars: { merged: "2 -> 3 -> 5 -> 10 -> 15 -> 20" }, log: "Merge pass: Splice nodes in ascending order -> 2 -> 3 -> 5 -> 10 -> 15 -> 20.", arrayState: [{ val: "2", match: true }, { val: "3", match: true }, { val: "5", match: true }, { val: "10", match: true }, { val: "15", match: true }, { val: "20", match: true }] },
      { line: 12, code: "  return 2 -> 3 -> 5 -> 10 -> 15 -> 20; // MERGE TWO SORTED LINKED LISTS COMPLETE", vars: { status: "COMPLETE" }, log: "Merge two sorted linked lists complete!", arrayState: [{ val: "2", match: true }, { val: "3", match: true }, { val: "5", match: true }, { val: "10", match: true }, { val: "15", match: true }, { val: "20", match: true }] }
    ]
  },

  // ── 124. NTH NODE FROM END OF LINKED LIST ──
  "nth node from end of linked list": {
    solutionJS: `function getNthFromLast(head, n) {
  let fast = head, slow = head;
  for (let i = 0; i < n; i++) {
    if (!fast) return -1;
    fast = fast.next;
  }
  while (fast) {
    slow = slow.next;
    fast = fast.next;
  }
  return slow ? slow.data : -1;
}`,
    solutionPY: `def getNthFromLast(head, n):
    fast = slow = head
    for _ in range(n):
        if not fast: return -1
        fast = fast.next
    while fast:
        slow = slow.next
        fast = fast.next
    return slow.data if slow else -1`,
    solutionCPP: `int getNthFromLast(Node *head, int n) {
    Node *fast = head, *slow = head;
    for (int i = 0; i < n; i++) {
        if (!fast) return -1;
        fast = fast->next;
    }
    while (fast) {
        slow = slow->next;
        fast = fast->next;
    }
    return slow ? slow->data : -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function getNthFromLast(head = 1->2->3->4->5->6->7->8->9, n = 2) {", vars: { n: "2" }, log: "Initialize list 1..9, n = 2. Two-pointer gap of n nodes.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8" }, { val: "9" }] },
      { line: 3, code: "  advance fast 2 steps -> fast at node 3;", vars: { fast: "node 3", gap: "2" }, log: "Advance fast pointer 2 steps ahead to node 3.", arrayState: [{ val: "1 (slow)", active: true }, { val: "2" }, { val: "3 (fast)", active: true }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8" }, { val: "9" }] },
      { line: 7, code: "  advance fast & slow together until fast === null -> slow at node 8;", vars: { slow: "node 8", val: "8" }, log: "Advance fast & slow simultaneously until fast reaches null. Slow rests on node 8!", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8 (Target)", match: true }, { val: "9" }] },
      { line: 11, code: "  return 8; // NTH NODE FROM END COMPLETE", vars: { nthFromEnd: "8", status: "COMPLETE" }, log: "Nth node from end finding complete! Result: 8.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8 (Target)", match: true }, { val: "9" }] }
    ]
  },

  // ── 125. REMOVE DUPLICATES FROM A SORTED LINKED LIST ──
  "remove duplicates from a sorted linked list": {
    solutionJS: `function removeDuplicates(head) {
  let curr = head;
  while (curr && curr.next) {
    if (curr.data === curr.next.data) {
      curr.next = curr.next.next;
    } else {
      curr = curr.next;
    }
  }
  return head;
}`,
    solutionPY: `def removeDuplicates(head):
    curr = head
    while curr and curr.next:
        if curr.data == curr.next.data:
            curr.next = curr.next.next
        else:
            curr = curr.next
    return head`,
    solutionCPP: `Node* removeDuplicates(Node *head) {
    Node *curr = head;
    while (curr && curr->next) {
        if (curr->data == curr->next->data) {
            Node* temp = curr->next;
            curr->next = curr->next->next;
            delete temp;
        } else {
            curr = curr->next;
        }
    }
    return head;
}`,
    visualizerSteps: [
      { line: 1, code: "function removeDuplicates(head = 2 -> 2 -> 4 -> 5) {", vars: { head: "2 -> 2 -> 4 -> 5" }, log: "Initialize sorted list 2 -> 2 -> 4 -> 5. Single-pass adjacent duplicate check.", arrayState: [{ val: "2" }, { val: "2" }, { val: "4" }, { val: "5" }] },
      { line: 4, code: "  curr (2) === curr.next (2) -> skip duplicate -> 2 -> 4 -> 5;", vars: { duplicateSkipped: "2" }, log: "Node 2 matches next node 2! Bypass duplicate node to link 2 -> 4.", arrayState: [{ val: "2", match: true }, { val: "4", match: true }, { val: "5", match: true }] },
      { line: 9, code: "  return 2 -> 4 -> 5; // REMOVE SORTED DUPLICATES COMPLETE", vars: { deduplicatedHead: "2 -> 4 -> 5", status: "COMPLETE" }, log: "Sorted linked list deduplication complete!", arrayState: [{ val: "2", match: true }, { val: "4", match: true }, { val: "5", match: true }] }
    ]
  },

  // ── 126. REMOVE DUPLICATES FROM AN UNSORTED LINKED LIST ──
  "remove duplicates from an unsorted linked list": {
    solutionJS: `function removeDuplicates(head) {
  if (!head) return head;
  let set = new Set();
  let curr = head, prev = null;
  while (curr) {
    if (set.has(curr.data)) {
      prev.next = curr.next;
    } else {
      set.add(curr.data);
      prev = curr;
    }
    curr = curr.next;
  }
  return head;
}`,
    solutionPY: `def removeDuplicates(head):
    if not head: return head
    seen = set()
    curr, prev = head, None
    while curr:
        if curr.data in seen:
            prev.next = curr.next
        else:
            seen.add(curr.data)
            prev = curr
        curr = curr.next
    return head`,
    solutionCPP: `Node * removeDuplicates(Node *head) {
    if (!head) return head;
    unordered_set<int> seen;
    Node *curr = head, *prev = NULL;
    while (curr) {
        if (seen.count(curr->data)) {
            prev->next = curr->next;
            delete curr;
        } else {
            seen.insert(curr->data);
            prev = curr;
        }
        curr = prev->next;
    }
    return head;
}`,
    visualizerSteps: [
      { line: 1, code: "function removeDuplicates(head = 5 -> 2 -> 2 -> 4) {", vars: { head: "5 -> 2 -> 2 -> 4" }, log: "Initialize unsorted list 5 -> 2 -> 2 -> 4. Hash Set tracking seen values.", arrayState: [{ val: "5" }, { val: "2" }, { val: "2" }, { val: "4" }] },
      { line: 6, code: "  seen set: {5, 2}; node 2 at pos 3 is already seen -> bypass node 2;", vars: { seen: "{5, 2}", duplicate: "2" }, log: "Seen set contains 5, 2. Second node 2 is duplicate -> Bypass to 4.", arrayState: [{ val: "5", match: true }, { val: "2", match: true }, { val: "4", match: true }] },
      { line: 13, code: "  return 5 -> 2 -> 4; // REMOVE UNSORTED DUPLICATES COMPLETE", vars: { status: "COMPLETE" }, log: "Unsorted duplicates removed while preserving original element order!", arrayState: [{ val: "5", match: true }, { val: "2", match: true }, { val: "4", match: true }] }
    ]
  },

  // ── 127. REVERSE LINKED LIST ──
  "reverse linked list": {
    solutionJS: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    solutionPY: `def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    solutionCPP: `ListNode* reverseList(ListNode* head) {
    ListNode *prev = NULL, *curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    visualizerSteps: [
      { line: 1, code: "function reverseList(head = 1 -> 2 -> 3 -> 4 -> 5) {", vars: { head: "1 -> 2 -> 3 -> 4 -> 5" }, log: "Initialize singly linked list 1 -> 2 -> 3 -> 4 -> 5. 3-pointer reversal pass.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }] },
      { line: 4, code: "  reverse pointers node by node -> prev becomes new head (node 5);", vars: { prev: "node 5" }, log: "Iteratively reverse next pointers for each node. Node 5 becomes new head.", arrayState: [{ val: "5", match: true }, { val: "4", match: true }, { val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }] },
      { line: 9, code: "  return 5 -> 4 -> 3 -> 2 -> 1; // REVERSE LINKED LIST COMPLETE", vars: { status: "COMPLETE" }, log: "Singly Linked List reversal complete!", arrayState: [{ val: "5", match: true }, { val: "4", match: true }, { val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }] }
    ]
  },

  // ── 128. REVERSE A DOUBLY LINKED LIST ──
  "reverse a doubly linked list": {
    solutionJS: `function reverseDLL(head) {
  if (!head || !head.next) return head;
  let curr = head, temp = null;
  while (curr) {
    temp = curr.prev;
    curr.prev = curr.next;
    curr.next = temp;
    curr = curr.prev;
  }
  return temp ? temp.prev : head;
}`,
    solutionPY: `def reverseDLL(head):
    if not head or not head.next: return head
    curr, temp = head, None
    while curr:
        temp = curr.prev
        curr.prev = curr.next
        curr.next = temp
        curr = curr.prev
    return temp.prev if temp else head`,
    solutionCPP: `Node* reverseDLL(Node * head) {
    if (!head || !head->next) return head;
    Node *curr = head, *temp = NULL;
    while (curr) {
        temp = curr->prev;
        curr->prev = curr->next;
        curr->next = temp;
        curr = curr->prev;
    }
    return temp ? temp->prev : head;
}`,
    visualizerSteps: [
      { line: 1, code: "function reverseDLL(head = 3 <-> 4 <-> 5) {", vars: { head: "3 <-> 4 <-> 5" }, log: "Initialize Doubly Linked List 3 <-> 4 <-> 5. Swap prev & next pointers for all nodes.", arrayState: [{ val: "3" }, { val: "4" }, { val: "5" }] },
      { line: 5, code: "  swap prev & next for nodes 3, 4, 5 -> head becomes node 5;", vars: { head: "5 <-> 4 <-> 3" }, log: "Pointer swapping: node 3, 4, 5 prev/next reversed. Node 5 becomes new head.", arrayState: [{ val: "5", match: true }, { val: "4", match: true }, { val: "3", match: true }] },
      { line: 10, code: "  return 5 <-> 4 <-> 3; // REVERSE DLL COMPLETE", vars: { status: "COMPLETE" }, log: "Doubly Linked List reversal complete!", arrayState: [{ val: "5", match: true }, { val: "4", match: true }, { val: "3", match: true }] }
    ]
  },

  // ── 129. REVERSE A LINKED LIST (ITERATIVE & RECURSIVE) ──
  "reverse a linked list (iterative & recursive)": {
    solutionJS: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    solutionPY: `def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:
    if not head or not head.next: return head
    new_head = reverseList(head.next)
    head.next.next = head
    head.next = None
    return new_head`,
    solutionCPP: `ListNode* reverseList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* newHead = reverseList(head->next);
    head->next->next = head;
    head->next = NULL;
    return newHead;
}`,
    visualizerSteps: [
      { line: 1, code: "function reverseList(head = 1 -> 2 -> 3 -> 4 -> 5) {", vars: { head: "1 -> 2 -> 3 -> 4 -> 5" }, log: "Initialize list 1..5. Iterative / recursive link reversal.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }] },
      { line: 4, code: "  reverse link pointers: 5 -> 4 -> 3 -> 2 -> 1;", vars: { reversedHead: "node 5" }, log: "Iterative pointer updates / call stack unwind: Next pointers reversed to point backward.", arrayState: [{ val: "5", match: true }, { val: "4", match: true }, { val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }] },
      { line: 9, code: "  return 5 -> 4 -> 3 -> 2 -> 1; // REVERSE LINKED LIST COMPLETE", vars: { status: "COMPLETE" }, log: "Linked List reversal complete cleanly!", arrayState: [{ val: "5", match: true }, { val: "4", match: true }, { val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }] }
    ]
  },

  // ── 130. ROTATE A LINKED LIST ──
  "rotate a linked list": {
    solutionJS: `function rotate(head, k) {
  if (!head || !head.next || k === 0) return head;
  let len = 1, tail = head;
  while (tail.next) { len++; tail = tail.next; }
  k = k % len;
  if (k === 0) return head;
  tail.next = head;
  let newTail = head;
  for (let i = 1; i < k; i++) newTail = newTail.next;
  let newHead = newTail.next;
  newTail.next = null;
  return newHead;
}`,
    solutionPY: `def rotate(head, k):
    if not head or not head.next or k == 0: return head
    length = 1; tail = head
    while tail.next: length += 1; tail = tail.next
    k = k % length
    if k == 0: return head
    tail.next = head; new_tail = head
    for _ in range(1, k): new_tail = new_tail.next
    new_head = new_tail.next; new_tail.next = None
    return new_head`,
    solutionCPP: `Node* rotate(Node* head, int k) {
    if (!head || !head->next || k == 0) return head;
    int len = 1; Node* tail = head;
    while (tail->next) { len++; tail = tail->next; }
    k = k % len;
    if (k == 0) return head;
    tail->next = head; Node* newTail = head;
    for (int i = 1; i < k; i++) newTail = newTail->next;
    Node* newHead = newTail->next;
    newTail->next = NULL;
    return newHead;
}`,
    visualizerSteps: [
      { line: 1, code: "function rotate(head = 1 -> 2 -> 3 -> 4 -> 5 -> 6, k = 2) {", vars: { k: "2", len: "6" }, log: "Initialize linked list 1..6, k = 2. Form ring & break new tail pointer.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }] },
      { line: 7, code: "  connect tail (6) -> head (1); break at node 2 (newTail.next = null);", vars: { newHead: "3", newTail: "2" }, log: "Form circular ring. Break after 2nd node (node 2 becomes new tail, node 3 becomes new head).", arrayState: [{ val: "3", match: true }, { val: "4", match: true }, { val: "5", match: true }, { val: "6", match: true }, { val: "1", match: true }, { val: "2", match: true }] },
      { line: 12, code: "  return 3 -> 4 -> 5 -> 6 -> 1 -> 2; // ROTATE LINKED LIST COMPLETE", vars: { rotated: "3 -> 4 -> 5 -> 6 -> 1 -> 2", status: "COMPLETE" }, log: "Linked list rotation complete!", arrayState: [{ val: "3", match: true }, { val: "4", match: true }, { val: "5", match: true }, { val: "6", match: true }, { val: "1", match: true }, { val: "2", match: true }] }
    ]
  },

  // ── 131. SEGREGATE EVEN AND ODD NODES IN A LINKED LIST ──
  "segregate even and odd nodes in a linked list": {
    solutionJS: `function divide(n, head) {
  let evenHead = new Node(0), oddHead = new Node(0);
  let even = evenHead, odd = oddHead;
  let curr = head;
  while (curr) {
    if (curr.data % 2 === 0) { even.next = curr; even = even.next; }
    else { odd.next = curr; odd = odd.next; }
    curr = curr.next;
  }
  even.next = oddHead.next;
  odd.next = null;
  return evenHead.next;
}`,
    solutionPY: `def divide(n, head):
    even_head, odd_head = Node(0), Node(0)
    even, odd = even_head, odd_head
    curr = head
    while curr:
        if curr.data % 2 == 0: even.next = curr; even = even.next
        else: odd.next = curr; odd = odd.next
        curr = curr.next
    even.next = odd_head.next
    odd.next = None
    return even_head.next`,
    solutionCPP: `Node* divide(int n, Node *head) {
    Node *evenHead = new Node(0), *oddHead = new Node(0);
    Node *even = evenHead, *odd = oddHead, *curr = head;
    while (curr) {
        if (curr->data % 2 == 0) { even->next = curr; even = even->next; }
        else { odd->next = curr; odd = odd->next; }
        curr = curr->next;
    }
    even->next = oddHead->next;
    odd->next = NULL;
    return evenHead->next;
}`,
    visualizerSteps: [
      { line: 1, code: "function divide(head = 17 -> 15 -> 8 -> 9 -> 2 -> 4 -> 6) {", vars: { head: "17 -> 15 -> 8 -> 9 -> 2 -> 4 -> 6" }, log: "Initialize list 17, 15, 8, 9, 2, 4, 6. Two-dummy pointer segregation.", arrayState: [{ val: "17" }, { val: "15" }, { val: "8" }, { val: "9" }, { val: "2" }, { val: "4" }, { val: "6" }] },
      { line: 6, code: "  evens: [8, 2, 4, 6], odds: [17, 15, 9]; connect evens -> odds;", vars: { evens: "[8, 2, 4, 6]", odds: "[17, 15, 9]" }, log: "Partition nodes into Evens dummy list [8, 2, 4, 6] and Odds dummy list [17, 15, 9]. Connect evens to odds.", arrayState: [{ val: "8 (Even)", match: true }, { val: "2 (Even)", match: true }, { val: "4 (Even)", match: true }, { val: "6 (Even)", match: true }, { val: "17 (Odd)", match: true }, { val: "15 (Odd)", match: true }, { val: "9 (Odd)", match: true }] },
      { line: 12, code: "  return 8 -> 2 -> 4 -> 6 -> 17 -> 15 -> 9; // SEGREGATE EVEN ODD COMPLETE", vars: { status: "COMPLETE" }, log: "Even and odd nodes segregation complete!", arrayState: [{ val: "8", match: true }, { val: "2", match: true }, { val: "4", match: true }, { val: "6", match: true }, { val: "17", match: true }, { val: "15", match: true }, { val: "9", match: true }] }
    ]
  },

  // ── 132. ADD TWO NUMBERS ──
  "add two numbers": {
    solutionJS: `function addTwoNumbers(l1, l2) {
  let dummy = new ListNode(0);
  let curr = dummy, carry = 0;
  while (l1 || l2 || carry) {
    let sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(sum / 10);
    curr.next = new ListNode(sum % 10);
    curr = curr.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}`,
    solutionPY: `def addTwoNumbers(l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
    dummy = ListNode(0); curr, carry = dummy, 0
    while l1 or l2 or carry:
        s = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry
        carry = s // 10
        curr.next = ListNode(s % 10)
        curr = curr.next
        if l1: l1 = l1.next
        if l2: l2 = l2.next
    return dummy.next`,
    solutionCPP: `ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode dummy(0); ListNode* curr = &dummy; int carry = 0;
    while (l1 || l2 || carry) {
        int sum = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + carry;
        carry = sum / 10;
        curr->next = new ListNode(sum % 10);
        curr = curr->next;
        if (l1) l1 = l1->next;
        if (l2) l2 = l2->next;
    }
    return dummy.next;
}`,
    visualizerSteps: [
      { line: 1, code: "function addTwoNumbers(l1 = 2 -> 4 -> 3, l2 = 5 -> 6 -> 4) {", vars: { l1: "342", l2: "465" }, log: "Initialize l1 = 2 -> 4 -> 3 (342) and l2 = 5 -> 6 -> 4 (465). Single-pass sum.", arrayState: [{ val: "2 + 5" }, { val: "4 + 6" }, { val: "3 + 4" }] },
      { line: 5, code: "  2+5=7 (c:0); 4+6=10 (digit:0, c:1); 3+4+1=8 (digit:8, c:0);", vars: { digit1: "7", digit2: "0", digit3: "8" }, log: "Digit additions: 2+5=7; 4+6=10 (digit 0, carry 1); 3+4+1=8 (digit 8, carry 0).", arrayState: [{ val: "7", match: true }, { val: "0", match: true }, { val: "8", match: true }] },
      { line: 13, code: "  return 7 -> 0 -> 8; // ADD TWO NUMBERS COMPLETE", vars: { result: "7 -> 0 -> 8 (807)", status: "COMPLETE" }, log: "Add Two Numbers complete!", arrayState: [{ val: "7", match: true }, { val: "0", match: true }, { val: "8", match: true }] }
    ]
  },

  // ── 133. COPY LIST WITH RANDOM POINTER ──
  "copy list with random pointer": {
    solutionJS: `function copyRandomList(head) {
  if (!head) return null;
  let curr = head;
  while (curr) {
    let copy = new Node(curr.val, curr.next, null);
    curr.next = copy;
    curr = copy.next;
  }
  curr = head;
  while (curr) {
    if (curr.random) curr.next.random = curr.random.next;
    curr = curr.next.next;
  }
  curr = head;
  let dummy = new Node(0), copyCurr = dummy;
  while (curr) {
    copyCurr.next = curr.next;
    copyCurr = copyCurr.next;
    curr.next = curr.next.next;
    curr = curr.next;
  }
  return dummy.next;
}`,
    solutionPY: `def copyRandomList(head: 'Optional[Node]') -> 'Optional[Node]':
    if not head: return None
    curr = head
    while curr:
        copy = Node(curr.val, curr.next, None)
        curr.next = copy
        curr = copy.next
    curr = head
    while curr:
        if curr.random: curr.next.random = curr.random.next
        curr = curr.next.next
    curr = head
    dummy = Node(0); copy_curr = dummy
    while curr:
        copy_curr.next = curr.next
        copy_curr = copy_curr.next
        curr.next = curr.next.next
        curr = curr.next
    return dummy.next`,
    solutionCPP: `Node* copyRandomList(Node* head) {
    if (!head) return NULL;
    Node* curr = head;
    while (curr) {
        Node* copy = new Node(curr->val);
        copy->next = curr->next;
        curr->next = copy;
        curr = copy->next;
    }
    curr = head;
    while (curr) {
        if (curr->random) curr->next->random = curr->random->next;
        curr = curr->next->next;
    }
    curr = head;
    Node dummy(0); Node* copyCurr = &dummy;
    while (curr) {
        copyCurr->next = curr->next;
        copyCurr = copyCurr->next;
        curr->next = curr->next->next;
        curr = curr->next;
    }
    return dummy.next;
}`,
    visualizerSteps: [
      { line: 1, code: "function copyRandomList(head = 1 -> 2 -> 3 with random pointers) {", vars: { head: "1 -> 2 -> 3" }, log: "Initialize linked list with random pointers. 3-pass O(1) space deep copy algorithm.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }] },
      { line: 4, code: "  pass 1: interleave copies -> 1 -> 1' -> 2 -> 2' -> 3 -> 3';", vars: { interleaved: "1 -> 1' -> 2 -> 2' -> 3 -> 3'" }, log: "Pass 1: Interleave cloned nodes after originals: 1 -> 1' -> 2 -> 2' -> 3 -> 3'.", arrayState: [{ val: "1" }, { val: "1' (Copy)" }, { val: "2" }, { val: "2' (Copy)" }, { val: "3" }, { val: "3' (Copy)" }] },
      { line: 10, code: "  pass 2: copy random pointers; pass 3: decouple original & deep copy lists;", vars: { copiedHead: "1'" }, log: "Pass 2: Set copy.random = original.random.next. Pass 3: Decouple & restore original list links.", arrayState: [{ val: "1' (Deep Copy)", match: true }, { val: "2' (Deep Copy)", match: true }, { val: "3' (Deep Copy)", match: true }] },
      { line: 20, code: "  return 1' -> 2' -> 3'; // COPY LIST WITH RANDOM POINTER COMPLETE", vars: { status: "COMPLETE" }, log: "Deep copy with random pointers complete cleanly!", arrayState: [{ val: "1' (Deep Copy)", match: true }, { val: "2' (Deep Copy)", match: true }, { val: "3' (Deep Copy)", match: true }] }
    ]
  },

  // ── 134. DELETE NODES HAVING GREATER VALUE ON RIGHT ──
  "delete nodes having greater value on right": {
    solutionJS: `function compute(head) {
  function reverse(node) {
    let prev = null, curr = node;
    while (curr) {
      let next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
    return prev;
  }
  head = reverse(head);
  let maxVal = head.data, curr = head;
  while (curr && curr.next) {
    if (curr.next.data < maxVal) {
      curr.next = curr.next.next;
    } else {
      curr = curr.next;
      maxVal = curr.data;
    }
  }
  return reverse(head);
}`,
    solutionPY: `def compute(head):
    def reverse(node):
        prev, curr = None, node
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev
    head = reverse(head)
    max_val, curr = head.data, head
    while curr and curr.next:
        if curr.next.data < max_val:
            curr.next = curr.next.next
        else:
            curr = curr.next
            max_val = curr.data
    return reverse(head)`,
    solutionCPP: `Node *compute(Node *head) {
    auto reverse = [](Node* node) {
        Node *prev = NULL, *curr = node;
        while (curr) { Node* next = curr->next; curr->next = prev; prev = curr; curr = next; }
        return prev;
    };
    head = reverse(head);
    int maxVal = head->data; Node* curr = head;
    while (curr && curr->next) {
        if (curr->next->data < maxVal) {
            Node* temp = curr->next;
            curr->next = curr->next->next;
            delete temp;
        } else {
            curr = curr->next;
            maxVal = curr->data;
        }
    }
    return reverse(head);
}`,
    visualizerSteps: [
      { line: 1, code: "function compute(head = 12 -> 15 -> 10 -> 11 -> 5 -> 6 -> 2 -> 3) {", vars: { head: "12 -> 15 -> 10 -> 11 -> 5 -> 6 -> 2 -> 3" }, log: "Initialize list. Reverse list and track max value right-to-left.", arrayState: [{ val: "12" }, { val: "15" }, { val: "10" }, { val: "11" }, { val: "5" }, { val: "6" }, { val: "2" }, { val: "3" }] },
      { line: 13, code: "  reverse -> 3 -> 2 -> 6 -> 5 -> 11 -> 10 -> 15 -> 12; delete nodes < maxVal;", vars: { maxVal: "15", kept: "15, 11, 6, 3" }, log: "Reversed pass: Keep 3 (max: 3), delete 2, keep 6 (max: 6), delete 5, keep 11 (max: 11), delete 10, keep 15 (max: 15), delete 12.", arrayState: [{ val: "15", match: true }, { val: "11", match: true }, { val: "6", match: true }, { val: "3", match: true }] },
      { line: 22, code: "  reverse back -> 15 -> 11 -> 6 -> 3; // DELETE GREATER RIGHT NODES COMPLETE", vars: { result: "15 -> 11 -> 6 -> 3", status: "COMPLETE" }, log: "Reverse list back: 15 -> 11 -> 6 -> 3.", arrayState: [{ val: "15", match: true }, { val: "11", match: true }, { val: "6", match: true }, { val: "3", match: true }] }
    ]
  },

  // ── 135. FIND THE DUPLICATE NUMBER ──
  "find the duplicate number": {
    solutionJS: `function findDuplicate(nums) {
  let slow = nums[0], fast = nums[nums[0]];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[nums[fast]];
  }
  slow = 0;
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,
    solutionPY: `def findDuplicate(nums: List[int]) -> int:
    slow, fast = nums[0], nums[nums[0]]
    while slow != fast:
        slow = nums[slow]
        fast = nums[nums[fast]]
    slow = 0
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow`,
    solutionCPP: `int findDuplicate(vector<int>& nums) {
    int slow = nums[0], fast = nums[nums[0]];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[nums[fast]];
    }
    slow = 0;
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}`,
    visualizerSteps: [
      { line: 1, code: "function findDuplicate(nums = [1, 3, 4, 2, 2]) {", vars: { nums: "[1, 3, 4, 2, 2]" }, log: "Initialize nums = [1, 3, 4, 2, 2]. Floyd's Tortoise and Hare index cycle detection.", arrayState: [{ val: "1" }, { val: "3" }, { val: "4" }, { val: "2" }, { val: "2" }] },
      { line: 3, code: "  phase 1 collision at 2; phase 2: slow = 0, move both 1 step -> meet at 2;", vars: { duplicate: "2" }, log: "Phase 1 pointers collide at index 2. Phase 2 reset slow to 0: Both meet at 2!", arrayState: [{ val: "1" }, { val: "3" }, { val: "4" }, { val: "2 (Duplicate)", match: true }, { val: "2 (Duplicate)", match: true }] },
      { line: 13, code: "  return 2; // FIND DUPLICATE NUMBER COMPLETE", vars: { duplicateNumber: "2", status: "COMPLETE" }, log: "Duplicate number finding complete!", arrayState: [{ val: "1" }, { val: "3" }, { val: "4" }, { val: "2 (Duplicate)", match: true }, { val: "2 (Duplicate)", match: true }] }
    ]
  },

  // ── 136. FLATTENING A LINKED LIST ──
  "flattening a linked list": {
    solutionJS: `function flatten(root) {
  if (!root || !root.next) return root;
  root.next = flatten(root.next);
  root = merge(root, root.next);
  return root;
}
function merge(a, b) {
  if (!a) return b;
  if (!b) return a;
  let result;
  if (a.data < b.data) {
    result = a;
    result.bottom = merge(a.bottom, b);
  } else {
    result = b;
    result.bottom = merge(a, b.bottom);
  }
  result.next = null;
  return result;
}`,
    solutionPY: `def flatten(root):
    if not root or not root.next: return root
    root.next = flatten(root.next)
    root = merge(root, root.next)
    return root
def merge(a, b):
    if not a: return b
    if not b: return a
    if a.data < b.data:
        res = a; res.bottom = merge(a.bottom, b)
    else:
        res = b; res.bottom = merge(a, b.bottom)
    res.next = None
    return res`,
    solutionCPP: `Node *flatten(Node *root) {
    if (!root || !root->next) return root;
    root->next = flatten(root->next);
    root = merge(root, root->next);
    return root;
}`,
    visualizerSteps: [
      { line: 1, code: "function flatten(root = 5->10->19->28 with bottom lists) {", vars: { mainList: "5 -> 10 -> 19 -> 28" }, log: "Initialize 2D linked list. Recursive right-to-left 2-way bottom list merging.", arrayState: [{ val: "5 (b:7,8)" }, { val: "10 (b:20)" }, { val: "19 (b:22,50)" }, { val: "28 (b:35,40,45)" }] },
      { line: 4, code: "  recursively merge bottom lists -> 5->7->8->10->19->20->22->28->35->40->45;", vars: { flattenedCount: "11" }, log: "Recursively merge bottom sorted sublists into a single 1D bottom-linked list.", arrayState: [{ val: "5", match: true }, { val: "7", match: true }, { val: "8", match: true }, { val: "10", match: true }, { val: "19", match: true }, { val: "20", match: true }, { val: "22", match: true }, { val: "28", match: true }, { val: "35", match: true }, { val: "40", match: true }, { val: "45", match: true }] },
      { line: 16, code: "  return flattenedHead; // FLATTENING LINKED LIST COMPLETE", vars: { status: "COMPLETE" }, log: "2D Linked list flattening complete!", arrayState: [{ val: "5", match: true }, { val: "7", match: true }, { val: "8", match: true }, { val: "10", match: true }, { val: "19", match: true }, { val: "20", match: true }, { val: "22", match: true }, { val: "28", match: true }, { val: "35", match: true }, { val: "40", match: true }, { val: "45", match: true }] }
    ]
  },

  // ── 137. INTERSECTION POINT IN Y SHAPED LINKED LISTS ──
  "intersection point in y shaped linked lists": {
    solutionJS: `function intersectPoint(head1, head2) {
  let ptr1 = head1, ptr2 = head2;
  while (ptr1 !== ptr2) {
    ptr1 = ptr1 ? ptr1.next : head2;
    ptr2 = ptr2 ? ptr2.next : head1;
  }
  return ptr1 ? ptr1.data : -1;
}`,
    solutionPY: `def intersectPoint(head1, head2):
    ptr1, ptr2 = head1, head2
    while ptr1 != ptr2:
        ptr1 = ptr1.next if ptr1 else head2
        ptr2 = ptr2.next if ptr2 else head1
    return ptr1.data if ptr1 else -1`,
    solutionCPP: `int intersectPoint(Node* head1, Node* head2) {
    Node *ptr1 = head1, *ptr2 = head2;
    while (ptr1 != ptr2) {
        ptr1 = ptr1 ? ptr1->next : head2;
        ptr2 = ptr2 ? ptr2->next : head1;
    }
    return ptr1 ? ptr1->data : -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function intersectPoint(head1 = [3,6,9,15,30], head2 = [10,15,30]) {", vars: { h1: "[3,6,9,15,30]", h2: "[10,15,30]" }, log: "Initialize Y-shaped lists intersecting at node 15. 2-pointer switch traversal.", arrayState: [{ val: "List A: 3, 6, 9" }, { val: "List B: 10" }, { val: "Intersection: 15, 30" }] },
      { line: 4, code: "  ptr1 & ptr2 switch lists on end -> collide at node 15 (val 15);", vars: { intersectionNode: "15" }, log: "Ptr1 traverses A then B; Ptr2 traverses B then A. Pointers collide at node 15!", arrayState: [{ val: "3" }, { val: "6" }, { val: "9" }, { val: "10" }, { val: "15 (Intersection)", match: true }, { val: "30" }] },
      { line: 7, code: "  return 15; // Y SHAPED LINKED LIST INTERSECTION COMPLETE", vars: { intersection: "15", status: "COMPLETE" }, log: "Intersection point finding complete!", arrayState: [{ val: "3" }, { val: "6" }, { val: "9" }, { val: "10" }, { val: "15 (Intersection)", match: true }, { val: "30" }] }
    ]
  },

  // ── 138. LRU CACHE ──
  "lru cache": {
    solutionJS: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    let val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      let firstKey = this.map.keys().next().value;
      this.map.delete(firstKey);
    }
  }
}`,
    solutionPY: `class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = collections.OrderedDict()
    def get(self, key: int) -> int:
        if key not in self.cache: return -1
        self.cache.move_to_end(key)
        return self.cache[key]
    def put(self, key: int, value: int) -> None:
        if key in self.cache: self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap: self.cache.popitem(last=False)`,
    solutionCPP: `class LRUCache {
    int cap;
    list<pair<int, int>> lru;
    unordered_map<int, list<pair<int, int>>::iterator> map;
public:
    LRUCache(int capacity) : cap(capacity) {}
    int get(int key) {
        if (!map.count(key)) return -1;
        lru.splice(lru.begin(), lru, map[key]);
        return map[key]->second;
    }
    void put(int key, int value) {
        if (map.count(key)) {
            lru.splice(lru.begin(), lru, map[key]);
            map[key]->second = value;
            return;
        }
        if (lru.size() == cap) {
            auto delKey = lru.back().first;
            lru.pop_back(); map.erase(delKey);
        }
        lru.push_front({key, value});
        map[key] = lru.begin();
    }
};`,
    visualizerSteps: [
      { line: 1, code: "class LRUCache { capacity = 2;", vars: { capacity: "2" }, log: "Initialize LRU Cache with capacity = 2. Map + Doubly Linked List for O(1) ops.", arrayState: [{ val: "Cache: []" }] },
      { line: 12, code: "  put(1,1), put(2,2) -> Cache: [2:2 (MRU), 1:1 (LRU)]; get(1) -> moves 1:1 to MRU;", vars: { MRU: "1:1", LRU: "2:2" }, log: "put(1,1), put(2,2). get(1) accesses key 1: Promotes key 1 to Most Recently Used (MRU).", arrayState: [{ val: "1:1 (MRU)", match: true }, { val: "2:2 (LRU)" }] },
      { line: 12, code: "  put(3,3) -> Evicts LRU key 2! Cache: [3:3 (MRU), 1:1 (LRU)];", vars: { evicted: "2:2", cache: "[3:3, 1:1]" }, log: "put(3,3) exceeds capacity! Evicts Least Recently Used key 2. Cache becomes [3:3, 1:1].", arrayState: [{ val: "3:3 (MRU)", match: true }, { val: "1:1 (LRU)", match: true }] }
    ]
  },

  // ── 139. MERGE IN BETWEEN LINKED LISTS ──
  "merge in between linked lists": {
    solutionJS: `function mergeInBetween(list1, a, b, list2) {
  let prevA = list1;
  for (let i = 0; i < a - 1; i++) prevA = prevA.next;
  let afterB = prevA;
  for (let i = 0; i < b - a + 2; i++) afterB = afterB.next;
  prevA.next = list2;
  let tail2 = list2;
  while (tail2.next) tail2 = tail2.next;
  tail2.next = afterB;
  return list1;
}`,
    solutionPY: `def mergeInBetween(list1: ListNode, a: int, b: int, list2: ListNode) -> ListNode:
    prev_a = list1
    for _ in range(a - 1): prev_a = prev_a.next
    after_b = prev_a
    for _ in range(b - a + 2): after_b = after_b.next
    prev_a.next = list2
    tail2 = list2
    while tail2.next: tail2 = tail2.next
    tail2.next = after_b
    return list1`,
    solutionCPP: `ListNode* mergeInBetween(ListNode* list1, int a, int b, ListNode* list2) {
    ListNode* prevA = list1;
    for (int i = 0; i < a - 1; i++) prevA = prevA->next;
    ListNode* afterB = prevA;
    for (int i = 0; i < b - a + 2; i++) afterB = afterB->next;
    prevA.next = list2;
    ListNode* tail2 = list2;
    while (tail2->next) tail2 = tail2->next;
    tail2->next = afterB;
    return list1;
}`,
    visualizerSteps: [
      { line: 1, code: "function mergeInBetween(list1 = 10->1->13->6->9->5, a = 3, b = 4, list2 = 1000..1002) {", vars: { a: "3", b: "4" }, log: "Initialize list1, a = 3, b = 4, list2. Find prevA (idx 2) & afterB (idx 5).", arrayState: [{ val: "10" }, { val: "1" }, { val: "13 (prevA)" }, { val: "6 (remove)" }, { val: "9 (remove)" }, { val: "5 (afterB)" }] },
      { line: 6, code: "  prevA.next = list2; list2Tail.next = afterB;", vars: { spliced: "13 -> 1000000..1000002 -> 5" }, log: "Splice list2 between node 13 and node 5. Nodes 6 and 9 replaced by list2.", arrayState: [{ val: "10", match: true }, { val: "1", match: true }, { val: "13", match: true }, { val: "1000000", match: true }, { val: "1000001", match: true }, { val: "1000002", match: true }, { val: "5", match: true }] },
      { line: 10, code: "  return list1; // MERGE IN BETWEEN LINKED LISTS COMPLETE", vars: { status: "COMPLETE" }, log: "Merge In Between Linked Lists complete!", arrayState: [{ val: "10", match: true }, { val: "1", match: true }, { val: "13", match: true }, { val: "1000000", match: true }, { val: "1000001", match: true }, { val: "1000002", match: true }, { val: "5", match: true }] }
    ]
  },

  // ── 140. PARTITION LIST ──
  "partition list": {
    solutionJS: `function partition(head, x) {
  let smallHead = new ListNode(0), largeHead = new ListNode(0);
  let small = smallHead, large = largeHead;
  let curr = head;
  while (curr) {
    if (curr.val < x) { small.next = curr; small = small.next; }
    else { large.next = curr; large = large.next; }
    curr = curr.next;
  }
  large.next = null;
  small.next = largeHead.next;
  return smallHead.next;
}`,
    solutionPY: `def partition(head: Optional[ListNode], x: int) -> Optional[ListNode]:
    small_head, large_head = ListNode(0), ListNode(0)
    small, large = small_head, large_head
    curr = head
    while curr:
        if curr.val < x: small.next = curr; small = small.next
        else: large.next = curr; large = large.next
        curr = curr.next
    large.next = None
    small.next = large_head.next
    return small_head.next`,
    solutionCPP: `ListNode* partition(ListNode* head, int x) {
    ListNode smallHead(0), largeHead(0);
    ListNode *small = &smallHead, *large = &largeHead;
    ListNode *curr = head;
    while (curr) {
        if (curr->val < x) { small->next = curr; small = small->next; }
        else { large->next = curr; large = large->next; }
        curr = curr->next;
    }
    large->next = NULL;
    small->next = largeHead.next;
    return smallHead.next;
}`,
    visualizerSteps: [
      { line: 1, code: "function partition(head = 1 -> 4 -> 3 -> 2 -> 5 -> 2, x = 3) {", vars: { x: "3" }, log: "Initialize list 1, 4, 3, 2, 5, 2, x = 3. Two dummy list partition pass.", arrayState: [{ val: "1" }, { val: "4" }, { val: "3" }, { val: "2" }, { val: "5" }, { val: "2" }] },
      { line: 6, code: "  small (<3): [1, 2, 2]; large (>=3): [4, 3, 5]; connect small -> large;", vars: { small: "[1, 2, 2]", large: "[4, 3, 5]" }, log: "Partition nodes: small dummy list [1, 2, 2] (< 3) and large dummy list [4, 3, 5] (>= 3). Connect small to large.", arrayState: [{ val: "1 (<3)", match: true }, { val: "2 (<3)", match: true }, { val: "2 (<3)", match: true }, { val: "4 (>=3)", match: true }, { val: "3 (>=3)", match: true }, { val: "5 (>=3)", match: true }] },
      { line: 13, code: "  return 1 -> 2 -> 2 -> 4 -> 3 -> 5; // PARTITION LIST COMPLETE", vars: { status: "COMPLETE" }, log: "Partition list complete while preserving original relative node order!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "2", match: true }, { val: "4", match: true }, { val: "3", match: true }, { val: "5", match: true }] }
    ]
  },

  // ── 141. QUICK SORT ON LINKED LIST ──
  "quick sort on linked list": {
    solutionJS: `function quickSort(head) {
  if (!head || !head.next) return head;
  let pivot = head;
  let leftHead = new Node(0), rightHead = new Node(0);
  let left = leftHead, right = rightHead;
  let curr = head.next;
  while (curr) {
    if (curr.data < pivot.data) { left.next = curr; left = left.next; }
    else { right.next = curr; right = right.next; }
    curr = curr.next;
  }
  left.next = null; right.next = null;
  let sortedLeft = quickSort(leftHead.next);
  let sortedRight = quickSort(rightHead.next);
  pivot.next = sortedRight;
  if (!sortedLeft) return pivot;
  let tail = sortedLeft;
  while (tail.next) tail = tail.next;
  tail.next = pivot;
  return sortedLeft;
}`,
    solutionPY: `def quickSort(head):
    if not head or not head.next: return head
    pivot = head
    left_head, right_head = Node(0), Node(0)
    left, right = left_head, right_head
    curr = head.next
    while curr:
        if curr.data < pivot.data: left.next = curr; left = left.next
        else: right.next = curr; right = right.next
        curr = curr.next
    left.next = None; right.next = None
    sorted_left = quickSort(left_head.next)
    sorted_right = quickSort(right_head.next)
    pivot.next = sorted_right
    if not sorted_left: return pivot
    tail = sorted_left
    while tail.next: tail = tail.next
    tail.next = pivot
    return sorted_left`,
    solutionCPP: `Node* quickSort(Node* head) {
    if (!head || !head->next) return head;
    Node* pivot = head;
    Node leftHead(0), rightHead(0);
    Node *left = &leftHead, *right = &rightHead, *curr = head->next;
    while (curr) {
        if (curr->data < pivot->data) { left->next = curr; left = left->next; }
        else { right->next = curr; right = right->next; }
        curr = curr->next;
    }
    left->next = NULL; right->next = NULL;
    Node* sortedLeft = quickSort(leftHead.next);
    Node* sortedRight = quickSort(rightHead.next);
    pivot->next = sortedRight;
    if (!sortedLeft) return pivot;
    Node* tail = sortedLeft;
    while (tail->next) tail = tail->next;
    tail->next = pivot;
    return sortedLeft;
}`,
    visualizerSteps: [
      { line: 1, code: "function quickSort(head = 1 -> 9 -> 3 -> 8) {", vars: { head: "1 -> 9 -> 3 -> 8" }, log: "Initialize unsorted list 1, 9, 3, 8. Quick sort pivot partition.", arrayState: [{ val: "1" }, { val: "9" }, { val: "3" }, { val: "8" }] },
      { line: 4, code: "  pivot = 8 -> left [<8]: [1, 3], right [>=8]: [9]; concatenate left -> pivot -> right;", vars: { pivot: "8", sorted: "1 -> 3 -> 8 -> 9" }, log: "Partition around pivot 8. Left sublist [1, 3], Right sublist [9]. Concatenate sorted sublists.", arrayState: [{ val: "1", match: true }, { val: "3", match: true }, { val: "8 (Pivot)", match: true }, { val: "9", match: true }] },
      { line: 18, code: "  return 1 -> 3 -> 8 -> 9; // QUICK SORT LINKED LIST COMPLETE", vars: { status: "COMPLETE" }, log: "Quick sort for linked list complete!", arrayState: [{ val: "1", match: true }, { val: "3", match: true }, { val: "8", match: true }, { val: "9", match: true }] }
    ]
  },

  // ── 142. REMOVE DUPLICATES FROM SORTED LIST II ──
  "remove duplicates from sorted list ii": {
    solutionJS: `function deleteDuplicates(head) {
  let dummy = new ListNode(0, head);
  let prev = dummy;
  while (head) {
    if (head.next && head.val === head.next.val) {
      while (head.next && head.val === head.next.val) head = head.next;
      prev.next = head.next;
    } else {
      prev = prev.next;
    }
    head = head.next;
  }
  return dummy.next;
}`,
    solutionPY: `def deleteDuplicates(head: Optional[ListNode]) -> Optional[ListNode]:
    dummy = ListNode(0, head)
    prev = dummy
    while head:
        if head.next and head.val == head.next.val:
            while head.next and head.val == head.next.val:
                head = head.next
            prev.next = head.next
        else:
            prev = prev.next
        head = head.next
    return dummy.next`,
    solutionCPP: `ListNode* deleteDuplicates(ListNode* head) {
    ListNode dummy(0, head);
    ListNode* prev = &dummy;
    while (head) {
        if (head->next && head->val == head->next->val) {
            while (head->next && head->val == head->next->val) head = head->next;
            prev->next = head->next;
        } else {
            prev = prev->next;
        }
        head = head->next;
    }
    return dummy.next;
}`,
    visualizerSteps: [
      { line: 1, code: "function deleteDuplicates(head = 1 -> 2 -> 3 -> 3 -> 4 -> 4 -> 5) {", vars: { head: "1 -> 2 -> 3 -> 3 -> 4 -> 4 -> 5" }, log: "Initialize list 1,2,3,3,4,4,5. Remove all occurrences of duplicate values.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "3" }, { val: "4" }, { val: "4" }, { val: "5" }] },
      { line: 5, code: "  skip all 3s and all 4s -> link 2 directly to 5;", vars: { removed: "3s and 4s", kept: "1, 2, 5" }, log: "Duplicate values 3 and 4 detected: Delete all nodes with values 3 and 4. Link 2 directly to 5.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "5", match: true }] },
      { line: 12, code: "  return 1 -> 2 -> 5; // REMOVE DUPLICATES II COMPLETE", vars: { result: "1 -> 2 -> 5", status: "COMPLETE" }, log: "Remove duplicates from sorted list II complete!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "5", match: true }] }
    ]
  },

  // ── 143. REMOVE NTH NODE FROM END OF LIST ──
  "remove nth node from end of list": {
    solutionJS: `function removeNthFromEnd(head, n) {
  let dummy = new ListNode(0, head);
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) {
    slow = slow.next;
    fast = fast.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
    solutionPY: `def removeNthFromEnd(head: Optional[ListNode], n: int) -> Optional[ListNode]:
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1): fast = fast.next
    while fast:
        slow = slow.next; fast = fast.next
    slow.next = slow.next.next
    return dummy.next`,
    solutionCPP: `ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0, head);
    ListNode *fast = &dummy, *slow = &dummy;
    for (int i = 0; i <= n; i++) fast = fast->next;
    while (fast) {
        slow = slow->next; fast = fast->next;
    }
    slow->next = slow->next->next;
    return dummy.next;
}`,
    visualizerSteps: [
      { line: 1, code: "function removeNthFromEnd(head = 1 -> 2 -> 3 -> 4 -> 5, n = 2) {", vars: { n: "2" }, log: "Initialize list 1..5, n = 2. Two pointer search for (n+1)th node from end.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }] },
      { line: 5, code: "  fast advances 3 steps -> fast & slow advance together until slow at node 3;", vars: { slow: "node 3", target: "node 4" }, log: "Fast pointer creates gap of 3 nodes. Fast & slow move together: Slow rests at node 3 (before target node 4).", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (slow)", active: true }, { val: "4 (target)" }, { val: "5" }] },
      { line: 9, code: "  node3.next = node5 -> remove node 4 -> 1 -> 2 -> 3 -> 5;", vars: { result: "1 -> 2 -> 3 -> 5" }, log: "Unlink node 4: Update node3.next = node 5. Node 4 removed cleanly!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "5", match: true }] },
      { line: 10, code: "  return 1 -> 2 -> 3 -> 5; // REMOVE NTH NODE FROM END COMPLETE", vars: { status: "COMPLETE" }, log: "Remove Nth Node From End of List complete!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "5", match: true }] }
    ]
  },

  // ── 144. REORDER LIST ──
  "reorder list": {
    solutionJS: `function reorderList(head) {
  if (!head || !head.next) return;
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let prev = null, curr = slow.next;
  slow.next = null;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  let first = head, second = prev;
  while (second) {
    let tmp1 = first.next, tmp2 = second.next;
    first.next = second;
    second.next = tmp1;
    first = tmp1;
    second = tmp2;
  }
}`,
    solutionPY: `def reorderList(head: Optional[ListNode]) -> None:
    if not head or not head.next: return
    slow = fast = head
    while fast and fast.next:
        slow = slow.next; fast = fast.next.next
    prev, curr = None, slow.next
    slow.next = None
    while curr:
        nxt = curr.next; curr.next = prev; prev = curr; curr = nxt
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second; second.next = tmp1
        first, second = tmp1, tmp2`,
    solutionCPP: `void reorderList(ListNode* head) {
    if (!head || !head.next) return;
    ListNode *slow = head, *fast = head;
    while (fast && fast.next) { slow = slow->next; fast = fast->next->next; }
    ListNode *prev = NULL, *curr = slow->next;
    slow->next = NULL;
    while (curr) { ListNode* next = curr->next; curr->next = prev; prev = curr; curr = next; }
    ListNode *first = head, *second = prev;
    while (second) {
        ListNode *tmp1 = first->next, *tmp2 = second->next;
        first->next = second; second->next = tmp1;
        first = tmp1; second = tmp2;
    }
}`,
    visualizerSteps: [
      { line: 1, code: "function reorderList(head = 1 -> 2 -> 3 -> 4 -> 5) {", vars: { head: "1 -> 2 -> 3 -> 4 -> 5" }, log: "Initialize list 1..5. Find middle, reverse second half, and interleave.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }] },
      { line: 8, code: "  split mid -> left [1, 2, 3], right [4, 5]; reverse right -> [5, 4];", vars: { left: "[1, 2, 3]", reversedRight: "[5, 4]" }, log: "Split at mid: Left half [1, 2, 3], Reversed right half [5, 4].", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "5 (Rev)", active: true }, { val: "4 (Rev)", active: true }] },
      { line: 16, code: "  interleave -> 1 -> 5 -> 2 -> 4 -> 3; // REORDER LIST COMPLETE", vars: { reordered: "1 -> 5 -> 2 -> 4 -> 3", status: "COMPLETE" }, log: "Interleave first half and reversed second half: 1 -> 5 -> 2 -> 4 -> 3.", arrayState: [{ val: "1", match: true }, { val: "5", match: true }, { val: "2", match: true }, { val: "4", match: true }, { val: "3", match: true }] }
    ]
  },

  // ── 145. REVERSE LINKED LIST II ──
  "reverse linked list ii": {
    solutionJS: `function reverseBetween(head, left, right) {
  if (!head || left === right) return head;
  let dummy = new ListNode(0, head);
  let prev = dummy;
  for (let i = 0; i < left - 1; i++) prev = prev.next;
  let curr = prev.next;
  for (let i = 0; i < right - left; i++) {
    let next = curr.next;
    curr.next = next.next;
    next.next = prev.next;
    prev.next = next;
  }
  return dummy.next;
}`,
    solutionPY: `def reverseBetween(head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
    if not head or left == right: return head
    dummy = ListNode(0, head)
    prev = dummy
    for _ in range(left - 1): prev = prev.next
    curr = prev.next
    for _ in range(right - left):
        nxt = curr.next
        curr.next = nxt.next
        nxt.next = prev.next
        prev.next = nxt
    return dummy.next`,
    solutionCPP: `ListNode* reverseBetween(ListNode* head, int left, int right) {
    if (!head || left == right) return head;
    ListNode dummy(0, head);
    ListNode* prev = &dummy;
    for (int i = 0; i < left - 1; i++) prev = prev->next;
    ListNode* curr = prev->next;
    for (int i = 0; i < right - left; i++) {
        ListNode* next = curr->next;
        curr->next = next->next;
        next->next = prev->next;
        prev->next = next;
    }
    return dummy.next;
}`,
    visualizerSteps: [
      { line: 1, code: "function reverseBetween(head = 1 -> 2 -> 3 -> 4 -> 5, left = 2, right = 4) {", vars: { left: "2", right: "4" }, log: "Initialize list 1..5, left = 2, right = 4. Reverse subsegment between pos 2 and 4.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }] },
      { line: 7, code: "  reverse subsegment [2, 3, 4] -> [4, 3, 2]; re-link prev (1) and next (5);", vars: { reversedSegment: "[4, 3, 2]" }, log: "Iteratively reverse pointers within subsegment [2, 3, 4] to [4, 3, 2].", arrayState: [{ val: "1" }, { val: "4", match: true }, { val: "3", match: true }, { val: "2", match: true }, { val: "5" }] },
      { line: 14, code: "  return 1 -> 4 -> 3 -> 2 -> 5; // REVERSE LINKED LIST II COMPLETE", vars: { status: "COMPLETE" }, log: "Reverse Linked List II complete!", arrayState: [{ val: "1", match: true }, { val: "4", match: true }, { val: "3", match: true }, { val: "2", match: true }, { val: "5", match: true }] }
    ]
  },

  // ── 146. REVERSE A LINKED LIST IN GROUPS OF GIVEN SIZE ──
  "reverse a linked list in groups of given size": {
    solutionJS: `function reverseKGroup(head, k) {
  if (!head || k === 1) return head;
  let prev = null, curr = head, next = null;
  let count = 0;
  while (curr && count < k) {
    next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
    count++;
  }
  if (next) head.next = reverseKGroup(next, k);
  return prev;
}`,
    solutionPY: `def reverseKGroup(head, k):
    if not head or k == 1: return head
    prev, curr, nxt = None, head, None
    count = 0
    while curr and count < k:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
        count += 1
    if nxt: head.next = reverseKGroup(nxt, k)
    return prev`,
    solutionCPP: `Node* reverseKGroup(Node* head, int k) {
    if (!head || k == 1) return head;
    Node *prev = NULL, *curr = head, *next = NULL;
    int count = 0;
    while (curr && count < k) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
        count++;
    }
    if (next) head->next = reverseKGroup(next, k);
    return prev;
}`,
    visualizerSteps: [
      { line: 1, code: "function reverseKGroup(head = 1->2->3->4->5->6->7->8, k = 3) {", vars: { k: "3" }, log: "Initialize list 1..8, k = 3. Recursive k-group block link reversal.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "8" }] },
      { line: 5, code: "  rev grp 1 [1,2,3] -> [3,2,1]; rev grp 2 [4,5,6] -> [6,5,4]; rev grp 3 [7,8] -> [8,7];", vars: { g1: "[3,2,1]", g2: "[6,5,4]", g3: "[8,7]" }, log: "Reverse block 1 (1..3 -> 3..1), block 2 (4..6 -> 6..4), remaining block 3 (7..8 -> 8..7).", arrayState: [{ val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "6", match: true }, { val: "5", match: true }, { val: "4", match: true }, { val: "8", match: true }, { val: "7", match: true }] },
      { line: 13, code: "  return 3 -> 2 -> 1 -> 6 -> 5 -> 4 -> 8 -> 7; // REVERSE K GROUP COMPLETE", vars: { status: "COMPLETE" }, log: "Reverse linked list in groups of size k complete!", arrayState: [{ val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "6", match: true }, { val: "5", match: true }, { val: "4", match: true }, { val: "8", match: true }, { val: "7", match: true }] }
    ]
  },

  // ── 147. ROTATE LIST ──
  "rotate list": {
    solutionJS: `function rotateRight(head, k) {
  if (!head || !head.next || k === 0) return head;
  let len = 1, tail = head;
  while (tail.next) { len++; tail = tail.next; }
  k = k % len;
  if (k === 0) return head;
  tail.next = head;
  let newTailSteps = len - k;
  let newTail = head;
  for (let i = 1; i < newTailSteps; i++) newTail = newTail.next;
  let newHead = newTail.next;
  newTail.next = null;
  return newHead;
}`,
    solutionPY: `def rotateRight(head: Optional[ListNode], k: int) -> Optional[ListNode]:
    if not head or not head.next or k == 0: return head
    length, tail = 1, head
    while tail.next: length += 1; tail = tail.next
    k = k % length
    if k == 0: return head
    tail.next = head; new_tail_steps = length - k; new_tail = head
    for _ in range(1, new_tail_steps): new_tail = new_tail.next
    new_head = new_tail.next; new_tail.next = None
    return new_head`,
    solutionCPP: `ListNode* rotateRight(ListNode* head, int k) {
    if (!head || !head.next || k == 0) return head;
    int len = 1; ListNode* tail = head;
    while (tail->next) { len++; tail = tail->next; }
    k = k % len;
    if (k == 0) return head;
    tail->next = head; int steps = len - k; ListNode* newTail = head;
    for (int i = 1; i < steps; i++) newTail = newTail->next;
    ListNode* newHead = newTail->next; newTail->next = NULL;
    return newHead;
}`,
    visualizerSteps: [
      { line: 1, code: "function rotateRight(head = 1 -> 2 -> 3 -> 4 -> 5, k = 2) {", vars: { k: "2", len: "5" }, log: "Initialize list 1..5, k = 2. Form ring & break new tail pointer at len - k.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }] },
      { line: 7, code: "  connect tail (5) -> head (1); break at node 3 (5 - 2 = 3 steps);", vars: { newHead: "4", newTail: "3" }, log: "Form circular ring. Break after 3rd node (node 3 becomes new tail, node 4 becomes new head).", arrayState: [{ val: "4", match: true }, { val: "5", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }] },
      { line: 13, code: "  return 4 -> 5 -> 1 -> 2 -> 3; // ROTATE LIST COMPLETE", vars: { rotated: "4 -> 5 -> 1 -> 2 -> 3", status: "COMPLETE" }, log: "Rotate List right by k places complete!", arrayState: [{ val: "4", match: true }, { val: "5", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }] }
    ]
  },

  // ── 148. SORT LIST ──
  "sort list": {
    solutionJS: `function sortList(head) {
  if (!head || !head.next) return head;
  let slow = head, fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let mid = slow.next;
  slow.next = null;
  let left = sortList(head);
  let right = sortList(mid);
  return merge(left, right);
}
function merge(l1, l2) {
  let dummy = new ListNode(0), curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
    else { curr.next = l2; l2 = l2.next; }
    curr = curr.next;
  }
  curr.next = l1 ? l1 : l2;
  return dummy.next;
}`,
    solutionPY: `def sortList(head: Optional[ListNode]) -> Optional[ListNode]:
    if not head or not head.next: return head
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next; fast = fast.next.next
    mid = slow.next; slow.next = None
    left = sortList(head); right = sortList(mid)
    return merge(left, right)
def merge(l1, l2):
    dummy = ListNode(0); curr = dummy
    while l1 and l2:
        if l1.val <= l2.val: curr.next = l1; l1 = l1.next
        else: curr.next = l2; l2 = l2.next
        curr = curr.next
    curr.next = l1 if l1 else l2
    return dummy.next`,
    solutionCPP: `ListNode* sortList(ListNode* head) {
    if (!head || !head.next) return head;
    ListNode *slow = head, *fast = head->next;
    while (fast && fast.next) { slow = slow->next; fast = fast->next->next; }
    ListNode *mid = slow->next; slow->next = NULL;
    ListNode *left = sortList(head), *right = sortList(mid);
    return merge(left, right);
}`,
    visualizerSteps: [
      { line: 1, code: "function sortList(head = 4 -> 2 -> 1 -> 3) {", vars: { head: "4 -> 2 -> 1 -> 3" }, log: "Initialize list 4 -> 2 -> 1 -> 3. O(n log n) Merge Sort.", arrayState: [{ val: "4" }, { val: "2" }, { val: "1" }, { val: "3" }] },
      { line: 8, code: "  split mid -> left [4, 2], right [1, 3]; sort & merge -> 1 -> 2 -> 3 -> 4;", vars: { sorted: "1 -> 2 -> 3 -> 4" }, log: "Split at mid: Left [4, 2] sorts to [2, 4], Right [1, 3] sorts to [1, 3]. Merge yields 1 -> 2 -> 3 -> 4.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }] },
      { line: 10, code: "  return 1 -> 2 -> 3 -> 4; // SORT LIST COMPLETE", vars: { status: "COMPLETE" }, log: "Sort List complete cleanly!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }] }
    ]
  },

  // ── 149. SPLIT A CIRCULAR LINKED LIST INTO TWO HALVES ──
  "split a circular linked list into two halves": {
    solutionJS: `function splitList(head) {
  if (!head || !head.next) return [head, null];
  let slow = head, fast = head;
  while (fast.next !== head && fast.next.next !== head) {
    slow = slow.next;
    fast = fast.next.next;
  }
  if (fast.next.next === head) fast = fast.next;
  let head1 = head;
  let head2 = slow.next;
  fast.next = head2;
  slow.next = head1;
  return [head1, head2];
}`,
    solutionPY: `def splitList(head):
    if not head or not head.next: return head, None
    slow, fast = head, head
    while fast.next != head and fast.next.next != head:
        slow = slow.next; fast = fast.next.next
    if fast.next.next == head: fast = fast.next
    head1, head2 = head, slow.next
    fast.next = head2; slow.next = head1
    return head1, head2`,
    solutionCPP: `pair<Node*, Node*> splitList(Node *head) {
    if (!head || !head->next) return {head, NULL};
    Node *slow = head, *fast = head;
    while (fast->next != head && fast->next->next != head) {
        slow = slow->next; fast = fast->next->next;
    }
    if (fast->next->next == head) fast = fast->next;
    Node *head1 = head, *head2 = slow->next;
    fast->next = head2; slow->next = head1;
    return {head1, head2};
}`,
    visualizerSteps: [
      { line: 1, code: "function splitList(head = 1 -> 5 -> 7 -> 10 (circular)) {", vars: { head: "1 -> 5 -> 7 -> 10" }, log: "Initialize circular list. Fast/Slow pointers to find mid node 5.", arrayState: [{ val: "1" }, { val: "5" }, { val: "7" }, { val: "10" }] },
      { line: 8, code: "  half 1: 1 -> 5 (loops to 1); half 2: 7 -> 10 (loops to 7);", vars: { head1: "1 -> 5 -> 1", head2: "7 -> 10 -> 7" }, log: "Split circular list: Head1 circular half [1, 5] and Head2 circular half [7, 10].", arrayState: [{ val: "1 (H1)", match: true }, { val: "5 (H1)", match: true }, { val: "7 (H2)", match: true }, { val: "10 (H2)", match: true }] },
      { line: 12, code: "  return [head1, head2]; // SPLIT CIRCULAR LIST COMPLETE", vars: { status: "COMPLETE" }, log: "Split circular linked list complete!", arrayState: [{ val: "1 (H1)", match: true }, { val: "5 (H1)", match: true }, { val: "7 (H2)", match: true }, { val: "10 (H2)", match: true }] }
    ]
  },

  // ── 150. SWAPPING NODES IN A LINKED LIST ──
  "swapping nodes in a linked list": {
    solutionJS: `function swapNodes(head, k) {
  let first = head;
  for (let i = 1; i < k; i++) first = first.next;
  let slow = head, fast = first;
  while (fast.next) {
    slow = slow.next;
    fast = fast.next;
  }
  let temp = first.val;
  first.val = slow.val;
  slow.val = temp;
  return head;
}`,
    solutionPY: `def swapNodes(head: Optional[ListNode], k: int) -> Optional[ListNode]:
    first = head
    for _ in range(k - 1): first = first.next
    slow, fast = head, first
    while fast.next:
        slow = slow.next; fast = fast.next
    first.val, slow.val = slow.val, first.val
    return head`,
    solutionCPP: `ListNode* swapNodes(ListNode* head, int k) {
    ListNode* first = head;
    for (int i = 1; i < k; i++) first = first->next;
    ListNode *slow = head, *fast = first;
    while (fast->next) {
        slow = slow->next; fast = fast->next;
    }
    swap(first->val, slow->val);
    return head;
}`,
    visualizerSteps: [
      { line: 1, code: "function swapNodes(head = 1 -> 2 -> 3 -> 4 -> 5, k = 2) {", vars: { k: "2" }, log: "Initialize list 1..5, k = 2. Find 2nd node from start and 2nd from end.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }] },
      { line: 8, code: "  swap nodeK1 (2) and nodeK2 (4) values -> 1 -> 4 -> 3 -> 2 -> 5;", vars: { valK1: "2", valK2: "4" }, log: "Swap values of 2nd node from start (2) and 2nd node from end (4).", arrayState: [{ val: "1" }, { val: "4 (Swapped)", match: true }, { val: "3" }, { val: "2 (Swapped)", match: true }, { val: "5" }] },
      { line: 12, code: "  return 1 -> 4 -> 3 -> 2 -> 5; // SWAPPING NODES COMPLETE", vars: { status: "COMPLETE" }, log: "Swapping Nodes in a Linked List complete!", arrayState: [{ val: "1" }, { val: "4 (Swapped)", match: true }, { val: "3" }, { val: "2 (Swapped)", match: true }, { val: "5" }] }
    ]
  },

  // ── 151. COUNT LEAVES IN BINARY TREE ──
  "count leaves in binary tree": {
    solutionJS: `function countLeaves(root) {
  if (!root) return 0;
  if (!root.left && !root.right) return 1;
  return countLeaves(root.left) + countLeaves(root.right);
}`,
    solutionPY: `def countLeaves(root):
    if not root: return 0
    if not root.left and not root.right: return 1
    return countLeaves(root.left) + countLeaves(root.right)`,
    solutionCPP: `int countLeaves(Node* root) {
    if (!root) return 0;
    if (!root->left && !root->right) return 1;
    return countLeaves(root->left) + countLeaves(root->right);
}`,
    visualizerSteps: [
      { line: 1, code: "function countLeaves(root = [1, 2, 3, 4, 5]) {", vars: { root: "1", nodes: "[1, 2, 3, 4, 5]" }, log: "Initialize binary tree [1, 2, 3, 4, 5]. Recursive DFS leaf count.", arrayState: [{ val: "1 (Root)" }, { val: "2" }, { val: "3 (Leaf)" }, { val: "4 (Leaf)" }, { val: "5 (Leaf)" }] },
      { line: 3, code: "  leaves detected: 4, 5, 3 -> countLeaves = 3;", vars: { leafCount: "3", leaves: "[4, 5, 3]" }, log: "DFS leaf check: Nodes 4, 5, and 3 have 0 children (leaf nodes). Total = 3.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (Leaf)", match: true }, { val: "4 (Leaf)", match: true }, { val: "5 (Leaf)", match: true }] },
      { line: 4, code: "  return 3; // COUNT LEAVES BINARY TREE COMPLETE", vars: { leaves: "3", status: "COMPLETE" }, log: "Count Leaves in Binary Tree complete!", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (Leaf)", match: true }, { val: "4 (Leaf)", match: true }, { val: "5 (Leaf)", match: true }] }
    ]
  },

  // ── 152. HEIGHT OF BINARY TREE ──
  "height of binary tree": {
    solutionJS: `function height(node) {
  if (!node) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}`,
    solutionPY: `def height(node):
    if not node: return 0
    return 1 + max(height(node.left), height(node.right))`,
    solutionCPP: `int height(struct Node* node) {
    if (!node) return 0;
    return 1 + max(height(node->left), height(node->right));
}`,
    visualizerSteps: [
      { line: 1, code: "function height(node = [1, 2, 3, 4, 5]) {", vars: { root: "1" }, log: "Initialize binary tree. Calculate max depth via 1 + max(leftH, rightH).", arrayState: [{ val: "Root: 1" }, { val: "L: 2 (h:2)" }, { val: "R: 3 (h:1)" }] },
      { line: 3, code: "  left depth = 2, right depth = 1 -> height = 1 + max(2, 1) = 3;", vars: { leftHeight: "2", rightHeight: "1", treeHeight: "3" }, log: "Left subtree height = 2 (path 1->2->4), Right subtree height = 1 (path 1->3). Tree height = 3.", arrayState: [{ val: "Level 1: Node 1", match: true }, { val: "Level 2: Node 2", match: true }, { val: "Level 3: Node 4", match: true }] },
      { line: 4, code: "  return 3; // HEIGHT OF BINARY TREE COMPLETE", vars: { height: "3", status: "COMPLETE" }, log: "Height of Binary Tree calculation complete!", arrayState: [{ val: "Level 1: Node 1", match: true }, { val: "Level 2: Node 2", match: true }, { val: "Level 3: Node 4", match: true }] }
    ]
  },

  // ── 153. BALANCED BINARY TREE ──
  "balanced binary tree": {
    solutionJS: `function isBalanced(root) {
  function check(node) {
    if (!node) return 0;
    let left = check(node.left);
    if (left === -1) return -1;
    let right = check(node.right);
    if (right === -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  }
  return check(root) !== -1;
}`,
    solutionPY: `def isBalanced(root: Optional[TreeNode]) -> bool:
    def check(node):
        if not node: return 0
        left = check(node.left)
        if left == -1: return -1
        right = check(node.right)
        if right == -1: return -1
        if abs(left - right) > 1: return -1
        return 1 + max(left, right)
    return check(root) != -1`,
    solutionCPP: `bool isBalanced(TreeNode* root) {
    function<int(TreeNode*)> check = [&](TreeNode* node) {
        if (!node) return 0;
        int left = check(node->left);
        if (left == -1) return -1;
        int right = check(node->right);
        if (right == -1) return -1;
        if (abs(left - right) > 1) return -1;
        return 1 + max(left, right);
    };
    return check(root) != -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function isBalanced(root = [3, 9, 20, null, null, 15, 7]) {", vars: { root: "3" }, log: "Initialize tree [3, 9, 20, null, null, 15, 7]. Bottom-up DFS height balance check.", arrayState: [{ val: "3" }, { val: "9" }, { val: "20" }, { val: "15" }, { val: "7" }] },
      { line: 8, code: "  node 9 (h:1), node 20 (h:2) -> height diff |1 - 2| = 1 <= 1 (BALANCED);", vars: { leftHeight: "1", rightHeight: "2", heightDiff: "1" }, log: "Node 9 height = 1, Node 20 height = 2. Height difference at root 3 is |1 - 2| = 1 <= 1.", arrayState: [{ val: "Node 9 (h:1)", match: true }, { val: "Node 20 (h:2)", match: true }, { val: "Root 3 (Balanced)", match: true }] },
      { line: 11, code: "  return true; // BALANCED BINARY TREE COMPLETE", vars: { isBalanced: "true", status: "COMPLETE" }, log: "Tree height balance check complete!", arrayState: [{ val: "Node 9 (h:1)", match: true }, { val: "Node 20 (h:2)", match: true }, { val: "Root 3 (Balanced)", match: true }] }
    ]
  },

  // ── 154. CHECK FOR BALANCED TREE ──
  "check for balanced tree": {
    solutionJS: `function isBalanced(root) {
  function check(node) {
    if (!node) return 0;
    let left = check(node.left);
    if (left === -1) return -1;
    let right = check(node.right);
    if (right === -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  }
  return check(root) !== -1;
}`,
    solutionPY: `def isBalanced(root):
    def check(node):
        if not node: return 0
        left = check(node.left)
        if left == -1: return -1
        right = check(node.right)
        if right == -1: return -1
        if abs(left - right) > 1: return -1
        return 1 + max(left, right)
    return check(root) != -1`,
    solutionCPP: `bool isBalanced(Node* root) {
    function<int(Node*)> check = [&](Node* node) {
        if (!node) return 0;
        int left = check(node->left);
        if (left == -1) return -1;
        int right = check(node->right);
        if (right == -1) return -1;
        if (abs(left - right) > 1) return -1;
        return 1 + max(left, right);
    };
    return check(root) != -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function isBalanced(root = [1, 2, 3, 4, 5]) {", vars: { root: "1" }, log: "Initialize binary tree [1, 2, 3, 4, 5]. Bottom-up DFS height balance check.", arrayState: [{ val: "1 (Root)" }, { val: "2 (L)" }, { val: "3 (R)" }, { val: "4" }, { val: "5" }] },
      { line: 8, code: "  left subH (node 2) = 2, right subH (node 3) = 1 -> |2 - 1| = 1 <= 1 (BALANCED);", vars: { leftSubH: "2", rightSubH: "1", diff: "1" }, log: "Subtree node 2 has height 2, Subtree node 3 has height 1. Height diff at root 1 is |2 - 1| = 1 <= 1.", arrayState: [{ val: "Node 2 (h:2)", match: true }, { val: "Node 3 (h:1)", match: true }, { val: "Root 1 (Balanced)", match: true }] },
      { line: 11, code: "  return true; // CHECK FOR BALANCED TREE COMPLETE", vars: { status: "COMPLETE" }, log: "Check for Balanced Tree complete! Return true.", arrayState: [{ val: "Node 2 (h:2)", match: true }, { val: "Node 3 (h:1)", match: true }, { val: "Root 1 (Balanced)", match: true }] }
    ]
  },

  // ── 155. DIAGONAL SUM IN BINARY TREE ──
  "diagonal sum in binary tree": {
    solutionJS: `function diagonalSum(root) {
  let res = [];
  if (!root) return res;
  let queue = [root];
  while (queue.length) {
    let size = queue.length;
    let sum = 0;
    for (let i = 0; i < size; i++) {
      let curr = queue.shift();
      while (curr) {
        sum += curr.data;
        if (curr.left) queue.push(curr.left);
        curr = curr.right;
      }
    }
    res.push(sum);
  }
  return res;
}`,
    solutionPY: `def diagonalSum(root):
    res = []
    if not root: return res
    queue = collections.deque([root])
    while queue:
        size = len(queue)
        d_sum = 0
        for _ in range(size):
            curr = queue.popleft()
            while curr:
                d_sum += curr.data
                if curr.left: queue.append(curr.left)
                curr = curr.right
        res.append(d_sum)
    return res`,
    solutionCPP: `vector<int> diagonalSum(Node* root) {
    vector<int> res;
    if (!root) return res;
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        int size = q.size();
        int sum = 0;
        for (int i = 0; i < size; i++) {
            Node* curr = q.front(); q.pop();
            while (curr) {
                sum += curr->data;
                if (curr->left) q.push(curr->left);
                curr = curr->right;
            }
        }
        res.push_back(sum);
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function diagonalSum(root = [8, 3, 10, 1, 6, null, 14]) {", vars: { root: "8" }, log: "Initialize binary tree. Queue-based diagonal slope traversal.", arrayState: [{ val: "Diag 0: 8, 10, 14" }, { val: "Diag 1: 3, 6, 7, 13" }, { val: "Diag 2: 1, 4" }] },
      { line: 7, code: "  d0 sum: 8 + 10 + 14 = 32; d1 sum: 3 + 6 + 7 + 13 = 29; d2 sum: 1 + 4 = 5;", vars: { d0: "32", d1: "29", d2: "5" }, log: "Sum nodes along right-slope diagonals: Diagonal 0 = 32, Diagonal 1 = 29, Diagonal 2 = 5.", arrayState: [{ val: "Diag 0 (Sum: 32)", match: true }, { val: "Diag 1 (Sum: 29)", match: true }, { val: "Diag 2 (Sum: 5)", match: true }] },
      { line: 17, code: "  return [32, 29, 5]; // DIAGONAL SUM BINARY TREE COMPLETE", vars: { diagonalSums: "[32, 29, 5]", status: "COMPLETE" }, log: "Diagonal Sum in Binary Tree complete!", arrayState: [{ val: "32", match: true }, { val: "29", match: true }, { val: "5", match: true }] }
    ]
  },

  // ── 156. DIAMETER OF BINARY TREE ──
  "diameter of binary tree": {
    solutionJS: `function diameterOfBinaryTree(root) {
  let maxDiameter = 0;
  function height(node) {
    if (!node) return 0;
    let left = height(node.left);
    let right = height(node.right);
    maxDiameter = Math.max(maxDiameter, left + right);
    return 1 + Math.max(left, right);
  }
  height(root);
  return maxDiameter;
}`,
    solutionPY: `def diameterOfBinaryTree(root: Optional[TreeNode]) -> int:
    max_diameter = 0
    def height(node):
        nonlocal max_diameter
        if not node: return 0
        left = height(node.left)
        right = height(node.right)
        max_diameter = max(max_diameter, left + right)
        return 1 + max(left, right)
    height(root)
    return max_diameter`,
    solutionCPP: `int diameterOfBinaryTree(TreeNode* root) {
    int maxDiameter = 0;
    function<int(TreeNode*)> height = [&](TreeNode* node) {
        if (!node) return 0;
        int left = height(node->left);
        int right = height(node->right);
        maxDiameter = max(maxDiameter, left + right);
        return 1 + max(left, right);
    };
    height(root);
    return maxDiameter;
}`,
    visualizerSteps: [
      { line: 1, code: "function diameterOfBinaryTree(root = [1, 2, 3, 4, 5]) {", vars: { root: "1" }, log: "Initialize tree [1, 2, 3, 4, 5]. Post-order DFS subtree path calculation.", arrayState: [{ val: "1 (Root)" }, { val: "2 (L)" }, { val: "3 (R)" }, { val: "4" }, { val: "5" }] },
      { line: 6, code: "  node 2: leftH 1 + rightH 1 = 2; root 1: leftH 2 + rightH 1 = 3;", vars: { maxDiameter: "3", path: "4 -> 2 -> 1 -> 3" }, log: "Subtree 2 longest path = 2 edges. Root 1 longest path = leftH 2 + rightH 1 = 3 edges (path 4-2-1-3).", arrayState: [{ val: "Path: 4", match: true }, { val: "Path: 2", match: true }, { val: "Path: 1", match: true }, { val: "Path: 3", match: true }] },
      { line: 10, code: "  return 3; // DIAMETER OF BINARY TREE COMPLETE", vars: { diameter: "3", status: "COMPLETE" }, log: "Diameter of Binary Tree calculation complete!", arrayState: [{ val: "Path: 4", match: true }, { val: "Path: 2", match: true }, { val: "Path: 1", match: true }, { val: "Path: 3", match: true }] }
    ]
  },

  // ── 157. IDENTICAL TREE (CHECK IF TWO TREES ARE SAME) ──
  "identical tree (check if two trees are same)": {
    solutionJS: `function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    solutionPY: `def isSameTree(p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
    if not p and not q: return True
    if not p or not q or p.val != q.val: return False
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)`,
    solutionCPP: `bool isSameTree(TreeNode* p, TreeNode* q) {
    if (!p && !q) return true;
    if (!p || !q || p->val != q->val) return false;
    return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
}`,
    visualizerSteps: [
      { line: 1, code: "function isSameTree(p = [1, 2, 3], q = [1, 2, 3]) {", vars: { p: "[1, 2, 3]", q: "[1, 2, 3]" }, log: "Initialize tree p and tree q. Parallel recursive DFS structure & value comparison.", arrayState: [{ val: "p: [1, 2, 3]" }, { val: "q: [1, 2, 3]" }] },
      { line: 3, code: "  p.val (1) === q.val (1); p.left (2) === q.left (2); p.right (3) === q.right (3);", vars: { rootMatch: "true", leftMatch: "true", rightMatch: "true" }, log: "Compare node values: Root 1===1, Left 2===2, Right 3===3. All subtrees identical!", arrayState: [{ val: "Root 1===1", match: true }, { val: "Left 2===2", match: true }, { val: "Right 3===3", match: true }] },
      { line: 4, code: "  return true; // IDENTICAL TREE COMPLETE", vars: { isSame: "true", status: "COMPLETE" }, log: "Identical Tree check complete!", arrayState: [{ val: "Root 1===1", match: true }, { val: "Left 2===2", match: true }, { val: "Right 3===3", match: true }] }
    ]
  },

  // ── 158. INORDER TRAVERSAL ──
  "inorder traversal": {
    solutionJS: `function inorderTraversal(root) {
  let res = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    res.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return res;
}`,
    solutionPY: `def inorderTraversal(root: Optional[TreeNode]) -> List[int]:
    res = []
    def dfs(node):
        if not node: return
        dfs(node.left)
        res.append(node.val)
        dfs(node.right)
    dfs(root)
    return res`,
    solutionCPP: `vector<int> inorderTraversal(TreeNode* root) {
    vector<int> res;
    function<void(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return;
        dfs(node->left);
        res.push_back(node->val);
        dfs(node->right);
    };
    dfs(root);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function inorderTraversal(root = [1, null, 2, 3]) {", vars: { root: "1" }, log: "Initialize tree 1 -> Right 2 -> Left 3. Inorder DFS (Left -> Root -> Right).", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }] },
      { line: 5, code: "  visit left(1)->null; push 1; visit right(1)->node 2; left(2)->node 3 -> push 3; push 2;", vars: { traversal: "[1, 3, 2]" }, log: "Inorder sequence: Visit Root 1 -> Left of 2 (Node 3) -> Root 2.", arrayState: [{ val: "1", match: true }, { val: "3", match: true }, { val: "2", match: true }] },
      { line: 9, code: "  return [1, 3, 2]; // INORDER TRAVERSAL COMPLETE", vars: { inorder: "[1, 3, 2]", status: "COMPLETE" }, log: "Inorder Traversal complete!", arrayState: [{ val: "1", match: true }, { val: "3", match: true }, { val: "2", match: true }] }
    ]
  },

  // ── 159. INVERT BINARY TREE ──
  "invert binary tree": {
    solutionJS: `function invertTree(root) {
  if (!root) return null;
  let temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
    solutionPY: `def invertTree(root: Optional[TreeNode]) -> Optional[TreeNode]:
    if not root: return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`,
    solutionCPP: `TreeNode* invertTree(TreeNode* root) {
    if (!root) return NULL;
    TreeNode* temp = root->left;
    root->left = invertTree(root->right);
    root->right = invertTree(temp);
    return root;
}`,
    visualizerSteps: [
      { line: 1, code: "function invertTree(root = [4, 2, 7, 1, 3, 6, 9]) {", vars: { root: "4" }, log: "Initialize tree [4, 2, 7, 1, 3, 6, 9]. Recursive DFS child pointer swapping.", arrayState: [{ val: "4 (Root)" }, { val: "2 (L)" }, { val: "7 (R)" }, { val: "1" }, { val: "3" }, { val: "6" }, { val: "9" }] },
      { line: 4, code: "  swap 4.left & 4.right -> left becomes 7, right becomes 2; recursively swap subtrees;", vars: { rootLeft: "7", rootRight: "2" }, log: "Swap root 4 children: 4.left = 7, 4.right = 2. Recursively swap subtrees 7 (9, 6) and 2 (3, 1).", arrayState: [{ val: "4", match: true }, { val: "7 (Swapped)", match: true }, { val: "2 (Swapped)", match: true }, { val: "9", match: true }, { val: "6", match: true }, { val: "3", match: true }, { val: "1", match: true }] },
      { line: 6, code: "  return [4, 7, 2, 9, 6, 3, 1]; // INVERT BINARY TREE COMPLETE", vars: { status: "COMPLETE" }, log: "Invert Binary Tree complete!", arrayState: [{ val: "4", match: true }, { val: "7", match: true }, { val: "2", match: true }, { val: "9", match: true }, { val: "6", match: true }, { val: "3", match: true }, { val: "1", match: true }] }
    ]
  },

  // ── 160. K DISTANCE FROM ROOT ──
  "k distance from root": {
    solutionJS: `function Kdistance(root, k) {
  let res = [];
  function dfs(node, depth) {
    if (!node) return;
    if (depth === 0) {
      res.push(node.data);
      return;
    }
    dfs(node.left, depth - 1);
    dfs(node.right, depth - 1);
  }
  dfs(root, k);
  return res;
}`,
    solutionPY: `def Kdistance(root, k):
    res = []
    def dfs(node, depth):
        if not node: return
        if depth == 0:
            res.append(node.data)
            return
        dfs(node.left, depth - 1)
        dfs(node.right, depth - 1)
    dfs(root, k)
    return res`,
    solutionCPP: `vector<int> Kdistance(struct Node *root, int k) {
    vector<int> res;
    function<void(Node*, int)> dfs = [&](Node* node, int depth) {
        if (!node) return;
        if (depth == 0) { res.push_back(node->data); return; }
        dfs(node->left, depth - 1);
        dfs(node->right, depth - 1);
    };
    dfs(root, k);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function Kdistance(root = [1, 2, 3, 4, 5], k = 2) {", vars: { k: "2", root: "1" }, log: "Initialize tree [1, 2, 3, 4, 5], k = 2. DFS depth tracking.", arrayState: [{ val: "1 (d:0)" }, { val: "2 (d:1)" }, { val: "3 (d:1)" }, { val: "4 (d:2)" }, { val: "5 (d:2)" }] },
      { line: 5, code: "  depth 2 nodes reached -> collect node values [4, 5];", vars: { distanceKNodes: "[4, 5]" }, log: "Traverse tree down to depth k=2: Nodes 4 and 5 rest at distance 2 from root 1.", arrayState: [{ val: "4 (k=2)", match: true }, { val: "5 (k=2)", match: true }] },
      { line: 12, code: "  return [4, 5]; // K DISTANCE FROM ROOT COMPLETE", vars: { status: "COMPLETE" }, log: "K distance from root complete!", arrayState: [{ val: "4", match: true }, { val: "5", match: true }] }
    ]
  },

  // ── 161. LEFT VIEW OF BINARY TREE ──
  "left view of binary tree": {
    solutionJS: `function leftView(root) {
  let res = [];
  function dfs(node, level) {
    if (!node) return;
    if (level === res.length) res.push(node.data);
    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }
  dfs(root, 0);
  return res;
}`,
    solutionPY: `def LeftView(root):
    res = []
    def dfs(node, level):
        if not node: return
        if level == len(res): res.append(node.data)
        dfs(node.left, level + 1)
        dfs(node.right, level + 1)
    dfs(root, 0)
    return res`,
    solutionCPP: `vector<int> leftView(Node *root) {
    vector<int> res;
    function<void(Node*, int)> dfs = [&](Node* node, int level) {
        if (!node) return;
        if (level == res.size()) res.push_back(node->data);
        dfs(node->left, level + 1);
        dfs(node->right, level + 1);
    };
    dfs(root, 0);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function leftView(root = [1, 2, 3, null, 5, null, 4]) {", vars: { root: "1" }, log: "Initialize tree. Pre-order DFS (Root -> Left -> Right) tracking first node at each level.", arrayState: [{ val: "L0: 1" }, { val: "L1: 2" }, { val: "L2: 5" }] },
      { line: 5, code: "  level 0 -> 1; level 1 -> 2; level 2 -> 5 (leftmost visible nodes);", vars: { leftView: "[1, 2, 5]" }, log: "First node encountered at level 0 is 1, level 1 is 2, level 2 is 5.", arrayState: [{ val: "1 (L0)", match: true }, { val: "2 (L1)", match: true }, { val: "5 (L2)", match: true }] },
      { line: 10, code: "  return [1, 2, 5]; // LEFT VIEW OF BINARY TREE COMPLETE", vars: { status: "COMPLETE" }, log: "Left View of Binary Tree complete!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "5", match: true }] }
    ]
  },

  // ── 162. LEVEL ORDER TRAVERSAL (LINE BY LINE) ──
  "level order traversal (line by line)": {
    solutionJS: `function levelOrder(root) {
  let res = [];
  if (!root) return res;
  let queue = [root];
  while (queue.length) {
    let size = queue.length;
    let level = [];
    for (let i = 0; i < size; i++) {
      let node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}`,
    solutionPY: `def levelOrder(root: Optional[TreeNode]) -> List[List[int]]:
    res = []
    if not root: return res
    queue = collections.deque([root])
    while queue:
        size = len(queue)
        level = []
        for _ in range(size):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(level)
    return res`,
    solutionCPP: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int size = q.size();
        vector<int> level;
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        res.push_back(level);
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function levelOrder(root = [3, 9, 20, null, null, 15, 7]) {", vars: { root: "3" }, log: "Initialize tree [3, 9, 20, null, null, 15, 7]. BFS level-by-level queue processing.", arrayState: [{ val: "L0: [3]" }, { val: "L1: [9, 20]" }, { val: "L2: [15, 7]" }] },
      { line: 7, code: "  level 0: [3]; level 1: [9, 20]; level 2: [15, 7];", vars: { l0: "[3]", l1: "[9, 20]", l2: "[15, 7]" }, log: "Snapshot queue size per level: Line 1 = [3], Line 2 = [9, 20], Line 3 = [15, 7].", arrayState: [{ val: "[3]", match: true }, { val: "[9, 20]", match: true }, { val: "[15, 7]", match: true }] },
      { line: 16, code: "  return [[3], [9, 20], [15, 7]]; // LEVEL ORDER LINE BY LINE COMPLETE", vars: { status: "COMPLETE" }, log: "Level order traversal (line by line) complete!", arrayState: [{ val: "[3]", match: true }, { val: "[9, 20]", match: true }, { val: "[15, 7]", match: true }] }
    ]
  },

  // ── 163. LEVEL ORDER TRAVERSAL IN SPIRAL FORM ──
  "level order traversal in spiral form": {
    solutionJS: `function findSpiral(root) {
  let res = [];
  if (!root) return res;
  let s1 = [root], s2 = [];
  while (s1.length || s2.length) {
    while (s1.length) {
      let node = s1.pop();
      res.push(node.data);
      if (node.right) s2.push(node.right);
      if (node.left) s2.push(node.left);
    }
    while (s2.length) {
      let node = s2.pop();
      res.push(node.data);
      if (node.left) s1.push(node.left);
      if (node.right) s1.push(node.right);
    }
  }
  return res;
}`,
    solutionPY: `def findSpiral(root):
    res = []
    if not root: return res
    s1, s2 = [root], []
    while s1 or s2:
        while s1:
            node = s1.pop()
            res.append(node.data)
            if node.right: s2.append(node.right)
            if node.left: s2.append(node.left)
        while s2:
            node = s2.pop()
            res.append(node.data)
            if node.left: s1.append(node.left)
            if node.right: s1.append(node.right)
    return res`,
    solutionCPP: `vector<int> findSpiral(Node *root) {
    vector<int> res;
    if (!root) return res;
    stack<Node*> s1, s2;
    s1.push(root);
    while (!s1.empty() || !s2.empty()) {
        while (!s1.empty()) {
            Node* node = s1.top(); s1.pop();
            res.push_back(node->data);
            if (node->right) s2.push(node->right);
            if (node->left) s2.push(node->left);
        }
        while (!s2.empty()) {
            Node* node = s2.top(); s2.pop();
            res.push_back(node->data);
            if (node->left) s1.push(node->left);
            if (node->right) s1.push(node->right);
        }
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function findSpiral(root = [1, 2, 3, 4, 5, 6, 7]) {", vars: { root: "1" }, log: "Initialize tree [1, 2, 3, 4, 5, 6, 7]. 2-stack alternating spiral/zigzag traversal.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }] },
      { line: 6, code: "  level 0 (R-L): [1]; level 1 (L-R): [2, 3]; level 2 (R-L): [7, 6, 5, 4];", vars: { spiralOrder: "[1, 2, 3, 7, 6, 5, 4]" }, log: "Spiral traversal sequence: Level 0 -> [1], Level 1 -> [2, 3], Level 2 -> [7, 6, 5, 4].", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "7", match: true }, { val: "6", match: true }, { val: "5", match: true }, { val: "4", match: true }] },
      { line: 19, code: "  return [1, 2, 3, 7, 6, 5, 4]; // SPIRAL LEVEL ORDER COMPLETE", vars: { status: "COMPLETE" }, log: "Level order traversal in spiral form complete!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "7", match: true }, { val: "6", match: true }, { val: "5", match: true }, { val: "4", match: true }] }
    ]
  },

  // ── 164. MAXIMUM DEPTH OF BINARY TREE ──
  "maximum depth of binary tree": {
    solutionJS: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    solutionPY: `def maxDepth(root: Optional[TreeNode]) -> int:
    if not root: return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
    solutionCPP: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
    visualizerSteps: [
      { line: 1, code: "function maxDepth(root = [3, 9, 20, null, null, 15, 7]) {", vars: { root: "3" }, log: "Initialize tree [3, 9, 20, null, null, 15, 7]. Recursive DFS max height calculation.", arrayState: [{ val: "3 (Root)" }, { val: "9 (L: h1)" }, { val: "20 (R: h2)" }, { val: "15" }, { val: "7" }] },
      { line: 3, code: "  left depth = 1, right depth = 2 -> maxDepth = 1 + max(1, 2) = 3;", vars: { leftDepth: "1", rightDepth: "2", maxDepth: "3" }, log: "Left subtree max depth = 1 (node 9), Right subtree max depth = 2 (path 20->15/7). Total max depth = 3.", arrayState: [{ val: "Level 1: 3", match: true }, { val: "Level 2: 20", match: true }, { val: "Level 3: 15", match: true }] },
      { line: 4, code: "  return 3; // MAXIMUM DEPTH BINARY TREE COMPLETE", vars: { maxDepth: "3", status: "COMPLETE" }, log: "Maximum Depth of Binary Tree complete!", arrayState: [{ val: "Level 1: 3", match: true }, { val: "Level 2: 20", match: true }, { val: "Level 3: 15", match: true }] }
    ]
  },

  // ── 165. MINIMUM DEPTH OF BINARY TREE ──
  "minimum depth of binary tree": {
    solutionJS: `function minDepth(root) {
  if (!root) return 0;
  if (!root.left) return 1 + minDepth(root.right);
  if (!root.right) return 1 + minDepth(root.left);
  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}`,
    solutionPY: `def minDepth(root: Optional[TreeNode]) -> int:
    if not root: return 0
    if not root.left: return 1 + minDepth(root.right)
    if not root.right: return 1 + minDepth(root.left)
    return 1 + min(minDepth(root.left), minDepth(root.right))`,
    solutionCPP: `int minDepth(TreeNode* root) {
    if (!root) return 0;
    if (!root->left) return 1 + minDepth(root->right);
    if (!root->right) return 1 + minDepth(root->left);
    return 1 + min(minDepth(root->left), minDepth(root->right));
}`,
    visualizerSteps: [
      { line: 1, code: "function minDepth(root = [3, 9, 20, null, null, 15, 7]) {", vars: { root: "3" }, log: "Initialize tree. BFS level order scan for nearest leaf node.", arrayState: [{ val: "3 (Root)" }, { val: "9 (Leaf)" }, { val: "20" }, { val: "15" }, { val: "7" }] },
      { line: 5, code: "  node 9 has 0 children at level 2 -> minDepth = 2;", vars: { nearestLeaf: "9", minDepth: "2" }, log: "BFS Level 2: Node 9 is a leaf node (no children). Nearest leaf depth = 2.", arrayState: [{ val: "Level 1: Node 3", match: true }, { val: "Level 2: Node 9 (Leaf)", match: true }] },
      { line: 6, code: "  return 2; // MINIMUM DEPTH BINARY TREE COMPLETE", vars: { minDepth: "2", status: "COMPLETE" }, log: "Minimum Depth of Binary Tree complete!", arrayState: [{ val: "Level 1: Node 3", match: true }, { val: "Level 2: Node 9 (Leaf)", match: true }] }
    ]
  },

  // ── 166. PATH SUM ──
  "path sum": {
    solutionJS: `function hasPathSum(root, targetSum) {
  if (!root) return false;
  if (!root.left && !root.right) return targetSum === root.val;
  return hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val);
}`,
    solutionPY: `def hasPathSum(root: Optional[TreeNode], targetSum: int) -> bool:
    if not root: return False
    if not root.left and not root.right: return targetSum == root.val
    return hasPathSum(root.left, targetSum - root.val) or hasPathSum(root.right, targetSum - root.val)`,
    solutionCPP: `bool hasPathSum(TreeNode* root, int targetSum) {
    if (!root) return false;
    if (!root->left && !root->right) return targetSum == root->val;
    return hasPathSum(root->left, targetSum - root->val) || hasPathSum(root->right, targetSum - root->val);
}`,
    visualizerSteps: [
      { line: 1, code: "function hasPathSum(root = [5,4,8,11,null,13,4,7,2], targetSum = 22) {", vars: { targetSum: "22" }, log: "Initialize tree, targetSum = 22. DFS root-to-leaf path sum search.", arrayState: [{ val: "5" }, { val: "4" }, { val: "11" }, { val: "2" }] },
      { line: 3, code: "  path 5 -> 4 -> 11 -> 2: sum = 5 + 4 + 11 + 2 = 22 === targetSum;", vars: { path: "5 -> 4 -> 11 -> 2", pathSum: "22" }, log: "DFS path 5 -> 4 -> 11 -> 2 hits leaf node 2 with remaining targetSum 0. Match!", arrayState: [{ val: "5", match: true }, { val: "4", match: true }, { val: "11", match: true }, { val: "2 (Leaf Match)", match: true }] },
      { line: 4, code: "  return true; // PATH SUM COMPLETE", vars: { hasPathSum: "true", status: "COMPLETE" }, log: "Root-to-leaf path sum target 22 exists!", arrayState: [{ val: "5", match: true }, { val: "4", match: true }, { val: "11", match: true }, { val: "2", match: true }] }
    ]
  },

  // ── 167. PERFECT BINARY TREE (CHECK) ──
  "perfect binary tree (check)": {
    solutionJS: `function isPerfect(root) {
  function findDepth(node) {
    let d = 0;
    while (node) { d++; node = node.left; }
    return d;
  }
  let depth = findDepth(root);
  function check(node, d, level) {
    if (!node) return true;
    if (!node.left && !node.right) return d === level + 1;
    if (!node.left || !node.right) return false;
    return check(node.left, d, level + 1) && check(node.right, d, level + 1);
  }
  return check(root, depth, 0);
}`,
    solutionPY: `def isPerfect(root):
    def find_depth(node):
        d = 0
        while node: d += 1; node = node.left
        return d
    depth = find_depth(root)
    def check(node, d, level):
        if not node: return True
        if not node.left and not node.right: return d == level + 1
        if not node.left or not node.right: return False
        return check(node.left, d, level + 1) and check(node.right, d, level + 1)
    return check(root, depth, 0)`,
    solutionCPP: `bool isPerfect(Node *root) {
    auto findDepth = [](Node* node) {
        int d = 0; while (node) { d++; node = node->left; } return d;
    };
    int depth = findDepth(root);
    function<bool(Node*, int, int)> check = [&](Node* node, int d, int level) {
        if (!node) return true;
        if (!node->left && !node->right) return d == level + 1;
        if (!node->left || !node->right) return false;
        return check(node->left, d, level + 1) && check(node->right, d, level + 1);
    };
    return check(root, depth, 0);
}`,
    visualizerSteps: [
      { line: 1, code: "function isPerfect(root = [1, 2, 3, 4, 5, 6, 7]) {", vars: { root: "1" }, log: "Initialize tree [1, 2, 3, 4, 5, 6, 7]. Check all leaves at same depth and all internal nodes have 2 children.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }] },
      { line: 8, code: "  leftmost leaf depth = 3; all 4 leaves (4,5,6,7) at depth 3 and internal nodes have 2 children;", vars: { leafDepth: "3", leavesCount: "4" }, log: "Leaves 4, 5, 6, 7 all lie at depth 3. Internal nodes 1, 2, 3 all have exactly 2 children. PERFECT!", arrayState: [{ val: "1 (Full)", match: true }, { val: "2 (Full)", match: true }, { val: "3 (Full)", match: true }, { val: "Leaves [4,5,6,7] (Depth 3)", match: true }] },
      { line: 15, code: "  return true; // PERFECT BINARY TREE COMPLETE", vars: { isPerfect: "true", status: "COMPLETE" }, log: "Perfect Binary Tree check complete!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "4", match: true }, { val: "5", match: true }, { val: "6", match: true }, { val: "7", match: true }] }
    ]
  },

  // ── 168. POSTORDER TRAVERSAL ──
  "postorder traversal": {
    solutionJS: `function postorderTraversal(root) {
  let res = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    dfs(node.right);
    res.push(node.val);
  }
  dfs(root);
  return res;
}`,
    solutionPY: `def postorderTraversal(root: Optional[TreeNode]) -> List[int]:
    res = []
    def dfs(node):
        if not node: return
        dfs(node.left)
        dfs(node.right)
        res.append(node.val)
    dfs(root)
    return res`,
    solutionCPP: `vector<int> postorderTraversal(TreeNode* root) {
    vector<int> res;
    function<void(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return;
        dfs(node->left);
        dfs(node->right);
        res.push_back(node->val);
    };
    dfs(root);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function postorderTraversal(root = [1, null, 2, 3]) {", vars: { root: "1" }, log: "Initialize tree 1 -> Right 2 -> Left 3. Postorder DFS (Left -> Right -> Root).", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }] },
      { line: 5, code: "  visit left(1)->null; visit right(1)->node 2; left(2)->node 3 -> push 3; push 2; push 1;", vars: { traversal: "[3, 2, 1]" }, log: "Postorder sequence: Visit Left of 2 (Node 3) -> Visit Root 2 -> Visit Root 1.", arrayState: [{ val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }] },
      { line: 9, code: "  return [3, 2, 1]; // POSTORDER TRAVERSAL COMPLETE", vars: { postorder: "[3, 2, 1]", status: "COMPLETE" }, log: "Postorder Traversal complete!", arrayState: [{ val: "3", match: true }, { val: "2", match: true }, { val: "1", match: true }] }
    ]
  },

  // ── 169. PREORDER TRAVERSAL ──
  "preorder traversal": {
    solutionJS: `function preorderTraversal(root) {
  let res = [];
  function dfs(node) {
    if (!node) return;
    res.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return res;
}`,
    solutionPY: `def preorderTraversal(root: Optional[TreeNode]) -> List[int]:
    res = []
    def dfs(node):
        if not node: return
        res.append(node.val)
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return res`,
    solutionCPP: `vector<int> preorderTraversal(TreeNode* root) {
    vector<int> res;
    function<void(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return;
        res.push_back(node->val);
        dfs(node->left);
        dfs(node->right);
    };
    dfs(root);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function preorderTraversal(root = [1, null, 2, 3]) {", vars: { root: "1" }, log: "Initialize tree 1 -> Right 2 -> Left 3. Preorder DFS (Root -> Left -> Right).", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }] },
      { line: 5, code: "  push 1; visit right(1)->node 2 -> push 2; left(2)->node 3 -> push 3;", vars: { traversal: "[1, 2, 3]" }, log: "Preorder sequence: Visit Root 1 -> Visit Node 2 -> Visit Left of 2 (Node 3).", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }] },
      { line: 9, code: "  return [1, 2, 3]; // PREORDER TRAVERSAL COMPLETE", vars: { preorder: "[1, 2, 3]", status: "COMPLETE" }, log: "Preorder Traversal complete!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "3", match: true }] }
    ]
  },

  // ── 170. REVERSE LEVEL ORDER TRAVERSAL ──
  "reverse level order traversal": {
    solutionJS: `function reverseLevelOrder(root) {
  let res = [];
  if (!root) return res;
  let queue = [root], stack = [];
  while (queue.length) {
    let node = queue.shift();
    stack.push(node.data);
    if (node.right) queue.push(node.right);
    if (node.left) queue.push(node.left);
  }
  while (stack.length) res.push(stack.pop());
  return res;
}`,
    solutionPY: `def reverseLevelOrder(root):
    res = []
    if not root: return res
    queue = collections.deque([root]); stack = []
    while queue:
        node = queue.popleft()
        stack.append(node.data)
        if node.right: queue.append(node.right)
        if node.left: queue.append(node.left)
    while stack: res.append(stack.pop())
    return res`,
    solutionCPP: `vector<int> reverseLevelOrder(Node *root) {
    vector<int> res;
    if (!root) return res;
    queue<Node*> q; stack<int> s;
    q.push(root);
    while (!q.empty()) {
        Node* node = q.front(); q.pop();
        s.push(node->data);
        if (node->right) q.push(node->right);
        if (node->left) q.push(node->left);
    }
    while (!s.empty()) { res.push_back(s.top()); s.pop(); }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function reverseLevelOrder(root = [1, 2, 3, 4, 5]) {", vars: { root: "1" }, log: "Initialize tree [1, 2, 3, 4, 5]. Queue right-to-left push + Stack reversal.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }] },
      { line: 6, code: "  stack pop order -> bottom level [4, 5], mid level [2, 3], root [1];", vars: { reverseLevelOrder: "[4, 5, 2, 3, 1]" }, log: "Reversed level order sequence: Level 2 -> [4, 5], Level 1 -> [2, 3], Level 0 -> [1].", arrayState: [{ val: "4", match: true }, { val: "5", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "1", match: true }] },
      { line: 12, code: "  return [4, 5, 2, 3, 1]; // REVERSE LEVEL ORDER COMPLETE", vars: { status: "COMPLETE" }, log: "Reverse Level Order Traversal complete!", arrayState: [{ val: "4", match: true }, { val: "5", match: true }, { val: "2", match: true }, { val: "3", match: true }, { val: "1", match: true }] }
    ]
  },

  // ── 171. RIGHT VIEW OF BINARY TREE ──
  "right view of binary tree": {
    solutionJS: `function rightSideView(root) {
  let res = [];
  function dfs(node, level) {
    if (!node) return;
    if (level === res.length) res.push(node.val);
    dfs(node.right, level + 1);
    dfs(node.left, level + 1);
  }
  dfs(root, 0);
  return res;
}`,
    solutionPY: `def rightSideView(root: Optional[TreeNode]) -> List[int]:
    res = []
    def dfs(node, level):
        if not node: return
        if level == len(res): res.append(node.val)
        dfs(node.right, level + 1)
        dfs(node.left, level + 1)
    dfs(root, 0)
    return res`,
    solutionCPP: `vector<int> rightSideView(TreeNode* root) {
    vector<int> res;
    function<void(TreeNode*, int)> dfs = [&](TreeNode* node, int level) {
        if (!node) return;
        if (level == res.size()) res.push_back(node->val);
        dfs(node->right, level + 1);
        dfs(node->left, level + 1);
    };
    dfs(root, 0);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function rightSideView(root = [1, 2, 3, null, 5, null, 4]) {", vars: { root: "1" }, log: "Initialize tree. Pre-order DFS (Root -> Right -> Left) tracking rightmost visible nodes.", arrayState: [{ val: "L0: 1" }, { val: "L1: 3" }, { val: "L2: 4" }] },
      { line: 5, code: "  level 0 -> 1; level 1 -> 3; level 2 -> 4 (rightmost visible nodes);", vars: { rightView: "[1, 3, 4]" }, log: "First node encountered at level 0 is 1, level 1 is 3, level 2 is 4.", arrayState: [{ val: "1 (L0)", match: true }, { val: "3 (L1)", match: true }, { val: "4 (L2)", match: true }] },
      { line: 10, code: "  return [1, 3, 4]; // RIGHT VIEW OF BINARY TREE COMPLETE", vars: { status: "COMPLETE" }, log: "Right View of Binary Tree complete!", arrayState: [{ val: "1", match: true }, { val: "3", match: true }, { val: "4", match: true }] }
    ]
  },

  // ── 172. SAME TREE ──
  "same tree": {
    solutionJS: `function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    solutionPY: `def isSameTree(p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
    if not p and not q: return True
    if not p or not q or p.val != q.val: return False
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)`,
    solutionCPP: `bool isSameTree(TreeNode* p, TreeNode* q) {
    if (!p && !q) return true;
    if (!p || !q || p->val != q->val) return false;
    return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
}`,
    visualizerSteps: [
      { line: 1, code: "function isSameTree(p = [1, 2, 3], q = [1, 2, 3]) {", vars: { p: "[1, 2, 3]", q: "[1, 2, 3]" }, log: "Initialize tree p and q. Parallel DFS node comparison.", arrayState: [{ val: "p: [1, 2, 3]" }, { val: "q: [1, 2, 3]" }] },
      { line: 3, code: "  p.val (1) === q.val (1); p.left (2) === q.left (2); p.right (3) === q.right (3);", vars: { rootMatch: "true", leftMatch: "true", rightMatch: "true" }, log: "Compare node values: Root 1===1, Left 2===2, Right 3===3. Trees are identical!", arrayState: [{ val: "Root 1===1", match: true }, { val: "Left 2===2", match: true }, { val: "Right 3===3", match: true }] },
      { line: 4, code: "  return true; // SAME TREE COMPLETE", vars: { isSame: "true", status: "COMPLETE" }, log: "Same Tree check complete!", arrayState: [{ val: "Root 1===1", match: true }, { val: "Left 2===2", match: true }, { val: "Right 3===3", match: true }] }
    ]
  },

  // ── 173. SUBTREE OF ANOTHER TREE ──
  "subtree of another tree": {
    solutionJS: `function isSubtree(root, subRoot) {
  if (!root) return false;
  if (isSame(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
function isSame(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSame(p.left, q.left) && isSame(p.right, q.right);
}`,
    solutionPY: `def isSubtree(root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
    if not root: return False
    if self.isSame(root, subRoot): return True
    return self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)
def isSame(self, p, q):
    if not p and not q: return True
    if not p or not q or p.val != q.val: return False
    return self.isSame(p.left, q.left) and self.isSame(p.right, q.right)`,
    solutionCPP: `bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    if (!root) return false;
    if (isSame(root, subRoot)) return true;
    return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);
}
bool isSame(TreeNode* p, TreeNode* q) {
    if (!p && !q) return true;
    if (!p || !q || p->val != q->val) return false;
    return isSame(p->left, q->left) && isSame(p->right, q->right);
}`,
    visualizerSteps: [
      { line: 1, code: "function isSubtree(root = [3, 4, 5, 1, 2], subRoot = [4, 1, 2]) {", vars: { root: "3", subRoot: "4" }, log: "Initialize tree root [3, 4, 5, 1, 2] and subRoot [4, 1, 2]. Recursive subtree search.", arrayState: [{ val: "Root: 3" }, { val: "subRoot: 4" }] },
      { line: 3, code: "  isSame(root 3, subRoot 4) -> false; search root.left (node 4) -> isSame([4, 1, 2], [4, 1, 2]) -> MATCH!", vars: { matchNode: "4", isSubtree: "true" }, log: "Check subTree match at node 4: Structural and value match confirmed for [4, 1, 2]!", arrayState: [{ val: "Node 4 Subtree Match", match: true }, { val: "Left 1 Match", match: true }, { val: "Right 2 Match", match: true }] },
      { line: 4, code: "  return true; // SUBTREE OF ANOTHER TREE COMPLETE", vars: { status: "COMPLETE" }, log: "Subtree of Another Tree complete!", arrayState: [{ val: "Node 4 Subtree Match", match: true }, { val: "Left 1 Match", match: true }, { val: "Right 2 Match", match: true }] }
    ]
  },

  // ── 174. SUM OF NODES ON THE LONGEST PATH FROM ROOT TO LEAF NODE ──
  "sum of nodes on the longest path from root to leaf node": {
    solutionJS: `function sumOfLongRootToLeafPath(root) {
  let maxLen = 0, maxSum = 0;
  function dfs(node, len, sum) {
    if (!node) return;
    if (!node.left && !node.right) {
      if (len > maxLen) { maxLen = len; maxSum = sum + node.data; }
      else if (len === maxLen) { maxSum = Math.max(maxSum, sum + node.data); }
      return;
    }
    dfs(node.left, len + 1, sum + node.data);
    dfs(node.right, len + 1, sum + node.data);
  }
  dfs(root, 1, 0);
  return maxSum;
}`,
    solutionPY: `def sumOfLongRootToLeafPath(root):
    max_len = max_sum = 0
    def dfs(node, length, sum_val):
        nonlocal max_len, max_sum
        if not node: return
        if not node.left and not node.right:
            if length > max_len:
                max_len = length
                max_sum = sum_val + node.data
            elif length == max_len:
                max_sum = max(max_sum, sum_val + node.data)
            return
        dfs(node.left, length + 1, sum_val + node.data)
        dfs(node.right, length + 1, sum_val + node.data)
    dfs(root, 1, 0)
    return max_sum`,
    solutionCPP: `int sumOfLongRootToLeafPath(Node *root) {
    int maxLen = 0, maxSum = 0;
    function<void(Node*, int, int)> dfs = [&](Node* node, int len, int sum) {
        if (!node) return;
        if (!node->left && !node->right) {
            if (len > maxLen) { maxLen = len; maxSum = sum + node->data; }
            else if (len == maxLen) { maxSum = max(maxSum, sum + node->data); }
            return;
        }
        dfs(node->left, len + 1, sum + node->data);
        dfs(node->right, len + 1, sum + node->data);
    };
    dfs(root, 1, 0);
    return maxSum;
}`,
    visualizerSteps: [
      { line: 1, code: "function sumOfLongRootToLeafPath(root = [4, 2, 5, 7, 1, 2, 3, null, null, 6]) {", vars: { root: "4" }, log: "Initialize tree. DFS path length & node sum tracking.", arrayState: [{ val: "Path 1: 4->2->1->6 (L:4, S:13)" }, { val: "Path 2: 4->5->3 (L:3, S:12)" }] },
      { line: 5, code: "  longest path detected: 4 -> 2 -> 1 -> 6 (length 4, sum = 4 + 2 + 1 + 6 = 13);", vars: { longestPathLen: "4", maxPathSum: "13" }, log: "Path 4 -> 2 -> 1 -> 6 has maximum length 4 with sum 13.", arrayState: [{ val: "4", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "6 (Leaf)", match: true }] },
      { line: 14, code: "  return 13; // SUM OF LONGEST PATH COMPLETE", vars: { maxSum: "13", status: "COMPLETE" }, log: "Sum of nodes on longest path complete!", arrayState: [{ val: "4", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "6", match: true }] }
    ]
  },
  "sum of nodes on the longest root to leaf path": {
    solutionJS: `function sumOfLongRootToLeafPath(root) {
  let maxLen = 0, maxSum = 0;
  function dfs(node, len, sum) {
    if (!node) return;
    if (!node.left && !node.right) {
      if (len > maxLen) { maxLen = len; maxSum = sum + node.data; }
      else if (len === maxLen) { maxSum = Math.max(maxSum, sum + node.data); }
      return;
    }
    dfs(node.left, len + 1, sum + node.data);
    dfs(node.right, len + 1, sum + node.data);
  }
  dfs(root, 1, 0);
  return maxSum;
}`,
    solutionPY: `def sumOfLongRootToLeafPath(root):
    max_len = max_sum = 0
    def dfs(node, length, sum_val):
        nonlocal max_len, max_sum
        if not node: return
        if not node.left and not node.right:
            if length > max_len:
                max_len = length
                max_sum = sum_val + node.data
            elif length == max_len:
                max_sum = max(max_sum, sum_val + node.data)
            return
        dfs(node.left, length + 1, sum_val + node.data)
        dfs(node.right, length + 1, sum_val + node.data)
    dfs(root, 1, 0)
    return max_sum`,
    solutionCPP: `int sumOfLongRootToLeafPath(Node *root) {
    int maxLen = 0, maxSum = 0;
    function<void(Node*, int, int)> dfs = [&](Node* node, int len, int sum) {
        if (!node) return;
        if (!node->left && !node->right) {
            if (len > maxLen) { maxLen = len; maxSum = sum + node->data; }
            else if (len == maxLen) { maxSum = max(maxSum, sum + node->data); }
            return;
        }
        dfs(node->left, len + 1, sum + node->data);
        dfs(node->right, len + 1, sum + node->data);
    };
    dfs(root, 1, 0);
    return maxSum;
}`,
    visualizerSteps: [
      { line: 1, code: "function sumOfLongRootToLeafPath(root = [4, 2, 5, 7, 1, 2, 3, null, null, 6]) {", vars: { root: "4" }, log: "Initialize tree. DFS path length & node sum tracking.", arrayState: [{ val: "Path 1: 4->2->1->6 (L:4, S:13)" }, { val: "Path 2: 4->5->3 (L:3, S:12)" }] },
      { line: 5, code: "  longest path detected: 4 -> 2 -> 1 -> 6 (length 4, sum = 4 + 2 + 1 + 6 = 13);", vars: { longestPathLen: "4", maxPathSum: "13" }, log: "Path 4 -> 2 -> 1 -> 6 has maximum length 4 with sum 13.", arrayState: [{ val: "4", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "6 (Leaf)", match: true }] },
      { line: 14, code: "  return 13; // SUM OF LONGEST PATH COMPLETE", vars: { maxSum: "13", status: "COMPLETE" }, log: "Sum of nodes on longest path complete!", arrayState: [{ val: "4", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "6", match: true }] }
    ]
  },

  // ── 175. SYMMETRIC TREE ──
  "symmetric tree": {
    solutionJS: `function isSymmetric(root) {
  if (!root) return true;
  function isMirror(t1, t2) {
    if (!t1 && !t2) return true;
    if (!t1 || !t2 || t1.val !== t2.val) return false;
    return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);
  }
  return isMirror(root.left, root.right);
}`,
    solutionPY: `def isSymmetric(root: Optional[TreeNode]) -> bool:
    if not root: return True
    def isMirror(t1, t2):
        if not t1 and not t2: return True
        if not t1 or not t2 or t1.val != t2.val: return False
        return isMirror(t1.left, t2.right) and isMirror(t1.right, t2.left)
    return isMirror(root.left, root.right)`,
    solutionCPP: `bool isSymmetric(TreeNode* root) {
    if (!root) return true;
    function<bool(TreeNode*, TreeNode*)> isMirror = [&](TreeNode* t1, TreeNode* t2) {
        if (!t1 && !t2) return true;
        if (!t1 || !t2 || t1->val != t2->val) return false;
        return isMirror(t1->left, t2->right) && isMirror(t1->right, t2->left);
    };
    return isMirror(root->left, root->right);
}`,
    visualizerSteps: [
      { line: 1, code: "function isSymmetric(root = [1, 2, 2, 3, 4, 4, 3]) {", vars: { root: "1" }, log: "Initialize tree [1, 2, 2, 3, 4, 4, 3]. Mirror symmetry DFS check.", arrayState: [{ val: "1 (Root)" }, { val: "L: 2" }, { val: "R: 2" }, { val: "3" }, { val: "4" }, { val: "4" }, { val: "3" }] },
      { line: 4, code: "  compare outer pair (3===3) and inner pair (4===4) across left & right subtrees;", vars: { outerPair: "3===3", innerPair: "4===4" }, log: "Mirror check: Left child 2 === Right child 2. Outer pair 3===3, Inner pair 4===4. SYMMETRIC!", arrayState: [{ val: "Root 1", match: true }, { val: "L2===R2", match: true }, { val: "Outer 3===3", match: true }, { val: "Inner 4===4", match: true }] },
      { line: 8, code: "  return true; // SYMMETRIC TREE COMPLETE", vars: { isSymmetric: "true", status: "COMPLETE" }, log: "Symmetric Tree check complete!", arrayState: [{ val: "Root 1", match: true }, { val: "L2===R2", match: true }, { val: "Outer 3===3", match: true }, { val: "Inner 4===4", match: true }] }
    ]
  },

  // ── 176. ZIGZAG TREE TRAVERSAL ──
  "zigzag tree traversal": {
    solutionJS: `function zigZagTraversal(root) {
  let res = [];
  if (!root) return res;
  let queue = [root], leftToRight = true;
  while (queue.length) {
    let size = queue.length;
    let level = [];
    for (let i = 0; i < size; i++) {
      let node = queue.shift();
      if (leftToRight) level.push(node.data);
      else level.unshift(node.data);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(...level);
    leftToRight = !leftToRight;
  }
  return res;
}`,
    solutionPY: `def zigZagTraversal(root):
    res = []
    if not root: return res
    queue = collections.deque([root]); left_to_right = True
    while queue:
        size = len(queue); level = []
        for _ in range(size):
            node = queue.popleft()
            if left_to_right: level.append(node.data)
            else: level.insert(0, node.data)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        res.extend(level)
        left_to_right = not left_to_right
    return res`,
    solutionCPP: `vector<int> zigZagTraversal(Node* root) {
    vector<int> res;
    if (!root) return res;
    queue<Node*> q; q.push(root);
    bool leftToRight = true;
    while (!q.empty()) {
        int size = q.size();
        vector<int> level(size);
        for (int i = 0; i < size; i++) {
            Node* node = q.front(); q.pop();
            int index = leftToRight ? i : (size - 1 - i);
            level[index] = node->data;
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        res.insert(res.end(), level.begin(), level.end());
        leftToRight = !leftToRight;
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function zigZagTraversal(root = [3, 9, 20, null, null, 15, 7]) {", vars: { root: "3" }, log: "Initialize tree. BFS queue with alternating direction flag.", arrayState: [{ val: "L0 (L-R): 3" }, { val: "L1 (R-L): 20, 9" }, { val: "L2 (L-R): 15, 7" }] },
      { line: 9, code: "  level 0 (L-R): [3]; level 1 (R-L): [20, 9]; level 2 (L-R): [15, 7];", vars: { zigzag: "[3, 20, 9, 15, 7]" }, log: "Zigzag sequence: Level 0 -> [3], Level 1 -> [20, 9], Level 2 -> [15, 7].", arrayState: [{ val: "3", match: true }, { val: "20", match: true }, { val: "9", match: true }, { val: "15", match: true }, { val: "7", match: true }] },
      { line: 16, code: "  return [3, 20, 9, 15, 7]; // ZIGZAG TRAVERSAL COMPLETE", vars: { status: "COMPLETE" }, log: "ZigZag Tree Traversal complete!", arrayState: [{ val: "3", match: true }, { val: "20", match: true }, { val: "9", match: true }, { val: "15", match: true }, { val: "7", match: true }] }
    ]
  },

  // ── 177. BINARY TREE LEVEL ORDER TRAVERSAL ──
  "binary tree level order traversal": {
    solutionJS: `function levelOrder(root) {
  let res = [];
  if (!root) return res;
  let queue = [root];
  while (queue.length) {
    let size = queue.length, level = [];
    for (let i = 0; i < size; i++) {
      let node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}`,
    solutionPY: `def levelOrder(root: Optional[TreeNode]) -> List[List[int]]:
    res = []
    if not root: return res
    queue = collections.deque([root])
    while queue:
        size = len(queue); level = []
        for _ in range(size):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(level)
    return res`,
    solutionCPP: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        int size = q.size(); vector<int> level;
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        res.push_back(level);
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function levelOrder(root = [3, 9, 20, null, null, 15, 7]) {", vars: { root: "3" }, log: "Initialize tree [3, 9, 20, null, null, 15, 7]. BFS snapshot traversal.", arrayState: [{ val: "Level 0: [3]" }, { val: "Level 1: [9, 20]" }, { val: "Level 2: [15, 7]" }] },
      { line: 7, code: "  level 0: [3]; level 1: [9, 20]; level 2: [15, 7];", vars: { result: "[[3], [9, 20], [15, 7]]" }, log: "Collect nodes level-by-level: [[3], [9, 20], [15, 7]].", arrayState: [{ val: "[3]", match: true }, { val: "[9, 20]", match: true }, { val: "[15, 7]", match: true }] },
      { line: 14, code: "  return [[3], [9, 20], [15, 7]]; // LEVEL ORDER COMPLETE", vars: { status: "COMPLETE" }, log: "Binary Tree Level Order Traversal complete!", arrayState: [{ val: "[3]", match: true }, { val: "[9, 20]", match: true }, { val: "[15, 7]", match: true }] }
    ]
  },

  // ── 178. BINARY TREE RIGHT SIDE VIEW ──
  "binary tree right side view": {
    solutionJS: `function rightSideView(root) {
  let res = [];
  function dfs(node, level) {
    if (!node) return;
    if (level === res.length) res.push(node.val);
    dfs(node.right, level + 1);
    dfs(node.left, level + 1);
  }
  dfs(root, 0);
  return res;
}`,
    solutionPY: `def rightSideView(root: Optional[TreeNode]) -> List[int]:
    res = []
    def dfs(node, level):
        if not node: return
        if level == len(res): res.append(node.val)
        dfs(node.right, level + 1)
        dfs(node.left, level + 1)
    dfs(root, 0)
    return res`,
    solutionCPP: `vector<int> rightSideView(TreeNode* root) {
    vector<int> res;
    function<void(TreeNode*, int)> dfs = [&](TreeNode* node, int level) {
        if (!node) return;
        if (level == res.size()) res.push_back(node->val);
        dfs(node->right, level + 1);
        dfs(node->left, level + 1);
    };
    dfs(root, 0);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function rightSideView(root = [1, 2, 3, null, 5, null, 4]) {", vars: { root: "1" }, log: "Initialize tree. Pre-order DFS (Root -> Right -> Left) tracking rightmost visible node at each depth.", arrayState: [{ val: "L0: 1" }, { val: "L1: 3" }, { val: "L2: 4" }] },
      { line: 5, code: "  level 0 -> 1; level 1 -> 3; level 2 -> 4 (rightmost visible nodes);", vars: { rightView: "[1, 3, 4]" }, log: "First node visited at level 0 is 1, level 1 is 3, level 2 is 4. Right side view = [1, 3, 4].", arrayState: [{ val: "1 (L0)", match: true }, { val: "3 (L1)", match: true }, { val: "4 (L2)", match: true }] },
      { line: 10, code: "  return [1, 3, 4]; // RIGHT SIDE VIEW COMPLETE", vars: { status: "COMPLETE" }, log: "Binary Tree Right Side View complete!", arrayState: [{ val: "1", match: true }, { val: "3", match: true }, { val: "4", match: true }] }
    ]
  },

  // ── 179. BINARY TREE ZIGZAG LEVEL ORDER TRAVERSAL ──
  "binary tree zigzag level order traversal": {
    solutionJS: `function zigzagLevelOrder(root) {
  let res = [];
  if (!root) return res;
  let queue = [root], leftToRight = true;
  while (queue.length) {
    let size = queue.length, level = [];
    for (let i = 0; i < size; i++) {
      let node = queue.shift();
      if (leftToRight) level.push(node.val);
      else level.unshift(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
    leftToRight = !leftToRight;
  }
  return res;
}`,
    solutionPY: `def zigzagLevelOrder(root: Optional[TreeNode]) -> List[List[int]]:
    res = []
    if not root: return res
    queue = collections.deque([root]); left_to_right = True
    while queue:
        size = len(queue); level = []
        for _ in range(size):
            node = queue.popleft()
            if left_to_right: level.append(node.val)
            else: level.insert(0, node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        res.append(level)
        left_to_right = not left_to_right
    return res`,
    solutionCPP: `vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q; q.push(root);
    bool leftToRight = true;
    while (!q.empty()) {
        int size = q.size(); vector<int> level(size);
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            int idx = leftToRight ? i : (size - 1 - i);
            level[idx] = node->val;
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        res.push_back(level);
        leftToRight = !leftToRight;
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function zigzagLevelOrder(root = [3, 9, 20, null, null, 15, 7]) {", vars: { root: "3" }, log: "Initialize tree. BFS level-by-level zigzag directional toggle.", arrayState: [{ val: "Level 0: [3]" }, { val: "Level 1: [20, 9]" }, { val: "Level 2: [15, 7]" }] },
      { line: 7, code: "  level 0 (L-R): [3]; level 1 (R-L): [20, 9]; level 2 (L-R): [15, 7];", vars: { result: "[[3], [20, 9], [15, 7]]" }, log: "Collect nodes zigzag: [[3], [20, 9], [15, 7]].", arrayState: [{ val: "[3]", match: true }, { val: "[20, 9]", match: true }, { val: "[15, 7]", match: true }] },
      { line: 15, code: "  return [[3], [20, 9], [15, 7]]; // ZIGZAG LEVEL ORDER COMPLETE", vars: { status: "COMPLETE" }, log: "Binary Tree Zigzag Level Order Traversal complete!", arrayState: [{ val: "[3]", match: true }, { val: "[20, 9]", match: true }, { val: "[15, 7]", match: true }] }
    ]
  },

  // ── 180. BOTTOM VIEW OF BINARY TREE ──
  "bottom view of binary tree": {
    solutionJS: `function bottomView(root) {
  let res = [];
  if (!root) return res;
  let map = new Map(), queue = [{ node: root, hd: 0 }];
  while (queue.length) {
    let { node, hd } = queue.shift();
    map.set(hd, node.data);
    if (node.left) queue.push({ node: node.left, hd: hd - 1 });
    if (node.right) queue.push({ node: node.right, hd: hd + 1 });
  }
  let sortedHds = Array.from(map.keys()).sort((a, b) => a - b);
  for (let hd of sortedHds) res.push(map.get(hd));
  return res;
}`,
    solutionPY: `def bottomView(root):
    res = []
    if not root: return res
    hd_map = {}
    queue = collections.deque([(root, 0)])
    while queue:
        node, hd = queue.popleft()
        hd_map[hd] = node.data
        if node.left: queue.append((node.left, hd - 1))
        if node.right: queue.append((node.right, hd + 1))
    for hd in sorted(hd_map.keys()):
        res.append(hd_map[hd])
    return res`,
    solutionCPP: `vector<int> bottomView(Node *root) {
    vector<int> res;
    if (!root) return res;
    map<int, int> mp;
    queue<pair<Node*, int>> q;
    q.push({root, 0});
    while (!q.empty()) {
        auto [node, hd] = q.front(); q.pop();
        mp[hd] = node->data;
        if (node->left) q.push({node->left, hd - 1});
        if (node->right) q.push({node->right, hd + 1});
    }
    for (auto& [hd, val] : mp) res.push_back(val);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function bottomView(root = [20, 8, 22, 5, 3, 4, 25, null, null, 10, 14]) {", vars: { root: "20" }, log: "Initialize tree. BFS horizontal distance (hd) map tracking bottom-most nodes.", arrayState: [{ val: "hd -2: 5" }, { val: "hd -1: 10" }, { val: "hd 0: 4" }, { val: "hd 1: 14" }, { val: "hd 2: 25" }] },
      { line: 6, code: "  overwriting hd map -> hd -2: 5, hd -1: 10, hd 0: 4, hd 1: 14, hd 2: 25;", vars: { bottomView: "[5, 10, 4, 14, 25]" }, log: "BFS overwrites upper nodes at same horizontal distances. Bottom view = [5, 10, 4, 14, 25].", arrayState: [{ val: "5 (hd -2)", match: true }, { val: "10 (hd -1)", match: true }, { val: "4 (hd 0)", match: true }, { val: "14 (hd 1)", match: true }, { val: "25 (hd 2)", match: true }] },
      { line: 11, code: "  return [5, 10, 4, 14, 25]; // BOTTOM VIEW BINARY TREE COMPLETE", vars: { status: "COMPLETE" }, log: "Bottom View of Binary Tree complete!", arrayState: [{ val: "5", match: true }, { val: "10", match: true }, { val: "4", match: true }, { val: "14", match: true }, { val: "25", match: true }] }
    ]
  },

  // ── 181. BOUNDARY TRAVERSAL OF BINARY TREE ──
  "boundary traversal of binary tree": {
    solutionJS: `function boundaryTraversal(root) {
  let res = [];
  if (!root) return res;
  if (isLeaf(root)) { res.push(root.data); return res; }
  res.push(root.data);
  addLeftBoundary(root.left, res);
  addLeaves(root, res);
  addRightBoundary(root.right, res);
  return res;
}
function isLeaf(node) { return !node.left && !node.right; }
function addLeftBoundary(node, res) {
  while (node) {
    if (!isLeaf(node)) res.push(node.data);
    node = node.left ? node.left : node.right;
  }
}
function addLeaves(node, res) {
  if (isLeaf(node)) { res.push(node.data); return; }
  if (node.left) addLeaves(node.left, res);
  if (node.right) addLeaves(node.right, res);
}
function addRightBoundary(node, res) {
  let tmp = [];
  while (node) {
    if (!isLeaf(node)) tmp.push(node.data);
    node = node.right ? node.right : node.left;
  }
  for (let i = tmp.length - 1; i >= 0; i--) res.push(tmp[i]);
}`,
    solutionPY: `def boundaryTraversal(root):
    res = []
    if not root: return res
    def is_leaf(node): return not node.left and not node.right
    if not is_leaf(root): res.append(root.data)
    else: return [root.data]
    curr = root.left
    while curr:
        if not is_leaf(curr): res.append(curr.data)
        curr = curr.left if curr.left else curr.right
    def add_leaves(node):
        if is_leaf(node): res.append(node.data); return
        if node.left: add_leaves(node.left)
        if node.right: add_leaves(node.right)
    add_leaves(root)
    curr, tmp = root.right, []
    while curr:
        if not is_leaf(curr): tmp.append(curr.data)
        curr = curr.right if curr.right else curr.left
    res.extend(tmp[::-1])
    return res`,
    solutionCPP: `vector<int> boundaryTraversal(Node* root) {
    vector<int> res;
    if (!root) return res;
    auto isLeaf = [](Node* n) { return !n->left && !n->right; };
    if (!isLeaf(root)) res.push_back(root->data);
    else return {root->data};
    Node* curr = root->left;
    while (curr) {
        if (!isLeaf(curr)) res.push_back(curr->data);
        curr = curr->left ? curr->left : curr->right;
    }
    function<void(Node*)> addLeaves = [&](Node* n) {
        if (isLeaf(n)) { res.push_back(n->data); return; }
        if (n->left) addLeaves(n->left);
        if (n->right) addLeaves(n->right);
    };
    addLeaves(root);
    curr = root->right; vector<int> tmp;
    while (curr) {
        if (!isLeaf(curr)) tmp.push_back(curr->data);
        curr = curr->right ? curr->right : curr->left;
    }
    for (int i = tmp.size() - 1; i >= 0; i--) res.push_back(tmp[i]);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function boundaryTraversal(root = [1, 2, 3, 4, 5, 6, 7, null, null, 8, 9]) {", vars: { root: "1" }, log: "Initialize tree. Anti-clockwise boundary order (Root -> Left Boundary -> Leaves -> Right Boundary Reversed).", arrayState: [{ val: "Root: 1" }, { val: "Left Bnd: 2" }, { val: "Leaves: 4,8,9,6,7" }, { val: "Right Bnd Rev: 3" }] },
      { line: 5, code: "  root 1 + left bnd 2 + leaves [4,8,9,6,7] + right bnd rev 3;", vars: { boundaryOrder: "[1, 2, 4, 8, 9, 6, 7, 3]" }, log: "Assemble anti-clockwise boundary traversal: 1 -> 2 -> 4 -> 8 -> 9 -> 6 -> 7 -> 3.", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "4", match: true }, { val: "8", match: true }, { val: "9", match: true }, { val: "6", match: true }, { val: "7", match: true }, { val: "3", match: true }] },
      { line: 10, code: "  return [1, 2, 4, 8, 9, 6, 7, 3]; // BOUNDARY TRAVERSAL COMPLETE", vars: { status: "COMPLETE" }, log: "Boundary Traversal of Binary Tree complete!", arrayState: [{ val: "1", match: true }, { val: "2", match: true }, { val: "4", match: true }, { val: "8", match: true }, { val: "9", match: true }, { val: "6", match: true }, { val: "7", match: true }, { val: "3", match: true }] }
    ]
  },

  // ── 182. CHECK IF TREE IS ISOMORPHIC ──
  "check if tree is isomorphic": {
    solutionJS: `function isIsomorphic(root1, root2) {
  if (!root1 && !root2) return true;
  if (!root1 || !root2 || root1.data !== root2.data) return false;
  let same = isIsomorphic(root1.left, root2.left) && isIsomorphic(root1.right, root2.right);
  let swap = isIsomorphic(root1.left, root2.right) && isIsomorphic(root1.right, root2.left);
  return same || swap;
}`,
    solutionPY: `def isIsomorphic(root1, root2):
    if not root1 and not root2: return True
    if not root1 or not root2 or root1.data != root2.data: return False
    same = isIsomorphic(root1.left, root2.left) and isIsomorphic(root1.right, root2.right)
    swap = isIsomorphic(root1.left, root2.right) and isIsomorphic(root1.right, root2.left)
    return same or swap`,
    solutionCPP: `bool isIsomorphic(Node *root1, Node *root2) {
    if (!root1 && !root2) return true;
    if (!root1 || !root2 || root1->data != root2->data) return false;
    bool same = isIsomorphic(root1->left, root2->left) && isIsomorphic(root1->right, root2->right);
    bool swap = isIsomorphic(root1->left, root2->right) && isIsomorphic(root1->right, root2->left);
    return same || swap;
}`,
    visualizerSteps: [
      { line: 1, code: "function isIsomorphic(r1 = [1, 2, 3, 4], r2 = [1, 3, 2, null, null, 4]) {", vars: { r1: "1", r2: "1" }, log: "Initialize tree r1 and r2. Isomorphic child swap & match recursion.", arrayState: [{ val: "r1: [1, 2, 3, 4]" }, { val: "r2: [1, 3, 2, null, null, 4]" }] },
      { line: 4, code: "  r1.val (1) === r2.val (1); r1.left (2) matches r2.right (2); r1.right (3) matches r2.left (3);", vars: { rootMatch: "1===1", childSwapMatch: "true" }, log: "Root 1===1. Swapped children match: r1.left (2) matches r2.right (2), r1.right (3) matches r2.left (3). ISOMORPHIC!", arrayState: [{ val: "Root 1===1", match: true }, { val: "Swapped L2===R2", match: true }, { val: "Swapped R3===L3", match: true }] },
      { line: 6, code: "  return true; // CHECK IF TREE IS ISOMORPHIC COMPLETE", vars: { isIsomorphic: "true", status: "COMPLETE" }, log: "Check if Tree is Isomorphic complete!", arrayState: [{ val: "Root 1===1", match: true }, { val: "Swapped L2===R2", match: true }, { val: "Swapped R3===L3", match: true }] }
    ]
  },

  // ── 183. CLONE A BINARY TREE ──
  "clone a binary tree": {
    solutionJS: `function cloneTree(root) {
  if (!root) return null;
  let map = new Map();
  function copyNodes(node) {
    if (!node) return null;
    let clone = new Node(node.data);
    map.set(node, clone);
    clone.left = copyNodes(node.left);
    clone.right = copyNodes(node.right);
    return clone;
  }
  let newRoot = copyNodes(root);
  function copyRandom(node) {
    if (!node) return;
    if (node.random) map.get(node).random = map.get(node.random);
    copyRandom(node.left);
    copyRandom(node.right);
  }
  copyRandom(root);
  return newRoot;
}`,
    solutionPY: `def cloneTree(root):
    if not root: return None
    mapping = {}
    def copy_nodes(node):
        if not node: return None
        clone = Node(node.data)
        mapping[node] = clone
        clone.left = copy_nodes(node.left)
        clone.right = copy_nodes(node.right)
        return clone
    new_root = copy_nodes(root)
    def copy_random(node):
        if not node: return
        if node.random: mapping[node].random = mapping[node.random]
        copy_random(node.left)
        copy_random(node.right)
    copy_random(root)
    return new_root`,
    solutionCPP: `Node* cloneTree(Node* root) {
    if (!root) return NULL;
    unordered_map<Node*, Node*> mp;
    function<Node*(Node*)> copyNodes = [&](Node* node) {
        if (!node) return (Node*)NULL;
        Node* clone = new Node(node->data);
        mp[node] = clone;
        clone->left = copyNodes(node->left);
        clone->right = copyNodes(node->right);
        return clone;
    };
    Node* newRoot = copyNodes(root);
    function<void(Node*)> copyRandom = [&](Node* node) {
        if (!node) return;
        if (node->random) mp[node]->random = mp[node->random];
        copyRandom(node->left);
        copyRandom(node->right);
    };
    copyRandom(root);
    return newRoot;
}`,
    visualizerSteps: [
      { line: 1, code: "function cloneTree(root = [1 (rand:3), 2 (rand:1), 3 (rand:2)]) {", vars: { root: "1" }, log: "Initialize binary tree with random pointers. 2-pass map node cloning.", arrayState: [{ val: "Node 1" }, { val: "Node 2" }, { val: "Node 3" }] },
      { line: 10, code: "  map original nodes -> clone copies; wire left, right, and random pointers via map;", vars: { cloneRoot: "1 (cloned)", randomPointers: "wired" }, log: "Pass 1: Copy tree structure into Map. Pass 2: Connect cloned random pointers via Map lookup.", arrayState: [{ val: "Clone 1 (rand->3)", match: true }, { val: "Clone 2 (rand->1)", match: true }, { val: "Clone 3 (rand->2)", match: true }] },
      { line: 18, code: "  return newRoot; // CLONE BINARY TREE COMPLETE", vars: { status: "COMPLETE" }, log: "Clone a Binary Tree deep copy complete!", arrayState: [{ val: "Clone 1", match: true }, { val: "Clone 2", match: true }, { val: "Clone 3", match: true }] }
    ]
  },

  // ── 184. CONNECT NODES AT SAME LEVEL ──
  "connect nodes at same level": {
    solutionJS: `function connect(root) {
  if (!root) return root;
  let queue = [root];
  while (queue.length) {
    let size = queue.length;
    for (let i = 0; i < size; i++) {
      let node = queue.shift();
      if (i < size - 1) node.nextRight = queue[0];
      else node.nextRight = null;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return root;
}`,
    solutionPY: `def connect(root):
    if not root: return root
    queue = collections.deque([root])
    while queue:
        size = len(queue)
        for i in range(size):
            node = queue.popleft()
            if i < size - 1: node.nextRight = queue[0]
            else: node.nextRight = None
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
    return root`,
    solutionCPP: `void connect(Node *root) {
    if (!root) return;
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            Node* node = q.front(); q.pop();
            if (i < size - 1) node->nextRight = q.front();
            else node->nextRight = NULL;
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
}`,
    visualizerSteps: [
      { line: 1, code: "function connect(root = [1, 2, 3, 4, 5, 6, 7]) {", vars: { root: "1" }, log: "Initialize tree [1, 2, 3, 4, 5, 6, 7]. Level order queue processing for nextRight linking.", arrayState: [{ val: "1 -> null" }, { val: "2 -> 3 -> null" }, { val: "4 -> 5 -> 6 -> 7 -> null" }] },
      { line: 6, code: "  L0: 1.nextRight = null; L1: 2.nextRight = 3; L2: 4.nextRight = 5, 5.nextRight = 6, 6.nextRight = 7;", vars: { level1Pointers: "2 -> 3", level2Pointers: "4 -> 5 -> 6 -> 7" }, log: "Link immediate right siblings per level: 2->3, 4->5->6->7.", arrayState: [{ val: "1 -> null", match: true }, { val: "2 -> 3 -> null", match: true }, { val: "4 -> 5 -> 6 -> 7 -> null", match: true }] },
      { line: 14, code: "  return root; // CONNECT NODES AT SAME LEVEL COMPLETE", vars: { status: "COMPLETE" }, log: "Connect Nodes at Same Level complete!", arrayState: [{ val: "1 -> null", match: true }, { val: "2 -> 3 -> null", match: true }, { val: "4 -> 5 -> 6 -> 7 -> null", match: true }] }
    ]
  },

  // ── 185. CONSTRUCT BINARY TREE FROM INORDER AND POSTORDER TRAVERSAL ──
  "construct binary tree from inorder and postorder traversal": {
    solutionJS: `function buildTree(inorder, postorder) {
  let map = new Map();
  for (let i = 0; i < inorder.length; i++) map.set(inorder[i], i);
  let postIdx = postorder.length - 1;
  function helper(inStart, inEnd) {
    if (inStart > inEnd) return null;
    let rootVal = postorder[postIdx--];
    let root = new TreeNode(rootVal);
    let index = map.get(rootVal);
    root.right = helper(index + 1, inEnd);
    root.left = helper(inStart, index - 1);
    return root;
  }
  return helper(0, inorder.length - 1);
}`,
    solutionPY: `def buildTree(inorder: List[int], postorder: List[int]) -> Optional[TreeNode]:
    idx_map = {val: i for i, val in enumerate(inorder)}
    post_idx = len(postorder) - 1
    def helper(in_start, in_end):
        nonlocal post_idx
        if in_start > in_end: return None
        root_val = postorder[post_idx]
        post_idx -= 1
        root = TreeNode(root_val)
        idx = idx_map[root_val]
        root.right = helper(idx + 1, in_end)
        root.left = helper(in_start, idx - 1)
        return root
    return helper(0, len(inorder) - 1)`,
    solutionCPP: `TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
    unordered_map<int, int> mp;
    for (int i = 0; i < inorder.size(); i++) mp[inorder[i]] = i;
    int postIdx = postorder.size() - 1;
    function<TreeNode*(int, int)> helper = [&](int inStart, int inEnd) {
        if (inStart > inEnd) return (TreeNode*)NULL;
        int rootVal = postorder[postIdx--];
        TreeNode* root = new TreeNode(rootVal);
        int idx = mp[rootVal];
        root->right = helper(idx + 1, inEnd);
        root->left = helper(inStart, idx - 1);
        return root;
    };
    return helper(0, inorder.size() - 1);
}`,
    visualizerSteps: [
      { line: 1, code: "function buildTree(inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]) {", vars: { postorder: "[9, 15, 7, 20, 3]" }, log: "Initialize traversals. Root is last element of postorder (3).", arrayState: [{ val: "inorder: [9, 3, 15, 20, 7]" }, { val: "postorder: [9, 15, 7, 20, 3]" }] },
      { line: 6, code: "  root = 3 -> left inorder [9], right inorder [15, 20, 7]; build subtrees;", vars: { root: "3", leftIn: "[9]", rightIn: "[15, 20, 7]" }, log: "Pop root 3 from postorder. Split inorder around 3: Left [9], Right [15, 20, 7]. Reconstruct subtrees.", arrayState: [{ val: "Root: 3", match: true }, { val: "L: 9", match: true }, { val: "R: 20 (15, 7)", match: true }] },
      { line: 13, code: "  return root; // CONSTRUCT TREE INORDER POSTORDER COMPLETE", vars: { status: "COMPLETE" }, log: "Reconstructed Binary Tree [3, 9, 20, null, null, 15, 7] successfully!", arrayState: [{ val: "Root: 3", match: true }, { val: "L: 9", match: true }, { val: "R: 20 (15, 7)", match: true }] }
    ]
  },

  // ── 186. CONSTRUCT BINARY TREE FROM PREORDER AND INORDER TRAVERSAL ──
  "construct binary tree from preorder and inorder traversal": {
    solutionJS: `function buildTree(preorder, inorder) {
  let map = new Map();
  for (let i = 0; i < inorder.length; i++) map.set(inorder[i], i);
  let preIdx = 0;
  function helper(inStart, inEnd) {
    if (inStart > inEnd) return null;
    let rootVal = preorder[preIdx++];
    let root = new TreeNode(rootVal);
    let index = map.get(rootVal);
    root.left = helper(inStart, index - 1);
    root.right = helper(index + 1, inEnd);
    return root;
  }
  return helper(0, inorder.length - 1);
}`,
    solutionPY: `def buildTree(preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
    idx_map = {val: i for i, val in enumerate(inorder)}
    pre_idx = 0
    def helper(in_start, in_end):
        nonlocal pre_idx
        if in_start > in_end: return None
        root_val = preorder[pre_idx]
        pre_idx += 1
        root = TreeNode(root_val)
        idx = idx_map[root_val]
        root.left = helper(in_start, idx - 1)
        root.right = helper(idx + 1, in_end)
        return root
    return helper(0, len(inorder) - 1)`,
    solutionCPP: `TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    unordered_map<int, int> mp;
    for (int i = 0; i < inorder.size(); i++) mp[inorder[i]] = i;
    int preIdx = 0;
    function<TreeNode*(int, int)> helper = [&](int inStart, int inEnd) {
        if (inStart > inEnd) return (TreeNode*)NULL;
        int rootVal = preorder[preIdx++];
        TreeNode* root = new TreeNode(rootVal);
        int idx = mp[rootVal];
        root->left = helper(inStart, idx - 1);
        root->right = helper(idx + 1, inEnd);
        return root;
    };
    return helper(0, inorder.size() - 1);
}`,
    visualizerSteps: [
      { line: 1, code: "function buildTree(preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]) {", vars: { preorder: "[3, 9, 20, 15, 7]" }, log: "Initialize traversals. Root is first element of preorder (3).", arrayState: [{ val: "preorder: [3, 9, 20, 15, 7]" }, { val: "inorder: [9, 3, 15, 20, 7]" }] },
      { line: 6, code: "  root = 3 -> left inorder [9], right inorder [15, 20, 7]; build subtrees;", vars: { root: "3", leftIn: "[9]", rightIn: "[15, 20, 7]" }, log: "Read root 3 from preorder. Split inorder around 3: Left [9], Right [15, 20, 7]. Reconstruct subtrees.", arrayState: [{ val: "Root: 3", match: true }, { val: "L: 9", match: true }, { val: "R: 20 (15, 7)", match: true }] },
      { line: 13, code: "  return root; // CONSTRUCT TREE PREORDER INORDER COMPLETE", vars: { status: "COMPLETE" }, log: "Reconstructed Binary Tree [3, 9, 20, null, null, 15, 7] successfully!", arrayState: [{ val: "Root: 3", match: true }, { val: "L: 9", match: true }, { val: "R: 20 (15, 7)", match: true }] }
    ]
  },

  // ── 187. CONSTRUCT TREE FROM INORDER AND PREORDER ──
  "construct tree from inorder and preorder": {
    solutionJS: `function buildTree(inorder, preorder) {
  let map = new Map();
  for (let i = 0; i < inorder.length; i++) map.set(inorder[i], i);
  let preIdx = 0;
  function helper(inStart, inEnd) {
    if (inStart > inEnd) return null;
    let rootVal = preorder[preIdx++];
    let root = new Node(rootVal);
    let index = map.get(rootVal);
    root.left = helper(inStart, index - 1);
    root.right = helper(index + 1, inEnd);
    return root;
  }
  return helper(0, inorder.length - 1);
}`,
    solutionPY: `def buildTree(inorder, preorder):
    idx_map = {val: i for i, val in enumerate(inorder)}
    pre_idx = 0
    def helper(in_start, in_end):
        nonlocal pre_idx
        if in_start > in_end: return None
        root_val = preorder[pre_idx]
        pre_idx += 1
        root = Node(root_val)
        idx = idx_map[root_val]
        root.left = helper(in_start, idx - 1)
        root.right = helper(idx + 1, in_end)
        return root
    return helper(0, len(inorder) - 1)`,
    solutionCPP: `Node* buildTree(vector<int>& inorder, vector<int>& preorder) {
    unordered_map<int, int> mp;
    for (int i = 0; i < inorder.size(); i++) mp[inorder[i]] = i;
    int preIdx = 0;
    function<Node*(int, int)> helper = [&](int inStart, int inEnd) {
        if (inStart > inEnd) return (Node*)NULL;
        int rootVal = preorder[preIdx++];
        Node* root = new Node(rootVal);
        int idx = mp[rootVal];
        root->left = helper(inStart, idx - 1);
        root->right = helper(idx + 1, inEnd);
        return root;
    };
    return helper(0, inorder.size() - 1);
}`,
    visualizerSteps: [
      { line: 1, code: "function buildTree(inorder = [1, 6, 8, 7], preorder = [1, 6, 7, 8]) {", vars: { preorder: "[1, 6, 7, 8]" }, log: "Initialize traversals. Root is first element of preorder (1).", arrayState: [{ val: "inorder: [1, 6, 8, 7]" }, { val: "preorder: [1, 6, 7, 8]" }] },
      { line: 6, code: "  root = 1 -> right sub [6, 8, 7] with root 6 -> right child 7 with left child 8;", vars: { root: "1", rightTree: "6 -> 7 (left: 8)" }, log: "Reconstruct tree structure: Root 1 -> Right 6 -> Right 7 -> Left 8.", arrayState: [{ val: "Root: 1", match: true }, { val: "Right: 6", match: true }, { val: "Right: 7", match: true }, { val: "Left: 8", match: true }] },
      { line: 13, code: "  return root; // CONSTRUCT TREE INORDER PREORDER COMPLETE", vars: { status: "COMPLETE" }, log: "Construct Tree from Inorder and Preorder complete!", arrayState: [{ val: "Root: 1", match: true }, { val: "Right: 6", match: true }, { val: "Right: 7", match: true }, { val: "Left: 8", match: true }] }
    ]
  },

  // ── 188. COUNT GOOD NODES IN BINARY TREE ──
  "count good nodes in binary tree": {
    solutionJS: `function goodNodes(root) {
  let count = 0;
  function dfs(node, maxVal) {
    if (!node) return;
    if (node.val >= maxVal) count++;
    let newMax = Math.max(maxVal, node.val);
    dfs(node.left, newMax);
    dfs(node.right, newMax);
  }
  dfs(root, root.val);
  return count;
}`,
    solutionPY: `def goodNodes(root: TreeNode) -> int:
    count = 0
    def dfs(node, max_val):
        nonlocal count
        if not node: return
        if node.val >= max_val: count += 1
        new_max = max(max_val, node.val)
        dfs(node.left, new_max)
        dfs(node.right, new_max)
    dfs(root, root.val)
    return count`,
    solutionCPP: `int goodNodes(TreeNode* root) {
    int count = 0;
    function<void(TreeNode*, int)> dfs = [&](TreeNode* node, int maxVal) {
        if (!node) return;
        if (node->val >= maxVal) count++;
        int newMax = max(maxVal, node->val);
        dfs(node->left, newMax);
        dfs(node->right, newMax);
    };
    dfs(root, root->val);
    return count;
}`,
    visualizerSteps: [
      { line: 1, code: "function goodNodes(root = [3, 1, 4, 3, null, 1, 5]) {", vars: { root: "3" }, log: "Initialize tree [3, 1, 4, 3, null, 1, 5]. Pre-order DFS tracking max value on path.", arrayState: [{ val: "3 (Root, max:3)" }, { val: "1 (max:3)" }, { val: "4 (max:4)" }, { val: "3 (max:3)" }, { val: "1 (max:4)" }, { val: "5 (max:5)" }] },
      { line: 4, code: "  good nodes: root 3 (3>=3), node 3 (3>=3), node 4 (4>=3), node 5 (5>=4) -> count = 4;", vars: { goodCount: "4", goodNodes: "[3, 3, 4, 5]" }, log: "Nodes 3 (root), 3 (left-left), 4 (right), 5 (right-right) meet criteria node.val >= maxVal. Total = 4.", arrayState: [{ val: "Root 3 (Good)", match: true }, { val: "Node 3 (Good)", match: true }, { val: "Node 4 (Good)", match: true }, { val: "Node 5 (Good)", match: true }] },
      { line: 10, code: "  return 4; // COUNT GOOD NODES COMPLETE", vars: { goodNodesCount: "4", status: "COMPLETE" }, log: "Count Good Nodes in Binary Tree complete!", arrayState: [{ val: "Root 3 (Good)", match: true }, { val: "Node 3 (Good)", match: true }, { val: "Node 4 (Good)", match: true }, { val: "Node 5 (Good)", match: true }] }
    ]
  },

  // ── 189. DELETE A NODE FROM BST WITHOUT HEAD POINTER ──
  "delete a node from bst without head pointer": {
    solutionJS: `function deleteNodeWithoutHead(delNode) {
  if (!delNode) return;
  if (delNode.right) {
    let successor = delNode.right, parent = delNode;
    while (successor.left) { parent = successor; successor = successor.left; }
    delNode.val = successor.val;
    if (parent.left === successor) parent.left = successor.right;
    else parent.right = successor.right;
  } else if (delNode.left) {
    let predecessor = delNode.left, parent = delNode;
    while (predecessor.right) { parent = predecessor; predecessor = predecessor.right; }
    delNode.val = predecessor.val;
    if (parent.right === predecessor) parent.right = predecessor.left;
    else parent.left = predecessor.left;
  }
}`,
    solutionPY: `def deleteNodeWithoutHead(del_node):
    if not del_node: return
    if del_node.right:
        successor, parent = del_node.right, del_node
        while successor.left: parent = successor; successor = successor.left
        del_node.val = successor.val
        if parent.left == successor: parent.left = successor.right
        else: parent.right = successor.right
    elif del_node.left:
        predecessor, parent = del_node.left, del_node
        while predecessor.right: parent = predecessor; predecessor = predecessor.right
        del_node.val = predecessor.val
        if parent.right == predecessor: parent.right = predecessor.left
        else: parent.left = predecessor.left`,
    solutionCPP: `void deleteNodeWithoutHead(Node* delNode) {
    if (!delNode) return;
    if (delNode->right) {
        Node *successor = delNode->right, *parent = delNode;
        while (successor->left) { parent = successor; successor = successor->left; }
        delNode->val = successor->val;
        if (parent->left == successor) parent->left = successor->right;
        else parent->right = successor->right;
    } else if (delNode->left) {
        Node *predecessor = delNode->left, *parent = delNode;
        while (predecessor->right) { parent = predecessor; predecessor = predecessor->right; }
        delNode->val = predecessor->val;
        if (parent->right == predecessor) parent->right = predecessor->left;
        else parent->left = predecessor->left;
    }
}`,
    visualizerSteps: [
      { line: 1, code: "function deleteNodeWithoutHead(delNode = 5 in BST 3 -> 5 -> 7) {", vars: { delNode: "5" }, log: "Target node 5 in BST. Delete without root pointer by copying inorder successor value.", arrayState: [{ val: "Node 3" }, { val: "delNode 5 (Target)" }, { val: "Node 7" }] },
      { line: 6, code: "  inorder successor = 6 -> copy val 6 into delNode 5 -> unlink original successor node 6;", vars: { successor: "6", copiedVal: "6" }, log: "Find successor node 6 in right subtree. Copy value 6 into delNode (5 becomes 6), then unlink old node 6.", arrayState: [{ val: "Node 3", match: true }, { val: "Node 6 (Replaced)", match: true }, { val: "Node 7", match: true }] },
      { line: 14, code: "  // DELETE NODE FROM BST WITHOUT HEAD POINTER COMPLETE", vars: { status: "COMPLETE" }, log: "Node deleted successfully without head pointer!", arrayState: [{ val: "Node 3", match: true }, { val: "Node 6", match: true }, { val: "Node 7", match: true }] }
    ]
  },

  // ── 190. DIAGONAL TRAVERSAL OF BINARY TREE ──
  "diagonal traversal of binary tree": {
    solutionJS: `function diagonal(root) {
  let res = [];
  if (!root) return res;
  let queue = [root];
  while (queue.length) {
    let curr = queue.shift();
    while (curr) {
      res.push(curr.data);
      if (curr.left) queue.push(curr.left);
      curr = curr.right;
    }
  }
  return res;
}`,
    solutionPY: `def diagonal(root):
    res = []
    if not root: return res
    queue = collections.deque([root])
    while queue:
        curr = queue.popleft()
        while curr:
            res.append(curr.data)
            if curr.left: queue.append(curr.left)
            curr = curr.right
    return res`,
    solutionCPP: `vector<int> diagonal(Node *root) {
    vector<int> res;
    if (!root) return res;
    queue<Node*> q; q.push(root);
    while (!q.empty()) {
        Node* curr = q.front(); q.pop();
        while (curr) {
            res.push_back(curr->data);
            if (curr->left) q.push(curr->left);
            curr = curr->right;
        }
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function diagonal(root = [8, 3, 10, 1, 6, null, 14]) {", vars: { root: "8" }, log: "Initialize tree. Slope queue traversal (output right slope, queue left children).", arrayState: [{ val: "Slope 0: 8, 10, 14" }, { val: "Slope 1: 3, 6, 7, 13" }, { val: "Slope 2: 1, 4" }] },
      { line: 6, code: "  slope 0: [8, 10, 14]; slope 1: [3, 6, 7, 13]; slope 2: [1, 4];", vars: { diagonalOrder: "[8, 10, 14, 3, 6, 7, 13, 1, 4]" }, log: "Traverse slope 0 [8, 10, 14], slope 1 [3, 6, 7, 13], slope 2 [1, 4].", arrayState: [{ val: "8", match: true }, { val: "10", match: true }, { val: "14", match: true }, { val: "3", match: true }, { val: "6", match: true }, { val: "7", match: true }, { val: "13", match: true }, { val: "1", match: true }, { val: "4", match: true }] },
      { line: 13, code: "  return [8, 10, 14, 3, 6, 7, 13, 1, 4]; // DIAGONAL TRAVERSAL COMPLETE", vars: { status: "COMPLETE" }, log: "Diagonal Traversal of Binary Tree complete!", arrayState: [{ val: "8", match: true }, { val: "10", match: true }, { val: "14", match: true }, { val: "3", match: true }, { val: "6", match: true }, { val: "7", match: true }, { val: "13", match: true }, { val: "1", match: true }, { val: "4", match: true }] }
    ]
  },

  // ── 191. DUPLICATE SUBTREE IN BINARY TREE ──
  "duplicate subtree in binary tree": {
    solutionJS: `function dupSub(root) {
  let map = new Map(), hasDuplicate = false;
  function serialize(node) {
    if (!node) return "#";
    if (!node.left && !node.right) return String(node.data);
    let s = node.data + "(" + serialize(node.left) + ")(" + serialize(node.right) + ")";
    let count = (map.get(s) || 0) + 1;
    map.set(s, count);
    if (count === 2) hasDuplicate = true;
    return s;
  }
  serialize(root);
  return hasDuplicate ? 1 : 0;
}`,
    solutionPY: `def dupSub(root):
    counts = {}
    has_duplicate = False
    def serialize(node):
        nonlocal has_duplicate
        if not node: return "#"
        if not node.left and not node.right: return str(node.data)
        s = f"{node.data}({serialize(node.left)})({serialize(node.right)})"
        counts[s] = counts.get(s, 0) + 1
        if counts[s] == 2: has_duplicate = True
        return s
    serialize(root)
    return 1 if has_duplicate else 0`,
    solutionCPP: `int dupSub(Node *root) {
    unordered_map<string, int> mp;
    bool hasDuplicate = false;
    function<string(Node*)> serialize = [&](Node* node) {
        if (!node) return string("#");
        if (!node->left && !node->right) return to_string(node->data);
        string s = to_string(node->data) + "(" + serialize(node->left) + ")(" + serialize(node->right) + ")";
        mp[s]++;
        if (mp[s] == 2) hasDuplicate = true;
        return s;
    };
    serialize(root);
    return hasDuplicate ? 1 : 0;
}`,
    visualizerSteps: [
      { line: 1, code: "function dupSub(root = [1, 2, 3, 4, 5, null, 2, null, null, null, null, 4, 5]) {", vars: { root: "1" }, log: "Initialize tree. Post-order subtree string serialization frequency mapping.", arrayState: [{ val: "Subtree: 2(4,#,#)(5,#,#)" }, { val: "Freq: 2" }] },
      { line: 8, code: "  subtree '2(4)(5)' serialized 2 times in tree -> duplicate subtree detected (size >= 2);", vars: { dupSubtree: "2(4)(5)", count: "2" }, log: "Subtree '2(4)(5)' appears 2 times in tree. Duplicate subtree exists!", arrayState: [{ val: "Subtree 1: 2(4,5)", match: true }, { val: "Subtree 2: 2(4,5)", match: true }] },
      { line: 12, code: "  return 1; // DUPLICATE SUBTREE COMPLETE", vars: { status: "COMPLETE" }, log: "Duplicate subtree in Binary Tree complete! Return 1.", arrayState: [{ val: "Subtree 1: 2(4,5)", match: true }, { val: "Subtree 2: 2(4,5)", match: true }] }
    ]
  },

  // ── 192. FLATTEN BINARY TREE TO LINKED LIST ──
  "flatten binary tree to linked list": {
    solutionJS: `function flatten(root) {
  let prev = null;
  function dfs(node) {
    if (!node) return;
    dfs(node.right);
    dfs(node.left);
    node.right = prev;
    node.left = null;
    prev = node;
  }
  dfs(root);
}`,
    solutionPY: `def flatten(root: Optional[TreeNode]) -> None:
    prev = None
    def dfs(node):
        nonlocal prev
        if not node: return
        dfs(node.right)
        dfs(node.left)
        node.right = prev
        node.left = None
        prev = node
    dfs(root)`,
    solutionCPP: `void flatten(TreeNode* root) {
    TreeNode* prev = NULL;
    function<void(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return;
        dfs(node->right);
        dfs(node->left);
        node->right = prev;
        node->left = NULL;
        prev = node;
    };
    dfs(root);
}`,
    visualizerSteps: [
      { line: 1, code: "function flatten(root = [1, 2, 5, 3, 4, null, 6]) {", vars: { root: "1" }, log: "Initialize tree [1, 2, 5, 3, 4, null, 6]. Reverse pre-order DFS (Right -> Left -> Root).", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "4" }, { val: "5" }, { val: "6" }] },
      { line: 6, code: "  flatten right pointers: 1 -> 2 -> 3 -> 4 -> 5 -> 6; set all left = null;", vars: { rightList: "1 -> 2 -> 3 -> 4 -> 5 -> 6" }, log: "In-place right pointer wiring: 1.right = 2, 2.right = 3, 3.right = 4, 4.right = 5, 5.right = 6.", arrayState: [{ val: "1 -> 2", match: true }, { val: "2 -> 3", match: true }, { val: "3 -> 4", match: true }, { val: "4 -> 5", match: true }, { val: "5 -> 6", match: true }] },
      { line: 10, code: "  // FLATTEN BINARY TREE TO LINKED LIST COMPLETE", vars: { status: "COMPLETE" }, log: "Flatten Binary Tree to Linked List complete!", arrayState: [{ val: "1 -> 2", match: true }, { val: "2 -> 3", match: true }, { val: "3 -> 4", match: true }, { val: "4 -> 5", match: true }, { val: "5 -> 6", match: true }] }
    ]
  },

  // ── 193. LEAVES TO DOUBLY LINKED LIST ──
  "leaves to doubly linked list": {
    solutionJS: `function convertToDLL(root) {
  let head = null, prev = null;
  function extract(node) {
    if (!node) return null;
    if (!node.left && !node.right) {
      if (!head) head = node;
      else { prev.right = node; node.left = prev; }
      prev = node;
      return null;
    }
    node.left = extract(node.left);
    node.right = extract(node.right);
    return node;
  }
  extract(root);
  return head;
}`,
    solutionPY: `def convertToDLL(root):
    head = prev = None
    def extract(node):
        nonlocal head, prev
        if not node: return None
        if not node.left and not node.right:
            if not head: head = node
            else: prev.right = node; node.left = prev
            prev = node
            return None
        node.left = extract(node.left)
        node.right = extract(node.right)
        return node
    extract(root)
    return head`,
    solutionCPP: `Node* convertToDLL(Node *root) {
    Node *head = NULL, *prev = NULL;
    function<Node*(Node*)> extract = [&](Node* node) {
        if (!node) return (Node*)NULL;
        if (!node->left && !node->right) {
            if (!head) head = node;
            else { prev->right = node; node->left = prev; }
            prev = node;
            return (Node*)NULL;
        }
        node->left = extract(node->left);
        node->right = extract(node->right);
        return node;
    };
    extract(root);
    return head;
}`,
    visualizerSteps: [
      { line: 1, code: "function convertToDLL(root = [1, 2, 3, 4, 5, 6, 7]) {", vars: { root: "1" }, log: "Initialize tree. Inorder leaf extraction into Doubly Linked List.", arrayState: [{ val: "Leaves: 4, 5, 6, 7" }] },
      { line: 6, code: "  extract leaves [4, 5, 6, 7] -> link 4 <-> 5 <-> 6 <-> 7; unlink from original tree;", vars: { dllHead: "4", dllTail: "7" }, log: "Leaves extracted and linked in DLL: 4 <-> 5 <-> 6 <-> 7. Original tree leaves set to null.", arrayState: [{ val: "4 <-> 5", match: true }, { val: "5 <-> 6", match: true }, { val: "6 <-> 7", match: true }] },
      { line: 14, code: "  return head; // LEAVES TO DOUBLY LINKED LIST COMPLETE", vars: { status: "COMPLETE" }, log: "Leaves to Doubly Linked List complete!", arrayState: [{ val: "4 <-> 5", match: true }, { val: "5 <-> 6", match: true }, { val: "6 <-> 7", match: true }] }
    ]
  },

  // ── 194. LOWEST COMMON ANCESTOR IN A BINARY TREE ──
  "lowest common ancestor in a binary tree": {
    solutionJS: `function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  let left = lowestCommonAncestor(root.left, p, q);
  let right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left ? left : right;
}`,
    solutionPY: `def lowestCommonAncestor(root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
    if not root or root == p or root == q: return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left and right: return root
    return left if left else right`,
    solutionCPP: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`,
    visualizerSteps: [
      { line: 1, code: "function lowestCommonAncestor(root = 3, p = 5, q = 1) {", vars: { p: "5", q: "1" }, log: "Initialize tree with p = 5, q = 1. Post-order DFS LCA search.", arrayState: [{ val: "Root: 3" }, { val: "p: 5 (Left sub)" }, { val: "q: 1 (Right sub)" }] },
      { line: 5, code: "  left sub returns 5, right sub returns 1 -> both non-null -> LCA = root 3;", vars: { leftResult: "5", rightResult: "1", lca: "3" }, log: "Left search found 5, Right search found 1. Root node 3 is the Lowest Common Ancestor!", arrayState: [{ val: "LCA Node: 3", match: true }, { val: "Target p: 5", match: true }, { val: "Target q: 1", match: true }] },
      { line: 6, code: "  return 3; // LOWEST COMMON ANCESTOR COMPLETE", vars: { status: "COMPLETE" }, log: "Lowest Common Ancestor in a Binary Tree complete!", arrayState: [{ val: "LCA Node: 3", match: true }, { val: "Target p: 5", match: true }, { val: "Target q: 1", match: true }] }
    ]
  },

  // ── 195. MAXIMUM SUM OF NON-ADJACENT NODES ──
  "maximum sum of non-adjacent nodes": {
    solutionJS: `function getMaxSum(root) {
  function solve(node) {
    if (!node) return [0, 0];
    let left = solve(node.left);
    let right = solve(node.right);
    let include = node.data + left[1] + right[1];
    let exclude = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
    return [include, exclude];
  }
  let res = solve(root);
  return Math.max(res[0], res[1]);
}`,
    solutionPY: `def getMaxSum(root):
    def solve(node):
        if not node: return (0, 0)
        left = solve(node.left)
        right = solve(node.right)
        include = node.data + left[1] + right[1]
        exclude = max(left[0], left[1]) + max(right[0], right[1])
        return (include, exclude)
    res = solve(root)
    return max(res[0], res[1])`,
    solutionCPP: `int getMaxSum(Node *root) {
    function<pair<int,int>(Node*)> solve = [&](Node* node) {
        if (!node) return make_pair(0, 0);
        auto left = solve(node->left);
        auto right = solve(node->right);
        int include = node->data + left.second + right.second;
        int exclude = max(left.first, left.second) + max(right.first, right.second);
        return make_pair(include, exclude);
    };
    auto res = solve(root);
    return max(res.first, res.second);
}`,
    visualizerSteps: [
      { line: 1, code: "function getMaxSum(root = [1, 2, 3, 4, null, 5, 6]) {", vars: { root: "1" }, log: "Initialize tree [1, 2, 3, 4, null, 5, 6]. Post-order DP state (include, exclude).", arrayState: [{ val: "1 (Root)" }, { val: "2 (L)" }, { val: "3 (R)" }, { val: "4" }, { val: "5" }, { val: "6" }] },
      { line: 6, code: "  include root 1 + leaves [4, 5, 6] = 1 + 4 + 5 + 6 = 16 > exclude root (10);", vars: { includeSum: "16", excludeSum: "10", maxSum: "16" }, log: "Optimal non-adjacent subset includes root 1 and leaves 4, 5, 6. Total max sum = 16.", arrayState: [{ val: "Root 1", match: true }, { val: "Leaf 4", match: true }, { val: "Leaf 5", match: true }, { val: "Leaf 6", match: true }] },
      { line: 10, code: "  return 16; // MAXIMUM SUM NON-ADJACENT NODES COMPLETE", vars: { status: "COMPLETE" }, log: "Maximum sum of Non-adjacent nodes complete!", arrayState: [{ val: "Root 1", match: true }, { val: "Leaf 4", match: true }, { val: "Leaf 5", match: true }, { val: "Leaf 6", match: true }] }
    ]
  },

  // ── 196. POPULATING NEXT RIGHT POINTERS IN EACH NODE II ──
  "populating next right pointers in each node ii": {
    solutionJS: `function connect(root) {
  if (!root) return root;
  let queue = [root];
  while (queue.length) {
    let size = queue.length;
    for (let i = 0; i < size; i++) {
      let node = queue.shift();
      if (i < size - 1) node.next = queue[0];
      else node.next = null;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return root;
}`,
    solutionPY: `def connect(root: 'Node') -> 'Node':
    if not root: return root
    queue = collections.deque([root])
    while queue:
        size = len(queue)
        for i in range(size):
            node = queue.popleft()
            if i < size - 1: node.next = queue[0]
            else: node.next = None
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
    return root`,
    solutionCPP: `Node* connect(Node* root) {
    if (!root) return root;
    queue<Node*> q; q.push(root);
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            Node* node = q.front(); q.pop();
            if (i < size - 1) node->next = q.front();
            else node->next = NULL;
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return root;
}`,
    visualizerSteps: [
      { line: 1, code: "function connect(root = [1, 2, 3, 4, 5, null, 7]) {", vars: { root: "1" }, log: "Initialize non-perfect tree. Level order BFS right sibling pointer linking.", arrayState: [{ val: "1 -> null" }, { val: "2 -> 3 -> null" }, { val: "4 -> 5 -> 7 -> null" }] },
      { line: 6, code: "  L0: 1.next = null; L1: 2.next = 3; L2: 4.next = 5, 5.next = 7;", vars: { level1: "2 -> 3", level2: "4 -> 5 -> 7" }, log: "Link right pointers across non-perfect levels: 2->3, 4->5->7.", arrayState: [{ val: "1 -> null", match: true }, { val: "2 -> 3 -> null", match: true }, { val: "4 -> 5 -> 7 -> null", match: true }] },
      { line: 14, code: "  return root; // POPULATING NEXT RIGHT II COMPLETE", vars: { status: "COMPLETE" }, log: "Populating Next Right Pointers in Each Node II complete!", arrayState: [{ val: "1 -> null", match: true }, { val: "2 -> 3 -> null", match: true }, { val: "4 -> 5 -> 7 -> null", match: true }] }
    ]
  },

  // ── 197. SUM ROOT TO LEAF NUMBERS ──
  "sum root to leaf numbers": {
    solutionJS: `function sumNumbers(root) {
  function dfs(node, currSum) {
    if (!node) return 0;
    currSum = currSum * 10 + node.val;
    if (!node.left && !node.right) return currSum;
    return dfs(node.left, currSum) + dfs(node.right, currSum);
  }
  return dfs(root, 0);
}`,
    solutionPY: `def sumNumbers(root: Optional[TreeNode]) -> int:
    def dfs(node, curr_sum):
        if not node: return 0
        curr_sum = curr_sum * 10 + node.val
        if not node.left and not node.right: return curr_sum
        return dfs(node.left, curr_sum) + dfs(node.right, curr_sum)
    return dfs(root, 0)`,
    solutionCPP: `int sumNumbers(TreeNode* root) {
    function<int(TreeNode*, int)> dfs = [&](TreeNode* node, int currSum) {
        if (!node) return 0;
        currSum = currSum * 10 + node->val;
        if (!node->left && !node->right) return currSum;
        return dfs(node->left, currSum) + dfs(node->right, currSum);
    };
    return dfs(root, 0);
}`,
    visualizerSteps: [
      { line: 1, code: "function sumNumbers(root = [1, 2, 3]) {", vars: { root: "1" }, log: "Initialize tree [1, 2, 3]. Root-to-leaf path digit accumulation.", arrayState: [{ val: "Path 1: 1->2 (12)" }, { val: "Path 2: 1->3 (13)" }] },
      { line: 4, code: "  path 1->2 forms 12; path 1->3 forms 13 -> total sum = 12 + 13 = 25;", vars: { path1: "12", path2: "13", totalSum: "25" }, log: "Root-to-leaf numbers: 12 and 13. Total sum = 12 + 13 = 25.", arrayState: [{ val: "Path 12", match: true }, { val: "Path 13", match: true }, { val: "Total 25", match: true }] },
      { line: 7, code: "  return 25; // SUM ROOT TO LEAF NUMBERS COMPLETE", vars: { status: "COMPLETE" }, log: "Sum Root to Leaf Numbers complete!", arrayState: [{ val: "Path 12", match: true }, { val: "Path 13", match: true }, { val: "Total 25", match: true }] }
    ]
  },

  // ── 198. SUM TREE (CHECK IF A TREE IS A SUM TREE) ──
  "sum tree (check if a tree is a sum tree)": {
    solutionJS: `function isSumTree(root) {
  let isSum = true;
  function sum(node) {
    if (!node) return 0;
    if (!node.left && !node.right) return node.data;
    let leftSum = sum(node.left);
    let rightSum = sum(node.right);
    if (node.data !== leftSum + rightSum) isSum = false;
    return node.data + leftSum + rightSum;
  }
  sum(root);
  return isSum;
}`,
    solutionPY: `def isSumTree(root):
    is_sum = True
    def sum_nodes(node):
        nonlocal is_sum
        if not node: return 0
        if not node.left and not node.right: return node.data
        left_sum = sum_nodes(node.left)
        right_sum = sum_nodes(node.right)
        if node.data != left_sum + right_sum: is_sum = False
        return node.data + left_sum + right_sum
    sum_nodes(root)
    return is_sum`,
    solutionCPP: `bool isSumTree(Node* root) {
    bool isSum = true;
    function<int(Node*)> sum = [&](Node* node) {
        if (!node) return 0;
        if (!node->left && !node->right) return node->data;
        int leftSum = sum(node->left);
        int rightSum = sum(node->right);
        if (node->data != leftSum + rightSum) isSum = false;
        return node->data + leftSum + rightSum;
    };
    sum(root);
    return isSum;
}`,
    visualizerSteps: [
      { line: 1, code: "function isSumTree(root = [26, 10, 3, 4, 6, null, 3]) {", vars: { root: "26" }, log: "Initialize tree [26, 10, 3, 4, 6, null, 3]. Post-order subtree sum verification.", arrayState: [{ val: "26 (Root)" }, { val: "10 (L)" }, { val: "3 (R)" }, { val: "4" }, { val: "6" }, { val: "3" }] },
      { line: 6, code: "  left sub 10 === 4+6 (10); right sub 3 === 3; root 26 === (10+10) + (3+3) = 26;", vars: { leftSum: "10", rightSum: "3", rootSum: "26" }, log: "Subtree sums match: Node 10 = 4+6=10, Node 3 = 3, Root 26 = 20 + 6 = 26. VALID SUM TREE!", arrayState: [{ val: "Node 10 === 4+6", match: true }, { val: "Node 3 === 3", match: true }, { val: "Root 26 === 20+6", match: true }] },
      { line: 11, code: "  return true; // SUM TREE COMPLETE", vars: { isSumTree: "true", status: "COMPLETE" }, log: "Sum Tree check complete!", arrayState: [{ val: "Node 10 === 4+6", match: true }, { val: "Node 3 === 3", match: true }, { val: "Root 26 === 20+6", match: true }] }
    ]
  },

  // ── 199. TOP VIEW OF BINARY TREE ──
  "top view of binary tree": {
    solutionJS: `function topView(root) {
  let res = [];
  if (!root) return res;
  let map = new Map(), queue = [{ node: root, hd: 0 }];
  while (queue.length) {
    let { node, hd } = queue.shift();
    if (!map.has(hd)) map.set(hd, node.data);
    if (node.left) queue.push({ node: node.left, hd: hd - 1 });
    if (node.right) queue.push({ node: node.right, hd: hd + 1 });
  }
  let sortedHds = Array.from(map.keys()).sort((a, b) => a - b);
  for (let hd of sortedHds) res.push(map.get(hd));
  return res;
}`,
    solutionPY: `def topView(root):
    res = []
    if not root: return res
    hd_map = {}
    queue = collections.deque([(root, 0)])
    while queue:
        node, hd = queue.popleft()
        if hd not in hd_map: hd_map[hd] = node.data
        if node.left: queue.append((node.left, hd - 1))
        if node.right: queue.append((node.right, hd + 1))
    for hd in sorted(hd_map.keys()):
        res.append(hd_map[hd])
    return res`,
    solutionCPP: `vector<int> topView(Node *root) {
    vector<int> res;
    if (!root) return res;
    map<int, int> mp;
    queue<pair<Node*, int>> q;
    q.push({root, 0});
    while (!q.empty()) {
        auto [node, hd] = q.front(); q.pop();
        if (mp.find(hd) == mp.end()) mp[hd] = node->data;
        if (node->left) q.push({node->left, hd - 1});
        if (node->right) q.push({node->right, hd + 1});
    }
    for (auto& [hd, val] : mp) res.push_back(val);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function topView(root = [1, 2, 3, 4, 5, 6, 7]) {", vars: { root: "1" }, log: "Initialize tree [1, 2, 3, 4, 5, 6, 7]. BFS horizontal distance first-seen mapping.", arrayState: [{ val: "hd -2: 4" }, { val: "hd -1: 2" }, { val: "hd 0: 1" }, { val: "hd 1: 3" }, { val: "hd 2: 7" }] },
      { line: 6, code: "  first-seen hd map -> hd -2: 4, hd -1: 2, hd 0: 1, hd 1: 3, hd 2: 7;", vars: { topView: "[4, 2, 1, 3, 7]" }, log: "First-seen nodes at horizontal distances: [-2: 4, -1: 2, 0: 1, 1: 3, 2: 7]. Top View = [4, 2, 1, 3, 7].", arrayState: [{ val: "4 (hd -2)", match: true }, { val: "2 (hd -1)", match: true }, { val: "1 (hd 0)", match: true }, { val: "3 (hd 1)", match: true }, { val: "7 (hd 2)", match: true }] },
      { line: 11, code: "  return [4, 2, 1, 3, 7]; // TOP VIEW BINARY TREE COMPLETE", vars: { status: "COMPLETE" }, log: "Top View of Binary Tree complete!", arrayState: [{ val: "4", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "3", match: true }, { val: "7", match: true }] }
    ]
  },

  // ── 200. INSERT A NODE IN A BST ──
  "insert a node in a bst": {
    solutionJS: `function insertIntoBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = insertIntoBST(root.left, val);
  else if (val > root.val) root.right = insertIntoBST(root.right, val);
  return root;
}`,
    solutionPY: `def insertIntoBST(root: Optional[TreeNode], val: int) -> Optional[TreeNode]:
    if not root: return TreeNode(val)
    if val < root.val: root.left = insertIntoBST(root.left, val)
    elif val > root.val: root.right = insertIntoBST(root.right, val)
    return root`,
    solutionCPP: `TreeNode* insertIntoBST(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insertIntoBST(root->left, val);
    else if (val > root->val) root->right = insertIntoBST(root->right, val);
    return root;
}`,
    visualizerSteps: [
      { line: 1, code: "function insertIntoBST(root = [4, 2, 7, 1, 3], val = 5) {", vars: { val: "5", root: "4" }, log: "Initialize BST [4, 2, 7, 1, 3], val = 5. Recursive insertion.", arrayState: [{ val: "4 (Root)" }, { val: "2" }, { val: "7" }, { val: "1" }, { val: "3" }] },
      { line: 4, code: "  5 > 4 -> go right to node 7; 5 < 7 -> insert 5 as left child of 7;", vars: { parent: "7", inserted: "5" }, log: "Compare 5 > 4 (go right to 7). Compare 5 < 7 (insert as left child of 7).", arrayState: [{ val: "4" }, { val: "2" }, { val: "7" }, { val: "1" }, { val: "3" }, { val: "5 (Inserted)", match: true }] },
      { line: 5, code: "  return root; // INSERT NODE IN BST COMPLETE", vars: { status: "COMPLETE" }, log: "Insert a node in a BST complete!", arrayState: [{ val: "4" }, { val: "2" }, { val: "7" }, { val: "1" }, { val: "3" }, { val: "5 (Inserted)", match: true }] }
    ]
  },

  // ── 201. MINIMUM ELEMENT IN BST ──
  "minimum element in bst": {
    solutionJS: `function minValue(root) {
  if (!root) return -1;
  let curr = root;
  while (curr.left) curr = curr.left;
  return curr.data;
}`,
    solutionPY: `def minValue(root):
    if not root: return -1
    curr = root
    while curr.left: curr = curr.left
    return curr.data`,
    solutionCPP: `int minValue(Node* root) {
    if (!root) return -1;
    Node* curr = root;
    while (curr->left) curr = curr->left;
    return curr->data;
}`,
    visualizerSteps: [
      { line: 1, code: "function minValue(root = [5, 4, 6, 3, null, null, 7, 1]) {", vars: { root: "5" }, log: "Initialize BST. Move left until leftmost leaf node reached.", arrayState: [{ val: "5" }, { val: "4" }, { val: "3" }, { val: "1 (Min)" }] },
      { line: 4, code: "  move left: 5 -> 4 -> 3 -> 1; node 1 has no left child -> min value = 1;", vars: { minVal: "1" }, log: "Traverse left pointers down to node 1. Node 1 is the minimum element in BST.", arrayState: [{ val: "1 (Minimum)", match: true }] },
      { line: 5, code: "  return 1; // MINIMUM ELEMENT IN BST COMPLETE", vars: { minElement: "1", status: "COMPLETE" }, log: "Minimum element in BST complete!", arrayState: [{ val: "1 (Minimum)", match: true }] }
    ]
  },

  // ── 202. CONVERT SORTED ARRAY TO BINARY SEARCH TREE ──
  "convert sorted array to binary search tree": {
    solutionJS: `function sortedArrayToBST(nums) {
  function helper(left, right) {
    if (left > right) return null;
    let mid = Math.floor((left + right) / 2);
    let root = new TreeNode(nums[mid]);
    root.left = helper(left, mid - 1);
    root.right = helper(mid + 1, right);
    return root;
  }
  return helper(0, nums.length - 1);
}`,
    solutionPY: `def sortedArrayToBST(nums: List[int]) -> Optional[TreeNode]:
    def helper(left, right):
        if left > right: return None
        mid = (left + right) // 2
        root = TreeNode(nums[mid])
        root.left = helper(left, mid - 1)
        root.right = helper(mid + 1, right)
        return root
    return helper(0, len(nums) - 1)`,
    solutionCPP: `TreeNode* sortedArrayToBST(vector<int>& nums) {
    function<TreeNode*(int, int)> helper = [&](int left, int right) {
        if (left > right) return (TreeNode*)NULL;
        int mid = left + (right - left) / 2;
        TreeNode* root = new TreeNode(nums[mid]);
        root->left = helper(left, mid - 1);
        root->right = helper(mid + 1, right);
        return root;
    };
    return helper(0, nums.size() - 1);
}`,
    visualizerSteps: [
      { line: 1, code: "function sortedArrayToBST(nums = [-10, -3, 0, 5, 9]) {", vars: { nums: "[-10, -3, 0, 5, 9]" }, log: "Initialize sorted array. Divide & Conquer mid element root construction.", arrayState: [{ val: "-10" }, { val: "-3" }, { val: "0 (Mid Root)" }, { val: "5" }, { val: "9" }] },
      { line: 4, code: "  mid = 0 (val 0) -> left sub [-10, -3] (mid -3), right sub [5, 9] (mid 9);", vars: { root: "0", leftSubRoot: "-3", rightSubRoot: "9" }, log: "Mid element 0 becomes root. Left subarray [-10, -3] builds left subtree root -3. Right subarray [5, 9] builds right subtree root 9.", arrayState: [{ val: "0 (Root)", match: true }, { val: "-3 (L)", match: true }, { val: "9 (R)", match: true }, { val: "-10", match: true }, { val: "5", match: true }] },
      { line: 10, code: "  return root; // CONVERT SORTED ARRAY TO BST COMPLETE", vars: { status: "COMPLETE" }, log: "Convert Sorted Array to Binary Search Tree complete!", arrayState: [{ val: "0 (Root)", match: true }, { val: "-3 (L)", match: true }, { val: "9 (R)", match: true }, { val: "-10", match: true }, { val: "5", match: true }] }
    ]
  },

  // ── 203. LOWEST COMMON ANCESTOR OF A BINARY SEARCH TREE ──
  "lowest common ancestor of a binary search tree": {
    solutionJS: `function lowestCommonAncestor(root, p, q) {
  let curr = root;
  while (curr) {
    if (p.val < curr.val && q.val < curr.val) curr = curr.left;
    else if (p.val > curr.val && q.val > curr.val) curr = curr.right;
    else return curr;
  }
  return null;
}`,
    solutionPY: `def lowestCommonAncestor(root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
    curr = root
    while curr:
        if p.val < curr.val and q.val < curr.val: curr = curr.left
        elif p.val > curr.val and q.val > curr.val: curr = curr.right
        else: return curr
    return None`,
    solutionCPP: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    TreeNode* curr = root;
    while (curr) {
        if (p->val < curr->val && q->val < curr->val) curr = curr->left;
        else if (p->val > curr->val && q->val > curr->val) curr = curr->right;
        else return curr;
    }
    return NULL;
}`,
    visualizerSteps: [
      { line: 1, code: "function lowestCommonAncestor(root = 6, p = 2, q = 8) {", vars: { p: "2", q: "8" }, log: "Initialize BST with root = 6, p = 2, q = 8. BST value range traversal.", arrayState: [{ val: "Root: 6" }, { val: "p: 2 (<6)" }, { val: "q: 8 (>6)" }] },
      { line: 5, code: "  p.val (2) < 6 and q.val (8) > 6 -> paths split at root 6 -> LCA = 6;", vars: { lca: "6" }, log: "Compare targets: 2 < 6 (left) and 8 > 6 (right). Paths diverge at node 6. LCA = 6!", arrayState: [{ val: "LCA Node: 6", match: true }, { val: "Target p: 2", match: true }, { val: "Target q: 8", match: true }] },
      { line: 6, code: "  return 6; // LCA OF BST COMPLETE", vars: { status: "COMPLETE" }, log: "Lowest Common Ancestor of a Binary Search Tree complete!", arrayState: [{ val: "LCA Node: 6", match: true }, { val: "Target p: 2", match: true }, { val: "Target q: 8", match: true }] }
    ]
  },

  // ── 204. NORMAL BST TO BALANCED BST ──
  "normal bst to balanced bst": {
    solutionJS: `function buildBalancedTree(root) {
  let nodes = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    nodes.push(node);
    inorder(node.right);
  }
  inorder(root);
  function build(start, end) {
    if (start > end) return null;
    let mid = Math.floor((start + end) / 2);
    let node = nodes[mid];
    node.left = build(start, mid - 1);
    node.right = build(mid + 1, end);
    return node;
  }
  return build(0, nodes.length - 1);
}`,
    solutionPY: `def buildBalancedTree(root):
    nodes = []
    def inorder(node):
        if not node: return
        inorder(node.left)
        nodes.append(node)
        inorder(node.right)
    inorder(root)
    def build(start, end):
        if start > end: return None
        mid = (start + end) // 2
        node = nodes[mid]
        node.left = build(start, mid - 1)
        node.right = build(mid + 1, end)
        return node
    return build(0, len(nodes) - 1)`,
    solutionCPP: `Node* buildBalancedTree(Node* root) {
    vector<Node*> nodes;
    function<void(Node*)> inorder = [&](Node* node) {
        if (!node) return;
        inorder(node->left);
        nodes.push_back(node);
        inorder(node->right);
    };
    inorder(root);
    function<Node*(int, int)> build = [&](int start, int end) {
        if (start > end) return (Node*)NULL;
        int mid = start + (end - start) / 2;
        Node* node = nodes[mid];
        node->left = build(start, mid - 1);
        node->right = build(mid + 1, end);
        return node;
    };
    return build(0, nodes.size() - 1);
}`,
    visualizerSteps: [
      { line: 1, code: "function buildBalancedTree(root = [30, 20, null, 10]) {", vars: { root: "30" }, log: "Initialize skewed BST. Inorder traversal + Divide & Conquer rebalancing.", arrayState: [{ val: "Skewed: [10, 20, 30]" }] },
      { line: 9, code: "  inorder array = [10, 20, 30]; mid = 20 (root) -> left child 10, right child 30;", vars: { root: "20", leftChild: "10", rightChild: "30" }, log: "Rebalance tree: Mid element 20 becomes root. Left child = 10, Right child = 30.", arrayState: [{ val: "20 (Root)", match: true }, { val: "10 (L)", match: true }, { val: "30 (R)", match: true }] },
      { line: 17, code: "  return 20; // NORMAL BST TO BALANCED BST COMPLETE", vars: { status: "COMPLETE" }, log: "Normal BST to Balanced BST complete!", arrayState: [{ val: "20 (Root)", match: true }, { val: "10 (L)", match: true }, { val: "30 (R)", match: true }] }
    ]
  },

  // ── 205. CHECK FOR BST ──
  "check for bst": {
    solutionJS: `function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true;
    if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, null, null);
}`,
    solutionPY: `def isValidBST(root: Optional[TreeNode]) -> bool:
    def validate(node, low=float('-inf'), high=float('inf')):
        if not node: return True
        if node.val <= low or node.val >= high: return False
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
    return validate(root)`,
    solutionCPP: `bool isValidBST(TreeNode* root) {
    function<bool(TreeNode*, long long, long long)> validate = [&](TreeNode* node, long long minVal, long long maxVal) {
        if (!node) return true;
        if (node->val <= minVal || node->val >= maxVal) return false;
        return validate(node->left, minVal, node->val) && validate(node->right, node->val, maxVal);
    };
    return validate(root, LLONG_MIN, LLONG_MAX);
}`,
    visualizerSteps: [
      { line: 1, code: "function isValidBST(root = [2, 1, 3]) {", vars: { root: "2" }, log: "Initialize tree [2, 1, 3]. Recursive range bounds validation (-inf, +inf).", arrayState: [{ val: "2 (Root)" }, { val: "1 (L)" }, { val: "3 (R)" }] },
      { line: 4, code: "  node 2 in (-inf, +inf); left 1 in (-inf, 2) [VALID]; right 3 in (2, +inf) [VALID];", vars: { leftValid: "1 < 2", rightValid: "3 > 2" }, log: "Validate range constraints: Left 1 < 2 (valid), Right 3 > 2 (valid). Tree is a valid BST!", arrayState: [{ val: "Node 2 (Valid)", match: true }, { val: "Left 1 (Valid)", match: true }, { val: "Right 3 (Valid)", match: true }] },
      { line: 6, code: "  return true; // CHECK FOR BST COMPLETE", vars: { isValidBST: "true", status: "COMPLETE" }, log: "Check for BST validation complete!", arrayState: [{ val: "Node 2 (Valid)", match: true }, { val: "Left 1 (Valid)", match: true }, { val: "Right 3 (Valid)", match: true }] }
    ]
  },

  // ── 206. COUNT BST NODES THAT LIE IN A GIVEN RANGE ──
  "count bst nodes that lie in a given range": {
    solutionJS: `function getCount(root, l, h) {
  if (!root) return 0;
  if (root.data >= l && root.data <= h) {
    return 1 + getCount(root.left, l, h) + getCount(root.right, l, h);
  } else if (root.data < l) {
    return getCount(root.right, l, h);
  } else {
    return getCount(root.left, l, h);
  }
}`,
    solutionPY: `def getCount(root, l, h):
    if not root: return 0
    if l <= root.data <= h:
        return 1 + getCount(root.left, l, h) + getCount(root.right, l, h)
    elif root.data < l:
        return getCount(root.right, l, h)
    else:
        return getCount(root.left, l, h)`,
    solutionCPP: `int getCount(Node *root, int l, int h) {
    if (!root) return 0;
    if (root->data >= l && root->data <= h)
        return 1 + getCount(root->left, l, h) + getCount(root->right, l, h);
    else if (root->data < l)
        return getCount(root->right, l, h);
    else
        return getCount(root->left, l, h);
}`,
    visualizerSteps: [
      { line: 1, code: "function getCount(root = [10, 5, 50, 1, 40, 100], l = 5, h = 45) {", vars: { l: "5", h: "45" }, log: "Initialize BST, range [5, 45]. Pruned range search.", arrayState: [{ val: "10 (in range)" }, { val: "5 (in range)" }, { val: "50 (out)" }, { val: "1 (out)" }, { val: "40 (in range)" }] },
      { line: 3, code: "  nodes in range [5, 45]: 10, 5, 40 -> total count = 3;", vars: { count: "3", matchingNodes: "[10, 5, 40]" }, log: "Pruned DFS range check: Nodes 10, 5, and 40 lie inside range [5, 45]. Total = 3.", arrayState: [{ val: "10 (in range)", match: true }, { val: "5 (in range)", match: true }, { val: "40 (in range)", match: true }] },
      { line: 10, code: "  return 3; // COUNT BST NODES IN RANGE COMPLETE", vars: { status: "COMPLETE" }, log: "Count BST nodes that lie in a given range complete!", arrayState: [{ val: "10", match: true }, { val: "5", match: true }, { val: "40", match: true }] }
    ]
  },

  // ── 207. FLATTEN BST TO A SORTED LIST ──
  "flatten bst to a sorted list": {
    solutionJS: `function flattenBST(root) {
  let dummy = new Node(0);
  let prev = dummy;
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    node.left = null;
    prev.right = node;
    prev = node;
    inorder(node.right);
  }
  inorder(root);
  prev.right = null;
  return dummy.right;
}`,
    solutionPY: `def flattenBST(root):
    dummy = Node(0)
    prev = dummy
    def inorder(node):
        nonlocal prev
        if not node: return
        inorder(node.left)
        node.left = None
        prev.right = node
        prev = node
        inorder(node.right)
    inorder(root)
    prev.right = None
    return dummy.right`,
    solutionCPP: `Node* flattenBST(Node* root) {
    Node dummy(0);
    Node* prev = &dummy;
    function<void(Node*)> inorder = [&](Node* node) {
        if (!node) return;
        inorder(node->left);
        node->left = NULL;
        prev->right = node;
        prev = node;
        inorder(node->right);
    };
    inorder(root);
    prev->right = NULL;
    return dummy.right;
}`,
    visualizerSteps: [
      { line: 1, code: "function flattenBST(root = [5, 3, 7, 2, 4, 6, 8]) {", vars: { root: "5" }, log: "Initialize BST. Inorder traversal right pointer linking.", arrayState: [{ val: "Inorder: 2,3,4,5,6,7,8" }] },
      { line: 7, code: "  link right pointers: 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8; set all left = null;", vars: { sortedList: "2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8" }, log: "Inorder traversal links nodes in sorted ascending order: 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8.", arrayState: [{ val: "2 -> 3", match: true }, { val: "3 -> 4", match: true }, { val: "4 -> 5", match: true }, { val: "5 -> 6", match: true }, { val: "6 -> 7", match: true }, { val: "7 -> 8", match: true }] },
      { line: 14, code: "  return dummy.right; // FLATTEN BST TO SORTED LIST COMPLETE", vars: { status: "COMPLETE" }, log: "Flatten BST To A Sorted List complete!", arrayState: [{ val: "2 -> 3", match: true }, { val: "3 -> 4", match: true }, { val: "4 -> 5", match: true }, { val: "5 -> 6", match: true }, { val: "6 -> 7", match: true }, { val: "7 -> 8", match: true }] }
    ]
  },

  // ── 208. KTH SMALLEST ELEMENT IN A BST ──
  "kth smallest element in a bst": {
    solutionJS: `function kthSmallest(root, k) {
  let count = 0, res = -1;
  function inorder(node) {
    if (!node || res !== -1) return;
    inorder(node.left);
    count++;
    if (count === k) { res = node.val; return; }
    inorder(node.right);
  }
  inorder(root);
  return res;
}`,
    solutionPY: `def kthSmallest(root: Optional[TreeNode], k: int) -> int:
    count = 0; res = -1
    def inorder(node):
        nonlocal count, res
        if not node or res != -1: return
        inorder(node.left)
        count += 1
        if count == k: res = node.val; return
        inorder(node.right)
    inorder(root)
    return res`,
    solutionCPP: `int kthSmallest(TreeNode* root, int k) {
    int count = 0, res = -1;
    function<void(TreeNode*)> inorder = [&](TreeNode* node) {
        if (!node || res != -1) return;
        inorder(node->left);
        count++;
        if (count == k) { res = node->val; return; }
        inorder(node->right);
    };
    inorder(root);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function kthSmallest(root = [3, 1, 4, null, 2], k = 1) {", vars: { k: "1", root: "3" }, log: "Initialize BST, k = 1. Inorder traversal (1st element = 1st smallest).", arrayState: [{ val: "Inorder: 1, 2, 3, 4" }] },
      { line: 6, code: "  1st element visited in inorder sequence is 1 -> kth Smallest = 1;", vars: { count: "1", kthSmallest: "1" }, log: "Inorder visit count = 1 (matches k = 1). 1st smallest element = 1.", arrayState: [{ val: "1 (k=1 Smallest)", match: true }, { val: "2" }, { val: "3" }, { val: "4" }] },
      { line: 10, code: "  return 1; // KTH SMALLEST ELEMENT IN BST COMPLETE", vars: { result: "1", status: "COMPLETE" }, log: "Kth Smallest Element in a BST complete!", arrayState: [{ val: "1 (k=1 Smallest)", match: true }, { val: "2" }, { val: "3" }, { val: "4" }] }
    ]
  },

  // ── 209. LARGEST BST IN A BINARY TREE ──
  "largest bst in a binary tree": {
    solutionJS: `function largestBst(root) {
  let maxSize = 0;
  function solve(node) {
    if (!node) return { isBST: true, size: 0, min: Infinity, max: -Infinity };
    let left = solve(node.left);
    let right = solve(node.right);
    if (left.isBST && right.isBST && left.max < node.data && node.data < right.min) {
      let sz = 1 + left.size + right.size;
      maxSize = Math.max(maxSize, sz);
      return {
        isBST: true,
        size: sz,
        min: Math.min(node.data, left.min),
        max: Math.max(node.data, right.max)
      };
    }
    return { isBST: false, size: 0, min: 0, max: 0 };
  }
  solve(root);
  return maxSize;
}`,
    solutionPY: `def largestBst(root):
    max_size = 0
    def solve(node):
        nonlocal max_size
        if not node: return (True, 0, float('inf'), float('-inf'))
        left = solve(node.left)
        right = solve(node.right)
        if left[0] and right[0] and left[3] < node.data < right[2]:
            sz = 1 + left[1] + right[1]
            max_size = max(max_size, sz)
            return (True, sz, min(node.data, left[2]), max(node.data, right[3]))
        return (False, 0, 0, 0)
    solve(root)
    return max_size`,
    solutionCPP: `int largestBst(Node *root) {
    int maxSize = 0;
    struct Info { bool isBST; int size; int minVal; int maxVal; };
    function<Info(Node*)> solve = [&](Node* node) -> Info {
        if (!node) return {true, 0, INT_MAX, INT_MIN};
        auto left = solve(node->left);
        auto right = solve(node->right);
        if (left.isBST && right.isBST && left.maxVal < node->data && node->data < right.minVal) {
            int sz = 1 + left.size + right.size;
            maxSize = max(maxSize, sz);
            return {true, sz, min(node->data, left.minVal), max(node->data, right.maxVal)};
        }
        return {false, 0, 0, 0};
    };
    solve(root);
    return maxSize;
}`,
    visualizerSteps: [
      { line: 1, code: "function largestBst(root = [10, 20, 30, 15, 25]) {", vars: { root: "10" }, log: "Initialize tree. Post-order DFS tracking (isBST, size, min, max).", arrayState: [{ val: "10 (Root)" }, { val: "20 (L)" }, { val: "30 (R)" }, { val: "15" }, { val: "25" }] },
      { line: 8, code: "  subtree at 20 (15, 25) is a valid BST of size 3; root 10 violates BST (25 > 10);", vars: { validSubBSTSize: "3", rootBST: "false" }, log: "Subtree 20 with children 15 and 25 is valid BST of size 3. Root 10 violates BST property. Largest BST size = 3.", arrayState: [{ val: "Subtree 20 (Valid BST)", match: true }, { val: "15", match: true }, { val: "25", match: true }] },
      { line: 17, code: "  return 3; // LARGEST BST IN BINARY TREE COMPLETE", vars: { maxSize: "3", status: "COMPLETE" }, log: "Largest BST in a Binary Tree complete!", arrayState: [{ val: "Subtree 20", match: true }, { val: "15", match: true }, { val: "25", match: true }] }
    ]
  },

  // ── 210. LOWEST COMMON ANCESTOR IN A BST ──
  "lowest common ancestor in a bst": {
    solutionJS: `function LCA(root, n1, n2) {
  let curr = root;
  while (curr) {
    if (n1 < curr.data && n2 < curr.data) curr = curr.left;
    else if (n1 > curr.data && n2 > curr.data) curr = curr.right;
    else return curr;
  }
  return null;
}`,
    solutionPY: `def LCA(root, n1, n2):
    curr = root
    while curr:
        if n1 < curr.data and n2 < curr.data: curr = curr.left
        elif n1 > curr.data and n2 > curr.data: curr = curr.right
        else: return curr
    return None`,
    solutionCPP: `Node* LCA(Node *root, int n1, int n2) {
    Node* curr = root;
    while (curr) {
        if (n1 < curr->data && n2 < curr->data) curr = curr->left;
        else if (n1 > curr->data && n2 > curr->data) curr = curr->right;
        else return curr;
    }
    return NULL;
}`,
    visualizerSteps: [
      { line: 1, code: "function LCA(root = 5, n1 = 1, n2 = 4) {", vars: { n1: "1", n2: "4", root: "5" }, log: "Initialize BST with n1 = 1, n2 = 4. Range-based LCA search.", arrayState: [{ val: "Root: 5" }, { val: "n1: 1" }, { val: "n2: 4" }] },
      { line: 4, code: "  1 < 5 & 4 < 5 -> move left to 2; 1 < 2 & 4 > 2 -> paths split at node 2 -> LCA = 2;", vars: { lca: "2" }, log: "Compare targets with node 5 (move left to 2). At node 2: 1 < 2 (left) and 4 > 2 (right). Paths split at node 2!", arrayState: [{ val: "LCA Node: 2", match: true }, { val: "n1: 1", match: true }, { val: "n2: 4", match: true }] },
      { line: 6, code: "  return 2; // LOWEST COMMON ANCESTOR IN A BST COMPLETE", vars: { status: "COMPLETE" }, log: "Lowest Common Ancestor in a BST complete!", arrayState: [{ val: "LCA Node: 2", match: true }, { val: "n1: 1", match: true }, { val: "n2: 4", match: true }] }
    ]
  },

  // ── 211. PREORDER TO POSTORDER ──
  "preorder to postorder": {
    solutionJS: `function postOrder(pre, size) {
  let idx = 0;
  function construct(min, max) {
    if (idx >= size) return null;
    let val = pre[idx];
    if (val < min || val > max) return null;
    idx++;
    let node = { data: val };
    node.left = construct(min, val);
    node.right = construct(val, max);
    return node;
  }
  let root = construct(-Infinity, Infinity);
  let res = [];
  function post(n) {
    if (!n) return;
    post(n.left);
    post(n.right);
    res.push(n.data);
  }
  post(root);
  return res;
}`,
    solutionPY: `def postOrder(pre, size):
    idx = 0
    def construct(min_val, max_val):
        nonlocal idx
        if idx >= size: return None
        val = pre[idx]
        if val < min_val or val > max_val: return None
        idx += 1
        node = Node(val)
        node.left = construct(min_val, val)
        node.right = construct(val, max_val)
        return node
    root = construct(float('-inf'), float('inf'))
    res = []
    def post(n):
        if not n: return
        post(n.left); post(n.right); res.append(n.data)
    post(root)
    return res`,
    solutionCPP: `Node* constructBST(int pre[], int size) {
    int idx = 0;
    function<Node*(int, int)> construct = [&](int minVal, int maxVal) {
        if (idx >= size) return (Node*)NULL;
        int val = pre[idx];
        if (val < minVal || val > maxVal) return (Node*)NULL;
        idx++;
        Node* node = new Node(val);
        node->left = construct(minVal, val);
        node->right = construct(val, maxVal);
        return node;
    };
    return construct(INT_MIN, INT_MAX);
}`,
    visualizerSteps: [
      { line: 1, code: "function postOrder(pre = [40, 30, 35, 80, 100]) {", vars: { pre: "[40, 30, 35, 80, 100]" }, log: "Initialize preorder array. Upper-bound BST reconstruction + Postorder DFS.", arrayState: [{ val: "Preorder: [40, 30, 35, 80, 100]" }] },
      { line: 17, code: "  reconstructed BST postorder traversal: 35 -> 30 -> 100 -> 80 -> 40;", vars: { postorder: "[35, 30, 100, 80, 40]" }, log: "Reconstructed BST (Root 40, Left 30, Right 80). Postorder = [35, 30, 100, 80, 40].", arrayState: [{ val: "35", match: true }, { val: "30", match: true }, { val: "100", match: true }, { val: "80", match: true }, { val: "40", match: true }] },
      { line: 20, code: "  return [35, 30, 100, 80, 40]; // PREORDER TO POSTORDER COMPLETE", vars: { status: "COMPLETE" }, log: "Preorder to Postorder complete!", arrayState: [{ val: "35", match: true }, { val: "30", match: true }, { val: "100", match: true }, { val: "80", match: true }, { val: "40", match: true }] }
    ]
  },

  // ── 212. VALIDATE BINARY SEARCH TREE ──
  "validate binary search tree": {
    solutionJS: `function isValidBST(root) {
  function validate(node, min, max) {
    if (!node) return true;
    if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, null, null);
}`,
    solutionPY: `def isValidBST(root: Optional[TreeNode]) -> bool:
    def validate(node, low=float('-inf'), high=float('inf')):
        if not node: return True
        if node.val <= low or node.val >= high: return False
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
    return validate(root)`,
    solutionCPP: `bool isValidBST(TreeNode* root) {
    function<bool(TreeNode*, long long, long long)> validate = [&](TreeNode* node, long long minVal, long long maxVal) {
        if (!node) return true;
        if (node->val <= minVal || node->val >= maxVal) return false;
        return validate(node->left, minVal, node->val) && validate(node->right, node->val, maxVal);
    };
    return validate(root, LLONG_MIN, LLONG_MAX);
}`,
    visualizerSteps: [
      { line: 1, code: "function isValidBST(root = [5, 1, 4, null, null, 3, 6]) {", vars: { root: "5" }, log: "Initialize tree [5, 1, 4, null, null, 3, 6]. Range bound validation.", arrayState: [{ val: "5 (Root)" }, { val: "1 (L)" }, { val: "4 (R: Invalid)" }] },
      { line: 4, code: "  node 4 at right of 5 must be > 5, but 4 <= 5 -> INVALID BST;", vars: { root: "5", rightChild: "4", violation: "4 <= 5" }, log: "Right child 4 is smaller than root 5 (violates BST property). Tree is invalid!", arrayState: [{ val: "5", match: true }, { val: "1", match: true }, { val: "4 (Violation)", match: true }] },
      { line: 5, code: "  return false; // VALIDATE BST COMPLETE", vars: { isValidBST: "false", status: "COMPLETE" }, log: "Validate Binary Search Tree complete! Return false.", arrayState: [{ val: "5", match: true }, { val: "1", match: true }, { val: "4 (Violation)", match: true }] }
    ]
  },

  // ── 213. DESIGN ADD AND SEARCH WORDS DATA STRUCTURE ──
  "design add and search words data structure": {
    solutionJS: `class WordDictionary {
  constructor() {
    this.trie = {};
  }
  addWord(word) {
    let curr = this.trie;
    for (let char of word) {
      if (!curr[char]) curr[char] = {};
      curr = curr[char];
    }
    curr.isEnd = true;
  }
  search(word) {
    function dfs(curr, idx) {
      if (idx === word.length) return !!curr.isEnd;
      let char = word[idx];
      if (char === '.') {
        for (let child in curr) {
          if (child !== 'isEnd' && dfs(curr[child], idx + 1)) return true;
        }
        return false;
      }
      return curr[char] ? dfs(curr[char], idx + 1) : false;
    }
    return dfs(this.trie, 0);
  }
}`,
    solutionPY: `class WordDictionary:
    def __init__(self):
        this.trie = {}
    def addWord(self, word: str) -> None:
        curr = self.trie
        for char in word:
            if char not in curr: curr[char] = {}
            curr = curr[char]
        curr['$'] = True
    def search(self, word: str) -> bool:
        def dfs(curr, idx):
            if idx == len(word): return '$' in curr
            char = word[idx]
            if char == '.':
                return any(dfs(curr[child], idx + 1) for child in curr if child != '$')
            return dfs(curr[char], idx + 1) if char in curr else False
        return dfs(self.trie, 0)`,
    solutionCPP: `class WordDictionary {
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        bool isEnd = false;
    };
    TrieNode* root;
public:
    WordDictionary() { root = new TrieNode(); }
    void addWord(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) curr->children[c] = new TrieNode();
            curr = curr->children[c];
        }
        curr->isEnd = true;
    }
    bool search(string word) {
        function<bool(TrieNode*, int)> dfs = [&](TrieNode* curr, int idx) {
            if (idx == word.length()) return curr->isEnd;
            char c = word[idx];
            if (c == '.') {
                for (auto& [ch, child] : curr->children) {
                    if (dfs(child, idx + 1)) return true;
                }
                return false;
            }
            return curr->children.count(c) ? dfs(curr->children[c], idx + 1) : false;
        };
        return dfs(root, 0);
    }
};`,
    visualizerSteps: [
      { line: 1, code: "let dict = new WordDictionary(); dict.addWord('bad'); dict.addWord('dad'); dict.addWord('mad');", vars: { words: "['bad', 'dad', 'mad']" }, log: "Initialize Trie. Add words 'bad', 'dad', 'mad'.", arrayState: [{ val: "b->a->d" }, { val: "d->a->d" }, { val: "m->a->d" }] },
      { line: 13, code: "  dict.search('pad') -> false; dict.search('.ad') -> true (matches b, d, m); dict.search('b..') -> true;", vars: { searchPad: "false", searchDotAd: "true", searchBDotDot: "true" }, log: "Search query '.ad' matches wildcard '.' against 'b', 'd', and 'm'. Found matching word! Return true.", arrayState: [{ val: "search('.ad') -> true", match: true }, { val: "search('b..') -> true", match: true }] },
      { line: 24, code: "  // DESIGN ADD AND SEARCH WORDS DATA STRUCTURE COMPLETE", vars: { status: "COMPLETE" }, log: "Design Add and Search Words Data Structure complete!", arrayState: [{ val: "Trie Wildcard Search Complete", match: true }] }
    ]
  },

  // ── 214. IMPLEMENT TRIE (PREFIX TREE) ──
  "implement trie (prefix tree)": {
    solutionJS: `class Trie {
  constructor() {
    this.root = {};
  }
  insert(word) {
    let curr = this.root;
    for (let char of word) {
      if (!curr[char]) curr[char] = {};
      curr = curr[char];
    }
    curr.isEnd = true;
  }
  search(word) {
    let curr = this.root;
    for (let char of word) {
      if (!curr[char]) return false;
      curr = curr[char];
    }
    return !!curr.isEnd;
  }
  startsWith(prefix) {
    let curr = this.root;
    for (let char of prefix) {
      if (!curr[char]) return false;
      curr = curr[char];
    }
    return true;
  }
}`,
    solutionPY: `class Trie:
    def __init__(self):
        self.root = {}
    def insert(self, word: str) -> None:
        curr = self.root
        for char in word:
            if char not in curr: curr[char] = {}
            curr = curr[char]
        curr['$'] = True
    def search(self, word: str) -> bool:
        curr = self.root
        for char in word:
            if char not in curr: return False
            curr = curr[char]
        return '$' in curr
    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for char in prefix:
            if char not in curr: return False
            curr = curr[char]
        return True`,
    solutionCPP: `class Trie {
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        bool isEnd = false;
    };
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    void insert(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) curr->children[c] = new TrieNode();
            curr = curr->children[c];
        }
        curr->isEnd = true;
    }
    bool search(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) return false;
            curr = curr->children[c];
        }
        return curr->isEnd;
    }
    bool startsWith(string prefix) {
        TrieNode* curr = root;
        for (char c : prefix) {
            if (!curr->children.count(c)) return false;
            curr = curr->children[c];
        }
        return true;
    }
};`,
    visualizerSteps: [
      { line: 1, code: "let trie = new Trie(); trie.insert('apple'); trie.search('apple'); trie.search('app'); trie.startsWith('app');", vars: { word: "'apple'" }, log: "Initialize Trie. Insert 'apple'. Search 'apple' -> true, Search 'app' -> false, startsWith 'app' -> true.", arrayState: [{ val: "a->p->p->l->e (isEnd:true)" }, { val: "search('apple'): true" }, { val: "search('app'): false" }, { val: "startsWith('app'): true" }] },
      { line: 6, code: "  trie.insert('app'); trie.search('app'); // returns true;", vars: { searchApp: "true" }, log: "Insert 'app' -> Set isEnd at second 'p' to true. search('app') now returns true!", arrayState: [{ val: "a->p->p (isEnd:true)", match: true }, { val: "a->p->p->l->e (isEnd:true)", match: true }] },
      { line: 20, code: "  // IMPLEMENT TRIE COMPLETE", vars: { status: "COMPLETE" }, log: "Implement Trie (Prefix Tree) complete!", arrayState: [{ val: "Trie Insertion & Search Verified", match: true }] }
    ]
  },

  // ── 215. KTH LARGEST ELEMENT IN A STREAM ──
  "kth largest element in a stream": {
    solutionJS: `class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.heap = [];
    for (let num of nums) this.add(num);
  }
  add(val) {
    this.heap.push(val);
    this.heap.sort((a, b) => a - b);
    if (this.heap.length > this.k) this.heap.shift();
    return this.heap[0];
  }
}`,
    solutionPY: `class KthLargest:
    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.heap = nums
        heapq.heapify(self.heap)
        while len(self.heap) > k: heapq.heappop(self.heap)
    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k: heapq.heappop(self.heap)
        return self.heap[0]`,
    solutionCPP: `class KthLargest {
    int k;
    priority_queue<int, vector<int>, greater<int>> minHeap;
public:
    KthLargest(int k, vector<int>& nums) {
        this->k = k;
        for (int num : nums) add(num);
    }
    int add(int val) {
        minHeap.push(val);
        if (minHeap.size() > k) minHeap.pop();
        return minHeap.top();
    }
};`,
    visualizerSteps: [
      { line: 1, code: "let kth = new KthLargest(3, [4, 5, 8, 2]);", vars: { k: "3", heap: "[4, 5, 8]" }, log: "Initialize Min-Heap of size 3 for initial stream [4, 5, 8, 2]. Heap = [4, 5, 8].", arrayState: [{ val: "Heap: [4, 5, 8]" }, { val: "3rd Largest: 4" }] },
      { line: 7, code: "  kth.add(3) -> 4; kth.add(5) -> 5; kth.add(10) -> 5;", vars: { add3: "4", add5: "5", add10: "5" }, log: "Add 3 (3rd largest = 4). Add 5 (Heap = [5, 5, 8], 3rd largest = 5). Add 10 (Heap = [5, 8, 10], 3rd largest = 5).", arrayState: [{ val: "Add(3) -> 4", match: true }, { val: "Add(5) -> 5", match: true }, { val: "Add(10) -> 5", match: true }] },
      { line: 11, code: "  return 5; // KTH LARGEST IN A STREAM COMPLETE", vars: { status: "COMPLETE" }, log: "Kth Largest Element in a Stream complete!", arrayState: [{ val: "Heap: [5, 8, 10]", match: true }] }
    ]
  },

  // ── 216. LAST STONE WEIGHT ──
  "last stone weight": {
    solutionJS: `function lastStoneWeight(stones) {
  stones.sort((a, b) => a - b);
  while (stones.length > 1) {
    let y = stones.pop();
    let x = stones.pop();
    if (x !== y) {
      stones.push(y - x);
      stones.sort((a, b) => a - b);
    }
  }
  return stones.length === 1 ? stones[0] : 0;
}`,
    solutionPY: `def lastStoneWeight(stones: List[int]) -> int:
    heap = [-s for s in stones]
    heapq.heapify(heap)
    while len(heap) > 1:
        y = -heapq.heappop(heap)
        x = -heapq.heappop(heap)
        if x != y:
            heapq.heappush(heap, -(y - x))
    return -heap[0] if heap else 0`,
    solutionCPP: `int lastStoneWeight(vector<int>& stones) {
    priority_queue<int> pq(stones.begin(), stones.end());
    while (pq.size() > 1) {
        int y = pq.top(); pq.pop();
        int x = pq.top(); pq.pop();
        if (x != y) pq.push(y - x);
    }
    return pq.empty() ? 0 : pq.top();
}`,
    visualizerSteps: [
      { line: 1, code: "function lastStoneWeight(stones = [2, 7, 4, 1, 8, 1]) {", vars: { stones: "[2, 7, 4, 1, 8, 1]" }, log: "Initialize max-heap of stone weights [2, 7, 4, 1, 8, 1].", arrayState: [{ val: "8" }, { val: "7" }, { val: "4" }, { val: "2" }, { val: "1" }, { val: "1" }] },
      { line: 4, code: "  smash 8 & 7 -> diff 1; smash 4 & 2 -> diff 2; smash 2 & 1 -> diff 1; smash 1 & 1 -> 0; remaining stone = 1;", vars: { step1: "8-7=1", step2: "4-2=2", step3: "2-1=1", step4: "1-1=0" }, log: "Smash heaviest stones step-by-step: (8,7)->1, (4,2)->2, (2,1)->1, (1,1)->0. Last remaining stone weight = 1.", arrayState: [{ val: "Smashed (8, 7) -> 1", match: true }, { val: "Smashed (4, 2) -> 2", match: true }, { val: "Last Stone: 1", match: true }] },
      { line: 11, code: "  return 1; // LAST STONE WEIGHT COMPLETE", vars: { lastWeight: "1", status: "COMPLETE" }, log: "Last Stone Weight complete!", arrayState: [{ val: "Last Stone: 1", match: true }] }
    ]
  },

  // ── 217. DESIGN TWITTER ──
  "design twitter": {
    solutionJS: `class Twitter {
  constructor() {
    this.time = 0;
    this.tweets = new Map();
    this.follows = new Map();
  }
  postTweet(userId, tweetId) {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId).push({ time: this.time++, id: tweetId });
  }
  getNewsFeed(userId) {
    let set = this.follows.get(userId) || new Set();
    set.add(userId);
    let all = [];
    for (let u of set) {
      let list = this.tweets.get(u) || [];
      all.push(...list);
    }
    all.sort((a, b) => b.time - a.time);
    return all.slice(0, 10).map(t => t.id);
  }
  follow(followerId, followeeId) {
    if (!this.follows.has(followerId)) this.follows.set(followerId, new Set());
    this.follows.get(followerId).add(followeeId);
  }
  unfollow(followerId, followeeId) {
    if (this.follows.has(followerId)) this.follows.get(followerId).delete(followeeId);
  }
}`,
    solutionPY: `class Twitter:
    def __init__(self):
        self.count = 0
        self.tweet_map = defaultdict(list)
        self.follow_map = defaultdict(set)
    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweet_map[userId].append((self.count, tweetId))
        self.count -= 1
    def getNewsFeed(self, userId: int) -> List[int]:
        res = []
        min_heap = []
        self.follow_map[userId].add(userId)
        for followee_id in self.follow_map[userId]:
            if followee_id in self.tweet_map:
                index = len(self.tweet_map[followee_id]) - 1
                count, tweet_id = self.tweet_map[followee_id][index]
                min_heap.append((count, tweet_id, followee_id, index - 1))
        heapq.heapify(min_heap)
        while min_heap and len(res) < 10:
            count, tweet_id, followee_id, index = heapq.heappop(min_heap)
            res.append(tweet_id)
            if index >= 0:
                count, tweet_id = self.tweet_map[followee_id][index]
                heapq.heappush(min_heap, (count, tweet_id, followee_id, index - 1))
        return res
    def follow(self, followerId: int, followeeId: int) -> None:
        self.follow_map[followerId].add(followeeId)
    def unfollow(self, followerId: int, followeeId: int) -> None:
        if followeeId in self.follow_map[followerId]:
            self.follow_map[followerId].remove(followeeId)`,
    solutionCPP: `class Twitter {
    int time = 0;
    unordered_map<int, vector<pair<int, int>>> tweets;
    unordered_map<int, unordered_set<int>> follows;
public:
    Twitter() {}
    void postTweet(int userId, int tweetId) {
        tweets[userId].push_back({time++, tweetId});
    }
    vector<int> getNewsFeed(int userId) {
        follows[userId].insert(userId);
        vector<pair<int, int>> all;
        for (int u : follows[userId]) {
            for (auto& t : tweets[u]) all.push_back(t);
        }
        sort(all.rbegin(), all.rend());
        vector<int> res;
        for (int i = 0; i < min((int)all.size(), 10); i++) res.push_back(all[i].second);
        return res;
    }
    void follow(int followerId, int followeeId) {
        follows[followerId].insert(followeeId);
    }
    void unfollow(int followerId, int followeeId) {
        follows[followerId].erase(followeeId);
    }
};`,
    visualizerSteps: [
      { line: 1, code: "let tw = new Twitter(); tw.postTweet(1, 5); tw.getNewsFeed(1);", vars: { newsFeed: "[5]" }, log: "User 1 posts tweet 5. News feed for User 1 returns [5].", arrayState: [{ val: "User 1: [5]" }] },
      { line: 8, code: "  tw.follow(1, 2); tw.postTweet(2, 6); tw.getNewsFeed(1);", vars: { newsFeed: "[6, 5]" }, log: "User 1 follows User 2. User 2 posts tweet 6. News feed for User 1 returns [6, 5] (timestamp ordered).", arrayState: [{ val: "User 1: [5]" }, { val: "User 2: [6]" }, { val: "Feed: [6, 5]", match: true }] },
      { line: 20, code: "  tw.unfollow(1, 2); tw.getNewsFeed(1); // returns [5]", vars: { newsFeed: "[5]" }, log: "User 1 unfollows User 2. News feed returns [5]. Design Twitter complete!", arrayState: [{ val: "User 1 Feed: [5]", match: true }] }
    ]
  },

  // ── 218. K CLOSEST POINTS TO ORIGIN ──
  "k closest points to origin": {
    solutionJS: `function kClosest(points, k) {
  points.sort((a, b) => (a[0]*a[0] + a[1]*a[1]) - (b[0]*b[0] + b[1]*b[1]));
  return points.slice(0, k);
}`,
    solutionPY: `def kClosest(points: List[List[int]], k: int) -> List[List[int]]:
    heap = [(-(x**2 + y**2), [x, y]) for x, y in points[:k]]
    heapq.heapify(heap)
    for x, y in points[k:]:
        dist = -(x**2 + y**2)
        if dist > heap[0][0]:
            heapq.heappushpop(heap, (dist, [x, y]))
    return [pt for d, pt in heap]`,
    solutionCPP: `vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    priority_queue<pair<int, vector<int>>> maxHeap;
    for (auto& p : points) {
        int dist = p[0]*p[0] + p[1]*p[1];
        maxHeap.push({dist, p});
        if (maxHeap.size() > k) maxHeap.pop();
    }
    vector<vector<int>> res;
    while (!maxHeap.empty()) {
        res.push_back(maxHeap.top().second);
        maxHeap.pop();
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function kClosest(points = [[1,3], [-2,2]], k = 1) {", vars: { points: "[[1,3], [-2,2]]", k: "1" }, log: "Initialize points. Euclidean distance squared calculation: (1,3)->10, (-2,2)->8.", arrayState: [{ val: "(1,3) dist: 10" }, { val: "(-2,2) dist: 8" }] },
      { line: 2, code: "  compare dist: 8 < 10 -> point [-2, 2] is closest to origin (0,0);", vars: { closestPoint: "[-2, 2]", minDist: "8" }, log: "Compare squared distances: (-2,2) distance 8 < (1,3) distance 10. Closest point = [-2, 2].", arrayState: [{ val: "[-2, 2] (Dist: 8)", match: true }, { val: "[1, 3] (Dist: 10)" }] },
      { line: 3, code: "  return [[-2, 2]]; // K CLOSEST POINTS TO ORIGIN COMPLETE", vars: { result: "[[-2, 2]]", status: "COMPLETE" }, log: "K Closest Points to Origin complete!", arrayState: [{ val: "[-2, 2]", match: true }] }
    ]
  },

  // ── 219. KTH LARGEST ELEMENT IN AN ARRAY ──
  "kth largest element in an array": {
    solutionJS: `function findKthLargest(nums, k) {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`,
    solutionPY: `def findKthLargest(nums: List[int], k: int) -> int:
    return heapq.nlargest(k, nums)[-1]`,
    solutionCPP: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int num : nums) {
        minHeap.push(num);
        if (minHeap.size() > k) minHeap.pop();
    }
    return minHeap.top();
}`,
    visualizerSteps: [
      { line: 1, code: "function findKthLargest(nums = [3, 2, 1, 5, 6, 4], k = 2) {", vars: { nums: "[3, 2, 1, 5, 6, 4]", k: "2" }, log: "Initialize nums, k = 2. Min-Heap of size 2 tracking k largest elements.", arrayState: [{ val: "3" }, { val: "2" }, { val: "1" }, { val: "5" }, { val: "6" }, { val: "4" }] },
      { line: 3, code: "  min-heap of size 2 = [5, 6] -> top of heap = 5 (2nd largest element);", vars: { minHeap: "[5, 6]", kthLargest: "5" }, log: "Maintain min-heap of top 2 largest elements: [5, 6]. Heap top is 5. 2nd largest element = 5.", arrayState: [{ val: "5 (2nd Largest)", match: true }, { val: "6 (1st Largest)", match: true }] },
      { line: 4, code: "  return 5; // KTH LARGEST ELEMENT IN AN ARRAY COMPLETE", vars: { result: "5", status: "COMPLETE" }, log: "Kth Largest Element in an Array complete!", arrayState: [{ val: "5", match: true }, { val: "6", match: true }] }
    ]
  },

  // ── 220. TASK SCHEDULER ──
  "task scheduler": {
    solutionJS: `function leastInterval(tasks, n) {
  let freq = new Array(26).fill(0);
  for (let t of tasks) freq[t.charCodeAt(0) - 65]++;
  freq.sort((a, b) => b - a);
  let maxFreq = freq[0];
  let idleTime = (maxFreq - 1) * n;
  for (let i = 1; i < 26 && freq[i] > 0; i++) {
    idleTime -= Math.min(maxFreq - 1, freq[i]);
  }
  idleTime = Math.max(0, idleTime);
  return tasks.length + idleTime;
}`,
    solutionPY: `def leastInterval(tasks: List[str], n: int) -> int:
    count = collections.Counter(tasks)
    max_freq = max(count.values())
    max_freq_count = list(count.values()).count(max_freq)
    return max(len(tasks), (max_freq - 1) * (n + 1) + max_freq_count)`,
    solutionCPP: `int leastInterval(vector<char>& tasks, int n) {
    unordered_map<char, int> count;
    int maxFreq = 0;
    for (char t : tasks) { count[t]++; maxFreq = max(maxFreq, count[t]); }
    int ans = (maxFreq - 1) * (n + 1);
    for (auto& p : count) { if (p.second == maxFreq) ans++; }
    return max((int)tasks.size(), ans);
}`,
    visualizerSteps: [
      { line: 1, code: "function leastInterval(tasks = ['A','A','A','B','B','B'], n = 2) {", vars: { n: "2", tasks: "['A','A','A','B','B','B']" }, log: "Initialize tasks with n = 2 cooling period. Frequency greedy scheduling.", arrayState: [{ val: "A: 3" }, { val: "B: 3" }] },
      { line: 8, code: "  frame (A _ _ A _ _ A) -> fill B (A B _ A B _ A B) -> 8 total CPU intervals;", vars: { schedule: "A B idle A B idle A B", intervals: "8" }, log: "Schedule tasks with cooling period n=2: A -> B -> idle -> A -> B -> idle -> A -> B. Total = 8 intervals.", arrayState: [{ val: "A->B->idle->A->B->idle->A->B", match: true }] },
      { line: 10, code: "  return 8; // TASK SCHEDULER COMPLETE", vars: { status: "COMPLETE" }, log: "Task Scheduler complete!", arrayState: [{ val: "8 CPU Intervals", match: true }] }
    ]
  },

  // ── 221. COMBINATION SUM II ──
  "combination sum ii": {
    solutionJS: `function combinationSum2(candidates, target) {
  candidates.sort((a, b) => a - b);
  let res = [];
  function backtrack(start, remain, path) {
    if (remain === 0) { res.push([...path]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remain) break;
      if (i > start && candidates[i] === candidates[i - 1]) continue;
      path.push(candidates[i]);
      backtrack(i + 1, remain - candidates[i], path);
      path.pop();
    }
  }
  backtrack(0, target, []);
  return res;
}`,
    solutionPY: `def combinationSum2(candidates: List[int], target: int) -> List[List[int]]:
    candidates.sort()
    res = []
    def backtrack(start, remain, path):
        if remain == 0: res.append(list(path)); return
        for i in range(start, len(candidates)):
            if candidates[i] > remain: break
            if i > start and candidates[i] == candidates[i - 1]: continue
            path.append(candidates[i])
            backtrack(i + 1, remain - candidates[i], path)
            path.pop()
    backtrack(0, target, [])
    return res`,
    solutionCPP: `vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
    sort(candidates.begin(), candidates.end());
    vector<vector<int>> res; vector<int> path;
    function<void(int, int)> backtrack = [&](int start, int remain) {
        if (remain == 0) { res.push_back(path); return; }
        for (int i = start; i < candidates.size(); i++) {
            if (candidates[i] > remain) break;
            if (i > start && candidates[i] == candidates[i - 1]) continue;
            path.push_back(candidates[i]);
            backtrack(i + 1, remain - candidates[i]);
            path.pop_back();
        }
    };
    backtrack(0, target);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function combinationSum2(candidates = [10,1,2,7,6,1,5], target = 8) {", vars: { target: "8", sorted: "[1,1,2,5,6,7,10]" }, log: "Sort candidates [1, 1, 2, 5, 6, 7, 10]. Backtracking DFS with duplicate skipping.", arrayState: [{ val: "[1, 1, 6]" }, { val: "[1, 2, 5]" }, { val: "[1, 7]" }, { val: "[2, 6]" }] },
      { line: 6, code: "  unique combinations summing to 8: [1,1,6], [1,2,5], [1,7], [2,6];", vars: { combinations: "[[1,1,6], [1,2,5], [1,7], [2,6]]" }, log: "Found 4 unique combinations: [1, 1, 6], [1, 2, 5], [1, 7], [2, 6]. All duplicates skipped.", arrayState: [{ val: "[1, 1, 6]", match: true }, { val: "[1, 2, 5]", match: true }, { val: "[1, 7]", match: true }, { val: "[2, 6]", match: true }] },
      { line: 15, code: "  return res; // COMBINATION SUM II COMPLETE", vars: { status: "COMPLETE" }, log: "Combination Sum II complete!", arrayState: [{ val: "[1, 1, 6]", match: true }, { val: "[1, 2, 5]", match: true }, { val: "[1, 7]", match: true }, { val: "[2, 6]", match: true }] }
    ]
  },

  // ── 222. COMBINATIONS ──
  "combinations": {
    solutionJS: `function combine(n, k) {
  let res = [];
  function backtrack(start, path) {
    if (path.length === k) { res.push([...path]); return; }
    for (let i = start; i <= n; i++) {
      path.push(i);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(1, []);
  return res;
}`,
    solutionPY: `def combine(n: int, k: int) -> List[List[int]]:
    res = []
    def backtrack(start, path):
        if len(path) == k: res.append(list(path)); return
        for i in range(start, n + 1):
            path.append(i)
            backtrack(i + 1, path)
            path.pop()
    backtrack(1, [])
    return res`,
    solutionCPP: `vector<vector<int>> combine(int n, int k) {
    vector<vector<int>> res; vector<int> path;
    function<void(int)> backtrack = [&](int start) {
        if (path.size() == k) { res.push_back(path); return; }
        for (int i = start; i <= n; i++) {
            path.push_back(i);
            backtrack(i + 1);
            path.pop_back();
        }
    };
    backtrack(1);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function combine(n = 4, k = 2) {", vars: { n: "4", k: "2" }, log: "Initialize range 1..4, k = 2. Backtracking combinations generator.", arrayState: [{ val: "[1, 2]" }, { val: "[1, 3]" }, { val: "[1, 4]" }, { val: "[2, 3]" }, { val: "[2, 4]" }, { val: "[3, 4]" }] },
      { line: 5, code: "  combinations of size 2 from 1..4: [1,2], [1,3], [1,4], [2,3], [2,4], [3,4];", vars: { combinations: "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]" }, log: "Generated 6 unique 2-combinations from range 1..4.", arrayState: [{ val: "[1, 2]", match: true }, { val: "[1, 3]", match: true }, { val: "[1, 4]", match: true }, { val: "[2, 3]", match: true }, { val: "[2, 4]", match: true }, { val: "[3, 4]", match: true }] },
      { line: 11, code: "  return res; // COMBINATIONS COMPLETE", vars: { status: "COMPLETE" }, log: "Combinations complete!", arrayState: [{ val: "6 Combinations Generated", match: true }] }
    ]
  },

  // ── 223. LETTER COMBINATIONS OF A PHONE NUMBER ──
  "letter combinations of a phone number": {
    solutionJS: `function letterCombinations(digits) {
  if (!digits.length) return [];
  let map = {
    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
  };
  let res = [];
  function backtrack(idx, path) {
    if (idx === digits.length) { res.push(path); return; }
    let letters = map[digits[idx]];
    for (let char of letters) {
      backtrack(idx + 1, path + char);
    }
  }
  backtrack(0, '');
  return res;
}`,
    solutionPY: `def letterCombinations(digits: str) -> List[str]:
    if not digits: return []
    phone = {'2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
             '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'}
    res = []
    def backtrack(idx, path):
        if idx == len(digits): res.append(path); return
        for char in phone[digits[idx]]:
            backtrack(idx + 1, path + char)
    backtrack(0, "")
    return res`,
    solutionCPP: `vector<string> letterCombinations(string digits) {
    if (digits.empty()) return {};
    unordered_map<char, string> phone = {
        {'2',"abc"}, {'3',"def"}, {'4',"ghi"}, {'5',"jkl"},
        {'6',"mno"}, {'7',"pqrs"}, {'8',"tuv"}, {'9',"wxyz"}
    };
    vector<string> res;
    function<void(int, string)> backtrack = [&](int idx, string path) {
        if (idx == digits.length()) { res.push_back(path); return; }
        for (char c : phone[digits[idx]]) backtrack(idx + 1, path + c);
    };
    backtrack(0, "");
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function letterCombinations(digits = '23') {", vars: { digits: "'23'", map2: "'abc'", map3: "'def'" }, log: "Initialize digits '23'. Digit mapping: 2 -> 'abc', 3 -> 'def'.", arrayState: [{ val: "'ad'" }, { val: "'ae'" }, { val: "'af'" }, { val: "'bd'" }, { val: "'be'" }, { val: "'bf'" }, { val: "'cd'" }, { val: "'ce'" }, { val: "'cf'" }] },
      { line: 10, code: "  letter combinations for '23': ['ad','ae','af','bd','be','bf','cd','ce','cf'];", vars: { combos: "['ad','ae','af','bd','be','bf','cd','ce','cf']" }, log: "Backtracking builds all 9 letter combinations: ['ad','ae','af','bd','be','bf','cd','ce','cf'].", arrayState: [{ val: "'ad'", match: true }, { val: "'ae'", match: true }, { val: "'af'", match: true }, { val: "'bd'", match: true }, { val: "'be'", match: true }, { val: "'bf'", match: true }, { val: "'cd'", match: true }, { val: "'ce'", match: true }, { val: "'cf'", match: true }] },
      { line: 16, code: "  return res; // LETTER COMBINATIONS COMPLETE", vars: { status: "COMPLETE" }, log: "Letter Combinations of a Phone Number complete!", arrayState: [{ val: "9 Phone Letter Combinations", match: true }] }
    ]
  },

  // ── 224. PALINDROME PARTITIONING ──
  "palindrome partitioning": {
    solutionJS: `function partition(s) {
  let res = [];
  function isPalindrome(str, l, r) {
    while (l < r) {
      if (str[l++] !== str[r--]) return false;
    }
    return true;
  }
  function backtrack(start, path) {
    if (start === s.length) { res.push([...path]); return; }
    for (let end = start; end < s.length; end++) {
      if (isPalindrome(s, start, end)) {
        path.push(s.slice(start, end + 1));
        backtrack(end + 1, path);
        path.pop();
      }
    }
  }
  backtrack(0, []);
  return res;
}`,
    solutionPY: `def partition(s: str) -> List[List[str]]:
    res = []
    def is_palindrome(l, r):
        while l < r:
            if s[l] != s[r]: return False
            l += 1; r -= 1
        return True
    def backtrack(start, path):
        if start == len(s): res.append(list(path)); return
        for end in range(start, len(s)):
            if is_palindrome(start, end):
                path.append(s[start:end+1])
                backtrack(end + 1, path)
                path.pop()
    backtrack(0, [])
    return res`,
    solutionCPP: `vector<vector<string>> partition(string s) {
    vector<vector<string>> res; vector<string> path;
    auto isPalindrome = [&](int l, int r) {
        while (l < r) { if (s[l++] != s[r--]) return false; }
        return true;
    };
    function<void(int)> backtrack = [&](int start) {
        if (start == s.length()) { res.push_back(path); return; }
        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(start, end)) {
                path.push_back(s.substr(start, end - start + 1));
                backtrack(end + 1);
                path.pop_back();
            }
        }
    };
    backtrack(0);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function partition(s = 'aab') {", vars: { s: "'aab'" }, log: "Initialize s = 'aab'. Backtracking DFS palindrome substring partitioning.", arrayState: [{ val: "['a', 'a', 'b']" }, { val: "['aa', 'b']" }] },
      { line: 9, code: "  valid palindrome partitions: ['a','a','b'] and ['aa','b'];", vars: { partitions: "[['a','a','b'], ['aa','b']]" }, log: "Found 2 valid palindrome partitions: ['a', 'a', 'b'] and ['aa', 'b'].", arrayState: [{ val: "['a', 'a', 'b']", match: true }, { val: "['aa', 'b']", match: true }] },
      { line: 18, code: "  return res; // PALINDROME PARTITIONING COMPLETE", vars: { status: "COMPLETE" }, log: "Palindrome Partitioning complete!", arrayState: [{ val: "['a', 'a', 'b']", match: true }, { val: "['aa', 'b']", match: true }] }
    ]
  },

  // ── 225. PERMUTATIONS ──
  "permutations": {
    solutionJS: `function permute(nums) {
  let res = [];
  function backtrack(path, visited) {
    if (path.length === nums.length) { res.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (visited[i]) continue;
      visited[i] = true;
      path.push(nums[i]);
      backtrack(path, visited);
      path.pop();
      visited[i] = false;
    }
  }
  backtrack([], new Array(nums.length).fill(false));
  return res;
}`,
    solutionPY: `def permute(nums: List[int]) -> List[List[int]]:
    res = []
    def backtrack(path, visited):
        if len(path) == len(nums): res.append(list(path)); return
        for i in range(len(nums)):
            if visited[i]: continue
            visited[i] = True
            path.append(nums[i])
            backtrack(path, visited)
            path.pop()
            visited[i] = False
    backtrack([], [False] * len(nums))
    return res`,
    solutionCPP: `vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> res; vector<int> path;
    vector<bool> visited(nums.size(), false);
    function<void()> backtrack = [&]() {
        if (path.size() == nums.size()) { res.push_back(path); return; }
        for (int i = 0; i < nums.size(); i++) {
            if (visited[i]) continue;
            visited[i] = true;
            path.push_back(nums[i]);
            backtrack();
            path.pop_back();
            visited[i] = false;
        }
    };
    backtrack();
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function permute(nums = [1, 2, 3]) {", vars: { nums: "[1, 2, 3]" }, log: "Initialize nums = [1, 2, 3]. Backtracking permutation generator (3! = 6 permutations).", arrayState: [{ val: "[1,2,3]" }, { val: "[1,3,2]" }, { val: "[2,1,3]" }, { val: "[2,3,1]" }, { val: "[3,1,2]" }, { val: "[3,2,1]" }] },
      { line: 5, code: "  generated 6 permutations: [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1];", vars: { totalPermutations: "6" }, log: "Backtracking recursion yields all 6 unique permutations.", arrayState: [{ val: "[1,2,3]", match: true }, { val: "[1,3,2]", match: true }, { val: "[2,1,3]", match: true }, { val: "[2,3,1]", match: true }, { val: "[3,1,2]", match: true }, { val: "[3,2,1]", match: true }] },
      { line: 16, code: "  return res; // PERMUTATIONS COMPLETE", vars: { status: "COMPLETE" }, log: "Permutations complete!", arrayState: [{ val: "6 Permutations", match: true }] }
    ]
  },

  // ── 226. SUBSETS ──
  "subsets": {
    solutionJS: `function subsets(nums) {
  let res = [];
  function backtrack(start, path) {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return res;
}`,
    solutionPY: `def subsets(nums: List[int]) -> List[List[int]]:
    res = []
    def backtrack(start, path):
        res.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return res`,
    solutionCPP: `vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res; vector<int> path;
    function<void(int)> backtrack = [&](int start) {
        res.push_back(path);
        for (int i = start; i < nums.size(); i++) {
            path.push_back(nums[i]);
            backtrack(i + 1);
            path.pop_back();
        }
    };
    backtrack(0);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function subsets(nums = [1, 2, 3]) {", vars: { nums: "[1, 2, 3]" }, log: "Initialize nums = [1, 2, 3]. Backtracking Power Set generator (2^3 = 8 subsets).", arrayState: [{ val: "[]" }, { val: "[1]" }, { val: "[2]" }, { val: "[1, 2]" }, { val: "[3]" }, { val: "[1, 3]" }, { val: "[2, 3]" }, { val: "[1, 2, 3]" }] },
      { line: 4, code: "  subsets generated: [], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3];", vars: { totalSubsets: "8" }, log: "Backtracking recursion generates all 8 subsets in Power Set.", arrayState: [{ val: "[]", match: true }, { val: "[1]", match: true }, { val: "[2]", match: true }, { val: "[1, 2]", match: true }, { val: "[3]", match: true }, { val: "[1, 3]", match: true }, { val: "[2, 3]", match: true }, { val: "[1, 2, 3]", match: true }] },
      { line: 11, code: "  return res; // SUBSETS COMPLETE", vars: { status: "COMPLETE" }, log: "Subsets complete!", arrayState: [{ val: "8 Subsets Generated", match: true }] }
    ]
  },

  // ── 227. SUBSETS II ──
  "subsets ii": {
    solutionJS: `function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  let res = [];
  function backtrack(start, path) {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return res;
}`,
    solutionPY: `def subsetsWithDup(nums: List[int]) -> List[List[int]]:
    nums.sort()
    res = []
    def backtrack(start, path):
        res.append(list(path))
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]: continue
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return res`,
    solutionCPP: `vector<vector<int>> subsetsWithDup(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res; vector<int> path;
    function<void(int)> backtrack = [&](int start) {
        res.push_back(path);
        for (int i = start; i < nums.size(); i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            path.push_back(nums[i]);
            backtrack(i + 1);
            path.pop_back();
        }
    };
    backtrack(0);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function subsetsWithDup(nums = [1, 2, 2]) {", vars: { nums: "[1, 2, 2]" }, log: "Sort nums = [1, 2, 2]. Backtracking Power Set generator with duplicate skipping.", arrayState: [{ val: "[]" }, { val: "[1]" }, { val: "[1, 2]" }, { val: "[1, 2, 2]" }, { val: "[2]" }, { val: "[2, 2]" }] },
      { line: 6, code: "  unique subsets generated: [], [1], [1,2], [1,2,2], [2], [2,2];", vars: { uniqueSubsets: "6" }, log: "Skipped duplicate branch at second '2'. Generated 6 unique subsets.", arrayState: [{ val: "[]", match: true }, { val: "[1]", match: true }, { val: "[1, 2]", match: true }, { val: "[1, 2, 2]", match: true }, { val: "[2]", match: true }, { val: "[2, 2]", match: true }] },
      { line: 13, code: "  return res; // SUBSETS II COMPLETE", vars: { status: "COMPLETE" }, log: "Subsets II complete!", arrayState: [{ val: "6 Unique Subsets", match: true }] }
    ]
  },

  // ── 228. CHEAPEST FLIGHTS WITHIN K STOPS ──
  "cheapest flights within k stops": {
    solutionJS: `function findCheapestPrice(n, flights, src, dst, k) {
  let prices = new Array(n).fill(Infinity);
  prices[src] = 0;
  for (let i = 0; i <= k; i++) {
    let temp = [...prices];
    for (let [from, to, price] of flights) {
      if (prices[from] === Infinity) continue;
      if (prices[from] + price < temp[to]) {
        temp[to] = prices[from] + price;
      }
    }
    prices = temp;
  }
  return prices[dst] === Infinity ? -1 : prices[dst];
}`,
    solutionPY: `def findCheapestPrice(n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
    prices = [float('inf')] * n
    prices[src] = 0
    for _ in range(k + 1):
        temp = list(prices)
        for u, v, p in flights:
            if prices[u] == float('inf'): continue
            if prices[u] + p < temp[v]:
                temp[v] = prices[u] + p
        prices = temp
    return prices[dst] if prices[dst] != float('inf') else -1`,
    solutionCPP: `int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<int> prices(n, INT_MAX);
    prices[src] = 0;
    for (int i = 0; i <= k; i++) {
      vector<int> temp = prices;
      for (auto& f : flights) {
        int u = f[0], v = f[1], p = f[2];
        if (prices[u] == INT_MAX) continue;
        if (prices[u] + p < temp[v]) temp[v] = prices[u] + p;
      }
      prices = temp;
    }
    return prices[dst] == INT_MAX ? -1 : prices[dst];
}`,
    visualizerSteps: [
      { line: 1, code: "function findCheapestPrice(n = 4, flights, src = 0, dst = 2, k = 1) {", vars: { src: "0", dst: "2", k: "1" }, log: "Initialize Bellman-Ford / BFS queue relaxation with at most k = 1 stop.", arrayState: [{ val: "src 0: cost 0" }, { val: "node 1: cost 100" }, { val: "node 2: cost 500" }] },
      { line: 8, code: "  iteration 1 (1 stop): 0 -> 1 -> 2 cost 200 < direct 0 -> 2 (cost 500) -> min cost = 200;", vars: { minCost: "200", path: "0 -> 1 -> 2" }, log: "Relax edge 1 -> 2: Path 0 -> 1 -> 2 with 1 stop costs 200 (cheaper than direct 500).", arrayState: [{ val: "0 -> 1 (100)", match: true }, { val: "1 -> 2 (100)", match: true }, { val: "Total Cost: 200", match: true }] },
      { line: 13, code: "  return 200; // CHEAPEST FLIGHTS WITHIN K STOPS COMPLETE", vars: { cheapestPrice: "200", status: "COMPLETE" }, log: "Cheapest Flights Within K Stops complete!", arrayState: [{ val: "Min Cost: 200", match: true }] }
    ]
  },

  // ── 229. CLONE GRAPH ──
  "clone graph": {
    solutionJS: `function cloneGraph(node) {
  if (!node) return null;
  let visited = new Map();
  function dfs(curr) {
    if (visited.has(curr.val)) return visited.get(curr.val);
    let copy = new Node(curr.val);
    visited.set(curr.val, copy);
    for (let neighbor of curr.neighbors) {
      copy.neighbors.push(dfs(neighbor));
    }
    return copy;
  }
  return dfs(node);
}`,
    solutionPY: `def cloneGraph(node: Optional['Node']) -> Optional['Node']:
    if not node: return None
    visited = {}
    def dfs(curr):
        if curr in visited: return visited[curr]
        copy = Node(curr.val)
        visited[curr] = copy
        for neighbor in curr.neighbors:
            copy.neighbors.append(dfs(neighbor))
        return copy
    return dfs(node)`,
    solutionCPP: `Node* cloneGraph(Node* node) {
    if (!node) return NULL;
    unordered_map<Node*, Node*> visited;
    function<Node*(Node*)> dfs = [&](Node* curr) {
        if (visited.count(curr)) return visited[curr];
        Node* copy = new Node(curr->val);
        visited[curr] = copy;
        for (Node* neighbor : curr->neighbors) {
            copy->neighbors.push_back(dfs(neighbor));
        }
        return copy;
    };
    return dfs(node);
}`,
    visualizerSteps: [
      { line: 1, code: "function cloneGraph(node = 1 with neighbors [2, 4]) {", vars: { node: "1" }, log: "Initialize graph node 1 with neighbors [2, 4]. Map-based DFS deep copy cloning.", arrayState: [{ val: "Node 1" }, { val: "Node 2" }, { val: "Node 3" }, { val: "Node 4" }] },
      { line: 6, code: "  create clone 1 -> dfs neighbors: clone 2, 3, 4 -> wire cloned neighbor lists;", vars: { clone1: "Node 1", cloneNeighbors: "[2, 4]" }, log: "Create deep copies in Map. Wire cloned neighbor references: Clone 1 -> [Clone 2, Clone 4].", arrayState: [{ val: "Clone 1 -> [2, 4]", match: true }, { val: "Clone 2 -> [1, 3]", match: true }, { val: "Clone 3 -> [2, 4]", match: true }, { val: "Clone 4 -> [1, 3]", match: true }] },
      { line: 12, code: "  return clone1; // CLONE GRAPH COMPLETE", vars: { status: "COMPLETE" }, log: "Clone Graph deep copy complete!", arrayState: [{ val: "Graph Deep Cloned", match: true }] }
    ]
  },

  // ── 230. COURSE SCHEDULE ──
  "course schedule": {
    solutionJS: `function canFinish(numCourses, prerequisites) {
  let inDegree = new Array(numCourses).fill(0);
  let adj = Array.from({ length: numCourses }, () => []);
  for (let [course, pre] of prerequisites) {
    adj[pre].push(course);
    inDegree[course]++;
  }
  let queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  let count = 0;
  while (queue.length) {
    let curr = queue.shift();
    count++;
    for (let next of adj[curr]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }
  return count === numCourses;
}`,
    solutionPY: `def canFinish(numCourses: int, prerequisites: List[List[int]]) -> bool:
    indegree = [0] * numCourses
    adj = collections.defaultdict(list)
    for crs, pre in prerequisites:
        adj[pre].append(crs)
        indegree[crs] += 1
    queue = collections.deque([i for i in range(numCourses) if indegree[i] == 0])
    count = 0
    while queue:
        curr = queue.popleft()
        count += 1
        for nxt in adj[curr]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0: queue.append(nxt)
    return count == numCourses`,
    solutionCPP: `bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<int> inDegree(numCourses, 0);
    vector<vector<int>> adj(numCourses);
    for (auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
        inDegree[p[0]]++;
    }
    queue<int> q;
    for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.push(i);
    int count = 0;
    while (!q.empty()) {
        int curr = q.front(); q.pop();
        count++;
        for (int next : adj[curr]) {
            if (--inDegree[next] == 0) q.push(next);
        }
    }
    return count == numCourses;
}`,
    visualizerSteps: [
      { line: 1, code: "function canFinish(numCourses = 2, prerequisites = [[1, 0]]) {", vars: { numCourses: "2", prereqs: "[[1, 0]]" }, log: "Initialize Kahn's algorithm BFS in-degree tracking for dependency 0 -> 1.", arrayState: [{ val: "0 (in-degree: 0)" }, { val: "1 (in-degree: 1)" }] },
      { line: 12, code: "  process 0 -> decrement 1 in-degree to 0 -> process 1 -> count = 2 === numCourses;", vars: { completedCount: "2", hasCycle: "false" }, log: "Process Course 0 (in-degree 0), then Course 1 (in-degree 0). No cycle detected! Can finish all 2 courses.", arrayState: [{ val: "Course 0 (Completed)", match: true }, { val: "Course 1 (Completed)", match: true }] },
      { line: 19, code: "  return true; // COURSE SCHEDULE COMPLETE", vars: { canFinish: "true", status: "COMPLETE" }, log: "Course Schedule complete!", arrayState: [{ val: "Can Finish All Courses", match: true }] }
    ]
  },

  // ── 231. COURSE SCHEDULE II ──
  "course schedule ii": {
    solutionJS: `function findOrder(numCourses, prerequisites) {
  let inDegree = new Array(numCourses).fill(0);
  let adj = Array.from({ length: numCourses }, () => []);
  for (let [crs, pre] of prerequisites) {
    adj[pre].push(crs);
    inDegree[crs]++;
  }
  let queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  let order = [];
  while (queue.length) {
    let curr = queue.shift();
    order.push(curr);
    for (let next of adj[curr]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }
  return order.length === numCourses ? order : [];
}`,
    solutionPY: `def findOrder(numCourses: int, prerequisites: List[List[int]]) -> List[int]:
    indegree = [0] * numCourses
    adj = collections.defaultdict(list)
    for crs, pre in prerequisites:
        adj[pre].append(crs)
        indegree[crs] += 1
    queue = collections.deque([i for i in range(numCourses) if indegree[i] == 0])
    order = []
    while queue:
        curr = queue.popleft()
        order.append(curr)
        for nxt in adj[curr]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0: queue.append(nxt)
    return order if len(order) == numCourses else []`,
    solutionCPP: `vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<int> inDegree(numCourses, 0);
    vector<vector<int>> adj(numCourses);
    for (auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);
        inDegree[p[0]]++;
    }
    queue<int> q;
    for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int curr = q.front(); q.pop();
        order.push_back(curr);
        for (int next : adj[curr]) {
            if (--inDegree[next] == 0) q.push(next);
        }
    }
    return order.size() == numCourses ? order : vector<int>();
}`,
    visualizerSteps: [
      { line: 1, code: "function findOrder(numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]) {", vars: { numCourses: "4" }, log: "Initialize Kahn's topological sort BFS for prerequisites graph.", arrayState: [{ val: "0 (in:0)" }, { val: "1 (in:1)" }, { val: "2 (in:1)" }, { val: "3 (in:2)" }] },
      { line: 12, code: "  topological order: 0 -> 1 -> 2 -> 3;", vars: { order: "[0, 1, 2, 3]" }, log: "Kahn's BFS order: Process 0, then 1 & 2, then 3. Valid Topological Order = [0, 1, 2, 3].", arrayState: [{ val: "Course 0", match: true }, { val: "Course 1", match: true }, { val: "Course 2", match: true }, { val: "Course 3", match: true }] },
      { line: 19, code: "  return [0, 1, 2, 3]; // COURSE SCHEDULE II COMPLETE", vars: { status: "COMPLETE" }, log: "Course Schedule II complete!", arrayState: [{ val: "Order: [0, 1, 2, 3]", match: true }] }
    ]
  },

  // ── 232. GRAPH VALID TREE ──
  "graph valid tree": {
    solutionJS: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  let parent = Array.from({ length: n }, (_, i) => i);
  function find(i) {
    if (parent[i] === i) return i;
    return parent[i] = find(parent[i]);
  }
  for (let [u, v] of edges) {
    let rootU = find(u), rootV = find(v);
    if (rootU === rootV) return false;
    parent[rootU] = rootV;
  }
  return true;
}`,
    solutionPY: `def validTree(n: int, edges: List[List[int]]) -> bool:
    if len(edges) != n - 1: return False
    parent = list(range(n))
    def find(i):
        if parent[i] == i: return i
        parent[i] = find(parent[i])
        return parent[i]
    for u, v in edges:
        root_u, root_v = find(u), find(v)
        if root_u == root_v: return False
        parent[root_u] = root_v
    return True`,
    solutionCPP: `bool validTree(int n, vector<vector<int>>& edges) {
    if (edges.size() != n - 1) return false;
    vector<int> parent(n);
    iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    };
    for (auto& e : edges) {
        int rootU = find(e[0]), rootV = find(e[1]);
        if (rootU == rootV) return false;
        parent[rootU] = rootV;
    }
    return true;
}`,
    visualizerSteps: [
      { line: 1, code: "function validTree(n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]) {", vars: { n: "5", edgeCount: "4" }, log: "Verify edges count = n - 1 (4 === 5 - 1). Union-Find cycle & connectivity check.", arrayState: [{ val: "0-1" }, { val: "0-2" }, { val: "0-3" }, { val: "1-4" }] },
      { line: 9, code: "  edges = 4 (n-1) & all 5 components connected with no cycle -> valid tree;", vars: { isConnected: "true", hasCycle: "false" }, log: "Union-Find connects all 5 nodes without any cycle. Graph is a Valid Tree!", arrayState: [{ val: "Component 0-1-2-3-4 Connected", match: true }] },
      { line: 13, code: "  return true; // GRAPH VALID TREE COMPLETE", vars: { validTree: "true", status: "COMPLETE" }, log: "Graph Valid Tree complete!", arrayState: [{ val: "Valid Tree Verified", match: true }] }
    ]
  },

  // ── 233. MAX AREA OF ISLAND ──
  "max area of island": {
    solutionJS: `function maxAreaOfIsland(grid) {
  let rows = grid.length, cols = grid[0].length;
  let maxArea = 0;
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === 0) return 0;
    grid[r][c] = 0;
    return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        maxArea = Math.max(maxArea, dfs(r, c));
      }
    }
  }
  return maxArea;
}`,
    solutionPY: `def maxAreaOfIsland(grid: List[List[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    max_area = 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == 0: return 0
        grid[r][c] = 0
        return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                max_area = max(max_area, dfs(r, c))
    return max_area`,
    solutionCPP: `int maxAreaOfIsland(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    int maxArea = 0;
    function<int(int, int)> dfs = [&](int r, int c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == 0) return 0;
        grid[r][c] = 0;
        return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
    };
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 1) maxArea = max(maxArea, dfs(r, c));
        }
    }
    return maxArea;
}`,
    visualizerSteps: [
      { line: 1, code: "function maxAreaOfIsland(grid 2D array) {", vars: { gridRows: "4", gridCols: "5" }, log: "Initialize 2D grid. 4-directional DFS island area computation.", arrayState: [{ val: "Island 1: Area 4" }, { val: "Island 2: Area 6" }] },
      { line: 10, code: "  dfs sinks island 1 (area 4); dfs sinks island 2 (area 6) -> max area = 6;", vars: { island1Area: "4", island2Area: "6", maxArea: "6" }, log: "DFS sinks island 1 (area 4) and island 2 (area 6). Max Island Area = 6.", arrayState: [{ val: "Island 1 (Area: 4)", match: true }, { val: "Island 2 (Area: 6)", match: true }] },
      { line: 16, code: "  return 6; // MAX AREA OF ISLAND COMPLETE", vars: { status: "COMPLETE" }, log: "Max Area of Island complete!", arrayState: [{ val: "Max Area: 6", match: true }] }
    ]
  },

  // ── 234. MIN COST TO CONNECT ALL POINTS ──
  "min cost to connect all points": {
    solutionJS: `function minCostConnectPoints(points) {
  let n = points.length;
  let visited = new Array(n).fill(false);
  let minDist = new Array(n).fill(Infinity);
  minDist[0] = 0;
  let totalCost = 0;
  for (let i = 0; i < n; i++) {
    let curr = -1;
    for (let j = 0; j < n; j++) {
      if (!visited[j] && (curr === -1 || minDist[j] < minDist[curr])) {
        curr = j;
      }
    }
    visited[curr] = true;
    totalCost += minDist[curr];
    for (let j = 0; j < n; j++) {
      if (!visited[j]) {
        let dist = Math.abs(points[curr][0] - points[j][0]) + Math.abs(points[curr][1] - points[j][1]);
        minDist[j] = Math.min(minDist[j], dist);
      }
    }
  }
  return totalCost;
}`,
    solutionPY: `def minCostConnectPoints(points: List[List[int]]) -> int:
    n = len(points)
    visited = [False] * n
    min_dist = [float('inf')] * n
    min_dist[0] = 0
    total_cost = 0
    for _ in range(n):
        curr = -1
        for j in range(n):
            if not visited[j] and (curr == -1 or min_dist[j] < min_dist[curr]):
                curr = j
        visited[curr] = True
        total_cost += min_dist[curr]
        for j in range(n):
            if not visited[j]:
                dist = abs(points[curr][0] - points[j][0]) + abs(points[curr][1] - points[j][1])
                min_dist[j] = min(min_dist[j], dist)
    return total_cost`,
    solutionCPP: `int minCostConnectPoints(vector<vector<int>>& points) {
    int n = points.size();
    vector<bool> visited(n, false);
    vector<int> minDist(n, INT_MAX);
    minDist[0] = 0;
    int totalCost = 0;
    for (int i = 0; i < n; i++) {
        int curr = -1;
        for (int j = 0; j < n; j++) {
            if (!visited[j] && (curr == -1 || minDist[j] < minDist[curr])) curr = j;
        }
        visited[curr] = true;
        totalCost += minDist[curr];
        for (int j = 0; j < n; j++) {
            if (!visited[j]) {
                int dist = abs(points[curr][0] - points[j][0]) + abs(points[curr][1] - points[j][1]);
                minDist[j] = min(minDist[j], dist);
            }
        }
    }
    return totalCost;
}`,
    visualizerSteps: [
      { line: 1, code: "function minCostConnectPoints(points = [[0,0],[2,2],[3,10],[5,2],[7,0]]) {", vars: { n: "5" }, log: "Initialize 5 points. Prim's Minimum Spanning Tree algorithm.", arrayState: [{ val: "(0,0)-(2,2): 4" }, { val: "(2,2)-(5,2): 3" }, { val: "(5,2)-(7,0): 4" }, { val: "(2,2)-(3,10): 9" }] },
      { line: 10, code: "  MST edges selected: 4 + 3 + 4 + 9 = 20 total cost;", vars: { totalMSTCost: "20", edges: "4" }, log: "Prim's MST connects all 5 points with edges of Manhattan costs 4, 3, 4, 9. Min total cost = 20.", arrayState: [{ val: "Edge 1: cost 4", match: true }, { val: "Edge 2: cost 3", match: true }, { val: "Edge 3: cost 4", match: true }, { val: "Edge 4: cost 9", match: true }] },
      { line: 21, code: "  return 20; // MIN COST TO CONNECT ALL POINTS COMPLETE", vars: { status: "COMPLETE" }, log: "Min Cost to Connect All Points complete!", arrayState: [{ val: "Min Cost: 20", match: true }] }
    ]
  },

  // ── 235. NETWORK DELAY TIME ──
  "network delay time": {
    solutionJS: `function networkDelayTime(times, n, k) {
  let dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  for (let i = 0; i < n - 1; i++) {
    for (let [u, v, w] of times) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  let maxDist = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1;
    maxDist = Math.max(maxDist, dist[i]);
  }
  return maxDist;
}`,
    solutionPY: `def networkDelayTime(times: List[List[int]], n: int, k: int) -> int:
    adj = collections.defaultdict(list)
    for u, v, w in times: adj[u].append((v, w))
    pq = [(0, k)]
    dist = {}
    while pq:
        d, node = heapq.heappop(pq)
        if node in dist: continue
        dist[node] = d
        for neighbor, weight in adj[node]:
            if neighbor not in dist:
                heapq.heappush(pq, (d + weight, neighbor))
    return max(dist.values()) if len(dist) == n else -1`,
    solutionCPP: `int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<int> dist(n + 1, INT_MAX);
    dist[k] = 0;
    for (int i = 0; i < n - 1; i++) {
        for (auto& t : times) {
            int u = t[0], v = t[1], w = t[2];
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
        }
    }
    int maxDist = 0;
    for (int i = 1; i <= n; i++) {
        if (dist[i] == INT_MAX) return -1;
        maxDist = max(maxDist, dist[i]);
    }
    return maxDist;
}`,
    visualizerSteps: [
      { line: 1, code: "function networkDelayTime(times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2) {", vars: { source: "2", n: "4" }, log: "Initialize shortest path search from source node k = 2.", arrayState: [{ val: "dist[2]: 0" }, { val: "dist[1]: 1" }, { val: "dist[3]: 1" }, { val: "dist[4]: 2" }] },
      { line: 9, code: "  shortest paths from 2: node 1 (1), node 3 (1), node 4 (2) -> max signal delay = 2;", vars: { maxDelay: "2", unreachable: "false" }, log: "Dijkstra distances from node 2: node 1 (1), node 3 (1), node 4 (2). Max signal delay time = 2.", arrayState: [{ val: "Node 1: d=1", match: true }, { val: "Node 3: d=1", match: true }, { val: "Node 4: d=2", match: true }] },
      { line: 15, code: "  return 2; // NETWORK DELAY TIME COMPLETE", vars: { status: "COMPLETE" }, log: "Network Delay Time complete!", arrayState: [{ val: "Max Delay: 2", match: true }] }
    ]
  },

  // ── 236. NUMBER OF CONNECTED COMPONENTS IN AN UNDIRECTED GRAPH ──
  "number of connected components in an undirected graph": {
    solutionJS: `function countComponents(n, edges) {
  let parent = Array.from({ length: n }, (_, i) => i);
  function find(i) {
    if (parent[i] === i) return i;
    return parent[i] = find(parent[i]);
  }
  let count = n;
  for (let [u, v] of edges) {
    let rootU = find(u), rootV = find(v);
    if (rootU !== rootV) { parent[rootU] = rootV; count--; }
  }
  return count;
}`,
    solutionPY: `def countComponents(n: int, edges: List[List[int]]) -> int:
    parent = list(range(n))
    def find(i):
        if parent[i] == i: return i
        parent[i] = find(parent[i])
        return parent[i]
    count = n
    for u, v in edges:
        root_u, root_v = find(u), find(v)
        if root_u != root_v: parent[root_u] = root_v; count -= 1
    return count`,
    solutionCPP: `int countComponents(int n, vector<vector<int>>& edges) {
    vector<int> parent(n);
    iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    };
    int count = n;
    for (auto& e : edges) {
        int rootU = find(e[0]), rootV = find(e[1]);
        if (rootU != rootV) { parent[rootU] = rootV; count--; }
    }
    return count;
}`,
    visualizerSteps: [
      { line: 1, code: "function countComponents(n = 5, edges = [[0,1],[1,2],[3,4]]) {", vars: { n: "5", edgeCount: "3" }, log: "Initialize Union-Find disjoint sets for n = 5 nodes.", arrayState: [{ val: "Component 1: {0,1,2}" }, { val: "Component 2: {3,4}" }] },
      { line: 9, code: "  disjoint sets: {0, 1, 2} and {3, 4} -> total connected components = 2;", vars: { componentsCount: "2" }, log: "Union-Find merges edges: {0,1,2} forms 1st component, {3,4} forms 2nd component. Total = 2.", arrayState: [{ val: "{0, 1, 2}", match: true }, { val: "{3, 4}", match: true }] },
      { line: 12, code: "  return 2; // NUMBER OF CONNECTED COMPONENTS COMPLETE", vars: { status: "COMPLETE" }, log: "Number of Connected Components in an Undirected Graph complete!", arrayState: [{ val: "Components Count: 2", match: true }] }
    ]
  },

  // ── 237. NUMBER OF ISLANDS ──
  "number of islands": {
    solutionJS: `function numIslands(grid) {
  if (!grid.length) return 0;
  let rows = grid.length, cols = grid[0].length, count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { count++; dfs(r, c); }
    }
  }
  return count;
}`,
    solutionPY: `def numIslands(grid: List[List[str]]) -> int:
    if not grid: return 0
    rows, cols, count = len(grid), len(grid[0]), 0
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0': return
        grid[r][c] = '0'
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1; dfs(r, c)
    return count`,
    solutionCPP: `int numIslands(vector<vector<char>>& grid) {
    if (grid.empty()) return 0;
    int rows = grid.size(), cols = grid[0].size(), count = 0;
    function<void(int, int)> dfs = [&](int r, int c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0') return;
        grid[r][c] = '0';
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
    };
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') { count++; dfs(r, c); }
        }
    }
    return count;
}`,
    visualizerSteps: [
      { line: 1, code: "function numIslands(grid 2D array) {", vars: { rows: "4", cols: "5" }, log: "Initialize 2D grid. DFS island counting & land mass sinking.", arrayState: [{ val: "Island 1 at (0,0)" }, { val: "Island 2 at (2,2)" }, { val: "Island 3 at (3,3)" }] },
      { line: 9, code: "  found 3 disconnected land masses -> sink connected '1's -> total islands = 3;", vars: { islandCount: "3" }, log: "Grid search finds 3 distinct islands: sinking at (0,0), (2,2), and (3,3). Total = 3.", arrayState: [{ val: "Island 1 (Sunk)", match: true }, { val: "Island 2 (Sunk)", match: true }, { val: "Island 3 (Sunk)", match: true }] },
      { line: 14, code: "  return 3; // NUMBER OF ISLANDS COMPLETE", vars: { status: "COMPLETE" }, log: "Number of Islands complete!", arrayState: [{ val: "Total Islands: 3", match: true }] }
    ]
  },

  // ── 238. PACIFIC ATLANTIC WATER FLOW ──
  "pacific atlantic water flow": {
    solutionJS: `function pacificAtlantic(heights) {
  if (!heights.length) return [];
  let rows = heights.length, cols = heights[0].length;
  let pacific = Array.from({ length: rows }, () => new Array(cols).fill(false));
  let atlantic = Array.from({ length: rows }, () => new Array(cols).fill(false));
  function dfs(r, c, ocean, prevHeight) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || ocean[r][c] || heights[r][c] < prevHeight) return;
    ocean[r][c] = true;
    dfs(r + 1, c, ocean, heights[r][c]); dfs(r - 1, c, ocean, heights[r][c]);
    dfs(r, c + 1, ocean, heights[r][c]); dfs(r, c - 1, ocean, heights[r][c]);
  }
  for (let r = 0; r < rows; r++) {
    dfs(r, 0, pacific, heights[r][0]);
    dfs(r, cols - 1, atlantic, heights[r][cols - 1]);
  }
  for (let c = 0; c < cols; c++) {
    dfs(0, c, pacific, heights[0][c]);
    dfs(rows - 1, c, atlantic, heights[rows - 1][c]);
  }
  let res = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pacific[r][c] && atlantic[r][c]) res.push([r, c]);
    }
  }
  return res;
}`,
    solutionPY: `def pacificAtlantic(heights: List[List[int]]) -> List[List[int]]:
    if not heights: return []
    rows, cols = len(heights), len(heights[0])
    pacific = set()
    atlantic = set()
    def dfs(r, c, ocean, prev_height):
        if (r, c) in ocean or r < 0 or r >= rows or c < 0 or c >= cols or heights[r][c] < prev_height: return
        ocean.add((r, c))
        dfs(r + 1, c, ocean, heights[r][c]); dfs(r - 1, c, ocean, heights[r][c])
        dfs(r, c + 1, ocean, heights[r][c]); dfs(r, c - 1, ocean, heights[r][c])
    for r in range(rows):
        dfs(r, 0, pacific, heights[r][0])
        dfs(r, cols - 1, atlantic, heights[r][cols - 1])
    for c in range(cols):
        dfs(0, c, pacific, heights[0][c])
        dfs(rows - 1, c, atlantic, heights[rows - 1][c])
    return [list(p) for p in pacific & atlantic]`,
    solutionCPP: `vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    if (heights.empty()) return {};
    int rows = heights.size(), cols = heights[0].size();
    vector<vector<bool>> pacific(rows, vector<bool>(cols, false));
    vector<vector<bool>> atlantic(rows, vector<bool>(cols, false));
    function<void(int, int, vector<vector<bool>>&, int)> dfs = [&](int r, int c, vector<vector<bool>>& ocean, int prev) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || ocean[r][c] || heights[r][c] < prev) return;
        ocean[r][c] = true;
        dfs(r + 1, c, ocean, heights[r][c]); dfs(r - 1, c, ocean, heights[r][c]);
        dfs(r, c + 1, ocean, heights[r][c]); dfs(r, c - 1, ocean, heights[r][c]);
    };
    for (int r = 0; r < rows; r++) {
        dfs(r, 0, pacific, heights[r][0]);
        dfs(r, cols - 1, atlantic, heights[r][cols - 1]);
    }
    for (int c = 0; c < cols; c++) {
        dfs(0, c, pacific, heights[0][c]);
        dfs(rows - 1, c, atlantic, heights[rows - 1][c]);
    }
    vector<vector<int>> res;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (pacific[r][c] && atlantic[r][c]) res.push_back({r, c});
        }
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function pacificAtlantic(heights 5x5 matrix) {", vars: { matrix: "5x5" }, log: "Initialize 5x5 matrix. Multi-source boundary DFS from Pacific (top/left) and Atlantic (bottom/right).", arrayState: [{ val: "Pacific Reachable Set" }, { val: "Atlantic Reachable Set" }] },
      { line: 18, code: "  intersection of Pacific & Atlantic reachability: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]];", vars: { intersectionCount: "7" }, log: "Uphill boundary DFS identifies 7 cells where water flows to both Pacific and Atlantic oceans.", arrayState: [{ val: "[0,4]", match: true }, { val: "[1,3]", match: true }, { val: "[1,4]", match: true }, { val: "[2,2]", match: true }, { val: "[3,0]", match: true }, { val: "[3,1]", match: true }, { val: "[4,0]", match: true }] },
      { line: 24, code: "  return [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]; // PACIFIC ATLANTIC COMPLETE", vars: { status: "COMPLETE" }, log: "Pacific Atlantic Water Flow complete!", arrayState: [{ val: "7 Dual Ocean Cells", match: true }] }
    ]
  },

  // ── 239. REDUNDANT CONNECTION ──
  "redundant connection": {
    solutionJS: `function findRedundantConnection(edges) {
  let parent = Array.from({ length: edges.length + 1 }, (_, i) => i);
  function find(i) {
    if (parent[i] === i) return i;
    return parent[i] = find(parent[i]);
  }
  for (let [u, v] of edges) {
    let rootU = find(u), rootV = find(v);
    if (rootU === rootV) return [u, v];
    parent[rootU] = rootV;
  }
  return [];
}`,
    solutionPY: `def findRedundantConnection(edges: List[List[int]]) -> List[int]:
    parent = list(range(len(edges) + 1))
    def find(i):
        if parent[i] == i: return i
        parent[i] = find(parent[i])
        return parent[i]
    for u, v in edges:
        root_u, root_v = find(u), find(v)
        if root_u == root_v: return [u, v]
        parent[root_u] = root_v
    return []`,
    solutionCPP: `vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    vector<int> parent(edges.size() + 1);
    iota(parent.begin(), parent.end(), 0);
    function<int(int)> find = [&](int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    };
    for (auto& e : edges) {
        int rootU = find(e[0]), rootV = find(e[1]);
        if (rootU == rootV) return e;
        parent[rootU] = rootV;
    }
    return {};
}`,
    visualizerSteps: [
      { line: 1, code: "function findRedundantConnection(edges = [[1,2], [1,3], [2,3]]) {", vars: { edges: "[[1,2], [1,3], [2,3]]" }, log: "Initialize Union-Find DSU cycle detector.", arrayState: [{ val: "Union(1,2)" }, { val: "Union(1,3)" }, { val: "Check(2,3)" }] },
      { line: 8, code: "  find(2) === find(3) === 1 -> edge [2, 3] creates cycle in graph;", vars: { redundantEdge: "[2, 3]", root2: "1", root3: "1" }, log: "Nodes 2 and 3 already share root 1. Edge [2, 3] creates a cycle! Redundant connection = [2, 3].", arrayState: [{ val: "[1, 2]", match: true }, { val: "[1, 3]", match: true }, { val: "[2, 3] (Redundant)", match: true }] },
      { line: 10, code: "  return [2, 3]; // REDUNDANT CONNECTION COMPLETE", vars: { status: "COMPLETE" }, log: "Redundant Connection complete!", arrayState: [{ val: "[2, 3]", match: true }] }
    ]
  },

  // ── 240. ROTTING ORANGES ──
  "rotting oranges": {
    solutionJS: `function orangesRotting(grid) {
  let rows = grid.length, cols = grid[0].length;
  let queue = [], fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c, 0]);
      else if (grid[r][c] === 1) fresh++;
    }
  }
  let minutes = 0;
  let dirs = [[1,0], [-1,0], [0,1], [0,-1]];
  while (queue.length) {
    let [r, c, d] = queue.shift();
    minutes = d;
    for (let [dr, dc] of dirs) {
      let nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
        grid[nr][nc] = 2;
        fresh--;
        queue.push([nr, nc, d + 1]);
      }
    }
  }
  return fresh === 0 ? minutes : -1;
}`,
    solutionPY: `def orangesRotting(grid: List[List[int]]) -> int:
    rows, cols = len(grid), len(grid[0])
    queue = collections.deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2: queue.append((r, c, 0))
            elif grid[r][c] == 1: fresh += 1
    minutes = 0
    dirs = [(1,0), (-1,0), (0,1), (0,-1)]
    while queue:
        r, c, d = queue.popleft()
        minutes = d
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2; fresh -= 1
                queue.append((nr, nc, d + 1))
    return minutes if fresh == 0 else -1`,
    solutionCPP: `int orangesRotting(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    queue<vector<int>> q;
    int fresh = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) q.push({r, c, 0});
            else if (grid[r][c] == 1) fresh++;
        }
    }
    int minutes = 0;
    vector<pair<int, int>> dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};
    while (!q.empty()) {
        auto curr = q.front(); q.pop();
        int r = curr[0], c = curr[1], d = curr[2];
        minutes = d;
        for (auto& dir : dirs) {
            int nr = r + dir.first, nc = c + dir.second;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                grid[nr][nc] = 2; fresh--;
                q.push({nr, nc, d + 1});
            }
        }
    }
    return fresh == 0 ? minutes : -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function orangesRotting(grid = [[2,1,1],[1,1,0],[0,1,1]]) {", vars: { freshCount: "6", rottenCount: "1" }, log: "Initialize multi-source BFS queue with initial rotten orange (0,0). Fresh oranges = 6.", arrayState: [{ val: "Minute 0: 6 fresh" }, { val: "Minute 1: 4 fresh" }, { val: "Minute 2: 2 fresh" }, { val: "Minute 3: 1 fresh" }, { val: "Minute 4: 0 fresh" }] },
      { line: 11, code: "  rot spreads level-by-level: M1 (4 fresh), M2 (2 fresh), M3 (1 fresh), M4 (0 fresh);", vars: { elapsedMinutes: "4", remainingFresh: "0" }, log: "Multi-source BFS rots adjacent oranges: 4 minutes required until all fresh oranges rot.", arrayState: [{ val: "Min 1: (0,1), (1,0)", match: true }, { val: "Min 2: (0,2), (1,1)", match: true }, { val: "Min 3: (2,1)", match: true }, { val: "Min 4: (2,2)", match: true }] },
      { line: 20, code: "  return 4; // ROTTING ORANGES COMPLETE", vars: { status: "COMPLETE" }, log: "Rotting Oranges complete!", arrayState: [{ val: "4 Minutes Required", match: true }] }
    ]
  },

  // ── 241. SURROUNDED REGIONS ──
  "surrounded regions": {
    solutionJS: `function solve(board) {
  if (!board.length) return;
  let rows = board.length, cols = board[0].length;
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== 'O') return;
    board[r][c] = 'S';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    dfs(r, 0); dfs(r, cols - 1);
  }
  for (let c = 0; c < cols; c++) {
    dfs(0, c); dfs(rows - 1, c);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 'O') board[r][c] = 'X';
      else if (board[r][c] === 'S') board[r][c] = 'O';
    }
  }
}`,
    solutionPY: `def solve(board: List[List[str]]) -> None:
    if not board: return
    rows, cols = len(board), len(board[0])
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != 'O': return
        board[r][c] = 'S'
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)
    for r in range(rows):
        dfs(r, 0); dfs(r, cols - 1)
    for c in range(cols):
        dfs(0, c); dfs(rows - 1, c)
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O': board[r][c] = 'X'
            elif board[r][c] == 'S': board[r][c] = 'O'`,
    solutionCPP: `void solve(vector<vector<char>>& board) {
    if (board.empty()) return;
    int rows = board.size(), cols = board[0].size();
    function<void(int, int)> dfs = [&](int r, int c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] != 'O') return;
        board[r][c] = 'S';
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
    };
    for (int r = 0; r < rows; r++) { dfs(r, 0); dfs(r, cols - 1); }
    for (int c = 0; c < cols; c++) { dfs(0, c); dfs(rows - 1, c); }
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (board[r][c] == 'O') board[r][c] = 'X';
            else if (board[r][c] == 'S') board[r][c] = 'O';
        }
    }
}`,
    visualizerSteps: [
      { line: 1, code: "function solve(board 4x4 matrix) {", vars: { boardSize: "4x4" }, log: "Initialize 4x4 board. Boundary DFS marks uncaptured 'O's as 'S'.", arrayState: [{ val: "Boundary DFS: 'S'" }, { val: "Inner 'O' -> 'X'" }] },
      { line: 15, code: "  boundary connected 'O's preserved as 'O'; inner surrounded 'O's flipped to 'X';", vars: { innerFlipped: "true", boundaryPreserved: "true" }, log: "Flip inner surrounded 'O's to 'X', restore boundary-connected 'S's back to 'O'.", arrayState: [{ val: "Surrounded Regions Captured", match: true }] },
      { line: 20, code: "  // SURROUNDED REGIONS COMPLETE", vars: { status: "COMPLETE" }, log: "Surrounded Regions complete!", arrayState: [{ val: "Surrounded Regions Captured", match: true }] }
    ]
  },

  // ── 242. WALLS AND GATES ──
  "walls and gates": {
    solutionJS: `function wallsAndGates(rooms) {
  if (!rooms.length) return;
  let rows = rooms.length, cols = rooms[0].length;
  let queue = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rooms[r][c] === 0) queue.push([r, c]);
    }
  }
  let dirs = [[1,0], [-1,0], [0,1], [0,-1]];
  while (queue.length) {
    let [r, c] = queue.shift();
    for (let [dr, dc] of dirs) {
      let nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || rooms[nr][nc] !== 2147483647) continue;
      rooms[nr][nc] = rooms[r][c] + 1;
      queue.push([nr, nc]);
    }
  }
}`,
    solutionPY: `def wallsAndGates(rooms: List[List[int]]) -> None:
    if not rooms: return
    rows, cols = len(rooms), len(rooms[0])
    queue = collections.deque()
    for r in range(rows):
        for c in range(cols):
            if rooms[r][c] == 0: queue.append((r, c))
    dirs = [(1,0), (-1,0), (0,1), (0,-1)]
    while queue:
        r, c = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and rooms[nr][nc] == 2147483647:
                rooms[nr][nc] = rooms[r][c] + 1
                queue.append((nr, nc))`,
    solutionCPP: `void wallsAndGates(vector<vector<int>>& rooms) {
    if (rooms.empty()) return;
    int rows = rooms.size(), cols = rooms[0].size();
    queue<pair<int, int>> q;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (rooms[r][c] == 0) q.push({r, c});
        }
    }
    vector<pair<int, int>> dirs = {{1,0}, {-1,0}, {0,1}, {0,-1}};
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (auto& dir : dirs) {
            int nr = r + dir.first, nc = c + dir.second;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && rooms[nr][nc] == 2147483647) {
                rooms[nr][nc] = rooms[r][c] + 1;
                q.push({nr, nc});
            }
        }
    }
}`,
    visualizerSteps: [
      { line: 1, code: "function wallsAndGates(rooms 4x4 matrix) {", vars: { rows: "4", cols: "4" }, log: "Initialize 4x4 rooms grid with 2 gates (0) and walls (-1). Multi-source BFS.", arrayState: [{ val: "Gate 1 at (0,0)" }, { val: "Gate 2 at (3,3)" }] },
      { line: 10, code: "  multi-source BFS populates shortest distances to nearest gate: 1, 2, 3...", vars: { dist1: "1", dist2: "2", dist3: "3" }, log: "BFS expands distance levels from all gates simultaneously, filling empty rooms with shortest distance.", arrayState: [{ val: "Level 1: Dist 1", match: true }, { val: "Level 2: Dist 2", match: true }, { val: "Level 3: Dist 3", match: true }] },
      { line: 17, code: "  // WALLS AND GATES COMPLETE", vars: { status: "COMPLETE" }, log: "Walls and Gates complete!", arrayState: [{ val: "Shortest Distances Populated", match: true }] }
    ]
  },

  // ── 243. WORD SEARCH ──
  "word search": {
    solutionJS: `function exist(board, word) {
  let rows = board.length, cols = board[0].length;
  function dfs(r, c, idx) {
    if (idx === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[idx]) return false;
    let temp = board[r][c];
    board[r][c] = '#';
    let found = dfs(r + 1, c, idx + 1) || dfs(r - 1, c, idx + 1) ||
                dfs(r, c + 1, idx + 1) || dfs(r, c - 1, idx + 1);
    board[r][c] = temp;
    return found;
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (dfs(r, c, 0)) return true;
    }
  }
  return false;
}`,
    solutionPY: `def exist(board: List[List[str]], word: str) -> bool:
    rows, cols = len(board), len(board[0])
    def dfs(r, c, idx):
        if idx == len(word): return True
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[idx]: return False
        temp = board[r][c]
        board[r][c] = '#'
        found = (dfs(r + 1, c, idx + 1) or dfs(r - 1, c, idx + 1) or
                 dfs(r, c + 1, idx + 1) or dfs(r, c - 1, idx + 1))
        board[r][c] = temp
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0): return True
    return False`,
    solutionCPP: `bool exist(vector<vector<char>>& board, string word) {
    int rows = board.size(), cols = board[0].size();
    function<bool(int, int, int)> dfs = [&](int r, int c, int idx) {
        if (idx == word.length()) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] != word[idx]) return false;
        char temp = board[r][c];
        board[r][c] = '#';
        bool found = dfs(r + 1, c, idx + 1) || dfs(r - 1, c, idx + 1) ||
                     dfs(r, c + 1, idx + 1) || dfs(r, c - 1, idx + 1);
        board[r][c] = temp;
        return found;
    };
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (dfs(r, c, 0)) return true;
        }
    }
    return false;
}`,
    visualizerSteps: [
      { line: 1, code: "function exist(board, word = 'ABCCED') {", vars: { word: "'ABCCED'" }, log: "Initialize grid search for word 'ABCCED'. Backtracking 4-directional DFS.", arrayState: [{ val: "A at (0,0)" }, { val: "B at (0,1)" }, { val: "C at (0,2)" }, { val: "C at (1,2)" }, { val: "E at (2,2)" }, { val: "D at (2,1)" }] },
      { line: 8, code: "  matched path: A(0,0) -> B(0,1) -> C(0,2) -> C(1,2) -> E(2,2) -> D(2,1);", vars: { matched: "'ABCCED'", found: "true" }, log: "DFS path matches sequence 'ABCCED' without cell reuse. Word found in grid! Return true.", arrayState: [{ val: "Path: A->B->C->C->E->D", match: true }] },
      { line: 17, code: "  return true; // WORD SEARCH COMPLETE", vars: { exist: "true", status: "COMPLETE" }, log: "Word Search complete!", arrayState: [{ val: "Word 'ABCCED' Found", match: true }] }
    ]
  },

  // ── 244. CLIMBING STAIRS ──
  "climbing stairs": {
    solutionJS: `function climbStairs(n) {
  if (n <= 2) return n;
  let dp = new Array(n + 1);
  dp[1] = 1; dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
    solutionPY: `def climbStairs(n: int) -> int:
    if n <= 2: return n
    one, two = 1, 2
    for _ in range(3, n + 1):
        one, two = two, one + two
    return two`,
    solutionCPP: `int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
    visualizerSteps: [
      { line: 1, code: "function climbStairs(n = 5) {", vars: { n: "5" }, log: "Initialize DP array for n = 5 stairs. Recurrence: dp[i] = dp[i-1] + dp[i-2].", arrayState: [{ val: "dp[1]: 1" }, { val: "dp[2]: 2" }, { val: "dp[3]: 3" }, { val: "dp[4]: 5" }, { val: "dp[5]: 8" }] },
      { line: 5, code: "  dp sequence: 1, 2, 3, 5, 8 -> 8 distinct ways to climb 5 stairs;", vars: { n5Ways: "8" }, log: "DP table evaluation: dp[3]=3, dp[4]=5, dp[5]=8. Total distinct ways = 8.", arrayState: [{ val: "dp[1]=1" }, { val: "dp[2]=2" }, { val: "dp[3]=3" }, { val: "dp[4]=5" }, { val: "dp[5]=8", match: true }] },
      { line: 8, code: "  return 8; // CLIMBING STAIRS COMPLETE", vars: { ways: "8", status: "COMPLETE" }, log: "Climbing Stairs complete!", arrayState: [{ val: "Ways: 8", match: true }] }
    ]
  },

  // ── 245. LONGEST REPEATING SUBSEQUENCE ──
  "longest repeating subsequence": {
    solutionJS: `function LongestRepeatingSubsequence(str) {
  let n = str.length;
  let dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (str[i - 1] === str[j - 1] && i !== j) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[n][n];
}`,
    solutionPY: `def LongestRepeatingSubsequence(str: str) -> int:
    n = len(str)
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if str[i - 1] == str[j - 1] and i != j:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][n]`,
    solutionCPP: `int LongestRepeatingSubsequence(string str) {
    int n = str.length();
    vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (str[i - 1] == str[j - 1] && i != j) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[n][n];
}`,
    visualizerSteps: [
      { line: 1, code: "function LongestRepeatingSubsequence(str = 'axxzxy') {", vars: { str: "'axxzxy'", n: "6" }, log: "Initialize 2D DP matrix (6x6) for self-matching LCS with i !== j condition.", arrayState: [{ val: "Matching 'xx'" }, { val: "Indices: 1, 2" }] },
      { line: 5, code: "  LCS with different indices finds repeating subsequence 'xx' (length 2);", vars: { subsequence: "'xx'", length: "2" }, log: "Self-matching LCS with distinct indices matches 'x' at index 1 & 2. Max length = 2.", arrayState: [{ val: "Subsequence: 'xx'", match: true }] },
      { line: 13, code: "  return 2; // LONGEST REPEATING SUBSEQUENCE COMPLETE", vars: { lrsLength: "2", status: "COMPLETE" }, log: "Longest Repeating Subsequence complete!", arrayState: [{ val: "Length: 2", match: true }] }
    ]
  },

  // ── 246. MIN COST CLIMBING STAIRS ──
  "min cost climbing stairs": {
    solutionJS: `function minCostClimbingStairs(cost) {
  let n = cost.length;
  let dp = new Array(n + 1);
  dp[0] = 0; dp[1] = 0;
  for (let i = 2; i <= n; i++) {
    dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
  }
  return dp[n];
}`,
    solutionPY: `def minCostClimbingStairs(cost: List[int]) -> int:
    one, two = 0, 0
    for i in range(2, len(cost) + 1):
        curr = min(one + cost[i - 1], two + cost[i - 2])
        two, one = one, curr
    return one`,
    solutionCPP: `int minCostClimbingStairs(vector<int>& cost) {
    int n = cost.size();
    vector<int> dp(n + 1, 0);
    for (int i = 2; i <= n; i++) {
        dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
    }
    return dp[n];
}`,
    visualizerSteps: [
      { line: 1, code: "function minCostClimbingStairs(cost = [10, 15, 20]) {", vars: { cost: "[10, 15, 20]" }, log: "Initialize DP for stair costs [10, 15, 20]. Recurrence: min(dp[i-1]+cost[i-1], dp[i-2]+cost[i-2]).", arrayState: [{ val: "Start at idx 1 (cost 15)" }, { val: "Step to top (cost 15)" }] },
      { line: 5, code: "  start at step 1 (cost 15), jump 2 stairs to top -> total cost = 15;", vars: { minCost: "15" }, log: "Optimal path starts at index 1 (cost 15) and jumps directly to top. Total min cost = 15.", arrayState: [{ val: "Step 1: cost 15", match: true }, { val: "Top reached", match: true }] },
      { line: 8, code: "  return 15; // MIN COST CLIMBING STAIRS COMPLETE", vars: { status: "COMPLETE" }, log: "Min Cost Climbing Stairs complete!", arrayState: [{ val: "Min Cost: 15", match: true }] }
    ]
  },

  // ── 247. MINIMUM NUMBER OF DELETIONS AND INSERTIONS ──
  "minimum number of deletions and insertions": {
    solutionJS: `function minOperations(str1, str2) {
  let m = str1.length, n = str2.length;
  let dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  let lcs = dp[m][n];
  let deletions = m - lcs;
  let insertions = n - lcs;
  return deletions + insertions;
}`,
    solutionPY: `def minOperations(str1: str, str2: str) -> int:
    m, n = len(str1), len(str2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i - 1] == str2[j - 1]: dp[i][j] = 1 + dp[i - 1][j - 1]
            else: dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    lcs = dp[m][n]
    return (m - lcs) + (n - lcs)`,
    solutionCPP: `int minOperations(string str1, string str2) {
    int m = str1.length(), n = str2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (str1[i - 1] == str2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    int lcs = dp[m][n];
    return (m - lcs) + (n - lcs);
}`,
    visualizerSteps: [
      { line: 1, code: "function minOperations(str1 = 'heap', str2 = 'pea') {", vars: { str1: "'heap'", str2: "'pea'" }, log: "Initialize DP for LCS('heap', 'pea'). Deletions = len1 - lcs, Insertions = len2 - lcs.", arrayState: [{ val: "LCS('heap', 'pea'): 'ea' (2)" }] },
      { line: 10, code: "  lcs = 2 ('ea'); deletions = 4-2 = 2; insertions = 3-2 = 1 -> total = 3;", vars: { lcs: "2", deletions: "2", insertions: "1", totalOps: "3" }, log: "LCS is 'ea' (length 2). Deletions needed = 2 ('h', 'p'), Insertions needed = 1 ('p'). Total = 3.", arrayState: [{ val: "Deletions: 2", match: true }, { val: "Insertions: 1", match: true }, { val: "Total Ops: 3", match: true }] },
      { line: 13, code: "  return 3; // MIN DELETIONS AND INSERTIONS COMPLETE", vars: { status: "COMPLETE" }, log: "Minimum number of deletions and insertions complete!", arrayState: [{ val: "Total Ops: 3", match: true }] }
    ]
  },

  // ── 248. MINIMUM NUMBER OF DELETIONS TO MAKE A STRING PALINDROME ──
  "minimum number of deletions to make a string palindrome": {
    solutionJS: `function minDeletions(s) {
  let n = s.length;
  let rev = s.split('').reverse().join('');
  let dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === rev[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  let lps = dp[n][n];
  return n - lps;
}`,
    solutionPY: `def minDeletions(s: str) -> int:
    n = len(s)
    rev = s[::-1]
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if s[i - 1] == rev[j - 1]: dp[i][j] = 1 + dp[i - 1][j - 1]
            else: dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    lps = dp[n][n]
    return n - lps`,
    solutionCPP: `int minDeletions(string s) {
    int n = s.length();
    string rev = s;
    reverse(rev.begin(), rev.end());
    vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (s[i - 1] == rev[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    int lps = dp[n][n];
    return n - lps;
}`,
    visualizerSteps: [
      { line: 1, code: "function minDeletions(s = 'aebcbda') {", vars: { s: "'aebcbda'", rev: "'adbcbea'" }, log: "Initialize s = 'aebcbda'. Compute Longest Palindromic Subsequence (LPS = LCS(s, rev(s))).", arrayState: [{ val: "LPS: 'abcba' (5)" }] },
      { line: 10, code: "  lps = 5 ('abcba'); min deletions = len(7) - lps(5) = 2;", vars: { lps: "5", minDeletions: "2" }, log: "LPS is 'abcba' (length 5). Deleting 2 characters ('e' and 'd') yields palindrome 'abcba'.", arrayState: [{ val: "LPS Length: 5", match: true }, { val: "Min Deletions: 2", match: true }] },
      { line: 12, code: "  return 2; // MIN DELETIONS FOR PALINDROME COMPLETE", vars: { status: "COMPLETE" }, log: "Minimum number of deletions to make a string palindrome complete!", arrayState: [{ val: "Min Deletions: 2", match: true }] }
    ]
  },

  // ── 249. 0 - 1 KNAPSACK PROBLEM ──
  "0 - 1 knapsack problem": {
    solutionJS: `function knapSack(W, wt, val, n) {
  let dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (wt[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], val[i - 1] + dp[i - 1][w - wt[i - 1]]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][W];
}`,
    solutionPY: `def knapSack(W: int, wt: List[int], val: List[int], n: int) -> int:
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if wt[i - 1] <= w:
                dp[i][w] = max(dp[i - 1][w], val[i - 1] + dp[i - 1][w - wt[i - 1]])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]`,
    solutionCPP: `int knapSack(int W, int wt[], int val[], int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w) dp[i][w] = max(dp[i - 1][w], val[i - 1] + dp[i - 1][w - wt[i - 1]]);
            else dp[i][w] = dp[i - 1][w];
        }
    }
    return dp[n][W];
}`,
    visualizerSteps: [
      { line: 1, code: "function knapSack(W = 6, wt = [1, 2, 3], val = [10, 15, 40], n = 3) {", vars: { W: "6", items: "3" }, log: "Initialize 0-1 Knapsack DP matrix for capacity W = 6.", arrayState: [{ val: "Item 1 (wt:1, val:10)" }, { val: "Item 2 (wt:2, val:15)" }, { val: "Item 3 (wt:3, val:40)" }] },
      { line: 6, code: "  dp[3][6] = include all 3 items (total wt 6 <= 6) -> val = 10 + 15 + 40 = 65;", vars: { maxVal: "65", totalWeight: "6" }, log: "Optimal selection includes items 1, 2, 3 (total weight 6 <= capacity 6). Max value = 65.", arrayState: [{ val: "Item 1: 10", match: true }, { val: "Item 2: 15", match: true }, { val: "Item 3: 40", match: true }, { val: "Total: 65", match: true }] },
      { line: 12, code: "  return 65; // 0-1 KNAPSACK COMPLETE", vars: { status: "COMPLETE" }, log: "0 - 1 Knapsack Problem complete!", arrayState: [{ val: "Max Value: 65", match: true }] }
    ]
  },

  // ── 250. BEST TIME TO BUY AND SELL STOCK II ──
  "best time to buy and sell stock ii": {
    solutionJS: `function maxProfit(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }
  return profit;
}`,
    solutionPY: `def maxProfit(prices: List[int]) -> int:
    profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            profit += prices[i] - prices[i - 1]
    return profit`,
    solutionCPP: `int maxProfit(vector<int>& prices) {
    int profit = 0;
    for (size_t i = 1; i < prices.size(); i++) {
        if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
    }
    return profit;
}`,
    visualizerSteps: [
      { line: 1, code: "function maxProfit(prices = [7, 1, 5, 3, 6, 4]) {", vars: { prices: "[7, 1, 5, 3, 6, 4]" }, log: "Initialize stock prices [7, 1, 5, 3, 6, 4]. Greedy peak-valley profit accumulation.", arrayState: [{ val: "Buy at 1, sell at 5: +4" }, { val: "Buy at 3, sell at 6: +3" }] },
      { line: 4, code: "  transactions: (5-1) + (6-3) = 4 + 3 = 7 total profit;", vars: { profit1: "4", profit2: "3", totalProfit: "7" }, log: "Greedy accumulation: Buy at 1 & sell at 5 (+4 profit), Buy at 3 & sell at 6 (+3 profit). Total = 7.", arrayState: [{ val: "T1 Profit: 4", match: true }, { val: "T2 Profit: 3", match: true }, { val: "Total Profit: 7", match: true }] },
      { line: 7, code: "  return 7; // BEST TIME TO BUY AND SELL STOCK II COMPLETE", vars: { status: "COMPLETE" }, log: "Best Time to Buy and Sell Stock II complete!", arrayState: [{ val: "Max Profit: 7", match: true }] }
    ]
  },

  // ── 251. BEST TIME TO BUY AND SELL STOCK WITH COOLDOWN ──
  "best time to buy and sell stock with cooldown": {
    solutionJS: `function maxProfit(prices) {
  let held = -Infinity, sold = 0, reset = 0;
  for (let price of prices) {
    let prevSold = sold;
    sold = held + price;
    held = Math.max(held, reset - price);
    reset = Math.max(reset, prevSold);
  }
  return Math.max(sold, reset);
}`,
    solutionPY: `def maxProfit(prices: List[int]) -> int:
    held, sold, reset = float('-inf'), 0, 0
    for price in prices:
        prev_sold = sold
        sold = held + price
        held = max(held, reset - price)
        reset = max(reset, prev_sold)
    return max(sold, reset)`,
    solutionCPP: `int maxProfit(vector<int>& prices) {
    int held = INT_MIN, sold = 0, reset = 0;
    for (int price : prices) {
        int prevSold = sold;
        sold = (held == INT_MIN) ? INT_MIN : held + price;
        held = max(held, reset - price);
        reset = max(reset, prevSold);
    }
    return max(sold, reset);
}`,
    visualizerSteps: [
      { line: 1, code: "function maxProfit(prices = [1, 2, 3, 0, 2]) {", vars: { prices: "[1, 2, 3, 0, 2]" }, log: "Initialize state machine DP (held, sold, reset) with 1-day cooldown after selling.", arrayState: [{ val: "Day 0: Buy 1" }, { val: "Day 1: Sell 2 (+1)" }, { val: "Day 2: Cooldown" }, { val: "Day 3: Buy 0" }, { val: "Day 4: Sell 2 (+2)" }] },
      { line: 5, code: "  optimal trades: Buy 1->Sell 2 (cooldown) -> Buy 0->Sell 2 -> total profit = 3;", vars: { maxProfit: "3" }, log: "State machine transitions: Buy at 1, sell at 2 (+1), cooldown, buy at 0, sell at 2 (+2). Total = 3.", arrayState: [{ val: "Trade 1: +1", match: true }, { val: "Cooldown", match: true }, { val: "Trade 2: +2", match: true }, { val: "Max Profit: 3", match: true }] },
      { line: 9, code: "  return 3; // STOCK WITH COOLDOWN COMPLETE", vars: { status: "COMPLETE" }, log: "Best Time to Buy and Sell Stock with Cooldown complete!", arrayState: [{ val: "Max Profit: 3", match: true }] }
    ]
  },

  // ── 252. COIN CHANGE ──
  "coin change": {
    solutionJS: `function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    solutionPY: `def coinChange(coins: List[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], 1 + dp[i - coin])
    return dp[amount] if dp[amount] != float('inf') else -1`,
    solutionCPP: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            dp[i] = min(dp[i], 1 + dp[i - coin]);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    visualizerSteps: [
      { line: 1, code: "function coinChange(coins = [1, 2, 5], amount = 11) {", vars: { coins: "[1, 2, 5]", amount: "11" }, log: "Initialize DP array for amount = 11. Recurrence: min(dp[i], 1 + dp[i - coin]).", arrayState: [{ val: "5 + 5 + 1 = 11" }, { val: "Coins count: 3" }] },
      { line: 5, code: "  dp[11] = 5 + 5 + 1 = 3 coins minimum;", vars: { coinCombination: "[5, 5, 1]", minCoins: "3" }, log: "Unbounded DP evaluation: amount 11 is formed by coins [5, 5, 1] using minimum 3 coins.", arrayState: [{ val: "Coin 5", match: true }, { val: "Coin 5", match: true }, { val: "Coin 1", match: true }, { val: "Total Coins: 3", match: true }] },
      { line: 8, code: "  return 3; // COIN CHANGE COMPLETE", vars: { status: "COMPLETE" }, log: "Coin Change complete!", arrayState: [{ val: "Min Coins: 3", match: true }] }
    ]
  },

  // ── 253. COIN CHANGE II ──
  "coin change ii": {
    solutionJS: `function change(amount, coins) {
  let dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  for (let coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] += dp[i - coin];
    }
  }
  return dp[amount];
}`,
    solutionPY: `def change(amount: int, coins: List[int]) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    return dp[amount]`,
    solutionCPP: `int change(int amount, vector<int>& coins) {
    vector<int> dp(amount + 1, 0);
    dp[0] = 1;
    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            dp[i] += dp[i - coin];
        }
    }
    return dp[amount];
}`,
    visualizerSteps: [
      { line: 1, code: "function change(amount = 5, coins = [1, 2, 5]) {", vars: { amount: "5", coins: "[1, 2, 5]" }, log: "Initialize DP for total combinations making amount 5. Recurrence: dp[i] += dp[i - coin].", arrayState: [{ val: "[5]" }, { val: "[2,2,1]" }, { val: "[2,1,1,1]" }, { val: "[1,1,1,1,1]" }] },
      { line: 5, code: "  combinations making 5: [5], [2,2,1], [2,1,1,1], [1,1,1,1,1] -> total 4 ways;", vars: { combinationsCount: "4" }, log: "Unbounded DP combination count finds 4 distinct ways to form amount 5.", arrayState: [{ val: "[5]", match: true }, { val: "[2,2,1]", match: true }, { val: "[2,1,1,1]", match: true }, { val: "[1,1,1,1,1]", match: true }] },
      { line: 8, code: "  return 4; // COIN CHANGE II COMPLETE", vars: { totalWays: "4", status: "COMPLETE" }, log: "Coin Change II complete!", arrayState: [{ val: "Total Combinations: 4", match: true }] }
    ]
  },

  // ── 254. COMBINATION SUM IV ──
  "combination sum iv": {
    solutionJS: `function combinationSum4(nums, target) {
  let dp = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= target; i++) {
    for (let num of nums) {
      if (i >= num) dp[i] += dp[i - num];
    }
  }
  return dp[target];
}`,
    solutionPY: `def combinationSum4(nums: List[int], target: int) -> int:
    dp = [0] * (target + 1)
    dp[0] = 1
    for i in range(1, target + 1):
        for num in nums:
            if i >= num: dp[i] += dp[i - num]
    return dp[target]`,
    solutionCPP: `int combinationSum4(vector<int>& nums, int target) {
    vector<unsigned int> dp(target + 1, 0);
    dp[0] = 1;
    for (int i = 1; i <= target; i++) {
        for (int num : nums) {
            if (i >= num) dp[i] += dp[i - num];
        }
    }
    return dp[target];
}`,
    visualizerSteps: [
      { line: 1, code: "function combinationSum4(nums = [1, 2, 3], target = 4) {", vars: { target: "4", nums: "[1, 2, 3]" }, log: "Initialize 1D DP table for target = 4. Order matters (permutations). Recurrence: dp[i] += dp[i - num].", arrayState: [{ val: "dp[0]: 1" }, { val: "dp[1]: 1" }, { val: "dp[2]: 2" }, { val: "dp[3]: 4" }, { val: "dp[4]: 7" }] },
      { line: 6, code: "  dp[4] = dp[3] + dp[2] + dp[1] = 4 + 2 + 1 = 7 total combinations;", vars: { combinationsCount: "7" }, log: "DP table fills target combinations: dp[1]=1, dp[2]=2, dp[3]=4, dp[4]=7. Total permutations = 7.", arrayState: [{ val: "dp[1]=1" }, { val: "dp[2]=2" }, { val: "dp[3]=4" }, { val: "dp[4]=7", match: true }] },
      { line: 9, code: "  return 7; // COMBINATION SUM IV COMPLETE", vars: { status: "COMPLETE" }, log: "Combination Sum IV complete!", arrayState: [{ val: "7 Permutations", match: true }] }
    ]
  },

  // ── 255. DECODE WAYS ──
  "decode ways": {
    solutionJS: `function numDecodings(s) {
  if (!s || s[0] === '0') return 0;
  let n = s.length;
  let dp = new Array(n + 1).fill(0);
  dp[0] = 1; dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    let one = parseInt(s.slice(i - 1, i));
    let two = parseInt(s.slice(i - 2, i));
    if (one >= 1 && one <= 9) dp[i] += dp[i - 1];
    if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
  }
  return dp[n];
}`,
    solutionPY: `def numDecodings(s: str) -> int:
    if not s or s[0] == '0': return 0
    dp = [0] * (len(s) + 1)
    dp[0], dp[1] = 1, 1
    for i in range(2, len(s) + 1):
        one = int(s[i-1:i])
        two = int(s[i-2:i])
        if 1 <= one <= 9: dp[i] += dp[i - 1]
        if 10 <= two <= 26: dp[i] += dp[i - 2]
    return dp[len(s)]`,
    solutionCPP: `int numDecodings(string s) {
    if (s.empty() || s[0] == '0') return 0;
    int n = s.length();
    vector<int> dp(n + 1, 0);
    dp[0] = 1; dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        int one = stoi(s.substr(i - 1, 1));
        int two = stoi(s.substr(i - 2, 2));
        if (one >= 1 && one <= 9) dp[i] += dp[i - 1];
        if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
    }
    return dp[n];
}`,
    visualizerSteps: [
      { line: 1, code: "function numDecodings(s = '226') {", vars: { s: "'226'" }, log: "Initialize s = '226'. Single digit (1..9) and double digit (10..26) DP transition.", arrayState: [{ val: "'BBF'" }, { val: "'BZ'" }, { val: "'VF'" }] },
      { line: 8, code: "  decodings for '226': 'BBF' (2,2,6), 'BZ' (2,26), 'VF' (22,6) -> 3 total ways;", vars: { ways: "3" }, log: "Prefix DP finds 3 valid decodings: 'BBF' (2, 2, 6), 'BZ' (2, 26), 'VF' (22, 6). Total = 3.", arrayState: [{ val: "'BBF'", match: true }, { val: "'BZ'", match: true }, { val: "'VF'", match: true }] },
      { line: 12, code: "  return 3; // DECODE WAYS COMPLETE", vars: { status: "COMPLETE" }, log: "Decode Ways complete!", arrayState: [{ val: "3 Ways", match: true }] }
    ]
  },

  // ── 256. EDIT DISTANCE ──
  "edit distance": {
    solutionJS: `function minDistance(word1, word2) {
  let m = word1.length, n = word2.length;
  let dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}`,
    solutionPY: `def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]: dp[i][j] = dp[i - 1][j - 1]
            else: dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]`,
    solutionCPP: `int minDistance(string word1, string word2) {
    int m = word1.length(), n = word2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
        }
    }
    return dp[m][n];
}`,
    visualizerSteps: [
      { line: 1, code: "function minDistance(word1 = 'horse', word2 = 'ros') {", vars: { word1: "'horse'", word2: "'ros'" }, log: "Initialize Levenshtein Edit Distance 2D DP matrix for 'horse' -> 'ros'.", arrayState: [{ val: "Replace 'h' -> 'r'" }, { val: "Delete 'r'" }, { val: "Delete 'e'" }] },
      { line: 8, code: "  operations: replace 'h' with 'r' (rorse) -> delete 'r' (rose) -> delete 'e' (ros) = 3 ops;", vars: { ops: "3" }, log: "Optimal 3 operations: Replace 'h' with 'r' ('rorse'), delete 'r' ('rose'), delete 'e' ('ros'). Min edit distance = 3.", arrayState: [{ val: "Replace 'h'->'r'", match: true }, { val: "Delete 'r'", match: true }, { val: "Delete 'e'", match: true }, { val: "Min Distance: 3", match: true }] },
      { line: 12, code: "  return 3; // EDIT DISTANCE COMPLETE", vars: { status: "COMPLETE" }, log: "Edit Distance complete!", arrayState: [{ val: "Min Edit Distance: 3", match: true }] }
    ]
  },

  // ── 257. HOUSE ROBBER ──
  "house robber": {
    solutionJS: `function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (let num of nums) {
    let temp = Math.max(prev1, num + prev2);
    prev2 = prev1;
    prev1 = temp;
  }
  return prev1;
}`,
    solutionPY: `def rob(nums: List[int]) -> int:
    prev2, prev1 = 0, 0
    for num in nums:
        temp = max(prev1, num + prev2)
        prev2 = prev1
        prev1 = temp
    return prev1`,
    solutionCPP: `int rob(vector<int>& nums) {
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int temp = max(prev1, num + prev2);
        prev2 = prev1;
        prev1 = temp;
    }
    return prev1;
}`,
    visualizerSteps: [
      { line: 1, code: "function rob(nums = [2, 7, 9, 3, 1]) {", vars: { nums: "[2, 7, 9, 3, 1]" }, log: "Initialize House Robber DP. Recurrence: max(rob(i-1), nums[i] + rob(i-2)).", arrayState: [{ val: "Rob house 0 (2)" }, { val: "Rob house 2 (9)" }, { val: "Rob house 4 (1)" }] },
      { line: 3, code: "  optimal non-adjacent house selection: house 0(2) + house 2(9) + house 4(1) = 12;", vars: { totalRobbed: "12", selectedIndices: "[0, 2, 4]" }, log: "Optimal selection robs houses at indices 0, 2, and 4 (2 + 9 + 1 = 12). Max money robbed = 12.", arrayState: [{ val: "House 0: $2", match: true }, { val: "House 2: $9", match: true }, { val: "House 4: $1", match: true }, { val: "Total: $12", match: true }] },
      { line: 8, code: "  return 12; // HOUSE ROBBER COMPLETE", vars: { status: "COMPLETE" }, log: "House Robber complete!", arrayState: [{ val: "Max Robbed: $12", match: true }] }
    ]
  },

  // ── 258. HOUSE ROBBER II ──
  "house robber ii": {
    solutionJS: `function rob(nums) {
  if (nums.length === 1) return nums[0];
  function helper(arr) {
    let prev2 = 0, prev1 = 0;
    for (let num of arr) {
      let temp = Math.max(prev1, num + prev2);
      prev2 = prev1; prev1 = temp;
    }
    return prev1;
  }
  return Math.max(helper(nums.slice(0, nums.length - 1)), helper(nums.slice(1)));
}`,
    solutionPY: `def rob(nums: List[int]) -> int:
    if len(nums) == 1: return nums[0]
    def helper(arr):
        prev2, prev1 = 0, 0
        for num in arr:
            temp = max(prev1, num + prev2)
            prev2, prev1 = prev1, temp
        return prev1
    return max(helper(nums[:-1]), helper(nums[1:]))`,
    solutionCPP: `int rob(vector<int>& nums) {
    if (nums.size() == 1) return nums[0];
    auto helper = [&](int start, int end) {
        int prev2 = 0, prev1 = 0;
        for (int i = start; i <= end; i++) {
            int temp = max(prev1, nums[i] + prev2);
            prev2 = prev1; prev1 = temp;
        }
        return prev1;
    };
    return max(helper(0, nums.size() - 2), helper(1, nums.size() - 1));
}`,
    visualizerSteps: [
      { line: 1, code: "function rob(nums = [2, 3, 2]) {", vars: { nums: "[2, 3, 2]" }, log: "Circular House Robber II. Split into 2 linear cases: exclude last vs exclude first.", arrayState: [{ val: "Case 1: [2, 3] -> 3" }, { val: "Case 2: [3, 2] -> 3" }] },
      { line: 10, code: "  max(helper(nums[0..n-2]), helper(nums[1..n-1])) = max(3, 3) = 3;", vars: { case1Max: "3", case2Max: "3", overallMax: "3" }, log: "Case 1 (exclude last) yields 3; Case 2 (exclude first) yields 3. Max money robbed = 3.", arrayState: [{ val: "Case 1 Max: $3", match: true }, { val: "Case 2 Max: $3", match: true }, { val: "Overall Max: $3", match: true }] },
      { line: 11, code: "  return 3; // HOUSE ROBBER II COMPLETE", vars: { status: "COMPLETE" }, log: "House Robber II complete!", arrayState: [{ val: "Max Robbed: $3", match: true }] }
    ]
  },

  // ── 259. HOUSE ROBBER III ──
  "house robber iii": {
    solutionJS: `function rob(root) {
  function dfs(node) {
    if (!node) return [0, 0];
    let left = dfs(node.left);
    let right = dfs(node.right);
    let robNode = node.val + left[1] + right[1];
    let skipNode = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
    return [robNode, skipNode];
  }
  let res = dfs(root);
  return Math.max(res[0], res[1]);
}`,
    solutionPY: `def rob(root: Optional[TreeNode]) -> int:
    def dfs(node):
        if not node: return (0, 0)
        left = dfs(node.left)
        right = dfs(node.right)
        rob_node = node.val + left[1] + right[1]
        skip_node = max(left) + max(right)
        return (rob_node, skip_node)
    res = dfs(root)
    return max(res)`,
    solutionCPP: `int rob(TreeNode* root) {
    function<pair<int, int>(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return make_pair(0, 0);
        auto left = dfs(node->left);
        auto right = dfs(node->right);
        int robNode = node->val + left.second + right.second;
        int skipNode = max(left.first, left.second) + max(right.first, right.second);
        return make_pair(robNode, skipNode);
    };
    auto res = dfs(root);
    return max(res.first, res.second);
}`,
    visualizerSteps: [
      { line: 1, code: "function rob(root Binary Tree) {", vars: { root: "3" }, log: "Initialize Tree DP. Post-order DFS returns [robNode, skipNode] pairs.", arrayState: [{ val: "Left: [2, 3]" }, { val: "Right: [3, 1]" }] },
      { line: 6, code: "  robRoot = 3 + 3 + 1 = 7; skipRoot = max(2,3) + max(3,1) = 6 -> max = 7;", vars: { robRoot: "7", skipRoot: "6", maxMoney: "7" }, log: "Post-order tree DP: robRoot (7) vs skipRoot (6). Max money robbed = 7.", arrayState: [{ val: "Rob Root: $7", match: true }, { val: "Skip Root: $6" }, { val: "Max Robbed: $7", match: true }] },
      { line: 11, code: "  return 7; // HOUSE ROBBER III COMPLETE", vars: { status: "COMPLETE" }, log: "House Robber III complete!", arrayState: [{ val: "Max Robbed: $7", match: true }] }
    ]
  },

  // ── 260. INTERLEAVING STRING ──
  "interleaving string": {
    solutionJS: `function isInterleave(s1, s2, s3) {
  if (s1.length + s2.length !== s3.length) return false;
  let dp = Array.from({ length: s1.length + 1 }, () => new Array(s2.length + 1).fill(false));
  dp[0][0] = true;
  for (let i = 0; i <= s1.length; i++) {
    for (let j = 0; j <= s2.length; j++) {
      if (i > 0 && s1[i - 1] === s3[i + j - 1]) dp[i][j] = dp[i][j] || dp[i - 1][j];
      if (j > 0 && s2[j - 1] === s3[i + j - 1]) dp[i][j] = dp[i][j] || dp[i][j - 1];
    }
  }
  return dp[s1.length][s2.length];
}`,
    solutionPY: `def isInterleave(s1: str, s2: str, s3: str) -> bool:
    if len(s1) + len(s2) != len(s3): return False
    dp = [[False] * (len(s2) + 1) for _ in range(len(s1) + 1)]
    dp[0][0] = True
    for i in range(len(s1) + 1):
        for j in range(len(s2) + 1):
            if i > 0 and s1[i - 1] == s3[i + j - 1]: dp[i][j] = dp[i][j] or dp[i - 1][j]
            if j > 0 and s2[j - 1] == s3[i + j - 1]: dp[i][j] = dp[i][j] or dp[i][j - 1]
    return dp[len(s1)][len(s2)]`,
    solutionCPP: `bool isInterleave(string s1, string s2, string s3) {
    if (s1.length() + s2.length() != s3.length()) return false;
    vector<vector<bool>> dp(s1.length() + 1, vector<bool>(s2.length() + 1, false));
    dp[0][0] = true;
    for (size_t i = 0; i <= s1.length(); i++) {
        for (size_t j = 0; j <= s2.length(); j++) {
            if (i > 0 && s1[i - 1] == s3[i + j - 1]) dp[i][j] = dp[i][j] || dp[i - 1][j];
            if (j > 0 && s2[j - 1] == s3[i + j - 1]) dp[i][j] = dp[i][j] || dp[i][j - 1];
        }
    }
    return dp[s1.length()][s2.length()];
}`,
    visualizerSteps: [
      { line: 1, code: "function isInterleave(s1 = 'aabcc', s2 = 'dbbca', s3 = 'aadbbcbcac') {", vars: { s1: "'aabcc'", s2: "'dbbca'", s3: "'aadbbcbcac'" }, log: "Verify len(s1)+len(s2) === len(s3) (10 === 10). 2D DP interleaving matrix.", arrayState: [{ val: "s1: 'aabcc'" }, { val: "s2: 'dbbca'" }, { val: "s3: 'aadbbcbcac'" }] },
      { line: 6, code: "  dp[5][5] = true -> s3 'aadbbcbcac' is a valid interleaving of s1 and s2;", vars: { isInterleaving: "true" }, log: "2D DP matrix transitions verify character order: s3 is a valid interleaving of s1 and s2.", arrayState: [{ val: "dp[5][5]: true", match: true }] },
      { line: 11, code: "  return true; // INTERLEAVING STRING COMPLETE", vars: { status: "COMPLETE" }, log: "Interleaving String complete!", arrayState: [{ val: "Valid Interleaving", match: true }] }
    ]
  },

  // ── 261. JUMP GAME ──
  "jump game": {
    solutionJS: `function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}`,
    solutionPY: `def canJump(nums: List[int]) -> bool:
    max_reach = 0
    for i, num in enumerate(nums):
        if i > max_reach: return False
        max_reach = max(max_reach, i + num)
    return True`,
    solutionCPP: `bool canJump(vector<int>& nums) {
    int maxReach = 0;
    for (size_t i = 0; i < nums.size(); i++) {
        if ((int)i > maxReach) return false;
        maxReach = max(maxReach, (int)i + nums[i]);
    }
    return true;
}`,
    visualizerSteps: [
      { line: 1, code: "function canJump(nums = [2, 3, 1, 1, 4]) {", vars: { nums: "[2, 3, 1, 1, 4]" }, log: "Initialize Greedy maxReach tracking for array [2, 3, 1, 1, 4].", arrayState: [{ val: "Idx 0: jump 2 (reach 2)" }, { val: "Idx 1: jump 3 (reach 4)" }] },
      { line: 4, code: "  idx 0 reach=2 -> idx 1 reach=1+3=4 >= last index(4) -> can reach end;", vars: { maxReach: "4", lastIdx: "4" }, log: "Greedy maxReach reaches index 4 at position 1. Last index 4 is reachable!", arrayState: [{ val: "Max Reach: 4", match: true }, { val: "Last Index Reached", match: true }] },
      { line: 6, code: "  return true; // JUMP GAME COMPLETE", vars: { canJump: "true", status: "COMPLETE" }, log: "Jump Game complete!", arrayState: [{ val: "Can Reach End", match: true }] }
    ]
  },

  // ── 262. KNAPSACK WITH DUPLICATE ITEMS ──
  "knapsack with duplicate items": {
    solutionJS: `function knapSack(N, W, val, wt) {
  let dp = new Array(W + 1).fill(0);
  for (let w = 1; w <= W; w++) {
    for (let i = 0; i < N; i++) {
      if (wt[i] <= w) {
        dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);
      }
    }
  }
  return dp[W];
}`,
    solutionPY: `def knapSack(N: int, W: int, val: List[int], wt: List[int]) -> int:
    dp = [0] * (W + 1)
    for w in range(1, W + 1):
        for i in range(N):
            if wt[i] <= w:
                dp[w] = max(dp[w], val[i] + dp[w - i] if False else val[i] + dp[w - wt[i]])
    return dp[W]`,
    solutionCPP: `int knapSack(int N, int W, int val[], int wt[]) {
    vector<int> dp(W + 1, 0);
    for (int w = 1; w <= W; w++) {
        for (int i = 0; i < N; i++) {
            if (wt[i] <= w) dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);
        }
    }
    return dp[W];
}`,
    visualizerSteps: [
      { line: 1, code: "function knapSack(W = 10, wt = [2, 4, 6], val = [5, 11, 13]) {", vars: { W: "10", items: "3" }, log: "Initialize Unbounded Knapsack DP (unlimited items) for capacity W = 10.", arrayState: [{ val: "Item 2 twice (wt 8, val 22)" }, { val: "Item 1 once (wt 2, val 5)" }] },
      { line: 5, code: "  optimal choice: item 2 twice + item 1 once (wt 4+4+2 = 10) -> val = 11+11+5 = 27;", vars: { totalWeight: "10", maxVal: "27" }, log: "Unbounded DP allows repeating item 2 twice + item 1 once (total weight 10 <= 10). Max value = 27.", arrayState: [{ val: "Item 2 (wt 4, val 11)", match: true }, { val: "Item 2 (wt 4, val 11)", match: true }, { val: "Item 1 (wt 2, val 5)", match: true }, { val: "Total Val: 27", match: true }] },
      { line: 10, code: "  return 27; // UNBOUNDED KNAPSACK COMPLETE", vars: { status: "COMPLETE" }, log: "Knapsack with Duplicate Items complete!", arrayState: [{ val: "Max Value: 27", match: true }] }
    ]
  },

  // ── 263. LONGEST COMMON SUBSEQUENCE ──
  "longest common subsequence": {
    solutionJS: `function longestCommonSubsequence(text1, text2) {
  let m = text1.length, n = text2.length;
  let dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}`,
    solutionPY: `def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]: dp[i][j] = 1 + dp[i - 1][j - 1]
            else: dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
    solutionCPP: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.length(), n = text2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`,
    visualizerSteps: [
      { line: 1, code: "function longestCommonSubsequence(text1 = 'abcde', text2 = 'ace') {", vars: { text1: "'abcde'", text2: "'ace'" }, log: "Initialize 2D DP matrix (5x3) for LCS of 'abcde' and 'ace'.", arrayState: [{ val: "Match 'a'" }, { val: "Match 'c'" }, { val: "Match 'e'" }] },
      { line: 5, code: "  lcs matches characters 'a', 'c', 'e' -> length = 3;", vars: { lcsString: "'ace'", lcsLength: "3" }, log: "2D DP table computes matches for 'a', 'c', and 'e'. Longest Common Subsequence length = 3.", arrayState: [{ val: "'a'", match: true }, { val: "'c'", match: true }, { val: "'e'", match: true }, { val: "LCS Length: 3", match: true }] },
      { line: 10, code: "  return 3; // LONGEST COMMON SUBSEQUENCE COMPLETE", vars: { status: "COMPLETE" }, log: "Longest Common Subsequence complete!", arrayState: [{ val: "LCS Length: 3", match: true }] }
    ]
  },

  // ── 264. LONGEST COMMON SUBSTRING ──
  "longest common substring": {
    solutionJS: `function longestCommonSubstr(S1, S2) {
  let m = S1.length, n = S2.length;
  let dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  let maxLen = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (S1[i - 1] === S2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
        maxLen = Math.max(maxLen, dp[i][j]);
      } else {
        dp[i][j] = 0;
      }
    }
  }
  return maxLen;
}`,
    solutionPY: `def longestCommonSubstr(S1: str, S2: str) -> int:
    m, n = len(S1), len(S2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    max_len = 0
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if S1[i - 1] == S2[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
                max_len = max(max_len, dp[i][j])
            else:
                dp[i][j] = 0
    return max_len`,
    solutionCPP: `int longestCommonSubstr(string S1, string S2) {
    int m = S1.length(), n = S2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    int maxLen = 0;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (S1[i - 1] == S2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
                maxLen = max(maxLen, dp[i][j]);
            } else {
                dp[i][j] = 0;
            }
        }
    }
    return maxLen;
}`,
    visualizerSteps: [
      { line: 1, code: "function longestCommonSubstr(S1 = 'ABCDGH', S2 = 'ACDGHR') {", vars: { S1: "'ABCDGH'", S2: "'ACDGHR'" }, log: "Initialize 2D DP matrix for contiguous substring match.", arrayState: [{ val: "Matching 'CDGH'" }] },
      { line: 6, code: "  contiguous substring match 'CDGH' (length 4) -> maxLen = 4;", vars: { substring: "'CDGH'", maxLen: "4" }, log: "DP matrix tracks contiguous character matches for 'C','D','G','H'. Max length = 4.", arrayState: [{ val: "Matched Substring: 'CDGH'", match: true }, { val: "Length: 4", match: true }] },
      { line: 14, code: "  return 4; // LONGEST COMMON SUBSTRING COMPLETE", vars: { status: "COMPLETE" }, log: "Longest Common Substring complete!", arrayState: [{ val: "Max Substring Length: 4", match: true }] }
    ]
  },

  // ── 265. LONGEST INCREASING SUBSEQUENCE ──
  "longest increasing subsequence": {
    solutionJS: `function lengthOfLIS(nums) {
  if (!nums.length) return 0;
  let dp = new Array(nums.length).fill(1);
  let maxLen = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], 1 + dp[j]);
      }
    }
    maxLen = Math.max(maxLen, dp[i]);
  }
  return maxLen;
}`,
    solutionPY: `def lengthOfLIS(nums: List[int]) -> int:
    if not nums: return 0
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], 1 + dp[j])
    return max(dp)`,
    solutionCPP: `int lengthOfLIS(vector<int>& nums) {
    if (nums.empty()) return 0;
    vector<int> dp(nums.size(), 1);
    int maxLen = 1;
    for (size_t i = 1; i < nums.size(); i++) {
        for (size_t j = 0; j < i; j++) {
            if (nums[j] < nums[i]) dp[i] = max(dp[i], 1 + dp[j]);
        }
        maxLen = max(maxLen, dp[i]);
    }
    return maxLen;
}`,
    visualizerSteps: [
      { line: 1, code: "function lengthOfLIS(nums = [10, 9, 2, 5, 3, 7, 101, 18]) {", vars: { nums: "[10, 9, 2, 5, 3, 7, 101, 18]" }, log: "Initialize 1D DP table for LIS on array [10, 9, 2, 5, 3, 7, 101, 18].", arrayState: [{ val: "LIS: [2, 3, 7, 101]" }, { val: "Length: 4" }] },
      { line: 6, code: "  longest strictly increasing subsequence: [2, 3, 7, 101] -> length = 4;", vars: { lis: "[2, 3, 7, 101]", length: "4" }, log: "DP array computes max increasing subsequence [2, 3, 7, 101] of length 4.", arrayState: [{ val: "2", match: true }, { val: "3", match: true }, { val: "7", match: true }, { val: "101", match: true }, { val: "LIS Length: 4", match: true }] },
      { line: 12, code: "  return 4; // LONGEST INCREASING SUBSEQUENCE COMPLETE", vars: { status: "COMPLETE" }, log: "Longest Increasing Subsequence complete!", arrayState: [{ val: "LIS Length: 4", match: true }] }
    ]
  },

  // ── 266. LONGEST PALINDROMIC SUBSEQUENCE ──
  "longest palindromic subsequence": {
    solutionJS: `function longestPalindromeSubseq(s) {
  let n = s.length;
  let rev = s.split('').reverse().join('');
  let dp = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === rev[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[n][n];
}`,
    solutionPY: `def longestPalindromeSubseq(s: str) -> int:
    n = len(s)
    rev = s[::-1]
    dp = [[0] * (n + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, n + 1):
            if s[i - 1] == rev[j - 1]: dp[i][j] = 1 + dp[i - 1][j - 1]
            else: dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][n]`,
    solutionCPP: `int longestPalindromeSubseq(string s) {
    int n = s.length();
    string rev = s;
    reverse(rev.begin(), rev.end());
    vector<vector<int>> dp(n + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (s[i - 1] == rev[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[n][n];
}`,
    visualizerSteps: [
      { line: 1, code: "function longestPalindromeSubseq(s = 'bbbab') {", vars: { s: "'bbbab'", rev: "'babbb'" }, log: "Initialize s = 'bbbab'. Compute LCS(s, rev(s)).", arrayState: [{ val: "Palindromic Subsequence: 'bbbb'" }] },
      { line: 7, code: "  lps = LCS('bbbab', 'babbb') = 'bbbb' -> length = 4;", vars: { lps: "'bbbb'", length: "4" }, log: "LCS between 'bbbab' and its reverse 'babbb' yields 'bbbb' of length 4.", arrayState: [{ val: "'bbbb'", match: true }, { val: "LPS Length: 4", match: true }] },
      { line: 11, code: "  return 4; // LONGEST PALINDROMIC SUBSEQUENCE COMPLETE", vars: { status: "COMPLETE" }, log: "Longest Palindromic Subsequence complete!", arrayState: [{ val: "LPS Length: 4", match: true }] }
    ]
  },

  // ── 267. MAXIMUM PRODUCT SUBARRAY ──
  "maximum product subarray": {
    solutionJS: `function maxProduct(nums) {
  if (!nums.length) return 0;
  let maxSoFar = nums[0], currMax = nums[0], currMin = nums[0];
  for (let i = 1; i < nums.length; i++) {
    let num = nums[i];
    if (num < 0) [currMax, currMin] = [currMin, currMax];
    currMax = Math.max(num, currMax * num);
    currMin = Math.min(num, currMin * num);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  return maxSoFar;
}`,
    solutionPY: `def maxProduct(nums: List[int]) -> int:
    if not nums: return 0
    max_so_far = curr_max = curr_min = nums[0]
    for num in nums[1:]:
        if num < 0: curr_max, curr_min = curr_min, curr_max
        curr_max = max(num, curr_max * num)
        curr_min = min(num, curr_min * num)
        max_so_far = max(max_so_far, curr_max)
    return max_so_far`,
    solutionCPP: `int maxProduct(vector<int>& nums) {
    if (nums.empty()) return 0;
    int maxSoFar = nums[0], currMax = nums[0], currMin = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        int num = nums[i];
        if (num < 0) swap(currMax, currMin);
        currMax = max(num, currMax * num);
        currMin = min(num, currMin * num);
        maxSoFar = max(maxSoFar, currMax);
    }
    return maxSoFar;
}`,
    visualizerSteps: [
      { line: 1, code: "function maxProduct(nums = [2, 3, -2, 4]) {", vars: { nums: "[2, 3, -2, 4]" }, log: "Initialize max/min tracking for array [2, 3, -2, 4]. Handles negative multiplication sign swaps.", arrayState: [{ val: "Idx 0: max 2, min 2" }, { val: "Idx 1: max 6, min 3" }, { val: "Idx 2: max -2, min -12" }, { val: "Idx 3: max 4, min -48" }] },
      { line: 5, code: "  max product subarray = [2, 3] with product 2 * 3 = 6;", vars: { maxProduct: "6", subarray: "[2, 3]" }, log: "Track max/min products: Subarray [2, 3] gives maximum product 6.", arrayState: [{ val: "2", match: true }, { val: "3", match: true }, { val: "Max Product: 6", match: true }] },
      { line: 11, code: "  return 6; // MAXIMUM PRODUCT SUBARRAY COMPLETE", vars: { status: "COMPLETE" }, log: "Maximum Product Subarray complete!", arrayState: [{ val: "Max Product: 6", match: true }] }
    ]
  },

  // ── 268. MAXIMUM SUBARRAY ──
  "maximum subarray": {
    solutionJS: `function maxSubArray(nums) {
  let maxSoFar = nums[0], currSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currSum = Math.max(nums[i], currSum + nums[i]);
    maxSoFar = Math.max(maxSoFar, currSum);
  }
  return maxSoFar;
}`,
    solutionPY: `def maxSubArray(nums: List[int]) -> int:
    max_so_far = curr_sum = nums[0]
    for num in nums[1:]:
        curr_sum = max(num, curr_sum + num)
        max_so_far = max(max_so_far, curr_sum)
    return max_so_far`,
    solutionCPP: `int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0], currSum = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        currSum = max(nums[i], currSum + nums[i]);
        maxSoFar = max(maxSoFar, currSum);
    }
    return maxSoFar;
}`,
    visualizerSteps: [
      { line: 1, code: "function maxSubArray(nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]) {", vars: { nums: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]" }, log: "Initialize Kadane's Algorithm for max contiguous subarray sum.", arrayState: [{ val: "Subarray: [4, -1, 2, 1]" }, { val: "Sum: 6" }] },
      { line: 3, code: "  Kadane's max subarray = [4, -1, 2, 1] with sum 4 + (-1) + 2 + 1 = 6;", vars: { maxSubarraySum: "6", subarray: "[4, -1, 2, 1]" }, log: "Kadane's algorithm identifies contiguous subarray [4, -1, 2, 1] with maximum sum 6.", arrayState: [{ val: "4", match: true }, { val: "-1", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "Max Sum: 6", match: true }] },
      { line: 7, code: "  return 6; // MAXIMUM SUBARRAY COMPLETE", vars: { status: "COMPLETE" }, log: "Maximum Subarray complete!", arrayState: [{ val: "Max Sum: 6", match: true }] }
    ]
  },

  // ── 269. MAXIMUM PATH SUM IN MATRIX ──
  "maximum path sum in matrix": {
    solutionJS: `function maximumPath(N, Matrix) {
  let dp = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let c = 0; c < N; c++) dp[N - 1][c] = Matrix[N - 1][c];
  for (let r = N - 2; r >= 0; r--) {
    for (let c = 0; c < N; c++) {
      let down = dp[r + 1][c];
      let leftDiag = c > 0 ? dp[r + 1][c - 1] : 0;
      let rightDiag = c < N - 1 ? dp[r + 1][c + 1] : 0;
      dp[r][c] = Matrix[r][c] + Math.max(down, leftDiag, rightDiag);
    }
  }
  return Math.max(...dp[0]);
}`,
    solutionPY: `def maximumPath(N: int, Matrix: List[List[int]]) -> int:
    dp = [row[:] for row in Matrix]
    for r in range(N - 2, -1, -1):
        for c in range(N):
            down = dp[r + 1][c]
            left_diag = dp[r + 1][c - 1] if c > 0 else 0
            right_diag = dp[r + 1][c + 1] if c < N - 1 else 0
            dp[r][c] += max(down, left_diag, right_diag)
    return max(dp[0])`,
    solutionCPP: `int maximumPath(int N, vector<vector<int>> Matrix) {
    vector<vector<int>> dp = Matrix;
    for (int r = N - 2; r >= 0; r--) {
        for (int c = 0; c < N; c++) {
            int down = dp[r + 1][c];
            int leftDiag = c > 0 ? dp[r + 1][c - 1] : 0;
            int rightDiag = c < N - 1 ? dp[r + 1][c + 1] : 0;
            dp[r][c] += max({down, leftDiag, rightDiag});
        }
    }
    return *max_element(dp[0].begin(), dp[0].end());
}`,
    visualizerSteps: [
      { line: 1, code: "function maximumPath(N = 3, Matrix = [[1,2,3],[9,8,7],[4,5,6]]) {", vars: { N: "3" }, log: "Initialize 3x3 matrix. Bottom-up DP for max path sum (moves: down, left-diag, right-diag).", arrayState: [{ val: "Row 2: [4, 5, 6]" }, { val: "Row 1: [14, 14, 13]" }, { val: "Row 0: [15, 16, 17]" }] },
      { line: 6, code: "  optimal top-to-bottom path: 3 -> 8 -> 6 or 3 -> 7 -> 6 -> max sum = 17;", vars: { maxPathSum: "17", path: "3 -> 8 -> 6" }, log: "DP table computes optimal path 3 -> 8 -> 6 with maximum path sum = 17.", arrayState: [{ val: "3", match: true }, { val: "8", match: true }, { val: "6", match: true }, { val: "Max Path Sum: 17", match: true }] },
      { line: 12, code: "  return 17; // MAXIMUM PATH SUM IN MATRIX COMPLETE", vars: { status: "COMPLETE" }, log: "Maximum path sum in matrix complete!", arrayState: [{ val: "Max Path Sum: 17", match: true }] }
    ]
  },

  // ── 270. MINIMUM PATH SUM ──
  "minimum path sum": {
    solutionJS: `function minPathSum(grid) {
  let m = grid.length, n = grid[0].length;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (r === 0 && c === 0) continue;
      else if (r === 0) grid[r][c] += grid[r][c - 1];
      else if (c === 0) grid[r][c] += grid[r - 1][c];
      else grid[r][c] += Math.min(grid[r - 1][c], grid[r][c - 1]);
    }
  }
  return grid[m - 1][n - 1];
}`,
    solutionPY: `def minPathSum(grid: List[List[int]]) -> int:
    m, n = len(grid), len(grid[0])
    for r in range(m):
        for c in range(n):
            if r == 0 and c == 0: continue
            elif r == 0: grid[r][c] += grid[r][c - 1]
            elif c == 0: grid[r][c] += grid[r - 1][c]
            else: grid[r][c] += min(grid[r - 1][c], grid[r][c - 1])
    return grid[m - 1][n - 1]`,
    solutionCPP: `int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (r == 0 && c == 0) continue;
            else if (r == 0) grid[r][c] += grid[r][c - 1];
            else if (c == 0) grid[r][c] += grid[r - 1][c];
            else grid[r][c] += min(grid[r - 1][c], grid[r][c - 1]);
        }
    }
    return grid[m - 1][n - 1];
}`,
    visualizerSteps: [
      { line: 1, code: "function minPathSum(grid = [[1,3,1],[1,5,1],[4,2,1]]) {", vars: { m: "3", n: "3" }, log: "Initialize 3x3 grid. 2D DP min path sum (moves: right, down).", arrayState: [{ val: "1 -> 3 -> 1 -> 1 -> 1" }, { val: "Total: 7" }] },
      { line: 7, code: "  optimal path: 1 -> 3 -> 1 -> 1 -> 1 -> min path sum = 7;", vars: { minSum: "7", path: "1 -> 3 -> 1 -> 1 -> 1" }, log: "Grid DP computes path 1 -> 3 -> 1 -> 1 -> 1 with minimum path sum = 7.", arrayState: [{ val: "1", match: true }, { val: "3", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "Min Path Sum: 7", match: true }] },
      { line: 10, code: "  return 7; // MINIMUM PATH SUM COMPLETE", vars: { status: "COMPLETE" }, log: "Minimum Path Sum complete!", arrayState: [{ val: "Min Path Sum: 7", match: true }] }
    ]
  },

  // ── 271. PARTITION EQUAL SUBSET SUM ──
  "partition equal subset sum": {
    solutionJS: `function canPartition(nums) {
  let sum = nums.reduce((a, b) => a + b, 0);
  if (sum % 2 !== 0) return false;
  let target = sum / 2;
  let dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (let num of nums) {
    for (let i = target; i >= num; i--) {
      dp[i] = dp[i] || dp[i - num];
    }
  }
  return dp[target];
}`,
    solutionPY: `def canPartition(nums: List[int]) -> bool:
    total_sum = sum(nums)
    if total_sum % 2 != 0: return False
    target = total_sum // 2
    dp = {0}
    for num in nums:
        dp |= {num + x for x in dp if num + x <= target}
    return target in dp`,
    solutionCPP: `bool canPartition(vector<int>& nums) {
    int sum = accumulate(nums.begin(), nums.end(), 0);
    if (sum % 2 != 0) return false;
    int target = sum / 2;
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int num : nums) {
        for (int i = target; i >= num; i--) {
            dp[i] = dp[i] || dp[i - num];
        }
    }
    return dp[target];
}`,
    visualizerSteps: [
      { line: 1, code: "function canPartition(nums = [1, 5, 11, 5]) {", vars: { totalSum: "22", target: "11" }, log: "Total sum = 22 (even). Target subset sum = 11. 1D Subset Sum DP.", arrayState: [{ val: "Subset 1: {1, 5, 5} = 11" }, { val: "Subset 2: {11} = 11" }] },
      { line: 8, code: "  subsets with sum 11 exist: {1, 5, 5} and {11} -> return true;", vars: { subset1: "[1, 5, 5]", subset2: "[11]", canPartition: "true" }, log: "Subset sum DP verifies target 11 is achievable. Array can be partitioned equally!", arrayState: [{ val: "Subset 1: {1, 5, 5}", match: true }, { val: "Subset 2: {11}", match: true }] },
      { line: 11, code: "  return true; // PARTITION EQUAL SUBSET SUM COMPLETE", vars: { status: "COMPLETE" }, log: "Partition Equal Subset Sum complete!", arrayState: [{ val: "Partition Feasible", match: true }] }
    ]
  },

  // ── 272. ROD CUTTING ──
  "rod cutting": {
    solutionJS: `function cutRod(price, n) {
  let dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      dp[i] = Math.max(dp[i], price[j - 1] + dp[i - j]);
    }
  }
  return dp[n];
}`,
    solutionPY: `def cutRod(price: List[int], n: int) -> int:
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        for j in range(1, i + 1):
            dp[i] = max(dp[i], price[j - 1] + dp[i - j])
    return dp[n]`,
    solutionCPP: `int cutRod(vector<int>& price, int n) {
    vector<int> dp(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            dp[i] = max(dp[i], price[j - 1] + dp[i - j]);
        }
    }
    return dp[n];
}`,
    visualizerSteps: [
      { line: 1, code: "function cutRod(price = [1, 5, 8, 9, 10, 17, 17, 20], n = 8) {", vars: { n: "8", pricesCount: "8" }, log: "Initialize Unbounded DP for rod cutting of length N = 8.", arrayState: [{ val: "Piece 1: len 2 (cost 5)" }, { val: "Piece 2: len 6 (cost 17)" }] },
      { line: 5, code: "  optimal cuts: length 2 (price 5) + length 6 (price 17) -> total price = 22;", vars: { maxProfit: "22", cuts: "[2, 6]" }, log: "Rod cutting DP finds optimal cuts of length 2 ($5) and length 6 ($17). Max profit = 22.", arrayState: [{ val: "Cut len 2: $5", match: true }, { val: "Cut len 6: $17", match: true }, { val: "Total Profit: 22", match: true }] },
      { line: 8, code: "  return 22; // ROD CUTTING COMPLETE", vars: { status: "COMPLETE" }, log: "Rod Cutting complete!", arrayState: [{ val: "Max Profit: 22", match: true }] }
    ]
  },

  // ── 273. SHORTEST COMMON SUPERSEQUENCE ──
  "shortest common supersequence": {
    solutionJS: `function shortestCommonSupersequence(str1, str2) {
  let m = str1.length, n = str2.length;
  let dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  let res = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) { res.push(str1[i - 1]); i--; j--; }
    else if (dp[i - 1][j] > dp[i][j - 1]) { res.push(str1[i - 1]); i--; }
    else { res.push(str2[j - 1]); j--; }
  }
  while (i > 0) { res.push(str1[i - 1]); i--; }
  while (j > 0) { res.push(str2[j - 1]); j--; }
  return res.reverse().join('');
}`,
    solutionPY: `def shortestCommonSupersequence(str1: str, str2: str) -> str:
    m, n = len(str1), len(str2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i - 1] == str2[j - 1]: dp[i][j] = 1 + dp[i - 1][j - 1]
            else: dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    res = []
    i, j = m, n
    while i > 0 and j > 0:
        if str1[i - 1] == str2[j - 1]: res.append(str1[i - 1]); i -= 1; j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]: res.append(str1[i - 1]); i -= 1
        else: res.append(str2[j - 1]); j -= 1
    while i > 0: res.append(str1[i - 1]); i -= 1
    while j > 0: res.append(str2[j - 1]); j -= 1
    return "".join(reversed(res))`,
    solutionCPP: `string shortestCommonSupersequence(string str1, string str2) {
    int m = str1.length(), n = str2.length();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (str1[i - 1] == str2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    string res = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (str1[i - 1] == str2[j - 1]) { res += str1[i - 1]; i--; j--; }
        else if (dp[i - 1][j] > dp[i][j - 1]) { res += str1[i - 1]; i--; }
        else { res += str2[j - 1]; j--; }
    }
    while (i > 0) { res += str1[i - 1]; i--; }
    while (j > 0) { res += str2[j - 1]; j--; }
    reverse(res.begin(), res.end());
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function shortestCommonSupersequence(str1 = 'abac', str2 = 'cab') {", vars: { str1: "'abac'", str2: "'cab'" }, log: "Initialize LCS DP matrix and backtrack for shortest common supersequence.", arrayState: [{ val: "LCS: 'ab'" }, { val: "Supersequence: 'cabac'" }] },
      { line: 18, code: "  shortest supersequence containing both 'abac' and 'cab' is 'cabac' (len 5);", vars: { scs: "'cabac'", length: "5" }, log: "LCS backtracking merges non-overlapping characters into shortest common supersequence 'cabac'.", arrayState: [{ val: "Supersequence: 'cabac'", match: true }, { val: "Length: 5", match: true }] },
      { line: 20, code: "  return 'cabac'; // SHORTEST COMMON SUPERSEQUENCE COMPLETE", vars: { status: "COMPLETE" }, log: "Shortest Common Supersequence complete!", arrayState: [{ val: "SCS: 'cabac'", match: true }] }
    ]
  },

  // ── 274. SUBSET SUM PROBLEM ──
  "subset sum problem": {
    solutionJS: `function isSubsetSum(arr, sum) {
  let n = arr.length;
  let dp = new Array(sum + 1).fill(false);
  dp[0] = true;
  for (let num of arr) {
    for (let i = sum; i >= num; i--) {
      dp[i] = dp[i] || dp[i - num];
    }
  }
  return dp[sum];
}`,
    solutionPY: `def isSubsetSum(arr: List[int], sum: int) -> bool:
    dp = {0}
    for num in arr:
        dp |= {num + x for x in dp if num + x <= sum}
    return sum in dp`,
    solutionCPP: `bool isSubsetSum(vector<int>& arr, int sum) {
    vector<bool> dp(sum + 1, false);
    dp[0] = true;
    for (int num : arr) {
        for (int i = sum; i >= num; i--) {
            dp[i] = dp[i] || dp[i - num];
        }
    }
    return dp[sum];
}`,
    visualizerSteps: [
      { line: 1, code: "function isSubsetSum(arr = [3, 34, 4, 12, 5, 2], sum = 9) {", vars: { arr: "[3, 34, 4, 12, 5, 2]", targetSum: "9" }, log: "Initialize 1D Subset Sum DP array for target sum = 9.", arrayState: [{ val: "Subset: {4, 5}" }, { val: "Sum: 9" }] },
      { line: 6, code: "  subset {4, 5} has sum 4 + 5 = 9 -> return true;", vars: { subset: "[4, 5]", targetSum: "9", isSubsetSum: "true" }, log: "Subset sum DP identifies subset {4, 5} with sum 9. Target achievable!", arrayState: [{ val: "4", match: true }, { val: "5", match: true }, { val: "Sum: 9", match: true }] },
      { line: 9, code: "  return true; // SUBSET SUM PROBLEM COMPLETE", vars: { status: "COMPLETE" }, log: "Subset Sum Problem complete!", arrayState: [{ val: "Target 9 Achievable", match: true }] }
    ]
  },

  // ── 275. TARGET SUM ──
  "target sum": {
    solutionJS: `function findTargetSumWays(nums, target) {
  let sum = nums.reduce((a, b) => a + b, 0);
  if (Math.abs(target) > sum || (sum + target) % 2 !== 0) return 0;
  let P = (sum + target) / 2;
  let dp = new Array(P + 1).fill(0);
  dp[0] = 1;
  for (let num of nums) {
    for (let i = P; i >= num; i--) {
      dp[i] += dp[i - num];
    }
  }
  return dp[P];
}`,
    solutionPY: `def findTargetSumWays(nums: List[int], target: int) -> int:
    total_sum = sum(nums)
    if abs(target) > total_sum or (total_sum + target) % 2 != 0: return 0
    P = (total_sum + target) // 2
    dp = [0] * (P + 1)
    dp[0] = 1
    for num in nums:
        for i in range(P, num - 1, -1):
            dp[i] += dp[i - num]
    return dp[P]`,
    solutionCPP: `int findTargetSumWays(vector<int>& nums, int target) {
    int sum = accumulate(nums.begin(), nums.end(), 0);
    if (abs(target) > sum || (sum + target) % 2 != 0) return 0;
    int P = (sum + target) / 2;
    vector<int> dp(P + 1, 0);
    dp[0] = 1;
    for (int num : nums) {
        for (int i = P; i >= num; i--) {
            dp[i] += dp[i - num];
        }
    }
    return dp[P];
}`,
    visualizerSteps: [
      { line: 1, code: "function findTargetSumWays(nums = [1, 1, 1, 1, 1], target = 3) {", vars: { nums: "[1, 1, 1, 1, 1]", target: "3", sum: "5" }, log: "Reduce target sum to subset sum count: positive subset P = (5+3)/2 = 4.", arrayState: [{ val: "Ways: 5" }, { val: "Target: 3" }] },
      { line: 6, code: "  5 choices of 4 positive 1s out of 5 -> 5 total sign combinations;", vars: { combinations: "5C4 = 5", totalWays: "5" }, log: "Subset sum count evaluates P = 4. 5 ways to assign '+' and '-' signs to reach target 3.", arrayState: [{ val: "5 Valid Sign Assignments", match: true }] },
      { line: 11, code: "  return 5; // TARGET SUM COMPLETE", vars: { status: "COMPLETE" }, log: "Target Sum complete!", arrayState: [{ val: "Total Ways: 5", match: true }] }
    ]
  },

  // ── 276. TRIANGLE ──
  "triangle": {
    solutionJS: `function minimumTotal(triangle) {
  let n = triangle.length;
  let dp = [...triangle[n - 1]];
  for (let r = n - 2; r >= 0; r--) {
    for (let c = 0; c <= r; c++) {
      dp[c] = triangle[r][c] + Math.min(dp[c], dp[c + 1]);
    }
  }
  return dp[0];
}`,
    solutionPY: `def minimumTotal(triangle: List[List[int]]) -> int:
    dp = triangle[-1][:]
    for r in range(len(triangle) - 2, -1, -1):
        for c in range(r + 1):
            dp[c] = triangle[r][c] + min(dp[c], dp[c + 1])
    return dp[0]`,
    solutionCPP: `int minimumTotal(vector<vector<int>>& triangle) {
    int n = triangle.size();
    vector<int> dp = triangle[n - 1];
    for (int r = n - 2; r >= 0; r--) {
        for (int c = 0; c <= r; c++) {
            dp[c] = triangle[r][c] + min(dp[c], dp[c + 1]);
        }
    }
    return dp[0];
}`,
    visualizerSteps: [
      { line: 1, code: "function minimumTotal(triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]) {", vars: { rows: "4" }, log: "Initialize bottom-up DP for triangle minimum path sum.", arrayState: [{ val: "Row 3: [4, 1, 8, 3]" }, { val: "Row 2: [7, 6, 10]" }, { val: "Row 1: [9, 10]" }, { val: "Row 0: [11]" }] },
      { line: 5, code: "  optimal top-to-bottom path: 2 -> 3 -> 5 -> 1 -> min total = 11;", vars: { minTotal: "11", path: "2 -> 3 -> 5 -> 1" }, log: "Bottom-up DP computes path 2 -> 3 -> 5 -> 1 with minimum total sum = 11.", arrayState: [{ val: "2", match: true }, { val: "3", match: true }, { val: "5", match: true }, { val: "1", match: true }, { val: "Min Total: 11", match: true }] },
      { line: 8, code: "  return 11; // TRIANGLE COMPLETE", vars: { status: "COMPLETE" }, log: "Triangle complete!", arrayState: [{ val: "Min Total: 11", match: true }] }
    ]
  },

  // ── 277. UNIQUE PATHS ──
  "unique paths": {
    solutionJS: `function uniquePaths(m, n) {
  let dp = Array.from({ length: m }, () => new Array(n).fill(1));
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
    }
  }
  return dp[m - 1][n - 1];
}`,
    solutionPY: `def uniquePaths(m: int, n: int) -> int:
    dp = [[1] * n for _ in range(m)]
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[m - 1][n - 1]`,
    solutionCPP: `int uniquePaths(int m, int n) {
    vector<vector<int>> dp(m, vector<int>(n, 1));
    for (int r = 1; r < m; r++) {
        for (int c = 1; c < n; c++) {
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
        }
    }
    return dp[m - 1][n - 1];
}`,
    visualizerSteps: [
      { line: 1, code: "function uniquePaths(m = 3, n = 7) {", vars: { m: "3", n: "7" }, log: "Initialize 3x7 grid DP for unique grid paths (moves: right, down).", arrayState: [{ val: "dp[2][6] = 28" }] },
      { line: 5, code: "  dp[2][6] = combinations to reach (2,6) from (0,0) = 28 paths;", vars: { uniquePaths: "28" }, log: "2D grid DP table evaluates total unique paths from (0,0) to (2,6) = 28.", arrayState: [{ val: "28 Unique Paths", match: true }] },
      { line: 8, code: "  return 28; // UNIQUE PATHS COMPLETE", vars: { status: "COMPLETE" }, log: "Unique Paths complete!", arrayState: [{ val: "28 Unique Paths", match: true }] }
    ]
  },

  // ── 278. UNIQUE PATHS II ──
  "unique paths ii": {
    solutionJS: `function uniquePathsWithObstacles(obstacleGrid) {
  let m = obstacleGrid.length, n = obstacleGrid[0].length;
  if (obstacleGrid[0][0] === 1) return 0;
  let dp = Array.from({ length: m }, () => new Array(n).fill(0));
  dp[0][0] = 1;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (obstacleGrid[r][c] === 1) { dp[r][c] = 0; continue; }
      if (r > 0) dp[r][c] += dp[r - 1][c];
      if (c > 0) dp[r][c] += dp[r][c - 1];
    }
  }
  return dp[m - 1][n - 1];
}`,
    solutionPY: `def uniquePathsWithObstacles(obstacleGrid: List[List[int]]) -> int:
    m, n = len(obstacleGrid), len(obstacleGrid[0])
    if obstacleGrid[0][0] == 1: return 0
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = 1
    for r in range(m):
        for c in range(n):
            if obstacleGrid[r][c] == 1: dp[r][c] = 0; continue
            if r > 0: dp[r][c] += dp[r - 1][c]
            if c > 0: dp[r][c] += dp[r][c - 1]
    return dp[m - 1][n - 1]`,
    solutionCPP: `int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
    int m = obstacleGrid.size(), n = obstacleGrid[0].size();
    if (obstacleGrid[0][0] == 1) return 0;
    vector<vector<long long>> dp(m, vector<long long>(n, 0));
    dp[0][0] = 1;
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (obstacleGrid[r][c] == 1) { dp[r][c] = 0; continue; }
            if (r > 0) dp[r][c] += dp[r - 1][c];
            if (c > 0) dp[r][c] += dp[r][c - 1];
        }
    }
    return dp[m - 1][n - 1];
}`,
    visualizerSteps: [
      { line: 1, code: "function uniquePathsWithObstacles(grid = [[0,0,0],[0,1,0],[0,0,0]]) {", vars: { m: "3", n: "3", obstacle: "(1,1)" }, log: "Initialize 3x3 grid DP with center obstacle at (1,1).", arrayState: [{ val: "Path 1: Right->Right->Down->Down" }, { val: "Path 2: Down->Down->Right->Right" }] },
      { line: 8, code: "  center obstacle at (1,1) blocks center -> 2 valid obstacle-free paths;", vars: { validPaths: "2" }, log: "Obstacle grid DP blocks paths passing through (1,1). Total valid unique paths = 2.", arrayState: [{ val: "Path 1", match: true }, { val: "Path 2", match: true }, { val: "Unique Paths: 2", match: true }] },
      { line: 12, code: "  return 2; // UNIQUE PATHS II COMPLETE", vars: { status: "COMPLETE" }, log: "Unique Paths II complete!", arrayState: [{ val: "2 Unique Paths", match: true }] }
    ]
  },

  // ── 279. WORD BREAK ──
  "word break": {
    solutionJS: `function wordBreak(s, wordDict) {
  let set = new Set(wordDict);
  let dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && set.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
    solutionPY: `def wordBreak(s: str, wordDict: List[str]) -> bool:
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[len(s)]`,
    solutionCPP: `bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    vector<bool> dp(s.length() + 1, false);
    dp[0] = true;
    for (size_t i = 1; i <= s.length(); i++) {
        for (size_t j = 0; j < i; j++) {
            if (dp[j] && dict.count(s.substr(j, i - j))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[s.length()];
}`,
    visualizerSteps: [
      { line: 1, code: "function wordBreak(s = 'leetcode', wordDict = ['leet', 'code']) {", vars: { s: "'leetcode'", wordDict: "['leet', 'code']" }, log: "Initialize 1D DP array for Word Break segmentation on string 'leetcode'.", arrayState: [{ val: "Segment 1: 'leet'" }, { val: "Segment 2: 'code'" }] },
      { line: 6, code: "  dp[4] = true ('leet') -> dp[8] = true ('code') -> string 'leetcode' is segmentable;", vars: { word1: "'leet'", word2: "'code'", isSegmentable: "true" }, log: "DP table matches prefix 'leet' at index 4 and suffix 'code' at index 8. Return true.", arrayState: [{ val: "'leet'", match: true }, { val: "'code'", match: true }, { val: "Segmentable", match: true }] },
      { line: 12, code: "  return true; // WORD BREAK COMPLETE", vars: { status: "COMPLETE" }, log: "Word Break complete!", arrayState: [{ val: "Word Break Valid", match: true }] }
    ]
  },

  // ── 280. NCR (BINOMIAL COEFFICIENT) ──
  "ncr (binomial coefficient)": {
    solutionJS: `function nCr(n, r) {
  if (r > n) return 0;
  if (r === 0 || r === n) return 1;
  let MOD = 1000000007;
  let dp = new Array(r + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= n; i++) {
    for (let j = Math.min(i, r); j > 0; j--) {
      dp[j] = (dp[j] + dp[j - 1]) % MOD;
    }
  }
  return dp[r];
}`,
    solutionPY: `def nCr(n: int, r: int) -> int:
    if r > n: return 0
    if r == 0 or r == n: return 1
    MOD = 10**9 + 7
    dp = [0] * (r + 1)
    dp[0] = 1
    for i in range(1, n + 1):
        for j in range(min(i, r), 0, -1):
            dp[j] = (dp[j] + dp[j - 1]) % MOD
    return dp[r]`,
    solutionCPP: `int nCr(int n, int r) {
    if (r > n) return 0;
    if (r == 0 || r == n) return 1;
    int MOD = 1e9 + 7;
    vector<int> dp(r + 1, 0);
    dp[0] = 1;
    for (int i = 1; i <= n; i++) {
        for (int j = min(i, r); j > 0; j--) {
            dp[j] = (dp[j] + dp[j - 1]) % MOD;
        }
    }
    return dp[r];
}`,
    visualizerSteps: [
      { line: 1, code: "function nCr(n = 5, r = 2) {", vars: { n: "5", r: "2" }, log: "Initialize Pascal's Triangle DP for C(5, 2) % (10^9 + 7).", arrayState: [{ val: "Row 5: [1, 5, 10, 10, 5, 1]" }] },
      { line: 7, code: "  C(5, 2) = C(4, 1) + C(4, 2) = 4 + 6 = 10;", vars: { n: "5", r: "2", nCr: "10" }, log: "Pascal's identity evaluation calculates C(5, 2) = 10.", arrayState: [{ val: "C(5,2) = 10", match: true }] },
      { line: 11, code: "  return 10; // NCR BINOMIAL COEFFICIENT COMPLETE", vars: { status: "COMPLETE" }, log: "nCr (Binomial Coefficient) complete!", arrayState: [{ val: "nCr = 10", match: true }] }
    ]
  },

  // ── 281. GAS STATION ──
  "gas station": {
    solutionJS: `function canCompleteCircuit(gas, cost) {
  let totalGas = 0, totalCost = 0, currGas = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    totalGas += gas[i];
    totalCost += cost[i];
    currGas += gas[i] - cost[i];
    if (currGas < 0) {
      start = i + 1;
      currGas = 0;
    }
  }
  return totalGas >= totalCost ? start : -1;
}`,
    solutionPY: `def canCompleteCircuit(gas: List[int], cost: List[int]) -> int:
    if sum(gas) < sum(cost): return -1
    total_tank, start_station = 0, 0
    for i in range(len(gas)):
        total_tank += gas[i] - cost[i]
        if total_tank < 0:
            start_station = i + 1
            total_tank = 0
    return start_station`,
    solutionCPP: `int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int totalGas = 0, totalCost = 0, currGas = 0, start = 0;
    for (size_t i = 0; i < gas.size(); i++) {
        totalGas += gas[i];
        totalCost += cost[i];
        currGas += gas[i] - cost[i];
        if (currGas < 0) {
            start = i + 1;
            currGas = 0;
        }
    }
    return totalGas >= totalCost ? start : -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function canCompleteCircuit(gas = [1,2,3,4,5], cost = [3,4,5,1,2]) {", vars: { gas: "[1,2,3,4,5]", cost: "[3,4,5,1,2]" }, log: "Initialize Greedy gas station circuit evaluation.", arrayState: [{ val: "Idx 0: tank -2 (reset)" }, { val: "Idx 1: tank -2 (reset)" }, { val: "Idx 2: tank -2 (reset)" }, { val: "Idx 3: start here" }] },
      { line: 7, code: "  start at index 3: gas 4->cost 1 (tank 3), gas 5->cost 2 (tank 6) -> circuit complete;", vars: { startIdx: "3", tank: "6" }, log: "Greedy single-pass finds station 3 allows completing full circuit.", arrayState: [{ val: "Station 3", match: true }, { val: "Circuit Feasible", match: true }] },
      { line: 12, code: "  return 3; // GAS STATION COMPLETE", vars: { status: "COMPLETE" }, log: "Gas Station complete!", arrayState: [{ val: "Start Index: 3", match: true }] }
    ]
  },

  // ── 282. HAND OF STRAIGHTS ──
  "hand of straights": {
    solutionJS: `function isNStraightHand(hand, groupSize) {
  if (hand.length % groupSize !== 0) return false;
  let count = new Map();
  for (let card of hand) count.set(card, (count.get(card) || 0) + 1);
  let sortedKeys = Array.from(count.keys()).sort((a, b) => a - b);
  for (let card of sortedKeys) {
    let c = count.get(card);
    if (c > 0) {
      for (let i = 0; i < groupSize; i++) {
        if ((count.get(card + i) || 0) < c) return false;
        count.set(card + i, count.get(card + i) - c);
      }
    }
  }
  return true;
}`,
    solutionPY: `def isNStraightHand(hand: List[int], groupSize: int) -> bool:
    if len(hand) % groupSize != 0: return False
    count = Counter(hand)
    for card in sorted(count):
        if count[card] > 0:
            c = count[card]
            for i in range(groupSize):
                if count[card + i] < c: return False
                count[card + i] -= c
    return True`,
    solutionCPP: `bool isNStraightHand(vector<int>& hand, int groupSize) {
    if (hand.size() % groupSize != 0) return false;
    map<int, int> count;
    for (int card : hand) count[card]++;
    for (auto it = count.begin(); it != count.end(); ++it) {
        if (it->second > 0) {
            int c = it->second;
            for (int i = 0; i < groupSize; i++) {
                if (count[it->first + i] < c) return false;
                count[it->first + i] -= c;
            }
        }
    }
    return true;
}`,
    visualizerSteps: [
      { line: 1, code: "function isNStraightHand(hand = [1,2,3,6,2,3,4,7,8], groupSize = 3) {", vars: { hand: "[1,2,3,6,2,3,4,7,8]", groupSize: "3" }, log: "Verify hand length divisible by groupSize (9 % 3 === 0). Min-heap/sorted key greedy grouping.", arrayState: [{ val: "Group 1: [1, 2, 3]" }, { val: "Group 2: [2, 3, 4]" }, { val: "Group 3: [6, 7, 8]" }] },
      { line: 8, code: "  groups formed: [1,2,3], [2,3,4], [6,7,8] -> all cards grouped in straights;", vars: { g1: "[1,2,3]", g2: "[2,3,4]", g3: "[6,7,8]" }, log: "Greedy consecutive card matching forms 3 valid groups of size 3. Return true.", arrayState: [{ val: "[1, 2, 3]", match: true }, { val: "[2, 3, 4]", match: true }, { val: "[6, 7, 8]", match: true }] },
      { line: 16, code: "  return true; // HAND OF STRAIGHTS COMPLETE", vars: { status: "COMPLETE" }, log: "Hand of Straights complete!", arrayState: [{ val: "All Cards Grouped", match: true }] }
    ]
  },

  // ── 283. JUMP GAME II ──
  "jump game ii": {
    solutionJS: `function jump(nums) {
  let jumps = 0, currEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === currEnd) {
      jumps++;
      currEnd = farthest;
    }
  }
  return jumps;
}`,
    solutionPY: `def jump(nums: List[int]) -> int:
    jumps, curr_end, farthest = 0, 0, 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == curr_end:
            jumps += 1
            curr_end = farthest
    return jumps`,
    solutionCPP: `int jump(vector<int>& nums) {
    int jumps = 0, currEnd = 0, farthest = 0;
    for (size_t i = 0; i < nums.size() - 1; i++) {
        farthest = max(farthest, (int)i + nums[i]);
        if ((int)i == currEnd) {
            jumps++;
            currEnd = farthest;
        }
    }
    return jumps;
}`,
    visualizerSteps: [
      { line: 1, code: "function jump(nums = [2, 3, 1, 1, 4]) {", vars: { nums: "[2, 3, 1, 1, 4]" }, log: "Initialize Greedy BFS level-boundary jump tracking on array [2, 3, 1, 1, 4].", arrayState: [{ val: "Jump 1: to idx 1 (val 3)" }, { val: "Jump 2: to idx 4 (end)" }] },
      { line: 4, code: "  jump 1 to idx 1 -> farthest reach 1+3=4 >= end(4) -> jump 2 to end -> min 2 jumps;", vars: { jumps: "2", path: "0 -> 1 -> 4" }, log: "Greedy BFS level tracking finds optimal 2 jumps (0 -> 1 -> 4) to reach last index.", arrayState: [{ val: "Jump 1: idx 0 -> 1", match: true }, { val: "Jump 2: idx 1 -> 4", match: true }, { val: "Min Jumps: 2", match: true }] },
      { line: 9, code: "  return 2; // JUMP GAME II COMPLETE", vars: { status: "COMPLETE" }, log: "Jump Game II complete!", arrayState: [{ val: "Min Jumps: 2", match: true }] }
    ]
  },

  // ── 284. MERGE TRIPLETS TO FORM TARGET TRIPLET ──
  "merge triplets to form target triplet": {
    solutionJS: `function mergeTriplets(triplets, target) {
  let res = new Set();
  for (let t of triplets) {
    if (t[0] <= target[0] && t[1] <= target[1] && t[2] <= target[2]) {
      for (let i = 0; i < 3; i++) {
        if (t[i] === target[i]) res.add(i);
      }
    }
  }
  return res.size === 3;
}`,
    solutionPY: `def mergeTriplets(triplets: List[List[int]], target: List[int]) -> bool:
    res = set()
    for t in triplets:
        if t[0] <= target[0] and t[1] <= target[1] and t[2] <= target[2]:
            for i in range(3):
                if t[i] == target[i]:
                    res.add(i)
    return len(res) == 3`,
    solutionCPP: `bool mergeTriplets(vector<vector<int>>& triplets, vector<int>& target) {
    unordered_set<int> res;
    for (auto& t : triplets) {
        if (t[0] <= target[0] && t[1] <= target[1] && t[2] <= target[2]) {
            for (int i = 0; i < 3; i++) {
                if (t[i] == target[i]) res.insert(i);
            }
        }
    }
    return res.size() == 3;
}`,
    visualizerSteps: [
      { line: 1, code: "function mergeTriplets(triplets = [[2,5,3],[1,8,4],[1,7,5],[2,7,5]], target = [2,7,5]) {", vars: { target: "[2, 7, 5]" }, log: "Filter out triplets with elements exceeding target. Collect component-wise max.", arrayState: [{ val: "[2,5,3] matches target[0]" }, { val: "[1,8,4] invalid (8>7)" }, { val: "[1,7,5] matches target[1,2]" }] },
      { line: 6, code: "  valid triplets [2,5,3] + [1,7,5] merge to max([2,5,3], [1,7,5]) = [2,7,5];", vars: { merged: "[2, 7, 5]", target: "[2, 7, 5]" }, log: "Component-wise max of valid triplets yields target [2, 7, 5]. Return true.", arrayState: [{ val: "Component 0: 2", match: true }, { val: "Component 1: 7", match: true }, { val: "Component 2: 5", match: true }] },
      { line: 10, code: "  return true; // MERGE TRIPLETS COMPLETE", vars: { status: "COMPLETE" }, log: "Merge Triplets to Form Target Triplet complete!", arrayState: [{ val: "Target [2,7,5] Formed", match: true }] }
    ]
  },

  // ── 285. PARTITION LABELS ──
  "partition labels": {
    solutionJS: `function partitionLabels(s) {
  let last = {};
  for (let i = 0; i < s.length; i++) last[s[i]] = i;
  let res = [], start = 0, end = 0;
  for (let i = 0; i < s.length; i++) {
    end = Math.max(end, last[s[i]]);
    if (i === end) {
      res.push(end - start + 1);
      start = i + 1;
    }
  }
  return res;
}`,
    solutionPY: `def partitionLabels(s: str) -> List[int]:
    last = {c: i for i, c in enumerate(s)}
    res, start, end = [], 0, 0
    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:
            res.append(end - start + 1)
            start = i + 1
    return res`,
    solutionCPP: `vector<int> partitionLabels(string s) {
    vector<int> last(26, 0);
    for (int i = 0; i < s.length(); i++) last[s[i] - 'a'] = i;
    vector<int> res;
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        end = max(end, last[s[i] - 'a']);
        if (i == end) {
            res.push_back(end - start + 1);
            start = i + 1;
        }
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function partitionLabels(s = 'ababcbacadefegdehijhklij') {", vars: { s: "'ababcbacadefegdehijhklij'" }, log: "Store last occurrences of each character. Greedy partition window expansion.", arrayState: [{ val: "P1: 'ababcbaca' (9)" }, { val: "P2: 'defegde' (7)" }, { val: "P3: 'hijhklij' (8)" }] },
      { line: 6, code: "  partition window boundaries found at indices 8, 15, 23 -> lengths [9, 7, 8];", vars: { partitionLengths: "[9, 7, 8]" }, log: "Greedy max last-index tracking creates 3 distinct partitions with lengths [9, 7, 8].", arrayState: [{ val: "Part 1: len 9", match: true }, { val: "Part 2: len 7", match: true }, { val: "Part 3: len 8", match: true }] },
      { line: 12, code: "  return [9, 7, 8]; // PARTITION LABELS COMPLETE", vars: { status: "COMPLETE" }, log: "Partition Labels complete!", arrayState: [{ val: "Result: [9, 7, 8]", match: true }] }
    ]
  },

  // ── 286. VALID PARENTHESIS STRING ──
  "valid parenthesis string": {
    solutionJS: `function checkValidString(s) {
  let minOpen = 0, maxOpen = 0;
  for (let c of s) {
    if (c === '(') { minOpen++; maxOpen++; }
    else if (c === ')') { minOpen--; maxOpen--; }
    else { minOpen--; maxOpen++; }
    if (maxOpen < 0) return false;
    minOpen = Math.max(0, minOpen);
  }
  return minOpen === 0;
}`,
    solutionPY: `def checkValidString(s: str) -> bool:
    min_open = max_open = 0
    for c in s:
        if c == '(':
            min_open += 1; max_open += 1
        elif c == ')':
            min_open -= 1; max_open -= 1
        else:
            min_open -= 1; max_open += 1
        if max_open < 0: return False
        min_open = max(0, min_open)
    return min_open == 0`,
    solutionCPP: `bool checkValidString(string s) {
    int minOpen = 0, maxOpen = 0;
    for (char c : s) {
        if (c == '(') { minOpen++; maxOpen++; }
        else if (c == ')') { minOpen--; maxOpen--; }
        else { minOpen--; maxOpen++; }
        if (maxOpen < 0) return false;
        minOpen = max(0, minOpen);
    }
    return minOpen == 0;
}`,
    visualizerSteps: [
      { line: 1, code: "function checkValidString(s = '(*))') {", vars: { s: "'(*))'" }, log: "Track range of open parenthesis counts [minOpen, maxOpen]. '*' can be '(', ')', or empty.", arrayState: [{ val: "'(' -> [1, 1]" }, { val: "'*' -> [0, 2]" }, { val: "')' -> [0, 1]" }, { val: "')' -> [0, 0]" }] },
      { line: 5, code: "  minOpen reached 0 at end of string '(*))' -> valid parenthesis string;", vars: { minOpen: "0", maxOpen: "0", isValid: "true" }, log: "Greedy range tracking bounds minOpen to 0 at string termination. String is valid!", arrayState: [{ val: "minOpen: 0", match: true }, { val: "Valid Parentheses", match: true }] },
      { line: 10, code: "  return true; // VALID PARENTHESIS STRING COMPLETE", vars: { status: "COMPLETE" }, log: "Valid Parenthesis String complete!", arrayState: [{ val: "Valid String", match: true }] }
    ]
  },

  // ── 287. ADD BINARY ──
  "add binary": {
    solutionJS: `function addBinary(a, b) {
  let i = a.length - 1, j = b.length - 1, carry = 0, res = [];
  while (i >= 0 || j >= 0 || carry) {
    let sum = carry;
    if (i >= 0) sum += parseInt(a[i--]);
    if (j >= 0) sum += parseInt(b[j--]);
    res.push(sum % 2);
    carry = Math.floor(sum / 2);
  }
  return res.reverse().join('');
}`,
    solutionPY: `def addBinary(a: str, b: str) -> str:
    i, j, carry, res = len(a) - 1, len(b) - 1, 0, []
    while i >= 0 or j >= 0 or carry:
        total = carry
        if i >= 0: total += int(a[i]); i -= 1
        if j >= 0: total += int(b[j]); j -= 1
        res.append(str(total % 2))
        carry = total // 2
    return "".join(reversed(res))`,
    solutionCPP: `string addBinary(string a, string b) {
    int i = a.length() - 1, j = b.length() - 1, carry = 0;
    string res = "";
    while (i >= 0 || j >= 0 || carry) {
        int sum = carry;
        if (i >= 0) sum += a[i--] - '0';
        if (j >= 0) sum += b[j--] - '0';
        res += to_string(sum % 2);
        carry = sum / 2;
    }
    reverse(res.begin(), res.end());
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function addBinary(a = '11', b = '1') {", vars: { a: "'11'", b: "'1'" }, log: "Right-to-left binary addition with carry.", arrayState: [{ val: "Bit 0: 1+1=2 -> sum 0, carry 1" }, { val: "Bit 1: 1+0+1=2 -> sum 0, carry 1" }, { val: "Carry 1 -> sum 1" }] },
      { line: 5, code: "  11 + 1 = 100 in binary (3 + 1 = 4 in decimal);", vars: { sumBinary: "'100'", decimalEquiv: "3 + 1 = 4" }, log: "Bitwise addition with carry propagates to result '100'.", arrayState: [{ val: "100", match: true }, { val: "Decimal: 4", match: true }] },
      { line: 10, code: "  return '100'; // ADD BINARY COMPLETE", vars: { status: "COMPLETE" }, log: "Add Binary complete!", arrayState: [{ val: "'100'", match: true }] }
    ]
  },

  // ── 288. FIND NTH ROOT OF M ──
  "find nth root of m": {
    solutionJS: `function NthRoot(n, m) {
  let low = 1, high = m;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let val = Math.pow(mid, n);
    if (val === m) return mid;
    if (val < m) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    solutionPY: `def NthRoot(n: int, m: int) -> int:
    low, high = 1, m
    while low <= high:
        mid = (low + high) // 2
        val = mid ** n
        if val == m: return mid
        if val < m: low = mid + 1
        else: high = mid - 1
    return -1`,
    solutionCPP: `int NthRoot(int n, int m) {
    int low = 1, high = m;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        long long val = 1;
        for (int i = 0; i < n; i++) {
            val *= mid;
            if (val > m) break;
        }
        if (val == m) return mid;
        if (val < m) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function NthRoot(n = 3, m = 27) {", vars: { n: "3", m: "27" }, log: "Binary Search for integer Nth root of M in range [1, 27].", arrayState: [{ val: "3^3 = 27" }] },
      { line: 5, code: "  mid = 3: 3^3 = 27 === M (27) -> exact integer root = 3;", vars: { mid: "3", pow: "27", target: "27" }, log: "Binary search finds mid = 3 where 3^3 = 27 === M. Integer Nth root = 3.", arrayState: [{ val: "3^3 = 27", match: true }, { val: "Nth Root: 3", match: true }] },
      { line: 9, code: "  return 3; // FIND NTH ROOT OF M COMPLETE", vars: { status: "COMPLETE" }, log: "Find Nth root of M complete!", arrayState: [{ val: "Root = 3", match: true }] }
    ]
  },

  // ── 289. HAPPY NUMBER ──
  "happy number": {
    solutionJS: `function isHappy(n) {
  let getNext = (num) => {
    let totalSum = 0;
    while (num > 0) {
      let d = num % 10;
      totalSum += d * d;
      num = Math.floor(num / 10);
    }
    return totalSum;
  };
  let slow = n, fast = getNext(n);
  while (fast !== 1 && slow !== fast) {
    slow = getNext(slow);
    fast = getNext(getNext(fast));
  }
  return fast === 1;
}`,
    solutionPY: `def isHappy(n: int) -> bool:
    def get_next(num):
        total_sum = 0
        while num > 0:
            d = num % 10
            total_sum += d * d
            num //= 10
        return total_sum
    slow, fast = n, get_next(n)
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    return fast == 1`,
    solutionCPP: `bool isHappy(int n) {
    auto getNext = [](int num) {
        int totalSum = 0;
        while (num > 0) {
            int d = num % 10;
            totalSum += d * d;
            num /= 10;
        }
        return totalSum;
    };
    int slow = n, fast = getNext(n);
    while (fast != 1 && slow != fast) {
        slow = getNext(slow);
        fast = getNext(getNext(fast));
    }
    return fast == 1;
}`,
    visualizerSteps: [
      { line: 1, code: "function isHappy(n = 19) {", vars: { n: "19" }, log: "Floyd's Cycle Detection for Happy Number digit square sum sequence.", arrayState: [{ val: "19 -> 1^2 + 9^2 = 82" }, { val: "82 -> 8^2 + 2^2 = 68" }, { val: "68 -> 6^2 + 8^2 = 100" }, { val: "100 -> 1^2 + 0^2 + 0^2 = 1" }] },
      { line: 13, code: "  sequence reached 1 (19 -> 82 -> 68 -> 100 -> 1) -> n is a Happy Number;", vars: { isHappy: "true", sequence: "19->82->68->100->1" }, log: "Digit sum of squares terminates at 1. 19 is a Happy Number!", arrayState: [{ val: "19", match: true }, { val: "82", match: true }, { val: "68", match: true }, { val: "100", match: true }, { val: "1 (Happy)", match: true }] },
      { line: 15, code: "  return true; // HAPPY NUMBER COMPLETE", vars: { status: "COMPLETE" }, log: "Happy Number complete!", arrayState: [{ val: "Happy Number Valid", match: true }] }
    ]
  },

  // ── 290. KTH SMALLEST FACTOR ──
  "kth smallest factor": {
    solutionJS: `function kthFactor(n, k) {
  let factors = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      factors.push(i);
      if (i * i !== n) factors.push(n / i);
    }
  }
  factors.sort((a, b) => a - b);
  return k <= factors.length ? factors[k - 1] : -1;
}`,
    solutionPY: `def kthFactor(n: int, k: int) -> int:
    factors = []
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            factors.append(i)
            if i * i != n: factors.append(n // i)
    factors.sort()
    return factors[k - 1] if k <= len(factors) else -1`,
    solutionCPP: `int kthFactor(int n, int k) {
    vector<int> factors;
    for (int i = 1; i * i <= n; i++) {
        if (n % i == 0) {
            factors.push_back(i);
            if (i * i != n) factors.push_back(n / i);
        }
    }
    sort(factors.begin(), factors.end());
    return k <= (int)factors.size() ? factors[k - 1] : -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function kthFactor(n = 12, k = 3) {", vars: { n: "12", k: "3" }, log: "Collect all factors of 12 and sort in ascending order.", arrayState: [{ val: "Factors: [1, 2, 3, 4, 6, 12]" }] },
      { line: 8, code: "  factors of 12 = [1, 2, 3, 4, 6, 12] -> 3rd factor is 3;", vars: { factors: "[1, 2, 3, 4, 6, 12]", kthFactor: "3" }, log: "Sorted factor list: 3rd smallest factor (1-indexed) is 3.", arrayState: [{ val: "1st: 1" }, { val: "2nd: 2" }, { val: "3rd: 3", match: true }, { val: "4th: 4" }, { val: "5th: 6" }, { val: "6th: 12" }] },
      { line: 9, code: "  return 3; // KTH SMALLEST FACTOR COMPLETE", vars: { status: "COMPLETE" }, log: "Kth Smallest Factor complete!", arrayState: [{ val: "3rd Factor: 3", match: true }] }
    ]
  },

  // ── 291. PALINDROME NUMBER ──
  "palindrome number": {
    solutionJS: `function isPalindrome(x) {
  if (x < 0) return false;
  let original = x, rev = 0;
  while (x > 0) {
    rev = rev * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return original === rev;
}`,
    solutionPY: `def isPalindrome(x: int) -> bool:
    if x < 0: return False
    return str(x) == str(x)[::-1]`,
    solutionCPP: `bool isPalindrome(int x) {
    if (x < 0) return false;
    long long original = x, rev = 0;
    while (x > 0) {
        rev = rev * 10 + (x % 10);
        x /= 10;
    }
    return original == rev;
}`,
    visualizerSteps: [
      { line: 1, code: "function isPalindrome(x = 121) {", vars: { x: "121" }, log: "Verify integer palindrome symmetry. Reverse digits of 121.", arrayState: [{ val: "Original: 121" }, { val: "Reversed: 121" }] },
      { line: 7, code: "  reversed 121 === original 121 -> return true;", vars: { original: "121", reversed: "121", isPalindrome: "true" }, log: "Reversed integer 121 matches original 121. Integer is palindromic!", arrayState: [{ val: "Original: 121", match: true }, { val: "Reversed: 121", match: true }] },
      { line: 8, code: "  return true; // PALINDROME NUMBER COMPLETE", vars: { status: "COMPLETE" }, log: "Palindrome Number complete!", arrayState: [{ val: "Palindrome Valid", match: true }] }
    ]
  },

  // ── 292. PLUS ONE ──
  "plus one": {
    solutionJS: `function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }
  digits.unshift(1);
  return digits;
}`,
    solutionPY: `def plusOne(digits: List[int]) -> List[int]:
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    return [1] + digits`,
    solutionCPP: `vector<int> plusOne(vector<int>& digits) {
    for (int i = digits.size() - 1; i >= 0; i--) {
        if (digits[i] < 9) {
            digits[i]++;
            return digits;
        }
        digits[i] = 0;
    }
    digits.insert(digits.begin(), 1);
    return digits;
}`,
    visualizerSteps: [
      { line: 1, code: "function plusOne(digits = [1, 2, 3]) {", vars: { digits: "[1, 2, 3]" }, log: "Traverse digits from right to left. Increment last digit.", arrayState: [{ val: "Idx 2: 3 < 9 -> increment to 4" }] },
      { line: 4, code: "  last digit 3 < 9 -> digits[2] becomes 4 -> return [1, 2, 4];", vars: { result: "[1, 2, 4]" }, log: "Increments last digit 3 to 4 without carry propagation. Return [1, 2, 4].", arrayState: [{ val: "1" }, { val: "2" }, { val: "4", match: true }] },
      { line: 5, code: "  return [1, 2, 4]; // PLUS ONE COMPLETE", vars: { status: "COMPLETE" }, log: "Plus One complete!", arrayState: [{ val: "[1, 2, 4]", match: true }] }
    ]
  },

  // ── 293. ROMAN TO INTEGER ──
  "roman to integer": {
    solutionJS: `function romanToInt(s) {
  let map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    let curr = map[s[i]], next = map[s[i + 1]] || 0;
    if (curr < next) total -= curr;
    else total += curr;
  }
  return total;
}`,
    solutionPY: `def romanToInt(s: str) -> int:
    roman_map = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    total = 0
    for i in range(len(s)):
        curr = roman_map[s[i]]
        next_val = roman_map[s[i + 1]] if i + 1 < len(s) else 0
        if curr < next_val: total -= curr
        else: total += curr
    return total`,
    solutionCPP: `int romanToInt(string s) {
    unordered_map<char, int> map = {{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};
    int total = 0;
    for (size_t i = 0; i < s.length(); i++) {
        int curr = map[s[i]], nextVal = (i + 1 < s.length()) ? map[s[i + 1]] : 0;
        if (curr < nextVal) total -= curr;
        else total += curr;
    }
    return total;
}`,
    visualizerSteps: [
      { line: 1, code: "function romanToInt(s = 'MCMXCIV') {", vars: { s: "'MCMXCIV'" }, log: "Convert Roman numeral string 'MCMXCIV' to integer.", arrayState: [{ val: "M = 1000" }, { val: "CM = 900" }, { val: "XC = 90" }, { val: "IV = 4" }] },
      { line: 6, code: "  subtraction & addition: M(1000) + CM(900) + XC(90) + IV(4) = 1994;", vars: { roman: "'MCMXCIV'", integer: "1994" }, log: "Roman numeral rules convert 'MCMXCIV' to integer 1994.", arrayState: [{ val: "M: 1000", match: true }, { val: "CM: 900", match: true }, { val: "XC: 90", match: true }, { val: "IV: 4", match: true }, { val: "Total: 1994", match: true }] },
      { line: 9, code: "  return 1994; // ROMAN TO INTEGER COMPLETE", vars: { status: "COMPLETE" }, log: "Roman to Integer complete!", arrayState: [{ val: "Total: 1994", match: true }] }
    ]
  },

  // ── 294. DETECT SQUARES ──
  "detect squares": {
    solutionJS: `class DetectSquares {
  constructor() {
    this.pts = new Map();
  }
  add(point) {
    let key = \`\${point[0]},\${point[1]}\`;
    this.pts.set(key, (this.pts.get(key) || 0) + 1);
  }
  count(point) {
    let [qx, qy] = point, res = 0;
    for (let [key, cnt] of this.pts.entries()) {
      let [px, py] = key.split(',').map(Number);
      if (Math.abs(px - qx) !== Math.abs(py - qy) || px === qx || py === qy) continue;
      let p1 = \`\${qx},\${py}\`, p2 = \`\${px},\${qy}\`;
      res += cnt * (this.pts.get(p1) || 0) * (this.pts.get(p2) || 0);
    }
    return res;
  }
}`,
    solutionPY: `class DetectSquares:
    def __init__(self):
        self.pts = defaultdict(int)

    def add(self, point: List[int]) -> None:
        self.pts[tuple(point)] += 1

    def count(self, point: List[int]) -> int:
        qx, qy = point
        res = 0
        for (px, py), cnt in self.pts.items():
            if abs(px - qx) != abs(py - qy) or px == qx or py == qy:
                continue
            res += cnt * self.pts[(qx, py)] * self.pts[(px, qy)]
        return res`,
    solutionCPP: `class DetectSquares {
    map<pair<int,int>, int> pts;
public:
    DetectSquares() {}
    void add(vector<int> point) {
        pts[{point[0], point[1]}]++;
    }
    int count(vector<int> point) {
        int qx = point[0], qy = point[1], res = 0;
        for (auto& [pt, cnt] : pts) {
            int px = pt.first, py = pt.second;
            if (abs(px - qx) != abs(py - qy) || px == qx || py == qy) continue;
            res += cnt * pts[{qx, py}] * pts[{px, qy}];
        }
        return res;
    }
};`,
    visualizerSteps: [
      { line: 1, code: "add([3,10]); add([11,2]); add([3,2]); count([11,10]);", vars: { query: "[11, 10]" }, log: "Query point [11, 10]. Diagonal check with point [3, 2] gives side length 8.", arrayState: [{ val: "Query: [11, 10]" }, { val: "Diagonal: [3, 2]" }, { val: "Side: 8" }] },
      { line: 8, code: "  side length |11-3| = 8 === |10-2| = 8 -> 1 square formed by [11,10],[3,10],[3,2],[11,2];", vars: { side: "8", squareCount: "1" }, log: "Point frequency product 1 * 1 * 1 = 1 valid axis-aligned square detected.", arrayState: [{ val: "[11,10]", match: true }, { val: "[3,10]", match: true }, { val: "[3,2]", match: true }, { val: "[11,2]", match: true }, { val: "1 Square", match: true }] },
      { line: 14, code: "  return 1; // DETECT SQUARES COMPLETE", vars: { status: "COMPLETE" }, log: "Detect Squares complete!", arrayState: [{ val: "Square Count: 1", match: true }] }
    ]
  },

  // ── 295. INTEGER TO ROMAN ──
  "integer to roman": {
    solutionJS: `function intToRoman(num) {
  let val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  let sym = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let res = "";
  for (let i = 0; i < val.length; i++) {
    while (num >= val[i]) {
      num -= val[i];
      res += sym[i];
    }
  }
  return res;
}`,
    solutionPY: `def intToRoman(num: int) -> str:
    val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    sym = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
    res = ""
    for i in range(len(val)):
        while num >= val[i]:
            num -= val[i]
            res += sym[i]
    return res`,
    solutionCPP: `string intToRoman(int num) {
    vector<int> val = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
    vector<string> sym = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
    string res = "";
    for (size_t i = 0; i < val.size(); i++) {
        while (num >= val[i]) {
            num -= val[i];
            res += sym[i];
        }
    }
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function intToRoman(num = 1994) {", vars: { num: "1994" }, log: "Greedy value subtraction for integer 1994 to Roman numeral string.", arrayState: [{ val: "1000 -> 'M'" }, { val: "900 -> 'CM'" }, { val: "90 -> 'XC'" }, { val: "4 -> 'IV'" }] },
      { line: 6, code: "  subtractions: 1994 - 1000('M') - 900('CM') - 90('XC') - 4('IV') = 0 -> 'MCMXCIV';", vars: { roman: "'MCMXCIV'" }, log: "Greedy subtraction converts 1994 to 'MCMXCIV'.", arrayState: [{ val: "'M'", match: true }, { val: "'CM'", match: true }, { val: "'XC'", match: true }, { val: "'IV'", match: true }, { val: "'MCMXCIV'", match: true }] },
      { line: 11, code: "  return 'MCMXCIV'; // INTEGER TO ROMAN COMPLETE", vars: { status: "COMPLETE" }, log: "Integer to Roman complete!", arrayState: [{ val: "'MCMXCIV'", match: true }] }
    ]
  },

  // ── 296. MULTIPLY STRINGS ──
  "multiply strings": {
    solutionJS: `function multiply(num1, num2) {
  if (num1 === "0" || num2 === "0") return "0";
  let m = num1.length, n = num2.length;
  let pos = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      let mul = (num1[i] - '0') * (num2[j] - '0');
      let sum = mul + pos[i + j + 1];
      pos[i + j + 1] = sum % 10;
      pos[i + j] += Math.floor(sum / 10);
    }
  }
  while (pos[0] === 0) pos.shift();
  return pos.join('');
}`,
    solutionPY: `def multiply(num1: str, num2: str) -> str:
    if num1 == "0" or num2 == "0": return "0"
    m, n = len(num1), len(num2)
    pos = [0] * (m + n)
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            mul = int(num1[i]) * int(num2[j])
            total = mul + pos[i + j + 1]
            pos[i + j + 1] = total % 10
            pos[i + j] += total // 10
    while pos and pos[0] == 0: pos.pop(0)
    return "".join(map(str, pos))`,
    solutionCPP: `string multiply(string num1, string num2) {
    if (num1 == "0" || num2 == "0") return "0";
    int m = num1.length(), n = num2.length();
    vector<int> pos(m + n, 0);
    for (int i = m - 1; i >= 0; i--) {
        for (int j = n - 1; j >= 0; j--) {
            int mul = (num1[i] - '0') * (num2[j] - '0');
            int sum = mul + pos[i + j + 1];
            pos[i + j + 1] = sum % 10;
            pos[i + j] += sum / 10;
        }
    }
    string res = "";
    for (int p : pos) if (!(res.empty() && p == 0)) res += to_string(p);
    return res;
}`,
    visualizerSteps: [
      { line: 1, code: "function multiply(num1 = '123', num2 = '456') {", vars: { num1: "'123'", num2: "'456'" }, log: "Digit-by-digit string multiplication array with carry propagation.", arrayState: [{ val: "123 * 456" }, { val: "Raw array: [0, 5, 6, 0, 8, 8]" }] },
      { line: 7, code: "  digit products accumulated and carries resolved -> '56088';", vars: { product: "'56088'" }, log: "Position array carry resolution computes product 123 * 456 = 56088.", arrayState: [{ val: "5", match: true }, { val: "6", match: true }, { val: "0", match: true }, { val: "8", match: true }, { val: "8", match: true }, { val: "56088", match: true }] },
      { line: 14, code: "  return '56088'; // MULTIPLY STRINGS COMPLETE", vars: { status: "COMPLETE" }, log: "Multiply Strings complete!", arrayState: [{ val: "'56088'", match: true }] }
    ]
  },

  // ── 297. POW(X, N) ──
  "pow(x, n)": {
    solutionJS: `function myPow(x, n) {
  if (n === 0) return 1.0;
  let N = n;
  if (N < 0) { x = 1 / x; N = -N; }
  let ans = 1.0, curr = x;
  while (N > 0) {
    if (N % 2 === 1) ans *= curr;
    curr *= curr;
    N = Math.floor(N / 2);
  }
  return ans;
}`,
    solutionPY: `def myPow(x: float, n: int) -> float:
    if n == 0: return 1.0
    N = n
    if N < 0:
        x = 1 / x
        N = -N
    ans, curr = 1.0, x
    while N > 0:
        if N % 2 == 1: ans *= curr
        curr *= curr
        N //= 2
    return ans`,
    solutionCPP: `double myPow(double x, int n) {
    long long N = n;
    if (N < 0) { x = 1 / x; N = -N; }
    double ans = 1.0, curr = x;
    while (N > 0) {
        if (N % 2 == 1) ans *= curr;
        curr *= curr;
        N /= 2;
    }
    return ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function myPow(x = 2.0, n = 10) {", vars: { x: "2.0", n: "10" }, log: "Binary Exponentiation (Fast Pow) in O(log n) time.", arrayState: [{ val: "2^10 = (2^2)^5 = 4^5" }, { val: "4^5 = 4 * 16^2" }, { val: "16^2 = 256" }, { val: "4 * 256 = 1024" }] },
      { line: 6, code: "  2.0^10 = 1024.0 (evaluated in 4 logarithmic iterations);", vars: { x: "2.0", n: "10", result: "1024.0" }, log: "Fast Exponentiation computes 2.0^10 = 1024.0 in O(log 10) steps.", arrayState: [{ val: "2.0^10 = 1024.0", match: true }] },
      { line: 11, code: "  return 1024.0; // POW(X, N) COMPLETE", vars: { status: "COMPLETE" }, log: "Pow(x, n) complete!", arrayState: [{ val: "1024.0", match: true }] }
    ]
  },

  // ── 298. SQUARE ROOT OF A NUMBER ──
  "square root of a number": {
    solutionJS: `function floorSqrt(n) {
  if (n === 0 || n === 1) return n;
  let low = 1, high = n, ans = 0;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (mid * mid === n) return mid;
    if (mid * mid < n) {
      ans = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return ans;
}`,
    solutionPY: `def floorSqrt(n: int) -> int:
    if n == 0 or n == 1: return n
    low, high, ans = 1, n, 0
    while low <= high:
        mid = (low + high) // 2
        if mid * mid == n: return mid
        if mid * mid < n:
            ans = mid
            low = mid + 1
        else:
            high = mid - 1
    return ans`,
    solutionCPP: `int floorSqrt(int n) {
    if (n == 0 || n == 1) return n;
    long long low = 1, high = n, ans = 0;
    while (low <= high) {
        long long mid = low + (high - low) / 2;
        if (mid * mid == n) return mid;
        if (mid * mid < n) {
            ans = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function floorSqrt(n = 5) {", vars: { n: "5" }, log: "Binary Search for floor square root of 5 in range [1, 5].", arrayState: [{ val: "Mid 3: 3^2=9>5" }, { val: "Mid 1: 1^2=1<=5 (ans=1)" }, { val: "Mid 2: 2^2=4<=5 (ans=2)" }] },
      { line: 6, code: "  floor(sqrt(5)) = 2 (since 2^2 = 4 <= 5 < 3^2 = 9);", vars: { n: "5", floorSqrt: "2" }, log: "Binary search finds maximum integer 2 where 2^2 = 4 <= 5. Return 2.", arrayState: [{ val: "2^2 = 4 <= 5", match: true }, { val: "Floor Sqrt: 2", match: true }] },
      { line: 13, code: "  return 2; // SQUARE ROOT OF A NUMBER COMPLETE", vars: { status: "COMPLETE" }, log: "Square root of a number complete!", arrayState: [{ val: "Sqrt: 2", match: true }] }
    ]
  },

  // ── 299. BINARY SEARCH ──
  "binary search": {
    solutionJS: `function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    solutionPY: `def search(nums: List[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target: return mid
        if nums[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1`,
    solutionCPP: `int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function search(nums = [-1,0,3,5,9,12], target = 9) {", vars: { low: "0", high: "5" }, log: "Classic Binary Search on sorted array. Shrink [low, high] window by half each step.", arrayState: [{ val: "-1" }, { val: "0" }, { val: "3" }, { val: "5" }, { val: "9" }, { val: "12" }] },
      { line: 4, code: "  mid=2(val=3)<9 -> low=3; mid=4(val=9)==9 -> found at idx 4;", vars: { mid: "4", target: "9" }, log: "Step 1: mid=2, val=3 < 9 -> low=3. Step 2: mid=4, val=9 === target. Return 4.", arrayState: [{ val: "-1" }, { val: "0" }, { val: "3" }, { val: "5" }, { val: "9", match: true }, { val: "12" }] },
      { line: 8, code: "  return 4; // BINARY SEARCH COMPLETE", vars: { status: "COMPLETE" }, log: "Binary Search complete!", arrayState: [{ val: "Index: 4", match: true }] }
    ]
  },

  // ── 300. SEARCH INSERT POSITION ──
  "search insert position": {
    solutionJS: `function searchInsert(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return low;
}`,
    solutionPY: `def searchInsert(nums: List[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target: return mid
        if nums[mid] < target: low = mid + 1
        else: high = mid - 1
    return low`,
    solutionCPP: `int searchInsert(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return low;
}`,
    visualizerSteps: [
      { line: 1, code: "function searchInsert(nums = [1,3,5,6], target = 5) {", vars: { low: "0", high: "3" }, log: "Binary Search for target or its sorted insert position in [1,3,5,6].", arrayState: [{ val: "1" }, { val: "3" }, { val: "5" }, { val: "6" }] },
      { line: 4, code: "  mid=1(val=3)<5 -> low=2; mid=2(val=5)==5 -> return idx 2;", vars: { mid: "2", target: "5" }, log: "Target 5 found at index 2. Return 2.", arrayState: [{ val: "1" }, { val: "3" }, { val: "5", match: true }, { val: "6" }] },
      { line: 8, code: "  return 2; // SEARCH INSERT POSITION COMPLETE", vars: { status: "COMPLETE" }, log: "Search Insert Position complete!", arrayState: [{ val: "Insert/Found at: 2", match: true }] }
    ]
  },

  // ── 301. SQRT(X) ──
  "sqrt(x)": {
    solutionJS: `function mySqrt(x) {
  if (x < 2) return x;
  let low = 1, high = Math.floor(x / 2), ans = 0;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (mid * mid === x) return mid;
    if (mid * mid < x) { ans = mid; low = mid + 1; }
    else high = mid - 1;
  }
  return ans;
}`,
    solutionPY: `def mySqrt(x: int) -> int:
    if x < 2: return x
    low, high, ans = 1, x // 2, 0
    while low <= high:
        mid = (low + high) // 2
        if mid * mid == x: return mid
        if mid * mid < x: ans = mid; low = mid + 1
        else: high = mid - 1
    return ans`,
    solutionCPP: `int mySqrt(int x) {
    if (x < 2) return x;
    long long low = 1, high = x / 2, ans = 0;
    while (low <= high) {
        long long mid = low + (high - low) / 2;
        if (mid * mid == x) return mid;
        if (mid * mid < x) { ans = mid; low = mid + 1; }
        else high = mid - 1;
    }
    return ans;
}`,
    visualizerSteps: [
      { line: 1, code: "function mySqrt(x = 8) {", vars: { x: "8" }, log: "Binary search for integer floor sqrt of 8. Search range [1, 4].", arrayState: [{ val: "mid=2: 4<8 (ans=2)" }, { val: "mid=3: 9>8" }, { val: "mid=2: final ans=2" }] },
      { line: 6, code: "  floor(sqrt(8)) = 2 (2^2=4 <= 8 < 3^2=9);", vars: { x: "8", result: "2" }, log: "Binary search returns floor sqrt 2 since 2^2=4 <= 8 < 9=3^2.", arrayState: [{ val: "2^2=4 <= 8", match: true }, { val: "sqrt(8) = 2", match: true }] },
      { line: 9, code: "  return 2; // SQRT(X) COMPLETE", vars: { status: "COMPLETE" }, log: "Sqrt(x) complete!", arrayState: [{ val: "2", match: true }] }
    ]
  },

  // ── 302. FIND FIRST AND LAST POSITION OF ELEMENT IN SORTED ARRAY ──
  "find first and last position of element in sorted array": {
    solutionJS: `function searchRange(nums, target) {
  const findBound = (isFirst) => {
    let low = 0, high = nums.length - 1, bound = -1;
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      if (nums[mid] === target) {
        bound = mid;
        if (isFirst) high = mid - 1;
        else low = mid + 1;
      } else if (nums[mid] < target) low = mid + 1;
      else high = mid - 1;
    }
    return bound;
  };
  return [findBound(true), findBound(false)];
}`,
    solutionPY: `def searchRange(nums: List[int], target: int) -> List[int]:
    def find_bound(is_first):
        low, high, bound = 0, len(nums) - 1, -1
        while low <= high:
            mid = (low + high) // 2
            if nums[mid] == target:
                bound = mid
                if is_first: high = mid - 1
                else: low = mid + 1
            elif nums[mid] < target: low = mid + 1
            else: high = mid - 1
        return bound
    return [find_bound(True), find_bound(False)]`,
    solutionCPP: `vector<int> searchRange(vector<int>& nums, int target) {
    auto findBound = [&](bool isFirst) {
        int low = 0, high = nums.size() - 1, bound = -1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) {
                bound = mid;
                if (isFirst) high = mid - 1;
                else low = mid + 1;
            } else if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return bound;
    };
    return {findBound(true), findBound(false)};
}`,
    visualizerSteps: [
      { line: 1, code: "function searchRange(nums = [5,7,7,8,8,10], target = 8) {", vars: { target: "8" }, log: "Two-pass binary search: first finds leftmost 8, second finds rightmost 8.", arrayState: [{ val: "5" }, { val: "7" }, { val: "7" }, { val: "8" }, { val: "8" }, { val: "10" }] },
      { line: 6, code: "  first bound: idx 3 (keep searching left); last bound: idx 4 (keep searching right);", vars: { first: "3", last: "4" }, log: "Leftmost 8 at index 3, rightmost 8 at index 4. Return [3, 4].", arrayState: [{ val: "5" }, { val: "7" }, { val: "7" }, { val: "8 (first)", match: true }, { val: "8 (last)", match: true }, { val: "10" }] },
      { line: 14, code: "  return [3, 4]; // FIND FIRST AND LAST POSITION COMPLETE", vars: { status: "COMPLETE" }, log: "Find First and Last Position complete!", arrayState: [{ val: "[3, 4]", match: true }] }
    ]
  },

  // ── 303. FIND MINIMUM IN ROTATED SORTED ARRAY ──
  "find minimum in rotated sorted array": {
    solutionJS: `function findMin(nums) {
  let low = 0, high = nums.length - 1;
  while (low < high) {
    let mid = Math.floor((low + high) / 2);
    if (nums[mid] > nums[high]) low = mid + 1;
    else high = mid;
  }
  return nums[low];
}`,
    solutionPY: `def findMin(nums: List[int]) -> int:
    low, high = 0, len(nums) - 1
    while low < high:
        mid = (low + high) // 2
        if nums[mid] > nums[high]: low = mid + 1
        else: high = mid
    return nums[low]`,
    solutionCPP: `int findMin(vector<int>& nums) {
    int low = 0, high = nums.size() - 1;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] > nums[high]) low = mid + 1;
        else high = mid;
    }
    return nums[low];
}`,
    visualizerSteps: [
      { line: 1, code: "function findMin(nums = [3,4,5,1,2]) {", vars: { nums: "[3,4,5,1,2]" }, log: "Binary search on rotated sorted array. Compare mid with high to find pivot/minimum.", arrayState: [{ val: "3" }, { val: "4" }, { val: "5" }, { val: "1" }, { val: "2" }] },
      { line: 4, code: "  mid=2(val=5)>high(val=2) -> low=3; mid=3(val=1)<=high -> high=3 -> nums[3]=1;", vars: { min: "1" }, log: "Rotation pivot at index 3. Minimum element is 1.", arrayState: [{ val: "3" }, { val: "4" }, { val: "5" }, { val: "1 (min)", match: true }, { val: "2" }] },
      { line: 7, code: "  return 1; // FIND MINIMUM IN ROTATED SORTED ARRAY COMPLETE", vars: { status: "COMPLETE" }, log: "Find Minimum in Rotated Sorted Array complete!", arrayState: [{ val: "Min: 1", match: true }] }
    ]
  },

  // ── 304. FIND PEAK ELEMENT ──
  "find peak element": {
    solutionJS: `function findPeakElement(nums) {
  let low = 0, high = nums.length - 1;
  while (low < high) {
    let mid = Math.floor((low + high) / 2);
    if (nums[mid] > nums[mid + 1]) high = mid;
    else low = mid + 1;
  }
  return low;
}`,
    solutionPY: `def findPeakElement(nums: List[int]) -> int:
    low, high = 0, len(nums) - 1
    while low < high:
        mid = (low + high) // 2
        if nums[mid] > nums[mid + 1]: high = mid
        else: low = mid + 1
    return low`,
    solutionCPP: `int findPeakElement(vector<int>& nums) {
    int low = 0, high = nums.size() - 1;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] > nums[mid + 1]) high = mid;
        else low = mid + 1;
    }
    return low;
}`,
    visualizerSteps: [
      { line: 1, code: "function findPeakElement(nums = [1,2,3,1]) {", vars: { nums: "[1,2,3,1]" }, log: "Binary search for peak. If nums[mid] > nums[mid+1], peak is on the left half.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3" }, { val: "1" }] },
      { line: 4, code: "  mid=1(val=2)<nums[2](3) -> low=2; low==high=2 -> peak at idx 2 (val=3);", vars: { peakIdx: "2", peakVal: "3" }, log: "Peak element 3 found at index 2. Return 2.", arrayState: [{ val: "1" }, { val: "2" }, { val: "3 (peak)", match: true }, { val: "1" }] },
      { line: 7, code: "  return 2; // FIND PEAK ELEMENT COMPLETE", vars: { status: "COMPLETE" }, log: "Find Peak Element complete!", arrayState: [{ val: "Peak idx: 2", match: true }] }
    ]
  },

  // ── 305. KOKO EATING BANANAS ──
  "koko eating bananas": {
    solutionJS: `function minEatingSpeed(piles, h) {
  let low = 1, high = Math.max(...piles);
  while (low < high) {
    let mid = Math.floor((low + high) / 2);
    let hours = piles.reduce((s, p) => s + Math.ceil(p / mid), 0);
    if (hours <= h) high = mid;
    else low = mid + 1;
  }
  return low;
}`,
    solutionPY: `def minEatingSpeed(piles: List[int], h: int) -> int:
    low, high = 1, max(piles)
    while low < high:
        mid = (low + high) // 2
        hours = sum(math.ceil(p / mid) for p in piles)
        if hours <= h: high = mid
        else: low = mid + 1
    return low`,
    solutionCPP: `int minEatingSpeed(vector<int>& piles, int h) {
    int low = 1, high = *max_element(piles.begin(), piles.end());
    while (low < high) {
        int mid = low + (high - low) / 2;
        int hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;
        if (hours <= h) high = mid;
        else low = mid + 1;
    }
    return low;
}`,
    visualizerSteps: [
      { line: 1, code: "function minEatingSpeed(piles = [3,6,7,11], h = 8) {", vars: { piles: "[3,6,7,11]", h: "8" }, log: "Binary search on eating speed k in [1, max(piles)=11]. Minimize k such that total hours <= h=8.", arrayState: [{ val: "Pile 1: 3" }, { val: "Pile 2: 6" }, { val: "Pile 3: 7" }, { val: "Pile 4: 11" }] },
      { line: 4, code: "  k=4: ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 <= h=8 -> high=4;", vars: { k: "4", totalHours: "8" }, log: "Speed k=4 yields exactly 8 hours = h. Minimum feasible speed is 4.", arrayState: [{ val: "k=4: 8hrs <= h=8", match: true }, { val: "Min Speed: 4", match: true }] },
      { line: 7, code: "  return 4; // KOKO EATING BANANAS COMPLETE", vars: { status: "COMPLETE" }, log: "Koko Eating Bananas complete!", arrayState: [{ val: "Min Speed: 4", match: true }] }
    ]
  },

  // ── 306. SEARCH A 2D MATRIX ──
  "search a 2d matrix": {
    solutionJS: `function searchMatrix(matrix, target) {
  let m = matrix.length, n = matrix[0].length;
  let low = 0, high = m * n - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let val = matrix[Math.floor(mid / n)][mid % n];
    if (val === target) return true;
    if (val < target) low = mid + 1;
    else high = mid - 1;
  }
  return false;
}`,
    solutionPY: `def searchMatrix(matrix: List[List[int]], target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    low, high = 0, m * n - 1
    while low <= high:
        mid = (low + high) // 2
        val = matrix[mid // n][mid % n]
        if val == target: return True
        if val < target: low = mid + 1
        else: high = mid - 1
    return False`,
    solutionCPP: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int m = matrix.size(), n = matrix[0].size();
    int low = 0, high = m * n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int val = matrix[mid / n][mid % n];
        if (val == target) return true;
        if (val < target) low = mid + 1;
        else high = mid - 1;
    }
    return false;
}`,
    visualizerSteps: [
      { line: 1, code: "function searchMatrix(matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3) {", vars: { target: "3" }, log: "Treat sorted 2D matrix as 1D array. Binary search index mapped via row=mid/n, col=mid%n.", arrayState: [{ val: "Row 0: [1,3,5,7]" }, { val: "Row 1: [10,11,16,20]" }, { val: "Row 2: [23,30,34,60]" }] },
      { line: 5, code: "  mid=5 -> matrix[1][1]=11 > 3 -> high=4; mid=2 -> matrix[0][2]=5>3 -> high=1; mid=0 -> val=1<3 -> low=1; mid=1 -> matrix[0][1]=3 -> found!", vars: { found: "true", position: "[0][1]" }, log: "Binary search mapped through 2D grid finds target 3 at matrix[0][1]. Return true.", arrayState: [{ val: "1" }, { val: "3 (found)", match: true }, { val: "5" }, { val: "7" }] },
      { line: 10, code: "  return true; // SEARCH A 2D MATRIX COMPLETE", vars: { status: "COMPLETE" }, log: "Search a 2D Matrix complete!", arrayState: [{ val: "Found: true", match: true }] }
    ]
  },

  // ── 307. SEARCH IN ROTATED SORTED ARRAY ──
  "search in rotated sorted array": {
    solutionJS: `function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (nums[mid] === target) return mid;
    if (nums[low] <= nums[mid]) {
      if (nums[low] <= target && target < nums[mid]) high = mid - 1;
      else low = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[high]) low = mid + 1;
      else high = mid - 1;
    }
  }
  return -1;
}`,
    solutionPY: `def search(nums: List[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target: return mid
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]: high = mid - 1
            else: low = mid + 1
        else:
            if nums[mid] < target <= nums[high]: low = mid + 1
            else: high = mid - 1
    return -1`,
    solutionCPP: `int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        if (nums[low] <= nums[mid]) {
            if (nums[low] <= target && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}`,
    visualizerSteps: [
      { line: 1, code: "function search(nums = [4,5,6,7,0,1,2], target = 0) {", vars: { nums: "[4,5,6,7,0,1,2]", target: "0" }, log: "Binary search in rotated array. Determine which half is sorted, then check if target lies in it.", arrayState: [{ val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "0" }, { val: "1" }, { val: "2" }] },
      { line: 5, code: "  mid=3(val=7): left [4..7] sorted, 0 not in [4,7] -> low=4; mid=5(val=1)>0 -> high=4; mid=4(val=0)==target;", vars: { mid: "4", target: "0" }, log: "Rotated binary search locates target 0 at index 4. Return 4.", arrayState: [{ val: "4" }, { val: "5" }, { val: "6" }, { val: "7" }, { val: "0 (found)", match: true }, { val: "1" }, { val: "2" }] },
      { line: 13, code: "  return 4; // SEARCH IN ROTATED SORTED ARRAY COMPLETE", vars: { status: "COMPLETE" }, log: "Search in Rotated Sorted Array complete!", arrayState: [{ val: "Index: 4", match: true }] }
    ]
  },

  // ── 308. TIME BASED KEY-VALUE STORE ──
  "time based key-value store": {
    solutionJS: `class TimeMap {
  constructor() { this.map = new Map(); }
  set(key, value, timestamp) {
    if (!this.map.has(key)) this.map.set(key, []);
    this.map.get(key).push([timestamp, value]);
  }
  get(key, timestamp) {
    if (!this.map.has(key)) return "";
    let arr = this.map.get(key);
    let low = 0, high = arr.length - 1, res = "";
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      if (arr[mid][0] <= timestamp) { res = arr[mid][1]; low = mid + 1; }
      else high = mid - 1;
    }
    return res;
  }
}`,
    solutionPY: `class TimeMap:
    def __init__(self): self.map = defaultdict(list)
    def set(self, key: str, value: str, timestamp: int) -> None:
        self.map[key].append((timestamp, value))
    def get(self, key: str, timestamp: int) -> str:
        arr = self.map[key]
        low, high, res = 0, len(arr) - 1, ""
        while low <= high:
            mid = (low + high) // 2
            if arr[mid][0] <= timestamp: res = arr[mid][1]; low = mid + 1
            else: high = mid - 1
        return res`,
    solutionCPP: `class TimeMap {
    unordered_map<string, vector<pair<int,string>>> mp;
public:
    TimeMap() {}
    void set(string key, string value, int timestamp) {
        mp[key].push_back({timestamp, value});
    }
    string get(string key, int timestamp) {
        auto& arr = mp[key];
        int low = 0, high = arr.size() - 1;
        string res = "";
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid].first <= timestamp) { res = arr[mid].second; low = mid + 1; }
            else high = mid - 1;
        }
        return res;
    }
};`,
    visualizerSteps: [
      { line: 1, code: "set('foo','bar',1); set('foo','bar2',4); get('foo',3); get('foo',5);", vars: { key: "'foo'" }, log: "TimeMap stores (timestamp, value) pairs. Binary search for largest timestamp <= query.", arrayState: [{ val: "t=1: 'bar'" }, { val: "t=4: 'bar2'" }] },
      { line: 7, code: "  get('foo',3): largest t<=3 is t=1 -> 'bar'; get('foo',5): largest t<=5 is t=4 -> 'bar2';", vars: { q1: "get(3)='bar'", q2: "get(5)='bar2'" }, log: "Binary search returns 'bar' for t<=3 and 'bar2' for t<=5.", arrayState: [{ val: "get(3): 'bar'", match: true }, { val: "get(5): 'bar2'", match: true }] },
      { line: 15, code: "  // TIME BASED KEY-VALUE STORE COMPLETE", vars: { status: "COMPLETE" }, log: "Time Based Key-Value Store complete!", arrayState: [{ val: "Binary Search on timestamps", match: true }] }
    ]
  },

  // ── 309. COUNTING BITS ──
  "counting bits": {
    solutionJS: `function countBits(n) {
  let dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}`,
    solutionPY: `def countBits(n: int) -> List[int]:
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp`,
    solutionCPP: `vector<int> countBits(int n) {
    vector<int> dp(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        dp[i] = dp[i >> 1] + (i & 1);
    }
    return dp;
}`,
    visualizerSteps: [
      { line: 1, code: "function countBits(n = 5) {", vars: { n: "5" }, log: "DP bit counting: dp[i] = dp[i>>1] + (i&1). Right shift halves the number, add LSB.", arrayState: [{ val: "0: 0b0 (0)" }, { val: "1: 0b1 (1)" }, { val: "2: 0b10 (1)" }, { val: "3: 0b11 (2)" }, { val: "4: 0b100 (1)" }, { val: "5: 0b101 (2)" }] },
      { line: 3, code: "  dp[5]=dp[2]+(5&1)=1+1=2; result=[0,1,1,2,1,2];", vars: { result: "[0,1,1,2,1,2]" }, log: "Each number's bit count derived from half: [0,1,1,2,1,2].", arrayState: [{ val: "0", match: true }, { val: "1", match: true }, { val: "1", match: true }, { val: "2", match: true }, { val: "1", match: true }, { val: "2", match: true }] },
      { line: 5, code: "  return [0,1,1,2,1,2]; // COUNTING BITS COMPLETE", vars: { status: "COMPLETE" }, log: "Counting Bits complete!", arrayState: [{ val: "[0,1,1,2,1,2]", match: true }] }
    ]
  },

  // ── 310. NUMBER OF 1 BITS ──
  "number of 1 bits": {
    solutionJS: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    count += n & 1;
    n >>>= 1;
  }
  return count;
}`,
    solutionPY: `def hammingWeight(n: int) -> int:
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count`,
    solutionCPP: `int hammingWeight(uint32_t n) {
    int count = 0;
    while (n) {
        count += n & 1;
        n >>= 1;
    }
    return count;
}`,
    visualizerSteps: [
      { line: 1, code: "function hammingWeight(n = 11) { // 11 = 0b1011", vars: { n: "11 (0b1011)" }, log: "Count set bits (1s) in binary representation of 11 = 0b1011.", arrayState: [{ val: "0b1011" }, { val: "Bit 0: 1" }, { val: "Bit 1: 1" }, { val: "Bit 2: 0" }, { val: "Bit 3: 1" }] },
      { line: 3, code: "  11(1011): 1+1+0+1 = 3 set bits (Hamming Weight);", vars: { count: "3" }, log: "Right-shift loop counts 3 set bits in 0b1011. Return 3.", arrayState: [{ val: "bit 0: 1", match: true }, { val: "bit 1: 1", match: true }, { val: "bit 2: 0" }, { val: "bit 3: 1", match: true }, { val: "Total: 3", match: true }] },
      { line: 6, code: "  return 3; // NUMBER OF 1 BITS COMPLETE", vars: { status: "COMPLETE" }, log: "Number of 1 Bits complete!", arrayState: [{ val: "Hamming Weight: 3", match: true }] }
    ]
  },

  // ── 311. REVERSE BITS ──
  "reverse bits": {
    solutionJS: `function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);
    n >>>= 1;
  }
  return result >>> 0;
}`,
    solutionPY: `def reverseBits(n: int) -> int:
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result`,
    solutionCPP: `uint32_t reverseBits(uint32_t n) {
    uint32_t result = 0;
    for (int i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);
        n >>= 1;
    }
    return result;
}`,
    visualizerSteps: [
      { line: 1, code: "function reverseBits(n = 43261596) { // 0b00000010100101000001111010011100", vars: { n: "43261596", binary: "0b00000010100101000001111010011100" }, log: "Reverse all 32 bits of integer. Extract LSB and shift into result from left.", arrayState: [{ val: "Input:  0b00000010100101000001111010011100" }, { val: "Output: 0b00111001011110000010100101000000" }] },
      { line: 3, code: "  reverse 32 bits of 43261596 -> 964176192;", vars: { result: "964176192", reversed: "0b00111001011110000010100101000000" }, log: "32-iteration bit reversal yields 964176192.", arrayState: [{ val: "Input bits reversed", match: true }, { val: "964176192", match: true }] },
      { line: 7, code: "  return 964176192; // REVERSE BITS COMPLETE", vars: { status: "COMPLETE" }, log: "Reverse Bits complete!", arrayState: [{ val: "964176192", match: true }] }
    ]
  },

  // ── 312. SINGLE NUMBER ──
  "single number": {
    solutionJS: `function singleNumber(nums) {
  let xor = 0;
  for (let num of nums) xor ^= num;
  return xor;
}`,
    solutionPY: `def singleNumber(nums: List[int]) -> int:
    xor = 0
    for num in nums: xor ^= num
    return xor`,
    solutionCPP: `int singleNumber(vector<int>& nums) {
    int xor_val = 0;
    for (int num : nums) xor_val ^= num;
    return xor_val;
}`,
    visualizerSteps: [
      { line: 1, code: "function singleNumber(nums = [4,1,2,1,2]) {", vars: { nums: "[4,1,2,1,2]" }, log: "XOR all numbers. Pairs cancel out (a^a=0), leaving the unique element.", arrayState: [{ val: "4^1=5" }, { val: "5^2=7" }, { val: "7^1=6" }, { val: "6^2=4" }] },
      { line: 2, code: "  4^1^2^1^2 = 4 (pairs 1,2 cancel via XOR);", vars: { xorResult: "4" }, log: "XOR chain: 4^1^2^1^2 = 4. Only non-paired element survives.", arrayState: [{ val: "1^1 = 0", match: false }, { val: "2^2 = 0", match: false }, { val: "4 (single)", match: true }] },
      { line: 3, code: "  return 4; // SINGLE NUMBER COMPLETE", vars: { status: "COMPLETE" }, log: "Single Number complete!", arrayState: [{ val: "Single: 4", match: true }] }
    ]
  },

  // ── 313. REVERSE INTEGER ──
  "reverse integer": {
    solutionJS: `function reverse(x) {
  const MAX = 2147483647, MIN = -2147483648;
  let sign = x < 0 ? -1 : 1;
  let rev = parseInt(Math.abs(x).toString().split('').reverse().join('')) * sign;
  return (rev > MAX || rev < MIN) ? 0 : rev;
}`,
    solutionPY: `def reverse(x: int) -> int:
    MAX, MIN = 2**31 - 1, -(2**31)
    sign = -1 if x < 0 else 1
    rev = int(str(abs(x))[::-1]) * sign
    return rev if MIN <= rev <= MAX else 0`,
    solutionCPP: `int reverse(int x) {
    long long rev = 0;
    while (x != 0) {
        rev = rev * 10 + x % 10;
        x /= 10;
    }
    return (rev > INT_MAX || rev < INT_MIN) ? 0 : rev;
}`,
    visualizerSteps: [
      { line: 1, code: "function reverse(x = 123) {", vars: { x: "123" }, log: "Reverse digits of integer 123. Check 32-bit overflow bounds.", arrayState: [{ val: "123 -> '321'" }] },
      { line: 4, code: "  reverse('123') = '321' -> 321, within INT range -> return 321;", vars: { reversed: "321" }, log: "Digit reversal gives 321. No overflow. Return 321.", arrayState: [{ val: "321", match: true }, { val: "Within bounds", match: true }] },
      { line: 5, code: "  return 321; // REVERSE INTEGER COMPLETE", vars: { status: "COMPLETE" }, log: "Reverse Integer complete!", arrayState: [{ val: "321", match: true }] }
    ]
  },

  // ── 314. SINGLE NUMBER II ──
  "single number ii": {
    solutionJS: `function singleNumber(nums) {
  let ones = 0, twos = 0;
  for (let num of nums) {
    ones = (ones ^ num) & ~twos;
    twos = (twos ^ num) & ~ones;
  }
  return ones;
}`,
    solutionPY: `def singleNumber(nums: List[int]) -> int:
    ones, twos = 0, 0
    for num in nums:
        ones = (ones ^ num) & ~twos
        twos = (twos ^ num) & ~ones
    return ones`,
    solutionCPP: `int singleNumber(vector<int>& nums) {
    int ones = 0, twos = 0;
    for (int num : nums) {
        ones = (ones ^ num) & ~twos;
        twos = (twos ^ num) & ~ones;
    }
    return ones;
}`,
    visualizerSteps: [
      { line: 1, code: "function singleNumber(nums = [2,2,3,2]) {", vars: { nums: "[2,2,3,2]" }, log: "Bit manipulation with two accumulators 'ones' and 'twos'. Track bits appearing 1 vs 2 times mod 3.", arrayState: [{ val: "2(010): ones=010, twos=000" }, { val: "2(010): ones=000, twos=010" }, { val: "3(011): ones=011, twos=000" }, { val: "2(010): ones=001, twos=010" }] },
      { line: 5, code: "  ones=0b001=1? No, ones=3 (0b011 after all updates) -> single number is 3;", vars: { ones: "3", result: "3" }, log: "State machine accumulates: ones=3 (0b011) after all 4 numbers. Single element is 3.", arrayState: [{ val: "2 appears 3x -> cancels", match: false }, { val: "3 appears 1x -> remains", match: true }, { val: "Single: 3", match: true }] },
      { line: 6, code: "  return 3; // SINGLE NUMBER II COMPLETE", vars: { status: "COMPLETE" }, log: "Single Number II complete!", arrayState: [{ val: "Single: 3", match: true }] }
    ]
  },

  // ── 315. SUM OF TWO INTEGERS ──
  "sum of two integers": {
    solutionJS: `function getSum(a, b) {
  while (b !== 0) {
    let carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a;
}`,
    solutionPY: `def getSum(a: int, b: int) -> int:
    MASK = 0xFFFFFFFF
    MAX = 0x7FFFFFFF
    while b & MASK:
        carry = ((a & b) << 1) & MASK
        a = (a ^ b) & MASK
        b = carry
    return a if a <= MAX else ~(a ^ MASK)`,
    solutionCPP: `int getSum(int a, int b) {
    while (b != 0) {
        int carry = (a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}`,
    visualizerSteps: [
      { line: 1, code: "function getSum(a = 1, b = 2) {", vars: { a: "1 (01)", b: "2 (10)" }, log: "Add two integers without '+' operator. XOR for sum bits, AND+shift for carry.", arrayState: [{ val: "iter 1: carry=(01&10)<<1=0, a=01^10=11, b=0" }] },
      { line: 2, code: "  iter1: carry=(1&2)<<1=0, a=1^2=3, b=0 -> loop ends -> return 3;", vars: { result: "3" }, log: "XOR gives sum 3. AND carry is 0 (no overlapping bits). Return 3 = 1 + 2.", arrayState: [{ val: "1 XOR 2 = 3", match: true }, { val: "Carry = 0", match: true }, { val: "Sum: 3", match: true }] },
      { line: 6, code: "  return 3; // SUM OF TWO INTEGERS COMPLETE", vars: { status: "COMPLETE" }, log: "Sum of Two Integers complete!", arrayState: [{ val: "3", match: true }] }
    ]
  }
};
