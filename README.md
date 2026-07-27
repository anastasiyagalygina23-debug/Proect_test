# Нейрофотограф

AI-сервис fashion-съёмки: селфи + текстовый запрос → промпт, стили, серия кадров, галерея.

## Запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Как это устроено

| Шаг | Что происходит |
|-----|----------------|
| Загрузка | Селфи сохраняется в `public/uploads/` |
| Анализ | `POST /api/analyze` — LLM (или эвристика без ключа) строит master prompt и 4 стиля |
| Стиль | Пользователь выбирает направление |
| Генерация | `POST /api/generate` — 4 кадра через Replicate или демо-SVG |
| Галерея | `/gallery/[id]` — editorial-вёрстка серии |

## Ключи API

- **OPENAI_API_KEY** — умные промпты и стили (без ключа работает базовая логика для «Vogue» и т.п.).
- **REPLICATE_API_TOKEN** — реальная генерация изображений с референсом лица (настройте модель под InstantID / IP-Adapter в `src/lib/image-gen.ts`).
- **NEURO_DEMO_MODE=false** — отключить демо, если задан Replicate.

## Дальше по продукту

- Подключить [InstantID](https://replicate.com/instantx/instantid) или Flux + face для стабильного сохранения лица.
- Очередь задач (Inngest / Bull) для долгой генерации.
- Шаринг галереи по ссылке, водяной знак, оплата за серию.
