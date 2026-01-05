/**
 * Interview Page
 *
 * Main page for conducting JTBD interviews.
 */

import { useState } from 'react';
import InterviewChat from '../components/InterviewChat';
import Timeline from '../components/Timeline';
import ForcesVisual from '../components/ForcesVisual';
import DietProfile from '../components/DietProfile';
import InsightsSummary from '../components/InsightsSummary';
import SetupModal from '../components/SetupModal';
import { useInterview } from '../hooks/useInterview';

export function InterviewPage() {
  const [isSetupOpen, setIsSetupOpen] = useState(true);
  const {
    messages,
    interviewData,
    phase,
    isLoading,
    sendMessage,
    startInterview,
    endInterview,
    models,
    selectedModel,
    setSelectedModel
  } = useInterview();

  const handleStartInterview = async (config: { productContext?: string; intervieweeName?: string; model?: string }) => {
    await startInterview(config);
    setIsSetupOpen(false);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>JTBD Interview Agent</h1>
        <p>Bob Moesta-style Jobs to Be Done interviews with AI</p>
        {phase !== 'setup' && (
          <div style={{ marginTop: '12px' }}>
            <span className="badge" style={{ background: '#dbeafe', color: '#2563eb' }}>
              Phase: {phase.replace('_', ' ')}
            </span>
          </div>
        )}
      </header>

      {isSetupOpen ? (
        <SetupModal
          onStart={handleStartInterview}
          models={models}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      ) : (
        <div className="main-content">
          <div className="left-column">
            <InterviewChat
              messages={messages}
              onSendMessage={sendMessage}
              isLoading={isLoading}
              onEndInterview={endInterview}
              phase={phase}
            />
          </div>

          <div className="right-column" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Timeline events={interviewData.timeline} />
            <ForcesVisual forces={interviewData.forces} />
            <DietProfile profile={interviewData.dietProfile} />
            <InsightsSummary
              insights={interviewData.insights}
              quotes={interviewData.verbatimQuotes}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewPage;
