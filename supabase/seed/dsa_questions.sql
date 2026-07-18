-- Phase 1 DSA question bank: original questions only (not reproduced from any
-- platform's proprietary bank — topic-level patterns are public knowledge, exact
-- question text is not, and everything below was written fresh for this project).
-- Run AFTER supabase/seed/companies.sql.

insert into public.dsa_questions (title, topic, difficulty, prompt, solution_explanation) values

-- ============ ARRAYS ============
('Missing Roll Number', 'arrays', 'easy',
 'A class has roll numbers 1 to n, but one student was absent on photo day, so their roll number is missing from the array of n-1 photographed students. Given the array and n, find the missing roll number.',
 'Sum 1 to n using n*(n+1)/2, subtract the actual sum of the array — the difference is the missing number. O(n) time, O(1) space. A hash-set approach also works but uses O(n) extra space unnecessarily.'),

('Rotate the Movie Queue', 'arrays', 'easy',
 'A streaming app''s "continue watching" row rotates right by k positions every time you open the app (most recent moves toward the front, wrapping around). Given the array and k, produce the rotated row.',
 'Reverse the whole array, then reverse the first k elements, then reverse the remaining n-k elements — three reversals produce the rotation in O(n) time, O(1) extra space, without a second array.'),

('Two-Sum for Budget Pairing', 'arrays', 'easy',
 'Given a list of item prices and a fixed budget, find whether any two distinct items sum exactly to the budget, and return their indices.',
 'Use a hash map of value -> index while iterating once; for each price, check if (budget - price) already exists in the map. O(n) time, O(n) space — avoids the O(n^2) brute-force pair check.'),

('Maximum Subarray Revenue', 'arrays', 'medium',
 'Given daily profit/loss for a store over n days (negative values allowed), find the contiguous run of days with the maximum total profit.',
 'Kadane''s algorithm: track running sum, reset to 0 whenever it goes negative, keep a running maximum. O(n) time, O(1) space.'),

('Merge Overlapping Class Schedules', 'arrays', 'medium',
 'Given a list of (start, end) time intervals representing booked meeting rooms, merge all overlapping intervals into the minimal set of non-overlapping intervals.',
 'Sort intervals by start time, then sweep once: if the current interval overlaps the last merged one, extend it; otherwise start a new merged interval. O(n log n) for the sort dominates.'),

-- ============ STRINGS ============
('Valid Bracket Sequence for Nested Comments', 'strings', 'easy',
 'A code editor needs to validate that nested comment markers ((), {}, []) are balanced and correctly nested in a given string. Return whether the string is valid.',
 'Push opening brackets onto a stack; on a closing bracket, check it matches the top of the stack (pop if so, otherwise invalid). String is valid if the stack is empty at the end. O(n) time, O(n) space.'),

('First Non-Repeating Character in a Username', 'strings', 'easy',
 'A username generator needs the first character in a candidate string that appears exactly once, to use as a suffix. Return that character, or indicate none exists.',
 'Count character frequencies in one pass (hash map), then scan the string again to find the first character with count 1. O(n) time, O(1) space (bounded alphabet).'),

('Longest Substring Without Repeating Characters', 'strings', 'medium',
 'Given a string of session tokens, find the length of the longest substring where no character repeats.',
 'Sliding window with a hash set: expand the right pointer, and when a duplicate is found, shrink from the left until the duplicate is removed. O(n) time, O(min(n, alphabet size)) space.'),

('Group Anagram Product Codes', 'strings', 'medium',
 'Given a list of product codes (strings), group codes that are anagrams of each other into the same group.',
 'For each string, compute a canonical key (sorted characters, or a 26-length character-count tuple), and group by that key in a hash map. O(n * k log k) with sorting, or O(n * k) with counting, where k is average string length.'),

-- ============ DYNAMIC PROGRAMMING ============
('Minimum Coins for Exact Change', 'dp', 'medium',
 'Given coin denominations and a target amount, find the minimum number of coins needed to make that exact amount, or determine it''s impossible.',
 'Bottom-up DP: dp[i] = minimum coins for amount i. For each amount from 1 to target, try every coin denomination <= amount and take the minimum. O(amount * coins) time, O(amount) space.'),

('Longest Common Subsequence of Two Resumes', 'dp', 'medium',
 'Given two strings representing keyword sequences from two resumes, find the length of their longest common subsequence (not necessarily contiguous).',
 'Classic 2D DP: dp[i][j] = LCS length of the first i characters of string A and first j of string B. If characters match, dp[i][j] = dp[i-1][j-1] + 1; otherwise take the max of dropping one character from either string. O(n*m) time and space.'),

