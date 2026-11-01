export type Vec3 = [number, number, number];

export const JOINTS = [
  'head', 'neck', 'lShoulder', 'rShoulder', 'lElbow', 'rElbow', 'lHand', 'rHand',
  'pelvis', 'lHip', 'rHip', 'lKnee', 'rKnee', 'lFoot', 'rFoot',
] as const;

export type Joint = (typeof JOINTS)[number];

export interface PoseDef {
  name: string;
  label: string;
  description: string;
  joints: Record<Joint, Vec3>;
}

// Joint positions in metres-ish, standing on y = 0 and facing the camera (+z).
export const poses: PoseDef[] = [
  {
    name: 'Tadasana',
    label: 'Mountain Pose',
    description: 'Stand at the top of your mat with feet grounded and spine long. The foundation of all standing poses.',
    joints: {
      head: [0, 1.66, 0], neck: [0, 1.47, 0],
      lShoulder: [-0.2, 1.42, 0], rShoulder: [0.2, 1.42, 0],
      lElbow: [-0.25, 1.13, 0], rElbow: [0.25, 1.13, 0],
      lHand: [-0.26, 0.85, 0.03], rHand: [0.26, 0.85, 0.03],
      pelvis: [0, 0.94, 0], lHip: [-0.1, 0.9, 0], rHip: [0.1, 0.9, 0],
      lKnee: [-0.1, 0.48, 0.01], rKnee: [0.1, 0.48, 0.01],
      lFoot: [-0.1, 0.05, 0.03], rFoot: [0.1, 0.05, 0.03],
    },
  },
  {
    name: 'Vrksasana',
    label: 'Tree Pose',
    description: 'Balance on one foot with the sole pressed against the inner thigh. Arms reach skyward like branches.',
    joints: {
      head: [0.03, 1.66, 0], neck: [0.03, 1.47, 0],
      lShoulder: [-0.17, 1.44, 0], rShoulder: [0.23, 1.44, 0],
      lElbow: [-0.21, 1.74, 0], rElbow: [0.27, 1.74, 0],
      lHand: [0.02, 2.02, 0], rHand: [0.04, 2.02, 0],
      pelvis: [0.03, 0.94, 0], lHip: [-0.07, 0.91, 0], rHip: [0.12, 0.9, 0],
      lKnee: [-0.44, 0.66, 0.1], rKnee: [0.06, 0.48, 0.01],
      lFoot: [0.03, 0.56, 0.05], rFoot: [0.04, 0.05, 0.03],
    },
  },
  {
    name: 'Trikonasana',
    label: 'Triangle Pose',
    description: 'Extend through the side body with a forward fold and rotating chest. Opens hips and strengthens legs.',
    joints: {
      head: [0.76, 1.15, 0.03], neck: [0.56, 1.12, 0],
      lShoulder: [0.56, 1.27, 0], rShoulder: [0.54, 0.98, 0],
      lElbow: [0.56, 1.57, 0], rElbow: [0.56, 0.7, 0.01],
      lHand: [0.56, 1.87, 0], rHand: [0.58, 0.42, 0.03],
      pelvis: [0.02, 0.87, 0], lHip: [-0.08, 0.84, 0], rHip: [0.1, 0.84, 0],
      lKnee: [-0.36, 0.45, 0], rKnee: [0.38, 0.45, 0],
      lFoot: [-0.64, 0.05, 0], rFoot: [0.66, 0.05, 0.03],
    },
  },
  {
    name: 'Ardha Chandrasana',
    label: 'Half Moon Pose',
    description: 'Lift the back leg parallel to the floor while the standing leg remains strong. Core and focus are key.',
    joints: {
      head: [0.82, 1.05, 0.03], neck: [0.62, 1.03, 0],
      lShoulder: [0.6, 1.17, 0], rShoulder: [0.6, 0.89, 0],
      lElbow: [0.6, 1.47, 0], rElbow: [0.6, 0.5, 0.02],
      lHand: [0.6, 1.78, 0], rHand: [0.6, 0.08, 0.05],
      pelvis: [0.14, 0.95, 0], lHip: [0.06, 1.0, 0], rHip: [0.18, 0.9, 0],
      lKnee: [-0.36, 1.04, 0], rKnee: [0.18, 0.48, 0.01],
      lFoot: [-0.78, 1.08, 0], rFoot: [0.18, 0.05, 0.03],
    },
  },
  {
    name: 'Utthita Parsvakonasana',
    label: 'Extended Side Angle',
    description: 'A deep lateral stretch with front knee bent at 90 degrees and back leg extended. Builds endurance.',
    joints: {
      head: [0.66, 1.2, 0.04], neck: [0.5, 1.07, 0],
      lShoulder: [0.42, 1.14, 0], rShoulder: [0.55, 0.92, 0],
      lElbow: [0.68, 1.34, 0], rElbow: [0.6, 0.5, 0.08],
      lHand: [0.98, 1.54, 0], rHand: [0.62, 0.08, 0.16],
      pelvis: [0.06, 0.62, 0], lHip: [-0.03, 0.62, 0], rHip: [0.13, 0.58, 0],
      lKnee: [-0.45, 0.35, 0], rKnee: [0.62, 0.52, 0.02],
      lFoot: [-0.9, 0.05, 0], rFoot: [0.62, 0.05, 0.03],
    },
  },
];
