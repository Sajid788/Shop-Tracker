// controllers/phoneController.js
import Phone from "../model/mobile.model.js";

export const addPhone = async (req, res) => {
  try {
    const {
      companyName,
      modelName,
      purchaseRate,
      sellingRate,
      quantity,
    } = req.body;

    // Validation
    if (
      !companyName ||
      !modelName ||
      purchaseRate === undefined ||
      sellingRate === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const normalizedCompany = String(companyName).trim();
    const normalizedModel = String(modelName).trim();
    const pr = Number(purchaseRate);
    const sr = Number(sellingRate);
    const qty = Number(quantity);

    if (!normalizedCompany) {
      return res.status(400).json({ success: false, message: "Company name required" });
    }
    if (!normalizedModel) {
      return res.status(400).json({ success: false, message: "Model name required" });
    }
    if (!Number.isFinite(pr) || pr <= 0) {
      return res.status(400).json({ success: false, message: "Valid purchase rate required" });
    }
    if (!Number.isFinite(sr) || sr <= 0) {
      return res.status(400).json({ success: false, message: "Valid selling rate required" });
    }
    if (!Number.isFinite(qty) || qty < 0) {
      return res.status(400).json({ success: false, message: "Valid quantity required" });
    }

    // Check duplicate
    const existingPhone = await Phone.findOne({
      companyName: normalizedCompany,
      modelName: normalizedModel,
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Model already exists for this company",
      });
    }

    // Create phone
    const phone = await Phone.create({
      companyName: normalizedCompany,
      modelName: normalizedModel,
      purchaseRate: pr,
      sellingRate: sr,
      quantity: qty,
    });

    return res.status(201).json({
      success: true,
      message: "Phone added successfully",
      data: phone,
    });
  } catch (error) {
    console.error("Add Phone Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Phones with optional filters (companyName, search)
export const getPhones = async (req, res) => {
  try {
    const { companyName, search, page = 1, limit = 6 } = req.query;

    let filter = {};

    // Company filter
    if (companyName && companyName !== "all") {
      filter.companyName = String(companyName).trim();
    }

    // Search
    if (search) {
      filter.$or = [
        { modelName: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination logic
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Total count
    const total = await Phone.countDocuments(filter);

    // Fetch data
    const phones = await Phone.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      total, 
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      count: phones.length,
      data: phones,
    });
  } catch (error) {
    console.error("Get Phones Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/** Company counts + total for sidebar / hero (unfiltered inventory) */
export const getPhonesMeta = async (req, res) => {
  try {
    const byCompanyAgg = await Phone.aggregate([
      { $match: {} },
      { $group: { _id: "$companyName", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    const byCompany = byCompanyAgg.map((g) => ({
      companyName: g._id,
      count: g.count,
    }));
    const total = byCompany.reduce((s, b) => s + b.count, 0);

    res.status(200).json({
      success: true,
      total,
      byCompany,
    });
  } catch (error) {
    console.error("Get Phones Meta Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deletePhone = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Phone.findByIdAndDelete(id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Phone not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Phone deleted successfully",
      data: removed,
    });
  } catch (error) {
    console.error("Delete Phone Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updatePhoneQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ success: false, message: "Quantity required" });
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 0 || !Number.isInteger(qty)) {
      return res.status(400).json({ success: false, message: "Valid quantity required" });
    }

    const updated = await Phone.findByIdAndUpdate(
      id,
      { $set: { quantity: qty } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Phone not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Quantity updated",
      data: updated,
    });
  } catch (error) {
    console.error("Update Quantity Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};