'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Upload, Link2, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

const MEDIA_PLATFORMS = ['네이버', '카카오', 'Meta', 'Google', '토스', '기타'];
type ImageMode = 'file' | 'url';

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
}

function Field({
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
      <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 p-6 sm:p-7 space-y-5">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

export default function AdminMediaUpdates() {
  const [secret, setSecret] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const [platformHint, setPlatformHint] = useState(MEDIA_PLATFORMS[0]);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const [imageMode, setImageMode] = useState<ImageMode>('url');
  const [imageUrlInput, setImageUrlInput] = useState('');
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
  const [resummarizing, setResummarizing] = useState(false);

  const hasAnyInput = url.trim() || text.trim() || imageBase64 || (imageMode === 'url' && imageUrlInput.trim());

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  function clearImage() {
    setImageBase64('');
    setImageMediaType('');
    setImagePreview('');
    setImageUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      const body: Record<string, string> = { platform: platformHint };
      if (url.trim()) body.url = url.trim();
      if (text.trim()) body.text = text.trim();
      if (imageMode === 'file' && imageBase64) {
        body.imageBase64 = imageBase64;
        body.imageMediaType = imageMediaType;
      } else if (imageMode === 'url' && imageUrlInput.trim()) {
        body.imageUrl = imageUrlInput.trim();
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

  async function handleResummarize() {
    if (!draft) return;
    setError('');
    setResummarizing(true);
    try {
      const res = await fetch('/api/media-updates/resummarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({ draft }),
      });
      const result = await res.json();
      if (!res.ok) {
        if (res.status === 401) setUnlocked(false);
        throw new Error(result.error || '요약을 다시 정리하는 중 오류가 발생했습니다.');
      }
      set('summary', result.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setResummarizing(false);
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
          sourceUrl: url.trim(),
          visibility,
          publishStart,
          publishEnd,
          imageBase64: imageMode === 'file' ? imageBase64 : '',
          imageMediaType: imageMode === 'file' ? imageMediaType : '',
          imageUrl: imageMode === 'url' ? imageUrlInput.trim() : '',
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
      clearImage();
      setPublishStart('');
      setPublishEnd('');
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-sm font-medium text-white hover:shadow-md transition-all"
          >
            입장
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <Link href="/media-updates" className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            ← 미디어 업데이트로 이동
          </Link>
          <h1 className="text-3xl font-light tracking-tight text-gray-900">미디어 업데이트 등록</h1>
          <p className="mt-3 text-base text-gray-600 leading-relaxed">
            링크 URL, 텍스트, 이미지(파일 또는 이미지 URL)를 원하는 만큼 함께 입력하면 AI가 종합해서 정리합니다.
            저장 후에는 시트에서 <strong>게시 승인</strong>을 입력해야 실제로 공개됩니다.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 sm:px-10 py-12 space-y-10">
        {/* 매체 힌트 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2.5">매체 (힌트 — AI가 정확한 매체명으로 정리합니다)</label>
          <div className="flex flex-wrap gap-2">
            {MEDIA_PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => setPlatformHint(p)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  platformHint === p ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 입력 — URL/텍스트/이미지를 함께 */}
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2.5">
              <Link2 className="w-4 h-4" /> 참고 URL (선택)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://... 공유 URL을 붙여넣으세요"
              className="w-full rounded-lg border border-gray-300 px-3.5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2.5">텍스트 (선택)</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="공지사항, 이메일 본문 등 텍스트를 붙여넣으세요"
              className="w-full rounded-lg border border-gray-300 px-3.5 py-3 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-medium text-gray-700">이미지 (선택)</label>
              <div className="flex rounded-lg bg-gray-100 p-1 text-sm">
                <button
                  onClick={() => {
                    setImageMode('url');
                    setImageBase64('');
                    setImageMediaType('');
                    setImagePreview('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors ${
                    imageMode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" /> 이미지 URL
                </button>
                <button
                  onClick={() => {
                    setImageMode('file');
                    setImageUrlInput('');
                  }}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors ${
                    imageMode === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" /> 파일 업로드
                </button>
              </div>
            </div>

            {imageMode === 'file' ? (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
              />
            ) : (
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://... 이미지 URL을 붙여넣으세요"
                className="w-full rounded-lg border border-gray-300 px-3.5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}

            {imagePreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="첨부 이미지 미리보기" className="mt-3 max-h-64 rounded-lg border border-gray-200" />
            )}
          </div>

          <button
            onClick={handleExtract}
            disabled={extracting || !hasAnyInput}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-base font-medium text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {extracting && <Loader2 className="w-4 h-4 animate-spin" />}
            AI로 정리하기
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3.5 text-base text-red-700">{error}</div>
        )}

        {saved && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3.5 text-base text-green-700">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            시트에 저장되었습니다. &quot;게시 승인&quot;란에 승인을 입력하면 공개 페이지에 노출됩니다.
          </div>
        )}

        {/* 정리 결과 미리보기 & 수정 */}
        {draft && (
          <div className="space-y-6">
            <Section title="기본 정보">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="매체명" value={draft.platform} onChange={(v) => set('platform', v)} />
                <Field label="광고 상품 유형" value={draft.productType} onChange={(v) => set('productType', v)} />
                <Field label="업데이트 유형" value={draft.updateType} onChange={(v) => set('updateType', v)} />
                <Field label="중요도" value={draft.importance} onChange={(v) => set('importance', v)} />
                <Field label="공지일" value={draft.noticeDate} onChange={(v) => set('noticeDate', v)} />
                <Field label="적용일" value={draft.effectiveDate} onChange={(v) => set('effectiveDate', v)} />
              </div>
              <Field label="내부 참고용 제목" value={draft.title} onChange={(v) => set('title', v)} />
            </Section>

            <Section title="내부 상세 내용">
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-600">핵심 요약</label>
                  <button
                    onClick={handleResummarize}
                    disabled={resummarizing}
                    className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-40"
                  >
                    {resummarizing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                    AI로 다시 쓰기
                  </button>
                </div>
                <textarea
                  value={draft.summary}
                  onChange={(e) => set('summary', e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Field label="적용 대상" value={draft.targetAudience} onChange={(v) => set('targetAudience', v)} rows={3} />
              <Field label="주요 변경사항" value={draft.keyChanges} onChange={(v) => set('keyChanges', v)} rows={3} />
              <Field label="실무 체크사항" value={draft.actionItems} onChange={(v) => set('actionItems', v)} rows={3} />
              <Field label="유의사항" value={draft.cautions} onChange={(v) => set('cautions', v)} rows={3} />
              <Field label="검색 키워드" value={draft.keywords} onChange={(v) => set('keywords', v)} />
            </Section>

            <Section title="공개 설정">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">공개 범위</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVisibility('외부 공개')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      visibility === '외부 공개' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    외부 공개
                  </button>
                  <button
                    onClick={() => setVisibility('내부용')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      visibility === '내부용' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    내부용
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">공개 시작일 (선택)</label>
                  <input
                    type="date"
                    value={publishStart}
                    onChange={(e) => setPublishStart(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">공개 종료일 (선택)</label>
                  <input
                    type="date"
                    value={publishEnd}
                    onChange={(e) => setPublishEnd(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </Section>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-base font-medium text-white hover:shadow-md disabled:opacity-40 transition-all"
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
