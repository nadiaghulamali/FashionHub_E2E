import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

type EnvName = 'local'|'staging'|'production';

const normalize = (v?: string) => (v || '').trim();

export const ENV = (normalize(process.env.ENVIRONMENT) || 'local').toLowerCase() as EnvName;

export const URLS: Record<EnvName, string> = {
  local: normalize(process.env.LOCAL_URL || ''),
  staging: normalize(process.env.STAGING_URL || ''),
  production: normalize(process.env.PRODUCTION_URL || '')
};

export const BASE_API = normalize(process.env.GITHUB_API || 'https://api.github.com/');
export const LOGIN_USERNAME = normalize(process.env.LOGIN_USERNAME);
export const LOGIN_PASSWORD = normalize(process.env.LOGIN_PASSWORD);

export const Config = {
  environment: ENV,
  baseUrl: URLS[ENV],
  baseApi: BASE_API,
  username: LOGIN_USERNAME,
  password: LOGIN_PASSWORD,
  executeType: normalize(process.env.EXECUTE_TYPE) || 'local',
  useAllure: (process.env.USE_ALLURE || 'false') === 'true'
};
