import { InjectionToken } from '@angular/core';

import { TranslateConfig } from '../models/configs/translate-config.interface';
import { HTTPLoader } from '../models/loader/loader.interface';

export const TRANSLATE_CONFIG = new InjectionToken<TranslateConfig>('translateConfig');
export const TRANSLATE_LOADER = new InjectionToken<{ get: HTTPLoader }>('translateLoader');
