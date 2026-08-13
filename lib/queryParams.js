// セッション管理を持たず、画面間の入力値はURLクエリパラメータで持ち回る
// （docs/lunch_mate_db_design.md 5章の設計判断に準拠）。
// このヘルパーはその受け渡し用のクエリ文字列組み立てだけを担う。

export function toQueryString(params) {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    usp.set(key, String(value));
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}
