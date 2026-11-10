import type { CapacitorConfig } from '@capacitor/cli';

// appId harus unik di Play Store; ganti bila punya domain sendiri (mis. id.ac.<kampus>.lingkarku).
const config: CapacitorConfig = {
  appId: 'id.lingkarku.app',
  appName: 'LingkarKu',
  webDir: 'dist',
  android: {
    // Aplikasi tidak memuat konten dari internet.
    allowMixedContent: false,
  },
};

export default config;
