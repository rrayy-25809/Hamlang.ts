import './style.css';
import { Type, reset_valuesdict } from './interpret.ts';

// ============================================================================
// DOM Elements
// ============================================================================

const fileButton = document.getElementById('fileButton') as HTMLButtonElement;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const runButton = document.getElementById('runButton') as HTMLButtonElement;
const resetButton = document.getElementById('resetButton') as HTMLButtonElement;
const input = document.getElementById('input') as HTMLTextAreaElement;
const output = document.getElementById('output') as HTMLDivElement;

// ============================================================================
// Utility: Output Management
// ============================================================================

let outputLines: string[] = [];

/**
 * Add a line to the output display
 */
function addOutputLine(text: string, type: 'normal' | 'error' | 'success' | 'warning' = 'normal') {
  const line = document.createElement('div');
  line.className = 'output-line';
  
  if (type !== 'normal') {
    line.classList.add(`output-${type}`);
  }
  
  line.textContent = text;
  output.appendChild(line);
  outputLines.push(text);
}

/**
 * Clear output and prepare for new run
 */
function clearOutput() {
  output.textContent = '';
  output.classList.remove('has-content', 'error');
  outputLines = [];
}

/**
 * Mark output as having content
 */
function markOutputActive() {
  output.classList.add('has-content');
}

/**
 * Mark output as error state
 */
function markOutputError() {
  output.classList.add('error');
}

// ============================================================================
// File Upload Handler
// ============================================================================

fileButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result as string;
    input.value = text;
  };
  reader.onerror = () => {
    clearOutput();
    addOutputLine('파일을 읽을 수 없습니다. 다시 시도해주세요.', 'error');
    markOutputError();
  };
  reader.readAsText(file);
});

// ============================================================================
// Code Execution Handler
// ============================================================================

runButton.addEventListener('click', () => {
  const code = input.value.trim();

  // Clear previous output
  clearOutput();

  // Validate input
  if (!code) {
    const placeholder = document.createElement('p');
    placeholder.className = 'output-placeholder';
    placeholder.textContent = '코드를 입력하고 실행 버튼을 눌러주세요';
    output.appendChild(placeholder);
    return;
  }

  try {
    // Mark as active before execution
    markOutputActive();

    // Reset interpreter state
    reset_valuesdict();

    // Split into lines and execute
    const lines = code.split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (trimmed && !trimmed.startsWith('#')) {
        Type(line);
      }
    });

    // If no output was generated, show success message
    if (outputLines.length === 0) {
      addOutputLine('✓ 코드가 성공적으로 실행되었습니다', 'success');
    }
  } catch (error) {
    markOutputError();
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    addOutputLine(`문제가 발생했습니다: ${errorMessage}`, 'error');
    addOutputLine('더 작은 예제로 시도해주세요', 'warning');
  }
});

// ============================================================================
// Reset Handler
// ============================================================================

resetButton.addEventListener('click', () => {
  input.value = '';
  clearOutput();
  reset_valuesdict();
  
  const placeholder = document.createElement('p');
  placeholder.className = 'output-placeholder';
  placeholder.textContent = '코드를 실행하면 결과가 여기에 표시됩니다';
  output.appendChild(placeholder);
});

// ============================================================================
// Initialize on DOM Ready
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initial state is already set in HTML
  console.log('Hamlang Playground initialized');
});