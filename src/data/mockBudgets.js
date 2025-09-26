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