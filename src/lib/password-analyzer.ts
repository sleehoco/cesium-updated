export interface PasswordAnalysis {
  score: number; // 0-100
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  crackTimes: {
    bruteForce: string;
    dictionary: string;
  };
  characterAnalysis: {
    length: number;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSymbols: boolean;
  };
  patterns: string[]; // detected pattern warnings
  suggestions: string[]; // improvement suggestions
}

const COMMON_PASSWORDS: string[] = [
  'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
  'dragon', '111111', 'baseball', 'iloveyou', 'trustno1', 'sunshine',
  'ashley', 'football', 'shadow', '123123', '654321', 'superman',
  'qazwsx', 'michael', 'login', 'starwars', 'letmein', 'admin',
  'welcome', 'hello', 'charlie', 'donald', 'password1', 'qwerty123',
  'access', 'master', 'flower', 'passw0rd', 'mustang', 'thunder',
  'bailey', 'hockey', 'ranger', 'harley', 'hunter', 'soccer',
  'jordan', 'buster', 'killer', 'batman', 'ginger', 'cookie',
  'princess', 'robert', 'george', 'andrew', 'joshua', 'daniel',
  'pepper', 'summer', 'winter', 'spring', 'autumn', 'matrix',
  'whatever', 'cheese', 'banana', 'guitar', 'silver', 'panther',
  'yankee', 'compaq', 'merlin', 'internet', 'google', 'samsung',
  'computer', 'corvette', 'mercedes', 'ferrari', 'porsche', 'maverick',
  'phoenix', 'diamond', 'bigdog', 'testing', 'peanut', 'pepper',
  'orange', 'purple', 'falcon', 'eagle', 'sparky', 'cowboy',
  'camaro', 'matrix', 'champion', 'jackson', 'nothing', 'midnight',
  '1234', '12345', '123456789', '1234567', '1234567890', '0987654321',
  'password123', 'iloveu', 'princess1', 'rockyou', 'nicole', 'jessica',
  'lovely', 'michael1', 'ashley1', 'qwerty1',
];

const KEYBOARD_WALKS: string[] = [
  'qwerty', 'qwertyuiop', 'asdf', 'asdfgh', 'asdfghjkl', 'zxcv',
  'zxcvbn', 'zxcvbnm', 'qazwsx', 'qweasd', '1qaz2wsx', 'zaq1xsw2',
  'qweasdzxc', '1q2w3e', '1q2w3e4r', 'poiuytrewq', 'lkjhgfdsa',
  'mnbvcxz',
];

const SUBSTITUTION_MAP: Record<string, string> = {
  '@': 'a',
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '$': 's',
  '!': 'i',
  '5': 's',
  '7': 't',
  '+': 't',
  '4': 'a',
};

function desubstitute(password: string): string {
  let result = '';
  for (const char of password) {
    result += SUBSTITUTION_MAP[char] || char;
  }
  return result;
}

function hasSequentialChars(password: string): boolean {
  const lower = password.toLowerCase();
  for (let i = 0; i < lower.length - 2; i++) {
    const c1 = lower.charCodeAt(i);
    const c2 = lower.charCodeAt(i + 1);
    const c3 = lower.charCodeAt(i + 2);
    // Ascending sequence (abc, 123)
    if (c2 === c1 + 1 && c3 === c2 + 1) {
      return true;
    }
    // Descending sequence (cba, 321)
    if (c2 === c1 - 1 && c3 === c2 - 1) {
      return true;
    }
  }
  return false;
}

function hasRepeatingChars(password: string): boolean {
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i] === password[i + 1] && password[i + 1] === password[i + 2]) {
      return true;
    }
  }
  return false;
}

function calculateCharsetSize(password: string): number {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^a-zA-Z0-9]/.test(password)) size += 33;
  return size || 1;
}

function formatTime(seconds: number): string {
  if (seconds < 0.001) return 'instant';
  if (seconds < 1) return 'instant';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  const years = seconds / 31536000;
  if (years < 100) return `${Math.round(years)} years`;
  if (years < 1000000) return `${Math.round(years).toLocaleString()} years`;
  if (years < 1e9) return `${Math.round(years / 1e6)} million years`;
  if (years < 1e12) return `${Math.round(years / 1e9)} billion years`;
  return `${Math.round(years / 1e12)} trillion years`;
}

