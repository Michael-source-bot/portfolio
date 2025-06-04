// bot.js

/**
 * Single‐file Discord bot (JavaScript) that:
 * 1) Registers two slash commands: 
 *    • /review [message] [product] [rating]
 *    • /removeReview [review_id]
 * 2) On /review: 
 *    • Generates a unique 10‐char Ticket ID (alphanumeric, no duplicates in reviews.html)
 *    • Builds a review‐card HTML snippet
 *    • Inserts it into reviews.html just before the closing </div> of <div class="content">
 *    • Replies confirming addition
 * 3) On /removeReview:
 *    • Removes the review‐card matching the given Ticket ID from reviews.html
 *    • Replies confirming removal or error if not found
 *
 * Prerequisites:
 *   npm install discord.js@14 @discordjs/rest discord-api-types
 *
 * Usage:
 *   Set environment variables (or replace placeholders):
 *     DISCORD_TOKEN – your bot token
 *     CLIENT_ID      – your application (bot) client ID
 *     GUILD_ID       – the guild ID for registering slash commands
 *
 *   Run:
 *     node bot.js
 *
 * Make sure bot.js and reviews.html are in the same directory.
 */

import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { readFile, writeFile } from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

// ───────────────────────────────────────────────────────────────────────────────
// 1) CONFIGURATION: Fill these in or set them as environment variables
// ───────────────────────────────────────────────────────────────────────────────

const TOKEN     = process.env.DISCORD_TOKEN     || 'MTMzOTAxMzg1OTczMzc5ODk2Ng.GofX5m.Cettx-_1iif_DjS1TtKKgY2Oqbtwvl-_Bniu8k';
const CLIENT_ID = process.env.CLIENT_ID         || '1339013859733798966';
const GUILD_ID  = process.env.GUILD_ID          || '1320587179348459652';

// ───────────────────────────────────────────────────────────────────────────────
// 2) RESOLVE __dirname FOR ES MODULE
// ───────────────────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirnameF  = dirname(__filename);
const REVIEWS_FILE = path.resolve(__dirnameF, 'reviews.html');

// ───────────────────────────────────────────────────────────────────────────────
// 3) HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Generates a random 10-character alphanumeric string (uppercase, lowercase, digits)
 */
function generateRandomID() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Reads reviews.html content and generates a unique Ticket ID that's not already in the file.
 */
async function generateUniqueTicketID() {
  let fileContent = '';
  try {
    fileContent = await readFile(REVIEWS_FILE, 'utf8');
  } catch {
    // If file doesn't exist or can't be read, treat as empty
    fileContent = '';
  }

  let ticketID;
  do {
    ticketID = generateRandomID();
  } while (fileContent.includes(`ID: ${ticketID}`));
  return ticketID;
}

/**
 * Converts an integer 1–5 into a string of 5 star characters.
 * e.g. 3 → "★★★☆☆"
 */
function starsFromRating(rating) {
  const filled = '★'.repeat(rating);
  const empty  = '☆'.repeat(5 - rating);
  return filled + empty;
}

/**
 * Builds the HTML block for a .review-card to insert into reviews.html.
 */
function buildReviewCardHTML(ticketID, reviewText, productName, ratingInt, discordID, discordUsername) {
  const ratingStars = starsFromRating(ratingInt);
  const safeReview  = reviewText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeProduct = productName.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `
            <div class="review-card">
                <span class="ticket-id">ID: ${ticketID}</span>
                <p class="review-text">
                    “${safeReview}”
                </p>
                <ul class="review-meta">
                    <li><strong>Product:</strong> ${safeProduct}</li>
                    <li><strong>Discord ID:</strong> ${discordID}</li>
                    <li><strong>Discord User:</strong> ${discordUsername}</li>
                    <li><strong>Rating:</strong> ${ratingStars}</li>
                </ul>
            </div>
`;
}

/**
 * Inserts `newReviewHTML` right before the closing </div> of <div class="content"> in reviews.html.
 */
async function insertReviewIntoHTML(newReviewHTML) {
  try {
    let fileContent = await readFile(REVIEWS_FILE, 'utf8');
    const regex = /<\/div>\s*<\/section>/;
    const match = fileContent.match(regex);

    if (!match) {
      throw new Error(`Could not find a closing </div> followed by </section> in reviews.html`);
    }

    const idx = match.index;
    const before = fileContent.slice(0, idx);
    const after  = fileContent.slice(idx);
    const updated = before + newReviewHTML + after;

    await writeFile(REVIEWS_FILE, updated, 'utf8');
    return true;
  } catch (err) {
    console.error('Error inserting review into HTML:', err);
    return false;
  }
}

