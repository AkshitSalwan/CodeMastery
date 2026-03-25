import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import judgeService from './services/judgeService.js';
import compareOutput from './utils/compareOutput.js';
import {
  buildExecutionCode,
  buildStdinFromTestCaseInput,
  hasUserDefinedEntrypoint,
} from './utils/problemExecution.js';
import learnersPlatformRouter from '../learners-platform/backend/index.js';
import authRouter from './routes/auth.js';
import problemsRouter from './routes/problems.js';
import userdataRouter from './routes/userdata.js';
import { testConnection, syncDatabase } from './config/database.js';
import { createAdminUser } from './seeders/createAdminUser.js';

function buildJavaDriver(code) {
  // Remove any existing Main class if present (handles both single and multi-line)
  let cleanCode = code.replace(/public\s+class\s+Main\s*\{[\s\S]*?\}\s*$/gm, '').trim();
  
  // Extract method signature with flexible regex
  const methodRegex = /public\s+(?:static\s+)?([A-Za-z_<>[\].,\s\w$]+?)\s+([A-Za-z_$][\w$]*)\s*\(/;
  const match = methodRegex.exec(cleanCode);
  
  if (!match) {
    throw new Error('No public method found in Solution class');
  }

  const returnType = match[1].trim();
  const methodName = match[2];

  return `import java.util.*;

${cleanCode}

public class Main {
  public static void main(String[] args) {
    Solution s = new Solution();
    try {
      String testInput = "()[]";
      ${returnType === 'boolean' ? `boolean result = s.${methodName}(testInput);` : `Object result = s.${methodName}(testInput);`}
      System.out.println(result);
    } catch (Exception e) {
      System.out.println("Error: " + e.getMessage());
    }
  }
}`;
}

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  
  // CORS configuration - allow frontend to access backend
  app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);

  app.use('/api/problems', problemsRouter);

  // Mount learners-platform before generic /api route (more specific routes first)
  app.use('/api/learners-platform', learnersPlatformRouter);

  app.use('/api', userdataRouter);

  app.post('/api/run', async (req, res) => {
    const { language, code, testCases, stdin, testCaseInput } = req.body || {};

    if (!code || !language) {
      return res.status(400).json({ error: 'Missing code or language' });
    }

    const hasEntrypoint = hasUserDefinedEntrypoint(language, code);
    const derivedStdin = testCaseInput && hasEntrypoint
      ? buildStdinFromTestCaseInput(testCaseInput)
      : (stdin || '');
    const backendWrappedCode = testCaseInput && !hasEntrypoint
      ? buildExecutionCode({
          language,
          code,
          testCaseInput,
        })
      : code;
    const hasJavaMainClass = language === 'java' && /\bclass\s+Main\b/.test(backendWrappedCode);
    const processedCode =
      language === 'java' && testCaseInput == null && !hasJavaMainClass
        ? buildJavaDriver(code)
        : backendWrappedCode;

    try {
      if (!testCases || testCases.length === 0) {
        const data = await judgeService.runJudge(language, processedCode, derivedStdin);
        return res.json(data);
      }

      const results = [];
      let passedTests = 0;

      for (const testCase of testCases) {
        try {
          const testCaseHasEntrypoint = hasUserDefinedEntrypoint(language, code);
          const testCaseCode = testCaseHasEntrypoint
            ? code
            : buildExecutionCode({
                language,
                code,
                testCaseInput: testCase.input,
              });
          
          // Validate that Java code has proper structure
          if (language === 'java' && !testCaseCode.includes('class Main')) {
            return res.status(400).json({ 
              error: 'Failed to generate Main class for Java code. Ensure your Solution class has a valid public method signature.' 
            });
          }
          
          const testCaseStdin = testCaseHasEntrypoint
            ? buildStdinFromTestCaseInput(testCase.input)
            : '';
          const data = await judgeService.runJudge(language, testCaseCode, testCaseStdin);
          const actual = (data.compile_output || data.stderr || data.stdout || '').trim();
          const expected = String(testCase.expected || '').trim();
          const passed = compareOutput(actual, expected);

          if (passed) {
            passedTests++;
          }

          results.push({
            input: testCase.input,
            expected,
            actual,
            passed,
            runtime: data.time || null,
            memory: data.memory || null,
            error: data.stderr || data.compile_output || null,
          });
        } catch (testError) {
          console.error('Error executing test case:', testError);
          results.push({
            input: testCase.input,
            expected: testCase.expected,
            actual: null,
            passed: false,
            error: testError.message,
          });
        }
      }

      return res.json({
        status: passedTests === testCases.length ? 'Accepted' : 'Wrong Answer',
        totalTests: testCases.length,
        passedTests,
        testResults: results,
      });
    } catch (error) {
      console.error('Judge0 error:', error);

      return res.status(500).json({
        error: 'Failed to execute code',
        details: error.message || 'Unknown Judge0 error',
      });
    }
  });

  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../dist');

    app.use(express.static(distPath));

    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

function startServer(port = Number(process.env.PORT) || 4000) {
  const app = createApp();

  // Initialize database before starting server
  (async () => {
    try {
      // Test database connection
      await testConnection();
      
      // Sync database schema
      await syncDatabase();
      
      // Create admin user if it doesn't exist
      await createAdminUser();
      
      // Start listening
      app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  })();
}

export { createApp, startServer };

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
