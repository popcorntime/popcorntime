import Translate from "@google-cloud/translate";
import OpenAIApi from "openai";
import fs from "fs";
import path from "path";
import { GoogleAuth } from "google-auth-library";
import "dotenv/config";
import crypto from "crypto";
import jsonpath from "jsonpath";
import { locales as targetLanguages } from "../i18n-config.ts";

// use system credentials
const authClient = new GoogleAuth({});
const translate = new Translate.v3.TranslationServiceClient({
  authClient,
});

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const lockFilePath = "./dictionaries/.lockfile.json";
const englishFilePath = "./dictionaries/en.json";

function generateHash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function loadLockFile() {
  if (fs.existsSync(lockFilePath)) {
    return JSON.parse(fs.readFileSync(lockFilePath, "utf-8"));
  }
  return {};
}

function saveLockFile(lock) {
  fs.writeFileSync(lockFilePath, JSON.stringify(lock, null, 2));
}

function markKey(lock, lang, jsonPath, hash) {
  if (!lock[lang]) lock[lang] = {};
  lock[lang][jsonPath] = hash;
}

// Check if a key hash matches
function hashMatches(lock, lang, jsonPath, hash) {
  return lock[lang]?.[jsonPath] === hash;
}

function detectChanges(original, updated, pathPrefix = "$") {
  const changes = [];
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

function googleTranslateText(text, targetLang) {
  return translate
    .translateText({
      sourceLanguageCode: "en",
      targetLanguageCode: targetLang,
      contents: [text],
      parent: "projects/popcorn-time-439317/locations/global",
    })
    .then(([response]) => {
      return response.translations;
    });
}

async function gptTranslateWithContext(text, targetLang, context) {
  const messages = [
    {
      role: "system",
      content: `
      You are a professional translator creating high-quality translations for web.
      We use 'next-intl' as our translation library. Text should stay compatible.
      The translation is for the Popcorn Time web site and app, keep this is mind when you translate.
      `,
    },
    {
      role: "user",
      content: `Translate the following text into ${targetLang}, considering the context: 
     Context: ${context}
     Text: ${text}
     
     You should reply only the translated content. Nothing else as it'll be parsed.
     `,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,

    max_tokens: 1000,
    temperature: 0.7,
  });

  return response.choices[0].message.content.trim();
}

async function translateJSON(filePath, targetLang) {
  const englishContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const targetFilePath = path.join("dictionaries", `${targetLang}.json`);
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
        jsonPath.startsWith("$['Medias']['genres']") ||
        jsonPath.startsWith("$['Country']") ||
        jsonPath.startsWith("$['Languages']");

      let translation;
      if (!useGoogleT) {
        console.log(`Translating: ${jsonPath} with GPT`);
        translation = await gptTranslateWithContext(value, targetLang);
      } else {
        console.log(`Translating: ${jsonPath} with Google Translate`);
        const t = await googleTranslateText(value, targetLang);
        if (t && t.length > 0 && t[0].translatedText) {
          translation = t[0].translatedText;
          // Capitalize the first letter
          if (
            jsonPath.startsWith("$['Medias']['genres']") ||
            jsonPath.startsWith("$['Country']") ||
            jsonPath.startsWith("$['Languages']")
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

  const outputDir = path.join("dictionaries");

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, targetLang + ".json"),
    JSON.stringify(ensureArrayStructure(englishContent, targetContent), null, 2)
  );
  saveLockFile(lock);
  console.log(`Translated ${filePath} to ${targetLang}`);
}

function ensureParentPathExists(target, jsonPath) {
  const pathParts = jsonPath
    .replace(/^\$\['/, "")
    .replace(/'\]$/g, "")
    .split("']['");
  if (pathParts.length < 2) return;

  let current = target;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const key = pathParts[i];
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }

    current = current[key];
  }
}

function cleanUpUnusedKeys(original, translated, pathPrefix = "$") {
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

function ensureArrayStructure(original, updated) {
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

function capitalize(input) {
  if (!input) return input;
  return input.charAt(0).toUpperCase() + input.slice(1);
}

for (const lang of targetLanguages) {
  console.log(`Translating to ${lang}...`);
  await translateJSON(englishFilePath, lang);
}
