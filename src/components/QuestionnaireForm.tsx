import React from 'react';
import { Brain, Heart, Home, Users } from 'lucide-react';

const categories = [
  {
    id: 'socioeconomica',
    icon: Home,
    questions: [
      { id: 'income', text: '¿Cuál es su nivel de ingresos mensual?', options: ['Menos de $10,000', '$10,000 - $20,000', '$20,000 - $30,000', 'Más de $30,000'] },
      { id: 'education', text: '¿Cuál es su nivel de educación?', options: ['Primaria', 'Secundaria', 'Universidad', 'Posgrado'] },
      { id: 'employment', text: '¿Cuál es su situación laboral actual?', options: ['Empleado tiempo completo', 'Empleado medio tiempo', 'Desempleado', 'Estudiante'] }
    ]
  },
  {
    id: 'conductual',
    icon: Brain,
    questions: [
      { id: 'sleep', text: '¿Cómo describiría sus patrones de sueño?', options: ['Regular y suficiente', 'Irregular', 'Insomnio frecuente', 'Duerme demasiado'] },
      { id: 'appetite', text: '¿Cómo ha estado su apetito?', options: ['Normal', 'Aumentado', 'Disminuido', 'Muy variable'] },
      { id: 'energy', text: '¿Cómo describiría su nivel de energía?', options: ['Alto', 'Normal', 'Bajo', 'Muy bajo'] }
    ]
  },
  {
    id: 'psicologica',
    icon: Heart,
    questions: [
      { id: 'mood', text: '¿Cómo describiría su estado de ánimo general?', options: ['Positivo', 'Neutral', 'Variable', 'Negativo'] },
      { id: 'interest', text: '¿Ha perdido interés en actividades que antes disfrutaba?', options: ['No', 'Ocasionalmente', 'Frecuentemente', 'Siempre'] },
      { id: 'anxiety', text: '¿Con qué frecuencia se siente ansioso?', options: ['Raramente', 'Ocasionalmente', 'Frecuentemente', 'Constantemente'] }
    ]
  },
  {
    id: 'social',
    icon: Users,
    questions: [
      { id: 'relationships', text: '¿Cómo describiría sus relaciones sociales?', options: ['Muy satisfactorias', 'Satisfactorias', 'Regulares', 'Insatisfactorias'] },
      { id: 'support', text: '¿Cuenta con apoyo emocional de familiares o amigos?', options: ['Mucho apoyo', 'Apoyo moderado', 'Poco apoyo', 'Sin apoyo'] },
      { id: 'isolation', text: '¿Con qué frecuencia se siente solo o aislado?', options: ['Raramente', 'Ocasionalmente', 'Frecuentemente', 'Siempre'] }
    ]
  }
];

type Answer = {
  questionId: string;
  value: number;
};

interface QuestionnaireFormProps {
  onSubmit: (answers: Answer[]) => void;
}

export default function QuestionnaireForm({ onSubmit }: QuestionnaireFormProps) {
  const [answers, setAnswers] = React.useState<Answer[]>([]);
  const [currentCategory, setCurrentCategory] = React.useState(0);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing !== -1) {
        const newAnswers = [...prev];
        newAnswers[existing] = { questionId, value };
        return newAnswers;
      }
      return [...prev, { questionId, value }];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(prev => prev + 1);
    } else {
      onSubmit(answers);
    }
  };

  const category = categories[currentCategory];
  const progress = ((currentCategory + 1) / categories.length) * 100;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Sección {currentCategory + 1} de {categories.length}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          {React.createElement(category.icon, { 
            className: "w-6 h-6 text-blue-600" 
          })}
          <h2 className="text-xl font-semibold capitalize">
            Evaluación {category.id}
          </h2>
        </div>

        <div className="space-y-6">
          {category.questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <p className="font-medium">{question.text}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((option, optionIdx) => (
                  <label
                    key={optionIdx}
                    className={`
                      flex items-center p-4 border rounded-lg cursor-pointer transition-all
                      ${answers.find(a => a.questionId === question.id)?.value === optionIdx
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'}
                    `}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={optionIdx}
                      checked={answers.find(a => a.questionId === question.id)?.value === optionIdx}
                      onChange={() => handleAnswer(question.id, optionIdx)}
                      className="hidden"
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        {currentCategory > 0 && (
          <button
            type="button"
            onClick={() => setCurrentCategory(prev => prev - 1)}
            className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Anterior
          </button>
        )}
        <button
          type="submit"
          className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {currentCategory === categories.length - 1 ? 'Finalizar' : 'Siguiente'}
        </button>
      </div>
    </form>
  );
}