function calculateCrackTimes(password: string): { bruteForce: string; dictionary: string } {
  const charsetSize = calculateCharsetSize(password);
  const length = password.length;

  if (length === 0) {
    return { bruteForce: 'instant', dictionary: 'instant' };
  }

  // Entropy = log2(charsetSize ^ length) = length * log2(charsetSize)
  const entropy = length * Math.log2(charsetSize);

  // Total combinations = 2^entropy
  // Average guesses = 2^entropy / 2
  const totalCombinations = Math.pow(2, entropy);
  const averageGuesses = totalCombinations / 2;

  // Brute force: 10 billion guesses/sec (modern GPU cluster)
  const bruteForceSeconds = averageGuesses / 10_000_000_000;

  // Dictionary: 1 million guesses/sec (rule-based attack)
  const dictionarySeconds = averageGuesses / 1_000_000;

  return {
    bruteForce: formatTime(bruteForceSeconds),
    dictionary: formatTime(dictionarySeconds),
  };
}

function getStrengthLabel(
  score: number
): 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong' {
  if (score < 20) return 'Very Weak';
  if (score < 40) return 'Weak';
  if (score < 60) return 'Fair';
  if (score < 75) return 'Good';
  if (score < 90) return 'Strong';
  return 'Very Strong';
}

export function analyzePassword(password: string): PasswordAnalysis {
  if (password.length === 0) {
    return {
      score: 0,
      strength: 'Very Weak',
      crackTimes: { bruteForce: 'instant', dictionary: 'instant' },
      characterAnalysis: {
        length: 0,
        hasUppercase: false,
        hasLowercase: false,
        hasNumbers: false,
        hasSymbols: false,
      },
      patterns: [],
      suggestions: [
        'Use at least 12 characters',
        'Add uppercase letters',
        'Include numbers',
        'Add special characters (!@#$%)',
        'Consider using a passphrase — 4+ random words',
      ],
    };
  }

  const characterAnalysis = {
    length: password.length,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSymbols: /[^a-zA-Z0-9]/.test(password),
  };

  // --- Length score (0-40) ---
  let lengthScore: number;
  if (password.length <= 4) {
    lengthScore = 0;
  } else if (password.length <= 7) {
    lengthScore = 10;
  } else if (password.length <= 11) {
    lengthScore = 20;
  } else if (password.length <= 15) {
    lengthScore = 30;
  } else {
    lengthScore = 40;
  }

  // --- Character diversity score (0-30) ---
  let diversityScore = 0;
  if (characterAnalysis.hasUppercase) diversityScore += 8;
  if (characterAnalysis.hasLowercase) diversityScore += 7;
  if (characterAnalysis.hasNumbers) diversityScore += 7;
  if (characterAnalysis.hasSymbols) diversityScore += 8;

  // --- Pattern penalties ---
  let penalty = 0;
  const patterns: string[] = [];
  const lowerPassword = password.toLowerCase();

  // Common password check
  if (COMMON_PASSWORDS.includes(lowerPassword)) {
    penalty += 30;
    patterns.push('This is a commonly used password');
  }

  // Keyboard walk check
  const hasKeyboardWalk = KEYBOARD_WALKS.some((walk) => lowerPassword.includes(walk));
  if (hasKeyboardWalk) {
    penalty += 15;
    patterns.push('Contains a keyboard walk pattern (e.g., qwerty, asdf)');
  }

  // Common substitution check — only if not already a direct common password match
  if (!COMMON_PASSWORDS.includes(lowerPassword)) {
    const desubstituted = desubstitute(lowerPassword);
    if (desubstituted !== lowerPassword && COMMON_PASSWORDS.includes(desubstituted)) {
      penalty += 20;
      patterns.push('Uses common character substitutions of a known password');
    }
  }

  // Sequential characters
  if (hasSequentialChars(password)) {
    penalty += 10;
    patterns.push('Contains sequential characters (e.g., abc, 123)');
  }

  // Repeating characters
  if (hasRepeatingChars(password)) {
    penalty += 5;
    patterns.push('Contains repeating characters (e.g., aaa, 111)');
  }

  // --- Calculate final score ---
  const rawScore = lengthScore + diversityScore - penalty;
  const score = Math.min(100, Math.max(0, rawScore));

  // --- Suggestions ---
  const suggestions: string[] = [];
  if (password.length < 12) {
    suggestions.push('Use at least 12 characters');
  }
  if (!characterAnalysis.hasUppercase) {
    suggestions.push('Add uppercase letters');
  }
  if (!characterAnalysis.hasNumbers) {
    suggestions.push('Include numbers');
  }
  if (!characterAnalysis.hasSymbols) {
    suggestions.push('Add special characters (!@#$%)');
  }
  if (COMMON_PASSWORDS.includes(lowerPassword)) {
    suggestions.push('Avoid common passwords');
  }
  if (patterns.length > 0 && !COMMON_PASSWORDS.includes(lowerPassword)) {
    suggestions.push('Avoid keyboard patterns and sequences');
  }
  suggestions.push('Consider using a passphrase — 4+ random words');

  return {
    score,
    strength: getStrengthLabel(score),
    crackTimes: calculateCrackTimes(password),
    characterAnalysis,
    patterns,
    suggestions,
  };
}
