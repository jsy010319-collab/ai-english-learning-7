const api = {
  async getScenarios() {
    const res = await fetch('/api/scenarios');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },
  async start(scenarioId) {
    const res = await fetch('/api/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId })
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },
  async reply(scenarioId, transcript) {
    const res = await fetch('/api/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId, transcript })
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  }
};

const els = {
  scenarios: document.getElementById('scenarios'),
  startBtn: document.getElementById('startBtn'),
  micBtn: document.getElementById('micBtn'),
  stopBtn: document.getElementById('stopBtn'),
  ttsBtn: document.getElementById('ttsBtn'),
  script: document.getElementById('script'),
  feedback: document.getElementById('feedback'),
  saveLineBtn: document.getElementById('saveLineBtn'),
  reviewBtn: document.getElementById('reviewBtn'),
  reviewPanel: document.getElementById('reviewPanel')
};

let state = {
  scenarioId: null,
  transcriptLines: [],
  lastAiLine: '',
  recognizing: false,
};

function renderScript() {
  els.script.innerHTML = state.transcriptLines.map(l => {
    const cls = l.startsWith('AI:') ? 'ai' : 'user';
    return `<div class="line ${cls}">${l}</div>`;
  }).join('\n');
}

function setFeedback(text) {
  els.feedback.textContent = text || '';
}

function setControls(running) {
  els.micBtn.disabled = !running;
  els.stopBtn.disabled = !running;
  els.ttsBtn.disabled = !running;
  els.saveLineBtn.disabled = !running;
}

function saveForReview(line) {
  const key = 'ai-english-review';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  const item = { line, addedAt: Date.now(), nextAt: Date.now(), intervalDays: 1 };
  list.push(item);
  localStorage.setItem(key, JSON.stringify(list));
}

function openReview() {
  const key = 'ai-english-review';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  if (!list.length) {
    els.reviewPanel.textContent = '저장된 문장이 없습니다.';
    els.reviewPanel.classList.remove('hidden');
    return;
  }
  const now = Date.now();
  els.reviewPanel.innerHTML = list.map((it, idx) => {
    const due = it.nextAt <= now;
    return `<div class="item">
      <div>${it.line}</div>
      <div class="small">복습 시점: ${due ? '지금' : new Date(it.nextAt).toLocaleString()}</div>
      <div class="controls">
        <button data-idx="${idx}" data-rate="again">다시</button>
        <button data-idx="${idx}" data-rate="good">좋음</button>
        <button data-idx="${idx}" data-rate="easy">쉬움</button>
        <button data-idx="${idx}" data-delete="1">삭제</button>
      </div>
    </div>`;
  }).join('');
  els.reviewPanel.classList.remove('hidden');

  els.reviewPanel.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      if (btn.dataset.delete) {
        list.splice(idx, 1);
      } else {
        const rate = btn.dataset.rate;
        const it = list[idx];
        const base = 24 * 60 * 60 * 1000;
        if (rate === 'again') it.intervalDays = 1;
        if (rate === 'good') it.intervalDays = Math.min(7, it.intervalDays * 2);
        if (rate === 'easy') it.intervalDays = Math.min(30, Math.ceil(it.intervalDays * 2.5));
        it.nextAt = Date.now() + it.intervalDays * base;
      }
      localStorage.setItem(key, JSON.stringify(list));
      openReview();
    });
  });
}

async function renderScenarios() {
  try {
    const { scenarios } = await api.getScenarios();
    if (!scenarios || scenarios.length === 0) {
      els.scenarios.innerHTML = '<div>상황 목록을 불러올 수 없습니다.</div>';
      return;
    }
    els.scenarios.innerHTML = scenarios.map(s => `
      <div class="scenario" role="button" tabindex="0" data-id="${s.id}">
        <div>
          <div><strong>${s.title}</strong></div>
          <div class="meta">${s.culture} • ${s.description}</div>
        </div>
        <div>선택</div>
      </div>
    `).join('');

    els.scenarios.querySelectorAll('.scenario').forEach(el => {
      const id = el.getAttribute('data-id');
      el.addEventListener('click', () => { state.scenarioId = id; highlightScenario(id); });
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { state.scenarioId = id; highlightScenario(id); } });
    });
  } catch (error) {
    console.error('상황 목록 로드 실패:', error);
    els.scenarios.innerHTML = '<div>상황 목록을 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.</div>';
  }
}

function highlightScenario(id) {
  els.scenarios.querySelectorAll('.scenario').forEach(el => {
    if (el.getAttribute('data-id') === id) {
      el.style.outline = '2px solid var(--accent)';
    } else {
      el.style.outline = 'none';
    }
  });
}

async function startConversation() {
  if (!state.scenarioId) {
    alert('상황을 선택해주세요.');
    return;
  }
  const { ai } = await api.start(state.scenarioId);
  state.transcriptLines = [ `AI: ${ai}` ];
  state.lastAiLine = ai;
  renderScript();
  setFeedback('');
  setControls(true);
}

async function sendUserLine(text) {
  state.transcriptLines.push(`You: ${text}`);
  renderScript();
  const screenplay = state.transcriptLines.join('\n');
  const { reply, correction, tip } = await api.reply(state.scenarioId, screenplay);
  state.transcriptLines.push(`AI: ${reply}`);
  state.lastAiLine = reply;
  renderScript();
  setFeedback(`교정: ${correction}\n팁: ${tip}`);
}

// Speech-to-text (Web Speech API)
let recognition;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    sendUserLine(text);
  };
  recognition.onend = () => { state.recognizing = false; updateMicButtons(); };
} else {
  console.warn('웹 음성 인식이 지원되지 않습니다');
}

function updateMicButtons() {
  els.micBtn.textContent = state.recognizing ? '🎙 듣는 중...' : '🎤 말하기';
}

els.micBtn.addEventListener('click', () => {
  if (!recognition) {
    const text = prompt('당신의 대답:');
    if (text) sendUserLine(text);
    return;
  }
  state.recognizing = true;
  updateMicButtons();
  recognition.start();
});

els.stopBtn.addEventListener('click', () => {
  if (recognition && state.recognizing) recognition.stop();
});

// 마지막 AI 문장 읽어주기
els.ttsBtn.addEventListener('click', () => {
  const u = new SpeechSynthesisUtterance(state.lastAiLine || '');
  u.lang = 'en-US';
  window.speechSynthesis.speak(u);
});

els.startBtn.addEventListener('click', startConversation);
els.saveLineBtn.addEventListener('click', () => saveForReview(state.lastAiLine));
els.reviewBtn.addEventListener('click', openReview);

renderScenarios();


