# Quran Foundation API Scraper (Chapters, Verses, Translations, and Transliterations)

A Node.js application that scrapes Quran verses data from the **Quran.com API (v4)**, including translations in multiple languages (Indonesian and English).

## Features

- Fetches all 114 chapters of the Quran
- Includes word-by-word translations and transliterations
- Supports multiple language translations:
  - Indonesian (id)
  - English (en)
  - Note: For word-by-word translations, Malay translations currently fall back to English 
- Includes Arabic text in both Uthmani script and Tajweed format
- Implements rate limiting to avoid API overload
- Saves data in structured JSON format

## Prerequisites

- Node.js (v14 or higher) or Bun runtime
- Basic understanding of JavaScript/Node.js
- Internet connection for API access

## Installation

### Using npm

```bash
npm install
```

### Using Bun

```bash
bun install
```

## Configuration

The following constants can be modified in `index.js` to customize the scraping behavior:

```javascript
const BASE_URL = "https://api.quran.com/api/v4"; // API endpoint URL
const OUTPUT_DIR = "./chapters"; // Output directory for JSON files
const MAX_CHAPTERS_COUNT = 114; // Total number of chapters to fetch
```

Additional configurable parameters in the API requests:

- `per_page`: Number of verses per page (default: 50)
- `translations`: Translation resource IDs (default: "39,131,33" for English, English, and Indonesian)
- `language`: Language for word translations

## Usage

Run the scraper:

```bash
npm start
```

```bash
bun start
```

The script will:

1. Create a `chapters` directory if it doesn't exist
2. Fetch all chapters sequentially (1-114)
3. Save each chapter as a separate JSON file (e.g., `1.json`, `2.json`, `114.json`)
4. Display progress information in the console

Example directory structure after running the script:

```
chapters/
├── 1.json  # Al-Fatihah
├── 2.json  # Al-Baqarah
├── 3.json  # Ali 'Imran
...
└── 114.json # An-Nas
```

Example console output while running:

```
Starting Quran verses scraping...

==================================================
Starting Chapter 1
--------------------------------------------------
Fetching page 1 of chapter 1 of 114
Fetched 7 verses for chapter 1
Saved chapter 1

Chapter 1 completed in 0.82 seconds

==================================================
Starting Chapter 2
--------------------------------------------------
Fetching page 1 of chapter 2 of 114
Fetched 286 verses for chapter 2
Saved chapter 2

Chapter 2 completed in 2.15 seconds

==================================================
Starting Chapter 3
--------------------------------------------------
Fetching page 1 of chapter 3 of 114
Fetched 200 verses for chapter 3
Saved chapter 3

Chapter 3 completed in 1.53 seconds

...

==================================================
Starting Chapter 114
--------------------------------------------------
Fetching page 1 of chapter 114 of 114
Fetched 6 verses for chapter 114
Saved chapter 114

Chapter 114 completed in 0.65 seconds

Scraping completed!
```

## Output Format

Each chapter is saved as a JSON file with the following structure:

```json
{
  "chapter": {
    "id": number,
    "revelation_place": string,
    "revelation_order": number,
    "bismillah_pre": boolean,
    "name_simple": string,
    "name_complex": string,
    "name_arabic": string,
    "verses_count": number,
    "pages": number[],
    "translated_names": {
      "ms": string,
      "id": string,
      "en": string
    }
  },
  "verses": [
    {
      "id": number,
      "verse_number": number,
      "verse_key": string,
      "text_uthmani": string,
      "words": [
        {
          "text_uthmani": string,
          "text_uthmani_tajweed": string,
          "translations": {
            "ms": string, // Note: Currently using English translations
            "id": string,
            "en": string
          }
        }
      ],
      "translations": {
        "ms": string,
        "id": string,
        "en": string
      }
    }
  ]
}
```


## Example Chapter JSON Output

