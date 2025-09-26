import { faker } from '@faker-js/faker';

export const productCategories = {
    'Electronics': [
        { id: 'ELE001', name: 'Control Panel', description: 'Digital control panel with LCD display', unit: 'Units', price: 150.00 },
        { id: 'ELE002', name: 'Sensor Module', description: 'Temperature and humidity sensor', unit: 'Pieces', price: 45.50 },
        { id: 'ELE003', name: 'Power Supply Unit', description: '24V DC regulated power supply', unit: 'Units', price: 89.75 },
        { id: 'ELE004', name: 'Circuit Board', description: 'Custom PCB with microcontroller', unit: 'Pieces', price: 125.00 },
        { id: 'ELE005', name: 'LED Display', description: '7-segment LED display module', unit: 'Units', price: 35.25 },
        { id: 'ELE006', name: 'Relay Switch', description: 'Electromagnetic relay 12V', unit: 'Pieces', price: 18.50 },
        { id: 'ELE007', name: 'Motor Driver', description: 'Stepper motor driver board', unit: 'Units', price: 67.00 },
        { id: 'ELE008', name: 'Capacitor Bank', description: 'High-capacity electrolytic capacitors', unit: 'Sets', price: 95.25 }
    ],
    'Mechanical': [
        { id: 'MEC001', name: 'Gear Assembly', description: 'Precision gear mechanism', unit: 'Sets', price: 245.00 },
        { id: 'MEC002', name: 'Bearing Kit', description: 'Industrial ball bearing set', unit: 'Kits', price: 78.50 },
        { id: 'MEC003', name: 'Shaft Coupling', description: 'Flexible coupling for motor shaft', unit: 'Pieces', price: 52.75 },
        { id: 'MEC004', name: 'Pulley System', description: 'Variable speed pulley assembly', unit: 'Sets', price: 189.00 },
        { id: 'MEC005', name: 'Spring Mechanism', description: 'Heavy-duty compression springs', unit: 'Sets', price: 34.25 },
        { id: 'MEC006', name: 'Mounting Bracket', description: 'Adjustable steel mounting bracket', unit: 'Pieces', price: 28.50 },
        { id: 'MEC007', name: 'Drive Belt', description: 'Industrial rubber drive belt', unit: 'Pieces', price: 43.00 },
        { id: 'MEC008', name: 'Actuator', description: 'Linear actuator with position feedback', unit: 'Units', price: 167.75 }
    ],
    'Industrial': [
        { id: 'IND001', name: 'Conveyor System', description: 'Modular belt conveyor section', unit: 'Meters', price: 320.00 },
        { id: 'IND002', name: 'Hydraulic Pump', description: 'High-pressure hydraulic pump', unit: 'Units', price: 450.50 },
        { id: 'IND003', name: 'Air Compressor', description: 'Industrial air compressor unit', unit: 'Units', price: 680.25 },
        { id: 'IND004', name: 'Valve Assembly', description: 'Pneumatic control valve system', unit: 'Sets', price: 156.00 },
        { id: 'IND005', name: 'Filter Housing', description: 'Industrial filtration system', unit: 'Units', price: 89.75 },
        { id: 'IND006', name: 'Pressure Gauge', description: 'Digital pressure monitoring gauge', unit: 'Pieces', price: 67.50 },
        { id: 'IND007', name: 'Safety Switch', description: 'Emergency stop safety switch', unit: 'Units', price: 45.25 },
        { id: 'IND008', name: 'Heat Exchanger', description: 'Compact plate heat exchanger', unit: 'Units', price: 289.00 }
    ],
    'Tools': [
        { id: 'TOL001', name: 'Precision Wrench Set', description: 'Metric precision wrench collection', unit: 'Sets', price: 125.00 },
        { id: 'TOL002', name: 'Digital Caliper', description: 'High-accuracy digital measuring caliper', unit: 'Pieces', price: 78.50 },
        { id: 'TOL003', name: 'Torque Wrench', description: 'Adjustable torque wrench with case', unit: 'Units', price: 156.75 },
        { id: 'TOL004', name: 'Drill Bit Set', description: 'HSS drill bit set various sizes', unit: 'Sets', price: 45.25 },
        { id: 'TOL005', name: 'Multimeter', description: 'Digital multimeter with probes', unit: 'Units', price: 89.00 },
        { id: 'TOL006', name: 'Socket Set', description: 'Metric socket wrench set', unit: 'Sets', price: 67.50 },
        { id: 'TOL007', name: 'Measuring Tape', description: 'Professional measuring tape 5m', unit: 'Pieces', price: 23.75 },
        { id: 'TOL008', name: 'Level Tool', description: 'Precision bubble level tool', unit: 'Units', price: 34.25 }
    ],
    'Safety': [
        { id: 'SAF001', name: 'Safety Helmet', description: 'Industrial safety helmet with visor', unit: 'Pieces', price: 45.00 },
        { id: 'SAF002', name: 'Safety Gloves', description: 'Cut-resistant safety gloves', unit: 'Pairs', price: 18.75 },
        { id: 'SAF003', name: 'Safety Goggles', description: 'Anti-fog safety goggles', unit: 'Pieces', price: 25.50 },
        { id: 'SAF004', name: 'High-Vis Vest', description: 'Reflective high-visibility vest', unit: 'Pieces', price: 28.25 },
        { id: 'SAF005', name: 'Safety Harness', description: 'Full-body safety harness', unit: 'Units', price: 89.50 },
        { id: 'SAF006', name: 'First Aid Kit', description: 'Industrial first aid kit', unit: 'Kits', price: 67.75 },
        { id: 'SAF007', name: 'Fire Extinguisher', description: 'Portable fire extinguisher', unit: 'Units', price: 78.00 },
        { id: 'SAF008', name: 'Emergency Light', description: 'Battery backup emergency light', unit: 'Units', price: 45.25 }
    ]
};

// Function to search products by name across all categories
export function searchProducts(query, limit = 10) {
    if (!query || query.length < 1) return [];

    const results = [];
    const searchTerm = query.toLowerCase();

    Object.entries(productCategories).forEach(([category, products]) => {
        products.forEach(product => {
            if (product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)) {
                results.push({
                    ...product,
                    category
                });
            }
        });
    });

    // Sort by relevance (name matches first, then description matches)
    results.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(searchTerm);
        const bNameMatch = b.name.toLowerCase().includes(searchTerm);

        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;

        return a.name.localeCompare(b.name);
    });

    return results.slice(0, limit);
}

// Function to get products by category
export function getProductsByCategory(category) {
    return productCategories[category] || [];
}

// Function to get all categories
export function getCategories() {
    return Object.keys(productCategories);
}