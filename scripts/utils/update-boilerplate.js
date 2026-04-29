import sequelize from './server/config/database.js';
import { Problem } from './server/models/index.js';

const starterCodeUpdate = {
  java: `import java.util.*;

public class Main {
    public static Object checkWords(String[] arr) {
        // Write your code here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine().trim();
        String[] arr = input.split(" ");
        Object result = checkWords(arr);
        System.out.println(result);
    }
}`,
  python: `def check_words(arr):
    # Write your code here
    return False

if __name__ == "__main__":
    input_str = input().strip()
    arr = input_str.split()
    result = check_words(arr)
    print(result)`,
  javascript: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

function checkWords(arr) {
    // Write your code here
    return false;
}

let input = '';
rl.on('line', (line) => {
    input = line.trim();
    const arr = input.split(' ');
    const result = checkWords(arr);
    console.log(result);
    rl.close();
});`
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    const problem = await Problem.findByPk(11);
    if(!problem) {
      console.log('Problem not found');
      process.exit(1);
    }

    problem.starter_code = JSON.stringify(starterCodeUpdate);
    await problem.save();

    console.log('✅ Problem updated successfully with boilerplate');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
