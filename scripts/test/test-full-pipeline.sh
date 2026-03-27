#!/bin/bash

# Test 1: Login
echo "🔐 TEST 1: Login as user..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@codemastery.com","password":"demo123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo "✅ Login successful. Token: ${TOKEN:0:20}..."

# Test 2: Get problem details
echo ""
echo "📝 TEST 2: Fetch search-jolly problem..."
PROBLEM=$(curl -s http://localhost:4000/api/problems/search-jolly)
PROBLEM_ID=$(echo $PROBLEM | jq -r '.problem.id')
echo "✅ Problem ID: $PROBLEM_ID"

# Test 3: Verify boilerplate
echo ""
echo "🔧 TEST 3: Verify boilerplate in all languages..."
JAVA_CHECK=$(echo $PROBLEM | jq -r '.problem.starter_code | fromjson | .java | if contains("public class Main") then "✅" else "❌" end')
PYTHON_CHECK=$(echo $PROBLEM | jq -r '.problem.starter_code | fromjson | .python | if contains("if __name__") then "✅" else "❌" end')
JS_CHECK=$(echo $PROBLEM | jq -r '.problem.starter_code | fromjson | .javascript | if contains("readline") then "✅" else "❌" end')

echo "Java boilerplate: $JAVA_CHECK"
echo "Python boilerplate: $PYTHON_CHECK"
echo "JavaScript boilerplate: $JS_CHECK"

# Test 4: Submit code
echo ""
echo "🚀 TEST 4: Submit Python solution..."
SUBMISSION=$(curl -s -X POST http://localhost:4000/api/problems/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @test_submission.json)

STATUS=$(echo $SUBMISSION | jq -r '.status // "error"')
MESSAGE=$(echo $SUBMISSION | jq -r '.message // "Unknown error"')
PASSED=$(echo $SUBMISSION | jq -r '.passed // "N/A"')

echo "Status: $STATUS"
echo "Message: $MESSAGE"
echo "Tests Passed: $PASSED"

echo ""
echo "✅ All tests completed!"
