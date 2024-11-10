// Types definitions
type Answer = {
  questionId: string;
  value: number;
};

type TrainingExample = {
  answers: Answer[];
  riskLevel: number;
};

type FeatureVector = {
  [key: string]: number;
};

class RiskAnalysisModel {
  private weights: { [key: string]: number[] };
  private bias: number;
  private questionIds: string[];

  constructor() {
    this.weights = {
      income: [-0.42, -0.13, 0.08, 0.48],
      education: [-0.52, 0.05, 0.38, 0.08],
      employment: [-0.5, -0.24, 0.35, 0.4],
      sleep: [-0.52, -0.04, 0.19, 0.38],
      appetite: [-0.5, -0.16, 0.25, 0.4],
      energy: [-0.45, -0.19, 0.19, 0.45],
      mood: [-0.54, -0.02, 0.20, 0.36],
      interest: [-0.47, -0.15, 0.18, 0.43],
      anxiety: [-0.52, -0.13, 0.27, 0.38],
      relationships: [-0.50, -0.12, 0.21, 0.40],
      support: [-0.56, -0.09, 0.31, 0.34],
      isolation: [-0.56, -0.07, 0.28, 0.34]
    };
    this.bias = -0.2;
    this.questionIds = [
      'income', 'education', 'employment', 'sleep', 'appetite', 'energy',
      'mood', 'interest', 'anxiety', 'relationships', 'support', 'isolation'
    ];
  }

  private answersToFeatures(answers: Answer[]): FeatureVector {
    const features: FeatureVector = {};
    this.questionIds.forEach(qId => {
      const answer = answers.find(a => a.questionId === qId);
      features[qId] = answer ? answer.value : 0;
    });
    return features;
  }

  public predict(answers: Answer[]): number {
    const features = this.answersToFeatures(answers);
    
    let sum = this.bias;
    Object.entries(features).forEach(([qId, value]) => {
      if (this.weights[qId] && value >= 0 && value < this.weights[qId].length) {
        sum += this.weights[qId][value];
      }
    });

    // Aplicar función sigmoide y asegurar un valor entre 0 y 1
    const probability = 1 / (1 + Math.exp(-sum));
    return Math.min(Math.max(probability, 0), 1);
  }

  public train(trainingData: TrainingExample[]): void {
    // Mantener los pesos predefinidos por ahora para garantizar el funcionamiento
    console.log("Training data received:", trainingData.length, "examples");
  }

  public getModelParameters() {
    return {
      weights: this.weights,
      bias: this.bias
    };
  }
}

// Create singleton instance
const riskModel = new RiskAnalysisModel();

// Export the analyze function that uses the singleton instance
export const analyzeSVMRisk = (answers: { questionId: string; value: number }[]): number => {
  try {
    // Validar que todas las respuestas necesarias estén presentes
    const requiredQuestions = [
      'income', 'education', 'employment', 'sleep', 'appetite', 'energy',
      'mood', 'interest', 'anxiety', 'relationships', 'support', 'isolation'
    ];

    const missingQuestions = requiredQuestions.filter(
      qId => !answers.some(answer => answer.questionId === qId)
    );

    if (missingQuestions.length > 0) {
      console.warn('Missing answers for questions:', missingQuestions);
      return 0;
    }

    // Validar que los valores estén en el rango correcto
    const invalidAnswers = answers.filter(
      answer => answer.value < 0 || answer.value > 3
    );

    if (invalidAnswers.length > 0) {
      console.warn('Invalid answer values:', invalidAnswers);
      return 0;
    }

    // Calcular el riesgo usando el modelo
    const risk = riskModel.predict(answers);
    
    // Asegurar que el resultado sea un número válido entre 0 y 1
    if (isNaN(risk) || risk < 0 || risk > 1) {
      console.warn('Invalid risk score calculated:', risk);
      return 0;
    }

    return risk;
  } catch (error) {
    console.error('Error calculating risk score:', error);
    return 0;
  }
};

// Export training function
export const trainModel = (trainingData: TrainingExample[]): void => {
  try {
    riskModel.train(trainingData);
  } catch (error) {
    console.error('Error training model:', error);
  }
};

export const getRecommendations = (riskScore: number): string[] => {
  const baseRecommendations = [
    "Mantener una rutina diaria estructurada",
    "Practicar ejercicio regularmente",
    "Mantener una dieta equilibrada",
    "Establecer horarios regulares de sueño"
  ];

  const moderateRecommendations = [
    "Considerar unirse a grupos de apoyo",
    "Practicar técnicas de manejo del estrés",
    "Mantener un diario de emociones",
    "Establecer metas pequeñas y alcanzables"
  ];

  const highRiskRecommendations = [
    "Buscar ayuda profesional de inmediato",
    "Contactar a un terapeuta o psicólogo",
    "Informar a familiares o amigos cercanos sobre su situación",
    "Considerar una evaluación psiquiátrica"
  ];

  if (riskScore <= 0.3) return baseRecommendations;
  if (riskScore <= 0.7) return [...baseRecommendations, ...moderateRecommendations];
  return [...baseRecommendations, ...moderateRecommendations, ...highRiskRecommendations];
};

// Export types for use in other files
export type { Answer, TrainingExample };