// policies/abacPolicies.js
export const feePolicies = {
  viewFeeStatus: {
    description: "Who can view fee payment status",
    rules: [
      {
        effect: "allow",
        conditions: {
          all: [
            { "user.role": ["admin", "accountant", "principle", "society"] },
            { "resource.visibility": "public" }
          ]
        }
      },
      {
        effect: "allow",
        conditions: {
          all: [
            { "user.role": "accountant" },
          ]
        }
      }
    ]
  },
  generateVoucher: {
    description: "Who can generate fee vouchers",
    rules: [
      {
        effect: "allow",
        conditions: {
          all: [
            { "user.role": "accountant" },
          ]
        }
      }
    ]
  }
  // Add more policies as needed
};