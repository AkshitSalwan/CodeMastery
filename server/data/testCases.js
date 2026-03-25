module.exports = {
  // Two Sum - Easy
  twoSum: [
    {
      input: "2 7 11 15\n9",
      expected: "[0,1]"
    },
    {
      input: "3 2 4\n6",
      expected: "[1,2]"
    },
    {
      input: "3 3\n6",
      expected: "[0,1]"
    },
    {
      input: "2 7 11 15 3\n5",
      expected: "[0,4]"
    },
    {
      input: "-1 0\n-1",
      expected: "[0,1]"
    }
  ],
  
  // Add Two Numbers - Medium
  addTwoNumbers: [
    {
      input: "2 4 3\n5 6 4",
      expected: "[7,0,8]"
    },
    {
      input: "0\n0",
      expected: "[0]"
    },
    {
      input: "9 9 9 9 9 9 9\n9 9 9 9",
      expected: "[8,9,9,9,0,0,0,1]"
    },
    {
      input: "9\n1 9 9 9 9 9 9 9 9 9",
      expected: "[0,0,0,0,0,0,0,0,0,0,1]"
    },
    {
      input: "5\n5",
      expected: "[0,1]"
    }
  ],
  
  // Longest Substring Without Repeating Characters - Medium
  longestSubstring: [
    {
      input: "abcabcbb",
      expected: "3"
    },
    {
      input: "bbbbb",
      expected: "1"
    },
    {
      input: "pwwkew",
      expected: "3"
    },
    {
      input: "",
      expected: "0"
    },
    {
      input: "au",
      expected: "2"
    },
    {
      input: "dvdf",
      expected: "3"
    },
    {
      input: "aab",
      expected: "2"
    }
  ],
  
  // Reverse Integer - Medium
  reverseInteger: [
    {
      input: "123",
      expected: "321"
    },
    {
      input: "-123",
      expected: "-321"
    },
    {
      input: "120",
      expected: "21"
    },
    {
      input: "0",
      expected: "0"
    },
    {
      input: "1534236469",
      expected: "0"
    },
    {
      input: "-2147483648",
      expected: "0"
    },
    {
      input: "1000000003",
      expected: "3000000001"
    }
  ],
  
  // Median of Two Sorted Arrays - Hard
  medianSortedArrays: [
    {
      input: "1 3\n2",
      expected: "2.0"
    },
    {
      input: "1 2\n3 4",
      expected: "2.5"
    },
    {
      input: "0 0\n0 0",
      expected: "0.0"
    },
    {
      input: "\n1",
      expected: "1.0"
    },
    {
      input: "2\n",
      expected: "2.0"
    },
    {
      input: "1 3 4 6\n2",
      expected: "3.0"
    }
  ],
  
  // Palindrome Number - Easy
  palindromeNumber: [
    {
      input: "121",
      expected: "true"
    },
    {
      input: "-121",
      expected: "false"
    },
    {
      input: "10",
      expected: "false"
    },
    {
      input: "0",
      expected: "true"
    },
    {
      input: "12321",
      expected: "true"
    },
    {
      input: "1221",
      expected: "true"
    },
    {
      input: "1001",
      expected: "true"
    }
  ]
};