```json
{
  "chapter": {
    "id": 1,
    "revelation_place": "makkah",
    "revelation_order": 5,
    "bismillah_pre": false,
    "name_simple": "Al-Fatihah",
    "name_complex": "Al-Fātiĥah",
    "name_arabic": "الفاتحة",
    "verses_count": 7,
    "pages": [
      1,
      1
    ],
    "translated_names": {
      "ms": "Pembukaan",
      "id": "Pembukaan",
      "en": "The Opener"
    }
  },
  "verses": [
    {
      "id": 1,
      "verse_number": 1,
      "verse_key": "1:1",
      "hizb_number": 1,
      "rub_el_hizb_number": 1,
      "ruku_number": 1,
      "manzil_number": 1,
      "sajdah_number": null,
      "text_uthmani": "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
      "page_number": 1,
      "juz_number": 1,
      "words": [
        {
          "id": 1,
          "position": 1,
          "audio_url": "wbw/001_001_001.mp3",
          "char_type_name": "word",
          "text_uthmani": "بِسْمِ",
          "text_uthmani_tajweed": "بِسۡمِ",
          "page_number": 1,
          "line_number": 2,
          "text": "بِسْمِ",
          "translation": {
            "text": "In (the) name",
            "language_name": "english"
          },
          "transliteration": {
            "text": "bis'mi",
            "language_name": "english"
          },
          "translations": {
            "ms": "In (the) name",
            "id": "dengan nama",
            "en": "In (the) name"
          }
        },
        {
          "id": 2,
          "position": 2,
          "audio_url": "wbw/001_001_002.mp3",
          "char_type_name": "word",
          "text_uthmani": "ٱللَّهِ",
          "text_uthmani_tajweed": "<rule class=ham_wasl>ٱ</rule>للَّهِ",
          "page_number": 1,
          "line_number": 2,
          "text": "ٱللَّهِ",
          "translation": {
            "text": "(of) Allah",
            "language_name": "english"
          },
          "transliteration": {
            "text": "l-lahi",
            "language_name": "english"
          },
          "translations": {
            "ms": "(of) Allah",
            "id": "Allah",
            "en": "(of) Allah"
          }
        },
        {
          "id": 3,
          "position": 3,
          "audio_url": "wbw/001_001_003.mp3",
          "char_type_name": "word",
          "text_uthmani": "ٱلرَّحْمَـٰنِ",
          "text_uthmani_tajweed": "<rule class=ham_wasl>ٱ</rule><rule class=laam_shamsiyah>ل</rule>رَّحۡمَ<rule class=madda_normal>ـٰ</rule>نِ",
          "page_number": 1,
          "line_number": 2,
          "text": "ٱلرَّحْمَـٰنِ",
          "translation": {
            "text": "the Most Gracious",
            "language_name": "english"
          },
          "transliteration": {
            "text": "l-raḥmāni",
            "language_name": "english"
          },
          "translations": {
            "ms": "the Most Gracious",
            "id": "Maha Pengasih",
            "en": "the Most Gracious"
          }
        },
        {
          "id": 4,
          "position": 4,
          "audio_url": "wbw/001_001_004.mp3",
          "char_type_name": "word",
          "text_uthmani": "ٱلرَّحِيمِ",
          "text_uthmani_tajweed": "<rule class=ham_wasl>ٱ</rule><rule class=laam_shamsiyah>ل</rule>رَّح<rule class=madda_permissible>ِي</rule>مِ",
          "page_number": 1,
          "line_number": 2,
          "text": "ٱلرَّحِيمِ",
          "translation": {
            "text": "the Most Merciful",
            "language_name": "english"
          },
          "transliteration": {
            "text": "l-raḥīmi",
            "language_name": "english"
          },
          "translations": {
            "ms": "the Most Merciful",
            "id": "Maha Penyayang",
            "en": "the Most Merciful"
          }
        },
        {
          "id": 5,
          "position": 5,
          "audio_url": null,
          "char_type_name": "end",
          "text_uthmani": "١",
          "text_uthmani_tajweed": "١",
          "page_number": 1,
          "line_number": 2,
          "text": "١",
          "translation": {
            "text": "(1)",
            "language_name": "english"
          },
          "transliteration": {
            "text": null,
            "language_name": "english"
          },
          "translations": {
            "ms": "(1)",
            "id": "(1)",
            "en": "(1)"
          }
        }
      ],
      "translations": {
        "ms": "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani.",
        "id": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
        "en": "In the Name of Allah—the Most Compassionate, Most Merciful."
      }
    },
    ...more verses...
  ]
}

```

## API Reference

This project uses the Quran.com API v4. The main endpoints used are:

- `/verses/by_chapter/{chapter_number}` - Fetches verses for a specific chapter
- `/chapters/{chapter_number}` - Fetches chapter metadata


## Rate Limiting

The script implements rate limiting to avoid overwhelming the API. Default settings:

- 50 requests per minute
- 3-second delay between chapter requests

## Troubleshooting

### Common Issues

1. **API Rate Limit Exceeded**

   - Increase the delay between requests
   - Reduce the number of concurrent requests

2. **Network Errors**

   - Check your internet connection
   - Verify API endpoint accessibility
   - The script will automatically retry failed requests

3. **Memory Issues with Large Datasets**
   - Adjust the `per_page` parameter
   - Process chapters in smaller batches

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Performance Tips

- Use Bun runtime for faster execution
- Adjust batch sizes based on your system's capabilities
- Consider using stream processing for large chapters
- Implement caching for frequently accessed data

## Acknowledgments

- [Quran.com API](https://api-docs.quran.com/docs/category/quran.com-api) for providing the data
- Translation resources:
  - MS (ID: 39): Abdullah Muhammad Basmeih - Malay translation
  - EN (ID: 131): Dr. Mustafa Khattab, The Clear Quran - English translation
  - ID (ID: 33): Indonesian Islamic affairs ministry - Indonesian translation
