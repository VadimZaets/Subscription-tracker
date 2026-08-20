import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

import Claude from '@/assets/icon/analyzer/claude.svg';
import Discord from '@/assets/icon/analyzer/discord.svg';
import Duolingo from '@/assets/icon/analyzer/duolingo.svg';
import Icloud from '@/assets/icon/analyzer/icloud.svg';
import Netflix from '@/assets/icon/analyzer/netflix.svg';
import Notion from '@/assets/icon/analyzer/notion.svg';
import OpenaiChatgpt from '@/assets/icon/analyzer/openai-chatgpt.svg';
import Spotify from '@/assets/icon/analyzer/spotify.svg';
import Youtube from '@/assets/icon/analyzer/youtube.svg';

/** Брендові лого для AnalyzingLoader (лоадер розпізнавання фото) — файли з
 *  цієї ж папки, імпортовані напряму через react-native-svg-transformer
 *  (див. metro.config.js) як React-компоненти, без ручного копіювання XML.
 *  PlayStation Plus свідомо не додано: його SVG мав transform, що виносив
 *  контент за межі viewBox (обрізання), і градієнти, які нестабільно
 *  рендерились через SvgXml. */
export const ANALYZER_ICONS: readonly FC<SvgProps>[] = [
  Claude,
  Discord,
  Duolingo,
  Icloud,
  Netflix,
  Notion,
  OpenaiChatgpt,
  Spotify,
  Youtube,
];
