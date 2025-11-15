import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { questions } from '../../data/questions';
import { quadrants } from '../../data/categories';
import { calculateScore } from '../../utils/scoreCalculator';
import { RadarChart } from './RadarChart';
import { ScoreSummary } from './ScoreSummary';
import { ScenarioGrading } from './ScenarioGrading';
import { AnswerReview } from './AnswerReview';
import { googleSheetsRecordManager } from '../../utils/recordManager';
import type { AssessmentRecord, ParticipantProfile } from '../../types/record.types';

export const ResultsContainer: React.FC = () => {
  const { state, resetQuiz } = useQuiz();
  const [showGrading, setShowGrading] = useState(false);
  const [showAnswerReview, setShowAnswerReview] = useState(false);
  const [profile, setProfile] = useState<ParticipantProfile>({
    name: '',
    email: '',
    organization: '',
    role: '',
    experience: '',
    notes: '',
    consent: true
  });
  const [recordStatus, setRecordStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [sheetLink, setSheetLink] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const result = calculateScore(questions, state.answers, state.scenarioScores || {});
  
  const scenarioQuestions = questions.filter(q => q.type === 'scenario');
  const ungradedScenarios = scenarioQuestions.filter(
    q => !state.scenarioScores || state.scenarioScores[q.id] === undefined
  );
  const gradedScenarios = scenarioQuestions.length - ungradedScenarios.length;

  const handleRestart = () => {
    if (confirm('確定要重新開始評測嗎？所有答案將會被清除。')) {
      resetQuiz();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleProfileChange = (
    field: Exclude<keyof ParticipantProfile, 'consent'>,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConsentChange = (checked: boolean) => {
    setProfile((prev) => ({
      ...prev,
      consent: checked
    }));
  };

  const buildRecordPayload = (): AssessmentRecord => {
    return {
      profile,
      totalScore: result.totalScore,
      totalMaxScore: result.totalMaxScore,
      overallPercentage: result.overallPercentage,
      quadrantScores: result.scores,
      quadrantMaxScores: result.maxScores,
      dontKnowCounts: result.dontKnowCounts,
      totalDontKnow: result.totalDontKnow,
      answers: state.answers,
      scenarioScores: state.scenarioScores || {},
      scenarioSummary: {
        graded: gradedScenarios,
        pending: ungradedScenarios.length
      },
      submittedAt: new Date().toISOString()
    };
  };

  const handleSubmitRecord = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    if (!profile.name.trim() || !profile.email.trim()) {
      setRecordStatus('error');
      setStatusMessage('請先填寫姓名與 Email。');
      return;
    }

    if (!profile.consent) {
      setRecordStatus('error');
      setStatusMessage('提交前請勾選同意分享成績。');
      return;
    }

    setRecordStatus('saving');
    setStatusMessage(null);
    setSheetLink(null);

    try {
      const payload = buildRecordPayload();
      const response = await googleSheetsRecordManager.save(payload);
      setRecordStatus('success');
      setStatusMessage(response.message ?? '成績已送出');
      if (response.sheetUrl) {
        setSheetLink(response.sheetUrl);
      }
    } catch (error) {
      setRecordStatus('error');
      setStatusMessage(error instanceof Error ? error.message : '上傳失敗，請稍後再試。');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            評測完成！
          </h1>
          <p className="text-gray-600">以下是你的軟體工程能力分析結果</p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-8 print:hidden flex-wrap">
          {ungradedScenarios.length > 0 && (
            <button
              onClick={() => {
                setShowGrading(!showGrading);
                setShowAnswerReview(false);
              }}
              className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              📝 情境題評分 ({ungradedScenarios.length} 題未評)
            </button>
          )}
          <button
            onClick={() => {
              setShowAnswerReview(!showAnswerReview);
              setShowGrading(false);
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            💡 查看答案解析
          </button>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            🔄 重新評測
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            🖨️ 列印結果
          </button>
        </div>

        {/* Record Submission */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">成績紀錄與雲端備份</h2>
            <p className="text-gray-600 text-sm">
              填寫聯絡資訊即可將此次評測結果寫入 Google Sheets，方便後續追蹤或與團隊分享。
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmitRecord}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(event) => handleProfileChange('name', event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="王後端"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(event) => handleProfileChange('email', event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="backend@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公司 / 團隊</label>
                <input
                  type="text"
                  value={profile.organization ?? ''}
                  onChange={(event) => handleProfileChange('organization', event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="DevOps Guild"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">職稱 / 角色</label>
                <input
                  type="text"
                  value={profile.role ?? ''}
                  onChange={(event) => handleProfileChange('role', event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Backend Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">經驗年份</label>
                <input
                  type="text"
                  value={profile.experience ?? ''}
                  onChange={(event) => handleProfileChange('experience', event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5 年"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">備註</label>
                <input
                  type="text"
                  value={profile.notes ?? ''}
                  onChange={(event) => handleProfileChange('notes', event.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="可加上自評或回饋"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={profile.consent}
                onChange={(event) => handleConsentChange(event.target.checked)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                我同意將本次測驗結果與聯絡資訊寫入 Google Sheets，僅供內部審查與能力追蹤使用。
              </span>
            </label>

            {statusMessage && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  recordStatus === 'success'
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : 'border-red-200 bg-red-50 text-red-800'
                }`}
              >
                {statusMessage}
                {sheetLink && recordStatus === 'success' && (
                  <a
                    href={sheetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 font-medium text-green-700 underline"
                  >
                    查看試算表 →
                  </a>
                )}
              </div>
            )}

            {hasAttemptedSubmit && (!profile.name.trim() || !profile.email.trim()) && (
              <p className="text-sm text-red-600">請填寫必填欄位並重新提交。</p>
            )}

            <button
              type="submit"
              disabled={recordStatus === 'saving'}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {recordStatus === 'saving' ? '上傳中...' : '📤 上傳成績到 Google Sheets'}
            </button>
          </form>
        </div>

        {/* Answer Review Section */}
        {showAnswerReview && (
          <div className="mb-8">
            <AnswerReview />
          </div>
        )}

        {/* Scenario Grading Section */}
        {showGrading && (
          <div className="mb-8">
            <ScenarioGrading />
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score Summary */}
          <ScoreSummary result={result} />

          {/* Radar Chart */}
          <RadarChart result={result} />
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">詳細分析</h2>
          
          <div className="space-y-6">
            {quadrants.map((quadrant) => {
              const score = result.scores[quadrant.key];
              const maxScore = result.maxScores[quadrant.key];
              const percentage = result.percentages[quadrant.key];
              
              return (
                <div key={quadrant.key} className="border-l-4 pl-4" style={{ borderColor: quadrant.color }}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: quadrant.color }}>
                    {quadrant.name} ({score.toFixed(2)}/{maxScore.toFixed(2)})
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {quadrant.description}
                  </p>
                  <div className="text-sm text-gray-600">
                    {percentage >= 80 && '✅ 優秀：展現出色的專業能力，各方面表現優異。'}
                    {percentage >= 60 && percentage < 80 && '✔️ 良好：具備良好基礎，建議持續深化相關領域知識。'}
                    {percentage >= 40 && percentage < 60 && '⚡ 中等：有一定基礎，建議加強學習與實作經驗。'}
                    {percentage < 40 && '⚠️ 需加強：建議系統性學習此維度的核心概念與最佳實踐。'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note about Scenario Questions */}
        {ungradedScenarios.length > 0 ? (
          <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <h3 className="font-semibold text-amber-900 mb-2">⚠️ 尚有情境題未評分</h3>
            <p className="text-sm text-amber-800 mb-2">
              還有 {ungradedScenarios.length} 道情境題尚未評分，目前結果不包含這些題目的分數。
            </p>
            <button
              onClick={() => setShowGrading(true)}
              className="text-sm text-amber-900 underline hover:text-amber-700"
            >
              點擊這裡進行評分 →
            </button>
          </div>
        ) : (
          <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h3 className="font-semibold text-green-900 mb-2">✅ 所有題目已評分完成</h3>
            <p className="text-sm text-green-800">
              包含情境題在內的所有題目都已評分，以上為完整的評測結果。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
