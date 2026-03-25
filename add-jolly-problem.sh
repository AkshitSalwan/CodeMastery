#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Adding 'Search Jolly' Problem via API ===${NC}\n"

# Step 1: Login to get JWT token
echo -e "${BLUE}Step 1: Authenticating with admin credentials...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@codemastery.com",
    "password": "admin123456"
  }')

echo "Login response: $LOGIN_RESPONSE"

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Failed to get authentication token${NC}"
  echo "Make sure admin user exists and backend is running on port 4000"
  exit 1
fi

echo -e "${GREEN}✅ Authentication successful${NC}"
echo -e "Token: ${TOKEN:0:20}...\n"

# Step 2: Create the problem
echo -e "${BLUE}Step 2: Creating 'Search Jolly' problem...${NC}"

PROBLEM_RESPONSE=$(curl -s -X POST http://localhost:4000/api/problems \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Search Jolly",
    "slug": "search-jolly",
    "description": "You need to find if \"jolly\" exists in the array of strings or not.\n\n**Rules:**\n- If \"jolly\" exists in the array, return **true**\n- If \"bunts\" exists in the array, return **\"biceps\"**\n- If neither exists, return **false**\n\n**Function Signature:**\n\`\`\`java\npublic static Object checkWords(String[] arr)\n\`\`\`\n\n**Input Format:**\n- A single line containing space-separated strings\n\n**Output Format:**\n- true (if \"jolly\" found)\n- \"biceps\" (if \"bunts\" found)\n- false (if neither found)",
    "difficulty": "Easy",
    "tags": ["Array", "String", "Search"],
    "constraints": [
      "1 <= arr.length <= 100",
      "Each string contains only lowercase letters",
      "String length <= 20"
    ],
    "examples": [
      {
        "input": "jolly happy sad",
        "output": "true",
        "explanation": "The word \"jolly\" is present in the array"
      },
      {
        "input": "bunts crazy wild",
        "output": "biceps",
        "explanation": "The word \"bunts\" is present, so return \"biceps\""
      },
      {
        "input": "happy sad mad",
        "output": "false",
        "explanation": "Neither \"jolly\" nor \"bunts\" are present"
      }
    ],
    "test_cases": [
      {
        "input": "jolly",
        "output": "true",
        "explanation": "Single word \"jolly\""
      },
      {
        "input": "hello jolly world",
        "output": "true",
        "explanation": "\"jolly\" exists in middle"
      },
      {
        "input": "bunts",
        "output": "biceps",
        "explanation": "Single word \"bunts\""
      },
      {
        "input": "nothing here",
        "output": "false",
        "explanation": "Neither word exists"
      }
    ],
    "hidden_test_cases": [
      {
        "input": "jolly jolly jolly",
        "output": "true"
      },
      {
        "input": "bunts bunts",
        "output": "biceps"
      },
      {
        "input": "joll bunt",
        "output": "false"
      },
      {
        "input": "happy sad mad angry jolly",
        "output": "true"
      },
      {
        "input": "crazy insane bunts wild",
        "output": "biceps"
      }
    ],
    "hints": [
      "Use a loop to iterate through the array of strings",
      "Compare each word with \"jolly\" and \"bunts\" using .equals()",
      "Keep track of whether you found each word separately",
      "Check for \"jolly\" first, then \"bunts\", then return false if neither found",
      "Remember that priority matters: jolly takes precedence over bunts"
    ],
    "starter_code": {
      "java": "public static Object checkWords(String[] arr) {\n    // Your code here\n    return false;\n}",
      "python": "def check_words(arr):\n    # Your code here\n    return False",
      "javascript": "function checkWords(arr) {\n    // Your code here\n    return false;\n}"
    },
    "time_limit": 1000,
    "memory_limit": 256,
    "points": 50
  }')

echo "Problem creation response:"
echo $PROBLEM_RESPONSE | jq '.' 2>/dev/null || echo $PROBLEM_RESPONSE

# Check if problem was created successfully
if echo $PROBLEM_RESPONSE | grep -q '"id"'; then
  echo -e "\n${GREEN}✅ Problem 'Search Jolly' created successfully!${NC}"
  PROBLEM_ID=$(echo $PROBLEM_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
  echo -e "Problem ID: ${BLUE}$PROBLEM_ID${NC}"
else
  echo -e "\n${RED}❌ Failed to create problem${NC}"
  exit 1
fi

echo -e "\n${GREEN}=== Done! ===${NC}"
echo -e "Check the problem at: ${BLUE}http://localhost:3000/problems${NC}"
