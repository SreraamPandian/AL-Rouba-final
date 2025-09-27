import { faker } from '@faker-js/faker';

export const mockBudgetsData = Array.from({ length: 25 }, (_, index) => {
  const budgetValue = faker.number.float({ min: 10, max: 200, fractionDigits: 3 });
  const status = faker.helpers.arrayElement(['Pending', 'Approved', 'Rejected', 'Won']);
  const quoteSentStatus = faker.helpers.arrayElement(['YES', 'NO']);
  return {
    budgetId: `PUR/3/${String(index + 1).padStart(4, '0')}`,
    employee: faker.helpers.arrayElement(['Lakshmi Kanth Pitchandi', 'John Anderson', 'Sarah Johnson', 'Mike Wilson']),
    enquiryId: `PCENQ${faker.number.int({ min: 2500000, max: 2500100 })}`,
    customer: faker.company.name(),
    status: status,
    budgetDate: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
    budgetValue: budgetValue,
    quoteSentDate: quoteSentStatus === 'YES' ? faker.date.recent({ days: 30 }).toISOString().split('T')[0] : null,
    closureDate: faker.date.recent({ days: 15 }).toISOString().split('T')[0],
    quoteSentStatus: quoteSentStatus,

    // Detailed fields for view/edit pages
    branch: faker.helpers.arrayElement(['DSS Oman', 'DSS Dubai', 'DSS Kuwait', 'DSS Qatar', 'DSS Bahrain']),
    billingAddress: faker.location.streetAddress(true),
    dispatchAddress: faker.location.streetAddress(true),

    // Budget details structure
    budgetDetails: {
      paymentDays: faker.helpers.arrayElement(['15 Days', '30 Days', '45 Days', '60 Days', '90 Days', '120 Days']),
      taxType: faker.helpers.arrayElement(['VAT 5%', 'VAT 10%', 'VAT 15%', 'GST 5%', 'GST 12%', 'GST 18%', 'No Tax']),
      deliveryDays: faker.helpers.arrayElement(['7 Days', '14 Days', '21 Days', '30 Days', '45 Days', '60 Days', '90 Days']),
      licensesOffering: faker.helpers.arrayElement(['Standard', 'Premium', 'Enterprise', 'Professional', 'Basic', 'Custom']),
      paymentTerm: faker.helpers.arrayElement(['Advance', 'Credit', 'COD', 'L/C', 'Net Banking', 'Cheque']),
      currency: faker.helpers.arrayElement(['OMR', 'USD', 'AED', 'EUR', 'GBP']),
      shipping: faker.helpers.arrayElement(['FOB', 'CIF', 'CFR', 'EXW', 'DDP', 'DDU', 'FAS']),
      notes: 'Standard Terms and Conditions Apply.',
      products: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        qty: faker.number.int({ min: 5, max: 50 }),
        unit: 'Pieces',
        unitPrice: Number(faker.commerce.price()),
        buyingTax: 5,
        margin: 20,
        sellingTax: 5,
      })),
      freightCharges: {
        landFreight: faker.number.float({ min: 10, max: 100 }),
        airFreight: 0,
        seaFreight: 0
      },
      discount: faker.number.int({ min: 0, max: 10 }),
      vat: 5,
    },

    // Legacy fields for backward compatibility (will be moved to budgetDetails gradually)
    paymentDays: faker.helpers.arrayElement(['15 Days', '30 Days', '45 Days', '60 Days']),
    taxType: 'VAT 5%',
    deliveryDays: '14 Days',
    licensesOffering: 'Standard',
    paymentTerm: 'Advance',
    currency: 'OMR',
    shipping: 'FOB',
    notes: 'Standard Terms and Conditions Apply.',
    products: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      qty: faker.number.int({ min: 5, max: 50 }),
      unit: 'Pieces',
      unitPrice: Number(faker.commerce.price()),
      buyingTax: 5,
      margin: 20,
      sellingTax: 5,
    })),
    freightCharges: {
      landFreight: faker.number.float({ min: 10, max: 100 }),
      airFreight: 0,
      seaFreight: 0
    },
    discount: faker.number.int({ min: 0, max: 10 }),
    vat: 5,
  };
});

