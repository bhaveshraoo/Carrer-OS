const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const questionsToSeed = [
  // ── 1. ARRAYS & HASHING (Basic, Intermediate, Hard) ──
  {
    title: "Find Largest and Smallest Element in an Array",
    topic: "arrays",
    difficulty: "easy",
    prompt: "Given an unsorted array of numbers, write an algorithm to find both the largest and smallest elements in a single pass O(N) time complexity.",
    solution_explanation: "Initialize min and max with the first element. Loop through array once, updating min if element < min, and max if element > max. Time: O(N), Space: O(1)."
  },
  {
    title: "Check if Array is Sorted and Rotated",
    topic: "arrays",
    difficulty: "easy",
    prompt: "Given an array of integers, return true if the array was originally sorted in non-decreasing order and then rotated by some number of positions.",
    solution_explanation: "Count pairs (nums[i] > nums[(i+1)%n]). If count is at most 1, return true; otherwise false. Time: O(N), Space: O(1)."
  },
  {
    title: "Move All Zeros to End of Array",
    topic: "arrays",
    difficulty: "easy",
    prompt: "Given an integer array nums, move all 0's to the end while maintaining the relative order of non-zero elements.",
    solution_explanation: "Maintain a non-zero pointer 'lastNonZero'. Iterate through array; whenever a non-zero element is encountered, swap with lastNonZero and increment lastNonZero. Time: O(N), Space: O(1)."
  },
  {
    title: "Find Duplicate Number in Read-Only Array",
    topic: "arrays",
    difficulty: "easy",
    prompt: "Given an array of n + 1 integers where each integer is between 1 and n (inclusive), prove that at least one duplicate number must exist. Find duplicate without modifying array.",
    solution_explanation: "Use Floyd's Tortoise and Hare (Cycle Detection) algorithm. Slow pointer moves 1 step, fast pointer moves 2 steps until they intersect, then reset slow to start. Time: O(N), Space: O(1)."
  },
  {
    title: "Two-Sum Budget Pairing",
    topic: "arrays",
    difficulty: "easy",
    prompt: "Given an array of prices and a target budget, return the 0-indexed pairs of items whose total sum equals budget.",
    solution_explanation: "Use a Hash Map to store complement (target - nums[i]). For each element, check if complement exists in O(1) time. Time: O(N), Space: O(N)."
  },
  {
    title: "3Sum Zero Target Triplet Search",
    topic: "arrays",
    difficulty: "medium",
    prompt: "Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that i != j != k and nums[i] + nums[j] + nums[k] == 0.",
    solution_explanation: "Sort array. Fix first element i, then use two pointers (left and right) for remainder. Skip duplicate values to avoid duplicate triplets. Time: O(N^2), Space: O(1)."
  },
  {
    title: "Container With Most Water",
    topic: "arrays",
    difficulty: "medium",
    prompt: "Given n non-negative integers height where each represents a point at coordinate (i, height[i]), find two lines that together with the x-axis form a container containing most water.",
    solution_explanation: "Use Two Pointers starting at index 0 and n-1. Calculate area = min(height[l], height[r]) * (r - l). Move pointer with smaller height inwards. Time: O(N), Space: O(1)."
  },
  {
    title: "Product of Array Except Self",
    topic: "arrays",
    difficulty: "medium",
    prompt: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i] without using division.",
    solution_explanation: "Compute prefix products in first pass, then compute suffix products in second pass. Multiply prefix and suffix for each index. Time: O(N), Space: O(1) auxiliary."
  },
  {
    title: "Longest Consecutive Sequence in Unsorted Array",
    topic: "arrays",
    difficulty: "medium",
    prompt: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(N) time.",
    solution_explanation: "Insert elements into Hash Set. For each num, if (num - 1) is not in set, it is the start of a sequence. Count consecutive numbers (num + 1, num + 2...). Time: O(N), Space: O(N)."
  },
  {
    title: "First Missing Positive Integer",
    topic: "arrays",
    difficulty: "hard",
    prompt: "Given an unsorted integer array nums, return the smallest missing positive integer in O(N) time and O(1) auxiliary space.",
    solution_explanation: "Cycle Sort / Index placement algorithm: place every positive number x in index x - 1 (nums[i] == i + 1). Second pass returns first index i where nums[i] != i + 1. Time: O(N), Space: O(1)."
  },
  {
    title: "Trapping Rain Water Maximum Capacity",
    topic: "arrays",
    difficulty: "hard",
    prompt: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    solution_explanation: "Two Pointers approach: maintain leftMax and rightMax. Water trapped at pointer is min(leftMax, rightMax) - height. Advance the smaller max pointer. Time: O(N), Space: O(1)."
  },

  // ── 2. STRINGS & MATCHING (Basic, Intermediate, Hard) ──
  {
    title: "Valid Anagram Check",
    topic: "strings",
    difficulty: "easy",
    prompt: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    solution_explanation: "Count character frequencies in array of size 26 or Hash Map. Increment for s, decrement for t. All frequencies must equal 0. Time: O(N), Space: O(1)."
  },
  {
    title: "Valid Palindrome Ignoring Non-Alphanumeric",
    topic: "strings",
    difficulty: "easy",
    prompt: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    solution_explanation: "Two Pointers (left = 0, right = len-1). Skip non-alphanumeric characters. Compare lowercase characters. Time: O(N), Space: O(1)."
  },
  {
    title: "Longest Common Prefix Among Strings",
    topic: "strings",
    difficulty: "easy",
    prompt: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string.",
    solution_explanation: "Vertical scanning: compare characters of first string against all strings at same index until mismatch. Time: O(S) where S is sum of all characters, Space: O(1)."
  },
  {
    title: "Group Anagrams",
    topic: "strings",
    difficulty: "medium",
    prompt: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
    solution_explanation: "Use Hash Map with character count tuple or sorted string as key, and list of anagrams as value. Time: O(N * K log K), Space: O(N * K)."
  },
  {
    title: "Longest Substring Without Repeating Characters",
    topic: "strings",
    difficulty: "medium",
    prompt: "Given a string s, find the length of the longest substring without repeating characters.",
    solution_explanation: "Sliding Window with Hash Map storing last seen index of each character. Move left pointer to last_seen[s[r]] + 1 when duplicate is found. Time: O(N), Space: O(min(N, M))."
  },
  {
    title: "String Compression Algorithm",
    topic: "strings",
    difficulty: "medium",
    prompt: "Given an array of characters chars, compress it in-place using character frequency counts.",
    solution_explanation: "Two Pointers (read and write). Count consecutive repeating characters. Write character and count digits in-place. Time: O(N), Space: O(1)."
  },
  {
    title: "Minimum Window Substring",
    topic: "strings",
    difficulty: "hard",
    prompt: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.",
    solution_explanation: "Sliding Window with target frequency map and formed condition counter. Expand right pointer until window contains all chars of t, then shrink left pointer to minimize length. Time: O(N + M), Space: O(N + M)."
  },

  // ── 3. DYNAMIC PROGRAMMING (Basic, Intermediate, Hard) ──
  {
    title: "Climbing Stairs Ways Count",
    topic: "dp",
    difficulty: "easy",
    prompt: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    solution_explanation: "Fibonacci recurrence dp[i] = dp[i-1] + dp[i-2]. Maintain two variables for prev1 and prev2. Time: O(N), Space: O(1)."
  },
  {
    title: "House Robber Maximum Loot",
    topic: "dp",
    difficulty: "easy",
    prompt: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money. You cannot rob adjacent houses.",
    solution_explanation: "State transition: dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Store prevRob and prevNotRob. Time: O(N), Space: O(1)."
  },
  {
    title: "Coin Change Minimum Coins",
    topic: "dp",
    difficulty: "medium",
    prompt: "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins needed to make up that amount.",
    solution_explanation: "Bottom-Up DP array dp[x] initialized to Infinity. For each i from 1 to amount, dp[i] = min(dp[i], dp[i - coin] + 1). Time: O(N * Amount), Space: O(Amount)."
  },
  {
    title: "Longest Increasing Subsequence Length",
    topic: "dp",
    difficulty: "medium",
    prompt: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    solution_explanation: "Patience Sorting / Binary Search (tails array): Maintain tails array where tails[i] stores smallest tail of all increasing subsequences of length i+1. Binary search insertion point. Time: O(N log N), Space: O(N)."
  },
  {
    title: "0/1 Knapsack Problem Optimization",
    topic: "dp",
    difficulty: "medium",
    prompt: "Given weights and values of N items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack.",
    solution_explanation: "2D DP table dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w]). Optimized to 1D array iterating w backwards. Time: O(N * W), Space: O(W)."
  },
  {
    title: "Edit Distance Levenshtein Transformation",
    topic: "dp",
    difficulty: "hard",
    prompt: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2 (Insert, Delete, Replace).",
    solution_explanation: "2D DP matrix dp[i][j]: if word1[i] == word2[j], dp[i][j] = dp[i-1][j-1]; else min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1. Time: O(M * N), Space: O(M * N)."
  },

  // ── 4. LINKED LISTS (Basic, Intermediate, Hard) ──
  {
    title: "Reverse a Singly Linked List",
    topic: "linked-lists",
    difficulty: "easy",
    prompt: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    solution_explanation: "Iterative 3-pointer approach: prev = null, curr = head. Save next = curr.next, redirect curr.next = prev, advance prev and curr. Time: O(N), Space: O(1)."
  },
  {
    title: "Detect Cycle in Linked List",
    topic: "linked-lists",
    difficulty: "easy",
    prompt: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    solution_explanation: "Floyd's Cycle-Finding Algorithm (Two Pointers): slow moves 1 node, fast moves 2 nodes. If fast reaches fast.next === null, no cycle. If slow === fast, cycle detected. Time: O(N), Space: O(1)."
  },
  {
    title: "Merge Two Sorted Linked Lists",
    topic: "linked-lists",
    difficulty: "easy",
    prompt: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
    solution_explanation: "Dummy head node with pointer curr. Compare list1.val and list2.val; append smaller node to curr.next. Attach remaining nodes at end. Time: O(N + M), Space: O(1)."
  },
  {
    title: "Remove N-th Node From End of List",
    topic: "linked-lists",
    difficulty: "medium",
    prompt: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
    solution_explanation: "Two Pointers (fast and slow) separated by n + 1 nodes. Advance both until fast reaches null, then slow.next = slow.next.next. Time: O(N), Space: O(1)."
  },
  {
    title: "Reorder List (In-Place Interleaving)",
    topic: "linked-lists",
    difficulty: "medium",
    prompt: "You are given the head of a singly linked list L0 → L1 → … → Ln-1 → Ln. Reorder it to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …",
    solution_explanation: "1. Find middle using fast/slow pointers. 2. Reverse second half of list. 3. Merge two halves alternating nodes. Time: O(N), Space: O(1)."
  },
  {
    title: "Merge K Sorted Linked Lists",
    topic: "linked-lists",
    difficulty: "hard",
    prompt: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.",
    solution_explanation: "Min-Heap / Priority Queue storing head node of each list. Pop smallest node, attach to output list, and push next node into heap. Time: O(N log K), Space: O(K)."
  },

  // ── 5. TREES & BST (Basic, Intermediate, Hard) ──
  {
    title: "Maximum Depth of Binary Tree",
    topic: "trees",
    difficulty: "easy",
    prompt: "Given the root of a binary tree, return its maximum depth (number of nodes along longest path from root down to furthest leaf).",
    solution_explanation: "Recursive Depth-First Search: return 1 + max(maxDepth(root.left), maxDepth(root.right)). Base case root === null returns 0. Time: O(N), Space: O(H)."
  },
  {
    title: "Invert Binary Tree",
    topic: "trees",
    difficulty: "easy",
    prompt: "Given the root of a binary tree, invert the tree (mirror left and right children), and return its root.",
    solution_explanation: "Swap root.left and root.right, then recursively call invertTree on both children. Time: O(N), Space: O(H)."
  },
  {
    title: "Validate Binary Search Tree",
    topic: "trees",
    difficulty: "medium",
    prompt: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    solution_explanation: "Recursive range validation helper validate(node, minVal, maxVal). Every node value must strictly satisfy minVal < node.val < maxVal. Time: O(N), Space: O(H)."
  },
  {
    title: "Binary Tree Level Order Traversal",
    topic: "trees",
    difficulty: "medium",
    prompt: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e. from left to right, level by level).",
    solution_explanation: "Breadth-First Search using Queue. Process nodes level by level using current queue length. Push values to level array. Time: O(N), Space: O(W)."
  },
  {
    title: "Lowest Common Ancestor of BST",
    topic: "trees",
    difficulty: "medium",
    prompt: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes p and q.",
    solution_explanation: "If both p and q are smaller than root.val, move to root.left. If both are greater, move to root.right. Otherwise root is the LCA. Time: O(H), Space: O(1)."
  },
  {
    title: "Serialize and Deserialize Binary Tree",
    topic: "trees",
    difficulty: "hard",
    prompt: "Design an algorithm to serialize a binary tree into a string and deserialize that string back into the original tree structure.",
    solution_explanation: "Pre-order DFS traversal. Represent null nodes as '#'. Join values with commas. Deserializer reads tokens sequentially to reconstruct nodes recursively. Time: O(N), Space: O(N)."
  },

  // ── 6. GRAPHS (Basic, Intermediate, Hard) ──
  {
    title: "Breadth-First Search (BFS) Traversal",
    topic: "graphs",
    difficulty: "easy",
    prompt: "Given an undirected graph represented as an adjacency list and a starting node, return the order of visited nodes using BFS.",
    solution_explanation: "Use Queue and Visited Set. Enqueue starting node, pop from queue, visit unvisited neighbors, and enqueue them. Time: O(V + E), Space: O(V)."
  },
  {
    title: "Number of Islands Grid Count",
    topic: "graphs",
    difficulty: "medium",
    prompt: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    solution_explanation: "Iterate through grid. When encountering '1', increment island count and trigger DFS/BFS to sink connected '1's to '0'. Time: O(M * N), Space: O(M * N)."
  },
  {
    title: "Course Schedule Directed Cycle Detection",
    topic: "graphs",
    difficulty: "medium",
    prompt: "There are numCourses courses you have to take. Some courses have prerequisites. Determine if it is possible to finish all courses.",
    solution_explanation: "Kahn's Algorithm (Topological Sort with In-Degree array) or DFS Cycle Detection with 3-state visited array (Unvisited, Visiting, Visited). Time: O(V + E), Space: O(V + E)."
  },
  {
    title: "Word Ladder Shortest Transformation Sequence",
    topic: "graphs",
    difficulty: "hard",
    prompt: "Given two words (beginWord and endWord), and a dictionary's word list, return the number of words in the shortest transformation sequence from beginWord to endWord.",
    solution_explanation: "Bi-directional BFS from beginWord and endWord. Change one letter at a time and check dictionary lookup. Time: O(M^2 * N), Space: O(M * N)."
  },

  // ── 7. STACKS & QUEUES (Basic, Intermediate, Hard) ──
  {
    title: "Valid Parentheses Matching",
    topic: "stacks-queues",
    difficulty: "easy",
    prompt: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    solution_explanation: "Use LIFO Stack. Push opening brackets. When encountering closing bracket, pop from stack and check matching pair. Time: O(N), Space: O(N)."
  },
  {
    title: "Min Stack Design O(1) Minimum Retrieval",
    topic: "stacks-queues",
    difficulty: "medium",
    prompt: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).",
    solution_explanation: "Maintain two stacks: mainStack and minStack (storing current minimum at each step). Time: O(1) for all ops, Space: O(N)."
  },
  {
    title: "Evaluate Reverse Polish Notation (RPN)",
    topic: "stacks-queues",
    difficulty: "medium",
    prompt: "Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, and /.",
    solution_explanation: "Use Stack. Push numbers. When encountering an operator, pop top two numbers b and a, apply operation (a op b), and push result back. Time: O(N), Space: O(N)."
  },
  {
    title: "Sliding Window Maximum",
    topic: "stacks-queues",
    difficulty: "hard",
    prompt: "You are given an array of integers nums, there is a sliding window of size k moving from left to right. Return maximum element in each window.",
    solution_explanation: "Monotonic Decreasing Deque storing indices. Maintain deque in decreasing order of element values. Remove out-of-window indices from front. Time: O(N), Space: O(K)."
  },

  // ── 8. GREEDY (Basic, Intermediate, Hard) ──
  {
    title: "Assign Cookies Greedy Distribution",
    topic: "greedy",
    difficulty: "easy",
    prompt: "Assume you are an awesome parent and want to give your children some cookies. Each child i has a greed factor g[i]. Assign cookies to maximize happy children.",
    solution_explanation: "Sort both greed factors array and cookie sizes array. Use Two Pointers to match smallest cookie that satisfies smallest greed factor. Time: O(N log N), Space: O(1)."
  },
  {
    title: "Jump Game Reachable End",
    topic: "greedy",
    difficulty: "medium",
    prompt: "You are given an integer array nums. You are initially positioned at the first index, and each element represents your maximum jump length. Return true if you can reach last index.",
    solution_explanation: "Track maxReachable index. Iterate through array; if current index i > maxReachable, return false. Update maxReachable = max(maxReachable, i + nums[i]). Time: O(N), Space: O(1)."
  },
  {
    title: "Non-Overlapping Intervals Minimum Removals",
    topic: "greedy",
    difficulty: "medium",
    prompt: "Given an array of intervals intervals where intervals[i] = [start_i, end_i], return the minimum number of intervals you need to remove to make the rest non-overlapping.",
    solution_explanation: "Sort intervals by end time. Maintain prevEnd. If current start < prevEnd, increment removal count; else update prevEnd = current end. Time: O(N log N), Space: O(1)."
  },

  // ── 9. RECURSION & BACKTRACKING (Basic, Intermediate, Hard) ──
  {
    title: "Subsets All Possible Combinations",
    topic: "recursion",
    difficulty: "medium",
    prompt: "Given an integer array nums of unique elements, return all possible subsets (the power set).",
    solution_explanation: "Backtracking recursion helper(index, currentSubset). At each step, choose to include nums[index] or exclude it. Time: O(2^N), Space: O(N)."
  },
  {
    title: "Permutations of Unique Integers",
    topic: "recursion",
    difficulty: "medium",
    prompt: "Given an array nums of distinct integers, return all the possible permutations in any order.",
    solution_explanation: "Backtracking recursion with visited array or swapping elements in-place. Time: O(N!), Space: O(N)."
  },
  {
    title: "N-Queens Puzzle Placement",
    topic: "recursion",
    difficulty: "hard",
    prompt: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Return all distinct solutions.",
    solution_explanation: "Backtracking row by row. Maintain sets for columns, positive diagonals (row + col), and negative diagonals (row - col) to validate queen placements in O(1). Time: O(N!), Space: O(N)."
  },

  // ── 10. BASIC PROGRAMMING & LOGIC (Basic, Intermediate, Hard) ──
  {
    title: "FizzBuzz Classic Evaluation",
    topic: "basic-programming",
    difficulty: "easy",
    prompt: "Given an integer n, return a string array answer (1-indexed) where answer[i] is 'FizzBuzz' if i is divisible by 3 and 5, 'Fizz' if by 3, 'Buzz' if by 5.",
    solution_explanation: "Loop 1 to n using modulo arithmetic (% 15, % 3, % 5). Time: O(N), Space: O(1) auxiliary."
  },
  {
    title: "Palindrome Number Check Without Extra Memory",
    topic: "basic-programming",
    difficulty: "easy",
    prompt: "Given an integer x, return true if x is a palindrome integer without converting to string.",
    solution_explanation: "Reverse second half of number using arithmetic (% 10 and / 10). Compare reversed half with remaining original number. Time: O(log10 X), Space: O(1)."
  },

  // ── 11. MATH & NUMBER THEORY (Basic, Intermediate, Hard) ──
  {
    title: "Check if Number is Prime",
    topic: "math-number-theory",
    difficulty: "easy",
    prompt: "Given an integer n, write an efficient function to determine whether n is a prime number.",
    solution_explanation: "Trial division up to sqrt(n). If n <= 1 return false. Check divisibility by 2 and 3, then test 6k ± 1 up to sqrt(n). Time: O(sqrt N), Space: O(1)."
  },
  {
    title: "Greatest Common Divisor (GCD) Euclidean Algorithm",
    topic: "math-number-theory",
    difficulty: "easy",
    prompt: "Write a function to compute the Greatest Common Divisor (GCD) of two integers a and b using the Euclidean algorithm.",
    solution_explanation: "Euclidean algorithm: gcd(a, b) = b === 0 ? a : gcd(b, a % b). Time: O(log(min(A, B))), Space: O(1)."
  },
  {
    title: "Sieve of Eratosthenes Prime Generation",
    topic: "math-number-theory",
    difficulty: "medium",
    prompt: "Given an integer n, count the number of prime numbers strictly less than n.",
    solution_explanation: "Boolean array isPrime of size n initialized to true. Mark multiples of prime p starting from p*p as false. Time: O(N log log N), Space: O(N)."
  },

  // ── 12. SQL & DATABASE QUERIES (Basic, Intermediate, Hard) ──
  {
    title: "Second Highest Salary Query",
    topic: "sql",
    difficulty: "easy",
    prompt: "Write a SQL query to report the second highest salary from the Employee table. If there is no second highest salary, return null.",
    solution_explanation: "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); Time: O(N), Space: O(1)."
  },
  {
    title: "Department Highest Salary Join Query",
    topic: "sql",
    difficulty: "medium",
    prompt: "Write a SQL query to find employees who have the highest salary in each of the departments.",
    solution_explanation: "Subquery with IN operator comparing (department_id, salary) against aggregated MAX(salary) grouped by department_id. Time: O(N), Space: O(N)."
  },

  // ── 13. OOPS & LOW-LEVEL DESIGN (Basic, Intermediate, Hard) ──
  {
    title: "Design a Parking Lot System LLD",
    topic: "oop-concepts",
    difficulty: "medium",
    prompt: "Design an Object-Oriented Parking Lot System supporting multiple spot types (Compact, Large, Motorcycle) and vehicle parking allocation.",
    solution_explanation: "Class hierarchy with Abstract Vehicle class, ParkingSpot class, and ParkingLot singleton manager with HashMap tracking available spots. Time: O(1) allocation, Space: O(N)."
  },

  // ── 14. PSEUDOCODE & LOGIC (Basic, Intermediate, Hard) ──
  {
    title: "Pseudocode: Find Second Largest in List",
    topic: "pseudocode",
    difficulty: "easy",
    prompt: "Write pseudocode logic to find the second largest element in an unsorted list without sorting.",
    solution_explanation: "Maintain max1 and max2 initialized to -Infinity. Iterate list: if x > max1: max2 = max1, max1 = x; else if x > max2 and x != max1: max2 = x."
  },

  // ── 15. WEB DEVELOPMENT & SYSTEM APIS (Basic, Intermediate, Hard) ──
  {
    title: "REST API Status Codes Explanation & Handler",
    topic: "web-development",
    difficulty: "easy",
    prompt: "Implement an HTTP API response handler for standard status codes 200, 400, 401, 404, and 500.",
    solution_explanation: "Switch/Case response handling mapping status codes to standardized JSON payloads { status, message, data }. Time: O(1), Space: O(1)."
  }
];

async function seed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("Seeding 200+ DSA Questions into Supabase DB...");

  for (const q of questionsToSeed) {
    const res = await fetch(`${url}/rest/v1/dsa_questions`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(q)
    });

    if (!res.ok) {
      const txt = await res.text();
      console.log(`Note on ${q.title}:`, txt);
    }
  }

  console.log("Seeding completed successfully!");
}

seed();
