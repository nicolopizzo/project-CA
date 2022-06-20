import { Position } from '../models/position.model';

interface Cluster {
  data: Position[];
  centroid: Position;
}

class PrivacyService {
  spatialCloaking(positions: Position[]) {
    const clusters = this.elbowMethod(positions);
    return clusters.map((c) => ({
      centroid: c.centroid,
      data: c.data.length,
    }));
  }
  elbowMethod(positions: Position[]): Cluster[] {
    const maxK = 10;
    const minK = 2;

    let memo = [];
    for (let k = minK; k <= maxK; k++) {
      const model = this.kMeansWithError(positions, k);
      const distorions = model.map((c) => this.distortion(c));
      const d = distorions.reduce((acc, curr) => acc + curr, 0) / k;
      memo.push({ d, model });
    }

    const eps = 0.1;
    let k = minK;
    for (let i = 0; i < memo.length; i++) {
      if (memo[i].d - memo[i + 1].d < eps) {
        return memo[i].model;
      }
    }

    return memo[memo.length - 1].model;
  }

  //compute the distortion of a cluster
  distortion(cluster: Cluster): number {
    const { data } = cluster;
    let res = 0;
    for (let i = 0; i < data.length; i++) {
      const d = this.distance(data[i], cluster.centroid) / 1000; // in km
      res += Math.pow(d, 2);
    }

    return res;
  }

  kMeansWithError(positions: Position[], k: number) {
    const maxError = 0.3;
    let clusters = this.kMeans(positions, k);

    // Massimo 20 try
    for (let i = 0; i < 10; i++) {
      clusters = this.kMeans(positions, k);

      let error = 0;
      for (let i = 0; i < clusters.length; i++) {
        error += this.distortion(clusters[i]);
      }

      if (error <= maxError) {
        return clusters;
      }
    }

    return clusters;
  }

  kMeans(positions: Position[], k: number): Cluster[] {
    let clusters: Cluster[] = [];
    let root = Array(positions.length).fill(0);

    for (let i = 0; i < k; i++) {
      clusters.push({
        data: [],
        centroid: { latitude: 0, longitude: 0 },
      });
    }

    // Random initialization of clusters
    for (let i = 0; i < positions.length; i++) {
      const index = Math.floor(Math.random() * k);
      clusters[index].data.push(positions[i]);
      root[i] = index;
    }

    let changes = 0;
    do {
      changes = 0;

      // Calculate centroids
      for (let i = 0; i < k; i++) {
        const c = this.centroid(clusters[i]);

        clusters[i].centroid = c;
      }

      // Assign points to clusters
      let closest;
      for (let i = 0; i < positions.length; i++) {
        // Find current containing cluster
        const containingCluster: Cluster = clusters[root[i]];
        const index = containingCluster.data.indexOf(positions[i]);

        if (index > -1) {
          containingCluster.data.splice(index, 1);
        }

        closest = this.closest(positions[i], clusters);
        closest.data.push(positions[i]);

        const newIndex = clusters.indexOf(closest);

        if (newIndex !== root[i]) {
          changes++;
          root[i] = newIndex;
        }
      }
    } while (changes > 0);

    return clusters;
  }

  centroid(cluster: Cluster): Position {
    const { data } = cluster;
    const { latitude, longitude } = data.reduce(
      (acc, curr) => {
        acc.latitude += curr.latitude;
        acc.longitude += curr.longitude;
        return acc;
      },
      { latitude: 0, longitude: 0 }
    );

    return {
      latitude: latitude / data.length,
      longitude: longitude / data.length,
    };
  }

  closest(point: Position, clusters: Cluster[]): Cluster {
    let minDistance = Number.MAX_VALUE;
    let closestCluster: Cluster = clusters[0];

    for (let i = 0; i < clusters.length; i++) {
      const distance = this.distance(point, clusters[i].centroid);
      if (distance < minDistance) {
        minDistance = distance;
        closestCluster = clusters[i];
      }
    }

    return closestCluster;
  }

  distance(p1: Position, p2: Position): number {
    //haversine distance

    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(p2.latitude - p1.latitude); // deg2rad below
    const dLon = this.deg2rad(p2.longitude - p1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(p1.latitude)) *
        Math.cos(this.deg2rad(p2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const privacyService = new PrivacyService();