// Add some sample revisions to demonstrate the functionality
mockBudgetsData.push({
  budgetId: 'PUR/3/0001/r1',
  employee: 'Lakshmi Kanth Pitchandi',
  enquiryId: 'PCENQ2500001',
  customer: 'ISAG Consulting Engineers LLC',
  status: 'Pending',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 150.500,
  quoteSentDate: null,
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'NO',
  branch: 'DSS Oman',
  billingAddress: '123 Business District, Muscat',
  dispatchAddress: '123 Business District, Muscat',
  paymentDays: '30 Days',
  taxType: 'VAT 5%',
  deliveryDays: '14 Days',
  licensesOffering: 'Standard',
  paymentTerm: 'Advance',
  currency: 'OMR',
  shipping: 'FOB',
  notes: 'Revised terms and conditions.',
  products: [{
    id: faker.string.uuid(),
    name: 'Revised Product',
    description: 'Updated product specification',
    qty: 10,
    unit: 'Pieces',
    unitPrice: 15.05,
    buyingTax: 5,
    margin: 20,
    sellingTax: 5,
  }],
  freightCharges: {
    landFreight: 50.0,
    airFreight: 0,
    seaFreight: 0
  },
  discount: 5,
  vat: 5,
});

mockBudgetsData.push({
  budgetId: 'PUR/3/0002/r1',
  employee: 'Sarah Johnson',
  enquiryId: 'PCENQ2500002',
  customer: 'Tech Solutions Inc.',
  status: 'Approved',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 89.750,
  quoteSentDate: new Date().toISOString().split('T')[0],
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'YES',
  branch: 'DSS Dubai',
  billingAddress: '456 Tech Park, Dubai',
  dispatchAddress: '456 Tech Park, Dubai',
  paymentDays: '15 Days',
  taxType: 'VAT 5%',
  deliveryDays: '14 Days',
  licensesOffering: 'Standard',
  paymentTerm: 'Advance',
  currency: 'OMR',
  shipping: 'FOB',
  notes: 'First revision - approved.',
  products: [{
    id: faker.string.uuid(),
    name: 'Tech Component',
    description: 'Revised technical specifications',
    qty: 25,
    unit: 'Pieces',
    unitPrice: 3.59,
    buyingTax: 5,
    margin: 20,
    sellingTax: 5,
  }],
  freightCharges: {
    landFreight: 25.0,
    airFreight: 0,
    seaFreight: 0
  },
  discount: 2,
  vat: 5,
});

// Add more dummy revisions for testing
mockBudgetsData.push({
  budgetId: 'PUR/3/0003/r1',
  employee: 'Mike Wilson',
  enquiryId: 'PCENQ2500003',
  customer: 'Global Manufacturing Co.',
  status: 'Pending',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 225.750,
  quoteSentDate: null,
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'NO',
  branch: 'DSS Kuwait',
  billingAddress: '789 Industrial Zone, Kuwait',
  dispatchAddress: '789 Industrial Zone, Kuwait',
  paymentDays: '45 Days',
  taxType: 'VAT 5%',
  deliveryDays: '14 Days',
  licensesOffering: 'Standard',
  paymentTerm: 'Advance',
  currency: 'OMR',
  shipping: 'FOB',
  notes: 'First revision - pending approval.',
  products: [{
    id: faker.string.uuid(),
    name: 'Industrial Equipment',
    description: 'Heavy machinery revision',
    qty: 8,
    unit: 'Sets',
    unitPrice: 28.22,
    buyingTax: 5,
    margin: 20,
    sellingTax: 5,
  }],
  freightCharges: {
    landFreight: 75.0,
    airFreight: 0,
    seaFreight: 0
  },
  discount: 3,
  vat: 5,
});

mockBudgetsData.push({
  budgetId: 'PUR/3/0001/r2',
  employee: 'Lakshmi Kanth Pitchandi',
  enquiryId: 'PCENQ2500001',
  customer: 'ISAG Consulting Engineers LLC',
  status: 'Rejected',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 165.250,
  quoteSentDate: null,
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'NO',
  branch: 'DSS Oman',
  billingAddress: '123 Business District, Muscat',
  dispatchAddress: '123 Business District, Muscat',
  paymentDays: '30 Days',
  taxType: 'VAT 5%',
  deliveryDays: '14 Days',
  licensesOffering: 'Standard',
  paymentTerm: 'Advance',
  currency: 'OMR',
  shipping: 'FOB',
  notes: 'Second revision - rejected.',
  products: [{
    id: faker.string.uuid(),
    name: 'Revised Product V2',
    description: 'Updated product specification v2',
    qty: 12,
    unit: 'Pieces',
    unitPrice: 13.77,
    buyingTax: 5,
    margin: 20,
    sellingTax: 5,
  }],
  freightCharges: {
    landFreight: 55.0,
    airFreight: 0,
    seaFreight: 0
  },
  discount: 4,
  vat: 5,
});