('House Robber on a Street of Shops', 'dp', 'medium',
 'A thief wants to rob shops along a street, where each shop has a cash value, but robbing two adjacent shops triggers an alarm. Maximize total cash without robbing adjacent shops.',
 'dp[i] = max(dp[i-1], dp[i-2] + value[i]) — at each shop, either skip it (carry forward the best so far) or rob it (best up to two shops back, plus this shop''s value). O(n) time, O(1) space with rolling variables.'),

('Edit Distance for Typo Correction', 'dp', 'hard',
 'Given a typed word and the intended word, find the minimum number of single-character insertions, deletions, or substitutions needed to transform one into the other.',
 '2D DP where dp[i][j] = edit distance between the first i characters of word A and first j of word B. If characters match, dp[i][j] = dp[i-1][j-1]; otherwise 1 + min(insert, delete, substitute) from the three neighboring subproblems. O(n*m) time and space.'),

-- ============ GRAPHS ============
('Shortest Path Between Campus Buildings', 'graphs', 'medium',
 'Given a campus map as an unweighted graph of buildings and walkways connecting them, find the minimum number of walkways to get from one building to another.',
 'Breadth-first search (BFS) from the source — since edges are unweighted, the first time BFS reaches the destination, it has found the shortest path. O(V + E) time.'),

('Detect a Cycle in Course Prerequisites', 'graphs', 'medium',
 'Given a list of course prerequisite pairs (A must be taken before B), determine whether it''s possible to complete all courses, i.e., whether the prerequisite graph has a cycle.',
 'Model as a directed graph and run DFS with three states per node (unvisited, in-progress, done). If DFS reaches a node that''s currently "in-progress" on the current path, there''s a cycle. Equivalent to checking whether a valid topological sort exists.'),

('Number of Connected Friend Groups', 'graphs', 'medium',
 'Given a list of "is-friends-with" pairs among n people, find the number of distinct friend groups (connected components).',
 'Union-Find (disjoint set): union each pair, then count the number of distinct root parents at the end. Alternative: BFS/DFS from each unvisited node, counting how many times a fresh traversal starts. O(n) with Union-Find using path compression.'),

-- ============ TREES ============
('Level-Order Traversal of an Org Chart', 'trees', 'easy',
 'Given a company org chart as a binary tree (each manager has at most two direct reports shown), print employees level by level, top to bottom.',
 'Breadth-first search using a queue: process one level at a time by tracking the queue size at the start of each level. O(n) time, O(n) space for the queue.'),

('Validate a Binary Search Tree of Employee IDs', 'trees', 'medium',
 'Given a binary tree where each node holds an employee ID, verify whether it''s a valid binary search tree (left subtree values < node < right subtree values, recursively).',
 'Recursively pass down a valid (min, max) range for each node instead of only comparing to immediate children — a common bug is checking only parent-child pairs, which misses violations from grandparents. O(n) time.'),

('Lowest Common Manager', 'trees', 'medium',
 'Given a binary tree representing an org chart and two employee nodes, find their lowest common ancestor (the most specific shared manager).',
 'Recursively search both subtrees: if the current node is one of the two targets, return it; if both left and right recursive calls return non-null, the current node is the LCA; otherwise propagate whichever side returned non-null. O(n) time.'),

-- ============ LINKED LISTS ============
('Detect a Loop in a Playlist', 'linked-lists', 'medium',
 'A music app''s "autoplay" queue is a linked list, but a bug may have caused it to loop back on itself. Determine whether the linked list has a cycle.',
 'Floyd''s cycle detection (slow/fast pointers): move one pointer one step and another two steps at a time; if they ever meet, there''s a cycle. O(n) time, O(1) space — no need for a hash set of visited nodes.'),

('Reverse a Linked List of Undo Actions', 'linked-lists', 'easy',
 'An app''s undo history is stored as a singly linked list in chronological order. Reverse it in place so the most recent action is first.',
 'Iterate with three pointers (previous, current, next), reversing the `next` pointer of each node as you go, and returning the old tail as the new head. O(n) time, O(1) space.'),

-- ============ STACKS & QUEUES ============
('Next Greater Deadline', 'stacks-queues', 'medium',
 'Given a list of task priorities in order, for each task find the next task with a strictly higher priority later in the list, or indicate none exists.',
 'Monotonic decreasing stack: iterate right to left (or left to right with index-popping), popping elements from the stack that are smaller than the current one and recording the current as their "next greater." Each element is pushed/popped at most once, giving O(n) time overall despite the nested-looking loop.'),

