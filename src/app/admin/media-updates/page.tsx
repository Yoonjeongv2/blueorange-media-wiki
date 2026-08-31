'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Link2, FileText, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';

const MEDIA_PLATFORMS = ['네이버', '카카오', 'Meta', 'Google', '토스', '기타'];
type Mode = 'url' | 'text' | 'image';

const MODE_TABS: { id: Mode; label: string; icon: typeof Link2 }[] = [
  { id: 'url', label: '링크 URL', icon: Link2 },
  { id: 'text', label: '텍스트', icon: FileText },
  { id: 'image', label: '이미지', icon: ImageIcon },
];

interface Draft {
  platform: string;
  productType: string;
  title: string;
  updateType: string;
  importance: string;
  noticeDate: string;
  effectiveDate: string;
  summary: string;
  targetAudience: string;
  keyChanges: string;
  actionItems: string;
  cautions: string;
  keywords: string;
  externalTitle: string;
  externalSummary: string;
  imagePrompt: string;
}

function TextField({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}
    </div>
  );
}

export default function AdminMediaUpdates() {
  const [secret, setSecret] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const [mode, setMode] = useState<Mode>('url');
  const [platformHint, setPlatformHint] = useState(MEDIA_PLATFORMS[0]);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [imageMediaType, setImageMediaType] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [visibility, setVisibility] = useState<'외부 공개' | '내부용'>('외부 공개');
  const [publishStart, setPublishStart] = useState('');
  const [publishEnd, setPublishEnd] = useState('');

  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const [draft, setDraft] = useState<Draft | null>(null);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageMediaType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result.split(',')[1] || '');
    };
    reader.readAsDataURL(file);
  }

  async function handleExtract() {
    setError('');
    setSaved(false);
    setExtracting(true);
    try {
      const body: Record<string, string> = { mode, platform: platformHint };
      if (mode === 'url') body.url = url.trim();
      if (mode === 'text') body.text = text.trim();
      if (mode === 'image') {
        body.imageBase64 = imageBase64;
        body.imageMediaType = imageMediaType;
      }

      const res = await fetch('/api/media-updates/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!res.ok) {
        if (res.status === 401) setUnlocked(false);
        throw new Error(result.error || '정리하는 중 오류가 발생했습니다.');
      }
      setDraft(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setExtracting(false);
    }
  }

  async function handleSave() {
    if (!draft) return;
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/media-updates/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({
          draft,
          sourceUrl: mode === 'url' ? url.trim() : '',
          visibility,
          publishStart,
          publishEnd,
          imageBase64: mode === 'image' ? imageBase64 : '',
          imageMediaType: mode === 'image' ? imageMediaType : '',
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        if (res.status === 401) setUnlocked(false);
        throw new Error(result.error || '저장 중 오류가 발생했습니다.');
      }
      setSaved(true);
      setDraft(null);
      setUrl('');
      setText('');
      setImageBase64('');
      setImagePreview('');
      setPublishStart('');
      setPublishEnd('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (secret.trim()) setUnlocked(true);
          }}
          className="w-full max-w-sm rounded-2xl border border-gray-200 p-8"
        >
          <h1 className="text-xl font-medium text-gray-900 mb-1">관리자 인증</h1>
          <p className="text-sm text-gray-500 mb-6">미디어 업데이트 등록을 위한 관리자 암호를 입력하세요.</p>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="관리자 암호"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-2 text-sm font-medium text-white hover:shadow-md transition-all"
          >
            입장
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/media-updates" className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            ← 미디어 업데이트로 이동
          </Link>
          <h1 className="text-3xl font-light tracking-tight text-gray-900">미디어 업데이트 등록</h1>
          <p className="mt-2 text-gray-600">
            링크 URL을 우선 사용하고, 공유 URL이 없는 경우 텍스트나 이미지로 내용을 정리하세요.
            저장 후에는 시트에서 <strong>게시 승인</strong>을 입력해야 실제로 공개됩니다.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
        {/* 매체 힌트 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">매체 (힌트 — AI가 정확한 매체명으로 정리합니다)</label>
          <div className="flex flex-wrap gap-2">
            {MEDIA_PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => setPlatformHint(p)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  platformHint === p ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 입력 방식 탭 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">입력 방식</label>
          <div className="flex gap-2 border-b border-gray-200">
            {MODE_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setMode(tab.id);
                    setDraft(null);
                    setError('');
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                    mode === tab.id
                      ? 'border-b-2 border-gray-900 text-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            {mode === 'url' && (
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://... 공유 URL을 붙여넣으세요"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
            {mode === 'text' && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                placeholder="공지사항, 이메일 본문 등 텍스트를 붙여넣으세요"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
            {mode === 'image' && (
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
                <p className="mt-1.5 text-xs text-gray-500">
                  첨부한 이미지는 자동으로 업로드되어 대표 이미지로 쓰입니다. 이미지가 없으면 저장 시 AI가 대표 이미지를 자동 생성합니다.
                </p>
                {imagePreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="첨부 이미지 미리보기" className="mt-3 max-h-64 rounded-lg border border-gray-200" />
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleExtract}
            disabled={
              extracting ||
              (mode === 'url' && !url.trim()) ||
              (mode === 'text' && !text.trim()) ||
              (mode === 'image' && !imageBase64)
            }
            className="mt-4 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {extracting && <Loader2 className="w-4 h-4 animate-spin" />}
            AI로 정리하기
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {saved && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4" />
            시트에 저장되었습니다. &quot;게시 승인&quot;란에 승인을 입력하면 공개 페이지에 노출됩니다.
          </div>
        )}

        {/* 정리 결과 미리보기 & 수정 */}
        {draft && (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">기본 정보</h2>
              <div className="grid grid-cols-2 gap-4">
                <TextField label="매체명" value={draft.platform} onChange={(v) => set('platform', v)} />
                <TextField label="광고 상품 유형" value={draft.productType} onChange={(v) => set('productType', v)} />
                <TextField label="업데이트 유형" value={draft.updateType} onChange={(v) => set('updateType', v)} />
                <TextField label="중요도" value={draft.importance} onChange={(v) => set('importance', v)} />
                <TextField label="공지일" value={draft.noticeDate} onChange={(v) => set('noticeDate', v)} />
                <TextField label="적용일" value={draft.effectiveDate} onChange={(v) => set('effectiveDate', v)} />
              </div>
              <TextField label="내부 참고용 제목" value={draft.title} onChange={(v) => set('title', v)} />
            </div>

            <div className="rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">내부 상세 내용</h2>
              <TextField label="핵심 요약" value={draft.summary} onChange={(v) => set('summary', v)} rows={3} />
              <TextField label="적용 대상" value={draft.targetAudience} onChange={(v) => set('targetAudience', v)} rows={3} />
              <TextField label="주요 변경사항" value={draft.keyChanges} onChange={(v) => set('keyChanges', v)} rows={3} />
              <TextField label="실무 체크사항" value={draft.actionItems} onChange={(v) => set('actionItems', v)} rows={3} />
              <TextField label="유의사항" value={draft.cautions} onChange={(v) => set('cautions', v)} rows={3} />
              <TextField label="검색 키워드" value={draft.keywords} onChange={(v) => set('keywords', v)} />
            </div>

            <div className="rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">외부 공개용 문구</h2>
              <TextField label="외부용 제목" value={draft.externalTitle} onChange={(v) => set('externalTitle', v)} />
              <TextField label="외부용 요약" value={draft.externalSummary} onChange={(v) => set('externalSummary', v)} rows={3} />
            </div>

            <div className="rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">공개 설정</h2>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">공개 범위</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVisibility('외부 공개')}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      visibility === '외부 공개' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    외부 공개
                  </button>
                  <button
                    onClick={() => setVisibility('내부용')}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      visibility === '내부용' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    내부용
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">공개 시작일 (선택)</label>
                  <input
                    type="date"
                    value={publishStart}
                    onChange={(e) => setPublishStart(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">공개 종료일 (선택)</label>
                  <input
                    type="date"
                    value={publishEnd}
                    onChange={(e) => setPublishEnd(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:shadow-md disabled:opacity-40 transition-all"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              시트에 저장 (검토 대기)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