mockBudgetsData.push({
  budgetId: 'PUR/3/0004/r1',
  employee: 'John Anderson',
  enquiryId: 'PCENQ2500004',
  customer: 'Emirates Trading LLC',
  status: 'Approved',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 198.500,
  quoteSentDate: new Date().toISOString().split('T')[0],
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'YES',
  branch: 'DSS Dubai',
  billingAddress: '321 Trade Center, Dubai',
  dispatchAddress: '321 Trade Center, Dubai',
  paymentDays: '30 Days',
  taxType: 'VAT 5%',
  deliveryDays: '14 Days',
  licensesOffering: 'Standard',
  paymentTerm: 'Advance',
  currency: 'OMR',
  shipping: 'FOB',
  notes: 'First revision - approved and quote sent.',
  products: [{
    id: faker.string.uuid(),
    name: 'Trading Materials',
    description: 'Revised trading specifications',
    qty: 20,
    unit: 'Boxes',
    unitPrice: 9.93,
    buyingTax: 5,
    margin: 20,
    sellingTax: 5,
  }],
  freightCharges: {
    landFreight: 40.0,
    airFreight: 0,
    seaFreight: 0
  },
  discount: 2,
  vat: 5,
});

mockBudgetsData.push({
  budgetId: 'PUR/3/0005/r1',
  employee: 'Sarah Johnson',
  enquiryId: 'PCENQ2500005',
  customer: 'Qatar Logistics Co.',
  status: 'Pending',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 134.800,
  quoteSentDate: null,
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'NO',
  branch: 'DSS Qatar',
  billingAddress: '555 Logistics Park, Doha',
  dispatchAddress: '555 Logistics Park, Doha',
  paymentDays: '60 Days',
  taxType: 'VAT 5%',
  deliveryDays: '14 Days',
  licensesOffering: 'Standard',
  paymentTerm: 'Advance',
  currency: 'OMR',
  shipping: 'FOB',
  notes: 'First revision - awaiting manager approval.',
  products: [{
    id: faker.string.uuid(),
    name: 'Logistics Equipment',
    description: 'Revised logistics specifications',
    qty: 15,
    unit: 'Units',
    unitPrice: 8.99,
    buyingTax: 5,
    margin: 20,
    sellingTax: 5,
  }],
  freightCharges: {
    landFreight: 30.0,
    airFreight: 0,
    seaFreight: 0
  },
  discount: 1,
  vat: 5,
});

mockBudgetsData.push({
  budgetId: 'PUR/3/0003/r2',
  employee: 'Mike Wilson',
  enquiryId: 'PCENQ2500003',
  customer: 'Global Manufacturing Co.',
  status: 'Won',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 245.000,
  quoteSentDate: new Date().toISOString().split('T')[0],
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'YES',
  branch: 'DSS Kuwait',
  billingAddress: '789 Industrial Zone, Kuwait',
  dispatchAddress: '789 Industrial Zone, Kuwait',
  paymentDays: '45 Days',
  taxType: 'VAT 5%',
  deliveryDays: '14 Days',
  licensesOffering: 'Standard',
  paymentTerm: 'Advance',
  currency: 'OMR',
  shipping: 'FOB',
  notes: 'Second revision - won the deal!',
  products: [{
    id: faker.string.uuid(),
    name: 'Industrial Equipment Pro',
    description: 'Final revised specifications - premium',
    qty: 10,
    unit: 'Sets',
    unitPrice: 24.50,
    buyingTax: 5,
    margin: 20,
    sellingTax: 5,
  }],
  freightCharges: {
    landFreight: 85.0,
    airFreight: 0,
    seaFreight: 0
  },
  discount: 5,
  vat: 5,
});

