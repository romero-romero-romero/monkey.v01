import numpy as np
import pandas as pd
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv('dataset_numerico.csv')

class SVMAnalyzer:
    def __init__(self):
        self.feature_columns = [
            'income', 'education', 'employment',  # Socioeconómica
            'sleep', 'appetite', 'energy',        # Conductual
            'mood', 'interest', 'anxiety',        # Psicológica
            'relationships', 'support', 'isolation' # Social
        ]
        
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('categorical', OneHotEncoder(drop=None, sparse_output=False), 
                 self.feature_columns)
            ]
        )
        
        self.pipeline = Pipeline([
            ('preprocessor', self.preprocessor),
            ('scaler', StandardScaler()),
            ('svm', SVC(kernel='linear', probability=True, random_state=42))
        ])
    
    def calculate_depression_score(self, data):
        """
        Calcula un score de depresión basado en múltiples indicadores
        """
        psychological_weight = 0.4
        behavioral_weight = 0.3
        social_weight = 0.2
        socioeconomic_weight = 0.1
        
        psychological_score = data[['mood', 'interest', 'anxiety']].mean(axis=1)
        behavioral_score = data[['sleep', 'appetite', 'energy']].mean(axis=1)
        social_score = data[['relationships', 'support', 'isolation']].mean(axis=1)
        socioeconomic_score = data[['income', 'education', 'employment']].mean(axis=1)
        
        final_score = (psychological_score * psychological_weight +
                      behavioral_score * behavioral_weight +
                      social_score * social_weight +
                      socioeconomic_score * socioeconomic_weight)
        
        return (final_score > final_score.mean()).astype(int)
    
    def extract_feature_weights(self):
        """
        Extrae y procesa los pesos del modelo SVM con normalización mejorada
        """
        svm_model = self.pipeline.named_steps['svm']
        feature_weights = {}
        
        coefficients = svm_model.coef_[0]
        current_pos = 0
        
        for feature in self.feature_columns:
            feature_coeffs = coefficients[current_pos:current_pos + 4]
            
            min_coeff = np.min(feature_coeffs)
            max_coeff = np.max(feature_coeffs)
            range_coeff = max_coeff - min_coeff
            
            if range_coeff != 0:
                normalized_weights = -0.4 + ((feature_coeffs - min_coeff) / range_coeff) * 0.9
            else:
                normalized_weights = np.zeros_like(feature_coeffs)
            
            mean_weight = np.mean(normalized_weights)
            normalized_weights = normalized_weights - mean_weight
            
            feature_weights[feature] = normalized_weights.tolist()
            current_pos += 4
            
        return feature_weights
    
    def fit_and_analyze(self, X, y):
        """
        Entrena el modelo y realiza el análisis completo
        """
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
    
        print("Entrenando modelo SVM...")
        self.pipeline.fit(X_train, y_train)
        
        print("\nEvaluando el modelo...")
        y_pred = self.pipeline.predict(X_test)
        
        print("\nReporte de clasificación:")
        print(classification_report(y_test, y_pred))
        
        print("\nExtrayendo pesos de características...")
        weights = self.extract_feature_weights()
        
        return weights, (X_test, y_test, y_pred)

analyzer = SVMAnalyzer()

X = df[analyzer.feature_columns]
y = analyzer.calculate_depression_score(df)

print("Iniciando análisis SVM...")
weights, (X_test, y_test, y_pred) = analyzer.fit_and_analyze(X, y)

results_df = pd.DataFrame({
    'Feature': list(weights.keys()),
    'Weights': [weights[f] for f in weights.keys()]
})

results_df.to_csv('svm_weights_results.csv', index=False)

print("\nMatriz de pesos por característica:")
for feature, weight in weights.items():
    print(f"{feature:12} | {[round(w, 2) for w in weight]}")

feature_importance = {feature: np.max(np.abs(weights[feature])) 
                     for feature in weights.keys()}

print("\nImportancia relativa de características:")
sorted_features = sorted(feature_importance.items(), 
                        key=lambda x: x[1], 
                        reverse=True)

for feature, importance in sorted_features:
    print(f"{feature:12} | {importance:.2f}")