('Implement a Queue Using Two Stacks', 'stacks-queues', 'medium',
 'Implement a FIFO queue (enqueue, dequeue) using only two stack data structures.',
 'Use an "in" stack for enqueues and an "out" stack for dequeues; when the "out" stack is empty and a dequeue is requested, pour everything from "in" to "out" (reversing order), then pop from "out." Amortized O(1) per operation.'),

-- ============ GREEDY / RECURSION ============
('Minimum Meeting Rooms Needed', 'greedy', 'medium',
 'Given a list of meeting (start, end) times, find the minimum number of rooms required so no two meetings needing the same room overlap.',
 'Separate start times and end times into two sorted arrays; sweep through them with two pointers, incrementing a room counter on a start and decrementing on an end whenever it happens no later than the next start. Track the maximum concurrent count. O(n log n) for sorting.'),

('Activity Selection for a Single Room', 'greedy', 'medium',
 'Given a list of activities each with a start and end time, and only one room available, select the maximum number of non-overlapping activities that can be scheduled.',
 'Sort activities by end time, then greedily pick each activity whose start time is >= the end time of the last picked activity. Picking by earliest end time (not shortest duration or earliest start) is the key insight that makes the greedy choice provably optimal.'),

('Generate All Valid Bracket Combinations', 'recursion', 'medium',
 'Given n pairs of brackets, generate all combinations of well-formed (balanced and correctly nested) bracket sequences.',
 'Backtracking: at each recursive step, add an opening bracket if you haven''t used all n yet, and add a closing bracket only if the count of closing brackets used so far is less than opening brackets used. Base case: string length reaches 2n.'),

-- ============ SQL (relevant given several companies emphasize it) ============
('Second Highest Salary', 'sql', 'medium',
 'Given an Employee table with columns (id, name, salary), write a query to find the second-highest distinct salary. Return NULL if no second-highest exists.',
 'SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee) — using a subquery to exclude the top salary, then taking the max of what remains, naturally returns NULL if there''s only one distinct salary value.'),

('Department-wise Highest Paid Employee', 'sql', 'medium',
 'Given Employee (id, name, salary, department_id) and Department (id, name) tables, find the highest-paid employee in each department.',
 'Use a window function: SELECT *, RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk in a subquery, then filter WHERE rnk = 1 in the outer query. Avoids the classic (and buggy) approach of a correlated subquery with MAX per row, which breaks on salary ties.'),

('Consecutive Login Streaks', 'sql', 'hard',
 'Given a Logins table (user_id, login_date), find users who logged in on at least 3 consecutive days.',
 'Use ROW_NUMBER() partitioned by user_id ordered by login_date, then subtract that row number (in days) from login_date — dates in the same consecutive streak produce the same resulting "group key." Group by user_id and that key, filter groups with COUNT(*) >= 3.'),

-- ============ BASIC PROGRAMMING (for companies with lighter technical bars) ============
('FizzBuzz with a Twist', 'basic-programming', 'easy',
 'Print numbers 1 to n, but replace multiples of 3 with "Fizz", multiples of 5 with "Buzz", multiples of both with "FizzBuzz", and multiples of 7 with "Bang" (checked after the FizzBuzz cases).',
 'Straightforward conditional chain checking divisibility by 15 first (both 3 and 5), then 3, then 5, then 7, then falling back to the number itself. Tests whether a candidate handles condition ordering correctly, not algorithmic complexity.'),

('Palindrome Check Without Extra Space', 'basic-programming', 'easy',
 'Given a string, determine whether it reads the same forwards and backwards, without creating a reversed copy of the string.',
 'Two pointers starting from both ends, moving toward the center, comparing characters at each step and stopping early on a mismatch. O(n) time, O(1) extra space — the "without extra space" constraint is testing whether the candidate reaches for two pointers instead of string reversal.'),

('Count Set Bits', 'basic-programming', 'easy',
 'Given an integer, count the number of 1 bits in its binary representation.',
 'Brian Kernighan''s trick: repeatedly do n = n & (n-1), which clears the lowest set bit each time; count iterations until n becomes 0. O(number of set bits) rather than O(number of total bits) from a naive shift-and-check loop.'),

('Check for Balanced Parentheses with Multiple Types', 'basic-programming', 'medium',
 'Given a string containing (), {}, and [] in any combination, determine if the brackets are balanced and correctly nested.',
 'Same stack-based approach as bracket validation elsewhere in this bank — included here at a slightly gentler framing since some companies test this as a "basic programming" question rather than a dedicated DSA round.'),

