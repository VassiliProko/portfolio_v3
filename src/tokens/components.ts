/**
 * Component-Specific Tokens
 * Heights, padding, sizes for UI components
 */

export const components = {
  button: {
    height: {
      sm: '30px',
      default: '40px',
      lg: '50px',
    },
    padding: {
      horizontal: '20px',
    },
    radius: '0px',
  },
  input: {
    height: '40px',
    padding: {
      horizontal: '12px',
    },
    radius: '0px',
  },
  icon: {
    sm: '16px',
    default: '20px',
    lg: '24px',
  },
  avatar: {
    sm: '32px',
    md: '40px',
    lg: '48px',
  },
  card: {
    padding: '15px',
    radius: '0px',
    contentGap: '10px',
  },
  modal: {
    maxWidth: '480px',
    padding: '30px',
    radius: '0px',
  },
  touchTarget: {
    min: '44px',
  },
} as const;
