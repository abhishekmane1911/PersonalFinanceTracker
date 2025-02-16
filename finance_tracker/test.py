import jwt  # Import the PyJWT library

# Store only one token in the variable
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0MDI1NDg2NywiaWF0IjoxNzM5NjUwMDY3LCJqdGkiOiI3MmY3MzY4NDEwMmU0NzJjYjZhZWM1MjQ5NzE2MDNhYSIsInVzZXJfaWQiOjF9.W4ANYLlBlADhbLJhA5cd7W4_OhI_v9SZ-GhxNlFL4wA"

# Decode JWT without verifying the signature
decoded = jwt.decode(token, options={"verify_signature": False})

print(decoded)