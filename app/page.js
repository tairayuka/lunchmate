'use client';
import { useState, useEffect, useRef } from 'react';

// schema.sql の nationalities 初期データと一致させること
const NATIONALITIES = [
  { code: 'JP', name: 'Japan' },
  { code: 'PH', name: 'Philippines' },
  { code: 'KR', name: 'Korea' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TH', name: 'Thailand' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'CN', name: 'China' },
  { code: 'BR', name: 'Brazil' },
  { code: 'US', name: 'USA' },
];

const box = { maxWidth: 420, margin: '40px auto', padding: 24, background: '#fff', border: '1px solid #ccc', borderRadius: 8 };
const btn = { display: 'block', width: '100%', padding: 12, marginTop: 12, fontSize: 15, cursor: 'pointer' };
const field = { display: 'block', width: '100%', padding: 10, marginTop: 6, fontSize: 15 };

export default function Home() {
  const [screen, setScreen] = useState('welcome'); // welcome | profile | guideline | home | searching | result | canceled
  const [name, setName] = useState('');
  const [nationalityCode, setNationalityCode] = useState(NATIONALITIES[0].code);
  const [agreed, setAgreed] = useState(false);
  const [userId, setUserId] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [errorMsg, setErrorMsg] = useState('');

  const pollRef = useRef(null);
  const timerRef = useRef(null);

  function clearTimers() {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);
  }
  useEffect(() => clearTimers, []);

  async function handleParticipate() {
    setErrorMsg('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, nationalityCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '登録に失敗しました');

      setUserId(data.userId);

      if (data.status === 'matched') {
        setMatchInfo(data.match);
        setScreen('result');
      } else {
        setScreen('searching');
        startSearching(data.userId);
      }
    } catch (e) {
      setErrorMsg(e.message);
    }
  }

  function startSearching(uid) {
    setSecondsLeft(60);

    // 60秒カウントダウン
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimers();
          handleCancel(uid, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 状態ポーリング（1.5秒おき）
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/status?userId=${uid}`);
        const data = await res.json();
        if (data.status === 'matched') {
          clearTimers();
          setMatchInfo(data.match);
          setScreen('result');
        } else if (data.status === 'canceled') {
          clearTimers();
          setScreen('canceled');
        }
      } catch (e) {
        console.error(e);
      }
    }, 1500);
  }

  async function handleCancel(uid, isTimeout = false) {
    clearTimers();
    try {
      await fetch('/api/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid || userId }),
      });
    } catch (e) {
      console.error(e);
    }
    setScreen('canceled');
  }

  function resetAll() {
    clearTimers();
    setName('');
    setAgreed(false);
    setUserId(null);
    setMatchInfo(null);
    setErrorMsg('');
    setScreen('welcome');
  }

  return (
    <div style={box}>
      <h2 style={{ marginTop: 0 }}>Lunch Mate</h2>

      {screen === 'welcome' && (
        <>
          <p>Hey! Are you ready for match?</p>
          <button style={btn} onClick={() => setScreen('profile')}>はじめる</button>
        </>
      )}

      {screen === 'profile' && (
        <>
          <label>名前</label>
          <input
            style={field}
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：ユウカ"
          />
          <label style={{ marginTop: 12, display: 'block' }}>国籍</label>
          <select style={field} value={nationalityCode} onChange={(e) => setNationalityCode(e.target.value)}>
            {NATIONALITIES.map((n) => (
              <option key={n.code} value={n.code}>{n.name} ({n.code})</option>
            ))}
          </select>
          <button
            style={btn}
            disabled={!name.trim()}
            onClick={() => setScreen('guideline')}
          >
            次へ
          </button>
        </>
      )}

      {screen === 'guideline' && (
        <>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
            ・相手の国籍・文化に敬意を持って接してください。<br />
            ・1対1のランチのみ。DM/チャット機能はありません。<br />
            ・集合場所は自動で割り当てられます。<br />
            ・マッチング後のキャンセルはお早めに。
          </p>
          <label>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            {' '}上記に同意します
          </label>
          <button style={btn} disabled={!agreed} onClick={() => setScreen('home')}>
            同意して次へ
          </button>
        </>
      )}

      {screen === 'home' && (
        <>
          <p>名前：{name}<br />国籍：{NATIONALITIES.find((n) => n.code === nationalityCode)?.name}</p>
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
          <button style={btn} onClick={handleParticipate}>今日のランチに参加する</button>
        </>
      )}

      {screen === 'searching' && (
        <>
          <p>お相手を探しています…</p>
          <p>残り {secondsLeft} 秒</p>
          <button style={btn} onClick={() => handleCancel(userId)}>検索をやめる</button>
        </>
      )}

      {screen === 'result' && matchInfo && (
        <>
          <p><strong>マッチング成立しました！</strong></p>
          <p>
            マッチ番号：{matchInfo.matchNumber}<br />
            お相手：{matchInfo.partnerName}（{matchInfo.partnerNationality}）<br />
            集合場所：{matchInfo.location}<br />
            成立時刻：{new Date(matchInfo.matchedAt).toLocaleTimeString('ja-JP')}
          </p>
          <button style={btn} onClick={resetAll}>ホームに戻る</button>
          <button style={btn} onClick={() => handleCancel(userId)}>このマッチをキャンセル</button>
        </>
      )}

      {screen === 'canceled' && (
        <>
          <p>今回はお相手が見つかりませんでした。</p>
          <button style={btn} onClick={resetAll}>ホームに戻る</button>
        </>
      )}
    </div>
  );
}
