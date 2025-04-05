import { styled, keyframes } from '@mui/material/styles';
import { Badge, Card, ListItem, Box } from '@mui/material';

// Animation keyframes as actual keyframes objects for styled-components
const fadeInKeyframes = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUpKeyframes = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulseKeyframes = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const rippleKeyframes = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.4);
    opacity: 0;
  }
`;

const floatKeyframes = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Shared styled components for both dashboards
export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: `${rippleKeyframes} 1.2s infinite ease-in-out`,
      border: '1px solid currentColor',
      content: '""',
    },
  },
}));

export const GradientCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

export const AnimatedListItem = styled(ListItem)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.02)',
  },
}));

export const ClassBanner = styled(Box)(({ theme }) => ({
  height: 120,
  borderRadius: theme.shape.borderRadius,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
  },
}));

// Animation components
export const FadeIn = styled('div')`
  animation: ${fadeInKeyframes} 0.5s ease-in-out;
`;

export const SlideUp = styled('div')`
  animation: ${slideUpKeyframes} 0.5s ease-in-out;
`;

export const Pulse = styled('div')`
  animation: ${pulseKeyframes} 2s infinite;
`;

export const Float = styled('div')`
  animation: ${floatKeyframes} 3s ease-in-out infinite;
`;

// Layout components
export const PageContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

export const ContentContainer = styled('main')(({ theme, open, drawerWidth }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
}));

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

// Card components
export const DashboardCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

export const StatCard = styled(Card)(({ theme, color = 'primary' }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette[color].main,
  color: theme.palette[color].contrastText,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 16px 0 ${theme.palette[color].main}40`,
  },
}));