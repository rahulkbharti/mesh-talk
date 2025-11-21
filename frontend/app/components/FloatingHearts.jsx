import { Box, useMediaQuery, GlobalStyles } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

// --- CSS Animation for Floating Hearts ---
const floatingHeartsAnimation = `
  @keyframes floatHearts {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }

  .heart {
    position: fixed;
    bottom: -50px; 
    font-size: 1.5rem;
    color: rgba(233, 30, 99, 0.5);
    animation: floatHearts linear infinite;
    pointer-events: none; 
    z-index: 9998; 
  }
`;

// --- Floating Hearts Component ---
const FloatingHearts = () => {
    const isSmall = useMediaQuery('(max-width:600px)');
    const heartsCount = isSmall ? 8 : 15;
    return (
        <>
            <GlobalStyles styles={floatingHeartsAnimation} />
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    pointerEvents: "none",
                    zIndex: 9998,
                }}
            >
                {[...Array(heartsCount)].map((_, i) => (
                    <FavoriteIcon
                        key={i}
                        className="heart"
                        sx={{
                            left: `${Math.random() * 100}vw`,
                            animationDuration: `${Math.random() * 5 + 5}s`,
                            animationDelay: `${Math.random() * 5}s`,
                            fontSize: `${Math.random() * 1.5 + 0.5}rem`,
                        }}
                    />
                ))}
            </Box>
        </>
    );
};


export default FloatingHearts;
