import { SVGProps } from 'react';

interface LogoProps extends SVGProps<SVGSVGElement> {
  withGradient?: boolean;
}

export const Logo = ({ withGradient = true, className, ...props }: LogoProps) => {
  const gradientId = 'logo-gradient';
  
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 275 188"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M31.23 82.5H82.63L0 187.35L58.29 94.91L10.24 94.5099L30.4 60.46L56.38 16.58L59.1 11.97L66.19 0V62.3199L274.08 67.22L54.52 72.29V43.93L44.12 61.18L31.23 82.5Z"
        strokeWidth="4"
        stroke="#7CDEE6"
        strokeDasharray="1 1"
        pathLength="1"
        strokeDashoffset="0"
        fill={withGradient ? `url(#${gradientId})` : 'none'}
      />
      {withGradient && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="137.04"
            y1="0"
            x2="137.04"
            y2="187.35"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#7CDEE6" />
            <stop offset="100%" stopColor="#1A105F" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
};