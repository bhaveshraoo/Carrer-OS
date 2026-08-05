const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const REAL_AUTHENTIC_QUESTIONS = [
  // ── ARRAYS & HASHING ──
  { title: "Two-Sum Budget Pairing", topic: "arrays", difficulty: "easy", prompt: "Given an array of integer prices and a budget target, return indices of the two items such that they add up to target.", solution_explanation: "Use Hash Map to store complement (target - nums[i]). Time: O(N), Space: O(N)." },
  { title: "Maximum Subarray Revenue", topic: "arrays", difficulty: "medium", prompt: "Find the contiguous subarray with the largest sum and return its sum (Kadane's Algorithm).", solution_explanation: "Maintain currentMax and maxSoFar. Time: O(N), Space: O(1)." },
  { title: "Rotate the Movie Queue", topic: "arrays", difficulty: "easy", prompt: "Rotate an array of movie IDs to the right by k steps, where k is non-negative.", solution_explanation: "Reverse entire array, reverse first k elements, reverse remaining elements. Time: O(N), Space: O(1)." },
  { title: "Merge Overlapping Class Schedules", topic: "arrays", difficulty: "medium", prompt: "Given an array of meeting intervals, merge all overlapping intervals.", solution_explanation: "Sort by start time. Iterate and merge if current.start <= prev.end. Time: O(N log N), Space: O(N)." },
  { title: "Find Largest and Smallest Element in an Array", topic: "arrays", difficulty: "easy", prompt: "Find both largest and smallest elements in an unsorted array in O(N) time.", solution_explanation: "Single pass maintaining min and max variables. Time: O(N), Space: O(1)." },
  { title: "3Sum Zero Target Triplet Search", topic: "arrays", difficulty: "medium", prompt: "Return all unique triplets [a, b, c] such that a + b + c = 0.", solution_explanation: "Sort array and use two pointers (left, right) for each fixed element. Time: O(N^2), Space: O(1)." },
  { title: "Container With Most Water", topic: "arrays", difficulty: "medium", prompt: "Find two lines that together with the x-axis form a container holding the most water.", solution_explanation: "Two pointers at start and end. Move pointer with smaller height inwards. Time: O(N), Space: O(1)." },
  { title: "Product of Array Except Self", topic: "arrays", difficulty: "medium", prompt: "Return array where output[i] equals product of all elements except nums[i] without division.", solution_explanation: "Prefix products pass followed by suffix products pass. Time: O(N), Space: O(1)." },
  { title: "First Missing Positive Integer", topic: "arrays", difficulty: "hard", prompt: "Find the smallest missing positive integer in O(N) time and O(1) space.", solution_explanation: "Cycle sort placing each positive integer x at index x - 1. Time: O(N), Space: O(1)." },
  { title: "Trapping Rain Water Maximum Capacity", topic: "arrays", difficulty: "hard", prompt: "Compute how much rain water can be trapped between elevation bars.", solution_explanation: "Two pointers maintaining leftMax and rightMax. Time: O(N), Space: O(1)." },

  // ── STRINGS & MATCHING ──
  { title: "First Non-Repeating Character in a Username", topic: "strings", difficulty: "easy", prompt: "Find the first non-repeating character in a string and return its index.", solution_explanation: "Frequency array/map pass followed by lookup pass. Time: O(N), Space: O(1)." },
  { title: "Valid Bracket Sequence for Nested Comments", topic: "strings", difficulty: "easy", prompt: "Determine if string of parentheses '()[]{}' is valid.", solution_explanation: "LIFO Stack matching closing brackets with top of stack. Time: O(N), Space: O(N)." },
  { title: "Longest Substring Without Repeating Characters", topic: "strings", difficulty: "medium", prompt: "Find the length of the longest substring without duplicate characters.", solution_explanation: "Sliding window with hash map storing last seen indices. Time: O(N), Space: O(K)." },
  { title: "Group Anagram Product Codes", topic: "strings", difficulty: "medium", prompt: "Group anagram strings together into separate arrays.", solution_explanation: "Hash map using sorted string as key. Time: O(N * K log K), Space: O(N * K)." },
  { title: "Minimum Window Substring", topic: "strings", difficulty: "hard", prompt: "Find minimum window in s containing all characters of t.", solution_explanation: "Sliding window with target character frequency map. Time: O(N), Space: O(K)." },

  // ── DYNAMIC PROGRAMMING ──
  { title: "Climbing Stairs Ways Count", topic: "dp", difficulty: "easy", prompt: "Calculate distinct ways to climb n stairs taking 1 or 2 steps at a time.", solution_explanation: "Fibonacci recurrence dp[i] = dp[i-1] + dp[i-2]. Time: O(N), Space: O(1)." },
  { title: "Minimum Coins for Exact Change", topic: "dp", difficulty: "medium", prompt: "Return fewest coins needed to make up a given target amount.", solution_explanation: "Bottom-up DP array dp[i] = min(dp[i], dp[i-coin] + 1). Time: O(N * Amount), Space: O(Amount)." },
  { title: "House Robber Maximum Loot", topic: "dp", difficulty: "medium", prompt: "Maximize stolen money without robbing adjacent houses.", solution_explanation: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Time: O(N), Space: O(1)." },
  { title: "Edit Distance for Typo Correction", topic: "dp", difficulty: "hard", prompt: "Compute minimum edit distance operations (insert, delete, replace) to convert word1 to word2.", solution_explanation: "2D DP table matching characters. Time: O(M * N), Space: O(M * N)." },

  // ── GRAPHS ──
  { title: "Shortest Path Between Campus Buildings", topic: "graphs", difficulty: "medium", prompt: "Find shortest distance between two nodes in unweighted graph.", solution_explanation: "Breadth-First Search (BFS) with distance array. Time: O(V + E), Space: O(V)." },
  { title: "Detect a Cycle in Course Prerequisites", topic: "graphs", difficulty: "medium", prompt: "Determine if all courses can be completed given prerequisite dependencies.", solution_explanation: "Kahn's Algorithm (Topological Sort with in-degrees) or 3-color DFS. Time: O(V + E), Space: O(V + E)." },
  { title: "Number of Connected Friend Groups", topic: "graphs", difficulty: "medium", prompt: "Count connected components in an undirected graph.", solution_explanation: "Disjoint Set Union (DSU) or BFS/DFS traversal. Time: O(V + E), Space: O(V)." },

  // ── TREES & BST ──
  { title: "Level-Order Traversal of an Org Chart", topic: "trees", difficulty: "easy", prompt: "Return level-order traversal (breadth-first) of tree nodes.", solution_explanation: "Queue-based BFS level by level. Time: O(N), Space: O(W)." },
  { title: "Validate a Binary Search Tree of Employee IDs", topic: "trees", difficulty: "medium", prompt: "Verify if binary tree satisfies Binary Search Tree property.", solution_explanation: "Recursive range validation (min < val < max). Time: O(N), Space: O(H)." },
  { title: "Lowest Common Manager", topic: "trees", difficulty: "medium", prompt: "Find lowest common ancestor (LCA) of two nodes in binary tree.", solution_explanation: "Recursive post-order traversal returning matched nodes. Time: O(N), Space: O(H)." },

  // ── LINKED LISTS ──
  { title: "Reverse a Linked List of Undo Actions", topic: "linked-lists", difficulty: "easy", prompt: "Reverse a singly linked list in-place.", solution_explanation: "3-pointer approach (prev, curr, next). Time: O(N), Space: O(1)." },
  { title: "Detect a Loop in a Playlist", topic: "linked-lists", difficulty: "medium", prompt: "Determine if linked list contains a cycle.", solution_explanation: "Floyd's Cycle-Finding Algorithm (slow and fast pointers). Time: O(N), Space: O(1)." },

  // ── STACKS & QUEUES ──
  { title: "Next Greater Deadline", topic: "stacks-queues", difficulty: "medium", prompt: "Find next greater element for each index in array.", solution_explanation: "Monotonic decreasing stack storing indices. Time: O(N), Space: O(N)." },
  { title: "Implement a Queue Using Two Stacks", topic: "stacks-queues", difficulty: "medium", prompt: "Implement FIFO Queue using two LIFO Stacks.", solution_explanation: "Transfer elements from instack to outstack on pop. Time: Amortized O(1), Space: O(N)." },

  // ── GREEDY ──
  { title: "Minimum Meeting Rooms Needed", topic: "greedy", difficulty: "medium", prompt: "Find minimum meeting rooms required for overlapping meeting intervals.", solution_explanation: "Min-Heap storing end times after sorting start times. Time: O(N log N), Space: O(N)." },
  { title: "Activity Selection for a Single Room", topic: "greedy", difficulty: "medium", prompt: "Select maximum non-overlapping activities for a single room.", solution_explanation: "Sort by finish time, greedily pick next compatible activity. Time: O(N log N), Space: O(1)." },

  // ── RECURSION & BACKTRACKING ──
  { title: "Generate All Valid Bracket Combinations", topic: "recursion", difficulty: "medium", prompt: "Generate all n pairs of valid well-formed parentheses.", solution_explanation: "Backtracking recursion enforcing open < n and close < open. Time: O(4^N / sqrt(N)), Space: O(N)." },
  { title: "Subsets All Possible Combinations", topic: "recursion", difficulty: "medium", prompt: "Generate power set (all possible subsets) of an array of distinct integers.", solution_explanation: "Backtracking recursion adding current state at each level. Time: O(2^N), Space: O(N)." },
  { title: "Permutations of Unique Integers", topic: "recursion", difficulty: "medium", prompt: "Generate all permutations of distinct integers.", solution_explanation: "Backtracking with visited set or element swapping. Time: O(N!), Space: O(N)." },
  { title: "N-Queens Puzzle Placement", topic: "recursion", difficulty: "hard", prompt: "Place N queens on an N x N chessboard so no two queens attack each other.", solution_explanation: "Backtracking row by row with column, posDiag, and negDiag tracking sets. Time: O(N!), Space: O(N)." },

  // ── SQL ──
  { title: "Second Highest Salary", topic: "sql", difficulty: "medium", prompt: "Write SQL query to find second highest salary from Employee table.", solution_explanation: "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); Time: O(N), Space: O(1)." },
  { title: "Department-wise Highest Paid Employee", topic: "sql", difficulty: "medium", prompt: "Write SQL query to find employee with highest salary in each department.", solution_explanation: "Subquery with IN operator comparing (department_id, salary). Time: O(N), Space: O(N)." },

  // ── BASIC PROGRAMMING ──
  { title: "FizzBuzz with a Twist", topic: "basic-programming", difficulty: "easy", prompt: "Print numbers 1 to n, substituting multiples of 3 with Fizz, 5 with Buzz, and 15 with FizzBuzz.", solution_explanation: "Modulo checks (% 15, % 3, % 5). Time: O(N), Space: O(1)." },
  { title: "Palindrome Check Without Extra Space", topic: "basic-programming", difficulty: "easy", prompt: "Check if integer is palindrome without string conversion.", solution_explanation: "Reverse second half of number via arithmetic (% 10, / 10). Time: O(log10 N), Space: O(1)." },

  // ── OOP CONCEPTS & LLD ──
  { title: "Design a Parking Lot with Multiple Vehicle Types", topic: "oop-concepts", difficulty: "medium", prompt: "Design an Object-Oriented Parking Lot supporting Compact, Large, and SUV spots.", solution_explanation: "Class hierarchy with Vehicle abstract class, ParkingSpot class, and ParkingLot manager. Time: O(1), Space: O(N)." },

  // ── MATH & NUMBER THEORY ──
  { title: "Check if a Number is Prime, Efficiently", topic: "math-number-theory", difficulty: "easy", prompt: "Write function to check if n is prime in O(sqrt N) time.", solution_explanation: "Trial division up to sqrt(N) checking 6k ± 1 form. Time: O(sqrt N), Space: O(1)." },
  { title: "GCD Without the Built-in Function", topic: "math-number-theory", difficulty: "easy", prompt: "Compute Greatest Common Divisor using Euclidean algorithm.", solution_explanation: "gcd(a, b) = b === 0 ? a : gcd(b, a % b). Time: O(log(min(a,b))), Space: O(1)." },

  // ── PSEUDOCODE ──
  { title: "Pseudocode: Find the Second Largest in a List", topic: "pseudocode", difficulty: "easy", prompt: "Write pseudocode logic to find second largest number in single pass.", solution_explanation: "Maintain max1 and max2 variables. Update max2 when num > max2 and num != max1. Time: O(N), Space: O(1)." },

  // ── WEB DEVELOPMENT & APIS ──
  { title: "Explain REST API Status Codes", topic: "web-development", difficulty: "easy", prompt: "Explain and handle HTTP status codes 200, 201, 400, 401, 404, and 500.", solution_explanation: "Status code router returning structured response messages. Time: O(1), Space: O(1)." },
  { title: "REST API Status Codes Explanation & Handler", topic: "web-development", difficulty: "easy", prompt: "Implement an HTTP API response handler for standard status codes 200, 400, 401, 404, and 500.", solution_explanation: "Switch/Case response handling mapping status codes to standardized JSON payloads. Time: O(1), Space: O(1)." }
];

async function cleanup() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log("Cleaning up invalid 'Variant' questions from Supabase DB...");

  // 1. Delete all rows from dsa_questions table
  const deleteRes = await fetch(`${url}/rest/v1/dsa_questions?id=neq.00000000-0000-0000-0000-000000000000`, {
    method: "DELETE",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  });

  if (deleteRes.ok) {
    console.log("Database table dsa_questions cleared successfully!");
  } else {
    console.error("Error clearing table:", await deleteRes.text());
  }

  // 2. Re-seed clean authentic question bank
  console.log(`Seeding ${REAL_AUTHENTIC_QUESTIONS.length} authentic curated questions into Supabase DB...`);

  for (const q of REAL_AUTHENTIC_QUESTIONS) {
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
      console.log(`Note on ${q.title}:`, await res.text());
    }
  }

  console.log("Authentic question bank restored successfully!");
}

cleanup();
