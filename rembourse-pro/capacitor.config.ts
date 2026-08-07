import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rembourse.pro',
  appName: 'RemboursePro',
  webDir: 'public',
  server: {
    androidScheme: 'http://192.168.1.206:3000',
    cleartext: true,
  },
};

export default config;
