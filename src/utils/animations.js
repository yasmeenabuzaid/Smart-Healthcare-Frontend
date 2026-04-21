import { keyframes } from '@mui/system';

export const blurReveal = keyframes`
  0% { opacity: 0; filter: blur(15px); transform: translateY(20px); }
  100% { opacity: 1; filter: blur(0); transform: translateY(0); }
`;

export const blurHide = keyframes`
  0% { opacity: 1; filter: blur(0); transform: translateY(0); }
  100% { opacity: 0; filter: blur(15px); transform: translateY(-20px); }
`;

export const softSweep = keyframes`
  0% { transform: translateY(-100vh); opacity: 0; }
  50% { opacity: 0.3; }
  100% { transform: translateY(100vh); opacity: 0; }
`;

export const softGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(29, 78, 216, 0.1); }
  50% { box-shadow: 0 0 25px 10px rgba(29, 78, 216, 0.05); }
  100% { box-shadow: 0 0 0 0 rgba(29, 78, 216, 0); }
`;

export const subtleFloat = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`;