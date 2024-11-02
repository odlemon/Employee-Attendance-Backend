
const loginUser = asyncHandler(async (req, res) => {
    const { email, password, location } = req.body; // location should include latitude and longitude
  
    // Define allowed coordinates (example)
    // const allowedCoordinates = [
    //   { latitude: 40.712776, longitude: -74.005974 }, // New York City
     
    // ];
  
    const allowedCoordinates = [
      { latitude: -17.829222, longitude: 31.052462 }, // Example coordinate for Harare
      { latitude: -20.141111, longitude: 28.583333 }, // Example coordinate for Bulawayo
      // Add more allowed coordinates as necessary
    ];
  
    // Step 1: Retrieve coordinates from the provided location  
    const { latitude, longitude } = location;
  
    // Log the received location
    console.log("Received Location: ", { latitude, longitude });
  
    // Step 2: Check if the user’s coordinates are allowed
    const isAllowedLocation = allowedCoordinates.some(coord => {
      return (
        Math.abs(coord.latitude - latitude) < 0.01 && // Allowable latitude difference
        Math.abs(coord.longitude - longitude) < 0.01 // Allowable longitude difference
      );
    });
  
    if (!isAllowedLocation) {
      return res.status(403).json({
        status: false,
        message: "Login restricted to specific locations only.",
      });
    }
  
    // Step 3: Continue with login if location is permitted
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid email or password." });
    }
  
    if (!user.isActive) {
      return res.status(401).json({ status: false, message: "User account has been deactivated. Contact administrator." });
    }
  
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ status: false, message: "Invalid email or password." });
    }
  
    await user.logLogin();
  
    const token = createJWT(res, user._id);
    const responseUser = { ...user.toObject(), token };
    delete responseUser.password;
  
    res.status(200).json(responseUser);
  });