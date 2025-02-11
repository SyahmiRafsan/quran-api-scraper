import axios from "axios";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const BASE_URL = "https://api.quran.com/api/v4";
const OUTPUT_DIR = "./chapters";
const MAX_CHAPTERS_COUNT = 114;

async function fetchChapter(chapterNum) {
  try {
    let allVerses = [];
    let currentPage = 1;
    let totalPages = 1;
    let totalRecords = 0;

    do {
      console.log(
        "Fetching page",
        currentPage,
        "of chapter",
        chapterNum,
        "of 114"
      );
      const languages = ['ms', 'id', 'en'];
      const verseResponses = await Promise.all(
        languages.map(lang =>
          axios.get(`${BASE_URL}/verses/by_chapter/${chapterNum}`, {
            params: {
              words: true,
              language: lang,
              word_fields: "text_uthmani,text_uthmani_tajweed",
              translations: "39,131,33",
              per_page: 50,
              page: currentPage,
              fields: "text_uthmani",
            },
          })
        )
      );

      const response = verseResponses[0]; // Use first response for pagination
      const { verses, pagination } = response.data;
      
      // Combine word translations from all language responses
      const processedVerses = verses.map((verse, verseIndex) => ({
        ...verse,
        words: verse.words.map((word, wordIndex) => ({
          ...word,
          translations: {
            ms: verseResponses[0].data.verses[verseIndex].words[wordIndex].translation.text,
            id: verseResponses[1].data.verses[verseIndex].words[wordIndex].translation.text,
            en: verseResponses[2].data.verses[verseIndex].words[wordIndex].translation.text
          }
        }))
      }));

      allVerses = [...allVerses, ...processedVerses];
      totalPages = pagination.total_pages;
      currentPage++;

      totalRecords = pagination.total_records;

      // Add a small delay between page requests
      if (currentPage <= totalPages) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } while (currentPage <= totalPages);

    // Fetch chapter data in multiple languages
    const languages = ['ms', 'id', 'en'];
    const translatedNames = {};

    for (const lang of languages) {
      const response = await axios.get(`${BASE_URL}/chapters/${chapterNum}`, {
        params: {
          language: lang,
        },
      });
      translatedNames[lang] = response.data.chapter.translated_name.name;
    }

    const { chapter } = (await axios.get(`${BASE_URL}/chapters/${chapterNum}`)).data;
    const { translated_name, ...chapterWithoutTranslatedName } = chapter;
    chapterWithoutTranslatedName.translated_names = translatedNames;

    console.log("Fetched", totalRecords, "verses for chapter", chapterNum);

    return {
      chapter: chapterWithoutTranslatedName,
      verses: allVerses.map((v) => ({
        ...v,
        translations: {
          ms: v.translations.find(t => t.resource_id === 39)?.text || "",
          id: v.translations.find(t => t.resource_id === 33)?.text || "",
          en: v.translations.find(t => t.resource_id === 131)?.text || ""
        },
      })),
    };
  } catch (error) {
    console.error(`Error fetching chapter ${chapterNum}:`, error.message);
    return null;
  }
}

async function saveChapter(chapter, chapterNum) {
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
    const filePath = join(OUTPUT_DIR, `${chapterNum}.json`);
    await writeFile(filePath, JSON.stringify(chapter, null, 2));
    console.log(`Saved chapter ${chapterNum}`);
  } catch (error) {
    console.error(`Error saving chapter ${chapterNum}:`, error.message);
  }
}

async function main() {
  console.log("Starting Quran verses scraping...\n");
  for (let chapterNum = 1; chapterNum <= MAX_CHAPTERS_COUNT; chapterNum++) {
    console.log("=".repeat(50));
    console.log(`Starting Chapter ${chapterNum}`);
    console.log("-".repeat(50));

    const startTime = Date.now();
    const chapter = await fetchChapter(chapterNum);
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    if (chapter) {
      await saveChapter(chapter, chapterNum);
      console.log(`\nChapter ${chapterNum} completed in ${duration} seconds\n`);
      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  console.log("Scraping completed!");
}

main().catch(console.error);
