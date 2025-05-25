
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.55c5cd2afbb24be0a506eee93bd3db9a',
  appName: 'livestock-weather-insights-hub',
  webDir: 'dist',
  server: {
    url: 'https://55c5cd2a-fbb2-4be0-a506-eee93bd3db9a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#22c55e',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP'
    }
  }
};

export default config;