// Additional revision entries for better data coverage
mockBudgetsData.push({
  budgetId: 'PUR/3/0004/r1',
  employee: 'John Anderson',
  enquiryId: 'PCENQ2500004',
  customer: 'Advanced Systems LLC',
  status: 'Approved',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 134.250,
  quoteSentDate: new Date().toISOString().split('T')[0],
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'YES',
  branch: 'DSS Qatar',
  billingAddress: '321 Business Bay, Doha',
  dispatchAddress: '321 Business Bay, Doha',
  budgetDetails: {
    paymentDays: '30 Days',
    taxType: 'VAT 5%',
    deliveryDays: '21 Days',
    licensesOffering: 'Premium',
    paymentTerm: 'Credit',
    currency: 'OMR',
    shipping: 'CIF',
    notes: 'First revision - premium package upgrade.',
    products: [{
      id: faker.string.uuid(),
      name: 'Advanced Control System',
      description: 'Upgraded control module with premium features',
      qty: 12,
      unit: 'Units',
      unitPrice: 11.19,
      buyingTax: 5,
      margin: 20,
      sellingTax: 5,
    }],
    freightCharges: {
      landFreight: 45.0,
      airFreight: 0,
      seaFreight: 0
    },
    discount: 3,
    vat: 5,
  }
});

mockBudgetsData.push({
  budgetId: 'PUR/3/0004/r2',
  employee: 'John Anderson',
  enquiryId: 'PCENQ2500004',
  customer: 'Advanced Systems LLC',
  status: 'Won',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 129.500,
  quoteSentDate: new Date().toISOString().split('T')[0],
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'YES',
  branch: 'DSS Qatar',
  billingAddress: '321 Business Bay, Doha',
  dispatchAddress: '321 Business Bay, Doha',
  budgetDetails: {
    paymentDays: '30 Days',
    taxType: 'VAT 5%',
    deliveryDays: '21 Days',
    licensesOffering: 'Premium',
    paymentTerm: 'Credit',
    currency: 'OMR',
    shipping: 'CIF',
    notes: 'Second revision - final negotiated terms. Deal won!',
    products: [{
      id: faker.string.uuid(),
      name: 'Advanced Control System',
      description: 'Final negotiated specifications',
      qty: 12,
      unit: 'Units',
      unitPrice: 10.79,
      buyingTax: 5,
      margin: 20,
      sellingTax: 5,
    }],
    freightCharges: {
      landFreight: 45.0,
      airFreight: 0,
      seaFreight: 0
    },
    discount: 5,
    vat: 5,
  }
});

mockBudgetsData.push({
  budgetId: 'PUR/3/0005/r1',
  employee: 'Lakshmi Kanth Pitchandi',
  enquiryId: 'PCENQ2500005',
  customer: 'Emirates Trading Co.',
  status: 'Rejected',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 78.900,
  quoteSentDate: null,
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'NO',
  branch: 'DSS Dubai',
  billingAddress: '654 Trade Center, Dubai',
  dispatchAddress: '654 Trade Center, Dubai',
  budgetDetails: {
    paymentDays: '60 Days',
    taxType: 'VAT 10%',
    deliveryDays: '30 Days',
    licensesOffering: 'Basic',
    paymentTerm: 'L/C',
    currency: 'AED',
    shipping: 'FOB',
    notes: 'First revision - pricing adjustments for competitive bid.',
    products: [{
      id: faker.string.uuid(),
      name: 'Trading Equipment',
      description: 'Standard trading tools with basic features',
      qty: 15,
      unit: 'Pieces',
      unitPrice: 5.26,
      buyingTax: 5,
      margin: 15,
      sellingTax: 5,
    }],
    freightCharges: {
      landFreight: 20.0,
      airFreight: 0,
      seaFreight: 0
    },
    discount: 8,
    vat: 5,
  }
});

mockBudgetsData.push({
  budgetId: 'PUR/3/0006/r1',
  employee: 'Sarah Johnson',
  enquiryId: 'PCENQ2500006',
  customer: 'Precision Engineering Ltd.',
  status: 'Pending',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 167.825,
  quoteSentDate: null,
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'NO',
  branch: 'DSS Bahrain',
  billingAddress: '987 Engineering Hub, Manama',
  dispatchAddress: '987 Engineering Hub, Manama',
  budgetDetails: {
    paymentDays: '45 Days',
    taxType: 'VAT 5%',
    deliveryDays: '45 Days',
    licensesOffering: 'Enterprise',
    paymentTerm: 'Advance',
    currency: 'USD',
    shipping: 'DDP',
    notes: 'First revision - enterprise features added per client request.',
    products: [{
      id: faker.string.uuid(),
      name: 'Precision Measurement Tools',
      description: 'High-precision engineering instruments',
      qty: 6,
      unit: 'Sets',
      unitPrice: 27.97,
      buyingTax: 5,
      margin: 25,
      sellingTax: 5,
    }],
    freightCharges: {
      landFreight: 65.0,
      airFreight: 0,
      seaFreight: 0
    },
    discount: 2,
    vat: 5,
  }
});

