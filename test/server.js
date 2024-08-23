require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const twilio = require("twilio");

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and key are required.");
}

// login function
async function loginUser(email, password) {
  if (error) {
    console.error("Error logging in:", error.message);
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
}

// Usage example
// signUpUser("warrenluo14@gmail.com", "securePassword123");
// loginUser("warrenluo14@gmail.com", "Jojoseawaa3.1415");

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

async function sendVerificationCode(phoneNumber, code) {
  try {
    const message = await twilioClient.messages.create({
      body: `hey allan u disgusting thang Your verification code is: ${code}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });
    console.log("Message sent:", message.sid);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}

async function verifyPhoneNumber(phoneNumber, code) {
  // Implement your logic to verify the code here
  // This might involve saving codes to a database and validating them
}

// Example usage
const phoneNumber = "+690120188"; // Replace with actual phone number
const verificationCode = "123456"; // Generate a random code or use your preferred method
// sendVerificationCode(phoneNumber, verificationCode);

async function uploadImage(file) {
  const { data, error } = await supabase.storage
    .from("images") // Your bucket name
    .upload(`private/${file.name}`, file);

  if (error) {
    console.error("Error uploading file:", error.message);
  } else {
    console.log("File uploaded successfully:", data);
  }
}

uploadImage(open("logo_placeholder.png"));
