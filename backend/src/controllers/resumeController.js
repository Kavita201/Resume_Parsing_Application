const prisma = require("../config/db");
const fs = require("fs");
const fsPromises = require("fs/promises"); // Async operations
const axios = require("axios");
const FormData = require("form-data");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const uploadDir = "uploads";
    await fsPromises.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(
      uploadDir,
      `${Date.now()}-${req.file.originalname}`
    );
    await fsPromises.writeFile(filePath, req.file.buffer);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const flaskApiUrl = "http://127.0.0.1:5001/parse-resume";

    const response = await axios.post(flaskApiUrl, formData, {
      headers: formData.getHeaders(),
    });

    if (!response.data || !response.data.output) {
      throw new Error("Invalid response from resume parser.");
    }
    const parsedData = response.data.output;
    console.log("Parsed Resume Data:", parsedData);

    let phoneNumber = parsedData.contact_number;
    if (Array.isArray(phoneNumber)) {
      phoneNumber = phoneNumber.join(", "); // this line converts it into a single string
    }

    // Ensure `whatShiftsCanYouWork` is stored correctly
    let shifts = parsedData.whatShiftsCanYouWork || [];
    if (!Array.isArray(shifts)) {
      shifts = [shifts]; // Convert single value to an array
    }

    // Filter out invalid values
    const validShifts = shifts.filter(
      (shift) => ["MORNING", "MID", "NIGHT"].includes(shift) // This line filters the shifts array to only include valid shifts.
    );

    let user = await prisma.user.findUnique({
      where: { email: parsedData.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          firstName: parsedData.name?.split(" ")[0] || "",
          lastName: parsedData.name?.split(" ")[1] || "",
          email: parsedData.email || `unknown-${uuidv4()}@example.com`,
          phoneNumber: phoneNumber || null,
          howSoonCanYouStart: new Date().toISOString(),
          whatShiftsCanYouWork: validShifts.length ? validShifts : ["MORNING"],
        },
      });
    }

    // Remove education database insertion, just send parsed data to frontend
    res.status(200).json({
      message: "Resume uploaded and parsed successfully",
      parsedData,
      user,
    });

    if (fs.existsSync(filePath)) {
      await fsPromises.unlink(filePath);
    }
  } catch (error) {
    console.error(" Error uploading and parsing resume:", error);

    if (typeof filePath !== "undefined" && fs.existsSync(filePath)) {
      try {
        await fsPromises.unlink(filePath);
      } catch (unlinkError) {
        console.error(" Failed to delete temporary file:", unlinkError);
      }
    }

    res
      .status(500)
      .json({ error: "Failed to process resume", details: error.message });
  }
};
