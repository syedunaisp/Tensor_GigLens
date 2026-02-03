export interface DataPoint {
    id: string;
    features: number[]; // [margin, liquidity, growth, stability]
}

export interface ClusterResult {
    centroids: number[][];
    assignments: { [id: string]: number };
}

export function kMeans(data: DataPoint[], k: number, maxIterations = 100): ClusterResult {
    if (data.length === 0) return { centroids: [], assignments: {} };

    // Initialize centroids randomly
    let centroids = data.slice(0, k).map(d => [...d.features]);

    // If less data than k, just use what we have
    if (centroids.length < k) {
        // Fill remaining with random existing points or zeros
        // For simplicity, just return what we have
    }

    let assignments: { [id: string]: number } = {};
    let iterations = 0;

    while (iterations < maxIterations) {
        let changed = false;

        // Assign points to nearest centroid
        for (const point of data) {
            let minDist = Infinity;
            let clusterIndex = -1;

            for (let i = 0; i < centroids.length; i++) {
                const dist = euclideanDistance(point.features, centroids[i]);
                if (dist < minDist) {
                    minDist = dist;
                    clusterIndex = i;
                }
            }

            if (assignments[point.id] !== clusterIndex) {
                assignments[point.id] = clusterIndex;
                changed = true;
            }
        }

        // Update centroids
        const newCentroids = Array(k).fill(0).map(() => Array(data[0].features.length).fill(0));
        const counts = Array(k).fill(0);

        for (const point of data) {
            const cluster = assignments[point.id];
            for (let i = 0; i < point.features.length; i++) {
                newCentroids[cluster][i] += point.features[i];
            }
            counts[cluster]++;
        }

        for (let i = 0; i < k; i++) {
            if (counts[i] > 0) {
                for (let j = 0; j < newCentroids[i].length; j++) {
                    centroids[i][j] = newCentroids[i][j] / counts[i];
                }
            }
        }

        if (!changed) break;
        iterations++;
    }

    return { centroids, assignments };
}

function euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

export const SEGMENT_NAMES = [
    "Stable Compounding Earners",
    "High-Growth, Cash-Tight Strivers",
    "Low-Earning High-Risk Workers",
    "Under-utilized but Safe"
];
