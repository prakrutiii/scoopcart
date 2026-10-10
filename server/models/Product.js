import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Classic", "Chocolate", "Fruity", "Special"],
    },
    image: { type: String, default: "" },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isAvailable: { type: Boolean, default: true },
    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);