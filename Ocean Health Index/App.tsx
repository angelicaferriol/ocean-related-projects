import React, { useState, useMemo } from 'react';

// Define the structure for a single ocean data record
interface OceanDataRecord {
  id: number; // Added an ID for React keys
  Location: string;
  Date: string;
  pH: number;
  'SST (°C)': number; // Sea Surface Temperature
  'Species Observed': number; // Biodiversity indicator
}

// Define the structure for weights
interface ScoreWeights {
  pH: number;
  sst: number;
  biodiversity: number;
}

// Sample data mimicking the structure of the CSV
// In a real application, this data would be fetched or loaded.
const sampleOceanData: OceanDataRecord[] = [
  { id: 1, Location: 'Great Barrier Reef', Date: '2024-01-15', pH: 8.05, 'SST (°C)': 28.5, 'Species Observed': 45 },
  { id: 2, Location: 'California Coast', Date: '2024-01-15', pH: 7.9, 'SST (°C)': 14.2, 'Species Observed': 30 },
  { id: 3, Location: 'Arctic Ocean', Date: '2024-01-15', pH: 8.15, 'SST (°C)': 1.5, 'Species Observed': 15 },
  { id: 4, Location: 'Mediterranean Sea', Date: '2024-01-15', pH: 8.0, 'SST (°C)': 19.8, 'Species Observed': 25 },
  { id: 5, Location: 'Coral Triangle', Date: '2024-01-15', pH: 8.1, 'SST (°C)': 29.1, 'Species Observed': 55 },
  { id: 6, Location: 'North Atlantic', Date: '2024-01-15', pH: 7.95, 'SST (°C)': 16.5, 'Species Observed': 35 },
   { id: 7, Location: 'Kelp Forest Zone', Date: '2024-01-15', pH: 8.08, 'SST (°C)': 15.5, 'Species Observed': 40 },
   { id: 8, Location: 'Hydrothermal Vent', Date: '2024-01-15', pH: 7.6, 'SST (°C)': 35.0, 'Species Observed': 10 }, // Example of stressful conditions
];

// --- Scoring Configuration ---
const OPTIMAL_PH = 8.1;
const MAX_PH_DEVIATION = 0.5; // Score drops to 0 if pH deviates by this much or more
const OPTIMAL_SST_MIN = 15;
const OPTIMAL_SST_MAX = 25;
const MAX_SST_DEVIATION = 5; // Score drops to 0 if SST is this much outside the optimal range
const MAX_EXPECTED_SPECIES = 60; // Max observed species for normalization (adjust based on real data)

// Normalization Functions (0-100 scale)
const normalizePh = (pH: number): number => {
  const deviation = Math.abs(pH - OPTIMAL_PH);
  const score = 100 * Math.max(0, 1 - deviation / MAX_PH_DEVIATION);
  return Math.round(score);
};

const normalizeSst = (sst: number): number => {
  let score: number;
  if (sst >= OPTIMAL_SST_MIN && sst <= OPTIMAL_SST_MAX) {
    score = 100;
  } else if (sst < OPTIMAL_SST_MIN) {
    const deviation = OPTIMAL_SST_MIN - sst;
    score = 100 * Math.max(0, 1 - deviation / MAX_SST_DEVIATION);
  } else { // sst > OPTIMAL_SST_MAX
    const deviation = sst - OPTIMAL_SST_MAX;
    score = 100 * Math.max(0, 1 - deviation / MAX_SST_DEVIATION);
  }
  return Math.round(score);
};

const normalizeBiodiversity = (speciesCount: number): number => {
  const score = (speciesCount / MAX_EXPECTED_SPECIES) * 100;
  return Math.round(Math.min(100, Math.max(0, score))); // Clamp between 0 and 100
};

// Classification Function
type HealthStatus = "Healthy" | "Moderate" | "Poor" | "Critical";

const getClassification = (score: number): HealthStatus => {
  if (score >= 80) return "Healthy";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Poor";
  return "Critical";
};

const getClassificationStyles = (status: HealthStatus): string => {
    switch (status) {
        case "Healthy":
            return "bg-green-100 text-green-800 border-green-300";
        case "Moderate":
            return "bg-yellow-100 text-yellow-800 border-yellow-300";
        case "Poor":
            return "bg-orange-100 text-orange-800 border-orange-300";
        case "Critical":
            return "bg-red-100 text-red-800 border-red-300";
        default:
            return "bg-gray-100 text-gray-800 border-gray-300";
    }
}

