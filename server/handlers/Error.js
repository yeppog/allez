const jwt = require("jsonwebtoken");

function handleConfirmError(res, err) {
  if (err instanceof jwt.TokenExpiredError) {
    res.status(403).json({ message: "Token has expired" });
  } else if (err instanceof jwt.JsonWebTokenError) {
    res.status(403).json({ message: "Invalid JWT" });
  } else if (err.message === " Account already activated") {
    res.status(404).json({ message: "Error", err: err.message });
  } else {
    res.status(500).json(err.message);
  }
}

function handleJWTError(res, err) {
  if (err instanceof jwt.TokenExpiredError) {
    res.status(403).json({ message: "Token has expired" });
  } else if (err instanceof jwt.JsonWebTokenError) {
    res.status(403).json({ message: "Invalid JWT" });
  } else {
    res.status(500).json(err.message);
  }
}

module.exports = {
  handleConfirmError: handleConfirmError,
  handleJWTError: handleJWTError,
};
