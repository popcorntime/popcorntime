import { TranslationServiceClient } from "@google-cloud/translate";
import OpenAIApi from "openai";
import fs from "fs";
import path from "path";
import { config } from "dotenv";
import crypto from "crypto";
import jsonpath from "jsonpath";
import { locales as targetLanguages } from "@popcorntime/i18n";
import { ChatCompletionMessageParam } from "openai/resources.mjs";
const __dirname = path.resolve();
config({ path: path.join(__dirname, "../../.env") });

if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
  throw new Error("GOOGLE_CLOUD_PROJECT_ID is not set");
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

// use system credentials
const translate = new TranslationServiceClient();

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const TARGET_DIR = path.join(
  __dirname,
  "../../crates/popcorntime-tauri/dictionaries"
);

const lockFilePath = path.join(
  __dirname,
  "../../crates/popcorntime-tauri/dictionaries.lock"
);
const englishFilePath = path.join(TARGET_DIR, "en.json");

function generateHash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function loadLockFile() {
  if (fs.existsSync(lockFilePath)) {
    return JSON.parse(fs.readFileSync(lockFilePath, "utf-8"));
  }
  return {};
}

function saveLockFile(lock: Record<string, any>) {
  fs.writeFileSync(lockFilePath, JSON.stringify(lock, null, 2));
}

function markKey(
  lock: Record<string, any>,
  lang: string,
  jsonPath: string,
  hash: string
) {
  if (!lock[lang]) lock[lang] = {};
  lock[lang][jsonPath] = hash;
}

// Check if a key hash matches
function hashMatches(
  lock: Record<string, any>,
  lang: string,
  jsonPath: string,
  hash: string
) {
  return lock[lang]?.[jsonPath] === hash;
}

function detectChanges(
  original: Record<string, any>,
  updated: Record<string, any>,
  pathPrefix = "$"
) {
  const changes: { path: string; hash: string }[] = [];
  for (const key in updated) {
    const currentPath = `${pathPrefix}['${key}']`;

    if (typeof updated[key] === "object" || Array.isArray(updated[key])) {
      const subChanges = detectChanges(
        original[key] || {},
        updated[key],
        currentPath
      );
      changes.push(...subChanges);
    } else {
      const currentHash = generateHash(updated[key]);
      const previousHash = original[key] ? generateHash(original[key]) : null;
      if (currentHash !== previousHash) {
        changes.push({ path: currentPath, hash: currentHash });
      }
    }
  }
  return changes;
}

function googleTranslateText(text: string, targetLang: string) {
  return translate
    .translateText({
      sourceLanguageCode: "en",
      targetLanguageCode: targetLang,
      contents: [text],
      parent: `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/locations/global`,
    })
    .then(([response]) => {
      return response.translations;
    });
}

async function gptTranslateWithContext(text: string, targetLang: string) {
  const messages = [
    {
      role: "system",
      content: `
      You are a professional translator creating high-quality translations for desktop application and website.
      We use 'next-intl' for our website and react-i18next for the desktop app as our translation library.
      If we provide you with a context, use it to translate the text.
      If we use variable like {{name}} or {{count}} or {{price}} or {{year}} or {{date}}, keep it in the translation.
      If we use {platform} or {country} or {language}, keep it in the translation as well. (Single brace is for website and double brace is for desktop app)
      The translation is for the Popcorn Time web site and app, keep this is mind when you translate as it's related to movies and tv shows. Keep it cool and funny but stay professional.
      `,
    },
    {
      role: "user",
      content: `Translate the following text into ${targetLang}
     Text: ${text}
     
     You should reply only the translated content. Nothing else as it'll be parsed.
     `,
    },
  ] as ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    max_tokens: 1000,
    temperature: 0.7,
  });

  return response.choices?.[0]?.message?.content?.trim();
}

