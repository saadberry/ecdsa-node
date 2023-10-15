# ecdsa-node

The following changes have been made to the project:
- Transactions are now signed
- The server verifies the signature - the transacton is allowed if it is valid, otherwise a 403 is returned
- Invalid addresses return an exception: "Address does not exist"