// React Component
const OceanHealthDashboard: React.FC = () => {
  const [data] = useState<OceanDataRecord[]>(sampleOceanData);
  const [weights, setWeights] = useState<ScoreWeights>({
    pH: 0.333,
    sst: 0.333,
    biodiversity: 0.334, // Ensure weights sum ~1
  });

  // Memoize calculations for performance
  const scoredData = useMemo(() => {
    return data.map(record => {
      const normPh = normalizePh(record.pH);
      const normSst = normalizeSst(record['SST (°C)']);
      const normBio = normalizeBiodiversity(record['Species Observed']);

      const overallScore = Math.round(
        normPh * weights.pH +
        normSst * weights.sst +
        normBio * weights.biodiversity
      );

      const classification = getClassification(overallScore);

      return {
        ...record,
        normPh,
        normSst,
        normBio,
        overallScore,
        classification,
      };
    });
  }, [data, weights]);

   // Handler for weight change (simple example, could use sliders)
  const handleWeightChange = (factor: keyof ScoreWeights, value: number) => {
      // Basic validation/normalization (ensure weights sum roughly to 1)
      // This is a simple approach; a more robust solution might redistribute weights.
      const otherWeightsSum = 1 - value;
      const remainingFactors = Object.keys(weights).filter(k => k !== factor) as (keyof ScoreWeights)[];

      setWeights(prev => {
          const newWeights = { ...prev, [factor]: value };
          // Distribute remaining weight - simple equal distribution
          if (remainingFactors.length > 0) {
              const distributedWeight = otherWeightsSum / remainingFactors.length;
              remainingFactors.forEach(remFactor => {
                  newWeights[remFactor] = distributedWeight;
              });
          }
          // Normalize to ensure sum is exactly 1 (optional, handles potential floating point issues)
          const sum = Object.values(newWeights).reduce((acc, w) => acc + w, 0);
          if (sum !== 1) {
            Object.keys(newWeights).forEach(key => {
                newWeights[key as keyof ScoreWeights] = newWeights[key as keyof ScoreWeights] / sum;
            });
          }

          return newWeights;
      });
  };


  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen font-sans">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Ocean Health Index Dashboard</h1>

       {/* Weight Adjustment Section - Example */}
       <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-blue-100">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Adjust Score Weights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {Object.keys(weights).map(key => (
                    <div key={key} className="flex flex-col">
                        <label htmlFor={`weight-${key}`} className="text-sm font-medium text-gray-600 mb-1 capitalize">
                            {key} ({(weights[key as keyof ScoreWeights] * 100).toFixed(1)}%)
                        </label>
                        <input
                            id={`weight-${key}`}
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={weights[key as keyof ScoreWeights]}
                            onChange={(e) => handleWeightChange(key as keyof ScoreWeights, parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                ))}
            </div>
             <p className="text-xs text-gray-500 mt-2 text-center italic">Adjusting one weight will proportionally adjust others to maintain a sum of 100%.</p>
        </div>


      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="w-full text-left table-auto border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider border-b-2 border-blue-700">Location</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider border-b-2 border-blue-700 text-center">pH</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider border-b-2 border-blue-700 text-center">SST (°C)</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider border-b-2 border-blue-700 text-center">Species</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider border-b-2 border-blue-700 text-center" title="Normalized pH Score (0-100)">pH Score</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider border-b-2 border-blue-700 text-center" title="Normalized SST Score (0-100)">SST Score</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider border-b-2 border-blue-700 text-center" title="Normalized Biodiversity Score (0-100)">Bio. Score</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider border-b-2 border-blue-700 text-center">Overall Score</th>
              <th className="px-4 py-3 font-semibold uppercase tracking-wider border-b-2 border-blue-700 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {scoredData.map((record, index) => (
              <tr key={record.id} className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-4 py-3 border-b border-gray-200">{record.Location}</td>
                <td className="px-4 py-3 border-b border-gray-200 text-center">{record.pH.toFixed(2)}</td>
                <td className="px-4 py-3 border-b border-gray-200 text-center">{record['SST (°C)'].toFixed(1)}</td>
                <td className="px-4 py-3 border-b border-gray-200 text-center">{record['Species Observed']}</td>
                <td className="px-4 py-3 border-b border-gray-200 text-center">{record.normPh}</td>
                <td className="px-4 py-3 border-b border-gray-200 text-center">{record.normSst}</td>
                <td className="px-4 py-3 border-b border-gray-200 text-center">{record.normBio}</td>
                <td className="px-4 py-3 border-b border-gray-200 text-center font-semibold text-blue-700">{record.overallScore}</td>
                <td className={`px-4 py-3 border-b border-gray-200 text-center`}>
                   <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getClassificationStyles(record.classification)}`}>
                     {record.classification}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md border border-blue-100">
             <h3 className="text-lg font-semibold text-gray-700 mb-2">Scoring Legend</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                 <div className="flex items-center space-x-2">
                     <span className={`w-4 h-4 rounded-full ${getClassificationStyles('Healthy')} border`}></span>
                     <span className="text-sm text-gray-600">Healthy (80-100)</span>
                 </div>
                 <div className="flex items-center space-x-2">
                     <span className={`w-4 h-4 rounded-full ${getClassificationStyles('Moderate')} border`}></span>
                     <span className="text-sm text-gray-600">Moderate (60-79)</span>
                 </div>
                 <div className="flex items-center space-x-2">
                     <span className={`w-4 h-4 rounded-full ${getClassificationStyles('Poor')} border`}></span>
                     <span className="text-sm text-gray-600">Poor (40-59)</span>
                 </div>
                 <div className="flex items-center space-x-2">
                     <span className={`w-4 h-4 rounded-full ${getClassificationStyles('Critical')} border`}></span>
                     <span className="text-sm text-gray-600">Critical (0-39)</span>
                 </div>
             </div>
             <p className="text-xs text-gray-500 mt-3">
                Scores are normalized (0-100) based on predefined optimal ranges:
                pH (Optimal: {OPTIMAL_PH}),
                SST (Optimal: {OPTIMAL_SST_MIN}-{OPTIMAL_SST_MAX}°C),
                Biodiversity (Max Expected: {MAX_EXPECTED_SPECIES} species).
                Overall score is a weighted average.
            </p>
        </div>
    </div>
  );
};

export default OceanHealthDashboard;