async function translateJSON(filePath: string, targetLang: string) {
  const englishContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const targetFilePath = path.join(TARGET_DIR, `${targetLang}.json`);
  let targetContent = {};

  const lock = loadLockFile();

  // Load existing translations for the target language
  if (fs.existsSync(targetFilePath)) {
    targetContent = JSON.parse(fs.readFileSync(targetFilePath, "utf-8"));
  }

  // Clean up unused keys
  const removedKeys = cleanUpUnusedKeys(englishContent, targetContent);
  if (removedKeys.length > 0) {
    console.log(`Removed ${removedKeys.length} unused keys for ${targetLang}`);
  }

  const changedKeys = detectChanges(targetContent, englishContent);
  console.log(`Found ${changedKeys.length} keys for ${targetLang}`);
  for (const { path: jsonPath, hash } of changedKeys) {
    if (!hashMatches(lock, targetLang, jsonPath, hash)) {
      const value = jsonpath.value(englishContent, jsonPath);

      const useGoogleT =
        value.length <= 5 ||
        jsonPath.startsWith("$['genres']") ||
        jsonPath.startsWith("$['country']") ||
        jsonPath.startsWith("$['language']");

      let translation;
      if (!useGoogleT) {
        console.log(`Translating: ${jsonPath} with GPT`);
        translation = await gptTranslateWithContext(value, targetLang);
      } else {
        console.log(`Translating: ${jsonPath} with Google Translate`);
        const t = await googleTranslateText(value, targetLang);
        if (t && t.length > 0 && t[0]?.translatedText) {
          translation = t[0].translatedText;
          // Capitalize the first letter
          if (
            jsonPath.startsWith("$['genres']") ||
            jsonPath.startsWith("$['country']") ||
            jsonPath.startsWith("$['language']")
          ) {
            translation = capitalize(translation);
          }
        }
      }

      ensureParentPathExists(targetContent, jsonPath);
      jsonpath.value(targetContent, jsonPath, translation);
      markKey(lock, targetLang, jsonPath, hash);
    }
  }

  fs.mkdirSync(TARGET_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(TARGET_DIR, targetLang + ".json"),
    JSON.stringify(ensureArrayStructure(englishContent, targetContent), null, 2)
  );
  saveLockFile(lock);
  console.log(`Translated ${filePath} to ${targetLang}`);
}

function ensureParentPathExists(target: Record<string, any>, jsonPath: string) {
  const pathParts = jsonPath
    .replace(/^\$\['/, "")
    .replace(/'\]$/g, "")
    .split("']['");
  if (pathParts.length < 2) return;

  let current = target;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const key = pathParts[i];
    if (
      (key && !(key in current)) ||
      (key && typeof current[key] !== "object")
    ) {
      current[key] = {};
    }

    if (key) {
      current = current[key];
    }
  }
}

function cleanUpUnusedKeys(
  original: Record<string, any>,
  translated: Record<string, any>,
  pathPrefix = "$"
) {
  const keysToDelete = [];

  for (const key in translated) {
    const currentPath = `${pathPrefix}['${key}']`;

    if (
      typeof translated[key] === "object" &&
      !Array.isArray(translated[key]) &&
      translated[key] !== null
    ) {
      // Recursively clean nested objects
      cleanUpUnusedKeys(original[key] || {}, translated[key], currentPath);

      // If the object becomes empty after cleaning, mark it for deletion
      if (Object.keys(translated[key]).length === 0) {
        delete translated[key];
      }
    } else if (!(key in original)) {
      // Key doesn't exist in the original, mark for deletion
      keysToDelete.push(key);
    }
  }

  // Delete unused keys from the translated object
  keysToDelete.forEach((key) => {
    delete translated[key];
  });

  return translated;
}

function ensureArrayStructure(
  original: Record<string, any>,
  updated: Record<string, any>
) {
  for (const key in updated) {
    if (Array.isArray(updated[key])) {
      // Directly assign array, not object-like indices
      original[key] = updated[key];
    } else if (typeof updated[key] === "object" && updated[key] !== null) {
      // Recursively process objects
      original[key] = ensureArrayStructure(original[key] || {}, updated[key]);
    } else {
      // Otherwise just assign the value
      original[key] = updated[key];
    }
  }
  return original;
}

function capitalize(input: string | null | undefined) {
  if (!input) return input;
  return input.charAt(0).toUpperCase() + input.slice(1);
}

for (const lang of targetLanguages) {
  console.log(`Translating to ${lang}...`);
  await translateJSON(englishFilePath, lang);
}