-- ============ OOP CONCEPTS (conceptual, not algorithmic — several IT-services firms test this directly) ============
('Design a Parking Lot with Multiple Vehicle Types', 'oop-concepts', 'medium',
 'Design the class structure (not full implementation) for a parking lot system supporting cars, bikes, and trucks, each needing different spot sizes. Identify the key classes, their relationships, and which OOP principles apply.',
 'A base Vehicle class (or interface) with subclasses Car/Bike/Truck demonstrates inheritance; a ParkingSpot class that accepts different vehicle types via polymorphism (checking spot.canFit(vehicle)) avoids type-checking chains. Tests whether a candidate can identify inheritance vs. composition tradeoffs, not just define the four OOP pillars from memory.'),

('Overloading vs Overriding, With a Catch', 'oop-concepts', 'easy',
 'Explain the difference between method overloading and method overriding, and give an example of code that looks like overriding but is actually overloading due to a parameter type mismatch.',
 'Overloading is compile-time (same method name, different parameter lists, resolved by the compiler); overriding is runtime (subclass redefines a parent method with the identical signature, resolved via dynamic dispatch). The "catch" example: a subclass method with a slightly different parameter type (e.g., parent takes `Object`, child takes `String`) creates a new overload, not an override — a common source of subtle bugs.'),

-- ============ MATH & NUMBER THEORY ============
('Check if a Number is Prime, Efficiently', 'math-number-theory', 'easy',
 'Given an integer n, determine whether it is prime, without checking every number up to n.',
 'Only check divisors up to sqrt(n) — if n has a factor larger than its square root, it must also have a corresponding factor smaller than the square root, so checking beyond sqrt(n) is redundant. Reduces from O(n) to O(sqrt(n)).'),

('GCD Without the Built-in Function', 'math-number-theory', 'easy',
 'Implement a function to find the greatest common divisor of two integers without using a language built-in GCD function.',
 'Euclidean algorithm: gcd(a, b) = gcd(b, a % b), recursing until b is 0, at which point a is the GCD. O(log(min(a,b))) time — far faster than checking every number up to the smaller value.'),

('Sieve of Eratosthenes for a Range of Primes', 'math-number-theory', 'medium',
 'Given an upper bound n, find all prime numbers from 2 to n.',
 'Mark multiples of each prime starting from 2 as composite in a boolean array, skipping already-marked numbers — each composite number gets marked exactly once by its smallest prime factor, giving O(n log log n) time overall, far better than checking primality individually for every number up to n.'),

-- ============ PSEUDOCODE (Accenture-style logic-writing rounds) ============
('Pseudocode: Find the Second Largest in a List', 'pseudocode', 'easy',
 'Write pseudocode (not working code in any specific language) to find the second-largest number in a list of integers, handling the case where all numbers are equal.',
 'Track two variables (largest, secondLargest) initialized to negative infinity; for each number, if it''s greater than largest, shift largest into secondLargest and update largest; else if it''s greater than secondLargest AND not equal to largest, update secondLargest. The "not equal to largest" check is what correctly handles duplicate-value edge cases — pseudocode rounds specifically look for whether you handle this without being prompted.'),

('Pseudocode: Validate a Simple Password Policy', 'pseudocode', 'easy',
 'Write pseudocode to check whether a password meets a policy: at least 8 characters, at least one digit, at least one uppercase letter.',
 'A single pass through the string with three boolean flags (has_digit, has_upper, length_ok), checked and combined at the end — pseudocode rounds reward clear step-by-step logic over clever one-liners, since the goal is testing whether you can decompose a requirement into checkable conditions.'),

-- ============ WEB DEVELOPMENT BASICS (relevant for tracks like Cognizant GenC Next) ============
('Explain REST API Status Codes', 'web-development', 'easy',
 'Explain what each of these HTTP status codes means and when a well-designed API should return it: 200, 201, 400, 401, 404, 500.',
 '200 (OK, successful GET), 201 (Created, successful POST that creates a resource), 400 (Bad Request, client sent invalid data), 401 (Unauthorized, missing/invalid auth), 404 (Not Found, resource doesn''t exist), 500 (Internal Server Error, something broke on the server, not the client''s fault). Tests whether a candidate distinguishes client-side (4xx) from server-side (5xx) errors, a common point of confusion.'),

('Difference Between GET and POST, With a Trick Question', 'web-development', 'easy',
 'Explain the difference between GET and POST HTTP methods, then answer: is it safe to put a password in a GET request''s query parameters?',
 'GET requests are meant to retrieve data and are typically cached/logged/visible in browser history and server logs; POST sends data in the request body, not the URL. Putting a password in a GET query parameter is unsafe specifically because it ends up in browser history, server logs, and potentially referrer headers — visible in plain text in places you don''t control.')

on conflict (title) do nothing;
