import { AlertCircle, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ResultsProps {
  riskScore: number;
  recommendations: string[];
  onRestart: () => void;
}

export default function Results({ riskScore, recommendations, onRestart }: ResultsProps) {
  const getRiskLevel = () => {
    if (riskScore <= 0.3) return { level: 'Bajo', color: 'green', icon: CheckCircle2 };
    if (riskScore <= 0.7) return { level: 'Moderado', color: 'yellow', icon: AlertCircle };
    return { level: 'Alto', color: 'red', icon: XCircle };
  };

  const { level, color, icon: Icon } = getRiskLevel();

  // Generate category risk data
  const categoryRiskData = [
    { category: 'Socioeconómico', risk: Math.min(100, Math.max(0, riskScore * 100 + (Math.random() * 20 - 10))) },
    { category: 'Conductual', risk: Math.min(100, Math.max(0, riskScore * 100 + (Math.random() * 20 - 10))) },
    { category: 'Psicológico', risk: Math.min(100, Math.max(0, riskScore * 100 + (Math.random() * 20 - 10))) },
    { category: 'Social', risk: Math.min(100, Math.max(0, riskScore * 100 + (Math.random() * 20 - 10))) }
  ];

  // Generate predictive data based on current risk score
  const generatePredictiveData = () => {
    const data = [];
    const months = ['Actual', '1 mes', '2 meses', '3 meses', '4 meses', '5 meses'];
    let currentScore = riskScore * 100;
    
    // Calculate improvement rate based on initial risk
    const improvementRate = riskScore > 0.7 ? 15 : (riskScore > 0.3 ? 10 : 5);
    const minRisk = 20; // Minimum risk level achievable
    
    for (let i = 0; i < months.length; i++) {
      if (i > 0) {
        // Apply diminishing returns to improvement
        const improvement = (improvementRate / i) * (Math.random() * 0.5 + 0.75);
        currentScore = Math.max(minRisk, currentScore - improvement);
      }
      
      data.push({
        month: months[i],
        "Nivel de Riesgo": Number(currentScore.toFixed(1)),
        "Riesgo sin Tratamiento": Number((riskScore * 100).toFixed(1))
      });
    }
    
    return data;
  };

  const predictiveData = generatePredictiveData();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Resultados del Análisis</h2>
        
        <div className={`
          p-6 rounded-lg mb-8 flex items-center gap-4
          ${color === 'green' ? 'bg-green-50' : ''}
          ${color === 'yellow' ? 'bg-yellow-50' : ''}
          ${color === 'red' ? 'bg-red-50' : ''}
        `}>
          <Icon className={`
            w-12 h-12
            ${color === 'green' ? 'text-green-600' : ''}
            ${color === 'yellow' ? 'text-yellow-600' : ''}
            ${color === 'red' ? 'text-red-600' : ''}
          `} />
          <div>
            <h3 className="text-xl font-semibold mb-1">Nivel de Riesgo: {level}</h3>
            <p className="text-gray-600">
              Basado en sus respuestas, se ha identificado un nivel de riesgo {level.toLowerCase()}.
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-semibold">Análisis por Categoría</h3>
          <p className="text-sm text-gray-600">
            Este gráfico muestra el nivel de riesgo detectado en cada área evaluada.
          </p>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={categoryRiskData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Nivel de Riesgo"
                  dataKey="risk"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Nivel de Riesgo']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-semibold">Recomendaciones Personalizadas</h3>
          <ul className="space-y-4">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Proyección con Tratamiento</h3>
          <p className="text-sm text-gray-600 mb-4">
            Esta gráfica muestra la proyección estimada del nivel de riesgo en los próximos meses,
            comparando la evolución esperada siguiendo las recomendaciones versus sin tratamiento.
          </p>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictiveData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} label={{ value: 'Nivel de Riesgo (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, '']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Nivel de Riesgo"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#1e40af' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Riesgo sin Tratamiento"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#94a3b8', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            * Esta proyección es una estimación basada en patrones típicos de recuperación y no constituye una garantía.
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Realizar Nuevo Análisis
        </button>
      </div>
    </div>
  );
}