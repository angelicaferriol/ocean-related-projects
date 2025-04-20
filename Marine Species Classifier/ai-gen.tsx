import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';

// Define possible classification results for simulation
const marineSpecies: string[] = [
  'Clownfish (Amphiprioninae)',
  'Blue Tang (Paracanthurus hepatus)',
  'Emperor Angelfish (Pomacanthus imperator)',
  'Brain Coral (Lobophyllia hemprichii)',
  'Staghorn Coral (Acropora cervicornis)',
  'Sea Turtle (Chelonioidea)',
  'Moorish Idol (Zanclus cornutus)',
  'Giant Clam (Tridacna gigas)'
];

// Helper function to simulate asynchronous classification
const simulateClassification = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay and processing time
    const delay = 1500 + Math.random() * 1000; // Simulate 1.5 - 2.5 seconds delay
    console.log(`Simulating classification for ${file.name} with ${delay.toFixed(0)}ms delay...`);

    setTimeout(() => {
      // Basic check (in a real scenario, more robust checks are needed)
      if (!file.type.startsWith('image/')) {
        console.error('Simulation rejection: Invalid file type.');
        reject('Invalid file type provided for simulation.');
        return;
      }
      // Simulate successful classification by randomly picking a species
      const randomIndex = Math.floor(Math.random() * marineSpecies.length);
      console.log(`Simulation success: Classified as ${marineSpecies[randomIndex]}`);
      resolve(marineSpecies[randomIndex]);
    }, delay);
  });
};

const MarineSpeciesClassifier: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Effect for cleaning up the object URL
  useEffect(() => {
    // This function will be called when the component unmounts or before the effect runs again if previewUrl changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        console.log('Revoked object URL:', previewUrl);
      }
    };
  }, [previewUrl]); // Depend on previewUrl

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null); // Clear previous errors
    setClassificationResult(null); // Clear previous results
    const file = event.target.files?.[0]; // Get the first selected file

    if (file) {
      // Basic validation for image type
      if (!file.type.startsWith('image/')) {
          setError('Please select a valid image file (e.g., JPG, PNG, GIF).');
          setSelectedFile(null);
          setPreviewUrl(null); // Ensure no old preview is shown
           // Clear the file input value so the user can select the same file again if needed after an error
          if (event.target) {
              event.target.value = '';
          }
          console.warn('Invalid file type selected:', file.type);
          return;
      }

       setSelectedFile(file);
       console.log('File selected:', file.name, file.type);

       // Create a new object URL for preview
       const newPreviewUrl = URL.createObjectURL(file);
       console.log('Created object URL:', newPreviewUrl);

       // Clean up the previous object URL before setting the new one
       if (previewUrl) {
         URL.revokeObjectURL(previewUrl);
         console.log('Revoked previous object URL:', previewUrl);
       }
       setPreviewUrl(newPreviewUrl);

    } else {
        // No file selected or selection cancelled
        setSelectedFile(null);
        if (previewUrl) {
           URL.revokeObjectURL(previewUrl);
           console.log('Revoked object URL on file deselection:', previewUrl);
        }
        setPreviewUrl(null);
        console.log('File selection cancelled or cleared.');
    }
  };

  // Handler for the classification button click
  const handleClassify = useCallback(async () => {
    if (!selectedFile) {
      setError('Please select an image file first.');
      console.warn('Classification attempted without a selected file.');
      return;
    }

    setIsLoading(true);
    setError(null); // Clear previous errors
    setClassificationResult(null); // Clear previous results
    console.log('Starting classification process...');

    try {
      // Call the simulated classification function
      const result = await simulateClassification(selectedFile);
      setClassificationResult(result);
    } catch (err: any) {
      // Handle errors from the simulation
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('Classification failed:', errorMessage);
    } finally {
      // Ensure loading state is turned off regardless of success or failure
      setIsLoading(false);
      console.log('Classification process finished.');
    }
  }, [selectedFile, previewUrl]); // Depend on selectedFile

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-6 md:p-8 space-y-6 transition-all duration-300 ease-in-out">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-6">
          Marine Species Classifier
        </h1>

        {/* Image Preview Area */}
        <div className="w-full h-56 sm:h-72 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 mb-4 overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} alt="Selected preview" className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="text-center text-gray-500 p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                 <p className="mt-2 text-sm sm:text-base">Upload an image to see a preview</p>
            </div>
          )}
        </div>

        {/* File Input and Controls Section */}
        <div className="flex flex-col items-center space-y-4">
          {/* Styled File Input Button */}
          <label htmlFor="file-upload" className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-200 ease-in-out focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
            <span>{selectedFile ? 'Change Image' : 'Select Image'}</span>
            <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only" // Hide the default input but make it accessible
                accept="image/png, image/jpeg, image/gif" // Accept common image types
                onChange={handleFileChange}
            />
          </label>

          {/* Display selected file name */}
          {selectedFile && (
             <p className="text-sm text-gray-600 truncate max-w-xs px-2" title={selectedFile.name}>
                Selected: {selectedFile.name}
             </p>
          )}

           {/* Classify Button */}
           <button
             onClick={handleClassify}
             disabled={!selectedFile || isLoading} // Disable if no file or loading
             className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white transition duration-150 ease-in-out ${
                isLoading || !selectedFile
                  ? 'bg-gray-400 cursor-not-allowed' // Disabled state
                  : 'bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500' // Active state
              }`}
            >
              {isLoading ? (
                <>
                  {/* Loading Spinner SVG */}
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Classifying...
                </>
              ) : (
                'Classify Species' // Default button text
              )}
           </button>
        </div>

        {/* Status Messages Area */}
        <div className="mt-6 min-h-[6rem] flex flex-col justify-center items-center">
            {/* Error Display */}
            {error && !isLoading && (
              <div className="w-full p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-center transition-opacity duration-300 ease-in-out">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Result Display */}
            {classificationResult && !isLoading && !error && (
              <div className="w-full p-4 bg-green-100 border border-green-300 rounded-lg text-center transition-opacity duration-300 ease-in-out">
                <p className="text-lg font-semibold text-green-800">Identified Species:</p>
                <p className="text-2xl font-bold text-green-900">{classificationResult}</p>
              </div>
            )}

             {/* Initial/Idle State Message */}
             {!isLoading && !error && !classificationResult && (
                 <p className="text-gray-500 text-sm italic text-center">
                    Upload an image and click "Classify Species".
                 </p>
             )}
        </div>

      </div>
       <p className="text-center text-xs text-gray-600 mt-6">
         Note: Species identification is simulated for demonstration purposes only.
       </p>
    </div>
  );
};

export default MarineSpeciesClassifier;