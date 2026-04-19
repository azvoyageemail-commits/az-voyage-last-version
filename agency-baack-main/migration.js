// migrate-hotels.js
import { MongoClient } from "mongodb";

import { ObjectId } from "mongodb";
const URI = "mongodb://localhost:27017";
const DB = "testaz";

async function migrate() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB);
  const offers = db.collection("offers");

  const allOffers = await offers.find({}).toArray();
  let migrated = 0;
  let skipped = 0;

  for (const offer of allOffers) {
    if (!Array.isArray(offer.hotels) || offer.hotels.length === 0) {
      console.log(`⏭️  Vide: ${offer.title}`);
      skipped++;
      continue;
    }

    const first = offer.hotels[0];

    // Already migrated — has object format with 'hotel' key
    if (typeof first === "object" && first !== null && "hotel" in first) {
      console.log(`✅ Déjà migré: ${offer.title}`);
      skipped++;
      continue;
    }

    // Convert: string IDs or ObjectIds → array of objects
    const newHotels = offer.hotels.map((entry) => {
      const id = entry instanceof ObjectId ? entry.toString() : String(entry);
      return {
        id: new ObjectId().toString(), // Payload array item ID
        hotel: id,
        priceLabel: null,
        priceAmount: null,
        childPriceBrackets: [],
      };
    });

    await offers.updateOne(
      { _id: offer._id },
      { $set: { hotels: newHotels } }
    );

    console.log(`🔄 Migré: ${offer.title} (${newHotels.length} hôtel(s))`);
    migrated++;
  }

  console.log(`\nTerminé — ${migrated} migrés, ${skipped} ignorés.`);
  await client.close();
}

migrate().catch(console.error);