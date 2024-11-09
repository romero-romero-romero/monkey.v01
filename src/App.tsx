import React from 'react';
import QuestionnaireForm from './components/QuestionnaireForm';
import Results from './components/Results';
import { Brain } from 'lucide-react';
import { analyzeSVMRisk, getRecommendations } from './utils/svm';

function App() {
  const [showResults, setShowResults] = React.useState(false);
  const [riskScore, setRiskScore] = React.useState(0);
  const [recommendations, setRecommendations] = React.useState<string[]>([]);

  const handleSubmit = (answers: { questionId: string; value: number }[]) => {
    const score = analyzeSVMRisk(answers);
    setRiskScore(score);
    setRecommendations(getRecommendations(score));
    setShowResults(true);
  };

  const handleRestart = () => {
    setShowResults(false);
    setRiskScore(0);
    setRecommendations([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Análisis de Riesgo de Depresión
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!showResults ? (
          <>
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Complete el siguiente cuestionario para evaluar factores socioeconómicos, 
                conductuales y psicológicos relacionados con el riesgo de depresión.
              </p>
            </div>
            <QuestionnaireForm onSubmit={handleSubmit} />
          </>
        ) : (
          <Results 
            riskScore={riskScore}
            recommendations={recommendations}
            onRestart={handleRestart}
          />
        )}

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            Este análisis es una herramienta de evaluación preliminar y no sustituye 
            el diagnóstico profesional. Si experimenta síntomas de depresión, busque 
            ayuda profesional.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;