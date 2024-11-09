// Simplified SVM implementation with pre-trained coefficients
export const analyzeSVMRisk = (answers: { questionId: string; value: number }[]): number => {
  // These would normally be learned from training data
  const weights = {
    income: [-0.3, -0.1, 0.1, 0.3],
    education: [-0.2, -0.1, 0.1, 0.2],
    employment: [-0.2, 0, 0.2, 0.3],
    sleep: [-0.3, 0, 0.2, 0.4],
    appetite: [-0.2, 0, 0.2, 0.3],
    energy: [-0.3, -0.1, 0.2, 0.4],
    mood: [-0.4, -0.1, 0.2, 0.5],
    interest: [-0.3, 0.1, 0.3, 0.4],
    anxiety: [-0.4, 0, 0.3, 0.5],
    relationships: [-0.3, -0.1, 0.2, 0.4],
    support: [-0.3, 0, 0.2, 0.4],
    isolation: [-0.4, 0, 0.3, 0.5]
  };

  const bias = -0.2; // Bias term

  // Calculate weighted sum
  let sum = bias;
  for (const answer of answers) {
    const questionWeights = weights[answer.questionId as keyof typeof weights];
    if (questionWeights) {
      sum += questionWeights[answer.value];
    }
  }

  // Apply sigmoid function to get probability
  const probability = 1 / (1 + Math.exp(-sum));
  return Math.min(Math.max(probability, 0), 1);
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