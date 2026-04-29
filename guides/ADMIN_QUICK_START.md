# Admin Quick Start Guide - AI-Powered Question Creation

## 🎯 5-Minute Quick Start

### Login as Admin
```
Email: admin@codemastery.com
Password: admin123456
```

### Create a New Question (Step-by-Step)

#### 1️⃣ Go to Admin Panel
- Visit: `http://localhost:3000/admin`
- Click the **"➕ Add New Question"** button

#### 2️⃣ Fill in Basic Info (Tab 1)
```
Title: Two Sum
Description: Given an array of integers and a target, 
find two numbers that add up to the target.
```

#### 3️⃣ Set Details (Tab 2)
```
Difficulty: Easy
Constraints:
  • 2 <= nums.length <= 10^4
  • -10^9 <= nums[i] <= 10^9
  • Unique solution exists
```

#### 4️⃣ Generate Test Cases with AI (Tab 4)
- Click **"Generate with AI"** button
- Wait 3-5 seconds
- AI generates:
  - ✅ 2-3 visible tests (users can see)
  - ✅ 5-10 hidden tests (evaluation only)

```
Example Generated Test:
Input:  [2, 7, 11, 15], target = 9
Output: [0, 1]
```

#### 5️⃣ Add Starter Code (Tab 5) - Optional
```python
def twoSum(nums, target):
    """
    Find two numbers that add up to target
    
    Args:
        nums: List of integers
        target: Target sum
    
    Returns:
        Indices of the two numbers
    """
    # Solution goes here
    pass
```

#### 6️⃣ Review & Submit
- Click **"Submit Question"**
- 🎉 Problem created with:
  - AI-generated test cases
  - AI-generated hints
  - All starter code
  - Problem metadata

---

## ⚡ API Endpoints (For Developers)

### Get Authentication Token
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@codemastery.com",
    "password": "admin123456"
  }'

# Response includes: {"token": "eyJhb..."}
```

### Generate Test Cases
```bash
curl -X POST http://localhost:4000/api/problems/generate-test-cases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Two Sum",
    "description": "Find two numbers that add up to target",
    "difficulty": "easy",
    "constraints": ["2 <= nums.length <= 100"]
  }'
```

**Response:**
```json
{
  "success": true,
  "test_cases": [
    {"input": "[2,7,11,15]", "output": "[0,1]"}
  ],
  "hidden_test_cases": [
    {"input": "[3,3]", "output": "[0,1]"}
  ]
}
```

### Generate Hints
```bash
curl -X POST http://localhost:4000/api/problems/generate-hints \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Two Sum",
    "description": "Find two numbers that add up to target",
    "difficulty": "easy"
  }'
```

**Response:**
```json
{
  "success": true,
  "hints": [
    "Start by understanding what the problem asks...",
    "Think about how to check all pairs efficiently...",
    "Consider using a hash map for fast lookups...",
    "Remember to handle edge cases..."
  ]
}
```

### Create Problem (After AI Generation)
```bash
curl -X POST http://localhost:4000/api/problems \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Two Sum",
    "slug": "two-sum-1234567890",
    "description": "Find two numbers that add up to target",
    "difficulty": "easy",
    "constraints": ["2 <= nums.length <= 10^4"],
    "test_cases": [
      {"input": "[2,7,11,15]", "output": "[0,1]"}
    ],
    "hidden_test_cases": [
      {"input": "[3,3]", "output": "[0,1]"}
    ],
    "hints": ["Use a hash map...", "..."],
    "starter_code": {
      "python": "def twoSum(nums, target):\n    pass",
      "javascript": "function twoSum(nums, target) { }"
    }
  }'
```

---

## 📋 Workflow Checklist

```
☐ Log in as admin
☐ Click "Add New Question"
☐ Fill in problem title and description
☐ Set difficulty level
☐ Add constraints
☐ Click "Generate with AI" for test cases
☐ Review generated test cases
☐ Add hints (use AI generation)
☐ Add starter code (multi-language)
☐ Review everything
☐ Click "Submit"
☐ ✅ Problem created!
```

---

## ⏱️ Estimated Time
- **Manual approach**: 30-45 minutes per problem
- **AI-assisted approach**: 5-10 minutes per problem
- **Savings**: ~80% time reduction

---

## 🤖 What AI Generates

### Test Cases
- Visible tests users can see before solving
- Hidden tests for evaluation
- Edge cases and boundary conditions
- Multiple input scenarios

### Hints
- 4-5 progressive hints
- Problem-solving guidance  
- Algorithm suggestions
- Implementation tips

### Solution Explanations
- Approach/algorithm explanation
- Time/space complexity
- Implementation notes
- Code walkthroughs

---

## ❓ FAQ

**Q: Can I edit generated content?**
\A: Yes! All generated content can be edited before submitting.

**Q: What if AI generation fails?**
A: The system has fallback test cases. You can also manually add test cases.

**Q: What languages are supported for starter code?**
A: Python, JavaScript, Java, C++

**Q: Can I generate just test cases without hints?**
A: Yes! Generate test cases, hints, or explanations independently.

**Q: How unique are the generated questions?**
A: Each generation is unique. AI uses the title, description, and difficulty to create context-specific content.

---

## 🚀 Pro Tips

1. **Better Descriptions** = Better AI Generation
   - Write detailed problem descriptions
   - Include examples and edge cases
   - Specify input/output format clearly

2. **Use Constraints** for Better Test Cases
   - Add size limits
   - Specify valid ranges
   - List assumptions

3. **Review Generated Content**
   - Test cases should be realistic
   - Hints should be progressive
   - Difficulty should match

4. **Reuse Starter Code**
   - Keep templates consistent
   - Include docstrings
   - Add usage examples

---

## 📞 Troubleshooting

**Problem: "API route not found"**
- Ensure server is running: `npm run dev`
- Check if Backend is on port 4000

**Problem: "Invalid token"**  
- Re-login and get fresh token
- Token expires after 24 hours

**Problem: "Slug already exists"**
- Change title to generate unique slug
- Or add timestamp to slug

**Problem: "AI generation timeout"**
- Check internet connection
- Verify GEMINI_API_KEY in .env
- Try again (sometimes API is slow)

---

## 📊 Metrics

| Metric | Value |
|--------|-------|
| Test Cases Generated | 2-3 visible + 5-10 hidden |
| Hints Generated | 4-5 hints |
| Explanation Length | ~600-800 characters |
| AI Generation Speed | 3-5 seconds |
| Browser Compatibility | All modern browsers |
| Authentication | JWT token based |

---

## ✨ Features

- ✅ AI-powered test case generation
- ✅ Gemini integration
- ✅ Multi-language starter code
- ✅ Real-time UI updates
- ✅ Error recovery
- ✅ Mobile-responsive interface
- ✅ Role-based access control
- ✅ Comprehensive logging

---

**Ready to create amazing questions? Start with Step 1: Login! 🚀**
