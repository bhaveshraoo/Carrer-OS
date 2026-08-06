export interface SeedDSAQuestion {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  solution_javascript: string;
  solution_python: string;
  solution_cpp: string;
  solution_explanation: string;
  roadmaps: string[];
}

export const SEED_DSA_QUESTIONS: SeedDSAQuestion[] = [
  {
    id: "dsa_1",
    title: "Two Sum",
    topic: "arrays",
    difficulty: "Easy",
    prompt: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    solution_javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    solution_python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
    solution_cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int diff = target - nums[i];
            if (seen.count(diff)) return {seen[diff], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
    solution_explanation: "Use a HashMap to store target remainders in O(N) time complexity.",
    roadmaps: ["easy-to-medium", "faang"],
  },
  {
    id: "dsa_2",
    title: "Valid Anagram",
    topic: "strings",
    difficulty: "Easy",
    prompt: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
    solution_javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (let char of s) count[char] = (count[char] || 0) + 1;
  for (let char of t) {
    if (!count[char]) return false;
    count[char]--;
  }
  return true;
}`,
    solution_python: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t): return False
    return sorted(s) == sorted(t)`,
    solution_cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.length() != t.length()) return false;
        vector<int> freq(26, 0);
        for (char c : s) freq[c - 'a']++;
        for (char c : t) {
            if (--freq[c - 'a'] < 0) return false;
        }
        return true;
    }
};`,
    solution_explanation: "Count character frequencies using an array or map in O(N) time and O(1) space.",
    roadmaps: ["easy-to-medium"],
  },
  {
    id: "dsa_3",
    title: "LRU Cache Architecture",
    topic: "system-design",
    difficulty: "Medium",
    prompt: "Design a Data Structure that follows the constraints of a Least Recently Used (LRU) Cache in O(1) time.",
    solution_javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }
}`,
    solution_python: `from collections import OrderedDict
class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()
    def get(self, key: int) -> int:
        if key not in self.cache: return -1
        self.cache.move_to_end(key)
        return self.cache[key]
    def put(self, key: int, value: int) -> None:
        if key in self.cache: self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)`,
    solution_cpp: `class LRUCache {
    int cap;
    list<pair<int, int>> dq;
    unordered_map<int, list<pair<int, int>>::iterator> ma;
public:
    LRUCache(int capacity) : cap(capacity) {}
    int get(int key) {
        if (ma.find(key) == ma.end()) return -1;
        dq.splice(dq.begin(), dq, ma[key]);
        return ma[key]->second;
    }
};`,
    solution_explanation: "Combine Doubly-Linked List and HashMap to achieve O(1) lookup and eviction.",
    roadmaps: ["faang", "system-design"],
  },
  {
    id: "dsa_4",
    title: "Maximum Subarray (Kadane's Algorithm)",
    topic: "dp",
    difficulty: "Medium",
    prompt: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    solution_javascript: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let curSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curSum = Math.max(nums[i], curSum + nums[i]);
    maxSum = Math.max(maxSum, curSum);
  }
  return maxSum;
}`,
    solution_python: `def max_sub_array(nums):
    max_sum = cur_sum = nums[0]
    for num in nums[1:]:
        cur_sum = max(num, cur_sum + num)
        max_sum = max(max_sum, cur_sum)
    return max_sum`,
    solution_cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int max_sum = nums[0], cur_sum = nums[0];
        for (size_t i = 1; i < nums.size(); ++i) {
            cur_sum = max(nums[i], cur_sum + nums[i]);
            max_sum = max(max_sum, cur_sum);
        }
        return max_sum;
    }
};`,
    solution_explanation: "Kadane's Algorithm: Maintain running sum and reset if negative.",
    roadmaps: ["easy-to-medium", "faang"],
  },
];