/**
 * Removes only the <div class="review-card">…</div> block containing the given ticketID from reviews.html.
 */
async function removeReviewFromHTML(ticketID) {
  try {
    let fileContent = await readFile(REVIEWS_FILE, 'utf8');

    // Build a regex that:
    // 1) Matches <div class="review-card">
    // 2) Then lazily matches any content up to a <span class="ticket-id">ID: ticketID</span>
    // 3) Then lazily matches up to the closing </div> of that review-card
    //
    // We use a positive lookahead to ensure that the review-card block contains our exact ID,
    // and then match only that single block non-greedily.
    const escapedID = ticketID.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(
      `<div class="review-card">(?=[\\s\\S]*?<span class="ticket-id">ID:\\s*${escapedID}<\\/span>)[\\s\\S]*?<\\/div>\\s*`,
      'i'
    );

    if (!regex.test(fileContent)) {
      return false; // not found
    }

    const updated = fileContent.replace(regex, '');
    await writeFile(REVIEWS_FILE, updated, 'utf8');
    return true;
  } catch (err) {
    console.error('Error removing review from HTML:', err);
    return false;
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// 4) SLASH COMMAND REGISTRATION
// ───────────────────────────────────────────────────────────────────────────────

const commands = [
  new SlashCommandBuilder()
    .setName('review')
    .setDescription('Leave a review for a product')
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Your review text')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('product')
        .setDescription('Name of the product (e.g. “CyberHeist” Roblox Game)')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('rating')
        .setDescription('Your rating in stars (1–5)')
        .setRequired(true)
        .addChoices(
          { name: '★☆☆☆☆ (1)', value: 1 },
          { name: '★★☆☆☆ (2)', value: 2 },
          { name: '★★★☆☆ (3)', value: 3 },
          { name: '★★★★☆ (4)', value: 4 },
          { name: '★★★★★ (5)', value: 5 }
        )
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName('removereview')
    .setDescription('Remove a review by its Ticket ID')
    .addStringOption(option =>
      option
        .setName('review_id')
        .setDescription('The 10-character Ticket ID of the review to remove')
        .setRequired(true)
    )
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Registering slash commands to guild:', GUILD_ID);
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('Successfully registered /review and /removereview');
  } catch (err) {
    console.error('Error registering slash commands:', err);
  }
})();

// ───────────────────────────────────────────────────────────────────────────────
// 5) DISCORD.JS CLIENT SETUP & HANDLERS
// ───────────────────────────────────────────────────────────────────────────────

const client = new Client({
  intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages ]
});

client.once('ready', () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  await interaction.deferReply({ ephemeral: true });

  if (commandName === 'review') {
    try {
      const reviewText  = interaction.options.getString('message', true).trim();
      const productName = interaction.options.getString('product', true).trim();
      const ratingInt   = interaction.options.getInteger('rating', true);

      const discordUser   = `${interaction.user.username}`;
      const discordUserID = interaction.user.id;

      // 1) Generate a unique Ticket ID
      const ticketID = await generateUniqueTicketID();

      // 2) Build new review‐card HTML
      const newReviewHTML = buildReviewCardHTML(
        ticketID,
        reviewText,
        productName,
        ratingInt,
        discordUserID,
        discordUser
      );

      // 3) Insert into reviews.html
      const success = await insertReviewIntoHTML(newReviewHTML);
      if (!success) {
        throw new Error('Failed to update reviews.html');
      }

      // 4) Confirm to the user
      await interaction.editReply({
        content: `✅ Your review has been added! Ticket ID: \`${ticketID}\`. Thank you for your feedback.`
      });
    } catch (error) {
      console.error('Error handling /review interaction:', error);
      await interaction.editReply({
        content: `⚠️ There was an error processing your review. Please try again later.`
      });
    }
  }
  else if (commandName === 'removereview') {
    try {
      const reviewID = interaction.options.getString('review_id', true).trim();
      // 1) Attempt to remove the review
      const success = await removeReviewFromHTML(reviewID);
      if (!success) {
        await interaction.editReply({
          content: `❌ Could not find any review with Ticket ID: \`${reviewID}\`.`
        });
        return;
      }

      // 2) Confirm removal
      await interaction.editReply({
        content: `✅ Review with Ticket ID \`${reviewID}\` has been removed.`
      });
    } catch (error) {
      console.error('Error handling /removereview interaction:', error);
      await interaction.editReply({
        content: `⚠️ There was an error removing the review. Please try again later.`
      });
    }
  }
});

// Log in to Discord
client.login(TOKEN);