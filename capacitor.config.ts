import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.tutorial.photogallery.angular',
  appName: 'tutorial-photo-gallery-angular',
  npmClient: 'pnpm',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#ffffffff',
      androidScaleType: 'CENTER_CROP',
    },
  },
};

export default config;
