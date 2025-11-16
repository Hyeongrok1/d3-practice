export async function get_data() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Hyeongrok1/d3-practice/refs/heads/main/public/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonObject = await response.json();
        console.log(jsonObject);
        return jsonObject;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


export async function get_average_cosine_similarity() {
    const data = await get_data();
    const features = data.features;
    const newFeatures = [];
    console.log(features);
    for (const feature of features) {
        let allSimilarities = [];

        if (feature.explanations === null || feature.explanations === undefined) continue; 
        
        for (const explanation of feature.explanations) {
            for (const similarityPair of explanation.pairwise_semantic_similarity) {
                allSimilarities.push(similarityPair.cosine_similarity);
            }
        }
        if (allSimilarities.length > 0) {
            const sum = allSimilarities.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const average = sum / allSimilarities.length;
            newFeatures.push({
                feature_id: feature.feature_id,
                cosine_average: average
            });
        }
    }

    return {
        sae_id: data.sae_id,
        features: newFeatures
    };
}

export async function get_explains(featureId) {
    const data = await get_data();
    let explanation = null;

    const foundFeature = data.features.find(feature => 
        feature.feature_id === featureId
    );
    
    if (foundFeature) explanation = foundFeature.explanations;
    
    
    if (explanation === null || explanation === undefined) {
        const defaultItem = {
            llm_explainer: "",
            detection: 0,
            embedding: 0,
            fuzz: 0,
            Text: ""
        };
        
        return new Array(3).fill(defaultItem); 
    }

    const transformedData = explanation.map(item => {
        const scores = item.scores || {}; 
        
        return {
            llm_explainer: item.llm_explainer,
            detection: scores.detection || 0, 
            embedding: scores.embedding || 0,
            fuzz: scores.fuzz || 0,
            Text: item.text
        };
    });
    
    return transformedData;
}