mockBudgetsData.push({
  budgetId: 'PUR/3/0006/r2',
  employee: 'Sarah Johnson',
  enquiryId: 'PCENQ2500006',
  customer: 'Precision Engineering Ltd.',
  status: 'Approved',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 159.750,
  quoteSentDate: new Date().toISOString().split('T')[0],
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'YES',
  branch: 'DSS Bahrain',
  billingAddress: '987 Engineering Hub, Manama',
  dispatchAddress: '987 Engineering Hub, Manama',
  budgetDetails: {
    paymentDays: '45 Days',
    taxType: 'VAT 5%',
    deliveryDays: '30 Days',
    licensesOffering: 'Enterprise',
    paymentTerm: 'Advance',
    currency: 'USD',
    shipping: 'DDP',
    notes: 'Second revision - delivery time optimized, approved by management.',
    products: [{
      id: faker.string.uuid(),
      name: 'Precision Measurement Tools',
      description: 'Optimized delivery schedule for faster deployment',
      qty: 6,
      unit: 'Sets',
      unitPrice: 26.63,
      buyingTax: 5,
      margin: 25,
      sellingTax: 5,
    }],
    freightCharges: {
      landFreight: 65.0,
      airFreight: 0,
      seaFreight: 0
    },
    discount: 4,
    vat: 5,
  }
});

mockBudgetsData.push({
  budgetId: 'PUR/3/0007/r1',
  employee: 'Mike Wilson',
  enquiryId: 'PCENQ2500007',
  customer: 'Industrial Solutions Group',
  status: 'Pending',
  budgetDate: new Date().toISOString().split('T')[0],
  budgetValue: 198.650,
  quoteSentDate: null,
  closureDate: new Date().toISOString().split('T')[0],
  quoteSentStatus: 'NO',
  branch: 'DSS Oman',
  billingAddress: '159 Industrial Complex, Muscat',
  dispatchAddress: '159 Industrial Complex, Muscat',
  budgetDetails: {
    paymentDays: '90 Days',
    taxType: 'GST 12%',
    deliveryDays: '60 Days',
    licensesOffering: 'Professional',
    paymentTerm: 'Net Banking',
    currency: 'EUR',
    shipping: 'CFR',
    notes: 'First revision - extended payment terms for large order.',
    products: [{
      id: faker.string.uuid(),
      name: 'Industrial Automation Suite',
      description: 'Complete automation package with professional support',
      qty: 4,
      unit: 'Systems',
      unitPrice: 49.66,
      buyingTax: 5,
      margin: 30,
      sellingTax: 5,
    }],
    freightCharges: {
      landFreight: 95.0,
      airFreight: 0,
      seaFreight: 0
    },
    discount: 6,
    vat: 5,
  }
});

export function getBudgetById(id) {
  return mockBudgetsData.find(b => b.budgetId === id);
}

export function getNextRevisionId(baseBudgetId) {
  const baseId = baseBudgetId.includes('/r') ? baseBudgetId.split('/r')[0] : baseBudgetId;
  const existingRevisions = mockBudgetsData.filter(b =>
    b.budgetId.startsWith(`${baseId}/r`) || b.budgetId === baseId
  );
  const revisionNumber = existingRevisions.length;
  return `${baseId}/r${revisionNumber + 1}`;
}

export function addBudgetRevision(originalBudget, revisionId) {
  const newBudget = {
    ...originalBudget,
    budgetId: revisionId,
    status: 'Pending', // Always start revisions as Pending
    budgetDate: new Date().toISOString().split('T')[0],
    quoteSentDate: null,
    quoteSentStatus: 'NO'
  };
  mockBudgetsData.push(newBudget);
  return newBudget;
}

export function addBudget(budgetData) {
  mockBudgetsData.push(budgetData);
  return budgetData;
}

export function updateBudget(budgetId, updatedData) {
  const index = mockBudgetsData.findIndex(b => b.budgetId === budgetId);
  if (index !== -1) {
    mockBudgetsData[index] = { ...mockBudgetsData[index], ...updatedData };
    return mockBudgetsData[index];
  }
  return null;
}