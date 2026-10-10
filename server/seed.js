import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

const products = [
  { name: "Vanilla Bean Classic", description: "Creamy vanilla ice cream made with real vanilla beans", price: 80, category: "Classic", stock: 100 },
  { name: "Butterscotch Crunch", description: "Smooth butterscotch with crunchy caramel bits", price: 90, category: "Classic", stock: 80 },
  { name: "Double Chocolate Fudge", description: "Chocolate ice cream with thick fudge ripples", price: 130, category: "Chocolate", stock: 60 },
  { name: "Choco Hazelnut", description: "Chocolate and roasted hazelnut with a nutty crunch", price: 140, category: "Chocolate", stock: 50 },
  { name: "Strawberry Swirl", description: "Fresh strawberry ice cream with a fruity swirl", price: 100, category: "Fruity", stock: 70 },
  { name: "Mango Alphonso", description: "Made with ripe Alphonso mango pulp", price: 110, category: "Fruity", stock: 70 },
  { name: "Blueberry Cheesecake", description: "Creamy cheesecake base with blueberry compote", price: 150, category: "Special", stock: 40 },
  { name: "Kesar Pista Kulfi", description: "Traditional kulfi with saffron and pistachios", price: 140, category: "Special", stock: 45 },
  { name: "Biscoff Caramel Crunch", description: "Caramel ice cream with crushed Biscoff cookies", price: 160, category: "Special", stock: 5 },
  { name: "Sold Out Sample", description: "A flavor that is out of stock, used to test the UI", price: 120, category: "Classic", stock: 0 },
];

const run = async () => {
  await connectDB();
  for (const p of products) {
    const { name, ...rest } = p;
    await Product.updateOne({ name }, { $setOnInsert: rest }, { upsert: true });
  }
  console.log("Seed complete");
  await mongoose.disconnect();
};

run();