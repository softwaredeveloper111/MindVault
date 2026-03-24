import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user should be required"],
  },

  url: {
    type: String,
    trim: true,
    required: function () {
      return this.sourceType !== "note";
    },
  },

  sourceType: {
    type: String,
    enum: ["article", "tweet", "youtube", "pdf", "image", "note"],
    required: [true, "source must be defined"],
  },

  title: {
    type: String,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  thumbnailUrl: {
    type: String,
    trim: true,
  },

  extractedText: {
    type: String,
    select: false,
  },

  userNote: {
    type: String,
  },

  tags: {
    type: [String],
    default: [],
  },

  topicCluster: {
    type: String,
    trim: true,
  },

  embedding: {
    type: [Number],
    select: false,
  },

  isFavorite: {
    type: Boolean,
    default: false,
  },

  isArchived: {
    type: Boolean,
    default: false,
  },

  collectionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
  }],

  status: {
    type: String,
    enum: ["processing", "ready", "failed"],
    default: "processing",
  },

  lastViewedAt: {
    type: Date,
    default: Date.now,
  },

}, { timestamps: true });

itemSchema.index({ userId: 1 });
itemSchema.index({ userId: 1, tags: 1 });
itemSchema.index({ userId: 1, status: 1 });

const itemModel = mongoose.model("Item", itemSchema);
export default itemModel;