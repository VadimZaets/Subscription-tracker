import Svg, { Circle, Path } from 'react-native-svg';

type ApertureIconProps = { size?: number; color?: string };

const BLADE_D = 'M12 4.3 Q 16.4 8 12 12';
const ROTATIONS = [0, 60, 120, 180, 240, 300];

export const ApertureIcon = ({ size = 24, color = '#fff' }: ApertureIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={9.5} stroke={color} strokeWidth={1.7} />
    {ROTATIONS.map((deg) => (
      <Path
        key={deg}
        d={BLADE_D}
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        fill="none"
        transform={`rotate(${deg} 12 12)`}
      />
    ))}
  </Svg>
);
