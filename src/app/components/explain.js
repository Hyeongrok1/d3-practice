async function getFeatureExplain(givenFeatureId) {
    const url = "http://127.0.0.1:6006/api/get-feature-explains";

    try {
        const response = await fetch(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    feature_id: givenFeatureId
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const featureData = await response.json(); 
        
        console.log("Fetched Data:", featureData);
        
        return featureData;

    } catch (error) {
        console.error("Error fetching feature explain:", error);
        return {}; 
    }
}

export default getFeatureExplain;