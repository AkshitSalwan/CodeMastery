#!/bin/bash

# Get token
TOKEN=$(curl -s http://localhost:4000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"user@codemastery.com","password":"demo123456"}' | jq -r '.token'' 2>/dev/null)

echo "Token: $TOKEN"

# Test submit
echo "Testing /api/problems/submit endpoint..."
curl -X POST http://localhost:4000/api/problems/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"problemId":11,"code":"print(1)","language":"python"}' 2>/dev/null > /tmp/submit_response.txt

cat /tmp/submit_response.txt
