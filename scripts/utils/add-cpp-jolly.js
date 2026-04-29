import sequelize from './server/config/database.js';
import { Problem } from './server/models/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    const problem = await Problem.findByPk(11);
    if (!problem) {
      console.log('Problem not found');
      process.exit(1);
    }

    let starterCode = JSON.parse(problem.starter_code);
    
    starterCode.cpp = `#include <bits/stdc++.h>
using namespace std;

string checkWords(vector<string>& arr) {
    // Write your code here
    for (const string& word : arr) {
        if (word == "jolly") return "true";
        if (word == "bunts") return "biceps";
    }
    return "false";
}

int main() {
    string line;
    getline(cin, line);
    istringstream iss(line);
    vector<string> arr;
    string word;
    while (iss >> word) arr.push_back(word);
    
    cout << checkWords(arr) << endl;
    return 0;
}`;

    problem.starter_code = JSON.stringify(starterCode);
    await problem.save();

    console.log('✅ Added C++ boilerplate to Search Jolly');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
