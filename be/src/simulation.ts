import { Plane } from './plane';
/**
 * Manages the flight simulation state
 */
export class Simulation {
  private planes: Map<string, Plane> = new Map();

  /**
   * Initialize simulation with specified number of planes
   */
  initialize(planeCount: number) {
    for (let i = 0; i < planeCount; i++) {
      const plane = new Plane(`plane-${i + 1}`);
      this.planes.set(plane.getId(), plane);
    }
  }

  /**
   * Update all planes (called on each tick)
   */
  update() {
    this.planes.forEach(plane => plane.update());
  }

  /**
   * Get all planes as basic data
   */
  getAllBasic() {
    return Array.from(this.planes.values()).map(plane => plane.getBasic());
  }

  /**
   * Get detailed data for a specific plane
   */
  getDetailed(planeId: string) {
    const plane = this.planes.get(planeId);
    return plane ? plane.getDetailed() : null;
  }

  /**
   * Check if a plane exists
   */
  hasPlane(planeId: string) {
    return this.planes.has(planeId);
  }
}
